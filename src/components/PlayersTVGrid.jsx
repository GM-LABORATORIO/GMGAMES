import React from "react";
import { User, Check, Sparkles } from "lucide-react";
import { getPlayerNeonTheme } from "../utils/themeEngine";

export default function PlayersTVGrid({ players = {} }) {
  const playersList = Object.values(players || {});

  if (playersList.length === 0) {
    return (
      <div className="arcade-card-glass border-4 border-slate-800 p-8 text-center brutal-shadow-white">
        <User size={48} className="mx-auto text-slate-600 mb-3" />
        <h3 className="text-xl font-black text-slate-400 uppercase">ESPERANDO JUGADORES...</h3>
        <p className="text-xs text-slate-500 font-bold mt-1 uppercase">
          ESCANEA EL CÓDIGO QR PARA UNIRTE Y VER TU MINI-CARTÓN CON TU TEMA NEÓN AQUÍ
        </p>
      </div>
    );
  }

  return (
    <div className="arcade-card-glass border-4 border-slate-800 p-6 arcade-glow-purple flex flex-col gap-6 select-none">
      <div className="flex justify-between items-center border-b-4 border-[#00f3ff] pb-3">
        <h2 className="text-xl font-black text-[#00f3ff] uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={20} /> JUGADORES EN VIVO ({playersList.length})
        </h2>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          MONITOREO DE MINI-CARTONES Y TEMAS NEÓN EN TIEMPO REAL
        </span>
      </div>

      {/* Grid de Perfiles de Jugadores con sus Temas Neón */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playersList.map((player) => {
          const theme = getPlayerNeonTheme(player.playerColor);
          const confirmedSet = new Set((player.confirmedNumbers || []).map((n) => Number(n)));
          const cardMatrix = player.card || [];

          return (
            <div
              key={player.id}
              style={{
                borderColor: theme.borderColor,
                boxShadow: theme.glow
              }}
              className="bg-[#090514] border-4 p-4 flex flex-col justify-between transition-all duration-300"
            >
              {/* Header de Perfil con Tema Neón */}
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: theme.hex, color: theme.text }}
                    className="w-10 h-10 font-black text-lg flex items-center justify-center border-2 border-black rounded-full shadow-[0_0_10px_#ffffff]"
                  >
                    {player.name ? player.name.charAt(0).toUpperCase() : "J"}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase leading-tight">
                      {player.name}
                    </h3>
                    <span
                      style={{ color: theme.hex }}
                      className="text-[11px] font-black uppercase tracking-wider block"
                    >
                      {player.tableName || "Tabla #1"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">ACIERTOS</span>
                  <span
                    style={{ backgroundColor: theme.hex, color: theme.text }}
                    className="font-black text-xs px-2 py-0.5 border border-black inline-block font-space"
                  >
                    {confirmedSet.size} NÚMEROS
                  </span>
                </div>
              </div>

              {/* Mini-Cartón 5x5 con Celdas Neón */}
              <div className="bg-[#120a26] border-2 border-slate-700 p-2">
                <div className="grid grid-cols-5 gap-1 mb-1 text-center font-black text-xs">
                  <div className="bg-[#ff0055] text-white py-0.5 border border-black">B</div>
                  <div className="bg-[#ffb700] text-black py-0.5 border border-black">I</div>
                  <div className="bg-[#00f3ff] text-black py-0.5 border border-black">N</div>
                  <div className="bg-[#00ff88] text-black py-0.5 border border-black">G</div>
                  <div className="bg-[#a855f7] text-white py-0.5 border border-black">O</div>
                </div>

                <div className="grid grid-cols-5 gap-1">
                  {cardMatrix.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      const isFree = cell.val === "FREE";
                      const cellNum = typeof cell.val === "number" ? cell.val : Number(cell.val);
                      const isConfirmed = !isFree && confirmedSet.has(cellNum);

                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          style={{
                            backgroundColor: isFree
                              ? "#ffb700"
                              : isConfirmed
                              ? theme.hex
                              : "#090514",
                            color: isFree
                              ? "#000000"
                              : isConfirmed
                              ? theme.text
                              : "#94a3b8",
                            borderColor: isConfirmed ? "#ffffff" : "#1e293b",
                            boxShadow: isConfirmed ? theme.glow : "none"
                          }}
                          className={`aspect-square flex flex-col items-center justify-center relative font-black text-xs border transition-all ${
                            isFree
                              ? "text-[9px]"
                              : isConfirmed
                              ? "border-2 z-10 scale-105"
                              : "border-slate-800"
                          }`}
                        >
                          {isFree ? (
                            "FREE"
                          ) : (
                            <>
                              <span className="font-space">{cell.val}</span>
                              {isConfirmed && (
                                <Check
                                  size={10}
                                  className="stroke-[4] absolute top-0.5 right-0.5"
                                />
                              )}
                            </>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
