import React from "react";
import { Sparkles, Check } from "lucide-react";

/**
 * Tablero General 4K de 75 Balotas para la Transmisión de TV
 */
export default function MasterBingoBoard({ drawnBalls = [], currentBall = null }) {
  const drawnSet = new Set((drawnBalls || []).map((b) => Number(b)));

  const columns = [
    { letter: "B", min: 1, max: 15, color: "#ff0055", glow: "0 0 15px rgba(255, 0, 85, 0.4)" },
    { letter: "I", min: 16, max: 30, color: "#ffb700", glow: "0 0 15px rgba(255, 183, 0, 0.4)" },
    { letter: "N", min: 31, max: 45, color: "#00f3ff", glow: "0 0 15px rgba(0, 243, 255, 0.4)" },
    { letter: "G", min: 46, max: 60, color: "#00ff88", glow: "0 0 15px rgba(0, 255, 136, 0.4)" },
    { letter: "O", min: 61, max: 75, color: "#a855f7", glow: "0 0 15px rgba(168, 85, 247, 0.4)" }
  ];

  return (
    <div className="glass-panel border-2 border-white/20 p-5 rounded-2xl flex flex-col gap-4 select-none shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <h2 className="text-lg font-black text-[#00ff88] uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={18} /> TABLERO GENERAL DE BALOTAS (75)
        </h2>
        <span className="text-xs font-black text-white bg-[#00ff88]/20 border border-[#00ff88]/40 px-3 py-1 rounded-full uppercase font-space">
          {drawnSet.size} / 75 BALOTAS CANTADAS
        </span>
      </div>

      {/* Grid de 5 Columnas B-I-N-G-O */}
      <div className="grid grid-cols-5 gap-3">
        {columns.map((col) => {
          const nums = [];
          for (let i = col.min; i <= col.max; i++) {
            nums.push(i);
          }

          return (
            <div key={col.letter} className="bg-[#06070d]/90 border border-white/10 p-2 rounded-xl flex flex-col gap-2">
              {/* Cabecera de Columna */}
              <div
                style={{ backgroundColor: col.color, boxShadow: col.glow }}
                className="text-black font-black text-base md:text-xl py-1 rounded-lg text-center font-syne uppercase shadow-md"
              >
                {col.letter}
              </div>

              {/* Balotas 1 a 15 de la columna */}
              <div className="grid grid-cols-1 gap-1.5">
                {nums.map((num) => {
                  const isDrawn = drawnSet.has(num);
                  const isCurrent = Number(currentBall) === num;

                  return (
                    <div
                      key={num}
                      style={{
                        backgroundColor: isCurrent
                          ? col.color
                          : isDrawn
                          ? `${col.color}25`
                          : "rgba(255,255,255,0.03)",
                        color: isCurrent
                          ? "#000000"
                          : isDrawn
                          ? col.color
                          : "#64748b",
                        borderColor: isCurrent
                          ? "#ffffff"
                          : isDrawn
                          ? col.color
                          : "rgba(255,255,255,0.05)",
                        boxShadow: isCurrent ? col.glow : "none"
                      }}
                      className={`py-1 text-center font-black text-xs md:text-sm rounded-lg border transition-all duration-300 font-space relative flex items-center justify-center ${
                        isCurrent
                          ? "scale-105 z-10 font-extrabold animate-pulse border-2"
                          : isDrawn
                          ? "border-opacity-40"
                          : ""
                      }`}
                    >
                      {num}
                      {isDrawn && !isCurrent && (
                        <Check size={10} className="absolute right-1 opacity-70" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
