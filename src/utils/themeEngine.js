/**
 * Motor de Tema Neón Dinámico Cyber Glass para Jugadores de Bingo
 * Genera tokens completos de UI (colores, resplandor, bordes, gradientes y botones)
 */

export const NEON_THEMES = {
  green: {
    id: "green",
    name: "Verde Esmeralda",
    hex: "#00ff88",
    text: "#000000",
    glow: "0 0 20px rgba(0, 255, 136, 0.4)",
    glowStrong: "0 0 30px rgba(0, 255, 136, 0.7)",
    borderColor: "#00ff88",
    bgGradient: "from-[#00ff88] to-[#00f3ff]",
    markedBg: "#00ff88",
    markedText: "#000000",
    buttonBg: "bg-gradient-to-r from-[#00ff88] to-[#00f3ff] text-black"
  },
  cyan: {
    id: "cyan",
    name: "Cian Eléctrico",
    hex: "#00f3ff",
    text: "#000000",
    glow: "0 0 20px rgba(0, 243, 255, 0.4)",
    glowStrong: "0 0 30px rgba(0, 243, 255, 0.7)",
    borderColor: "#00f3ff",
    bgGradient: "from-[#00f3ff] to-[#0088ff]",
    markedBg: "#00f3ff",
    markedText: "#000000",
    buttonBg: "bg-gradient-to-r from-[#00f3ff] to-[#0088ff] text-black"
  },
  purple: {
    id: "purple",
    name: "Púrpura Neón",
    hex: "#a855f7",
    text: "#ffffff",
    glow: "0 0 20px rgba(168, 85, 247, 0.4)",
    glowStrong: "0 0 30px rgba(168, 85, 247, 0.7)",
    borderColor: "#a855f7",
    bgGradient: "from-[#a855f7] to-[#ec4899]",
    markedBg: "#a855f7",
    markedText: "#ffffff",
    buttonBg: "bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white"
  },
  magenta: {
    id: "magenta",
    name: "Rosa Fuego",
    hex: "#ff007f",
    text: "#ffffff",
    glow: "0 0 20px rgba(255, 0, 127, 0.4)",
    glowStrong: "0 0 30px rgba(255, 0, 127, 0.7)",
    borderColor: "#ff007f",
    bgGradient: "from-[#ff007f] to-[#ff5500]",
    markedBg: "#ff007f",
    markedText: "#ffffff",
    buttonBg: "bg-gradient-to-r from-[#ff007f] to-[#ff5500] text-white"
  },
  yellow: {
    id: "yellow",
    name: "Oro Eléctrico",
    hex: "#ffcc00",
    text: "#000000",
    glow: "0 0 20px rgba(255, 204, 0, 0.4)",
    glowStrong: "0 0 30px rgba(255, 204, 0, 0.7)",
    borderColor: "#ffcc00",
    bgGradient: "from-[#ffcc00] to-[#ff8800]",
    markedBg: "#ffcc00",
    markedText: "#000000",
    buttonBg: "bg-gradient-to-r from-[#ffcc00] to-[#ff8800] text-black"
  },
  orange: {
    id: "orange",
    name: "Naranja Neón",
    hex: "#ff5500",
    text: "#ffffff",
    glow: "0 0 20px rgba(255, 85, 0, 0.4)",
    glowStrong: "0 0 30px rgba(255, 85, 0, 0.7)",
    borderColor: "#ff5500",
    bgGradient: "from-[#ff5500] to-[#ff0055]",
    markedBg: "#ff5500",
    markedText: "#ffffff",
    buttonBg: "bg-gradient-to-r from-[#ff5500] to-[#ff0055] text-white"
  }
};

export function getPlayerNeonTheme(playerColor) {
  if (!playerColor) return NEON_THEMES.green;

  if (typeof playerColor === "string") {
    const key = playerColor.toLowerCase();
    if (NEON_THEMES[key]) return NEON_THEMES[key];
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
      
      return {
        id: "custom",
        name: playerColor.name || "Personalizado",
        hex: playerColor.hex,
        text: playerColor.text || "#000000",
        glow: `0 0 20px ${playerColor.hex}66`,
        glowStrong: `0 0 30px ${playerColor.hex}`,
        borderColor: playerColor.hex,
        bgGradient: `from-[${playerColor.hex}] to-[#06070d]`,
        markedBg: playerColor.hex,
        markedText: playerColor.text || "#000000",
        buttonBg: "bg-white text-black"
      };
    }
  }

  return NEON_THEMES.green;
}
