import React, { useState, useEffect } from "react";
import { createRoomProvider, joinRoomProvider } from "../utils/realtimeProvider";
import { generateAvailableNumbers } from "../utils/bingoLogic";
import PlayerJourney from "./PlayerJourney";
import { Users, Play, LogIn, Tv, Gamepad2, ShieldCheck, TestTube, ArrowLeft } from "lucide-react";

export default function Lobby({ onJoinRoom, onBackToHub }) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(1);
  const [showPlayerJourney, setShowPlayerJourney] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    if (roomParam) {
      setRoomCode(roomParam.trim().toUpperCase());
      setShowPlayerJourney(true);
    }
  }, []);

  const generateRoomId = () => {
    return "BINGO-" + Math.floor(1000 + Math.random() * 9000);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newRoomId = generateRoomId();
      const hostBotId = "bot_host_tv";
      const initialAvailable = generateAvailableNumbers();

      const newRoomData = {
        roomId: newRoomId,
        status: "waiting",
        hostId: hostBotId,
        maxPlayers: Number(maxPlayers),
        currentBall: null,
        drawnBalls: [],
        availableNumbers: initialAvailable,
        victoryMode: "line",
        createdAt: Date.now(),
        winner: null,
        players: {}
      };

      const res = await createRoomProvider(newRoomId, newRoomData);

      onJoinRoom({
        roomId: newRoomId,
        playerId: hostBotId,
        isHost: true,
        playerName: "TV Locutor Bot",
        connectionMode: res.mode
      });
    } catch (err) {
      console.error("Error al crear sala:", err);
      setError("NO SE PUDO CREAR LA SALA.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePlayerJourney = async (journeyData) => {
    if (!roomCode.trim()) {
      setError("INGRESA EL CÓDIGO DE LA SALA.");
      setShowPlayerJourney(false);
      return;
    }

    const cleanRoomCode = roomCode.trim().toUpperCase();
    setLoading(true);
    setError("");

    try {
      const playerId = "player_" + Math.random().toString(36).substr(2, 9);

      const playerInfo = {
        id: playerId,
        name: journeyData.playerName,
        playerColor: journeyData.playerColor,
        tableId: journeyData.tableId,
        tableName: journeyData.tableName,
        card: journeyData.card,
        confirmedNumbers: [],
        isHost: false,
        isReady: true,
        joinedAt: Date.now()
      };

      const result = await joinRoomProvider(cleanRoomCode, playerInfo);

      if (!result.success) {
        setError(result.error || "NO SE PUDO UNIR A LA SALA.");
        setShowPlayerJourney(false);
        setLoading(false);
        return;
      }

      onJoinRoom({
        roomId: cleanRoomCode,
        playerId,
        isHost: false,
        playerName: journeyData.playerName,
        connectionMode: result.mode
      });
    } catch (err) {
      console.error("Error al completar el Player Journey:", err);
      setError("ERROR AL UNIRSE A LA SALA.");
      setShowPlayerJourney(false);
    } finally {
      setLoading(false);
    }
  };

  if (showPlayerJourney) {
    return (
      <PlayerJourney
        initialRoomCode={roomCode}
        onCompleteJourney={handleCompletePlayerJourney}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#06070d] text-white font-syne p-6 md:p-12 flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Background sutil cyber glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl w-full mx-auto relative z-10 space-y-8">
        
        {/* Header Elegante LA SALA */}
        <header className="flex flex-wrap justify-between items-center border-b border-white/10 pb-6 gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/lasala_logo.jpg"
              alt="LA SALA Logo"
              className="w-28 sm:w-36 h-auto object-contain drop-shadow-[0_0_20px_rgba(255,204,0,0.4)]"
            />
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-black px-3 py-1 text-xs tracking-widest uppercase rounded-full mb-1 shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                <Gamepad2 size={16} /> LA SALA // BINGO MULTIJUGADOR
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase leading-tight">
                BINGO DE LA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00f3ff] to-[#a855f7]">FAMILIA LOAIZA SILLE</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                className="glass-panel hover:border-[#00ff88] px-5 py-2.5 text-xs font-black text-white uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={16} /> CATÁLOGO LA SALA
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="bg-red-600 text-white font-black text-sm p-4 rounded-xl border border-white/20 max-w-2xl mx-auto uppercase tracking-wider text-center animate-bounce shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            {error}
          </div>
        )}

        {/* 2 Columnas de Lujo Cyber Glass */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Columna 1: CREAR SALA EN LA TV */}
          <div className="glass-panel p-8 border-2 border-[#00ff88]/40 rounded-2xl flex flex-col justify-between space-y-6 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <h3 className="text-2xl font-black text-[#00ff88] uppercase flex items-center gap-3">
                  <Tv size={28} /> TRANSMISIÓN EN LA TV
                </h3>
                <span className="bg-[#00ff88] text-black font-black text-xs px-3 py-1 uppercase rounded-full">
                  TRANSMISOR 4K
                </span>
              </div>

              <p className="text-sm text-slate-300 font-bold mb-6 uppercase">
                El TV proyecta el bombo de balotas en 4K con la voz del locutor. <span className="text-[#00ff88]">La familia escanea el QR con su celular para jugar.</span>
              </p>

              <div>
                <label className="block text-xs font-black text-[#00ff88] uppercase tracking-wider mb-2">
                  JUGADORES ESPERADOS:
                </label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full bg-[#06070d] text-[#00ff88] font-black border border-white/20 rounded-xl px-4 py-3 text-base uppercase focus:outline-none focus:border-[#00ff88]"
                >
                  <option value={1}>🧪 1 JUGADOR (MODO PRUEBAS)</option>
                  <option value={2}>2 JUGADORES (DUELO FAMILIAR)</option>
                  <option value={4}>4 JUGADORES (ESTÁNDAR)</option>
                  <option value={6}>6 JUGADORES (MEDIO)</option>
                  <option value={8}>8 JUGADORES (GRANDE)</option>
                  <option value={10}>10 JUGADORES (MÁXIMO FAMILIAR)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00ff88] to-[#00f3ff] hover:opacity-90 text-black font-black text-2xl py-5 border border-white/40 uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-3 rounded-xl shadow-[0_0_25px_rgba(0,255,136,0.4)] cursor-pointer disabled:opacity-50"
            >
              <Play size={24} fill="currentColor" /> {loading ? "CREANDO SALA..." : "INICIAR TV Y CÓDIGO QR"}
            </button>
          </div>

          {/* Columna 2: UNIRSE A LA SALA DESDE EL CELULAR */}
          <div className="glass-panel p-8 border border-white/20 rounded-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <h3 className="text-2xl font-black text-white uppercase flex items-center gap-3">
                  <LogIn size={28} /> UNIRSE DESDE CELULAR
                </h3>
                <span className="bg-white text-black font-black text-xs px-3 py-1 uppercase rounded-full">
                  4 PASOS
                </span>
              </div>

              <p className="text-sm text-slate-300 font-bold mb-4 uppercase">
                Escanea el QR de la TV o ingresa el código de sala para elegir tu tabla del 1 al 10.
              </p>

              <div>
                <label className="block text-xs font-black text-[#00f3ff] uppercase tracking-wider mb-2">
                  CÓDIGO DE SALA EN LA TV:
                </label>
                <input
                  type="text"
                  className="w-full bg-[#06070d] border border-white/20 text-[#00f3ff] font-black rounded-xl px-4 py-3 text-lg uppercase tracking-widest focus:outline-none focus:border-[#00f3ff]"
                  placeholder="EJ: BINGO-9284"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => setShowPlayerJourney(true)}
              className="w-full bg-white hover:bg-slate-200 text-black font-black text-2xl py-5 border border-black uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              <LogIn size={24} /> ENTRAR COMO JUGADOR
            </button>
          </div>
        </div>

        {/* Footer de Marca LA SALA */}
        <footer className="border-t border-white/10 pt-4 flex flex-wrap justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest gap-4">
          <span className="flex items-center gap-2 text-[#00ff88]">
            <ShieldCheck size={16} /> LA SALA // PLATAFORMA // JUEGOS // FAMILIA & AMIGOS
          </span>
          <span className="text-slate-500">
            EDICIÓN ESPECIAL FAMILIA LOAIZA SILLE
          </span>
        </footer>
      </div>
    </div>
  );
}
