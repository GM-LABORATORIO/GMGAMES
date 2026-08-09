/**
 * Lógica central para el Bingo Multijugador en Tiempo Real
 */

export const PRESET_TABLES = [
  {
    id: 1,
    name: "Tabla #1",
    card: [
      [{ val: 5, marked: false }, { val: 18, marked: false }, { val: 32, marked: false }, { val: 49, marked: false }, { val: 65, marked: false }],
      [{ val: 12, marked: false }, { val: 22, marked: false }, { val: 40, marked: false }, { val: 55, marked: false }, { val: 71, marked: false }],
      [{ val: 2, marked: false }, { val: 28, marked: false }, { val: "FREE", marked: true }, { val: 47, marked: false }, { val: 62, marked: false }],
      [{ val: 14, marked: false }, { val: 25, marked: false }, { val: 38, marked: false }, { val: 58, marked: false }, { val: 74, marked: false }],
      [{ val: 9, marked: false }, { val: 17, marked: false }, { val: 44, marked: false }, { val: 50, marked: false }, { val: 68, marked: false }]
    ]
  },
  {
    id: 2,
    name: "Tabla #2",
    card: [
      [{ val: 1, marked: false }, { val: 16, marked: false }, { val: 31, marked: false }, { val: 46, marked: false }, { val: 61, marked: false }],
      [{ val: 8, marked: false }, { val: 24, marked: false }, { val: 39, marked: false }, { val: 52, marked: false }, { val: 69, marked: false }],
      [{ val: 15, marked: false }, { val: 30, marked: false }, { val: "FREE", marked: true }, { val: 60, marked: false }, { val: 75, marked: false }],
      [{ val: 4, marked: false }, { val: 21, marked: false }, { val: 35, marked: false }, { val: 48, marked: false }, { val: 66, marked: false }],
      [{ val: 11, marked: false }, { val: 27, marked: false }, { val: 43, marked: false }, { val: 54, marked: false }, { val: 73, marked: false }]
    ]
  },
  {
    id: 3,
    name: "Tabla #3",
    card: [
      [{ val: 7, marked: false }, { val: 20, marked: false }, { val: 34, marked: false }, { val: 51, marked: false }, { val: 64, marked: false }],
      [{ val: 3, marked: false }, { val: 19, marked: false }, { val: 41, marked: false }, { val: 57, marked: false }, { val: 70, marked: false }],
      [{ val: 10, marked: false }, { val: 26, marked: false }, { val: "FREE", marked: true }, { val: 49, marked: false }, { val: 63, marked: false }],
      [{ val: 13, marked: false }, { val: 29, marked: false }, { val: 37, marked: false }, { val: 53, marked: false }, { val: 72, marked: false }],
      [{ val: 6, marked: false }, { val: 23, marked: false }, { val: 45, marked: false }, { val: 56, marked: false }, { val: 67, marked: false }]
    ]
  },
  {
    id: 4,
    name: "Tabla #4",
    card: [
      [{ val: 2, marked: false }, { val: 17, marked: false }, { val: 33, marked: false }, { val: 48, marked: false }, { val: 62, marked: false }],
      [{ val: 9, marked: false }, { val: 25, marked: false }, { val: 42, marked: false }, { val: 59, marked: false }, { val: 74, marked: false }],
      [{ val: 14, marked: false }, { val: 28, marked: false }, { val: "FREE", marked: true }, { val: 50, marked: false }, { val: 65, marked: false }],
      [{ val: 5, marked: false }, { val: 18, marked: false }, { val: 36, marked: false }, { val: 55, marked: false }, { val: 71, marked: false }],
      [{ val: 12, marked: false }, { val: 22, marked: false }, { val: 40, marked: false }, { val: 47, marked: false }, { val: 68, marked: false }]
    ]
  },
  {
    id: 5,
    name: "Tabla #5",
    card: [
      [{ val: 15, marked: false }, { val: 29, marked: false }, { val: 44, marked: false }, { val: 60, marked: false }, { val: 75, marked: false }],
      [{ val: 11, marked: false }, { val: 23, marked: false }, { val: 37, marked: false }, { val: 53, marked: false }, { val: 67, marked: false }],
      [{ val: 6, marked: false }, { val: 21, marked: false }, { val: "FREE", marked: true }, { val: 46, marked: false }, { val: 61, marked: false }],
      [{ val: 1, marked: false }, { val: 16, marked: false }, { val: 32, marked: false }, { val: 51, marked: false }, { val: 70, marked: false }],
      [{ val: 8, marked: false }, { val: 24, marked: false }, { val: 39, marked: false }, { val: 58, marked: false }, { val: 69, marked: false }]
    ]
  },
  {
    id: 6,
    name: "Tabla #6",
    card: [
      [{ val: 4, marked: false }, { val: 19, marked: false }, { val: 35, marked: false }, { val: 54, marked: false }, { val: 66, marked: false }],
      [{ val: 10, marked: false }, { val: 27, marked: false }, { val: 43, marked: false }, { val: 57, marked: false }, { val: 73, marked: false }],
      [{ val: 3, marked: false }, { val: 18, marked: false }, { val: "FREE", marked: true }, { val: 49, marked: false }, { val: 64, marked: false }],
      [{ val: 13, marked: false }, { val: 30, marked: false }, { val: 40, marked: false }, { val: 52, marked: false }, { val: 72, marked: false }],
      [{ val: 7, marked: false }, { val: 22, marked: false }, { val: 38, marked: false }, { val: 56, marked: false }, { val: 63, marked: false }]
    ]
  },
  {
    id: 7,
    name: "Tabla #7",
    card: [
      [{ val: 12, marked: false }, { val: 26, marked: false }, { val: 38, marked: false }, { val: 50, marked: false }, { val: 71, marked: false }],
      [{ val: 5, marked: false }, { val: 20, marked: false }, { val: 31, marked: false }, { val: 47, marked: false }, { val: 65, marked: false }],
      [{ val: 9, marked: false }, { val: 24, marked: false }, { val: "FREE", marked: true }, { val: 59, marked: false }, { val: 68, marked: false }],
      [{ val: 2, marked: false }, { val: 17, marked: false }, { val: 45, marked: false }, { val: 53, marked: false }, { val: 74, marked: false }],
      [{ val: 14, marked: false }, { val: 28, marked: false }, { val: 42, marked: false }, { val: 58, marked: false }, { val: 75, marked: false }]
    ]
  },
  {
    id: 8,
    name: "Tabla #8",
    card: [
      [{ val: 8, marked: false }, { val: 23, marked: false }, { val: 39, marked: false }, { val: 56, marked: false }, { val: 69, marked: false }],
      [{ val: 1, marked: false }, { val: 16, marked: false }, { val: 34, marked: false }, { val: 48, marked: false }, { val: 62, marked: false }],
      [{ val: 15, marked: false }, { val: 29, marked: false }, { val: "FREE", marked: true }, { val: 55, marked: false }, { val: 70, marked: false }],
      [{ val: 6, marked: false }, { val: 21, marked: false }, { val: 36, marked: false }, { val: 51, marked: false }, { val: 67, marked: false }],
      [{ val: 11, marked: false }, { val: 25, marked: false }, { val: 41, marked: false }, { val: 60, marked: false }, { val: 73, marked: false }]
    ]
  },
  {
    id: 9,
    name: "Tabla #9",
    card: [
      [{ val: 3, marked: false }, { val: 17, marked: false }, { val: 32, marked: false }, { val: 46, marked: false }, { val: 63, marked: false }],
      [{ val: 7, marked: false }, { val: 22, marked: false }, { val: 43, marked: false }, { val: 52, marked: false }, { val: 74, marked: false }],
      [{ val: 10, marked: false }, { val: 26, marked: false }, { val: "FREE", marked: true }, { val: 58, marked: false }, { val: 66, marked: false }],
      [{ val: 14, marked: false }, { val: 30, marked: false }, { val: 37, marked: false }, { val: 49, marked: false }, { val: 72, marked: false }],
      [{ val: 2, marked: false }, { val: 19, marked: false }, { val: 40, marked: false }, { val: 54, marked: false }, { val: 64, marked: false }]
    ]
  },
  {
    id: 10,
    name: "Tabla #10",
    card: [
      [{ val: 13, marked: false }, { val: 28, marked: false }, { val: 45, marked: false }, { val: 57, marked: false }, { val: 75, marked: false }],
      [{ val: 4, marked: false }, { val: 18, marked: false }, { val: 33, marked: false }, { val: 47, marked: false }, { val: 61, marked: false }],
      [{ val: 9, marked: false }, { val: 25, marked: false }, { val: "FREE", marked: true }, { val: 53, marked: false }, { val: 69, marked: false }],
      [{ val: 11, marked: false }, { val: 24, marked: false }, { val: 42, marked: false }, { val: 50, marked: false }, { val: 70, marked: false }],
      [{ val: 5, marked: false }, { val: 20, marked: false }, { val: 35, marked: false }, { val: 59, marked: false }, { val: 68, marked: false }]
    ]
  }
];

