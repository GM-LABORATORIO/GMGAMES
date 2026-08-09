import React, { useState, useEffect } from "react";
import { createRoomProvider, joinRoomProvider } from "../utils/realtimeProvider";
import { generateAvailableNumbers, generateBingoCard } from "../utils/bingoLogic";
import PlayerJourney from "./PlayerJourney";
import { Users, Sparkles, Play, LogIn, Tv, Gamepad2, ShieldCheck } from "lucide-react";

export default function Lobby({ onJoinRoom }) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isQrJoined, setIsQrJoined] = useState(false);
  const [showPlayerJourney, setShowPlayerJourney] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    if (roomParam) {
      setRoomCode(roomParam.trim().toUpperCase());
      setIsQrJoined(true);
      setShowPlayerJourney(true);
    }
  }, []);

  const generateRoomId = () => {
    return "BINGO-" + Math.floor(1000 + Math.random() * 9000);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError("POR FAVOR INGRESA TU NOMBRE DE HOST.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const newRoomId = generateRoomId();
      const playerId = "player_" + Math.random().toString(36).substr(2, 9);
      const initialCard = generateBingoCard();
      const initialAvailable = generateAvailableNumbers();

      const newRoomData = {
        roomId: newRoomId,
        status: "waiting",
        hostId: playerId,
        maxPlayers: Number(maxPlayers),
        currentBall: null,
        drawnBalls: [],
        availableNumbers: initialAvailable,
        createdAt: Date.now(),
        winner: null,
        players: {
          [playerId]: {
            id: playerId,
            name: playerName.trim(),
            isHost: true,
            joinedAt: Date.now(),
            card: initialCard,
            tableName: "Tabla #1",
            tableId: 1,
            confirmedNumbers: []
          }
        }
      };

      const res = await createRoomProvider(newRoomId, newRoomData);

      onJoinRoom({
        roomId: newRoomId,
        playerId,
        isHost: true,
        playerName: playerName.trim(),
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
        
        {/* Portada Gigante: EL BINGO DE LA FAMILIA LOAIZA SILLE */}
        <header className="flex flex-wrap justify-between items-center border-b-4 border-[#ff007f] pb-6 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#ff007f] text-white font-black px-4 py-1 text-xs tracking-widest border border-white mb-3 uppercase">
              <Gamepad2 size={16} /> EDICIÓN ESPECIAL FAMILIAR
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-[0_4px_16px_rgba(255,0,127,0.6)]">
              EL BINGO DE LA <br />
              <span className="text-[#00f3ff]">FAMILIA LOAIZA SILLE</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#120a26]/90 border-2 border-[#00f3ff] px-6 py-3 text-center arcade-glow-cyan">
              <span className="text-[10px] text-[#00f3ff] font-black uppercase tracking-widest block">TRANSMISIÓN FAMILIAR</span>
              <span className="text-xl font-black text-[#ffb700] font-space">TV 4K REALTIME</span>
            </div>
          </div>
        </header>

        {/* Input de Nombre Global */}
        <div className="arcade-card-glass p-6 border-2 border-[#a855f7] max-w-2xl mx-auto">
          <label className="block text-xs font-black text-[#00f3ff] uppercase tracking-wider mb-2 flex items-center gap-2">
            <Users size={18} /> TU NOMBRE DE INTEGRANTE DE LA FAMILIA / HOST
          </label>
          <input
            type="text"
            className="w-full bg-[#090514] border-2 border-[#a855f7] focus:border-[#00f3ff] text-white px-5 py-4 font-black text-xl focus:outline-none uppercase"
            placeholder="EJ: BRUNO LOAIZA SILLE"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={25}
          />
        </div>

        {error && (
          <div className="bg-[#ff0055] text-white font-black text-sm p-4 border-2 border-black max-w-2xl mx-auto uppercase tracking-wider text-center animate-bounce">
            {error}
          </div>
        )}

        {/* Widescreen 2-Column TV Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Columna 1: CREAR SALA (HOST TV) */}
          <div className="arcade-card-glass p-8 border-4 border-[#ff007f] arcade-glow-magenta flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-4">
                <h3 className="text-2xl font-black text-[#ff007f] uppercase flex items-center gap-3">
                  <Tv size={28} /> CREAR SALA (HOST TV)
                </h3>
                <span className="bg-[#ff007f] text-white font-black text-xs px-3 py-1 uppercase border border-white">
                  TRANSMISIÓN EN TV
                </span>
              </div>

              <p className="text-sm text-slate-300 font-bold mb-6">
                Inicia la balotera animada en la TV con locución latina, música de fondo y QR gigante para que toda la familia se una desde su celular.
              </p>

              <div>
                <label className="block text-xs font-black text-[#00f3ff] uppercase tracking-wider mb-2">
                  CUPO DE JUGADORES DE LA FAMILIA:
                </label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full bg-[#090514] text-[#ffb700] font-black border-2 border-[#00f3ff] px-4 py-3 text-base uppercase focus:outline-none"
                >
                  <option value={2}>2 INTEGRANTES (DUELO FAMILIAR)</option>
                  <option value={4}>4 INTEGRANTES (ESTÁNDAR)</option>
                  <option value={6}>6 INTEGRANTES (MEDIO)</option>
                  <option value={8}>8 INTEGRANTES (GRANDE)</option>
                  <option value={10}>10 INTEGRANTES (GRAN FAMILIA MÁXIMO)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff007f] to-[#a855f7] hover:opacity-90 text-white font-black text-2xl py-5 border-4 border-black uppercase tracking-wider arcade-glow-magenta active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Play size={24} fill="currentColor" /> {loading ? "CREANDO SALA..." : "INICIAR BINGO DE LA FAMILIA"}
            </button>
          </div>

          {/* Columna 2: UNIRSE A SALA (MÓVIL JUGADOR) */}
          <div className="arcade-card-glass p-8 border-4 border-[#00f3ff] arcade-glow-cyan flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-4">
                <h3 className="text-2xl font-black text-[#00f3ff] uppercase flex items-center gap-3">
                  <LogIn size={28} /> UNIRSE A LA SALA (CELULAR)
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
            <ShieldCheck size={16} /> EL BINGO DE LA FAMILIA LOAIZA SILLE // TV 4K REALTIME
          </span>
          <span>EDICIÓN ESPECIAL HACKATHON FAMILIAR</span>
        </footer>
      </div>
    </div>
  );
}
