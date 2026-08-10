/**
 * Motor Conversacional AAA de Comentarista Familiar Multijuegos (LA SALA)
 * Provee locución contextual, personalidades dinámicas y comentarios de alta variedad.
 */

// 1. DICCIONARIO TRADICIONAL COMPLETO DE BINGO (75 BALOTAS)
export const TRADITIONAL_BINGO_JOKES = {
  1: "¡El solterón y sin compromiso!",
  2: "¡El patito nadando en la laguna!",
  3: "¡La tercera es la vencida!",
  4: "¡Las cuatro esquinas del tablero!",
  5: "¡Brincote de cinco en la mesa!",
  6: "¡Media docena completa!",
  7: "¡El número de la suerte de la casa!",
  8: "¡Los anteojos del abuelo!",
  9: "¡El noveno de la suerte!",
  10: "¡La decena perfecta!",
  11: "¡El par de muletas alineadas!",
  12: "¡La docena entera!",
  13: "¡Sin miedo al trece que trae la buena fortuna!",
  14: "¡El catorce de la suerte!",
  15: "¡La quinceañera, la niña bonita!",
  16: "¡Los dulces dieciséis!",
  17: "¡La dicha del diecisiete!",
  18: "¡La mayoría de edad celebrada!",
  19: "¡A un paso de los veinte!",
  20: "¡La primera veintena de la jornada!",
  21: "¡El número del triunfo!",
  22: "¡Los dos patitos gemelos en el agua!",
  23: "¡Los veintitrés de la dicha!",
  24: "¡El día entero de veinticuatro horas!",
  25: "¡Las bodas de plata de la fiesta!",
  26: "¡Veintiséis de la buena suerte!",
  27: "¡Veintisiete en la mesa!",
  28: "¡Veintiocho cantado con ganas!",
  29: "¡Rumbo al tres con el veintinueve!",
  30: "¡Treinta bien contados!",
  31: "¡Treinta y uno de suerte pura!",
  32: "¡Treinta y dos de la suerte!",
  33: "¡La edad de Cristo sagrada!",
  34: "¡Treinta y cuatro sonando fuerte!",
  35: "¡Treinta y cinco a mitad de camino!",
  36: "¡Tres docenas exactas!",
  37: "¡Treinta y siete chispeante!",
  38: "¡Treinta y ocho brillante!",
  39: "¡Treinta y nueve rozando los cuarenta!",
  40: "¡Cuarenta de la buena cosecha!",
  41: "¡Cuarenta y uno adelante!",
  42: "¡Cuarenta y dos firme!",
  43: "¡Cuarenta y tres en la cancha!",
  44: "¡Los dos jorobados paseando juntos!",
  45: "¡Cuarenta y cinco a tres cuartos de marcha!",
  46: "¡Cuarenta y seis encendido!",
  47: "¡Cuarenta y siete en el tablero!",
  48: "¡Cuatro docenas completas!",
  49: "¡Cuarenta y nueve arañando los cincuenta!",
  50: "¡Las bodas de oro, pura elegancia!",
  51: "¡Cincuenta y uno cantado!",
  52: "¡Las cincuenta y dos semanas del año!",
  53: "¡Cincuenta y tres potente!",
  54: "¡Cincuenta y cuatro presente!",
  55: "¡Los dos cincos hermanos de fiesta!",
  56: "¡Cincuenta y seis directo a la tabla!",
  57: "¡Cincuenta y siete en la jugada!",
  58: "¡Cincuenta y ocho firme!",
  59: "¡Cincuenta y nueve rozando el sesenta!",
  60: "¡Sesenta de la gran fiesta!",
  61: "¡Sesenta y uno brillando!",
  62: "¡Sesenta y dos al centro!",
  63: "¡Sesenta y tres de fiesta!",
  64: "¡Sesenta y cuatro fuerte!",
  65: "¡Sesenta y cinco advancing!",
  66: "¡Las dos herramientas mellizas!",
  67: "¡Sesenta y siete firme!",
  68: "¡Sesenta y ocho en la mesa!",
  69: "¡El favorito de la casa de siempre!",
  70: "¡Setenta cantados con todo el impulso!",
  71: "¡Setenta y uno adelante!",
  72: "¡Setenta y dos en la jugada!",
  73: "¡Setenta y tres firme!",
  74: "¡Setenta y cuatro al filo del triunfo!",
  75: "¡La balota cumbre de la fiesta total!"
};

