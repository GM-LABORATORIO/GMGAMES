import React, { useState } from "react";
import { getPresetCard } from "../utils/bingoLogic";
import { getPlayerNeonTheme, NEON_THEMES } from "../utils/themeEngine";
import { Sparkles, ArrowRight, Check, Trophy, Heart, Shield, RefreshCw } from "lucide-react";

export const NEON_COLORS = Object.values(NEON_THEMES);

export default function PlayerJourney({ initialRoomCode = "", onCompleteJourney }) {
  const [step, setStep] = useState(1);
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState(NEON_COLORS[0]);
  const [selectedTableId, setSelectedTableId] = useState(1);

  const activeTheme = getPlayerNeonTheme(selectedColor);
  const cardMatrixPreview = getPresetCard(selectedTableId);

  const handleNextFromStep1 = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    setStep(2);
  };

  const handleFinishJourney = () => {
    onCompleteJourney({
      playerName: playerName.trim(),
      playerColor: selectedColor,
      tableId: selectedTableId,
      tableName: `Tabla #${selectedTableId}`,
      card: cardMatrixPreview
    });
  };

  return (
    <div className="min-h-screen bg-[#090514] text-white font-syne p-4 md:p-8 flex items-center justify-center select-none relative overflow-hidden">
      {/* Background Arcade Casino */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center" style={{ backgroundImage: "url('/tv_casino_bg.png')" }} />

      <div className="max-w-xl w-full mx-auto relative z-10">
        
        {/* Barra de Progreso del Journey (4 Escenas) */}
        <div className="flex items-center justify-between mb-6 bg-[#120a26] border-2 border-slate-800 p-2 brutal-shadow-white">
          {[
            { id: 1, label: "NOMBRE" },
            { id: 2, label: "COLOR NEÓN" },
            { id: 3, label: "CARTÓN" },
            { id: 4, label: "¡LISTO!" }
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-1">
              <div
                style={{
                  backgroundColor: step >= s.id ? activeTheme.hex : "#1e293b",
                  color: step >= s.id ? activeTheme.text : "#94a3b8"
                }}
                className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center border transition-all ${
                  step === s.id ? "border-white scale-110 shadow-[0_0_10px_#ffffff]" : "border-black"
                }`}
              >
                {s.id}
              </div>
              <span className={`text-[10px] font-black uppercase hidden sm:inline-block ${step >= s.id ? "text-white" : "text-slate-500"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ESCENA 1: REGISTRO DE NOMBRE DE JUGADOR */}
        {step === 1 && (
          <div className="arcade-card-glass border-4 border-[#00f3ff] p-8 arcade-glow-cyan animate-fadeIn space-y-6">
            <div className="text-center">
              <span className="bg-[#00f3ff] text-black font-black px-3 py-1 text-xs uppercase tracking-widest border border-black inline-block mb-3">
                PASO 1 DE 4 // INGRESO
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                ¿CUÁL ES TU NOMBRE DE JUGADOR?
              </h2>
              <p className="text-xs text-slate-300 font-bold mt-1 uppercase">
                APARECERÁ EN LA TV DE LA FAMILIA LOAIZA SILLE
              </p>
            </div>

            <form onSubmit={handleNextFromStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#00f3ff] uppercase mb-2">NOMBRE / APODO:</label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={20}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="EJ: BRUNO LOAIZA"
                  className="w-full bg-[#090514] border-2 border-[#00f3ff] text-white px-5 py-4 font-black text-xl focus:outline-none uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={!playerName.trim()}
                className="w-full bg-gradient-to-r from-[#00f3ff] to-[#00ff88] text-black font-black text-xl py-4 border-4 border-black uppercase tracking-wider arcade-glow-cyan flex items-center justify-center gap-2 disabled:opacity-40"
              >
                CONTINUAR AL COLOR NEÓN <ArrowRight size={20} />
              </button>
            </form>
          </div>
        )}

        {/* ESCENA 2: ELECCIÓN DE COLOR NEÓN CON PREVISUALIZACIÓN DE TEMA EN TIEMPO REAL */}
        {step === 2 && (
          <div
            style={{
              borderColor: activeTheme.borderColor,
              boxShadow: activeTheme.glow
            }}
            className="arcade-card-glass border-4 p-8 animate-fadeIn space-y-6 transition-all duration-300"
          >
            <div className="text-center">
              <span
                style={{ backgroundColor: activeTheme.hex, color: activeTheme.text }}
                className="font-black px-3 py-1 text-xs uppercase tracking-widest border border-black inline-block mb-3"
              >
                PASO 2 DE 4 // TEMA PERSONALIZADO
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                ELIGE TU COLOR NEÓN
              </h2>
              <p className="text-xs text-slate-300 font-bold mt-1 uppercase">
                TU CARTÓN Y TU INTERFAZ ADOPTARÁN ESTE COLOR
              </p>
            </div>

            {/* Grid de Colores Neón */}
            <div className="grid grid-cols-3 gap-3">
              {NEON_COLORS.map((color) => {
                const isSelected = selectedColor.id === color.id;

                return (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      backgroundColor: color.hex,
                      color: color.text,
                      boxShadow: isSelected ? color.glowStrong : "none",
                      transform: isSelected ? "scale(1.05)" : "scale(1)"
                    }}
                    className={`p-3 font-black text-xs uppercase border-2 border-black flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected ? "border-4 border-white shadow-lg" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {isSelected ? <Check size={18} className="stroke-[4]" /> : <Heart size={16} />}
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Previsualización del Tema Neón */}
            <div className="bg-[#090514] border-2 border-slate-700 p-4 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">VISTA PREVIA DE TU TEMA</span>
              <div className="flex items-center justify-center gap-3">
                <span
                  style={{ backgroundColor: activeTheme.hex, color: activeTheme.text }}
                  className="font-black text-xs px-3 py-1 uppercase border border-black font-space"
                >
                  {playerName}
                </span>
                <span
                  style={{ borderColor: activeTheme.borderColor, color: activeTheme.hex }}
                  className="font-black text-xs px-3 py-1 border-2 uppercase"
                >
                  CARTÓN TEMA NEÓN
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-800 text-slate-300 font-bold py-4 text-xs uppercase border border-slate-700"
              >
                ATRÁS
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  boxShadow: activeTheme.glowStrong,
                  backgroundColor: activeTheme.hex,
                  color: activeTheme.text
                }}
                className="w-2/3 font-black text-xl py-4 border-4 border-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                ELEGIR CARTÓN <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ESCENA 3: SELECCIÓN DE CARTÓN 1 AL 10 CON MATRIZ PREVIA */}
        {step === 3 && (
          <div
            style={{
              borderColor: activeTheme.borderColor,
              boxShadow: activeTheme.glow
            }}
            className="arcade-card-glass border-4 p-8 animate-fadeIn space-y-6 transition-all duration-300"
          >
            <div className="text-center">
              <span
                style={{ backgroundColor: activeTheme.hex, color: activeTheme.text }}
                className="font-black px-3 py-1 text-xs uppercase tracking-widest border border-black inline-block mb-3"
              >
                PASO 3 DE 4 // SELECCIÓN DE TABLA
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                ELIGE TU TABLA (1 AL 10)
              </h2>
            </div>

            {/* Selector de Tabla (1 a 10) */}
            <div className="flex justify-between items-center bg-[#090514] border-2 border-slate-700 p-2">
              <button
                onClick={() => setSelectedTableId((prev) => (prev > 1 ? prev - 1 : 10))}
                className="bg-slate-800 text-white font-black px-4 py-2 border border-slate-600 text-sm"
              >
                ◄ ANTERIOR
              </button>
              <span
                style={{ color: activeTheme.hex }}
                className="font-black text-xl font-space"
              >
                TABLA #{selectedTableId}
              </span>
              <button
                onClick={() => setSelectedTableId((prev) => (prev < 10 ? prev + 1 : 1))}
                className="bg-slate-800 text-white font-black px-4 py-2 border border-slate-600 text-sm"
              >
                SIGUIENTE ►
              </button>
            </div>

            {/* Previsualización 5x5 de la Tabla Elegida */}
            <div className="bg-[#120a26] border-2 border-slate-700 p-3">
              <div className="grid grid-cols-5 gap-1 mb-1 text-center font-black text-xs">
                <div className="bg-[#ff0055] text-white py-0.5 border border-black">B</div>
                <div className="bg-[#ffb700] text-black py-0.5 border border-black">I</div>
                <div className="bg-[#00f3ff] text-black py-0.5 border border-black">N</div>
                <div className="bg-[#00ff88] text-black py-0.5 border border-black">G</div>
                <div className="bg-[#a855f7] text-white py-0.5 border border-black">O</div>
              </div>

              <div className="grid grid-cols-5 gap-1">
                {cardMatrixPreview.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      style={{
                        backgroundColor: cell.val === "FREE" ? activeTheme.hex : "#090514",
                        color: cell.val === "FREE" ? activeTheme.text : "#ffffff",
                        borderColor: cell.val === "FREE" ? activeTheme.borderColor : "#334155"
                      }}
                      className="aspect-square flex items-center justify-center font-black text-xs border font-space"
                    >
                      {cell.val}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 bg-slate-800 text-slate-300 font-bold py-4 text-xs uppercase border border-slate-700"
              >
                ATRÁS
              </button>
              <button
                onClick={() => setStep(4)}
                style={{
                  boxShadow: activeTheme.glowStrong,
                  backgroundColor: activeTheme.hex,
                  color: activeTheme.text
                }}
                className="w-2/3 font-black text-xl py-4 border-4 border-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                CONFIRMAR TABLA <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ESCENA 4: CONFIRMACIÓN Y ESTADO ¡LISTO PARA JUGAR! */}
        {step === 4 && (
          <div
            style={{
              borderColor: activeTheme.borderColor,
              boxShadow: activeTheme.glowStrong
            }}
            className="arcade-card-glass border-4 p-8 animate-fadeIn text-center space-y-6 transition-all duration-300"
          >
            <div className="inline-block p-4 bg-[#090514] border-4 border-white rounded-full animate-bounce">
              <Trophy size={48} style={{ color: activeTheme.hex }} />
            </div>

            <div>
              <span
                style={{ backgroundColor: activeTheme.hex, color: activeTheme.text }}
                className="font-black px-4 py-1 text-xs uppercase tracking-widest border border-black inline-block mb-2"
              >
                ¡LISTO PARA EL BINGO FAMILIAR!
              </span>
              <h2 className="text-4xl font-black text-white uppercase">
                {playerName}
              </h2>
              <p className="text-xs text-slate-300 font-bold mt-1 uppercase">
                SELECCIONASTE LA <span style={{ color: activeTheme.hex }}>TABLA #{selectedTableId}</span> CON TEMA NEÓN <span style={{ color: activeTheme.hex }}>{activeTheme.name}</span>
              </p>
            </div>

            <button
              onClick={handleFinishJourney}
              style={{
                boxShadow: activeTheme.glowStrong,
                backgroundColor: activeTheme.hex,
                color: activeTheme.text
              }}
              className="w-full font-black text-2xl py-5 border-4 border-black uppercase tracking-wider animate-pulse flex items-center justify-center gap-3"
            >
              ¡EMPEZAR A JUGAR AHORA! 🎮
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
