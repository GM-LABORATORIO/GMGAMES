import React from "react";
import { Star, Trophy, Check, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function PlayerMobileCard({
  card,
  playerName = "Jugador",
  tableName = "Tabla #1",
  playerColor = { hex: "#ff007f", text: "#ffffff" },
  currentBall,
  drawnBalls = [],
  onToggleCell,
  onClaimBingo
}) {
  if (!card || card.length === 0) return null;

  // Normalización estricta a Number para corregir el bug de comparación entre Number y String (ej: 37 === "37")
  const drawnNumbersSet = new Set((drawnBalls || []).map((b) => Number(b)));

  const handleBingoClick = () => {
    confetti({
      particleCount: 180,
      spread: 100,
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
    <div className="w-full max-w-md mx-auto bg-[#090514] text-white font-syne p-4 flex flex-col gap-4 select-none relative">
      
      {/* Header Jugador Cyber Arcade */}
      <div className="arcade-card-glass border-4 border-[#ff007f] p-4 arcade-glow-magenta flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Avatar con el color Neón elegido en el Journey */}
          <div
            style={{ backgroundColor: playerColor?.hex || "#ff007f", color: playerColor?.text || "#fff" }}
            className="w-12 h-12 rounded-full font-black text-xl flex items-center justify-center border-2 border-black shadow-[0_0_12px_#ffffff]"
          >
            {playerName ? playerName.charAt(0).toUpperCase() : "J"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">JUGADOR</span>
              <span className="bg-[#00f3ff] text-black font-black text-[10px] px-2 py-0.5 uppercase border border-black font-space">
                {tableName}
              </span>
            </div>
            <h2 className="text-xl font-black text-white uppercase mt-0.5">{playerName}</h2>
          </div>
        </div>

        {/* Última Balota Cantada */}
        <div className="text-right">
          <span className="text-[10px] text-[#00f3ff] font-black uppercase tracking-wider block">ÚLTIMA BALOTA</span>
          <div className="text-3xl font-black text-[#ffb700] font-space drop-shadow-[0_2px_8px_rgba(255,183,0,0.6)]">
            {currentBall ? currentBall : "--"}
          </div>
        </div>
      </div>

      {/* Cartón 5x5 Cyber Arcade */}
      <div className="arcade-card-glass border-4 border-[#00f3ff] p-3.5 arcade-glow-cyan">
        
        {/* Cabecera B-I-N-G-O con Colores Neón */}
        <div className="grid grid-cols-5 gap-2 mb-2">
          {columns.map((col) => (
            <div
              key={col.letter}
              style={{ backgroundColor: col.color, color: col.text }}
              className="font-black text-2xl py-2 text-center border-2 border-black uppercase font-syne shadow-[2px_2px_0px_0px_#000000]"
            >
              {col.letter}
            </div>
          ))}
        </div>

        {/* Grilla 5x5 Interactivas */}
        <div className="grid grid-cols-5 gap-2">
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
                  onClick={() => onToggleCell(rIdx, cIdx)}
                  className={`aspect-square flex flex-col items-center justify-center relative font-black text-2xl transition-all cursor-pointer ${
                    isFree
                      ? "bg-[#ffb700] text-black border-4 border-black shadow-[0_0_12px_#ffb700] scale-[0.98]"
                      : isMarked
                      ? "bg-[#ff007f] text-white border-4 border-white shadow-[0_0_15px_#ff007f] scale-[0.98]"
                      : isDrawn
                      ? "bg-[#120a26] text-[#00f3ff] border-4 border-[#00f3ff] shadow-[0_0_10px_#00f3ff] animate-pulse"
                      : "bg-[#090514] text-white border-2 border-slate-700 hover:border-[#00f3ff]"
                  }`}
                >
                  {isFree ? (
                    <div className="flex flex-col items-center justify-center leading-none">
                      <Star size={22} fill="currentColor" />
                      <span className="text-[9px] font-black tracking-tighter mt-1">FREE</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-space font-black">{cell.val}</span>
                      {isMarked && (
                        <Check size={20} className="absolute top-1 right-1 stroke-[4] text-white" />
                      )}
                    </>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Botón Masivo CANTAR BINGO en Oro Cyber */}
      <button
        id="player-claim-bingo-btn"
        onClick={handleBingoClick}
        className="w-full bg-gradient-to-r from-[#ffb700] to-[#00ff88] hover:opacity-95 text-black font-black text-2xl py-4 border-4 border-black uppercase tracking-wider arcade-glow-gold active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 mt-2"
      >
        <Trophy size={28} className="stroke-[3]" /> ¡CANTAR BINGO!
      </button>
    </div>
  );
}
