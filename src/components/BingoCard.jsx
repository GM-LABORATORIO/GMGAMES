import React from "react";
import { CheckCircle2, Star, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

export default function BingoCard({ card, onToggleCell, onClaimBingo, drawnBalls = [] }) {
  if (!card || card.length === 0) return null;

  const drawnSet = new Set(drawnBalls);

  const handleBingoClaim = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    onClaimBingo();
  };

  return (
    <div className="bingo-card-wrapper glass-panel">
      <div className="bingo-card-header">
        <div className="bingo-col-header b">B</div>
        <div className="bingo-col-header i">I</div>
        <div className="bingo-col-header n">N</div>
        <div className="bingo-col-header g">G</div>
        <div className="bingo-col-header o">O</div>
      </div>

      <div className="bingo-grid">
        {card.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isFree = cell.val === "FREE";
            const isDrawn = !isFree && drawnSet.has(cell.val);
            const isMarked = cell.marked;

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                id={`bingo-cell-${rIdx}-${cIdx}`}
                className={`bingo-cell ${isMarked ? "marked" : ""} ${isFree ? "free-cell" : ""} ${
                  isDrawn && !isMarked ? "drawn-unmarked" : ""
                }`}
                onClick={() => onToggleCell(rIdx, cIdx)}
              >
                {isFree ? (
                  <div className="free-content">
                    <Star size={20} className="star-icon" />
                    <span>FREE</span>
                  </div>
                ) : (
                  <>
                    <span className="cell-num">{cell.val}</span>
                    {isMarked && <CheckCircle2 size={16} className="mark-check" />}
                    {isDrawn && !isMarked && <span className="pulse-indicator" />}
                  </>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="card-footer">
        <button
          id="claim-bingo-btn"
          className="btn btn-gold w-full mt-4 btn-bingo-pulse"
          onClick={handleBingoClaim}
        >
          <Trophy size={22} /> ¡CANTAR BINGO!
        </button>
      </div>
    </div>
  );
}
