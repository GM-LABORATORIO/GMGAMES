import { ref, get, set, update, onValue, child } from "firebase/database";
import { db } from "../firebase";

let activeChannel = null;

function getLocalStorageRoomKey(roomId) {
  return `bingo_room_${roomId}`;
}

function withTimeout(promise, timeoutMs = 2500) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("FIREBASE_TIMEOUT")), timeoutMs)
    )
  ]);
}

export async function createRoomProvider(roomId, newRoomData) {
  try {
    await withTimeout(set(ref(db, `rooms/${roomId}`), newRoomData), 2000);
    return { success: true, mode: "firebase" };
  } catch (err) {
    console.warn("Firebase no disponible. Usando Modo Demo Local:", err.message);
    const key = getLocalStorageRoomKey(roomId);
    localStorage.setItem(key, JSON.stringify(newRoomData));

    const channel = new BroadcastChannel(`bingo_channel_${roomId}`);
    channel.postMessage({ type: "ROOM_UPDATED", data: newRoomData });
    channel.close();

    return { success: true, mode: "local" };
  }
}

export async function joinRoomProvider(roomId, playerInfo) {
  try {
    const snapshot = await withTimeout(get(child(ref(db), `rooms/${roomId}`)), 2000);
    if (!snapshot.exists()) {
      return { success: false, error: "La sala no existe." };
    }
    const roomData = snapshot.val();
    roomData.players = roomData.players || {};
    roomData.players[playerInfo.id] = playerInfo;

    await set(ref(db, `rooms/${roomId}/players/${playerInfo.id}`), playerInfo);
    return { success: true, mode: "firebase", roomData };
  } catch (err) {
    console.warn("Usando Modo Demo Local para unirse:", err.message);
    const key = getLocalStorageRoomKey(roomId);
    const localDataRaw = localStorage.getItem(key);
    
    if (!localDataRaw) {
      return { success: false, error: "La sala local no existe o el código es incorrecto." };
    }

    const roomData = JSON.parse(localDataRaw);
    roomData.players = roomData.players || {};
    roomData.players[playerInfo.id] = playerInfo;

    localStorage.setItem(key, JSON.stringify(roomData));

    const channel = new BroadcastChannel(`bingo_channel_${roomId}`);
    channel.postMessage({ type: "ROOM_UPDATED", data: roomData });
    channel.close();

    return { success: true, mode: "local", roomData };
  }
}

export function subscribeToRoomProvider(roomId, onDataCallback) {
  let isFirebaseConnected = false;

  const roomRef = ref(db, `rooms/${roomId}`);
  const unsubFirebase = onValue(
    roomRef,
    (snapshot) => {
      if (snapshot.exists()) {
        isFirebaseConnected = true;
        onDataCallback(snapshot.val(), "firebase");
      }
    },
    (err) => {
      console.warn("Error Firebase listener, fallback a local:", err.message);
    }
  );

  const channel = new BroadcastChannel(`bingo_channel_${roomId}`);
  activeChannel = channel;

  channel.onmessage = (event) => {
    if (event.data && event.data.type === "ROOM_UPDATED") {
      onDataCallback(event.data.data, "local");
    }
  };

  setTimeout(() => {
    if (!isFirebaseConnected) {
      const localDataRaw = localStorage.getItem(getLocalStorageRoomKey(roomId));
      if (localDataRaw) {
        onDataCallback(JSON.parse(localDataRaw), "local");
      }
    }
  }, 300);

  return () => {
    if (unsubFirebase) unsubFirebase();
    if (activeChannel) {
      activeChannel.close();
      activeChannel = null;
    }
  };
}

export async function updateRoomProvider(roomId, updates) {
  const key = getLocalStorageRoomKey(roomId);
  const localDataRaw = localStorage.getItem(key);
  let localData = localDataRaw ? JSON.parse(localDataRaw) : {};

  try {
    await update(ref(db, `rooms/${roomId}`), updates);
  } catch (err) {
    console.warn("Firebase update omitido, actualizando local:", err.message);
  }

  localData = { ...localData, ...updates };
  localStorage.setItem(key, JSON.stringify(localData));

  const channel = new BroadcastChannel(`bingo_channel_${roomId}`);
  channel.postMessage({ type: "ROOM_UPDATED", data: localData });
  channel.close();
}

/**
 * Actualiza el nodo del jugador con el cartón, tableId, tableName y array confirmedNumbers
 */
export async function updatePlayerDataProvider(roomId, playerId, playerDataUpdates) {
  const key = getLocalStorageRoomKey(roomId);
  const localDataRaw = localStorage.getItem(key);
  let localData = localDataRaw ? JSON.parse(localDataRaw) : {};

  try {
    await update(ref(db, `rooms/${roomId}/players/${playerId}`), playerDataUpdates);
  } catch (err) {
    console.warn("Firebase player update omitido, actualizando local:", err.message);
  }

  if (localData.players && localData.players[playerId]) {
    localData.players[playerId] = {
      ...localData.players[playerId],
      ...playerDataUpdates
    };
    localStorage.setItem(key, JSON.stringify(localData));

    const channel = new BroadcastChannel(`bingo_channel_${roomId}`);
    channel.postMessage({ type: "ROOM_UPDATED", data: localData });
    channel.close();
  }
}
