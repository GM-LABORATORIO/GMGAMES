import React from "react";
import { User, Check, Sparkles } from "lucide-react";

export default function PlayersTVGrid({ players = {} }) {
  const playersList = Object.values(players || {});

  if (playersList.length === 0) {
    return (
      <div className="arcade-card-glass border-4 border-slate-800 p-8 text-center brutal-shadow-white">
        <User size={48} className="mx-auto text-slate-600 mb-3" />
        <h3 className="text-xl font-black text-slate-400 uppercase">ESPERANDO JUGADORES...</h3>
        <p className="text-xs text-slate-500 font-bold mt-1 uppercase">
          LOS JUGADORES Y SUS MINI-CARTONES APARECERÁN AQUÍ AL CONECTARSE
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
          MONITOREO DE MINI-CARTONES EN TIEMPO REAL
        </span>
      </div>

      {/* Grid de Perfiles de Jugadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playersList.map((player) => {
          const confirmedSet = new Set(player.confirmedNumbers || []);
          const cardMatrix = player.card || [];

          return (
            <div
              key={player.id}
              className="bg-[#090514] border-4 border-slate-700 p-4 brutal-shadow-sm-white flex flex-col justify-between"
            >
              {/* Header de Perfil */}
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: player.playerColor?.hex || "#ff007f", color: player.playerColor?.text || "#fff" }}
                    className="w-10 h-10 font-black text-lg flex items-center justify-center border-2 border-black rounded-full"
                  >
                    {player.name ? player.name.charAt(0).toUpperCase() : "J"}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase leading-tight">
                      {player.name}
                    </h3>
                    <span className="text-[11px] font-black text-[#00f3ff] uppercase tracking-wider block">
                      {player.tableName || "Tabla #1"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">ACIERTOS</span>
                  <span className="bg-[#ffb700] text-black font-black text-xs px-2 py-0.5 border border-black inline-block font-space">
                    {confirmedSet.size} NUMEROS
                  </span>
                </div>
              </div>

              {/* Mini-Cartón 5x5 */}
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
                      const isConfirmed = typeof cell.val === "number" && confirmedSet.has(cell.val);

                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`aspect-square flex flex-col items-center justify-center relative font-black text-xs border transition-all ${
                            isFree
                              ? "bg-[#ffb700] text-black border-black text-[9px]"
                              : isConfirmed
                              ? "bg-[#00f3ff] text-black border-2 border-black shadow-[0_0_12px_#00f3ff] z-10 scale-105"
                              : "bg-[#090514] text-slate-400 border-slate-800"
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
                                  className="text-black stroke-[4] absolute top-0.5 right-0.5"
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
