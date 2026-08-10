import React from "react";

/**
 * Esfera 3D Neón de Bingo con Relieve, Brillo Esférico y Anillo Neón
 */
export default function BingoBallSphere({ letter, number, size = "md" }) {
  if (!letter || !number) return null;

  // Mapeo de colores neón por columna B I N G O
  const colorMap = {
    B: {
      sphereBg: "radial-gradient(circle at 35% 35%, #ff4d88 0%, #d6004c 50%, #59001e 100%)",
      ringGlow: "0 0 35px rgba(255, 0, 85, 0.6)",
      letterColor: "#ff0055"
    },
    I: {
      sphereBg: "radial-gradient(circle at 35% 35%, #ffe066 0%, #e6a100 50%, #5c4100 100%)",
      ringGlow: "0 0 35px rgba(255, 183, 0, 0.6)",
      letterColor: "#ffb700"
    },
    N: {
      sphereBg: "radial-gradient(circle at 35% 35%, #66f7ff 0%, #00b8e6 50%, #004759 100%)",
      ringGlow: "0 0 35px rgba(0, 243, 255, 0.6)",
      letterColor: "#00f3ff"
    },
    G: {
      sphereBg: "radial-gradient(circle at 35% 35%, #66ffb3 0%, #00cc66 50%, #004d26 100%)",
      ringGlow: "0 0 35px rgba(0, 255, 136, 0.6)",
      letterColor: "#00ff88"
    },
    O: {
      sphereBg: "radial-gradient(circle at 35% 35%, #c880ff 0%, #8c1aff 50%, #390073 100%)",
      ringGlow: "0 0 35px rgba(168, 85, 247, 0.6)",
      letterColor: "#a855f7"
    }
  };

  const ballStyle = colorMap[letter] || colorMap.G;

  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-20 h-20 text-xl",
    lg: "w-36 h-36 md:w-52 md:h-52 text-4xl md:text-6xl"
  };

  return (
    <div className="relative inline-flex items-center justify-center select-none animate-fadeIn">
      {/* Esfera 3D Principal */}
      <div
        style={{
          background: ballStyle.sphereBg,
          boxShadow: ballStyle.ringGlow
        }}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full flex flex-col items-center justify-center relative border-2 border-white/40 overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105`}
      >
        {/* Reflejo de Brillo Esférico Superior */}
        <div className="absolute top-1 left-2 w-1/2 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-full blur-[2px] pointer-events-none" />

        {/* Círculo Interno Blanco para el Número (Estilo Bola Profesional) */}
        <div className="bg-white text-black rounded-full w-3/5 h-3/5 flex flex-col items-center justify-center shadow-inner border border-black/20 z-10 p-1">
          <span 
            style={{ color: ballStyle.letterColor }}
            className="font-black text-[0.45em] uppercase leading-none font-syne"
          >
            {letter}
          </span>
          <span className="font-black text-[0.7em] leading-none font-space tracking-tight">
            {number}
          </span>
        </div>
      </div>
    </div>
  );
}
