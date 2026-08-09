/**
 * Módulo Avanzado de Audio y Desbloqueo Nativo para Navegadores de Smart TVs
 */

let ambientAudioCtx = null;
let ambientOsc1 = null;
let isMusicPlaying = false;
let isAudioUnlocked = false;

// Dichos populares ultra-cortos (2 a 4 palabras máximo)
const SHORT_NUMBER_JOKES = {
  1: "¡Arrancamos con toda!",
  7: "¡Número de la suerte!",
  13: "¡Sin miedo a nada!",
  15: "¡La niña bonita!",
  22: "¡Los dos patitos!",
  33: "¡La edad de Cristo!",
  48: "¡Esto está caliente!",
  69: "¡El favorito, ay caramba!",
  75: "¡La última balota!"
};

const SHORT_HUMOROUS_COMMENTS = [
  "¡Revisen bien!",
  "¡Atentos en la sala!",
  "¡Tensión total!",
  "¡Se viene el bingo!",
  "¡No disimulen!",
  "¡Casi bingo!"
];

/**
 * Desbloquea las políticas de Autoplay de Smart TVs (LG webOS, Samsung Tizen, Chrome TV)
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
      // Reproducir locución silenciosa para desbloquear el motor de voz del TV
      const silentUtterance = new SpeechSynthesisUtterance("");
      silentUtterance.volume = 0;
      window.speechSynthesis.speak(silentUtterance);
    }

    isAudioUnlocked = true;
    return true;
  } catch (err) {
    console.warn("Error al desbloquear audio en TV:", err);
    return false;
  }
}

/**
 * Fonética optimizada y locución ultrarrápida compatible con Smart TVs
 */
export function speakBallNumber(letter, number, selectedVoiceLang = "es-MX") {
  if (!letter || !number) return "";

  // Intentar desbloquear audio si aún no se ha hecho clic
  if (!isAudioUnlocked) {
    unlockTVAudio();
  }

  // Si el TV no soporta speechSynthesis, reproducimos un tono sintetizado de respaldo
  if (!("speechSynthesis" in window)) {
    playSynthesizedChime();
    return `Letra ${letter}, ${number}`;
  }

  try {
    window.speechSynthesis.cancel();

    // Mapeo fonético estricto y conciso
    let letterPhonetic = letter;
    if (letter === "I") letterPhonetic = "i latina";
    if (letter === "B") letterPhonetic = "Bé";
    if (letter === "N") letterPhonetic = "Ene";
    if (letter === "G") letterPhonetic = "Gé";
    if (letter === "O") letterPhonetic = "Ó";

    const numVal = Number(number);
    let textToSpeak = `Letra ${letterPhonetic}, ${numVal}.`;

    if (SHORT_NUMBER_JOKES[numVal]) {
      textToSpeak += ` ${SHORT_NUMBER_JOKES[numVal]}`;
    } else if (Math.random() < 0.3) {
      const randomShort = SHORT_HUMOROUS_COMMENTS[Math.floor(Math.random() * SHORT_HUMOROUS_COMMENTS.length)];
      textToSpeak += ` ${randomShort}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    const voices = window.speechSynthesis.getVoices();
    const latinVoice = voices.find((v) =>
      v.lang.includes(selectedVoiceLang) ||
      v.lang.includes("es-MX") ||
      v.lang.includes("es-US") ||
      v.lang.includes("es-CO") ||
      v.lang.includes("es-AR") ||
      v.lang.includes("es-419")
    ) || voices.find((v) => v.lang.startsWith("es"));

    if (latinVoice) {
      utterance.voice = latinVoice;
    }

    utterance.lang = selectedVoiceLang;
    utterance.rate = 1.15;  // Velocidad de voz ágil para TV
    utterance.pitch = 1.05;

    window.speechSynthesis.speak(utterance);
    return textToSpeak;
  } catch (err) {
    console.error("Error en speechSynthesis TV:", err);
    playSynthesizedChime();
    return `Letra ${letter}, ${number}`;
  }
}

/**
 * Tono sintetizado de respaldo para TVs que no tienen síntesis de voz instalada
 */
export function playSynthesizedChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!ambientAudioCtx) {
      ambientAudioCtx = new AudioContext();
    }

    if (ambientAudioCtx.state === "suspended") {
      ambientAudioCtx.resume();
    }

    const osc = ambientAudioCtx.createOscillator();
    const gain = ambientAudioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ambientAudioCtx.currentTime); // D5

    gain.gain.setValueAtTime(0.2, ambientAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ambientAudioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ambientAudioCtx.destination);

    osc.start();
    osc.stop(ambientAudioCtx.currentTime + 0.4);
  } catch (err) {
    console.warn("Chime sintetizado no disponible:", err);
  }
}

/**
 * Música de Fondo Ambiental Neón (Web Audio API)
 */
export function toggleBackgroundMusic(enable = true) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (enable) {
      if (isMusicPlaying) return;

      if (!ambientAudioCtx) {
        ambientAudioCtx = new AudioContext();
      }

      if (ambientAudioCtx.state === "suspended") {
        ambientAudioCtx.resume();
      }

      ambientOsc1 = ambientAudioCtx.createOscillator();
      const gain1 = ambientAudioCtx.createGain();

      ambientOsc1.type = "sine";
      ambientOsc1.frequency.setValueAtTime(110, ambientAudioCtx.currentTime);

      gain1.gain.setValueAtTime(0.03, ambientAudioCtx.currentTime);

      ambientOsc1.connect(gain1);
      gain1.connect(ambientAudioCtx.destination);

      ambientOsc1.start();
      isMusicPlaying = true;
    } else {
      if (ambientOsc1) {
        ambientOsc1.stop();
        ambientOsc1.disconnect();
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
  const audio = new Audio(audioUrl);
  audio.volume = 0.9;
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      playSynthesizedFanfare();
    });
  }
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
      { freq: 1046.50, time: 0.45, duration: 0.60 }
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + time);
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
