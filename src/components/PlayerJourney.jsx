import React, { useState } from "react";
import { PRESET_TABLES, getPresetCard } from "../utils/bingoLogic";
import { Sparkles, User, Palette, Grid, CheckCircle2, ArrowRight, Check } from "lucide-react";

export const NEON_COLORS = [
  { id: "yellow", name: "Amarillo Neón", hex: "#ffe600", text: "#000000" },
  { id: "cyan", name: "Cian Eléctrico", hex: "#00f3ff", text: "#000000" },
  { id: "magenta", name: "Magenta Cyber", hex: "#ff00aa", text: "#ffffff" },
  { id: "green", name: "Verde Ácido", hex: "#00ff88", text: "#000000" },
  { id: "orange", name: "Naranja Fuego", hex: "#ff7700", text: "#000000" },
  { id: "purple", name: "Púrpura Neón", hex: "#9d4edd", text: "#ffffff" }
];

export default function PlayerJourney({ onCompleteJourney, initialRoomCode = "" }) {
  const [step, setStep] = useState(1); // 1: Nombre, 2: Color, 3: Cartón, 4: Listo
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState(NEON_COLORS[0]);
  const [selectedTableId, setSelectedTableId] = useState(1);

  const selectedTable = PRESET_TABLES.find((t) => t.id === selectedTableId) || PRESET_TABLES[0];

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handleNextStep3 = () => {
    setStep(4);
  };

  const handleFinalStart = () => {
    const cardMatrix = getPresetCard(selectedTableId);
    onCompleteJourney({
      playerName: playerName.trim(),
      playerColor: selectedColor,
      tableId: selectedTable.id,
      tableName: selectedTable.name,
      card: cardMatrix,
      confirmedNumbers: [],
      isReady: true
    });
  };

  return (
    <div className="min-h-screen bg-[#040914] text-white font-syne p-4 flex flex-col justify-center items-center select-none">
      <div className="max-w-md w-full my-auto">
        
        {/* Progress Bar de Pasos */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-xs font-black px-3 py-1 border ${
                step === i
                  ? "bg-[#ffe600] text-black border-black brutal-shadow-sm-white"
                  : step > i
                  ? "bg-slate-800 text-[#ffe600] border-slate-700"
                  : "bg-[#081021] text-slate-600 border-slate-800"
              }`}
            >
              <span>PASO {i}</span>
              {step > i && <Check size={12} className="stroke-[4]" />}
            </div>
          ))}
        </div>

        {/* ESCENA 1: Nombre de Jugador */}
        {step === 1 && (
          <div className="bg-[#081021] border-4 border-slate-800 p-6 brutal-shadow-yellow animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-[#ffe600] text-black font-black px-3 py-1 text-xs tracking-widest border-2 border-white mb-2 uppercase">
                <User size={14} /> ESCENA 1 / 4
              </div>
              <h2 className="text-2xl font-black text-white uppercase border-b-2 border-slate-800 pb-2">
                ¿CUÁL ES TU NOMBRE?
              </h2>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
                IDENTIFÍCATE PARA APARECER EN LA TRANSMISIÓN TV
              </p>
            </div>

            <form onSubmit={handleNextStep1} className="space-y-4">
              <input
                type="text"
                className="w-full bg-[#040914] border-2 border-slate-700 focus:border-[#ffe600] text-white px-4 py-3 font-bold text-lg focus:outline-none uppercase"
                placeholder="EJ: BINGOMASTER99"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={18}
                autoFocus
              />

              <button
                type="submit"
                disabled={!playerName.trim()}
                className="w-full bg-[#ffe600] hover:bg-yellow-300 disabled:opacity-50 text-black font-black text-lg py-3.5 border-2 border-black uppercase tracking-wider brutal-shadow-sm-white flex items-center justify-center gap-2 mt-4"
              >
                SIGUIENTE: ELEGIR COLOR <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* ESCENA 2: Selección de Color Neón */}
        {step === 2 && (
          <div className="bg-[#081021] border-4 border-slate-800 p-6 brutal-shadow-yellow animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-[#ffe600] text-black font-black px-3 py-1 text-xs tracking-widest border-2 border-white mb-2 uppercase">
                <Palette size={14} /> ESCENA 2 / 4
              </div>
              <h2 className="text-2xl font-black text-white uppercase border-b-2 border-slate-800 pb-2">
                ELIGE TU COLOR NEÓN
              </h2>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
                TU FICHA RESALTARÁ CON ESTE COLOR EN LA PANTALLA
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {NEON_COLORS.map((c) => {
                const isSelected = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.hex, color: c.text }}
                    className={`py-4 font-black text-xs uppercase border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected ? "border-white scale-105 shadow-[0_0_15px_#ffffff] z-10" : "border-black opacity-80"
                    }`}
                  >
                    <span>{c.name}</span>
                    {isSelected && <CheckCircle2 size={16} />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextStep2}
              className="w-full bg-[#ffe600] hover:bg-yellow-300 text-black font-black text-lg py-3.5 border-2 border-black uppercase tracking-wider brutal-shadow-sm-white flex items-center justify-center gap-2"
            >
              SIGUIENTE: ELEGIR CARTÓN <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ESCENA 3: Selección de Cartón (1 al 10) */}
        {step === 3 && (
          <div className="bg-[#081021] border-4 border-slate-800 p-6 brutal-shadow-yellow animate-fadeIn">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-[#ffe600] text-black font-black px-3 py-1 text-xs tracking-widest border-2 border-white mb-2 uppercase">
                <Grid size={14} /> ESCENA 3 / 4
              </div>
              <h2 className="text-2xl font-black text-white uppercase border-b-2 border-slate-800 pb-2">
                ELIGE TU TABLA (1 - 10)
              </h2>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {PRESET_TABLES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTableId(t.id)}
                  className={`py-2 font-black text-xs border-2 transition-all ${
                    selectedTableId === t.id
                      ? "bg-[#ffe600] text-black border-black scale-105"
                      : "bg-[#040914] text-slate-400 border-slate-800"
                  }`}
                >
                  #{t.id}
                </button>
              ))}
            </div>

            {/* Preview de la Tabla */}
            <div className="bg-[#040914] border-2 border-[#ffe600] p-2 mb-4">
              <div className="text-xs font-black text-[#ffe600] text-center mb-2 uppercase">
                VISTA PREVIA: {selectedTable.name}
              </div>
              <div className="grid grid-cols-5 gap-1 text-center font-black">
                {["B", "I", "N", "G", "O"].map((l) => (
                  <div key={l} className="bg-[#ffe600] text-black text-xs py-0.5 border border-black">{l}</div>
                ))}
                {selectedTable.card.map((row, r) =>
                  row.map((cell, c) => (
                    <div key={`${r}-${c}`} className="aspect-square bg-[#081021] text-white text-xs border border-slate-800 flex items-center justify-center font-space">
                      {cell.val}
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={handleNextStep3}
              className="w-full bg-[#ffe600] hover:bg-yellow-300 text-black font-black text-lg py-3.5 border-2 border-black uppercase tracking-wider brutal-shadow-sm-white flex items-center justify-center gap-2"
            >
              SIGUIENTE: CONFIRMAR Y ESPERAR <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ESCENA 4: Confirmación y Estado LISTO PARA JUGAR */}
        {step === 4 && (
          <div className="bg-[#081021] border-4 border-[#ffe600] p-6 brutal-shadow-white animate-fadeIn text-center">
            <div className="inline-flex items-center gap-2 bg-[#ffe600] text-black font-black px-3 py-1 text-xs tracking-widest border-2 border-white mb-4 uppercase">
              <Sparkles size={14} /> ESCENA 4 / 4: RESUMEN DE JUGADOR
            </div>

            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-black text-2xl border-4 border-white shadow-[0_0_15px_#ffffff]" style={{ backgroundColor: selectedColor.hex, color: selectedColor.text }}>
              {playerName.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-2xl font-black text-white uppercase">{playerName}</h2>
            <p className="text-xs font-black text-[#ffe600] uppercase mt-1">
              {selectedTable.name} • COLOR {selectedColor.name}
            </p>

            <div className="my-6 border-y-2 border-slate-800 py-4">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider mb-1">
                ESTADO EN LA SALA
              </span>
              <div className="text-xl font-black text-[#00ff88] uppercase flex items-center justify-center gap-2">
                <CheckCircle2 size={24} /> ¡LISTO PARA JUGAR!
              </div>
            </div>

            <button
              onClick={handleFinalStart}
              className="w-full bg-[#ffe600] hover:bg-yellow-300 text-black font-black text-2xl py-4 border-4 border-black uppercase tracking-wider brutal-shadow-white active:translate-x-1 active:translate-y-1 transition-all"
            >
              ¡ENTRAR A LA SALA EN VIVO!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
