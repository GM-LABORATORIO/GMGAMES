import React, { useState, useEffect } from "react";
import { getLetterForNumber } from "../utils/bingoLogic";
import { speakBallNumber, toggleBackgroundMusic, unlockTVAudio, getAvailableSpanishVoices } from "../utils/audio";
import { Play, Pause, Tv, QrCode, Copy, Check, Volume2, Music, VolumeX, Mic, Sparkles } from "lucide-react";
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
  const [bgMusicEnabled, setBgMusicEnabled] = useState(false);
  const [announcerSubtitle, setAnnouncerSubtitle] = useState("");
  const [isTvAudioActivated, setIsTvAudioActivated] = useState(false);

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

  // Calcular el "colero" (jugador con menos aciertos) para chanzas sanas
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

  useEffect(() => {
    if (currentBall) {
      setIsSpeaking(true);
      const text = speakBallNumber(
        currentLetter,
        currentBall,
        selectedVoiceURI,
        leaderInfo,
        underdogInfo,
        () => {
          setIsSpeaking(false);
          setTimerCountdown(speedSec);
        }
      );
      setAnnouncerSubtitle(text);
    } else {
      setAnnouncerSubtitle("");
      setIsSpeaking(false);
    }
  }, [currentBall, currentLetter, selectedVoiceURI]);

  // Temporizador de Cuenta Regresiva Sincronizado por Eventos de Voz
  useEffect(() => {
    let interval = null;

    if (autoDraw && status === "playing" && availableNumbers.length > 0 && !isSpeaking) {
      interval = setInterval(() => {
        setTimerCountdown((prev) => {
          if (prev <= 1) {
            onDrawNextBall();
            return speedSec;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isSpeaking) {
      setTimerCountdown(speedSec);
    } else {
      setTimerCountdown(speedSec);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoDraw, status, availableNumbers.length, speedSec, isSpeaking, onDrawNextBall]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 font-syne text-white flex flex-col min-h-screen justify-between bg-[#06070d]">
      
      {/* Header Widescreen Cyber Glass */}
      <header className="flex flex-wrap justify-between items-center border-b border-white/10 pb-4 mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#00ff88] text-black p-2 font-black rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.3)]">
            <Tv size={24} />
            <span className="tracking-widest uppercase text-sm">TRANSMISIÓN TV 4K</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
            BINGO DE LA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00f3ff]">FAMILIA LOAIZA SILLE</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">CÓDIGO DE SALA</div>
            <div className="text-3xl font-black text-[#00ff88] tracking-widest font-space">{roomId}</div>
          </div>

          <div className="flex items-center gap-3 glass-panel p-2 rounded-xl border border-white/20">
            <div className="bg-white p-1 rounded-lg cursor-pointer" onClick={() => setShowLargeQR(true)}>
              <QRCodeSVG value={joinUrl} size={45} level="M" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-[#00ff88] font-black block uppercase tracking-wider">
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
            className="glass-panel hover:border-[#00ff88] p-3 text-white transition-colors rounded-xl"
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

      {/* Banner Hero QR Gigante de Bienvenida en Estado de Espera */}
      {status === "waiting" && (
        <div className="glass-panel border-2 border-[#00ff88] p-6 mb-6 rounded-2xl text-center z-20 animate-fadeIn shadow-[0_0_30px_rgba(0,255,136,0.2)]">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="bg-white p-3 rounded-xl border border-black shadow-lg inline-block">
              <QRCodeSVG value={joinUrl} size={140} level="H" />
            </div>
            <div className="text-center sm:text-left space-y-2">
              <span className="bg-[#00ff88] text-black font-black px-3 py-1 text-xs uppercase rounded-full inline-block">
                📱 ESCANEA EL QR PARA UNIRTE DESDE TU CELULAR
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase">
                CÓDIGO DE SALA: <span className="text-[#00ff88] font-space">{roomId}</span>
              </h2>
              <p className="text-xs text-slate-300 font-bold uppercase">
                {playersList.length} DE {maxPlayers} JUGADORES CONECTADOS
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main TV Layout Cyber Glass */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 relative z-10">
        
        {/* Left Column: Balota Cantada & Timer */}
        <section className="lg:col-span-5 glass-panel border border-white/20 p-8 rounded-2xl flex flex-col justify-between shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-xs font-black uppercase text-slate-200 tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-[#00ff88]" /> ÚLTIMA BALOTA
            </span>
            {currentLetter && (
              <span className="bg-[#00ff88] text-black font-black text-sm px-3 py-1 uppercase tracking-widest rounded-full">
                LETRA {currentLetter}
              </span>
            )}
          </div>

          {/* Temporizador */}
          <div className="bg-[#06070d] border border-white/15 p-3 my-4 rounded-xl text-center">
            <div className="flex items-center justify-between text-xs font-black text-[#00ff88] uppercase mb-1">
              <span>TEMPORIZADOR AUTOMÁTICO</span>
              <span>{autoDraw ? `SIGUIENTE EN ${timerCountdown}s` : "PAUSADO"}</span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${(timerCountdown / speedSec) * 100}%` }}
                className="bg-gradient-to-r from-[#00ff88] to-[#00f3ff] h-full transition-all duration-1000 ease-linear rounded-full"
              />
            </div>
          </div>

          <div className="my-auto text-center py-4">
            {currentBall ? (
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl md:text-7xl font-black text-[#00ff88] tracking-widest mb-2 font-space drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]">
                  {currentLetter}
                </div>
                <div className="text-[10rem] md:text-[14rem] font-black text-white leading-none tracking-tighter font-syne drop-shadow-[0_4px_30px_rgba(255,255,255,0.4)]">
                  {currentBall}
                </div>

                {announcerSubtitle && (
                  <div className="mt-3 glass-panel border border-[#00ff88]/40 p-2.5 rounded-xl text-[#00ff88] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 max-w-md mx-auto">
                    <Volume2 size={16} className="text-white shrink-0" />
                    <span>🎙️ LOCUTOR: "{announcerSubtitle}"</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-slate-400 font-black text-3xl uppercase tracking-wider border-2 border-dashed border-white/20 rounded-2xl">
                ESPERANDO BALOTA
              </div>
            )}
          </div>

          {isHost && (
            <div className="border-t border-white/10 pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onDrawNextBall}
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

              {/* Selector de Voces & Música */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#06070d] border border-white/15 p-2 rounded-xl col-span-2">
                  <span className="text-[9px] text-slate-300 font-bold uppercase block mb-1 flex items-center gap-1">
                    <Mic size={10} className="text-[#00ff88]" /> VOZ DEL LOCUTOR
                  </span>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full bg-[#151a2d] text-[#00ff88] font-black border border-white/20 text-xs px-2 py-1 uppercase rounded-lg focus:outline-none"
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

        {/* Right Column: Players Grid */}
        <section className="lg:col-span-7 glass-panel border border-white/20 p-6 rounded-2xl flex flex-col justify-between shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <PlayersTVGrid players={players} drawnBalls={drawnBalls} maxPlayers={maxPlayers} />
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
              className="w-full bg-[#00ff88] text-black font-black py-4 rounded-xl uppercase text-lg border border-black"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
