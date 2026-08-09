/**
 * Motor de Tema Neón Dinámico para Jugadores de Bingo
 * Genera tokens completos de UI (colores, resplandor, bordes, gradientes y botones)
 */

export const NEON_THEMES = {
  cyan: {
    id: "cyan",
    name: "Cian Neón",
    hex: "#00f3ff",
    text: "#000000",
    glow: "0 0 25px rgba(0, 243, 255, 0.6)",
    glowStrong: "0 0 35px rgba(0, 243, 255, 0.9)",
    borderColor: "#00f3ff",
    bgGradient: "from-[#00f3ff] to-[#00b8ff]",
    markedBg: "#00f3ff",
    markedText: "#000000",
    cardBorder: "border-[#00f3ff]",
    badgeBg: "bg-[#00f3ff] text-black",
    buttonBg: "bg-[#00f3ff] text-black hover:bg-[#5cf7ff]"
  },
  magenta: {
    id: "magenta",
    name: "Magenta Fuego",
    hex: "#ff007f",
    text: "#ffffff",
    glow: "0 0 25px rgba(255, 0, 127, 0.6)",
    glowStrong: "0 0 35px rgba(255, 0, 127, 0.9)",
    borderColor: "#ff007f",
    bgGradient: "from-[#ff007f] to-[#ff00a0]",
    markedBg: "#ff007f",
    markedText: "#ffffff",
    cardBorder: "border-[#ff007f]",
    badgeBg: "bg-[#ff007f] text-white",
    buttonBg: "bg-[#ff007f] text-white hover:bg-[#ff409f]"
  },
  yellow: {
    id: "yellow",
    name: "Oro Cyber",
    hex: "#ffb700",
    text: "#000000",
    glow: "0 0 25px rgba(255, 183, 0, 0.6)",
    glowStrong: "0 0 35px rgba(255, 183, 0, 0.9)",
    borderColor: "#ffb700",
    bgGradient: "from-[#ffb700] to-[#ff8800]",
    markedBg: "#ffb700",
    markedText: "#000000",
    cardBorder: "border-[#ffb700]",
    badgeBg: "bg-[#ffb700] text-black",
    buttonBg: "bg-[#ffb700] text-black hover:bg-[#ffcb40]"
  },
  green: {
    id: "green",
    name: "Verde Ácido",
    hex: "#00ff88",
    text: "#000000",
    glow: "0 0 25px rgba(0, 255, 136, 0.6)",
    glowStrong: "0 0 35px rgba(0, 255, 136, 0.9)",
    borderColor: "#00ff88",
    bgGradient: "from-[#00ff88] to-[#00cc66]",
    markedBg: "#00ff88",
    markedText: "#000000",
    cardBorder: "border-[#00ff88]",
    badgeBg: "bg-[#00ff88] text-black",
    buttonBg: "bg-[#00ff88] text-black hover:bg-[#52ffaa]"
  },
  orange: {
    id: "orange",
    name: "Naranja Neón",
    hex: "#ff5500",
    text: "#ffffff",
    glow: "0 0 25px rgba(255, 85, 0, 0.6)",
    glowStrong: "0 0 35px rgba(255, 85, 0, 0.9)",
    borderColor: "#ff5500",
    bgGradient: "from-[#ff5500] to-[#ff2200]",
    markedBg: "#ff5500",
    markedText: "#ffffff",
    cardBorder: "border-[#ff5500]",
    badgeBg: "bg-[#ff5500] text-white",
    buttonBg: "bg-[#ff5500] text-white hover:bg-[#ff7733]"
  },
  purple: {
    id: "purple",
    name: "Púrpura Neón",
    hex: "#a855f7",
    text: "#ffffff",
    glow: "0 0 25px rgba(168, 85, 247, 0.6)",
    glowStrong: "0 0 35px rgba(168, 85, 247, 0.9)",
    borderColor: "#a855f7",
    bgGradient: "from-[#a855f7] to-[#7e22ce]",
    markedBg: "#a855f7",
    markedText: "#ffffff",
    cardBorder: "border-[#a855f7]",
    badgeBg: "bg-[#a855f7] text-white",
    buttonBg: "bg-[#a855f7] text-white hover:bg-[#c084fc]"
  }
};

/**
 * Obtiene el tema neón según el objeto o ID de color del jugador.
 * Si no se encuentra, retorna Cian Neón por defecto.
 */
export function getPlayerNeonTheme(playerColor) {
  if (!playerColor) return NEON_THEMES.cyan;

  if (typeof playerColor === "string") {
    const key = playerColor.toLowerCase();
    if (NEON_THEMES[key]) return NEON_THEMES[key];
    // Búsqueda por HEX
    const found = Object.values(NEON_THEMES).find((t) => t.hex.toLowerCase() === key);
    if (found) return found;
  }

  if (typeof playerColor === "object") {
    if (playerColor.id && NEON_THEMES[playerColor.id]) {
      return NEON_THEMES[playerColor.id];
    }
    if (playerColor.hex) {
      const found = Object.values(NEON_THEMES).find(
        (t) => t.hex.toLowerCase() === playerColor.hex.toLowerCase()
      );
      if (found) return found;
      
      // Crear objeto dinámico si viene un HEX personalizado
      return {
        id: "custom",
        name: playerColor.name || "Personalizado",
        hex: playerColor.hex,
        text: playerColor.text || "#ffffff",
        glow: `0 0 25px ${playerColor.hex}99`,
        glowStrong: `0 0 35px ${playerColor.hex}`,
        borderColor: playerColor.hex,
        bgGradient: `from-[${playerColor.hex}] to-[#090514]`,
        markedBg: playerColor.hex,
        markedText: playerColor.text || "#ffffff",
        cardBorder: "border-white",
        badgeBg: "bg-white text-black",
        buttonBg: "bg-white text-black"
      };
    }
  }

  return NEON_THEMES.cyan;
}