// 2. BANCO DEL TÍO CHANCERO Y CHANZAS FAMILIARES (INCLUYE "JUGABA MEJOR MI ABUELITA")
export const UNDERDOG_TEASING_BANK = [
  (name) => `¡Ay mi madre, pónganle ganas en la mesa que jugaba mejor mi abuelita que ${name} hoy!`,
  (name) => `¡Un aplauso de aliento para ${name}, que está guardando toda la suerte para el remate!`,
  (name) => `¡Tranquilo ${name}, póngale fe que mi abuelita marcaba más rápido en sus tiempos!`,
  (name) => `¡${name} está aplicando la famosa estrategia del cazador sigiloso!`,
  (name) => `¡${name}, despiértame a la buena suerte que se nos quedó dormida en el sofá!`,
  (name) => `¡Mucha fe ${name}, que hasta mi abuelita con gafas te saca ventaja hoy!`,
  (name) => `¡${name} está jugando con la serenidad de un maestro zen!`,
  (name) => `¡No se rinda ${name}, que un buen remate cambia la historia!`,
  (name) => `¡Sople las cartas ${name}, a ver si bajan las luces de la suerte!`,
  (name) => `¡${name} nos está dando ventaja para hacer el juego más emocionante!`,
  (name) => `¡Fuerza ${name}, que la remontada de la casa está por comenzar!`,
  (name) => `¡${name} es el rey de la paciencia en la mesa familiar!`
];

export const LEADER_PRESSURE_BANK = [
  (name) => `¡Alguien que le ponga freno a ${name} que viene volando sin frenos!`,
  (name) => `¡Ojo todos en la mesa que ${name} ya siente el olor del trofeo!`,
  (name) => `¡Atención familia, ${name} va comandando la partida con mano firme!`,
  (name) => `¡Alerta máxima en la sala, ${name} está acariciando la victoria!`,
  (name) => `¡Que alguien le pida una pausa a ${name} que nos va a dejar a todos a cero!`,
  (name) => `¡${name} viene encendido como un motor de carreras!`,
  (name) => `¡Aprieten el paso que ${name} no está pidiendo permiso!`,
  (name) => `¡El trono de la casa ahora mismo lo reclama ${name}!`,
  (name) => `¡Se busca rival para ${name}, que viene imparable hoy!`,
  (name) => `¡Tranquilos todos, pero ${name} está jugando a nivel profesional!`,
  (name) => `¡Esa racha de ${name} está dando envidia de la buena!`,
  (name) => `¡Cuidado que ${name} viene pisando fuerte el acelerador!`,
  (name) => `¡${name} se tomó un café cargado antes de jugar hoy!`,
  (name) => `¡La buena suerte se mudó a la silla de ${name}!`,
  (name) => `¡Mucho ojo con ${name}, que no da tregua ni un segundo!`
];

export const GAME_EVENT_BANK = [
  "¡Oigan pues parceros, soplen los celulares a ver si cae la buena!",
  "¡Preparen los dedos que jugaba mejor mi abuelita si se duermen en la mesa!",
  "¡El juego giró y la suerte ya tomó su decisión!",
  "¡El que no esté atento se queda fuera de la foto de la victoria!",
  "¡Soplen los celulares y la TV para que llegue la suerte buena!",
  "¡Se siente la tensión sabrosa del juego en vivo en la sala!",
  "¡Cualquiera puede dar la sorpresa en los próximos segundos!",
  "¡Qué gran nivel de juego estamos disfrutando en familia!",
  "¡El trofeo busca dueño y la mesa está encendida!",
  "¡Ni en la final del mundial se vive tanta emoción!",
  "¡Atención en la sala que la suerte cambió de bando!",
  "¡No despeguen la vista ni un segundo!",
  "¡Marque con fe y convicción que el Tío Chancero está vigilando!"
];

