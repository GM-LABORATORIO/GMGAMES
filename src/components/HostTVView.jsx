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

  const handleActivateAudio = () => {
    unlockTVAudio();
    setIsTvAudioActivated(true);
    toggleBackgroundMusic(true);
    setBgMusicEnabled(true);
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

  const leaderInfo = leaderPlayer && (leaderPlayer.confirmedNumbers || []).length > 0
    ? { name: leaderPlayer.name, hits: leaderPlayer.confirmedNumbers.length, color: leaderPlayer.playerColor }
    : null;

  useEffect(() => {
    if (currentBall) {
      const text = speakBallNumber(currentLetter, currentBall, selectedVoiceURI, leaderInfo);
      setAnnouncerSubtitle(text);
    } else {
      setAnnouncerSubtitle("");
    }
  }, [currentBall, currentLetter, selectedVoiceURI]);

  // Temporizador de Cuenta Regresiva
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

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 font-syne text-white flex flex-col min-h-screen justify-between bg-[#0a1128]">
      
      {/* Header Widescreen Brutalista */}
      <header className="flex flex-wrap justify-between items-center border-b-4 border-[#ffe600] pb-4 mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#ffe600] text-black p-2 font-black border-2 border-black flex items-center gap-2 brutal-shadow-black">
            <Tv size={24} />
            <span className="tracking-widest uppercase text-sm">TRANSMISIÓN TV 4K</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
            BINGO DE LA <span className="text-[#ffe600]">FAMILIA LOAIZA SILLE</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">CÓDIGO DE SALA</div>
            <div className="text-3xl font-black text-[#ffe600] tracking-widest font-space">{roomId}</div>
          </div>

          <div className="flex items-center gap-3 bg-[#111c3a] border-4 border-[#ffe600] p-2 brutal-shadow-white">
            <div className="bg-white p-1 cursor-pointer" onClick={() => setShowLargeQR(true)}>
              <QRCodeSVG value={joinUrl} size={45} level="M" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-[#ffe600] font-black block uppercase tracking-wider">
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
            className="bg-[#111c3a] border-2 border-white hover:border-[#ffe600] p-3 text-white transition-colors brutal-shadow-yellow"
            title="Copiar Link"
          >
            {copiedLink ? <Check size={18} className="text-[#ffe600]" /> : <Copy size={18} />}
          </button>
        </div>
      </header>

      {/* Banner Desbloqueo de Audio TV */}
      {!isTvAudioActivated && (
        <button
          onClick={handleActivateAudio}
          className="w-full bg-[#ffe600] hover:bg-yellow-300 text-black font-black text-lg sm:text-xl py-3 px-6 border-4 border-black uppercase tracking-wider brutal-shadow-white mb-6 flex items-center justify-center gap-3 cursor-pointer z-30"
        >
          <VolumeX size={24} className="animate-pulse" />
          <span>🔊 PRESIONA AQUÍ PARA ACTIVAR EL SONIDO Y LA VOZ DEL LOCUTOR</span>
        </button>
      )}

      {/* Banner Presión al Líder */}
      {leaderInfo && (
        <div className="bg-[#111c3a] border-4 border-[#ffe600] p-3 mb-6 brutal-shadow-yellow flex flex-wrap justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <span className="bg-[#ffe600] text-black font-black text-xs px-3 py-1 uppercase border-2 border-black">
              👑 LÍDER DE LA PARTIDA
            </span>
            <span className="font-black text-lg text-white uppercase tracking-tight">
              {leaderInfo.name}
            </span>
          </div>
          <span className="text-xs font-black text-black bg-[#ffe600] font-space uppercase tracking-wider px-3 py-1 border-2 border-black">
            🔥 {leaderInfo.hits} ACIERTOS MARCADOS
          </span>
        </div>
      )}

      {/* Main TV Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 relative z-10">
        
        {/* Left Column: Balota Cantada & Timer */}
        <section className="lg:col-span-5 bg-[#111c3a] border-4 border-white p-8 flex flex-col justify-between brutal-shadow-yellow">
          <div className="flex justify-between items-center border-b-4 border-slate-700 pb-3">
            <span className="text-xs font-black uppercase text-slate-200 tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-[#ffe600]" /> ÚLTIMA BALOTA
            </span>
            {currentLetter && (
              <span className="bg-[#ffe600] text-black font-black text-sm px-3 py-1 uppercase tracking-widest border-2 border-black">
                LETRA {currentLetter}
              </span>
            )}
          </div>

          {/* Temporizador */}
          <div className="bg-[#0a1128] border-2 border-[#ffe600] p-3 my-4 text-center">
            <div className="flex items-center justify-between text-xs font-black text-[#ffe600] uppercase mb-1">
              <span>TEMPORIZADOR AUTOMÁTICO</span>
              <span>{autoDraw ? `SIGUIENTE EN ${timerCountdown}s` : "PAUSADO"}</span>
            </div>
            <div className="w-full bg-[#111c3a] h-3 border border-white overflow-hidden">
              <div
                style={{ width: `${(timerCountdown / speedSec) * 100}%` }}
                className="bg-[#ffe600] h-full transition-all duration-1000 ease-linear"
              />
            </div>
          </div>

          <div className="my-auto text-center py-4">
            {currentBall ? (
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl md:text-7xl font-black text-[#ffe600] tracking-widest mb-2 font-space">
                  {currentLetter}
                </div>
                <div className="text-[10rem] md:text-[14rem] font-black text-white leading-none tracking-tighter font-syne drop-shadow-[4px_4px_0px_#000]">
                  {currentBall}
                </div>

                {announcerSubtitle && (
                  <div className="mt-3 bg-[#0a1128] border-2 border-[#ffe600] p-2.5 text-[#ffe600] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 max-w-md mx-auto">
                    <Volume2 size={16} className="text-white shrink-0" />
                    <span>🎙️ LOCUTOR: "{announcerSubtitle}"</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-slate-400 font-black text-3xl uppercase tracking-wider border-4 border-dashed border-slate-700">
                ESPERANDO BALOTA
              </div>
            )}
          </div>

          {isHost && (
            <div className="border-t-4 border-slate-700 pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onDrawNextBall}
                  disabled={availableNumbers.length === 0}
                  className="bg-[#ffe600] hover:bg-yellow-300 text-black font-black text-base py-3 border-4 border-black uppercase tracking-wider brutal-shadow-white flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play size={18} fill="currentColor" /> SACAR BALOTA
                </button>

                <button
                  onClick={() => setAutoDraw(!autoDraw)}
                  className={`font-black text-base py-3 border-4 border-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    autoDraw
                      ? "bg-white text-black border-black brutal-shadow-yellow"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {autoDraw ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  {autoDraw ? "PAUSAR AUTO" : "AUTO EXTRACCIÓN"}
                </button>
              </div>

              {/* Selector de Voces & Música */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#0a1128] border-2 border-white p-2 col-span-2">
                  <span className="text-[9px] text-slate-300 font-bold uppercase block mb-1 flex items-center gap-1">
                    <Mic size={10} className="text-[#ffe600]" /> VOZ DEL LOCUTOR
                  </span>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full bg-[#111c3a] text-[#ffe600] font-black border border-white text-xs px-1 py-1 uppercase focus:outline-none"
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

                <div className="bg-[#0a1128] border-2 border-white p-2 flex items-center justify-center">
                  <button
                    onClick={() => {
                      const nextState = !bgMusicEnabled;
                      setBgMusicEnabled(nextState);
                      toggleBackgroundMusic(nextState);
                    }}
                    className={`w-full h-full font-black text-[10px] py-1 px-2 border-2 uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                      bgMusicEnabled
                        ? "bg-[#ffe600] text-black border-black brutal-shadow-white"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <Music size={12} /> {bgMusicEnabled ? "MÚSICA ON" : "MÚSICA OFF"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Players Grid */}
        <section className="lg:col-span-7 bg-[#111c3a] border-4 border-white p-6 brutal-shadow-yellow flex flex-col justify-between">
          <PlayersTVGrid players={players} drawnBalls={drawnBalls} maxPlayers={maxPlayers} />
        </section>
      </main>

      {/* Modal QR Agrandado */}
      {showLargeQR && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-[#111c3a] border-4 border-[#ffe600] p-8 max-w-md w-full text-center brutal-shadow-white">
            <h2 className="text-2xl font-black text-white uppercase mb-4">ESCANEA PARA JUGAR</h2>
            <div className="bg-white p-4 border-4 border-black inline-block mb-4">
              <QRCodeSVG value={joinUrl} size={240} level="H" />
            </div>
            <p className="text-xl font-black text-[#ffe600] font-space mb-6">{roomId}</p>
            <button
              onClick={() => setShowLargeQR(false)}
              className="w-full bg-[#ffe600] text-black font-black py-4 border-4 border-black uppercase text-lg"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
