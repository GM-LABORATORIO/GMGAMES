import React, { useState } from "react";
import { getPresetCard } from "../utils/bingoLogic";
import { getPlayerNeonTheme, NEON_THEMES } from "../utils/themeEngine";
import { Sparkles, ArrowRight, Check, Trophy, Heart, Lock, AlertTriangle } from "lucide-react";

export const NEON_COLORS = Object.values(NEON_THEMES);

export default function PlayerJourney({
  initialRoomCode = "",
  occupiedTables = {},
  onCompleteJourney
}) {
  const [step, setStep] = useState(1);
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState(NEON_COLORS[0]);
  const [selectedTableId, setSelectedTableId] = useState(1);

  const activeTheme = getPlayerNeonTheme(selectedColor);
  const cardMatrixPreview = getPresetCard(selectedTableId);

  const isCurrentTableOccupied = Boolean(occupiedTables[selectedTableId]);
  const occupiedByName = occupiedTables[selectedTableId] || "";

  const handleNextFromStep1 = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    setStep(2);
  };

  const handleFinishJourney = () => {
    if (isCurrentTableOccupied) return;

    onCompleteJourney({
      playerName: playerName.trim(),
      playerColor: selectedColor,
      tableId: selectedTableId,
      tableName: `Tabla #${selectedTableId}`,
      card: cardMatrixPreview
    });
  };

  return (
    <div className="min-h-screen bg-[#06070d] text-white font-syne p-4 md:p-8 flex items-center justify-center select-none relative overflow-hidden">
      
      <div className="max-w-xl w-full mx-auto relative z-10">
        
        {/* Barra de Progreso JUNTOS JUGAMOS */}
        <div className="flex items-center justify-between mb-6 glass-panel p-3 rounded-2xl border border-white/15">
          {[
            { id: 1, label: "NOMBRE" },
            { id: 2, label: "COLOR NEÓN" },
            { id: 3, label: "CARTÓN" },
            { id: 4, label: "¡LISTO!" }
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <div
                style={{
                  backgroundColor: step >= s.id ? activeTheme.hex : "#1e293b",
                  color: step >= s.id ? activeTheme.text : "#94a3b8"
                }}
                className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center border border-black transition-all ${
                  step === s.id ? "scale-110 shadow-[0_0_12px_#00ff88]" : ""
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
          <div className="glass-panel border border-[#00ff88]/40 p-8 rounded-2xl animate-fadeIn space-y-6 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
            <div className="text-center">
              <span className="bg-[#00ff88] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-full inline-block mb-3">
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
                <label className="block text-xs font-black text-[#00ff88] uppercase mb-2">NOMBRE / APODO:</label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={20}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="EJ: BRUNO LOAIZA"
                  className="w-full bg-[#06070d] border border-white/20 text-white rounded-xl px-5 py-4 font-black text-xl focus:outline-none uppercase focus:border-[#00ff88]"
                />
              </div>

              <button
                type="submit"
                disabled={!playerName.trim()}
                className="w-full bg-gradient-to-r from-[#00ff88] to-[#00f3ff] hover:opacity-90 text-black font-black text-xl py-4 rounded-xl uppercase tracking-wider shadow-[0_0_25px_rgba(0,255,136,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                CONTINUAR AL COLOR NEÓN <ArrowRight size={20} />
              </button>
            </form>
          </div>
        )}

        {/* ESCENA 2: ELECCIÓN DE COLOR NEÓN PERSONALIZADO */}
        {step === 2 && (
          <div className="glass-panel border border-white/20 p-8 rounded-2xl animate-fadeIn space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="text-center">
              <span className="bg-[#00ff88] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-full inline-block mb-3">
                PASO 2 DE 4 // TEMA PERSONALIZADO
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                ELIGE TU COLOR NEÓN FAVORITO
              </h2>
              <p className="text-xs text-slate-300 font-bold mt-1 uppercase">
                TU CARTÓN SE PERSONALIZARÁ EN VIVO CON ESTE COLOR
              </p>
            </div>

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
                      boxShadow: isSelected ? color.glowStrong : "none"
                    }}
                    className={`p-4 font-black text-xs uppercase rounded-xl border border-black flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected ? "scale-105 border-2 border-white" : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    {isSelected ? <Check size={20} className="stroke-[4]" /> : <Heart size={18} />}
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-white/10 text-slate-300 font-bold py-4 text-xs uppercase border border-white/10 rounded-xl cursor-pointer"
              >
                ATRÁS
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  background: `linear-gradient(90deg, ${activeTheme.hex}, #00f3ff)`,
                  color: "#000000"
                }}
                className="w-2/3 hover:opacity-90 font-black text-xl py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.3)] cursor-pointer"
              >
                ELEGIR CARTÓN <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ESCENA 3: SELECCIÓN DE CARTÓN 1 AL 10 CON PREVISUALIZACIÓN NEÓN */}
        {step === 3 && (
          <div className="glass-panel border border-white/20 p-8 rounded-2xl animate-fadeIn space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="text-center">
              <span className="bg-[#00ff88] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-full inline-block mb-3">
                PASO 3 DE 4 // SELECCIÓN DE TABLA
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                ELIGE TU TABLA (1 AL 10)
              </h2>
            </div>

            {/* Selector de Tabla */}
            <div className="flex justify-between items-center bg-[#06070d] border border-white/15 p-2.5 rounded-xl">
              <button
                onClick={() => setSelectedTableId((prev) => (prev > 1 ? prev - 1 : 10))}
                className="bg-white/10 hover:bg-white/20 text-white font-black px-4 py-2 border border-white/20 text-sm rounded-lg cursor-pointer"
              >
                ◄ ANTERIOR
              </button>

              <div className="text-center">
                <span
                  style={{ color: activeTheme.hex }}
                  className="font-black text-xl font-space block"
                >
                  TABLA #{selectedTableId}
                </span>
                {isCurrentTableOccupied && (
                  <span className="text-[10px] bg-red-600 text-white px-2.5 py-0.5 font-black uppercase inline-flex items-center gap-1 rounded-full border border-black">
                    <Lock size={10} /> OCUPADA POR {occupiedByName}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedTableId((prev) => (prev < 10 ? prev + 1 : 1))}
                className="bg-white/10 hover:bg-white/20 text-white font-black px-4 py-2 border border-white/20 text-sm rounded-lg cursor-pointer"
              >
                SIGUIENTE ►
              </button>
            </div>

            {/* Banner si la tabla está ocupada */}
            {isCurrentTableOccupied && (
              <div className="bg-red-600 text-white font-black p-3 rounded-xl border border-black text-center text-xs uppercase tracking-wider animate-bounce flex items-center justify-center gap-2">
                <AlertTriangle size={18} />
                <span>ESTA TABLA YA FUE ELEGIDA POR {occupiedByName}. POR FAVOR ELIGE OTRA.</span>
              </div>
            )}

            {/* Previsualización 5x5 Neón */}
            <div className="bg-[#06070d] border border-white/15 p-3 rounded-xl">
              <div className="grid grid-cols-5 gap-1 mb-1 text-center font-black text-xs">
                <div style={{ backgroundColor: activeTheme.hex, color: activeTheme.text }} className="py-0.5 rounded-md">B</div>
                <div className="bg-[#00f3ff] text-black py-0.5 rounded-md">I</div>
                <div className="bg-[#a855f7] text-white py-0.5 rounded-md">N</div>
                <div className="bg-[#ff007f] text-white py-0.5 rounded-md">G</div>
                <div style={{ backgroundColor: activeTheme.hex, color: activeTheme.text }} className="py-0.5 rounded-md">O</div>
              </div>

              <div className="grid grid-cols-5 gap-1 opacity-90">
                {cardMatrixPreview.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      style={{
                        backgroundColor: cell.val === "FREE" ? activeTheme.hex : "#0f111c",
                        color: cell.val === "FREE" ? activeTheme.text : "#ffffff",
                        borderColor: cell.val === "FREE" ? activeTheme.hex : "rgba(255,255,255,0.1)"
                      }}
                      className="aspect-square flex items-center justify-center font-black text-xs border rounded-md font-space"
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
                className="w-1/3 bg-white/10 text-slate-300 font-bold py-4 text-xs uppercase border border-white/10 rounded-xl cursor-pointer"
              >
                ATRÁS
              </button>
              <button
                onClick={() => !isCurrentTableOccupied && setStep(4)}
                disabled={isCurrentTableOccupied}
                style={{
                  background: `linear-gradient(90deg, ${activeTheme.hex}, #00f3ff)`,
                  color: "#000000"
                }}
                className="w-2/3 hover:opacity-90 font-black text-xl py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.3)] cursor-pointer disabled:opacity-50"
              >
                {isCurrentTableOccupied ? "TABLA OCUPADA" : "CONFIRMAR TABLA"} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ESCENA 4: CONFIRMACIÓN ¡LISTO PARA JUGAR! */}
        {step === 4 && (
          <div className="glass-panel border-2 border-[#00ff88] p-8 rounded-2xl animate-fadeIn text-center space-y-6 shadow-[0_0_40px_rgba(0,255,136,0.3)]">
            <div className="inline-block p-4 bg-[#06070d] border-2 border-[#00ff88] rounded-full animate-bounce">
              <Trophy size={48} className="text-[#00ff88]" />
            </div>

            <div>
              <span className="bg-[#00ff88] text-black font-black px-4 py-1 text-xs uppercase tracking-widest rounded-full inline-block mb-2">
                ¡LISTO PARA EL BINGO FAMILIAR!
              </span>
              <h2 className="text-4xl font-black text-white uppercase">
                {playerName}
              </h2>
              <p className="text-xs text-slate-300 font-bold mt-1 uppercase">
                SELECCIONASTE LA <span className="text-[#00ff88]">TABLA #{selectedTableId}</span> CON TEMA NEÓN <span style={{ color: activeTheme.hex }}>{activeTheme.name}</span>
              </p>
            </div>

            <button
              onClick={handleFinishJourney}
              style={{
                background: `linear-gradient(90deg, ${activeTheme.hex}, #00f3ff)`,
                color: "#000000"
              }}
              className="w-full hover:opacity-90 font-black text-2xl py-5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,136,0.5)] animate-pulse cursor-pointer"
            >
              ¡EMPEZAR A JUGAR AHORA! 🎮
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
