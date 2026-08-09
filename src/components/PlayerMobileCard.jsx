import React from "react";
import { Star, Trophy, Check, Crown } from "lucide-react";
import confetti from "canvas-confetti";
import { getPlayerNeonTheme } from "../utils/themeEngine";
import { playPopSound } from "../utils/audio";

export default function PlayerMobileCard({
  card,
  playerName = "Jugador",
  tableName = "Tabla #1",
  playerColor = { hex: "#00ff88", text: "#000000" },
  currentBall,
  drawnBalls = [],
  players = {},
  playerId,
  onToggleCell,
  onClaimBingo
}) {
  if (!card || card.length === 0) return null;

  // Paquete de Tema Neón Personalizado del Jugador
  const theme = getPlayerNeonTheme(playerColor);
  const drawnNumbersSet = new Set((drawnBalls || []).map((b) => Number(b)));

  // Calcular si este jugador es el Líder de la Partida
  const playersList = Object.values(players || {});
  const leaderPlayer = playersList.reduce((top, p) => {
    const pCount = (p.confirmedNumbers || []).length;
    const topCount = (top?.confirmedNumbers || []).length;
    return pCount > topCount ? p : top;
  }, null);

  const isCurrentPlayerLeader =
    leaderPlayer &&
    leaderPlayer.id === playerId &&
    (leaderPlayer.confirmedNumbers || []).length > 0;

  const handleBingoClick = () => {
    confetti({
      particleCount: 260,
      spread: 120,
      origin: { y: 0.6 }
    });
    onClaimBingo();
  };

  const columns = [
    { letter: "B", color: theme.hex, text: theme.text },
    { letter: "I", color: "#00f3ff", text: "#000000" },
    { letter: "N", color: "#a855f7", text: "#ffffff" },
    { letter: "G", color: "#ff007f", text: "#ffffff" },
    { letter: "O", color: theme.hex, text: theme.text }
  ];

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto bg-[#06070d] text-white font-syne p-2 sm:p-4 flex flex-col justify-between gap-3 select-none relative transition-all duration-300">
      
      {/* Badge Vivo de Líder de la Partida */}
      {isCurrentPlayerLeader && (
        <div className="bg-[#00ff88] text-black font-black text-xs py-1.5 px-3 rounded-xl border border-black uppercase text-center flex items-center justify-center gap-2 animate-bounce shadow-[0_0_20px_#00ff88]">
          <Crown size={16} fill="currentColor" /> 👑 ¡ERES EL LÍDER DE LA PARTIDA!
        </div>
      )}

      {/* Header Compacto Neón Personalizado */}
      <div
        style={{
          borderColor: theme.borderColor,
          boxShadow: theme.glow
        }}
        className="glass-panel border-2 p-3 rounded-2xl flex justify-between items-center transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          {/* Avatar con Color Personalizado */}
          <div
            style={{
              backgroundColor: theme.hex,
              color: theme.text,
              boxShadow: theme.glowStrong
            }}
            className="w-10 h-10 rounded-xl font-black text-xl flex items-center justify-center border border-black shrink-0"
          >
            {playerName ? playerName.charAt(0).toUpperCase() : "J"}
          </div>
          <div>
            <span
              style={{
                backgroundColor: theme.hex,
                color: theme.text
              }}
              className="font-black text-[9px] px-2 py-0.5 uppercase rounded-full font-space inline-block"
            >
              {tableName}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white uppercase leading-tight mt-0.5">{playerName}</h2>
          </div>
        </div>

        {/* Última Balota Cantada */}
        <div className="text-right">
          <span
            style={{ color: theme.hex }}
            className="text-[9px] font-black uppercase tracking-wider block"
          >
            ÚLTIMA BALOTA
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-space leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
            {currentBall ? currentBall : "--"}
          </div>
        </div>
      </div>

      {/* Cartón 5x5 Neón Personalizado */}
      <div
        style={{
          borderColor: theme.borderColor,
          boxShadow: theme.glow
        }}
        className="glass-panel border-2 p-2 sm:p-3 rounded-2xl transition-all duration-300"
      >
        {/* Cabecera B-I-N-G-O */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 mb-1.5">
          {columns.map((col) => (
            <div
              key={col.letter}
              style={{ backgroundColor: col.color, color: col.text }}
              className="font-black text-lg sm:text-2xl py-1 text-center rounded-xl uppercase font-syne shadow-md"
            >
              {col.letter}
            </div>
          ))}
        </div>

        {/* Grilla 5x5 con Casillas Reactivas al Tema del Jugador */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
          {card.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isFree = cell.val === "FREE";
              const isMarked = cell.marked;
              const cellNum = typeof cell.val === "number" ? cell.val : Number(cell.val);
              const isDrawn = !isFree && drawnNumbersSet.has(cellNum);

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  id={`cell-${rIdx}-${cIdx}`}
                  onClick={() => {
                    playPopSound();
                    onToggleCell(rIdx, cIdx);
                  }}
                  style={{
                    backgroundColor: isFree
                      ? theme.hex
                      : isMarked
                      ? theme.markedBg
                      : "#0f111c",
                    color: isFree
                      ? theme.text
                      : isMarked
                      ? theme.markedText
                      : isDrawn
                      ? theme.hex
                      : "#ffffff",
                    borderColor: isFree
                      ? theme.borderColor
                      : isMarked
                      ? theme.borderColor
                      : isDrawn
                      ? theme.borderColor
                      : "rgba(255, 255, 255, 0.15)",
                    boxShadow: isFree
                      ? theme.glowStrong
                      : isMarked
                      ? theme.glowStrong
                      : isDrawn
                      ? theme.glow
                      : "none"
                  }}
                  className={`aspect-square flex flex-col items-center justify-center relative font-black text-base sm:text-xl transition-all duration-150 cursor-pointer rounded-xl active:scale-95 ${
                    isFree || isMarked
                      ? "border-2 scale-[0.98]"
                      : isDrawn
                      ? "border-2 animate-pulse"
                      : "border hover:border-white/50"
                  }`}
                >
                  {isFree ? (
                    <div className="flex flex-col items-center justify-center leading-none" style={{ color: theme.text }}>
                      <Star size={16} fill="currentColor" />
                      <span className="text-[8px] font-black tracking-tighter mt-0.5">FREE</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-space font-black">{cell.val}</span>
                      {isMarked && (
                        <Check size={16} className="absolute top-0.5 right-0.5 stroke-[4]" style={{ color: theme.markedText }} />
                      )}
                    </>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Botón Masivo de Acción con Gradiente Neón Personalizado */}
      <button
        id="player-claim-bingo-btn"
        onClick={handleBingoClick}
        style={{
          background: `linear-gradient(90deg, ${theme.hex}, #00f3ff)`,
          color: "#000000",
          boxShadow: theme.glowStrong
        }}
        className="w-full font-black text-2xl py-4 rounded-2xl uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/40 cursor-pointer"
      >
        <Trophy size={26} className="stroke-[3]" /> ¡CANTAR BINGO!
      </button>
    </div>
  );
}
