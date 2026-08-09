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
  const [isSelectingTable, setIsSelectingTable] = useState(false);

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

  // Mostrar modal de selección solo si el jugador NO viene del Player Journey o no posee cartón asignado
  if (!isHost && (!myPlayer || !myPlayer.card) && isSelectingTable) {
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
   * Sincronización Móvil -> Firebase (con parseo estricto a Number para arreglar el bug de balotas como la 37)
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
    <div className="min-h-screen bg-[#090514] font-syne text-white flex flex-col">
      {/* Barra de Control de Vistas */}
      <nav className="bg-[#120a26] border-b-4 border-[#ff007f] px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeaveRoom}
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 font-bold border border-slate-600 text-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} /> SALIR
          </button>
          <span className="text-xs bg-[#090514] border border-[#00f3ff] text-[#00f3ff] font-black px-2.5 py-1 uppercase tracking-wider hidden sm:inline-block">
            {connectionMode === "firebase" ? "🟢 Firebase DB" : "⚡ Modo Demo Local"}
          </span>
        </div>

        {/* Switcher de Vista */}
        <div className="flex bg-[#090514] border-2 border-[#a855f7] p-1">
          <button
            onClick={() => setViewMode("tv")}
            className={`px-4 py-1 text-xs font-black uppercase flex items-center gap-2 transition-all ${
              viewMode === "tv"
                ? "bg-[#ff007f] text-white border border-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Tv size={14} /> TV Bot Locutor
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`px-4 py-1 text-xs font-black uppercase flex items-center gap-2 transition-all ${
              viewMode === "mobile"
                ? "bg-[#00f3ff] text-black border border-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone size={14} /> Jugar en esta Pantalla
          </button>
        </div>
      </nav>

      {claimMessage && (
        <div className="bg-[#ff0055] text-white font-black text-center py-2.5 px-4 text-xs border-b-2 border-black tracking-wider uppercase animate-bounce">
          {claimMessage}
        </div>
      )}

      {/* Overlay de Ganador */}
      {roomData.winner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="arcade-card-glass border-4 border-[#ff007f] p-8 max-w-lg w-full text-center arcade-glow-magenta">
            <Trophy size={72} className="text-[#ffb700] mx-auto mb-4" />
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">¡BINGO CANTADO!</h1>
            <h2 className="text-2xl font-black text-[#00f3ff] mt-2 uppercase">
              🏆 {roomData.winner.playerName} ({roomData.winner.tableName})
            </h2>
            <p className="text-slate-200 font-bold mt-2 uppercase tracking-wide border-y border-slate-700 py-2">
              {roomData.winner.bingoType}
            </p>

            {isHost && (
              <button
                onClick={handleResetGame}
                className="mt-6 w-full bg-[#ffb700] hover:bg-yellow-300 text-black font-black py-4 border-4 border-black uppercase tracking-wider arcade-glow-gold"
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
            victoryMode={roomData.victoryMode || "line"}
            isHost={isHost}
            onDrawNextBall={handleDrawNextBall}
            onResetGame={handleResetGame}
            onUpdateVictoryMode={handleUpdateVictoryMode}
            roomId={roomId}
          />
        ) : (
          <div className="py-6 px-4">
            <PlayerMobileCard
              card={myPlayer ? myPlayer.card : []}
              playerName={playerName}
              tableName={myPlayer?.tableName || "Tabla #1"}
              playerColor={myPlayer?.playerColor}
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
