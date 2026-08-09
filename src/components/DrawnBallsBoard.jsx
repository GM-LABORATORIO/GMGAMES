import React from "react";
import { getLetterForNumber } from "../utils/bingoLogic";

export default function DrawnBallsBoard({ drawnBalls = [], currentBall }) {
  const drawnSet = new Set(drawnBalls);

  const columns = [
    { letter: "B", min: 1, max: 15 },
    { letter: "I", min: 16, max: 30 },
    { letter: "N", min: 31, max: 45 },
    { letter: "G", min: 46, max: 60 },
    { letter: "O", min: 61, max: 75 }
  ];

  return (
    <div className="drawn-board-container glass-panel">
      <h3 className="section-title text-center mb-3">Tablero de Balotas (1 - 75)</h3>

      <div className="drawn-board-rows">
        {columns.map((col) => (
          <div key={col.letter} className="drawn-row">
            <div className={`drawn-row-header ${col.letter.toLowerCase()}`}>
              {col.letter}
            </div>
            <div className="drawn-row-numbers">
              {Array.from({ length: col.max - col.min + 1 }, (_, i) => col.min + i).map(
                (num) => {
                  const isDrawn = drawnSet.has(num);
                  const isCurrent = num === currentBall;
                  return (
                    <div
                      key={num}
                      className={`board-ball-badge ${
                        isDrawn ? `drawn ${col.letter.toLowerCase()}` : "undrawn"
                      } ${isCurrent ? "current-pulse" : ""}`}
                    >
                      {num}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
