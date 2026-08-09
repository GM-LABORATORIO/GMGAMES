import React, { useEffect, useState } from "react";
import {
  subscribeToRoomProvider,
  updateRoomProvider,
  updatePlayerDataProvider
} from "../utils/realtimeProvider";
import {
  drawRandomBall,
  checkBingoVictory,
  generateBingoCard,
  generateAvailableNumbers
} from "../utils/bingoLogic";
import { playVictoryAudio } from "../utils/audio";
import HostTVView from "./HostTVView";
import PlayerMobileCard from "./PlayerMobileCard";
import TableSelectorModal from "./TableSelectorModal";
import { Tv, Smartphone, ArrowLeft, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

export default function GameRoom({ session, onLeaveRoom }) {
  const { roomId, playerId, isHost, playerName } = session;
  const [roomData, setRoomData] = useState(null);
  const [connectionMode, setConnectionMode] = useState("local");
  const [viewMode, setViewMode] = useState(isHost ? "tv" : "mobile");
  const [claimMessage, setClaimMessage] = useState(null);
  const [isSelectingTable, setIsSelectingTable] = useState(!isHost);

  // Escuchar la sala en tiempo real en Firebase
  useEffect(() => {
    const unsub = subscribeToRoomProvider(roomId, (data, mode) => {
      setRoomData(data);
      if (mode) setConnectionMode(mode);
    });

    return () => unsub();
  }, [roomId]);

  // Audio de celebración al haber un ganador
  useEffect(() => {
    if (roomData && roomData.status === "finished" && roomData.winner) {
      playVictoryAudio("/audio/victory.mp3");
    }
  }, [roomData?.status, roomData?.winner]);

  if (!roomData) {
    return (
      <div className="min-h-screen bg-[#040914] text-white flex flex-col items-center justify-center p-6 font-syne">
        <div className="text-2xl font-black text-[#ffe600] animate-pulse">
          CONECTANDO A SALA {roomId}...
        </div>
        <p className="text-slate-400 text-sm mt-2">Sincronizando estado del juego</p>
      </div>
    );
  }

  const myPlayer = roomData.players ? roomData.players[playerId] : null;
  const drawnBalls = roomData.drawnBalls || [];
  const availableNumbers = roomData.availableNumbers || [];

  // Pantalla de selección de Tabla #1 a #10
  if (!isHost && isSelectingTable) {
    return (
      <TableSelectorModal
        initialTableId={myPlayer?.tableId || 1}
        onSelectTable={async ({ tableId, tableName, card }) => {
          await updatePlayerDataProvider(roomId, playerId, {
            tableId,
            tableName,
            card,
            confirmedNumbers: []
          });
          setIsSelectingTable(false);
        }}
      />
    );
  }

  const handleDrawNextBall = async () => {
    if (!isHost || availableNumbers.length === 0) return;

    const { ball, remaining } = drawRandomBall(availableNumbers);
    if (!ball) return;

    const updatedDrawn = [...drawnBalls, ball];

    await updateRoomProvider(roomId, {
      currentBall: ball,
      drawnBalls: updatedDrawn,
      availableNumbers: remaining,
      status: "playing"
    });
  };

  const handleResetGame = async () => {
    if (!isHost) return;

    const resetAvailable = generateAvailableNumbers();
    const updatedPlayers = {};

    if (roomData.players) {
      Object.keys(roomData.players).forEach((pId) => {
        updatedPlayers[pId] = {
          ...roomData.players[pId],
          card: generateBingoCard(),
          confirmedNumbers: []
        };
      });
    }

    await updateRoomProvider(roomId, {
      status: "waiting",
      currentBall: null,
      drawnBalls: [],
      availableNumbers: resetAvailable,
      winner: null,
      players: updatedPlayers
    });
  };

  /**
   * Sincronización Móvil -> Firebase:
   * Al hacer clic en un número del cartón, se verifica si ya está en drawnBalls (Rooms/calledNumbers).
   * Si es así, se marca y se añade al array confirmedNumbers del jugador en Firebase.
   */
  const handleToggleCell = async (rIdx, cIdx) => {
    if (!myPlayer || !myPlayer.card) return;

    const updatedCard = JSON.parse(JSON.stringify(myPlayer.card));
    const targetCell = updatedCard[rIdx][cIdx];

    if (targetCell.val === "FREE") return;

    const targetNumber = targetCell.val;
    const drawnSet = new Set(drawnBalls);

    // Verificación en Firebase de si el número ha sido cantado en drawnBalls
    if (!drawnSet.has(targetNumber)) {
      setClaimMessage(`⚠️ ¡EL NÚMERO ${targetNumber} AÚN NO HA SIDO CANTADO POR EL HOST!`);
      setTimeout(() => setClaimMessage(null), 2500);
      return; // No se añade a confirmedNumbers si no ha sido cantado
    }

    // Alternar marcado
    targetCell.marked = !targetCell.marked;

    // Extraer arreglo de números confirmados en la tabla del jugador
    const confirmedNumbers = [];
    updatedCard.forEach((row) => {
      row.forEach((cell) => {
        if (cell.marked && typeof cell.val === "number") {
          confirmedNumbers.push(cell.val);
        }
      });
    });

    // Actualizar nodo del jugador en Firebase
    await updatePlayerDataProvider(roomId, playerId, {
      card: updatedCard,
      confirmedNumbers
    });
  };

  const handleClaimBingo = async () => {
    if (!myPlayer || !myPlayer.card) return;

    const result = checkBingoVictory(myPlayer.card, drawnBalls);

    if (result.hasBingo) {
      confetti({
        particleCount: 250,
        spread: 120,
        origin: { y: 0.5 }
      });

      const winnerInfo = {
        playerId,
        playerName: myPlayer.name,
        tableName: myPlayer.tableName || "Tabla #1",
        bingoType: result.type,
        timestamp: Date.now()
      };

      await updateRoomProvider(roomId, {
        status: "finished",
        winner: winnerInfo
      });
    } else {
      setClaimMessage("AÚN NO TIENES UNA LÍNEA O CARTÓN COMPLETO CANTADO.");
      setTimeout(() => setClaimMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#040914] font-syne text-white flex flex-col">
      {/* Barra de Control de Vistas */}
      <nav className="bg-[#081021] border-b-4 border-slate-800 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeaveRoom}
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 font-bold border border-slate-600 text-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} /> SALIR
          </button>
          <span className="text-xs bg-[#040914] border border-slate-700 text-[#ffe600] font-black px-2.5 py-1 uppercase tracking-wider hidden sm:inline-block">
            {connectionMode === "firebase" ? "🟢 Firebase DB" : "⚡ Modo Demo Local"}
          </span>
        </div>

        {/* Switcher de Vista */}
        <div className="flex bg-[#040914] border-2 border-slate-700 p-1">
          <button
            onClick={() => setViewMode("tv")}
            className={`px-4 py-1 text-xs font-black uppercase flex items-center gap-2 transition-all ${
              viewMode === "tv"
                ? "bg-[#ffe600] text-black border border-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Tv size={14} /> Vista TV (Host)
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`px-4 py-1 text-xs font-black uppercase flex items-center gap-2 transition-all ${
              viewMode === "mobile"
                ? "bg-[#ffe600] text-black border border-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone size={14} /> Vista Móvil (Jugador)
          </button>
        </div>
      </nav>

      {claimMessage && (
        <div className="bg-red-600 text-white font-black text-center py-2.5 px-4 text-xs border-b-2 border-black tracking-wider uppercase animate-bounce">
          {claimMessage}
        </div>
      )}

      {/* Overlay de Ganador */}
      {roomData.winner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-[#081021] border-4 border-[#ffe600] p-8 max-w-lg w-full text-center brutal-shadow-white">
            <Trophy size={72} className="text-[#ffe600] mx-auto mb-4" />
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">¡BINGO CANTADO!</h1>
            <h2 className="text-2xl font-black text-[#ffe600] mt-2 uppercase">
              🏆 {roomData.winner.playerName} ({roomData.winner.tableName})
            </h2>
            <p className="text-slate-300 font-bold mt-2 uppercase tracking-wide border-y border-slate-700 py-2">
              {roomData.winner.bingoType}
            </p>

            {isHost && (
              <button
                onClick={handleResetGame}
                className="mt-6 w-full bg-[#ffe600] text-black font-black py-4 border-4 border-black uppercase tracking-wider brutal-shadow-white hover:bg-yellow-300"
              >
                Reiniciar Partida
              </button>
            )}
          </div>
        </div>
      )}

      {/* Renderizado de Vistas */}
      <div className="flex-1">
        {viewMode === "tv" ? (
          <HostTVView
            currentBall={roomData.currentBall}
            drawnBalls={drawnBalls}
            availableNumbers={availableNumbers}
            players={roomData.players}
            maxPlayers={roomData.maxPlayers || 4}
            status={roomData.status || "waiting"}
            isHost={isHost}
            onDrawNextBall={handleDrawNextBall}
            onResetGame={handleResetGame}
            roomId={roomId}
          />
        ) : (
          <div className="py-6 px-4">
            <PlayerMobileCard
              card={myPlayer ? myPlayer.card : []}
              playerName={playerName}
              tableName={myPlayer?.tableName || "Tabla #1"}
              currentBall={roomData.currentBall}
              drawnBalls={drawnBalls}
              onToggleCell={handleToggleCell}
              onClaimBingo={handleClaimBingo}
            />
          </div>
        )}
      </div>
    </div>
  );
}
