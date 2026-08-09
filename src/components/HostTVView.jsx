import React, { useState, useEffect } from "react";
import { getLetterForNumber } from "../utils/bingoLogic";
import { speakBallNumber, toggleBackgroundMusic, unlockTVAudio, getAvailableSpanishVoices } from "../utils/audio";
import { Play, Pause, RotateCcw, Sparkles, Tv, QrCode, X, Copy, Check, Users, LayoutGrid, Volume2, Music, Gamepad2, Timer, Trophy, VolumeX, Zap, Mic } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import PlayersTVGrid from "./PlayersTVGrid";

export default function HostTVView({
  currentBall,
  drawnBalls = [],
  availableNumbers = [],
  players = {},
  maxPlayers = 1,
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

  const [autoDraw, setAutoDraw] = useState(true);
  const [speedSec, setSpeedSec] = useState(5);
  const [timerCountdown, setTimerCountdown] = useState(5);
  const [showLargeQR, setShowLargeQR] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [tvRightTab, setTvRightTab] = useState("board");
  const [bgMusicEnabled, setBgMusicEnabled] = useState(false);
  const [announcerSubtitle, setAnnouncerSubtitle] = useState("");
  const [isTvAudioActivated, setIsTvAudioActivated] = useState(false);
  
  // Estado para voces del navegador disponibles
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");

  const playersList = Object.values(players || {});
  const joinUrl = `${window.location.origin}/?room=${roomId}`;
  const isRoomFull = playersList.length >= maxPlayers;

  // Cargar lista de voces del navegador
  useEffect(() => {
    const loadVoices = () => {
      const voices = getAvailableSpanishVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoiceURI) {
        setSelectedVoiceURI(voices[0].voiceURI);
      }
    };

    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleActivateAudio = () => {
    unlockTVAudio();
    setIsTvAudioActivated(true);
    toggleBackgroundMusic(true);
    setBgMusicEnabled(true);
  };

  // Calcular el líder actual de la partida
  const leaderPlayer = playersList.reduce((top, p) => {
    const pCount = (p.confirmedNumbers || []).length;
    const topCount = (top?.confirmedNumbers || []).length;
    return pCount > topCount ? p : top;
  }, null);

  const leaderInfo = leaderPlayer && (leaderPlayer.confirmedNumbers || []).length > 0
    ? { name: leaderPlayer.name, hits: leaderPlayer.confirmedNumbers.length, color: leaderPlayer.playerColor }
    : null;

  // Música de fondo ambiental
  useEffect(() => {
    toggleBackgroundMusic(bgMusicEnabled);
    return () => {
      toggleBackgroundMusic(false);
    };
  }, [bgMusicEnabled]);

  // Fonética de Voz Nativa Latina con Comentarios Humorísticos y Presión al Líder
  useEffect(() => {
    if (currentBall) {
      const text = speakBallNumber(currentLetter, currentBall, voiceLang, leaderInfo);
      setAnnouncerSubtitle(text);
    } else {
      setAnnouncerSubtitle("");
    }
  }, [currentBall, currentLetter, voiceLang]);

  // Temporizador de Cuenta Regresiva Visual Animada para Auto-Extracción
  useEffect(() => {
    let interval = null;

    if (autoDraw && status === "playing" && availableNumbers.length > 0) {
      interval = setInterval(() => {
        setTimerCountdown((prev) => {
          if (prev <= 1) {
            onDrawNextBall();
            return speedSec;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimerCountdown(speedSec);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoDraw, status, availableNumbers.length, speedSec, onDrawNextBall]);

  // Reiniciar contador visual al cambiar la velocidad
  useEffect(() => {
    setTimerCountdown(speedSec);
  }, [speedSec]);

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
              <Gamepad2 size={16} /> CASINO ARCADE BINGO // TV BOT TRANSMISOR
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
              SALA <span className="text-[#00f3ff]">{roomId}</span>
            </h2>

            {/* Contador de Cupos de la Sala */}
            <div className="bg-[#090514] border-2 border-[#00f3ff] py-2 px-6 inline-block mb-6 arcade-glow-cyan">
              <span className="text-[10px] text-[#00f3ff] font-black uppercase block">JUGADORES EN LA SALA</span>
              <span className="text-3xl font-black text-[#ffb700] font-space">
                {playersList.length} / {maxPlayers} JUGADORES CONECTADOS
              </span>
            </div>

            {/* QR Gigante Central */}
            <div className="bg-white p-6 inline-block border-4 border-black mb-6 arcade-glow-gold">
              <QRCodeSVG value={joinUrl} size={280} level="H" />
            </div>

            <p className="text-slate-200 font-bold text-sm uppercase tracking-wider mb-6">
              ESCANEA EL CÓDIGO QR CON TU MÓVIL PARA ELEGIR TU COLOR Y TABLA Y EMPEZAR A JUGAR
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
                ¡LISTOS! INICIAR PARTIDA CON {playersList.length} JUGADOR(ES) 🎮
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

      {/* Banner de Desbloqueo de Audio para Smart TVs (LG webOS / Samsung Tizen / Android TV) */}
      {!isTvAudioActivated && (
        <button
          onClick={handleActivateAudio}
          className="w-full bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-lg sm:text-xl py-3 px-6 border-4 border-black uppercase tracking-wider arcade-glow-gold animate-bounce mb-6 flex items-center justify-center gap-3 cursor-pointer z-30"
        >
          <VolumeX size={24} className="animate-pulse" />
          <span>🔊 HAZ CLICK AQUÍ EN EL TV PARA ACTIVAR EL SONIDO Y LA VOZ EN VIVO</span>
        </button>
      )}

      {/* Banner de Presión al Líder Actual en la TV */}
      {leaderInfo && (
        <div className="bg-[#120a26] border-2 border-[#ffb700] p-3 mb-6 arcade-glow-gold flex flex-wrap justify-between items-center z-20 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="bg-[#ffb700] text-black font-black text-xs px-3 py-1 uppercase border border-black flex items-center gap-1 shadow-[2px_2px_0px_0px_#000]">
              👑 LÍDER DE LA PARTIDA
            </span>
            <span className="font-black text-lg text-white uppercase tracking-tight">
              {leaderInfo.name}
            </span>
          </div>
          <span className="text-xs font-black text-[#00f3ff] font-space uppercase tracking-wider bg-[#090514] border border-[#00f3ff] px-3 py-1">
            🔥 {leaderInfo.hits} ACIERTOS MARCADOS
          </span>
        </div>
      )}

      {/* Grid Principal TV 16:9 */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 relative z-10">
        
        {/* Panel Izquierdo: Última Balota Cantada & Temporizador */}
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

          {/* Temporizador de Extracción Automático */}
          <div className="bg-[#090514] border-2 border-[#00f3ff] p-3 my-4 arcade-glow-cyan text-center">
            <div className="flex items-center justify-between text-xs font-black text-[#00f3ff] uppercase mb-1">
              <span className="flex items-center gap-1">
                <Timer size={16} /> TEMPORIZADOR AUTOMÁTICO
              </span>
              <span>{autoDraw ? `SIGUIENTE EN ${timerCountdown}s` : "PAUSADO"}</span>
            </div>
            {/* Barra de progreso animada */}
            <div className="w-full bg-[#120a26] h-3 border border-slate-700 overflow-hidden">
              <div
                style={{ width: `${(timerCountdown / speedSec) * 100}%` }}
                className="bg-gradient-to-r from-[#ff007f] via-[#00f3ff] to-[#00ff88] h-full transition-all duration-1000 ease-linear"
              />
            </div>
          </div>

          <div className="my-auto text-center py-4">
            {currentBall ? (
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl md:text-7xl font-black text-[#00f3ff] tracking-widest mb-2 font-space">
                  {currentLetter}
                </div>
                <div className="text-[10rem] md:text-[14rem] font-black text-white leading-none tracking-tighter font-syne drop-shadow-[0_4px_16px_rgba(0,243,255,0.6)]">
                  {currentBall}
                </div>

                {announcerSubtitle && (
                  <div className="mt-3 bg-[#120a26] border-2 border-[#ff007f] p-2.5 text-[#ffb700] font-black text-xs uppercase tracking-wider arcade-glow-magenta animate-fadeIn flex items-center justify-center gap-2 max-w-md mx-auto">
                    <Volume2 size={16} className="text-[#00f3ff] shrink-0" />
                    <span>🎙️ LOCUTOR: "{announcerSubtitle}"</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-slate-500 font-black text-3xl uppercase tracking-wider border-4 border-dashed border-slate-800">
                ESPERANDO BALOTA
              </div>
            )}
          </div>

          {isHost && (
            <div className="border-t-4 border-slate-800 pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onDrawNextBall}
                  disabled={availableNumbers.length === 0}
                  className="bg-gradient-to-r from-[#ff007f] to-[#ffb700] hover:opacity-90 text-white font-black text-base py-3 border-2 border-black uppercase tracking-wider arcade-glow-magenta flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play size={18} fill="currentColor" /> SACAR BALOTA
                </button>

                <button
                  onClick={() => setAutoDraw(!autoDraw)}
                  className={`font-black text-base py-3 border-2 border-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    autoDraw
                      ? "bg-[#00ff88] text-black border-black shadow-[0_0_12px_#00ff88]"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {autoDraw ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  {autoDraw ? "PAUSAR AUTO" : "AUTO EXTRACCIÓN"}
                </button>
              </div>

              {/* Controles de Velocidad, Regla & Voz Nativa */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#090514] border border-slate-700 p-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">VELOCIDAD</span>
                  <select
                    value={speedSec}
                    onChange={(e) => setSpeedSec(Number(e.target.value))}
                    className="w-full bg-[#120a26] text-[#00f3ff] font-black border border-slate-700 text-xs px-1 py-1 uppercase focus:outline-none"
                  >
                    <option value={3}>3s RÁPIDO</option>
                    <option value={5}>5s NORMAL</option>
                    <option value={8}>8s LENTO</option>
                    <option value={10}>10s PAUSADO</option>
                  </select>
                </div>

                <div className="bg-[#090514] border border-slate-700 p-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">REGLA GANADOR</span>
                  <select
                    value={victoryMode}
                    onChange={(e) => onUpdateVictoryMode && onUpdateVictoryMode(e.target.value)}
                    className="w-full bg-[#120a26] text-[#ffb700] font-black border border-slate-700 text-xs px-1 py-1 uppercase focus:outline-none"
                  >
                    <option value="line">LÍNEA DE 5</option>
                    <option value="fullhouse">CARTÓN LLENO</option>
                  </select>
                </div>

                <div className="bg-[#090514] border border-slate-700 p-2 col-span-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1 flex items-center gap-1">
                    <Mic size={10} className="text-[#00f3ff]" /> VOZ EN VIVO (SELECCIÓN LIBRE)
                  </span>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full bg-[#120a26] text-[#00f3ff] font-black border border-slate-700 text-xs px-1 py-1 uppercase focus:outline-none"
                  >
                    {availableVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        🗣️ {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-[#090514] border border-slate-700 p-2 flex items-center justify-center">
                  <button
                    onClick={() => {
                      const nextState = !bgMusicEnabled;
                      setBgMusicEnabled(nextState);
                      toggleBackgroundMusic(nextState);
                    }}
                    className={`w-full h-full font-black text-[10px] py-1 px-2 border uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                      bgMusicEnabled
                        ? "bg-[#a855f7] text-white border-white shadow-[0_0_8px_#a855f7]"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <Music size={12} /> {bgMusicEnabled ? "MÚSICA ON" : "MÚSICA OFF"}
                  </button>
                </div>
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
