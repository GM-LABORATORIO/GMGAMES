import React, { useState } from "react";
import { PRESET_TABLES, getPresetCard } from "../utils/bingoLogic";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function TableSelectorModal({ onSelectTable, initialTableId = 1 }) {
  const [selectedTableId, setSelectedTableId] = useState(initialTableId);

  const selectedTable = PRESET_TABLES.find((t) => t.id === selectedTableId) || PRESET_TABLES[0];

  const handleConfirm = () => {
    const cardMatrix = getPresetCard(selectedTableId);
    onSelectTable({
      tableId: selectedTable.id,
      tableName: selectedTable.name,
      card: cardMatrix,
      confirmedNumbers: []
    });
  };

  return (
    <div className="min-h-screen bg-[#040914] text-white font-syne p-4 flex flex-col justify-between items-center select-none">
      <div className="max-w-md w-full my-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#ffe600] text-black font-black px-3 py-1 text-xs tracking-widest border-2 border-white mb-2 uppercase">
            <Sparkles size={14} /> SELECCIÓN DE TABLA
          </div>
          <h1 className="text-3xl font-black text-white uppercase border-b-4 border-[#ffe600] pb-2">
            ELIGE TU TABLA (1 - 10)
          </h1>
          <p className="text-xs text-slate-400 font-bold tracking-wider mt-1 uppercase">
            SELECCIONA TU CARTÓN DE LA SUERTE ANTES DE ENTRAR
          </p>
        </div>

        {/* Grid Selector 1 al 10 */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {PRESET_TABLES.map((table) => {
            const isSelected = table.id === selectedTableId;
            return (
              <button
                key={table.id}
                onClick={() => setSelectedTableId(table.id)}
                className={`py-3 font-black text-sm uppercase border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#ffe600] text-black border-black brutal-shadow-sm-white scale-105"
                    : "bg-[#081021] text-slate-300 border-slate-700 hover:border-[#ffe600]"
                }`}
              >
                #{table.id}
              </button>
            );
          })}
        </div>

        {/* Preview del Cartón 5x5 Elegido */}
        <div className="bg-[#081021] border-4 border-[#ffe600] p-3 brutal-shadow-yellow mb-6">
          <div className="flex justify-between items-center border-b-2 border-slate-800 pb-2 mb-3">
            <span className="text-xs font-black text-[#ffe600] uppercase tracking-wider">
              VISTA PREVIA: {selectedTable.name}
            </span>
            <CheckCircle2 size={16} className="text-[#ffe600]" />
          </div>

          {/* Header B-I-N-G-O */}
          <div className="grid grid-cols-5 gap-1.5 mb-1.5 text-center">
            {["B", "I", "N", "G", "O"].map((letter) => (
              <div key={letter} className="bg-[#ffe600] text-black font-black text-lg py-1 border border-black">
                {letter}
              </div>
            ))}
          </div>

          {/* Grilla 5x5 */}
          <div className="grid grid-cols-5 gap-1.5">
            {selectedTable.card.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`aspect-square flex items-center justify-center font-black text-sm border ${
                    cell.val === "FREE"
                      ? "bg-[#ffe600] text-black border-black text-xs"
                      : "bg-[#040914] text-white border-slate-700 font-space"
                  }`}
                >
                  {cell.val}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Botón de Confirmación */}
        <button
          onClick={handleConfirm}
          className="w-full bg-[#ffe600] hover:bg-yellow-300 text-black font-black text-xl py-4 border-4 border-black uppercase tracking-wider brutal-shadow-white active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          CONFIRMAR {selectedTable.name} <ArrowRight size={22} className="stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
