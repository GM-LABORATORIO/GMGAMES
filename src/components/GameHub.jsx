import React, { useState } from "react";
import { Gamepad2, Play, Sparkles, Trophy, Lock, Users, Zap, Brain, HelpCircle, FileText, Puzzle, Dice5, ShieldCheck } from "lucide-react";

export default function GameHub({ onSelectBingo }) {
  const [inCatalog, setInCatalog] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-syne p-6 md:p-12 flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Background Decorativo Cyber-Arcade */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffcc00_1px,transparent_1px)] [background-size:24px_24px]" />

      {!inCatalog ? (
        /* HERO INTRO DE MARCA: JUNTOS JUGAMOS */
        <div className="max-w-4xl w-full mx-auto my-auto text-center relative z-10 space-y-8 animate-fadeIn">
          
          <div className="inline-flex items-center gap-2 bg-[#ffcc00] text-black font-black px-4 py-1.5 text-xs sm:text-sm tracking-widest border-2 border-black uppercase brutal-shadow-white">
            <Sparkles size={18} /> PLATAFORMA MULTIJUEGOS FAMILIAR
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-none drop-shadow-[6px_6px_0px_#000]">
            JUNTOS <br />
            <span className="text-[#ffcc00]">JUGAMOS</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-bold max-w-2xl mx-auto uppercase tracking-wide">
            Donde la familia y los amigos se unen a competir en <span className="text-[#ffcc00]">pantalla grande y celular</span>.
          </p>

          <button
            onClick={() => setInCatalog(true)}
            className="bg-[#ffcc00] hover:bg-yellow-300 text-black font-black text-2xl sm:text-3xl py-6 px-10 border-4 border-black uppercase tracking-wider active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-4 mx-auto brutal-shadow-white animate-bounce cursor-pointer"
          >
            <Play size={32} fill="currentColor" /> ENTRAR AL CATÁLOGO DE JUEGOS
          </button>
        </div>
      ) : (
        /* PANEL DE CATÁLOGO MULTIJUEGOS */
        <div className="max-w-7xl w-full mx-auto relative z-10 space-y-8 animate-fadeIn">
          
          {/* Header de la Marca */}
          <header className="flex flex-wrap justify-between items-center border-b-4 border-[#ffcc00] pb-6 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#ffcc00] text-black font-black px-3 py-1 text-xs tracking-widest border border-black mb-2 uppercase">
                <Gamepad2 size={16} /> JUNTOS JUGAMOS // CATÁLOGO OFICIAL
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase">
                PANEL DE <span className="text-[#ffcc00]">JUEGOS FAMILIARES</span>
              </h1>
            </div>

            <button
              onClick={() => setInCatalog(false)}
              className="bg-[#101726] border-2 border-white hover:border-[#ffcc00] px-4 py-2 text-xs font-black text-white uppercase tracking-wider brutal-shadow-yellow"
            >
              VOLVER A LA INTRO
            </button>
          </header>

          {/* Grid de Tarjetas de Juegos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* JUEGO #1: BINGO MULTIJUGADOR (ACTIVO & JUGABLE) */}
            <div className="bg-[#101726] border-4 border-[#ffcc00] p-6 brutal-shadow-yellow flex flex-col justify-between space-y-4 relative overflow-hidden group">
              <div className="absolute top-3 right-3 bg-[#00ff88] text-black font-black text-[10px] px-2.5 py-1 uppercase border border-black animate-pulse">
                🟢 DISPONIBLE AHORA
              </div>

              <div>
                <div className="w-14 h-14 bg-[#ffcc00] text-black font-black text-2xl flex items-center justify-center border-2 border-black mb-4 brutal-shadow-black">
                  🎱
                </div>
                <h2 className="text-2xl font-black text-white uppercase group-hover:text-[#ffcc00] transition-colors">
                  BINGO MULTIJUGADOR ARCADIA
                </h2>
                <p className="text-xs text-slate-300 font-bold mt-2 uppercase leading-relaxed">
                  Transmisión en TV 4K, Locutor por Voz con frases de presión, cartones 5x5 únicos y selector neón personal.
                </p>
              </div>

              <button
                onClick={onSelectBingo}
                className="w-full bg-[#ffcc00] hover:bg-yellow-300 text-black font-black text-xl py-4 border-4 border-black uppercase tracking-wider active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 brutal-shadow-white cursor-pointer mt-4"
              >
                <Play size={20} fill="currentColor" /> JUGAR BINGO AHORA
              </button>
            </div>

            {/* JUEGO #2: TRIVIA & ADIVINA LA PALABRA (PRÓXIMAMENTE) */}
            <div className="bg-[#101726]/60 border-4 border-slate-700 p-6 flex flex-col justify-between space-y-4 opacity-75 hover:opacity-100 transition-opacity">
              <div>
                <div className="w-14 h-14 bg-slate-800 text-slate-400 font-black text-2xl flex items-center justify-center border-2 border-slate-600 mb-4">
                  🧠
                </div>
                <h2 className="text-2xl font-black text-slate-300 uppercase">
                  TRIVIA & ADIVINA LA PALABRA
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase leading-relaxed">
                  Preguntas rápidas, retos divertidos e hilarantes preguntas sobre los miembros de la familia.
                </p>
              </div>

              <div className="bg-slate-800 text-slate-400 font-black text-sm py-3 px-4 border-2 border-slate-700 text-center uppercase tracking-wider flex items-center justify-center gap-2">
                <Lock size={16} /> PRÓXIMAMENTE
              </div>
            </div>

            {/* JUEGO #3: STOP & AHORCADO MULTIJUGADOR (PRÓXIMAMENTE) */}
            <div className="bg-[#101726]/60 border-4 border-slate-700 p-6 flex flex-col justify-between space-y-4 opacity-75 hover:opacity-100 transition-opacity">
              <div>
                <div className="w-14 h-14 bg-slate-800 text-slate-400 font-black text-2xl flex items-center justify-center border-2 border-slate-600 mb-4">
                  📝
                </div>
                <h2 className="text-2xl font-black text-slate-300 uppercase">
                  STOP & AHORCADO EXPRESS
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase leading-relaxed">
                  Agilidad mental, letras al azar y palabras secretas respondiendo directo desde el celular.
                </p>
              </div>

              <div className="bg-slate-800 text-slate-400 font-black text-sm py-3 px-4 border-2 border-slate-700 text-center uppercase tracking-wider flex items-center justify-center gap-2">
                <Lock size={16} /> PRÓXIMAMENTE
              </div>
            </div>

            {/* JUEGO #4: MEMORIA GIGANTE FAMILIAR (PRÓXIMAMENTE) */}
            <div className="bg-[#101726]/60 border-4 border-slate-700 p-6 flex flex-col justify-between space-y-4 opacity-75 hover:opacity-100 transition-opacity">
              <div>
                <div className="w-14 h-14 bg-slate-800 text-slate-400 font-black text-2xl flex items-center justify-center border-2 border-slate-600 mb-4">
                  🧩
                </div>
                <h2 className="text-2xl font-black text-slate-300 uppercase">
                  MEMORIA GIGANTE FAMILIAR
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase leading-relaxed">
                  Encuentra las parejas de cartas en la TV recordando las posiciones reveladas en tu celular.
                </p>
              </div>

              <div className="bg-slate-800 text-slate-400 font-black text-sm py-3 px-4 border-2 border-slate-700 text-center uppercase tracking-wider flex items-center justify-center gap-2">
                <Lock size={16} /> PRÓXIMAMENTE
              </div>
            </div>

            {/* JUEGO #5: PARQUÉS & DOMINÓ INTERACTIVO (PRÓXIMAMENTE) */}
            <div className="bg-[#101726]/60 border-4 border-slate-700 p-6 flex flex-col justify-between space-y-4 opacity-75 hover:opacity-100 transition-opacity">
              <div>
                <div className="w-14 h-14 bg-slate-800 text-slate-400 font-black text-2xl flex items-center justify-center border-2 border-slate-600 mb-4">
                  🎲
                </div>
                <h2 className="text-2xl font-black text-slate-300 uppercase">
                  PARQUÉS & DOMINÓ INTERACTIVO
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase leading-relaxed">
                  Lanza los dados desde el teléfono y mueve tus fichas en el gran tablero proyectado en la TV.
                </p>
              </div>

              <div className="bg-slate-800 text-slate-400 font-black text-sm py-3 px-4 border-2 border-slate-700 text-center uppercase tracking-wider flex items-center justify-center gap-2">
                <Lock size={16} /> PRÓXIMAMENTE
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer General de la Marca */}
      <footer className="border-t-2 border-slate-800 pt-4 flex flex-wrap justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest gap-4 relative z-10">
        <span className="flex items-center gap-2 text-[#ffcc00]">
          <ShieldCheck size={16} /> JUNTOS JUGAMOS // PLATAFORMA FAMILIAR OFICIAL
        </span>
        <span className="text-slate-500">
          EDICIÓN ESPECIAL FAMILIA LOAIZA SILLE
        </span>
      </footer>
    </div>
  );
}
