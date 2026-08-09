import React from "react";
import { Star, Trophy, Check } from "lucide-react";
import confetti from "canvas-confetti";

export default function PlayerMobileCard({
  card,
  playerName = "Jugador",
  tableName = "Tabla #1",
  currentBall,
  drawnBalls = [],
  onToggleCell,
  onClaimBingo
}) {
  if (!card || card.length === 0) return null;

  const drawnSet = new Set(drawnBalls);

  const handleBingoClick = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
    onClaimBingo();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#040914] text-white font-syne p-4 flex flex-col gap-4 select-none">
      {/* Header Jugador e Identificador de Tabla */}
      <div className="bg-[#081021] border-4 border-slate-800 p-4 brutal-shadow-yellow flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">JUGADOR</span>
            <span className="bg-[#ffe600] text-black font-black text-[10px] px-2 py-0.5 uppercase border border-black">
              {tableName}
            </span>
          </div>
          <h2 className="text-xl font-black text-white uppercase mt-0.5">{playerName}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">ÚLTIMA BALOTA</span>
          <div className="text-2xl font-black text-[#ffe600] font-space">
            {currentBall ? currentBall : "--"}
          </div>
        </div>
      </div>

      {/* Cartón de Bingo 5x5 */}
      <div className="bg-[#081021] border-4 border-[#ffe600] p-3 brutal-shadow-white">
        
        {/* Cabecera B-I-N-G-O */}
        <div className="grid grid-cols-5 gap-2 mb-2">
          {["B", "I", "N", "G", "O"].map((letter) => (
            <div
              key={letter}
              className="bg-[#ffe600] text-black font-black text-2xl py-2 text-center border-2 border-black uppercase font-syne"
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Grilla 5x5 Interactivas */}
        <div className="grid grid-cols-5 gap-2">
          {card.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isFree = cell.val === "FREE";
              const isMarked = cell.marked;
              const isDrawn = !isFree && drawnSet.has(cell.val);

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  id={`cell-${rIdx}-${cIdx}`}
                  onClick={() => onToggleCell(rIdx, cIdx)}
                  className={`aspect-square flex flex-col items-center justify-center relative font-black text-2xl transition-all cursor-pointer ${
                    isFree || isMarked
                      ? "bg-[#ffe600] text-black border-4 border-black shadow-[3px_3px_0px_0px_#ffffff] scale-[0.98]"
                      : isDrawn
                      ? "bg-[#040914] text-white border-4 border-[#ffe600]"
                      : "bg-[#040914] text-white border-2 border-slate-700 hover:border-[#ffe600]"
                  }`}
                >
                  {isFree ? (
                    <div className="flex flex-col items-center justify-center leading-none">
                      <Star size={20} fill="currentColor" />
                      <span className="text-[10px] font-black tracking-tighter mt-1">FREE</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-space font-black">{cell.val}</span>
                      {isMarked && (
                        <Check size={18} className="absolute top-1 right-1 stroke-[4]" />
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
        className="w-full bg-[#ffe600] hover:bg-yellow-300 text-black font-black text-2xl py-4 border-4 border-black uppercase tracking-wider brutal-shadow-white active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 mt-2"
      >
        <Trophy size={28} className="stroke-[3]" /> ¡CANTAR BINGO!
      </button>
    </div>
  );
}
