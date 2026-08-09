/**
 * Módulo Avanzado de Audio para el Bingo Multijugador con Locución Latina Conmovedora y Punchy
 */

let ambientAudioCtx = null;
let ambientOsc1 = null;
let isMusicPlaying = false;

// Dichos populares ultra-cortos (2 a 4 palabras máximo) para garantizar locución rápida
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

// Comentarios graciosos ultra-cortos para no saturar la locución
const SHORT_HUMOROUS_COMMENTS = [
  "¡Revisen bien!",
  "¡Atentos en la sala!",
  "¡Tensión total!",
  "¡Se viene el bingo!",
  "¡No disimulen!",
  "¡Casi bingo!"
];

/**
 * Fonética optimizada y locución ultrarrápida que NUNCA se corta
 */
export function speakBallNumber(letter, number, selectedVoiceLang = "es-MX") {
  if (!("speechSynthesis" in window) || !letter || !number) return "";

  // Cancelar locuciones pasadas para dar prioridad a la balota actual
  window.speechSynthesis.cancel();

  // Mapeo fonético estricto y conciso
  let letterPhonetic = letter;
  if (letter === "I") letterPhonetic = "i latina";
  if (letter === "B") letterPhonetic = "Bé";
  if (letter === "N") letterPhonetic = "Ene";
  if (letter === "G") letterPhonetic = "Gé";
  if (letter === "O") letterPhonetic = "Ó";

  const numVal = Number(number);
  
  // El número SIEMPRE se canta primero de forma prioritaria y ultra-clara
  let textToSpeak = `Letra ${letterPhonetic}, ${numVal}.`;

  // Añadir un comentario ultra-corto opcional de 2 palabras máximo
  if (SHORT_NUMBER_JOKES[numVal]) {
    textToSpeak += ` ${SHORT_NUMBER_JOKES[numVal]}`;
  } else if (Math.random() < 0.3) {
    const randomShort = SHORT_HUMOROUS_COMMENTS[Math.floor(Math.random() * SHORT_HUMOROUS_COMMENTS.length)];
    textToSpeak += ` ${randomShort}`;
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  // Buscar voces latinas disponibles
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
  utterance.rate = 1.15;  // Velocidad ágil (1.15x) para locución en <1.5s
  utterance.pitch = 1.05; // Tono alegre y dinámico

  window.speechSynthesis.speak(utterance);
  return textToSpeak;
}

/**
 * Obtiene la lista de voces en español disponibles en el navegador
 */
export function getSpanishVoices() {
  if (!("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.filter((v) => v.lang.startsWith("es"));
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

      ambientAudioCtx = new AudioContext();
      ambientOsc1 = ambientAudioCtx.createOscillator();
      const gain1 = ambientAudioCtx.createGain();

      ambientOsc1.type = "sine";
      ambientOsc1.frequency.setValueAtTime(110, ambientAudioCtx.currentTime);

      gain1.gain.setValueAtTime(0.04, ambientAudioCtx.currentTime);

      ambientOsc1.connect(gain1);
      gain1.connect(ambientAudioCtx.destination);

      ambientOsc1.start();
      isMusicPlaying = true;
    } else {
      if (ambientOsc1) {
        ambientOsc1.stop();
        ambientOsc1.disconnect();
      }
      if (ambientAudioCtx) {
        ambientAudioCtx.close();
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

    const ctx = new AudioContext();
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
