import React from "react";
import { User, Check, Sparkles, Crown } from "lucide-react";
import { getPlayerNeonTheme } from "../utils/themeEngine";

export default function PlayersTVGrid({ players = {} }) {
  const playersList = Object.values(players || {});

  // Encontrar el líder actual (mayor cantidad de aciertos)
  let maxHits = 0;
  let leaderId = null;
  playersList.forEach((p) => {
    const hits = (p.confirmedNumbers || []).length;
    if (hits > maxHits) {
      maxHits = hits;
      leaderId = p.id;
    }
  });

  if (playersList.length === 0) {
    return (
      <div className="glass-panel border-2 border-white/20 p-8 text-center rounded-2xl">
        <User size={48} className="mx-auto text-slate-500 mb-3" />
        <h3 className="text-xl font-black text-slate-300 uppercase">ESPERANDO JUGADORES...</h3>
        <p className="text-xs text-slate-400 font-bold mt-1 uppercase">
          ESCANEA EL CÓDIGO QR PARA UNIRTE Y VER TU MINI-CARTÓN CON TU TEMA NEÓN AQUÍ
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel border-2 border-white/20 p-6 rounded-2xl flex flex-col gap-6 select-none shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <h2 className="text-xl font-black text-[#00ff88] uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={20} /> JUGADORES EN VIVO ({playersList.length})
        </h2>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
          MONITOREO DE CARTONES Y TEMAS NEÓN EN TIEMPO REAL
        </span>
      </div>

      {/* Grid de Perfiles de Jugadores con sus Temas Neón */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playersList.map((player) => {
          const theme = getPlayerNeonTheme(player.playerColor);
          const confirmedSet = new Set((player.confirmedNumbers || []).map((n) => Number(n)));
          const cardMatrix = player.card || [];
          const isLeader = player.id === leaderId && maxHits > 0;

          return (
            <div
              key={player.id}
              style={{
                borderColor: theme.borderColor,
                boxShadow: theme.glow
              }}
              className="bg-[#06070d]/90 border-2 p-4 rounded-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            >
              {/* Insignia de Líder */}
              {isLeader && (
                <div className="absolute top-0 right-0 bg-[#00ff88] text-black font-black text-[9px] px-2.5 py-0.5 uppercase tracking-wider rounded-bl-lg flex items-center gap-1 shadow-[0_0_10px_#00ff88]">
                  <Crown size={12} fill="currentColor" /> LÍDER
                </div>
              )}

              {/* Header de Perfil con Tema Neón */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: theme.hex, color: theme.text }}
                    className="w-10 h-10 font-black text-lg flex items-center justify-center rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.3)]"
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
                    className="font-black text-xs px-2 py-0.5 rounded-md inline-block font-space"
                  >
                    {confirmedSet.size} NÚMEROS
                  </span>
                </div>
              </div>

              {/* Mini-Cartón 5x5 con Celdas Neón */}
              <div className="bg-[#101424] border border-white/10 p-2 rounded-lg">
                <div className="grid grid-cols-5 gap-1 mb-1 text-center font-black text-xs">
                  <div className="bg-[#ff0055] text-white py-0.5 rounded">B</div>
                  <div className="bg-[#ffb700] text-black py-0.5 rounded">I</div>
                  <div className="bg-[#00f3ff] text-black py-0.5 rounded">N</div>
                  <div className="bg-[#00ff88] text-black py-0.5 rounded">G</div>
                  <div className="bg-[#a855f7] text-white py-0.5 rounded">O</div>
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
                              : "#06070d",
                            color: isFree
                              ? "#000000"
                              : isConfirmed
                              ? theme.text
                              : "#94a3b8",
                            borderColor: isConfirmed ? "#ffffff" : "rgba(255,255,255,0.08)",
                            boxShadow: isConfirmed ? theme.glow : "none"
                          }}
                          className={`aspect-square flex flex-col items-center justify-center relative font-black text-xs rounded transition-all ${
                            isFree
                              ? "text-[9px]"
                              : isConfirmed
                              ? "z-10 scale-105"
                              : ""
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