export function getPresetCard(tableId = 1) {
  const index = Math.max(0, Math.min(9, tableId - 1));
  const preset = PRESET_TABLES[index];
  return JSON.parse(JSON.stringify(preset.card));
}

export function generateBingoCard() {
  const getUniqueRandoms = (min, max, count) => {
    const nums = new Set();
    while (nums.size < count) {
      const rand = Math.floor(Math.random() * (max - min + 1)) + min;
      nums.add(rand);
    }
    return Array.from(nums);
  };

  const colB = getUniqueRandoms(1, 15, 5);
  const colI = getUniqueRandoms(16, 30, 5);
  const colN = getUniqueRandoms(31, 45, 4);
  const colG = getUniqueRandoms(46, 60, 5);
  const colO = getUniqueRandoms(61, 75, 5);

  colN.splice(2, 0, "FREE");

  const cardMatrix = [];
  for (let row = 0; row < 5; row++) {
    cardMatrix.push([
      { val: colB[row], marked: false },
      { val: colI[row], marked: false },
      { val: colN[row], marked: colN[row] === "FREE" },
      { val: colG[row], marked: false },
      { val: colO[row], marked: false }
    ]);
  }

  return cardMatrix;
}

export function getLetterForNumber(num) {
  if (typeof num !== "number") return "";
  if (num >= 1 && num <= 15) return "B";
  if (num >= 16 && num <= 30) return "I";
  if (num >= 31 && num <= 45) return "N";
  if (num >= 46 && num <= 60) return "G";
  if (num >= 61 && num <= 75) return "O";
  return "";
}

