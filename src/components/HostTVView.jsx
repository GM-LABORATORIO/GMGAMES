import React, { useState, useEffect, useRef } from "react";
import { getLetterForNumber } from "../utils/bingoLogic";
import { speakBallNumber, toggleBackgroundMusic, unlockTVAudio, getAvailableSpanishVoices, playPopSound } from "../utils/audio";
import { PERSONALITY_MODES } from "../utils/announcerEngine";
import { Play, Pause, Tv, QrCode, Copy, Check, Volume2, Music, VolumeX, Mic, Sparkles, Grid3X3, Users, Drama } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import BingoBallSphere from "./BingoBallSphere";
import PlayersTVGrid from "./PlayersTVGrid";
import MasterBingoBoard from "./MasterBingoBoard";

export default function HostTVView({
  status = "playing",
  currentBall = null,
  drawnBalls = [],
  availableNumbers = [],
  players = {},
  maxPlayers = 1,
  winner = null,
  victoryMode = "line",
  isHost = true,
  onStartGame,
  onDrawNextBall,
  onResetGame,
  onUpdateVictoryMode,
  roomId = "BINGO-88",
  groupName = "FAMILIA REUNIDA"
}) {
  const drawnSet = new Set(drawnBalls);
  const currentLetter = getLetterForNumber(currentBall);

  const [autoDraw, setAutoDraw] = useState(true);
  const [speedSec, setSpeedSec] = useState(6);
  const [timerCountdown, setTimerCountdown] = useState(6);
  const [showLargeQR, setShowLargeQR] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [bgMusicEnabled, setBgMusicEnabled] = useState(false);
  const [isTvAudioActivated, setIsTvAudioActivated] = useState(false);
  const [rightViewMode, setRightViewMode] = useState("board"); // "board" | "players"
  const [personalityMode, setPersonalityMode] = useState("auto");
  const [countdownOverlay, setCountdownOverlay] = useState(null);

  const triggerStartGameWithCountdown = () => {
    if (countdownOverlay !== null) return;
    playPopSound();
    setCountdownOverlay(3);

    setTimeout(() => {
      playPopSound();
      setCountdownOverlay(2);
    }, 1000);

    setTimeout(() => {
      playPopSound();
      setCountdownOverlay(1);
    }, 2000);

    setTimeout(() => {
      playPopSound();
      setCountdownOverlay("¡QUE EMPIECE EL BINGO!");
    }, 3000);

    setTimeout(() => {
      setCountdownOverlay(null);
      if (onStartGame) onStartGame();
    }, 4200);
  };

  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");

  const playersList = Object.values(players || {});
  const joinUrl = `${window.location.origin}/?room=${roomId}`;

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

  const [currentTrack, setCurrentTrack] = useState("track1");

  const handleActivateAudio = () => {
    unlockTVAudio();
    setIsTvAudioActivated(true);
    toggleBackgroundMusic(true, "track1");
    setBgMusicEnabled(true);
    setCurrentTrack("track1");
  };

  const copyJoinLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Calcular el líder actual de la partida
  const leaderPlayer = playersList.reduce((top, p) => {
    const pCount = (p.confirmedNumbers || []).length;
    const topCount = (top?.confirmedNumbers || []).length;
    return pCount > topCount ? p : top;
  }, null);

  const underdogPlayer = playersList.length > 1
    ? playersList.reduce((low, p) => {
        const pCount = (p.confirmedNumbers || []).length;
        const lowCount = (low?.confirmedNumbers || []).length;
        return pCount < lowCount ? p : low;
      }, null)
    : null;

  const leaderInfo = leaderPlayer && (leaderPlayer.confirmedNumbers || []).length > 0
    ? { name: leaderPlayer.name, hits: leaderPlayer.confirmedNumbers.length, color: leaderPlayer.playerColor }
    : null;

  const underdogInfo = underdogPlayer && leaderPlayer && underdogPlayer.id !== leaderPlayer.id
    ? { name: underdogPlayer.name, hits: (underdogPlayer.confirmedNumbers || []).length }
    : null;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const spokenBallRef = useRef(null);

  const handleDrawNextBall = () => {
    setIsSpeaking(true);
    setTimerCountdown(speedSec);
    onDrawNextBall();
  };

  useEffect(() => {
    if (currentBall && spokenBallRef.current !== currentBall) {
      spokenBallRef.current = currentBall;
      setIsSpeaking(true);
      setTimerCountdown(speedSec);
      speakBallNumber(
        currentLetter,
        currentBall,
        selectedVoiceURI,
        leaderInfo,
        underdogInfo,
        personalityMode,
        drawnBalls.length,
        () => {
          setIsSpeaking(false);
          setTimerCountdown(speedSec);
        }
      );
    } else if (!currentBall) {
      spokenBallRef.current = null;
      setIsSpeaking(false);
    }
  }, [currentBall, currentLetter, selectedVoiceURI, personalityMode, drawnBalls.length]);

  // Temporizador de Cuenta Regresiva Sincronizado por Eventos de Voz
  useEffect(() => {
    let interval = null;

    if (autoDraw && status === "playing" && availableNumbers.length > 0 && !isSpeaking) {
      interval = setInterval(() => {
        setTimerCountdown((prev) => {
          if (prev <= 1) {
            handleDrawNextBall();
            return speedSec;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Mientras el locutor esté hablando O el juego esté pausado, congelar el reloj en speedSec
      setTimerCountdown(speedSec);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoDraw, status, availableNumbers.length, speedSec, isSpeaking]);

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-8 font-syne text-white flex flex-col min-h-screen justify-between bg-[#000000] select-none">
      
      {/* Header Widescreen Cyber Glass LA SALA */}
      <header className="flex flex-wrap justify-between items-center border-b border-white/10 pb-4 mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <img
            src="/lasala_logo.jpg"
            alt="LA SALA Logo"
            className="w-24 sm:w-32 h-auto object-contain mix-blend-screen"
          />
          <div className="flex items-center gap-3">
            <div className="bg-[#00ff88] text-black p-2 font-black rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              <Tv size={22} />
              <span className="tracking-widest uppercase text-xs sm:text-sm">TRANSMISIÓN TV 4K</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase hidden sm:block">
              BINGO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00f3ff] to-[#a855f7]">{groupName}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">CÓDIGO DE SALA</div>
            <div className="text-3xl font-black text-[#00ff88] tracking-widest font-space">{roomId}</div>
          </div>

          {/* QR Compacto & Botón Agrandar */}
          <div className="flex items-center gap-3 bg-[#06070d] border border-white/20 p-2 rounded-xl">
            <div className="bg-white p-1 rounded-lg">
              <QRCodeSVG value={joinUrl} size={44} level="M" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-[#00ff88] font-black block uppercase tracking-wider">
                {playersList.length} / {maxPlayers} JUGADORES
              </span>
              <button
                onClick={() => setShowLargeQR(true)}
                className="text-xs font-black text-white hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
              >
                <QrCode size={14} /> AGRANDAR QR
              </button>
            </div>
          </div>

          <button
            onClick={copyJoinLink}
            className="glass-panel hover:border-[#00ff88] p-3 text-white transition-colors rounded-xl cursor-pointer"
            title="Copiar Link"
          >
            {copiedLink ? <Check size={18} className="text-[#00ff88]" /> : <Copy size={18} />}
          </button>
        </div>
      </header>

      {/* Banner Desbloqueo de Audio TV */}
      {!isTvAudioActivated && (
        <button
          onClick={handleActivateAudio}
          className="w-full bg-gradient-to-r from-[#00ff88] to-[#00f3ff] hover:opacity-90 text-black font-black text-lg sm:text-xl py-3.5 px-6 rounded-2xl uppercase tracking-wider shadow-[0_0_30px_rgba(0,255,136,0.4)] mb-6 flex items-center justify-center gap-3 cursor-pointer z-30"
        >
          <VolumeX size={24} className="animate-pulse" />
          <span>🔊 PRESIONA AQUÍ PARA ACTIVAR EL SONIDO Y LA VOZ DEL LOCUTOR</span>
        </button>
      )}

      {/* Banner Presión al Líder */}
      {leaderInfo && (
        <div className="glass-panel border-2 border-[#00ff88]/40 p-3 mb-6 rounded-xl flex flex-wrap justify-between items-center z-20 shadow-[0_0_20px_rgba(0,255,136,0.15)]">
          <div className="flex items-center gap-2">
            <span className="bg-[#00ff88] text-black font-black text-xs px-3 py-1 uppercase rounded-full">
              👑 LÍDER DE LA PARTIDA
            </span>
            <span className="font-black text-lg text-white uppercase tracking-tight">
              {leaderInfo.name}
            </span>
          </div>
          <span className="text-xs font-black text-black bg-[#00ff88] font-space uppercase tracking-wider px-3 py-1 rounded-full">
            🔥 {leaderInfo.hits} ACIERTOS MARCADOS
          </span>
        </div>
      )}

      {/* Stage de Espera y Bienvenida con QR Gigante */}
      {status === "waiting" && (
        <div className="glass-panel border-2 border-[#00ff88] p-8 mb-8 rounded-3xl text-center z-20 animate-fadeIn shadow-[0_0_50px_rgba(0,255,136,0.3)] space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-black text-xs sm:text-sm px-4 py-1.5 uppercase rounded-full tracking-widest shadow-[0_0_15px_#00ff88]">
            📱 ESCANEA EL CÓDIGO QR PARA UNIRTE DESDE TU CELULAR
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-4">
            {/* QR Gigante */}
            <div className="bg-white p-4 rounded-2xl border-4 border-black shadow-[0_0_30px_rgba(255,255,255,0.3)] inline-block">
              <QRCodeSVG value={joinUrl} size={200} level="H" />
            </div>

            <div className="text-center md:text-left space-y-3 max-w-lg">
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                SALÓN: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00f3ff]">{groupName}</span>
              </h2>
              <div className="text-xl sm:text-2xl font-black text-[#00ff88] font-space tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-xl inline-block">
                CÓDIGO: {roomId}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">
                {playersList.length} DE {maxPlayers} JUGADORES LISTOS EN LA MESA
              </p>

              {/* Chips de Jugadores Conectados */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                {playersList.map((p) => (
                  <span key={p.id} className="bg-white/10 border border-[#00ff88]/40 text-[#00ff88] text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                    👤 {p.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Botón de Inicio con Conteo 3, 2, 1 */}
          {isHost ? (
            <button
              onClick={triggerStartGameWithCountdown}
              className="w-full max-w-lg bg-gradient-to-r from-[#00ff88] via-[#00f3ff] to-[#a855f7] hover:brightness-110 text-black font-black text-xl sm:text-2xl py-5 px-8 border border-white/50 uppercase tracking-wider rounded-full shadow-[0_0_40px_rgba(0,255,136,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer mx-auto"
            >
              <Play size={28} fill="currentColor" /> INICIAR PARTIDA DE BINGO
            </button>
          ) : (
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl text-center text-slate-300 font-black text-sm uppercase tracking-wider animate-pulse max-w-lg mx-auto">
              ⏳ ESPERANDO A QUE EL ANFITRIÓN INICIE LA PARTIDA...
            </div>
          )}
        </div>
      )}

      {/* Main TV Arena Layout Cyber Glass */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 relative z-10">
        
        {/* Left Column: Esfera 3D Gigante y Controles del Host */}
        <section className="lg:col-span-5 glass-panel border border-white/20 p-8 rounded-2xl flex flex-col justify-between shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-xs font-black uppercase text-slate-200 tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-[#00ff88]" /> BALOTA EN TRANSMISIÓN
            </span>
            {currentLetter && (
              <span className="bg-[#00ff88] text-black font-black text-sm px-3 py-1 uppercase tracking-widest rounded-full">
                COLUMNA {currentLetter}
              </span>
            )}
          </div>

          {/* Temporizador de Extracción */}
          <div className="bg-[#06070d] border border-white/15 p-3 my-4 rounded-xl text-center">
            <div className="flex items-center justify-between text-xs font-black text-[#00ff88] uppercase mb-1">
              <span>AUTOMÁTICO SINCRONIZADO</span>
              <span>{autoDraw ? `SIGUIENTE EN ${timerCountdown}s` : "PAUSADO"}</span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${(timerCountdown / speedSec) * 100}%` }}
                className="bg-gradient-to-r from-[#00ff88] to-[#00f3ff] h-full transition-all duration-1000 ease-linear rounded-full"
              />
            </div>
          </div>

          {/* Escenario Central: Esfera 3D Gigante Maximizada */}
          <div className="my-auto text-center py-6 flex flex-col items-center justify-center">
            {currentBall ? (
              <BingoBallSphere letter={currentLetter} number={currentBall} size="lg" />
            ) : (
              <div className="py-20 text-slate-400 font-black text-2xl uppercase tracking-wider border-2 border-dashed border-white/20 rounded-2xl w-full">
                ESPERANDO BALOTA
              </div>
            )}
          </div>

          {/* Panel de Controles del TV Host */}
          {isHost && (
            <div className="border-t border-white/10 pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDrawNextBall}
                  disabled={availableNumbers.length === 0}
                  className="bg-gradient-to-r from-[#00ff88] to-[#00f3ff] hover:opacity-90 text-black font-black text-base py-3.5 border border-white/40 uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Play size={18} fill="currentColor" /> SACAR BALOTA
                </button>

                <button
                  onClick={() => setAutoDraw(!autoDraw)}
                  className={`font-black text-base py-3.5 border rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    autoDraw
                      ? "bg-white text-black border-white"
                      : "bg-white/10 text-slate-300 border-white/20"
                  }`}
                >
                  {autoDraw ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  {autoDraw ? "PAUSAR AUTO" : "AUTO EXTRACCIÓN"}
                </button>
              </div>

              {/* Selector de Personalidad del Locutor */}
              <div className="bg-[#06070d] border border-white/15 p-2 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Drama size={14} className="text-[#00ff88]" /> ESTILO DEL LOCUTOR:
                </span>
                <select
                  value={personalityMode}
                  onChange={(e) => setPersonalityMode(e.target.value)}
                  className="bg-[#151a2d] text-[#00ff88] font-black border border-white/20 text-xs px-2 py-1 uppercase rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value="auto">🧠 AUTOMÁTICO INTELIGENTE (RECOMENDADO)</option>
                  <option value="comedian">🤪 EL TÍO CHANCERO DE LA CASA</option>
                  <option value="sports">🔥 DEPORTIVO FERVIENTE</option>
                  <option value="classic">🎙️ CLÁSICO ELEGANTE</option>
                  <option value="cyber">🤖 IA FUTURISTA</option>
                </select>
              </div>

              {/* Selector de Tiempo entre Balotas */}
              <div className="bg-[#06070d] border border-white/15 p-2 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  ⏱️ TIEMPO ENTRE BALOTAS:
                </span>
                <select
                  value={speedSec}
                  onChange={(e) => {
                    const newSpeed = Number(e.target.value);
                    setSpeedSec(newSpeed);
                    setTimerCountdown(newSpeed);
                  }}
                  className="bg-[#151a2d] text-[#00ff88] font-black border border-white/20 text-xs px-2 py-1 uppercase rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value={6}>6 SEGUNDOS (DINÁMICO / RECOMENDADO)</option>
                  <option value={8}>8 SEGUNDOS (RÁPIDO)</option>
                  <option value={10}>10 SEGUNDOS (ESTÁNDAR FAMILIAR)</option>
                  <option value={12}>12 SEGUNDOS (RELAJADO)</option>
                </select>
              </div>

              {/* Selector de Voces & Música */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#06070d] border border-white/15 p-2 rounded-xl col-span-2">
                  <span className="text-[9px] text-slate-300 font-bold uppercase block mb-1 flex items-center gap-1">
                    <Mic size={10} className="text-[#00ff88]" /> VOZ DEL LOCUTOR
                  </span>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full bg-[#151a2d] text-[#00ff88] font-black border border-white/20 text-xs px-2 py-1 uppercase rounded-lg focus:outline-none cursor-pointer"
                  >
                    {availableVoices.map((v) => {
                      const isNeural = v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("natural") || v.name.toLowerCase().includes("neural") || v.name.toLowerCase().includes("premium");
                      return (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {isNeural ? "⭐ " : "🗣️ "} {v.name} ({v.lang})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="bg-[#06070d] border border-white/15 p-2 rounded-xl flex items-center justify-center">
                  <button
                    onClick={() => {
                      let nextTrack = "track1";
                      if (currentTrack === "track1") nextTrack = "track2";
                      else if (currentTrack === "track2") nextTrack = "off";
                      else nextTrack = "track1";

                      setCurrentTrack(nextTrack);
                      toggleBackgroundMusic(nextTrack !== "off", nextTrack);
                    }}
                    className={`w-full h-full font-black text-[10px] py-1 px-2 border rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      currentTrack !== "off"
                        ? "bg-[#00ff88] text-black border-black shadow-[0_0_15px_rgba(0,255,136,0.4)]"
                        : "bg-white/10 text-slate-400 border-white/20"
                    }`}
                  >
                    <Music size={12} />
                    {currentTrack === "track1"
                      ? "🕺 ARCADE FEVER"
                      : currentTrack === "track2"
                      ? "🎷 LOFI CASINO"
                      : "🔇 MÚSICA OFF"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Tablero General (1-75) & Jugadores en Vivo */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Selector de Pestañas Derecha (Tablero 75 vs Jugadores) */}
          <div className="glass-panel p-2 rounded-xl flex items-center gap-2 border border-white/15">
            <button
              onClick={() => setRightViewMode("board")}
              className={`flex-1 py-2.5 px-4 font-black text-xs uppercase rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                rightViewMode === "board"
                  ? "bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Grid3X3 size={16} /> TABLERO 75 BALOTAS
            </button>
            <button
              onClick={() => setRightViewMode("players")}
              className={`flex-1 py-2.5 px-4 font-black text-xs uppercase rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                rightViewMode === "players"
                  ? "bg-[#00f3ff] text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users size={16} /> JUGADORES EN VIVO ({playersList.length})
            </button>
          </div>

          {/* Contenido Dinámico Seleccionado */}
          {rightViewMode === "board" ? (
            <MasterBingoBoard drawnBalls={drawnBalls} currentBall={currentBall} />
          ) : (
            <PlayersTVGrid players={players} drawnBalls={drawnBalls} maxPlayers={maxPlayers} />
          )}
        </section>
      </main>

      {/* Modal QR Agrandado */}
      {showLargeQR && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="glass-panel border-2 border-[#00ff88] p-8 max-w-md w-full text-center rounded-2xl shadow-[0_0_40px_rgba(0,255,136,0.3)]">
            <h2 className="text-2xl font-black text-white uppercase mb-4">ESCANEA PARA JUGAR</h2>
            <div className="bg-white p-4 border-2 border-black rounded-xl inline-block mb-4">
              <QRCodeSVG value={joinUrl} size={240} level="H" />
            </div>
            <p className="text-xl font-black text-[#00ff88] font-space mb-6">{roomId}</p>
            <button
              onClick={() => setShowLargeQR(false)}
              className="w-full bg-[#00ff88] text-black font-black py-4 rounded-xl uppercase text-lg border border-black cursor-pointer"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

      {/* Overlay Cinematográfico de Cuenta Regresiva 3, 2, 1 */}
      {countdownOverlay !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center backdrop-blur-xl animate-fadeIn select-none">
          <div className="text-center space-y-6">
            <span className="bg-[#00ff88] text-black font-black text-sm sm:text-base px-6 py-2 uppercase rounded-full tracking-widest shadow-[0_0_25px_#00ff88]">
              🚀 INICIANDO BINGO DE {groupName}
            </span>

            <div className="text-8xl sm:text-[14rem] font-black text-[#00ff88] font-space leading-none animate-bounce drop-shadow-[0_0_60px_rgba(0,255,136,0.9)]">
              {countdownOverlay}
            </div>

            <p className="text-base sm:text-2xl font-black text-slate-200 uppercase tracking-widest">
              ¡PREPAREN SUS CARTONES MÓVILES!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
