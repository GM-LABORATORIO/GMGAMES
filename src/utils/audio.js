/**
 * Módulo de Audio y Locución Natural con Selector Libre de Voces y Música de Fondo Casino
 */

let ambientAudioCtx = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let isMusicPlaying = false;
let isAudioUnlocked = false;

const SHORT_NUMBER_JOKES = {
  1: "¡Arrancamos con toda la actitud!",
  7: "¡Número de la buena suerte!",
  13: "¡Sin miedo!",
  15: "¡La niña bonita!",
  22: "¡Los dos patitos!",
  33: "¡La edad de Cristo!",
  48: "¡Está caliente!",
  69: "¡El favorito, ay caramba!",
  75: "¡La última balota!"
};

const HUMOROUS_COMMENTS = [
  "¡Revisen bien el cartón!",
  "¡Atentos en la sala!",
  "¡Se viene el bingo!",
  "¡No se dejen coger la ventaja!"
];

/**
 * Desbloquea el contexto de audio en Smart TVs y celulares
 */
export function unlockTVAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      if (!ambientAudioCtx) {
        ambientAudioCtx = new AudioContext();
      }
      if (ambientAudioCtx.state === "suspended") {
        ambientAudioCtx.resume();
      }
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume();
      const silentUtterance = new SpeechSynthesisUtterance("");
      silentUtterance.volume = 0;
      window.speechSynthesis.speak(silentUtterance);
    }

    isAudioUnlocked = true;
    return true;
  } catch (err) {
    console.warn("Error al desbloquear audio:", err);
    return false;
  }
}

/**
 * Obtiene la lista completa de voces en español disponibles en el dispositivo/navegador
 */