// 3. PERSONALIDADES DEL LOCUTOR (MODOS Y ADAPTACIÓN AUTOMÁTICA INTELIGENTE)
export const PERSONALITY_MODES = {
  auto: {
    id: "auto",
    name: "🧠 INTELIGENTE (ADAPTATIVO AUTOMÁTICO)",
    rate: 0.98,
    pitch: 1.02,
    prefix: "",
    suffix: ""
  },
  comedian: {
    id: "comedian",
    name: "🤪 EL TÍO CHANCERO DE LA CASA",
    rate: 0.98,
    pitch: 1.05,
    prefix: "¡Oigan pues parceros! ",
    suffix: " ¡A ponerse las pilas!"
  },
  sports: {
    id: "sports",
    name: "🔥 DEPORTIVO FERVIENTE",
    rate: 1.08,
    pitch: 1.1,
    prefix: "¡Atención fans de la mesa! ",
    suffix: " ¡Qué partidazo estamos viviendo!"
  },
  classic: {
    id: "classic",
    name: "🎙️ LOCUTOR CLÁSICO",
    rate: 0.95,
    pitch: 1.0,
    prefix: "",
    suffix: ""
  },
  cyber: {
    id: "cyber",
    name: "🤖 IA FUTURISTA",
    rate: 0.90,
    pitch: 0.92,
    prefix: "Protocolo de extracción: ",
    suffix: ""
  }
};

/**
 * Determina automáticamente la personalidad adecuada según el momento de la partida
 */
export function getDynamicPersonality(drawnCount = 0, isNearVictory = false, userPreference = "auto") {
  if (userPreference && userPreference !== "auto" && PERSONALITY_MODES[userPreference]) {
    return PERSONALITY_MODES[userPreference];
  }

  // 1. Momento de Alta Tensión (Casi Bingo): Pasa automáticamente a Deportivo Ferviente
  if (isNearVictory) {
    return {
      ...PERSONALITY_MODES.sports,
      prefix: "¡ALERTA MÁXIMA DE BINGO EN LA SALA! "
    };
  }

  // 2. Etapa Final de Partida (Más de 30 balotas cantadas): Clásico Dinámico con Toques Deportivos
  if (drawnCount > 30) {
    return {
      ...PERSONALITY_MODES.sports,
      rate: 1.02,
      prefix: "¡Se aprieta la partida! "
    };
  }

  // 3. Etapa Inicial y Media (1 a 30 balotas): 100% El Tío Chancero de la Casa
  return {
    ...PERSONALITY_MODES.comedian,
    prefix: Math.random() < 0.3 ? "¡Oigan pues! " : ""
  };
}

/**
 * Obtiene una frase de "Casi Bingo" cuando a un jugador le falta 1 solo número
 */
export function getNearVictoryPhrase(playerName) {
  if (!playerName) return "";
  const phrases = [
    `¡Alerta de infarto en la sala! ¡A ${playerName} le falta solo UNA balota para cantar Bingo!`,
    `¡Atención máxima! ¡${playerName} está a UN número de llevarse la gloria!`,
    `¡Corazones palpitando! ¡${playerName} acaricia la victoria a una casilla del triunfo!`
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export function getStreakPhrase(letter, count) {
  if (!letter || count < 3) return null;
  return `¡Atención que la letra ${letter} viene imparable con ${count} balotas seguidas!`;
}

export function getRandomLeaderPhrase(leaderName) {
  if (!leaderName) return "";
  const fn = LEADER_PRESSURE_BANK[Math.floor(Math.random() * LEADER_PRESSURE_BANK.length)];
  return fn(leaderName);
}

export function getRandomUnderdogPhrase(underdogName) {
  if (!underdogName) return "";
  const fn = UNDERDOG_TEASING_BANK[Math.floor(Math.random() * UNDERDOG_TEASING_BANK.length)];
  return fn(underdogName);
}

export function getRandomEventPhrase() {
  return GAME_EVENT_BANK[Math.floor(Math.random() * GAME_EVENT_BANK.length)];
}

export function getBingoNumberJoke(number) {
  return TRADITIONAL_BINGO_JOKES[Number(number)] || null;
}