export function generateAvailableNumbers() {
  const numbers = [];
  for (let i = 1; i <= 75; i++) {
    numbers.push(i);
  }
  return numbers;
}

export function drawRandomBall(availableNumbers = []) {
  if (!availableNumbers || availableNumbers.length === 0) {
    return { ball: null, remaining: [] };
  }
  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  const ball = availableNumbers[randomIndex];
  const remaining = availableNumbers.filter((_, idx) => idx !== randomIndex);
  return { ball, remaining };
}

/**
 * Evaluación estricta de victorias en Bingo:
 * @param {Array} cardMatrix - Matriz 5x5 del cartón
 * @param {Array} drawnBalls - Arreglo de balotas cantadas
 * @param {string} victoryMode - Modo de victoria: "line" (Línea de 5) o "fullhouse" (Cartón Lleno de 25)
 */
export function checkBingoVictory(cardMatrix, drawnBalls = [], victoryMode = "line") {
  if (!cardMatrix || cardMatrix.length !== 5) {
    return { hasBingo: false, type: null, reason: "Cartón no válido" };
  }

  // Normalizar array de balotas cantadas a un Set de números estrictos
  const drawnSet = new Set((drawnBalls || []).map((num) => Number(num)));

  // Helper para verificar si una celda es efectivamente válida (FREE o marcada y cantada)
  const isCellValid = (cell) => {
    if (!cell) return false;
    if (cell.val === "FREE") return true;
    const cellNum = Number(cell.val);
    return Boolean(cell.marked) && drawnSet.has(cellNum);
  };

  // Contar cuántos aciertos válidos reales tiene el jugador
  let validCount = 0;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (isCellValid(cardMatrix[r][c])) {
        validCount++;
      }
    }
  }

  // 1. Verificación de Cartón Lleno (Full House: 25 celdas válidas)
  let fullHouse = true;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (!isCellValid(cardMatrix[r][c])) {
        fullHouse = false;
        break;
      }
    }
    if (!fullHouse) break;
  }

  if (fullHouse) {
    return { hasBingo: true, type: "¡CARTÓN LLENO! (Full House 25/25)", validCount };
  }

  if (victoryMode === "fullhouse") {
    return {
      hasBingo: false,
      type: null,
      reason: `⚠️ MODO CARTÓN LLENO: Tienes ${validCount - 1} números de 24 requeridos.`,
      validCount
    };
  }

  // 2. Verificación de Líneas Horizontales (5 celdas en fila)
  for (let r = 0; r < 5; r++) {
    let rowWon = true;
    for (let c = 0; c < 5; c++) {
      if (!isCellValid(cardMatrix[r][c])) {
        rowWon = false;
        break;
      }
    }
    if (rowWon) {
      return { hasBingo: true, type: `Línea Horizontal (Fila ${r + 1})`, validCount };
    }
  }

  // 3. Verificación de Líneas Verticales (5 celdas en columna)
  const letters = ["B", "I", "N", "G", "O"];
  for (let c = 0; c < 5; c++) {
    let colWon = true;
    for (let r = 0; r < 5; r++) {
      if (!isCellValid(cardMatrix[r][c])) {
        colWon = false;
        break;
      }
    }
    if (colWon) {
      return { hasBingo: true, type: `Línea Vertical (Columna ${letters[c]})`, validCount };
    }
  }

  // 4. Diagonal Principal (\)
  let diag1Won = true;
  for (let i = 0; i < 5; i++) {
    if (!isCellValid(cardMatrix[i][i])) {
      diag1Won = false;
      break;
    }
  }
  if (diag1Won) {
    return { hasBingo: true, type: "Diagonal Principal (\\)", validCount };
  }

  // 5. Diagonal Secundaria (/)
  let diag2Won = true;
  for (let i = 0; i < 5; i++) {
    if (!isCellValid(cardMatrix[i][4 - i])) {
      diag2Won = false;
      break;
    }
  }
  if (diag2Won) {
    return { hasBingo: true, type: "Diagonal Secundaria (/)", validCount };
  }

  return {
    hasBingo: false,
    type: null,
    reason: `⚠️ AÚN NO TIENES BINGO: Tienes ${validCount - 1} números cantados marcados de 5 necesarios para una línea.`,
    validCount
  };
}
