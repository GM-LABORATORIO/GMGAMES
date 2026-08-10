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
import { Tv, Smartphone, ArrowLeft, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

export default function GameRoom({ session, onLeaveRoom }) {
  const { roomId, playerId, isHost, playerName } = session;
  const [roomData, setRoomData] = useState(null);
  const [connectionMode, setConnectionMode] = useState("local");
  const [viewMode, setViewMode] = useState(isHost ? "tv" : "mobile");
  const [claimMessage, setClaimMessage] = useState(null);

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
      <div className="min-h-screen bg-[#090514] text-white flex flex-col items-center justify-center p-6 font-syne">
        <div className="text-2xl font-black text-[#00f3ff] animate-pulse">
          CONECTANDO A SALA {roomId}...
        </div>
        <p className="text-slate-400 text-sm mt-2">Sincronizando estado del juego</p>
      </div>
    );
  }

  const myPlayer = roomData.players ? roomData.players[playerId] : null;
  const drawnBalls = roomData.drawnBalls || [];
  const availableNumbers = roomData.availableNumbers || [];

  const handleStartGame = async () => {
    if (!isHost || availableNumbers.length === 0) return;

    const { ball, remaining } = drawRandomBall(availableNumbers);
    if (!ball) return;

    const updatedDrawn = [Number(ball)];

    await updateRoomProvider(roomId, {
      currentBall: Number(ball),
      drawnBalls: updatedDrawn,
      availableNumbers: remaining,
      status: "playing"
    });
  };

  const handleDrawNextBall = async () => {
    if (!isHost || availableNumbers.length === 0) return;

    const { ball, remaining } = drawRandomBall(availableNumbers);
    if (!ball) return;

    const updatedDrawn = [...drawnBalls, Number(ball)];

    await updateRoomProvider(roomId, {
      currentBall: Number(ball),
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
   * Sincronización Móvil -> Firebase (con parseo estricto a Number)
   */
  const handleToggleCell = async (rIdx, cIdx) => {
    if (!myPlayer || !myPlayer.card) return;

    const updatedCard = JSON.parse(JSON.stringify(myPlayer.card));
    const targetCell = updatedCard[rIdx][cIdx];

    if (targetCell.val === "FREE") return;

    // Normalizar a número estricto
    const targetNumber = Number(targetCell.val);
    const drawnNumbersSet = new Set((drawnBalls || []).map((b) => Number(b)));

    // Verificación estricta en Firebase/Local
    if (!drawnNumbersSet.has(targetNumber)) {
      setClaimMessage(`⚠️ ¡EL NÚMERO ${targetNumber} AÚN NO HA SIDO CANTADO POR EL HOST!`);
      setTimeout(() => setClaimMessage(null), 2500);
      return;
    }

    // Alternar marcado
    targetCell.marked = !targetCell.marked;

    // Extraer arreglo de números confirmados en la tabla del jugador como números
    const confirmedNumbers = [];
    updatedCard.forEach((row) => {
      row.forEach((cell) => {
        if (cell.marked && cell.val !== "FREE") {
          confirmedNumbers.push(Number(cell.val));
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

    const victoryMode = roomData.victoryMode || "line";
    const result = checkBingoVictory(myPlayer.card, drawnBalls, victoryMode);

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
      setClaimMessage(result.reason || "AÚN NO COMPLETAS LA COMBINACIÓN GANADORA.");
      setTimeout(() => setClaimMessage(null), 3500);
    }
  };

  const handleUpdateVictoryMode = async (newMode) => {
    if (!isHost) return;
    await updateRoomProvider(roomId, {
      victoryMode: newMode
    });
  };

  return (
    <div className="min-h-screen bg-[#090d16] font-syne text-white flex flex-col justify-between">
      {/* Barra de Control JUNTOS JUGAMOS */}
      <nav className="bg-[#101726] border-b-4 border-[#ffcc00] px-3 py-2 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onLeaveRoom}
            className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 font-bold border border-white text-xs flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={14} /> SALIR
          </button>
          <span className="text-[10px] bg-[#090d16] border border-[#ffcc00] text-[#ffcc00] font-black px-2 py-0.5 uppercase tracking-wider hidden sm:inline-block">
            {connectionMode === "firebase" ? "🟢 FIREBASE DB" : "⚡ DEMO LOCAL"}
          </span>
        </div>

        {/* Switcher de Vista */}
        <div className="flex bg-[#090d16] border-2 border-white p-0.5">
          <button
            onClick={() => setViewMode("tv")}
            className={`px-2.5 py-1 text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
              viewMode === "tv"
                ? "bg-[#ffcc00] text-black border border-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Tv size={12} /> TV Transmisión
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`px-2.5 py-1 text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
              viewMode === "mobile"
                ? "bg-white text-black border border-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone size={12} /> Mi Cartón
          </button>
        </div>
      </nav>

      {claimMessage && (
        <div className="bg-[#ffcc00] text-black font-black text-center py-2 px-3 text-xs border-b-4 border-black tracking-wider uppercase animate-bounce z-20">
          {claimMessage}
        </div>
      )}

      {/* Overlay de Ganador */}
      {roomData.winner && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#101726] border-4 border-[#ffcc00] p-6 max-w-sm w-full text-center brutal-shadow-white">
            <Trophy size={60} className="text-[#ffcc00] mx-auto mb-3" />
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">¡BINGO CANTADO!</h1>
            <h2 className="text-xl font-black text-[#ffcc00] mt-1 uppercase">
              🏆 {roomData.winner.playerName} ({roomData.winner.tableName})
            </h2>
            <p className="text-xs text-slate-200 font-bold mt-2 uppercase tracking-wide border-y-2 border-slate-700 py-2">
              {roomData.winner.bingoType}
            </p>

            {isHost && (
              <button
                onClick={handleResetGame}
                className="mt-4 w-full bg-[#ffcc00] hover:bg-yellow-300 text-black font-black py-3 border-4 border-black uppercase tracking-wider text-sm brutal-shadow-white"
              >
                REINICIAR PARTIDA
              </button>
            )}
          </div>
        </div>
      )}

      {/* Renderizado de Vistas */}
      <div className="flex-1 flex flex-col justify-center">
        {viewMode === "tv" ? (
          <HostTVView
            currentBall={roomData.currentBall}
            drawnBalls={drawnBalls}
            availableNumbers={availableNumbers}
            players={roomData.players}
            maxPlayers={roomData.maxPlayers || 1}
            status={roomData.status || "waiting"}
            victoryMode={roomData.victoryMode || "line"}
            isHost={isHost}
            onStartGame={handleStartGame}
            onDrawNextBall={handleDrawNextBall}
            onResetGame={handleResetGame}
            onUpdateVictoryMode={handleUpdateVictoryMode}
            roomId={roomId}
            groupName={roomData.groupName || "FAMILIA REUNIDA"}
          />
        ) : (
          <div className="w-full flex-1 flex flex-col justify-center p-2 sm:p-4">
            <PlayerMobileCard
              card={myPlayer ? myPlayer.card : []}
              playerName={playerName}
              tableName={myPlayer?.tableName || "Tabla #1"}
              playerColor={myPlayer?.playerColor}
              currentBall={roomData.currentBall}
              drawnBalls={drawnBalls}
              players={roomData.players}
              playerId={playerId}
              onToggleCell={handleToggleCell}
              onClaimBingo={handleClaimBingo}
            />
          </div>
        )}
      </div>
    </div>
  );
}
