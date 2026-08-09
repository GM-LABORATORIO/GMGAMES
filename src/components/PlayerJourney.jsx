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
    <div className="min-h-screen bg-[#090d16] text-white font-syne p-4 md:p-8 flex items-center justify-center select-none relative overflow-hidden">
      
      <div className="max-w-xl w-full mx-auto relative z-10">
        
        {/* Barra de Progreso JUNTOS JUGAMOS */}
        <div className="flex items-center justify-between mb-6 bg-[#101726] border-4 border-white p-2.5 brutal-shadow-yellow">
          {[
            { id: 1, label: "NOMBRE" },
            { id: 2, label: "COLOR NEÓN" },
            { id: 3, label: "CARTÓN" },
            { id: 4, label: "¡LISTO!" }
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <div
                style={{
                  backgroundColor: step >= s.id ? "#ffcc00" : "#1e293b",
                  color: step >= s.id ? "#000000" : "#94a3b8"
                }}
                className={`w-8 h-8 rounded-none font-black text-xs flex items-center justify-center border-2 border-black transition-all ${
                  step === s.id ? "scale-110 shadow-[2px_2px_0px_#fff]" : ""
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
          <div className="bg-[#101726] border-4 border-[#ffcc00] p-8 brutal-shadow-white animate-fadeIn space-y-6">
            <div className="text-center">
              <span className="bg-[#ffcc00] text-black font-black px-3 py-1 text-xs uppercase tracking-widest border border-black inline-block mb-3">
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
                <label className="block text-xs font-black text-[#ffcc00] uppercase mb-2">NOMBRE / APODO:</label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={20}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="EJ: BRUNO LOAIZA"
                  className="w-full bg-[#090d16] border-2 border-white text-white px-5 py-4 font-black text-xl focus:outline-none uppercase focus:border-[#ffcc00]"
                />
              </div>

              <button
                type="submit"
                disabled={!playerName.trim()}
                className="w-full bg-[#ffcc00] hover:bg-yellow-300 text-black font-black text-xl py-4 border-4 border-black uppercase tracking-wider brutal-shadow-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                CONTINUAR AL COLOR NEÓN <ArrowRight size={20} />
              </button>
            </form>
          </div>
        )}

        {/* ESCENA 2: ELECCIÓN DE COLOR NEÓN */}
        {step === 2 && (
          <div className="bg-[#101726] border-4 border-white p-8 animate-fadeIn space-y-6 brutal-shadow-yellow">
            <div className="text-center">
              <span className="bg-[#ffcc00] text-black font-black px-3 py-1 text-xs uppercase tracking-widest border border-black inline-block mb-3">
                PASO 2 DE 4 // TEMA PERSONAL
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                ELIGE TU COLOR NEÓN
              </h2>
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
                      color: color.text
                    }}
                    className={`p-3 font-black text-xs uppercase border-4 border-black flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected ? "scale-105 brutal-shadow-white" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {isSelected ? <Check size={18} className="stroke-[4]" /> : <Heart size={16} />}
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-800 text-slate-300 font-bold py-4 text-xs uppercase border border-slate-700 cursor-pointer"
              >
                ATRÁS
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 bg-[#ffcc00] hover:bg-yellow-300 text-black font-black text-xl py-4 border-4 border-black uppercase tracking-wider flex items-center justify-center gap-2 brutal-shadow-white cursor-pointer"
              >
                ELEGIR CARTÓN <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ESCENA 3: SELECCIÓN DE CARTÓN 1 AL 10 CON EXCLUSIVIDAD */}
        {step === 3 && (
          <div className="bg-[#101726] border-4 border-[#ffcc00] p-8 animate-fadeIn space-y-6 brutal-shadow-white">
            <div className="text-center">
              <span className="bg-[#ffcc00] text-black font-black px-3 py-1 text-xs uppercase tracking-widest border border-black inline-block mb-3">
                PASO 3 DE 4 // SELECCIÓN DE TABLA
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                ELIGE TU TABLA (1 AL 10)
              </h2>
            </div>

            {/* Selector de Tabla */}
            <div className="flex justify-between items-center bg-[#090d16] border-2 border-white p-2.5">
              <button
                onClick={() => setSelectedTableId((prev) => (prev > 1 ? prev - 1 : 10))}
                className="bg-slate-800 text-white font-black px-4 py-2 border border-slate-600 text-sm cursor-pointer"
              >
                ◄ ANTERIOR
              </button>

              <div className="text-center">
                <span className="font-black text-xl font-space block text-[#ffcc00]">
                  TABLA #{selectedTableId}
                </span>
                {isCurrentTableOccupied && (
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 font-black uppercase inline-flex items-center gap-1 border border-black">
                    <Lock size={10} /> OCUPADA POR {occupiedByName}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedTableId((prev) => (prev < 10 ? prev + 1 : 1))}
                className="bg-slate-800 text-white font-black px-4 py-2 border border-slate-600 text-sm cursor-pointer"
              >
                SIGUIENTE ►
              </button>
            </div>

            {/* Banner si la tabla está ocupada */}
            {isCurrentTableOccupied && (
              <div className="bg-red-600 text-white font-black p-3 border-2 border-black text-center text-xs uppercase tracking-wider animate-bounce flex items-center justify-center gap-2">
                <AlertTriangle size={18} />
                <span>ESTA TABLA YA FUE ELEGIDA POR {occupiedByName}. POR FAVOR ELIGE OTRA.</span>
              </div>
            )}

            {/* Previsualización 5x5 */}
            <div className="bg-[#090d16] border-2 border-white p-3">
              <div className="grid grid-cols-5 gap-1 mb-1 text-center font-black text-xs">
                <div className="bg-[#ffcc00] text-black py-0.5 border border-black">B</div>
                <div className="bg-white text-black py-0.5 border border-black">I</div>
                <div className="bg-[#ffcc00] text-black py-0.5 border border-black">N</div>
                <div className="bg-white text-black py-0.5 border border-black">G</div>
                <div className="bg-[#ffcc00] text-black py-0.5 border border-black">O</div>
              </div>

              <div className="grid grid-cols-5 gap-1 opacity-90">
                {cardMatrixPreview.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      style={{
                        backgroundColor: cell.val === "FREE" ? "#ffcc00" : "#101726",
                        color: cell.val === "FREE" ? "#000000" : "#ffffff",
                        borderColor: cell.val === "FREE" ? "#000000" : "#334155"
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
                className="w-1/3 bg-slate-800 text-slate-300 font-bold py-4 text-xs uppercase border border-slate-700 cursor-pointer"
              >
                ATRÁS
              </button>
              <button
                onClick={() => !isCurrentTableOccupied && setStep(4)}
                disabled={isCurrentTableOccupied}
                className="w-2/3 bg-[#ffcc00] hover:bg-yellow-300 text-black font-black text-xl py-4 border-4 border-black uppercase tracking-wider flex items-center justify-center gap-2 brutal-shadow-white cursor-pointer disabled:opacity-50"
              >
                {isCurrentTableOccupied ? "TABLA OCUPADA" : "CONFIRMAR TABLA"} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ESCENA 4: CONFIRMACIÓN ¡LISTO PARA JUGAR! */}
        {step === 4 && (
          <div className="bg-[#101726] border-4 border-[#ffcc00] p-8 animate-fadeIn text-center space-y-6 brutal-shadow-white">
            <div className="inline-block p-4 bg-[#090d16] border-4 border-white rounded-full animate-bounce">
              <Trophy size={48} className="text-[#ffcc00]" />
            </div>

            <div>
              <span className="bg-[#ffcc00] text-black font-black px-4 py-1 text-xs uppercase tracking-widest border border-black inline-block mb-2">
                ¡LISTO PARA EL BINGO FAMILIAR!
              </span>
              <h2 className="text-4xl font-black text-white uppercase">
                {playerName}
              </h2>
              <p className="text-xs text-slate-300 font-bold mt-1 uppercase">
                SELECCIONASTE LA <span className="text-[#ffcc00]">TABLA #{selectedTableId}</span> CON TEMA NEÓN <span className="text-[#ffcc00]">{activeTheme.name}</span>
              </p>
            </div>

            <button
              onClick={handleFinishJourney}
              className="w-full bg-[#ffcc00] hover:bg-yellow-300 text-black font-black text-2xl py-5 border-4 border-black uppercase tracking-wider flex items-center justify-center gap-3 brutal-shadow-white animate-pulse cursor-pointer"
            >
              ¡EMPEZAR A JUGAR AHORA! 🎮
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