export function getAvailableSpanishVoices() {
  if (!("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.filter((v) => v.lang.startsWith("es") || v.lang.includes("es-"));
}

/**
 * Locución Natural Humana con Voz Seleccionable por el Usuario
 * @param {string} letter - Letra (B, I, N, G, O)
 * @param {number|string} number - Número cantado
 * @param {string} selectedVoiceURI - URI de la voz específica elegida por el usuario
 * @param {Object} leaderInfo - Información del líder { name: "Bruno", hits: 4 }
 */
export function speakBallNumber(letter, number, selectedVoiceURI = "", leaderInfo = null) {
  if (!letter || !number) return "";

  if (!isAudioUnlocked) {
    unlockTVAudio();
  }

  if (!("speechSynthesis" in window)) {
    playBallPingSound();
    return `Letra ${letter}, ${number}`;
  }

  try {
    window.speechSynthesis.cancel();

    let letterPhonetic = letter;
    if (letter === "I") letterPhonetic = "i latina";
    if (letter === "B") letterPhonetic = "Bé";
    if (letter === "N") letterPhonetic = "Ene";
    if (letter === "G") letterPhonetic = "Gé";
    if (letter === "O") letterPhonetic = "Ó";

    const numVal = Number(number);
    let textToSpeak = `Letra ${letterPhonetic}, ${numVal}.`;

    // 1. Dichos especiales por número famoso
    if (SHORT_NUMBER_JOKES[numVal]) {
      textToSpeak += ` ${SHORT_NUMBER_JOKES[numVal]}`;
    } 
    // 2. Mención de PRESIÓN AL LÍDER (Solamente 15% de probabilidad para no saturar)
    else if (leaderInfo && leaderInfo.name && leaderInfo.hits >= 3 && Math.random() < 0.15) {
      const pressurePhrases = [
        `¡${leaderInfo.name} lleva la delantera!`,
        `¡${leaderInfo.name} va liderando!`,
        `¡Ojo con ${leaderInfo.name}!`
      ];
      const selectedPressure = pressurePhrases[Math.floor(Math.random() * pressurePhrases.length)];
      textToSpeak += ` ${selectedPressure}`;
    } 
    // 3. Comentario humorístico general ocasional (15%)
    else if (Math.random() < 0.15) {
      const randomShort = HUMOROUS_COMMENTS[Math.floor(Math.random() * HUMOROUS_COMMENTS.length)];
      textToSpeak += ` ${randomShort}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Asignar voz seleccionada por el usuario si existe
    const voices = window.speechSynthesis.getVoices();
    if (selectedVoiceURI) {
      const chosenVoice = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (chosenVoice) utterance.voice = chosenVoice;
    } else {
      const defaultEsVoice = voices.find((v) => v.lang.startsWith("es"));
      if (defaultEsVoice) utterance.voice = defaultEsVoice;
    }

    utterance.lang = utterance.voice?.lang || "es-MX";
    utterance.rate = 1.05;  // Velocidad natural de conversación humana
    utterance.pitch = 1.0;  // Tono de voz humano natural (evita sonar como Alexa o robótico)

    window.speechSynthesis.speak(utterance);
    return textToSpeak;
  } catch (err) {
    console.error("Error en locución natural:", err);
    playBallPingSound();
    return `Letra ${letter}, ${number}`;
  }
}

/**
 * Efecto de sonido SFX de marcado táctil (Arcade Pop)
 */
export function playPopSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = ambientAudioCtx || new AudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    // Ignorar
  }
}

/**
 * Efecto de sonido SFX al salir una balota
 */
export function playBallPingSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = ambientAudioCtx || new AudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (err) {
    // Ignorar
  }
}

/**
 * Música de Fondo Casino Arcade Garantizada (Web Audio API)
 */
export function toggleBackgroundMusic(enable = true) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (enable) {
      if (!ambientAudioCtx) {
        ambientAudioCtx = new AudioContext();
      }

      if (ambientAudioCtx.state === "suspended") {
        ambientAudioCtx.resume();
      }

      // Detener osciladores previos si estaban activos
      if (ambientOsc1) {
        try { ambientOsc1.stop(); } catch (e) {}
      }
      if (ambientOsc2) {
        try { ambientOsc2.stop(); } catch (e) {}
      }

      // Armonía de bajo arcade suave y audible
      ambientOsc1 = ambientAudioCtx.createOscillator();
      ambientOsc2 = ambientAudioCtx.createOscillator();
      const gainNode = ambientAudioCtx.createGain();

      ambientOsc1.type = "sine";
      ambientOsc1.frequency.setValueAtTime(220, ambientAudioCtx.currentTime); // A3

      ambientOsc2.type = "triangle";
      ambientOsc2.frequency.setValueAtTime(329.63, ambientAudioCtx.currentTime); // E4

      gainNode.gain.setValueAtTime(0.08, ambientAudioCtx.currentTime); // Volumen audible suave (8%)

      ambientOsc1.connect(gainNode);
      ambientOsc2.connect(gainNode);
      gainNode.connect(ambientAudioCtx.destination);

      ambientOsc1.start();
      ambientOsc2.start();
      isMusicPlaying = true;
    } else {
      if (ambientOsc1) {
        try { ambientOsc1.stop(); } catch (e) {}
        ambientOsc1 = null;
      }
      if (ambientOsc2) {
        try { ambientOsc2.stop(); } catch (e) {}
        ambientOsc2 = null;
      }
      isMusicPlaying = false;
    }
  } catch (err) {
    console.warn("Música de fondo no disponible:", err);
  }
}

/**
 * Audio de Victoria al cantar BINGO
 */
export function playVictoryAudio(audioUrl = "/audio/victory.mp3") {
  playSynthesizedFanfare();
}

/**
 * Fanfarria triunfal sintetizada nativamente con Web Audio API
 */
export function playSynthesizedFanfare() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = ambientAudioCtx || new AudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const notes = [
      { freq: 523.25, time: 0.00, duration: 0.15 },
      { freq: 659.25, time: 0.15, duration: 0.15 },
      { freq: 783.99, time: 0.30, duration: 0.15 },
      { freq: 1046.50, time: 0.45, duration: 0.70 }
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      gain.gain.setValueAtTime(0.35, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + duration);
    });
  } catch (err) {
    console.error("Error al sintetizar fanfarria:", err);
  }
}
