/**
 * Módulo de Audio de Alta Emoción con Voz Femenina Latina, Efectos de Sonido SFX y Música Arcade
 */

let ambientAudioCtx = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let ambientInterval = null;
let isMusicPlaying = false;
let isAudioUnlocked = false;

// Dichos populares ultra-cortos con toque femenino y eufórico
const SHORT_NUMBER_JOKES = {
  1: "¡Arrancamos con toda la vibra!",
  7: "¡Número de la buena suerte!",
  13: "¡Sin miedo a nada, familia!",
  15: "¡La niña bonita del bingo!",
  22: "¡Los dos patitos al agua!",
  33: "¡La edad de Cristo!",
  48: "¡Esto se está calentando!",
  69: "¡El favorito de la casa, ay caramba!",
  75: "¡La última balota de la noche!"
};

const SHORT_HUMOROUS_COMMENTS = [
  "¡Revisen bien esos cartones!",
  "¡Atentos todos en la sala!",
  "¡Tensión total, familia!",
  "¡Se viene el bingo ya!",
  "¡No disimulen la emoción!",
  "¡Casi casi cantamos bingo!"
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
 * Locución Latina Femenina Eufórica de Alta Emoción
 */
export function speakBallNumber(letter, number, selectedVoiceLang = "es-MX") {
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

    if (SHORT_NUMBER_JOKES[numVal]) {
      textToSpeak += ` ${SHORT_NUMBER_JOKES[numVal]}`;
    } else if (Math.random() < 0.35) {
      const randomShort = SHORT_HUMOROUS_COMMENTS[Math.floor(Math.random() * SHORT_HUMOROUS_COMMENTS.length)];
      textToSpeak += ` ${randomShort}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Buscar voces FEMENINAS latinas en el navegador (ej: Paulina, Mia, Sabina, Dalia, Lupe, Monica, etc.)
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find((v) =>
      v.lang.startsWith("es") &&
      (v.name.toLowerCase().includes("female") ||
       v.name.toLowerCase().includes("paulina") ||
       v.name.toLowerCase().includes("mia") ||
       v.name.toLowerCase().includes("sabina") ||
       v.name.toLowerCase().includes("lupe") ||
       v.name.toLowerCase().includes("dalia") ||
       v.name.toLowerCase().includes("monica") ||
       v.name.toLowerCase().includes("victoria") ||
       v.name.toLowerCase().includes("helena") ||
       v.name.toLowerCase().includes("zira"))
    ) || voices.find((v) => v.lang.includes(selectedVoiceLang)) || voices.find((v) => v.lang.startsWith("es"));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.lang = selectedVoiceLang;
    utterance.rate = 1.15;  // Velocidad ágil eufórica
    utterance.pitch = 1.25; // Tono femenino brillante y emocionado

    window.speechSynthesis.speak(utterance);
    return textToSpeak;
  } catch (err) {
    console.error("Error en locución femenina:", err);
    playBallPingSound();
    return `Letra ${letter}, ${number}`;
  }
}

/**
 * Efecto de sonido SFX de marcado táctil de celda (Arcade Pop)
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
    // Ignorar si el navegador bloquea audio
  }
}

/**
 * Efecto de sonido SFX al salir una balota (Ping de bombo)
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
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15); // C6

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (err) {
    // Ignorar si bloquea
  }
}

/**
 * Música de Fondo Casino Arcade de Alta Emoción (Libre de derechos sintetizada nativamente)
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

      // Bajo rítmico pulsante
      ambientOsc1 = ambientAudioCtx.createOscillator();
      ambientOsc2 = ambientAudioCtx.createOscillator();
      const gain1 = ambientAudioCtx.createGain();

      ambientOsc1.type = "sawtooth";
      ambientOsc1.frequency.setValueAtTime(130.81, ambientAudioCtx.currentTime); // C3

      ambientOsc2.type = "sine";
      ambientOsc2.frequency.setValueAtTime(261.63, ambientAudioCtx.currentTime); // C4

      gain1.gain.setValueAtTime(0.025, ambientAudioCtx.currentTime);

      ambientOsc1.connect(gain1);
      ambientOsc2.connect(gain1);
      gain1.connect(ambientAudioCtx.destination);

      ambientOsc1.start();
      ambientOsc2.start();
      isMusicPlaying = true;
    } else {
      if (ambientOsc1) {
        ambientOsc1.stop();
        ambientOsc1.disconnect();
      }
      if (ambientOsc2) {
        ambientOsc2.stop();
        ambientOsc2.disconnect();
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
