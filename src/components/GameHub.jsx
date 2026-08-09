import React, { useState } from "react";
import { Gamepad2, Play, Sparkles, Trophy, Lock, Users, Zap, Brain, HelpCircle, FileText, Puzzle, Dice5, ShieldCheck } from "lucide-react";

export default function GameHub({ onSelectBingo }) {
  const [inCatalog, setInCatalog] = useState(false);

  return (
    <div className="min-h-screen bg-[#06070d] text-white font-syne p-6 md:p-12 flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Background Decorativo Cyber Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:32px_32px]" />

      {!inCatalog ? (
        /* HERO INTRO DE MARCA: JUNTOS JUGAMOS ULTRA MODERNO */
        <div className="max-w-4xl w-full mx-auto my-auto text-center relative z-10 space-y-8 animate-fadeIn">
          
          <div className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-black px-4 py-1.5 text-xs sm:text-sm tracking-widest uppercase rounded-full shadow-[0_0_20px_rgba(0,255,136,0.4)]">
            <Sparkles size={18} /> PLATAFORMA FAMILIAR CYBER GAMING
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-none drop-shadow-[0_4px_30px_rgba(0,255,136,0.3)]">
            JUNTOS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00f3ff] to-[#a855f7]">
              JUGAMOS
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-bold max-w-2xl mx-auto uppercase tracking-wide">
            Donde la familia y los amigos se unen a competir en <span className="text-[#00ff88]">pantalla grande y celular</span>.
          </p>

          <button
            onClick={() => setInCatalog(true)}
            className="bg-gradient-to-r from-[#00ff88] to-[#00f3ff] hover:opacity-95 text-black font-black text-2xl sm:text-3xl py-6 px-10 border border-white/40 uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto rounded-2xl shadow-[0_0_35px_rgba(0,255,136,0.4)] animate-pulse cursor-pointer"
          >
            <Play size={32} fill="currentColor" /> ENTRAR AL CATÁLOGOS DE JUEGOS
          </button>
        </div>
      ) : (
        /* PANEL DE CATÁLOGO MULTIJUEGOS CYBER GLASS */
        <div className="max-w-7xl w-full mx-auto relative z-10 space-y-8 animate-fadeIn">
          
          {/* Header de la Marca */}
          <header className="flex flex-wrap justify-between items-center border-b border-white/10 pb-6 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-black px-3 py-1 text-xs tracking-widest uppercase rounded-full mb-2">
                <Gamepad2 size={16} /> JUNTOS JUGAMOS // CATÁLOGO OFICIAL
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase">
                PANEL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00f3ff]">JUEGOS FAMILIARES</span>
              </h1>
            </div>

            <button
              onClick={() => setInCatalog(false)}
              className="glass-panel hover:border-[#00ff88] px-5 py-2.5 text-xs font-black text-white uppercase tracking-wider rounded-xl transition-all"
            >
              VOLVER A LA INTRO
            </button>
          </header>

          {/* Grid de Tarjetas de Juegos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* JUEGO #1: BINGO MULTIJUGADOR (ACTIVO & JUGABLE) */}
            <div className="glass-panel p-6 border-2 border-[#00ff88] rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden group shadow-[0_0_30px_rgba(0,255,136,0.2)]">
              <div className="absolute top-4 right-4 bg-[#00ff88] text-black font-black text-[10px] px-3 py-1 uppercase rounded-full animate-pulse shadow-[0_0_12px_#00ff88]">
                🟢 DISPONIBLE AHORA
              </div>

              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#00ff88] to-[#00f3ff] text-black font-black text-2xl flex items-center justify-center rounded-2xl mb-4 shadow-[0_0_20px_rgba(0,255,136,0.4)]">
                  🎱
                </div>
                <h2 className="text-2xl font-black text-white uppercase group-hover:text-[#00ff88] transition-colors">
                  BINGO MULTIJUGADOR ARCADIA
                </h2>
                <p className="text-xs text-slate-300 font-bold mt-2 uppercase leading-relaxed">
                  Transmisión en TV 4K, Locutor por Voz con frases de presión, cartones 5x5 únicos y selector neón personal.
                </p>
              </div>

              <button
                onClick={onSelectBingo}
                className="w-full bg-gradient-to-r from-[#00ff88] to-[#00f3ff] hover:opacity-90 text-black font-black text-xl py-4 border border-white/40 uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 rounded-xl shadow-[0_0_25px_rgba(0,255,136,0.4)] cursor-pointer mt-4"
              >
                <Play size={20} fill="currentColor" /> JUGAR BINGO AHORA
              </button>
            </div>

            {/* JUEGO #2: TRIVIA & ADIVINA LA PALABRA (PRÓXIMAMENTE) */}
            <div className="glass-panel p-6 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 opacity-75 hover:opacity-100 transition-opacity">
              <div>
                <div className="w-14 h-14 bg-white/10 text-slate-300 font-black text-2xl flex items-center justify-center rounded-2xl mb-4">
                  🧠
                </div>
                <h2 className="text-2xl font-black text-slate-200 uppercase">
                  TRIVIA & ADIVINA LA PALABRA
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase leading-relaxed">
                  Preguntas rápidas, retos divertidos e hilarantes preguntas sobre los miembros de la familia.
                </p>
              </div>

              <div className="bg-white/5 text-slate-400 font-black text-sm py-3 px-4 border border-white/10 rounded-xl text-center uppercase tracking-wider flex items-center justify-center gap-2">
                <Lock size={16} /> PRÓXIMAMENTE
              </div>
            </div>

            {/* JUEGO #3: STOP & AHORCADO MULTIJUGADOR (PRÓXIMAMENTE) */}
            <div className="glass-panel p-6 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 opacity-75 hover:opacity-100 transition-opacity">
              <div>
                <div className="w-14 h-14 bg-white/10 text-slate-300 font-black text-2xl flex items-center justify-center rounded-2xl mb-4">
                  📝
                </div>
                <h2 className="text-2xl font-black text-slate-200 uppercase">
                  STOP & AHORCADO EXPRESS
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase leading-relaxed">
                  Agilidad mental, letras al azar y palabras secretas respondiendo directo desde el celular.
                </p>
              </div>

              <div className="bg-white/5 text-slate-400 font-black text-sm py-3 px-4 border border-white/10 rounded-xl text-center uppercase tracking-wider flex items-center justify-center gap-2">
                <Lock size={16} /> PRÓXIMAMENTE
              </div>
            </div>

            {/* JUEGO #4: MEMORIA GIGANTE FAMILIAR (PRÓXIMAMENTE) */}
            <div className="glass-panel p-6 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 opacity-75 hover:opacity-100 transition-opacity">
              <div>
                <div className="w-14 h-14 bg-white/10 text-slate-300 font-black text-2xl flex items-center justify-center rounded-2xl mb-4">
                  🧩
                </div>
                <h2 className="text-2xl font-black text-slate-200 uppercase">
                  MEMORIA GIGANTE FAMILIAR
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase leading-relaxed">
                  Encuentra las parejas de cartas en la TV recordando las posiciones reveladas en tu celular.
                </p>
              </div>

              <div className="bg-white/5 text-slate-400 font-black text-sm py-3 px-4 border border-white/10 rounded-xl text-center uppercase tracking-wider flex items-center justify-center gap-2">
                <Lock size={16} /> PRÓXIMAMENTE
              </div>
            </div>

            {/* JUEGO #5: PARQUÉS & DOMINÓ INTERACTIVO (PRÓXIMAMENTE) */}
            <div className="glass-panel p-6 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 opacity-75 hover:opacity-100 transition-opacity">
              <div>
                <div className="w-14 h-14 bg-white/10 text-slate-300 font-black text-2xl flex items-center justify-center rounded-2xl mb-4">
                  🎲
                </div>
                <h2 className="text-2xl font-black text-slate-200 uppercase">
                  PARQUÉS & DOMINÓ INTERACTIVO
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase leading-relaxed">
                  Lanza los dados desde el teléfono y mueve tus fichas en el gran tablero proyectado en la TV.
                </p>
              </div>

              <div className="bg-white/5 text-slate-400 font-black text-sm py-3 px-4 border border-white/10 rounded-xl text-center uppercase tracking-wider flex items-center justify-center gap-2">
                <Lock size={16} /> PRÓXIMAMENTE
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer General de la Marca */}
      <footer className="border-t border-white/10 pt-4 flex flex-wrap justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest gap-4 relative z-10">
        <span className="flex items-center gap-2 text-[#00ff88]">
          <ShieldCheck size={16} /> JUNTOS JUGAMOS // PLATAFORMA FAMILIAR CYBER GAMING
        </span>
        <span className="text-slate-500">
          EDICIÓN ESPECIAL FAMILIA LOAIZA SILLE
        </span>
      </footer>
    </div>
  );
}
