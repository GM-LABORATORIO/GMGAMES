import React from "react";
import { Star, Trophy, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { playPopSound } from "../utils/audio";

export default function PlayerMobileCard({
  card,
  playerName = "Jugador",
  tableName = "Tabla #1",
  playerColor = { hex: "#ffe600", text: "#000000" },
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
    { letter: "B", color: "#ffe600", text: "#000000" },
    { letter: "I", color: "#ffffff", text: "#000000" },
    { letter: "N", color: "#ffe600", text: "#000000" },
    { letter: "G", color: "#ffffff", text: "#000000" },
    { letter: "O", color: "#ffe600", text: "#000000" }
  ];

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto bg-[#0a1128] text-white font-syne p-2 sm:p-4 flex flex-col justify-between gap-3 select-none relative transition-all duration-300">
      
      {/* Header Compacto Lujo Brutalista */}
      <div className="bg-[#111c3a] border-4 border-white p-3 flex justify-between items-center brutal-shadow-yellow">
        <div className="flex items-center gap-3">
          {/* Avatar Amarillo Vibrante */}
          <div className="w-10 h-10 rounded-none bg-[#ffe600] text-black font-black text-xl flex items-center justify-center border-2 border-black brutal-shadow-black shrink-0">
            {playerName ? playerName.charAt(0).toUpperCase() : "J"}
          </div>
          <div>
            <span className="bg-[#ffe600] text-black font-black text-[9px] px-2 py-0.5 uppercase border border-black font-space">
              {tableName}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white uppercase leading-tight mt-0.5">{playerName}</h2>
          </div>
        </div>

        {/* Última Balota Cantada */}
        <div className="text-right">
          <span className="text-[9px] font-black text-[#ffe600] uppercase tracking-wider block">
            ÚLTIMA BALOTA
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-space leading-none drop-shadow-[2px_2px_0px_#000]">
            {currentBall ? currentBall : "--"}
          </div>
        </div>
      </div>

      {/* Cartón 5x5 Lujo Brutalista */}
      <div className="bg-[#111c3a] border-4 border-white p-2 sm:p-3 brutal-shadow-yellow">
        
        {/* Cabecera B-I-N-G-O */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 mb-1.5">
          {columns.map((col) => (
            <div
              key={col.letter}
              style={{ backgroundColor: col.color, color: col.text }}
              className="font-black text-lg sm:text-2xl py-1 text-center border-2 border-black uppercase font-syne brutal-shadow-black"
            >
              {col.letter}
            </div>
          ))}
        </div>

        {/* Grilla 5x5 con Bordes Duros y Acentos en Amarillo Vibrante */}
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
                      ? "#ffe600"
                      : isMarked
                      ? "#ffe600"
                      : "#0a1128",
                    color: isFree
                      ? "#000000"
                      : isMarked
                      ? "#000000"
                      : isDrawn
                      ? "#ffe600"
                      : "#ffffff",
                    borderColor: isFree
                      ? "#000000"
                      : isMarked
                      ? "#000000"
                      : isDrawn
                      ? "#ffe600"
                      : "#334155"
                  }}
                  className={`aspect-square flex flex-col items-center justify-center relative font-black text-base sm:text-xl transition-all duration-100 cursor-pointer active:scale-95 ${
                    isFree || isMarked
                      ? "border-4 border-black scale-[0.98] brutal-shadow-black"
                      : isDrawn
                      ? "border-4 border-[#ffe600]"
                      : "border-2 hover:border-white"
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

      {/* Botón Masivo de Acción: ¡CANTAR BINGO! en Amarillo Vibrante */}
      <button
        id="player-claim-bingo-btn"
        onClick={handleBingoClick}
        className="w-full bg-[#ffe600] hover:bg-yellow-300 text-black font-black text-2xl py-4 border-4 border-black uppercase tracking-wider active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 brutal-shadow-white"
      >
        <Trophy size={26} className="stroke-[3]" /> ¡CANTAR BINGO!
      </button>
    </div>
  );
}
