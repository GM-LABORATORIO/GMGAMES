import React, { useState } from "react";
import { Gamepad2, Play, Sparkles, Trophy, Lock, Users, Zap, Brain, HelpCircle, FileText, Puzzle, Dice5, ShieldCheck } from "lucide-react";
import BingoBallSphere from "./BingoBallSphere";

export default function GameHub({ onSelectBingo }) {
  const [inCatalog, setInCatalog] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-white font-syne p-6 md:p-12 flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Luz Ambiental Nebulosa Sutil en Esquinas (Mantiene el centro 100% negro puro para fusión total) */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#00ff88]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#a855f7]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Background Decorativo de Puntos en Catálogo */}
      {inCatalog && (
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:32px_32px]" 
        />
      )}

      {!inCatalog ? (
        /* HERO INTRO OFICIAL DE LA MARCA: LA SALA (FUSIÓN 100% INVISIBLE MIX-BLEND-SCREEN) */
        <div className="max-w-4xl w-full mx-auto my-auto text-center relative z-10 space-y-8 flex flex-col items-center">
          
          {/* Logo Oficial LA SALA - Fusión Total sin Recuadros mediante mix-blend-screen */}
          <div className="w-full">
            <img
              src="/lasala_logo.jpg"
              alt="LA SALA - Plataforma // Juegos // Familia & Amigos"
              className="w-72 sm:w-[480px] md:w-[560px] mx-auto h-auto object-contain mix-blend-screen pointer-events-none select-none block"
            />
          </div>

          <p className="text-base sm:text-2xl text-slate-200 font-black max-w-2xl mx-auto uppercase tracking-wide">
            Donde la familia y los amigos se unen a competir en <span className="text-[#00ff88]">pantalla grande y celular</span>.
          </p>

          {/* Botón Ultra-Elegante en 1 Sola Línea con Estilo Pill Pro */}
          <button
            onClick={() => setInCatalog(true)}
            className="bg-gradient-to-r from-[#00ff88] via-[#00f3ff] to-[#a855f7] hover:brightness-110 text-black font-black text-base sm:text-xl py-4 px-10 border border-white/50 uppercase tracking-wider rounded-full shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap mt-4"
          >
            <Play size={24} fill="currentColor" /> ENTRAR AL CATÁLOGO DE JUEGOS
          </button>
        </div>
      ) : (
        /* PANEL DE CATÁLOGO MULTIJUEGOS LA SALA */
        <div className="max-w-7xl w-full mx-auto relative z-10 space-y-8 animate-fadeIn">
          
          {/* Header de LA SALA */}
          <header className="flex flex-wrap justify-between items-center border-b border-white/10 pb-6 gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/lasala_logo.jpg"
                alt="LA SALA Logo"
                className="w-24 sm:w-32 h-auto object-contain mix-blend-screen"
              />
              <div>
                <div className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-black px-3 py-1 text-xs tracking-widest uppercase rounded-full mb-1">
                  <Gamepad2 size={16} /> LA SALA // CATÁLOGO OFICIAL
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-white uppercase">
                  PANEL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00f3ff]">JUEGOS FAMILIARES</span>
                </h1>
              </div>
            </div>

            <button
              onClick={() => setInCatalog(false)}
              className="glass-panel hover:border-[#00ff88] px-5 py-2.5 text-xs font-black text-white uppercase tracking-wider rounded-xl transition-all cursor-pointer"
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
                <div className="mb-4">
                  <BingoBallSphere letter="B" number={7} size="sm" />
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

      {/* Footer General de LA SALA */}
      <footer className="border-t border-white/10 pt-4 flex flex-wrap justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest gap-4 relative z-10">
        <span className="flex items-center gap-2 text-[#00ff88]">
          <ShieldCheck size={16} /> LA SALA // PLATAFORMA // JUEGOS // FAMILIA & AMIGOS
        </span>
        <span className="text-slate-500 uppercase">
          EDICIÓN MULTIJUGADOR EN VIVO
        </span>
      </footer>
    </div>
  );
}
