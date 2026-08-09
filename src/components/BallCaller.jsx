import React, { useState, useEffect } from "react";
import { getLetterForNumber } from "../utils/bingoLogic";
import { Play, Pause, RefreshCw, Volume2, Sparkles } from "lucide-react";

export default function BallCaller({
  currentBall,
  drawnBallsCount,
  availableCount,
  isHost,
  onDrawNextBall,
  onResetGame
}) {
  const [autoDraw, setAutoDraw] = useState(false);
  const [intervalSec, setIntervalSec] = useState(4);
  const [isShaking, setIsShaking] = useState(false);

  // Auto-draw effect para el Host
  useEffect(() => {
    let timer = null;
    if (autoDraw && isHost && availableCount > 0) {
      timer = setInterval(() => {
        triggerDraw();
      }, intervalSec * 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoDraw, isHost, availableCount, intervalSec]);

  // Voz hablada para cantar números
  useEffect(() => {
    if (currentBall && "speechSynthesis" in window) {
      const letter = getLetterForNumber(currentBall);
      const text = `${letter}, ${currentBall}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [currentBall]);

  const triggerDraw = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      onDrawNextBall();
    }, 400);
  };

  const letter = getLetterForNumber(currentBall);

  return (
    <div className="ball-caller-card glass-panel text-center">
      <h3 className="section-title">
        <Sparkles size={18} className="inline-icon" /> Balotera Hackathon
      </h3>

      <div className="ball-display-container my-4">
        {currentBall ? (
          <div className={`bingo-ball-main ${letter.toLowerCase()} ${isShaking ? "shaking" : ""}`}>
            <span className="ball-letter">{letter}</span>
            <span className="ball-number">{currentBall}</span>
          </div>
        ) : (
          <div className="bingo-ball-placeholder">
            <span>READY</span>
          </div>
        )}
      </div>

      <div className="ball-stats">
        <span>Balotas cantadas: <strong>{drawnBallsCount} / 75</strong></span>
      </div>

      {isHost && (
        <div className="host-controls mt-4">
          <button
            id="draw-ball-btn"
            className="btn btn-primary w-full"
            onClick={triggerDraw}
            disabled={availableCount === 0 || isShaking}
          >
            <Play size={18} /> {availableCount === 0 ? "Sin Balotas" : "Sacar Siguiente Balota"}
          </button>

          <div className="auto-draw-box mt-3">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoDraw}
                onChange={(e) => setAutoDraw(e.target.checked)}
                disabled={availableCount === 0}
              />
              <span>Auto-Extracción ({intervalSec}s)</span>
            </label>

            <select
              className="select-field ml-2"
              value={intervalSec}
              onChange={(e) => setIntervalSec(Number(e.target.value))}
              disabled={autoDraw}
            >
              <option value={3}>3 Segundos</option>
              <option value={4}>4 Segundos</option>
              <option value={6}>6 Segundos</option>
            </select>
          </div>

          <button
            id="reset-game-btn"
            className="btn btn-danger-outline w-full mt-3"
            onClick={onResetGame}
          >
            <RefreshCw size={16} /> Reiniciar Partida
          </button>
        </div>
      )}
    </div>
  );
}
