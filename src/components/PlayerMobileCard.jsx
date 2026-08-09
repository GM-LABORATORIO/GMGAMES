import React from "react";
import { Star, Trophy, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { playPopSound } from "../utils/audio";

export default function PlayerMobileCard({
  card,
  playerName = "Jugador",
  tableName = "Tabla #1",
  playerColor = { hex: "#00ff88", text: "#000000" },
  currentBall,
  drawnBalls = [],
  onToggleCell,
  onClaimBingo
}) {
  if (!card || card.length === 0) return null;

  const drawnNumbersSet = new Set((drawnBalls || []).map((b) => Number(b)));

  const handleBingoClick = () => {
    confetti({
      particleCount: 250,
      spread: 120,
      origin: { y: 0.6 }
    });
    onClaimBingo();
  };

  const columns = [
    { letter: "B", color: "#00ff88", text: "#000000" },
    { letter: "I", color: "#00f3ff", text: "#000000" },
    { letter: "N", color: "#a855f7", text: "#ffffff" },
    { letter: "G", color: "#ff007f", text: "#ffffff" },
    { letter: "O", color: "#00ff88", text: "#000000" }
  ];

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto bg-[#06070d] text-white font-syne p-2 sm:p-4 flex flex-col justify-between gap-3 select-none relative transition-all duration-300">
      
      {/* Header Compacto Cyber Glass */}
      <div className="glass-panel border border-white/20 p-3 rounded-2xl flex justify-between items-center shadow-[0_0_20px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3">
          {/* Avatar Neón Electrizante */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00f3ff] text-black font-black text-xl flex items-center justify-center border border-white/40 shadow-[0_0_15px_rgba(0,255,136,0.4)] shrink-0">
            {playerName ? playerName.charAt(0).toUpperCase() : "J"}
          </div>
          <div>
            <span className="bg-[#00ff88] text-black font-black text-[9px] px-2 py-0.5 uppercase rounded-full font-space">
              {tableName}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white uppercase leading-tight mt-0.5">{playerName}</h2>
          </div>
        </div>

        {/* Última Balota Cantada */}
        <div className="text-right">
          <span className="text-[9px] font-black text-[#00ff88] uppercase tracking-wider block">
            ÚLTIMA BALOTA
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-space leading-none drop-shadow-[0_0_10px_rgba(0,255,136,0.6)]">
            {currentBall ? currentBall : "--"}
          </div>
        </div>
      </div>

      {/* Cartón 5x5 Cyber Glass */}
      <div className="glass-panel border border-white/20 p-2 sm:p-3 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        
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

        {/* Grilla 5x5 con Casillas Neón en Vidrio Esmerilado */}
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
                      ? "#00ff88"
                      : isMarked
                      ? "#00ff88"
                      : "#0f111c",
                    color: isFree
                      ? "#000000"
                      : isMarked
                      ? "#000000"
                      : isDrawn
                      ? "#00ff88"
                      : "#ffffff",
                    borderColor: isFree
                      ? "#00ff88"
                      : isMarked
                      ? "#00ff88"
                      : isDrawn
                      ? "#00ff88"
                      : "rgba(255, 255, 255, 0.15)",
                    boxShadow: isFree
                      ? "0 0 15px rgba(0, 255, 136, 0.6)"
                      : isMarked
                      ? "0 0 20px rgba(0, 255, 136, 0.7)"
                      : isDrawn
                      ? "0 0 12px rgba(0, 255, 136, 0.4)"
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
                    <div className="flex flex-col items-center justify-center leading-none text-black">
                      <Star size={16} fill="currentColor" />
                      <span className="text-[8px] font-black tracking-tighter mt-0.5">FREE</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-space font-black">{cell.val}</span>
                      {isMarked && (
                        <Check size={16} className="absolute top-0.5 right-0.5 stroke-[4] text-black" />
                      )}
                    </>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Botón Masivo de Acción: ¡CANTAR BINGO! Neón Electrizante */}
      <button
        id="player-claim-bingo-btn"
        onClick={handleBingoClick}
        className="w-full bg-gradient-to-r from-[#00ff88] via-[#00f3ff] to-[#a855f7] hover:opacity-95 text-black font-black text-2xl py-4 rounded-2xl uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/40 shadow-[0_0_30px_rgba(0,255,136,0.5)] cursor-pointer"
      >
        <Trophy size={26} className="stroke-[3]" /> ¡CANTAR BINGO!
      </button>
    </div>
  );
}
