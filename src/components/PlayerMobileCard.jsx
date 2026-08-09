import React from "react";
import { Star, Trophy, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { getPlayerNeonTheme } from "../utils/themeEngine";
import { playPopSound } from "../utils/audio";

export default function PlayerMobileCard({
  card,
  playerName = "Jugador",
  tableName = "Tabla #1",
  playerColor = { hex: "#00f3ff", text: "#000000" },
  currentBall,
  drawnBalls = [],
  onToggleCell,
  onClaimBingo
}) {
  if (!card || card.length === 0) return null;

  // Paquete de diseño Neón dinámico según el color elegido por el jugador
  const theme = getPlayerNeonTheme(playerColor);

  // Normalización estricta a Number
  const drawnNumbersSet = new Set((drawnBalls || []).map((b) => Number(b)));

  const handleBingoClick = () => {
    confetti({
      particleCount: 220,
      spread: 110,
      origin: { y: 0.6 }
    });
    onClaimBingo();
  };

  const columns = [
    { letter: "B", color: "#ff0055", text: "#ffffff" },
    { letter: "I", color: "#ffb700", text: "#000000" },
    { letter: "N", color: "#00f3ff", text: "#000000" },
    { letter: "G", color: "#00ff88", text: "#000000" },
    { letter: "O", color: "#a855f7", text: "#ffffff" }
  ];

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto bg-[#090514] text-white font-syne p-2 sm:p-4 flex flex-col justify-between gap-3 select-none relative transition-all duration-300">
      
      {/* Header Compacto del Jugador */}
      <div
        style={{
          boxShadow: theme.glow,
          borderColor: theme.borderColor
        }}
        className="arcade-card-glass border-2 sm:border-4 p-2.5 sm:p-3 flex justify-between items-center transition-all duration-300"
      >
        <div className="flex items-center gap-2.5">
          {/* Avatar con el color Neón elegido */}
          <div
            style={{ backgroundColor: theme.hex, color: theme.text }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full font-black text-lg flex items-center justify-center border-2 border-black shadow-[0_0_10px_#ffffff] shrink-0"
          >
            {playerName ? playerName.charAt(0).toUpperCase() : "J"}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">JUGADOR</span>
              <span
                style={{ backgroundColor: theme.hex, color: theme.text }}
                className="font-black text-[9px] px-1.5 py-0.2 uppercase border border-black font-space"
              >
                {tableName}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white uppercase leading-tight">{playerName}</h2>
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
          <div className="text-2xl sm:text-3xl font-black text-[#ffb700] font-space drop-shadow-[0_2px_8px_rgba(255,183,0,0.6)] leading-none">
            {currentBall ? currentBall : "--"}
          </div>
        </div>
      </div>

      {/* Cartón 5x5 Ultra Responsive */}
      <div
        style={{
          boxShadow: theme.glow,
          borderColor: theme.borderColor
        }}
        className="arcade-card-glass border-2 sm:border-4 p-2 sm:p-3 transition-all duration-300"
      >
        
        {/* Cabecera B-I-N-G-O */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 mb-1.5">
          {columns.map((col) => (
            <div
              key={col.letter}
              style={{ backgroundColor: col.color, color: col.text }}
              className="font-black text-lg sm:text-2xl py-1 sm:py-1.5 text-center border border-black uppercase font-syne shadow-[1px_1px_0px_0px_#000000]"
            >
              {col.letter}
            </div>
          ))}
        </div>

        {/* Grilla 5x5 Ultra Ajustada */}
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
                      ? "#ffb700"
                      : isMarked
                      ? theme.markedBg
                      : "#090514",
                    color: isFree
                      ? "#000000"
                      : isMarked
                      ? theme.markedText
                      : isDrawn
                      ? theme.hex
                      : "#ffffff",
                    borderColor: isFree
                      ? "#000000"
                      : isMarked
                      ? "#ffffff"
                      : isDrawn
                      ? theme.borderColor
                      : "#334155",
                    boxShadow: isFree
                      ? "0 0 10px #ffb700"
                      : isMarked
                      ? theme.glowStrong
                      : isDrawn
                      ? theme.glow
                      : "none"
                  }}
                  className={`aspect-square flex flex-col items-center justify-center relative font-black text-base sm:text-xl transition-all duration-150 cursor-pointer active:scale-90 ${
                    isFree || isMarked ? "border-2 sm:border-4 scale-[0.98]" : isDrawn ? "border-2 sm:border-4 animate-pulse" : "border hover:border-white"
                  }`}
                >
                  {isFree ? (
                    <div className="flex flex-col items-center justify-center leading-none">
                      <Star size={16} fill="currentColor" />
                      <span className="text-[8px] font-black tracking-tighter mt-0.5">FREE</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-space font-black">{cell.val}</span>
                      {isMarked && (
                        <Check size={14} className="absolute top-0.5 right-0.5 stroke-[4]" />
                      )}
                    </>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Botón Masivo CANTAR BINGO */}
      <button
        id="player-claim-bingo-btn"
        onClick={handleBingoClick}
        style={{
          boxShadow: theme.glowStrong,
          borderColor: "#000000"
        }}
        className={`${theme.buttonBg} w-full font-black text-xl sm:text-2xl py-3 sm:py-4 border-2 sm:border-4 uppercase tracking-wider active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2`}
      >
        <Trophy size={22} className="stroke-[3]" /> ¡CANTAR BINGO!
      </button>
    </div>
  );
}
