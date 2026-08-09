import React, { useState, useEffect } from "react";
import { getLetterForNumber } from "../utils/bingoLogic";
import { speakBallNumber, toggleBackgroundMusic } from "../utils/audio";
import { Play, RotateCcw, Sparkles, Tv, QrCode, X, Copy, Check, Users, LayoutGrid, Volume2, Music, Gamepad2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import PlayersTVGrid from "./PlayersTVGrid";

export default function HostTVView({
  currentBall,
  drawnBalls = [],
  availableNumbers = [],
  players = {},
  maxPlayers = 4,
  status = "waiting",
  victoryMode = "line",
  isHost = true,
  onDrawNextBall,
  onResetGame,
  onUpdateVictoryMode,
  roomId = "BINGO-88"
}) {
  const drawnSet = new Set(drawnBalls);
  const currentLetter = getLetterForNumber(currentBall);

  const [autoDraw, setAutoDraw] = useState(false);
  const [speedSec, setSpeedSec] = useState(4);
  const [showLargeQR, setShowLargeQR] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [tvRightTab, setTvRightTab] = useState("board");
  const [voiceLang, setVoiceLang] = useState("es-MX");
  const [bgMusicEnabled, setBgMusicEnabled] = useState(true);

  const playersList = Object.values(players || {});
  const joinUrl = `${window.location.origin}/?room=${roomId}`;

  // Música de fondo ambiental
  useEffect(() => {
    toggleBackgroundMusic(bgMusicEnabled);
    return () => {
      toggleBackgroundMusic(false);
    };
  }, [bgMusicEnabled]);

  // Fonética de Voz Nativa Latina
  useEffect(() => {
    if (currentBall) {
      speakBallNumber(currentLetter, currentBall, voiceLang);
    }
  }, [currentBall, currentLetter, voiceLang]);

  // Auto-extracción de balotas
  useEffect(() => {
    let timer = null;
    if (autoDraw && availableNumbers.length > 0) {
      timer = setInterval(() => {
        onDrawNextBall();
      }, speedSec * 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoDraw, availableNumbers, speedSec, onDrawNextBall]);

  const copyJoinLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const columns = [
    { letter: "B", color: "#ff0055", range: [1, 15] },
    { letter: "I", color: "#ffb700", range: [16, 30] },
    { letter: "N", color: "#00f3ff", range: [31, 45] },
    { letter: "G", color: "#00ff88", range: [46, 60] },
    { letter: "O", color: "#a855f7", range: [61, 75] }
  ];

  const isRoomFull = playersList.length >= maxPlayers;

  return (
    <div className="min-h-screen bg-[#090514] text-white p-6 md:p-8 font-syne flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Background Arcade Casino */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center" style={{ backgroundImage: "url('/tv_casino_bg.png')" }} />

      {/* PANTALLA DE ESPERA CON QR GIGANTE CENTRAL */}
      {(status === "waiting" || showLargeQR) && (
        <div className="fixed inset-0 bg-[#090514]/95 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="arcade-card-glass border-4 border-[#ff007f] p-8 max-w-2xl w-full text-center arcade-glow-magenta relative animate-fadeIn">
            
            {showLargeQR && (
              <button
                onClick={() => setShowLargeQR(false)}
                className="absolute top-4 right-4 text-white hover:text-[#00f3ff]"
              >
                <X size={28} />
              </button>
            )}

            <div className="inline-flex items-center gap-2 bg-[#ff007f] text-white font-black px-4 py-1 text-xs tracking-widest border border-white mb-4 uppercase">
              <Gamepad2 size={16} /> CASINO ARCADE BINGO // TV LOBBY
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
              SALA <span className="text-[#00f3ff]">{roomId}</span>
            </h2>

            {/* Contador de Cupos */}
            <div className="bg-[#090514] border-2 border-[#00f3ff] py-2 px-6 inline-block mb-6 arcade-glow-cyan">
              <span className="text-[10px] text-[#00f3ff] font-black uppercase block">CUPO DE SALA EN TV</span>
              <span className="text-3xl font-black text-[#ffb700] font-space">
                {playersList.length} / {maxPlayers} JUGADORES
              </span>
            </div>

            {/* QR Gigante Central */}
            <div className="bg-white p-6 inline-block border-4 border-black mb-6 arcade-glow-gold">
              <QRCodeSVG value={joinUrl} size={280} level="H" />
            </div>

            <p className="text-slate-200 font-bold text-sm uppercase tracking-wider mb-6">
              ESCANEA EL CÓDIGO QR CON TU MÓVIL PARA ELEGIR TU COLOR Y TABLA
            </p>

            {/* Lista de Jugadores Conectados */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {playersList.map((p) => (
                <span
                  key={p.id}
                  style={{ backgroundColor: p.playerColor?.hex || "#ff007f", color: p.playerColor?.text || "#fff" }}
                  className="px-4 py-1.5 font-black text-xs uppercase border border-black shadow-[2px_2px_0px_0px_#ffffff]"
                >
                  {p.name} ({p.tableName || "Tabla #1"})
                </span>
              ))}
            </div>

            {isRoomFull && isHost && (
              <button
                onClick={onDrawNextBall}
                className="w-full bg-[#00ff88] text-black font-black text-2xl py-5 border-4 border-black uppercase tracking-wider arcade-glow-cyan animate-bounce"
              >
                ¡CUPO COMPLETO! EMPEZAR BINGO AHORA 🎮
              </button>
            )}
          </div>
        </div>
      )}

      {/* Banner Superior Widescreen TV */}
      <header className="flex flex-wrap justify-between items-center border-b-4 border-[#ff007f] pb-4 mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#ff007f] text-white p-2 font-black border-2 border-white flex items-center gap-2">
            <Tv size={24} />
            <span className="tracking-widest uppercase text-sm">TV TRANSMISIÓN WIDESCREEN</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
            EL BINGO DE LA <span className="text-[#00f3ff]">FAMILIA LOAIZA SILLE</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CÓDIGO DE SALA</div>
            <div className="text-3xl font-black text-[#ffb700] tracking-widest">{roomId}</div>
          </div>

          <div className="flex items-center gap-3 bg-[#120a26] border-2 border-[#00f3ff] p-2 arcade-glow-cyan">
            <div className="bg-white p-1 cursor-pointer" onClick={() => setShowLargeQR(true)}>
              <QRCodeSVG value={joinUrl} size={45} level="M" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-[#00f3ff] font-black block uppercase tracking-wider">
                {playersList.length} / {maxPlayers} JUGADORES
              </span>
              <button
                onClick={() => setShowLargeQR(true)}
                className="text-xs font-black text-white hover:underline flex items-center gap-1 mt-0.5"
              >
                <QrCode size={14} /> AGRANDAR QR
              </button>
            </div>
          </div>

          <button
            onClick={copyJoinLink}
            className="bg-[#120a26] border-2 border-slate-700 hover:border-[#ff007f] p-3 text-slate-300 hover:text-white transition-colors"
            title="Copiar Link de Sala"
          >
            {copiedLink ? <Check size={18} className="text-[#00ff88]" /> : <Copy size={18} />}
          </button>
        </div>
      </header>

      {/* Grid Principal TV 16:9 */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 relative z-10">
        
        {/* Panel Izquierdo: Última Balota Cantada */}
        <section className="lg:col-span-5 arcade-card-glass border-4 border-[#ff007f] p-8 flex flex-col justify-between arcade-glow-magenta">
          <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3">
            <span className="text-xs font-black uppercase text-slate-300 tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-[#00f3ff]" /> ÚLTIMA BALOTA CANTADA
            </span>
            {currentLetter && (
              <span className="bg-[#ff007f] text-white font-black text-sm px-3 py-1 uppercase tracking-widest border border-white">
                LETRA {currentLetter}
              </span>
            )}
          </div>

          <div className="my-auto text-center py-6">
            {currentBall ? (
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl md:text-7xl font-black text-[#00f3ff] tracking-widest mb-2 font-space">
                  {currentLetter}
                </div>
                <div className="text-[10rem] md:text-[14rem] font-black text-white leading-none tracking-tighter font-syne drop-shadow-[0_4px_16px_rgba(0,243,255,0.6)]">
                  {currentBall}
                </div>
              </div>
            ) : (
              <div className="py-20 text-slate-500 font-black text-3xl uppercase tracking-wider border-4 border-dashed border-slate-800">
                ESPERANDO BALOTA
              </div>
            )}
          </div>

          {isHost && (
            <div className="border-t-4 border-slate-800 pt-6 space-y-3">
              <button
                onClick={onDrawNextBall}
                disabled={availableNumbers.length === 0}
                className="w-full bg-gradient-to-r from-[#ff007f] to-[#ffb700] hover:opacity-90 text-white font-black text-xl py-4 border-4 border-black uppercase tracking-wider arcade-glow-magenta active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Play size={24} fill="currentColor" />
                {availableNumbers.length === 0 ? "SIN BALOTAS RESTANTES" : "SACAR SIGUIENTE BALOTA"}
              </button>

              {/* Opciones de Modo de Victoria, Voz Nativa & Música */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#090514] border border-slate-700 p-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1 flex items-center gap-1">
                    <Trophy size={12} className="text-[#ffb700]" /> REGLA DE GANADOR
                  </span>
                  <select
                    value={victoryMode}
                    onChange={(e) => onUpdateVictoryMode && onUpdateVictoryMode(e.target.value)}
                    className="w-full bg-[#120a26] text-[#ffb700] font-black border border-slate-700 text-xs px-2 py-1 uppercase focus:outline-none"
                  >
                    <option value="line">LÍNEA DE 5 (HORIZ/VERT/DIAG)</option>
                    <option value="fullhouse">CARTÓN LLENO (FULL HOUSE)</option>
                  </select>
                </div>

                <div className="bg-[#090514] border border-slate-700 p-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1 flex items-center gap-1">
                    <Volume2 size={12} /> LOCUTOR LATINO
                  </span>
                  <select
                    value={voiceLang}
                    onChange={(e) => setVoiceLang(e.target.value)}
                    className="w-full bg-[#120a26] text-[#00f3ff] font-black border border-slate-700 text-xs px-2 py-1 uppercase focus:outline-none"
                  >
                    <option value="es-MX">MÉXICO (LATINO)</option>
                    <option value="es-CO">COLOMBIA (LATINO)</option>
                    <option value="es-AR">ARGENTINA (LATINO)</option>
                    <option value="es-US">EE.UU (LATINO)</option>
                    <option value="es-ES">ESPAÑA</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#090514] border border-slate-700 p-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={autoDraw}
                    onChange={(e) => setAutoDraw(e.target.checked)}
                    className="w-4 h-4 accent-[#00f3ff]"
                  />
                  <span>AUTO-EXTRACCIÓN ({speedSec}s)</span>
                </label>
                <select
                  value={speedSec}
                  onChange={(e) => setSpeedSec(Number(e.target.value))}
                  disabled={autoDraw}
                  className="bg-[#120a26] text-[#00f3ff] font-black border border-slate-700 px-2 py-0.5 text-xs focus:outline-none"
                >
                  <option value={3}>3s</option>
                  <option value={4}>4s</option>
                  <option value={6}>6s</option>
                </select>
              </div>

              <button
                onClick={onResetGame}
                className="w-full border-2 border-red-500 text-red-400 hover:bg-red-950 font-bold py-2 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw size={14} /> REINICIAR PARTIDA
              </button>
            </div>
          )}
        </section>

        {/* Panel Derecho: Pestañas Tablero Maestro vs Mini-Cartones */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex bg-[#120a26] border-4 border-slate-800 p-1.5 arcade-glow-purple">
            <button
              onClick={() => setTvRightTab("board")}
              className={`flex-1 py-2.5 px-4 font-black text-sm uppercase flex items-center justify-center gap-2 transition-all ${
                tvRightTab === "board"
                  ? "bg-[#00f3ff] text-black border-2 border-black font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid size={18} /> TABLERO MAESTRO (1 - 75)
            </button>

            <button
              onClick={() => setTvRightTab("players")}
              className={`flex-1 py-2.5 px-4 font-black text-sm uppercase flex items-center justify-center gap-2 transition-all ${
                tvRightTab === "players"
                  ? "bg-[#ff007f] text-white border-2 border-white font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users size={18} /> MINI-CARTONES EN VIVO ({playersList.length})
            </button>
          </div>

          {tvRightTab === "board" ? (
            <div className="arcade-card-glass border-4 border-slate-800 p-6 arcade-glow-cyan flex flex-col flex-1">
              <h2 className="text-lg font-black text-[#00f3ff] uppercase tracking-widest border-b-2 border-slate-800 pb-3 mb-4">
                TABLERO MAESTRO DE NÚMEROS (1 - 75)
              </h2>

              <div className="flex-1 flex flex-col justify-between gap-3">
                {columns.map((col) => (
                  <div key={col.letter} className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: col.color, color: col.letter === "I" || col.letter === "N" || col.letter === "G" ? "#000" : "#fff" }}
                      className="w-12 h-12 font-black text-2xl flex items-center justify-center border-2 border-black shrink-0"
                    >
                      {col.letter}
                    </div>

                    <div className="grid grid-cols-15 gap-1.5 flex-1">
                      {Array.from({ length: col.range[1] - col.range[0] + 1 }, (_, i) => col.range[0] + i).map((num) => {
                        const isDrawn = drawnSet.has(num);
                        const isCurrent = num === currentBall;

                        return (
                          <div
                            key={num}
                            className={`aspect-square flex items-center justify-center font-black text-base border transition-all ${
                              isCurrent
                                ? "bg-[#ff007f] text-white border-4 border-white scale-110 shadow-[0_0_20px_#ff007f] z-10"
                                : isDrawn
                                ? "bg-[#00f3ff] text-black border-2 border-black font-extrabold"
                                : "bg-[#090514] text-slate-500 border-slate-800"
                            }`}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <PlayersTVGrid players={players} />
          )}
        </section>
      </main>
    </div>
  );
}
