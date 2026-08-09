/**
 * Módulo Avanzado de Audio para el Bingo Multijugador
 */

let ambientAudioCtx = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let isMusicPlaying = false;

/**
 * Fonética optimizada para evitar errores del sintetizador de voz (ej: evitar "letra primera" con la I)
 */
export function speakBallNumber(letter, number, selectedVoiceLang = "es-MX") {
  if (!("speechSynthesis" in window) || !letter || !number) return;

  window.speechSynthesis.cancel();

  // Mapeo fonético estricto
  let letterPhonetic = letter;
  if (letter === "I") letterPhonetic = "i latina";
  if (letter === "B") letterPhonetic = "Bé";
  if (letter === "N") letterPhonetic = "Ene";
  if (letter === "G") letterPhonetic = "Gé";
  if (letter === "O") letterPhonetic = "Ó";

  const textToSpeak = `Letra ${letterPhonetic}, número ${number}`;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  // Buscar voces latinas disponibles en el navegador
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
  utterance.rate = 0.95;  // Velocidad óptima
  utterance.pitch = 1.05; // Tono con energía y emoción

  window.speechSynthesis.speak(utterance);
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
 * Crea una atmósfera envolvente suave (bajos neón) que NO opaca la voz del locutor.
 */
export function toggleBackgroundMusic(enable = true) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (enable) {
      if (isMusicPlaying) return;

      ambientAudioCtx = new AudioContext();
      
      // Oscilador 1: Bajo suave neón
      ambientOsc1 = ambientAudioCtx.createOscillator();
      const gain1 = ambientAudioCtx.createGain();

      ambientOsc1.type = "sine";
      ambientOsc1.frequency.setValueAtTime(110, ambientAudioCtx.currentTime); // A2 (110Hz)

      gain1.gain.setValueAtTime(0.04, ambientAudioCtx.currentTime); // Volumen sutil (4%)

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
