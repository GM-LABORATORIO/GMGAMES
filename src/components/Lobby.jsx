import React, { useState, useEffect } from "react";
import { createRoomProvider, joinRoomProvider } from "../utils/realtimeProvider";
import { generateAvailableNumbers } from "../utils/bingoLogic";
import PlayerJourney from "./PlayerJourney";
import { Users, Play, LogIn, Tv, Gamepad2, ShieldCheck, TestTube } from "lucide-react";

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

  /**
   * Crear Sala Host TV (El TV es un Bot Transmisor, NO consume cupo de jugador)
   */
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
        players: {} // La sala nace sin jugadores; el TV es un Bot Transmisor
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
    <div className="min-h-screen bg-[#090514] text-white font-syne p-8 md:p-12 flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Background visual asset Cyber Casino */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center" style={{ backgroundImage: "url('/tv_casino_bg.png')" }} />

      <div className="max-w-7xl w-full mx-auto relative z-10 space-y-8">
        
        {/* Portada Gigante: JUNTOS JUGAMOS // BINGO MULTIJUGADOR */}
        <header className="flex flex-wrap justify-between items-center border-b-4 border-[#ffcc00] pb-6 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#ffcc00] text-black font-black px-3 py-1 text-xs tracking-widest border border-black mb-3 uppercase">
              <Gamepad2 size={16} /> JUNTOS JUGAMOS // BINGO FAMILIAR
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-[4px_4px_0px_#000]">
              EL BINGO DE LA <br />
              <span className="text-[#ffcc00]">FAMILIA LOAIZA SILLE</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                className="bg-[#101726] border-2 border-white hover:border-[#ffcc00] px-4 py-2 text-xs font-black text-white uppercase tracking-wider brutal-shadow-yellow"
              >
                🎮 CATÁLOGOS JUNTOS JUGAMOS
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="bg-[#ff0055] text-white font-black text-sm p-4 border-2 border-black max-w-2xl mx-auto uppercase tracking-wider text-center animate-bounce">
            {error}
          </div>
        )}

        {/* Widescreen 2-Column TV Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Columna 1: CREAR SALA (TV BOT LOCUTOR AUTOMÁTICO) */}
          <div className="arcade-card-glass p-8 border-4 border-[#ff007f] arcade-glow-magenta flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-4">
                <h3 className="text-2xl font-black text-[#ff007f] uppercase flex items-center gap-3">
                  <Tv size={28} /> CREAR SALA (TV BOT AUTOMÁTICO)
                </h3>
                <span className="bg-[#ff007f] text-white font-black text-xs px-3 py-1 uppercase border border-white">
                  MODO TRANSMISIÓN
                </span>
              </div>

              <p className="text-sm text-slate-300 font-bold mb-6">
                El TV actúa como un <span className="text-[#00f3ff]">Bot Locutor Automático</span> con voz latina y temporizador de balotas. <span className="text-[#ffb700]">Tú y toda la familia escanean el QR para jugar.</span>
              </p>

              <div>
                <label className="block text-xs font-black text-[#00f3ff] uppercase tracking-wider mb-2">
                  SELECCIONA NÚMERO DE JUGADORES ESPERADOS:
                </label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full bg-[#090514] text-[#ffb700] font-black border-2 border-[#00f3ff] px-4 py-3 text-base uppercase focus:outline-none"
                >
                  <option value={1}>🧪 1 JUGADOR (MODO PRUEBAS SOLO)</option>
                  <option value={2}>2 JUGADORES (DUELO FAMILIAR)</option>
                  <option value={4}>4 JUGADORES (ESTÁNDAR)</option>
                  <option value={6}>6 JUGADORES (MEDIO)</option>
                  <option value={8}>8 JUGADORES (GRANDE)</option>
                  <option value={10}>10 JUGADORES (GRAN FAMILIA MÁXIMO)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff007f] to-[#a855f7] hover:opacity-90 text-white font-black text-2xl py-5 border-4 border-black uppercase tracking-wider arcade-glow-magenta active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Play size={24} fill="currentColor" /> {loading ? "CREANDO SALA..." : "INICIAR TV BOT Y CÓDIGO QR"}
            </button>
          </div>

          {/* Columna 2: UNIRSE A SALA (MÓVIL JUGADOR) */}
          <div className="arcade-card-glass p-8 border-4 border-[#00f3ff] arcade-glow-cyan flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-4">
                <h3 className="text-2xl font-black text-[#00f3ff] uppercase flex items-center gap-3">
                  <LogIn size={28} /> UNIRSE A LA SALA (MÓVIL)
                </h3>
                <span className="bg-[#00f3ff] text-black font-black text-xs px-3 py-1 uppercase border border-black">
                  PLAYER JOURNEY (4 PASOS)
                </span>
              </div>

              <p className="text-sm text-slate-300 font-bold mb-4">
                Escanea el QR de la TV desde tu celular o ingresa el código para elegir tu color neón y tu tabla del 1 al 10.
              </p>

              <div>
                <label className="block text-xs font-black text-[#ff007f] uppercase tracking-wider mb-2">
                  CÓDIGO DE SALA EN LA TV:
                </label>
                <input
                  type="text"
                  className="w-full bg-[#090514] border-2 border-[#ff007f] text-[#ffb700] font-black px-4 py-3 text-lg uppercase tracking-widest focus:outline-none focus:border-[#00f3ff]"
                  placeholder="CÓDIGO EJ: BINGO-9284"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => setShowPlayerJourney(true)}
              className="w-full bg-gradient-to-r from-[#00f3ff] to-[#00ff88] hover:opacity-90 text-black font-black text-2xl py-5 border-4 border-black uppercase tracking-wider arcade-glow-cyan active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <LogIn size={24} /> ENTRAR COMO JUGADOR (MÓVIL)
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t-2 border-slate-800 pt-4 flex flex-wrap justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest gap-4">
          <span className="flex items-center gap-2 text-[#00f3ff]">
            <ShieldCheck size={16} /> EL BINGO DE LA FAMILIA LOAIZA SILLE // TV BOT AUTOMÁTICO
          </span>
          <span className="flex items-center gap-1 text-[#ffb700]">
            <TestTube size={14} /> MODO 1 JUGADOR DE PRUEBAS DISPONIBLE
          </span>
        </footer>
      </div>
    </div>
  );
}
