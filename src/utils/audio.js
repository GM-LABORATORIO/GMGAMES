import {
  getRandomLeaderPhrase,
  getRandomUnderdogPhrase,
  getRandomEventPhrase,
  getBingoNumberJoke,
  PERSONALITY_MODES,
  getDynamicPersonality
} from "./announcerEngine";

let ambientAudioCtx = null;
let musicGainNode = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let bgAudioElement = null;
let isMusicPlaying = false;
let isAudioUnlocked = false;
let currentTrackId = "track1";

const TRACK_PATHS = {
  track1: "/audio/track1.mp3",
  track2: "/audio/track2.mp3"
};

// Configuración Profesional de Audio: 20% de volumen ambiente, 4% durante locución
const BASE_MUSIC_VOLUME = 0.20;
const DUCKED_MUSIC_VOLUME = 0.04;

// Mapeo fonético estricto de números a palabras escritas para dicción cristalina
const NUMBER_WORDS = {
  1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco",
  6: "seis", 7: "siete", 8: "ocho", 9: "nueve", 10: "diez",
  11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince",
  16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve", 20: "veinte",
  21: "veintiuno", 22: "veintidós", 23: "veintitrés", 24: "veinticuatro", 25: "veinticinco",
  26: "veintiséis", 27: "veintisiete", 28: "veintiocho", 29: "veintinueve", 30: "treinta",
  31: "treinta y uno", 32: "treinta y dos", 33: "treinta y tres", 34: "treinta y cuatro", 35: "treinta y cinco",
  36: "treinta y seis", 37: "treinta y siete", 38: "treinta y ocho", 39: "treinta y nueve", 40: "cuarenta",
  41: "cuarenta y uno", 42: "cuarenta y dos", 43: "cuarenta y tres", 44: "cuarenta y cuatro", 45: "cuarenta y cinco",
  46: "cuarenta y seis", 47: "cuarenta y siete", 48: "cuarenta y ocho", 49: "cuarenta y nueve", 50: "cincuenta",
  51: "cincuenta y uno", 52: "cincuenta y dos", 53: "cincuenta y tres", 54: "cincuenta y cuatro", 55: "cincuenta y cinco",
  56: "cincuenta y seis", 57: "cincuenta y siete", 58: "cincuenta y ocho", 59: "cincuenta y nueve", 60: "sesenta",
  61: "sesenta y uno", 62: "sesenta y dos", 63: "sesenta y tres", 64: "sesenta y cuatro", 65: "sesenta y cinco",
  66: "sesenta y seis", 67: "sesenta y siete", 68: "sesenta y ocho", 69: "sesenta y nueve", 70: "setenta",
  71: "setenta y uno", 72: "setenta y dos", 73: "setenta y tres", 74: "setenta y cuatro", 75: "setenta y cinco"
};

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

export function getAvailableSpanishVoices() {
  if (!("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  const esVoices = voices.filter((v) => v.lang.startsWith("es") || v.lang.includes("es-"));

  return esVoices.sort((a, b) => {
    const aIsNeural = a.name.toLowerCase().includes("google") || a.name.toLowerCase().includes("natural") || a.name.toLowerCase().includes("neural") || a.name.toLowerCase().includes("premium");
    const bIsNeural = b.name.toLowerCase().includes("google") || b.name.toLowerCase().includes("natural") || b.name.toLowerCase().includes("neural") || b.name.toLowerCase().includes("premium");
    if (aIsNeural && !bIsNeural) return -1;
    if (!aIsNeural && bIsNeural) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Atenuación Profesional de Audio (Smart Ducking al 20% / 4%)
 */
function duckBackgroundMusic(duck = true) {
  if (bgAudioElement) {
    bgAudioElement.volume = duck ? DUCKED_MUSIC_VOLUME : BASE_MUSIC_VOLUME;
  }

  if (musicGainNode && ambientAudioCtx) {
    try {
      const targetVol = duck ? 0.015 : 0.08;
      musicGainNode.gain.cancelScheduledValues(ambientAudioCtx.currentTime);
      musicGainNode.gain.linearRampToValueAtTime(targetVol, ambientAudioCtx.currentTime + 0.15);
    } catch (err) {
      // Ignorar
    }
  }
}

let activeUtterance = null;
let speechFallbackTimer = null;

/**
 * Locución Perfeccionada con Smart Audio Ducking y Garantía de Finalización de Voz
 */
export function speakBallNumber(letter, number, selectedVoiceURI = "", leaderInfo = null, underdogInfo = null, personalityModeKey = "auto", drawnCount = 0, onSpeechEndCallback = null) {
  if (!letter || !number) return "";

  if (!isAudioUnlocked) {
    unlockTVAudio();
  }

  if (!("speechSynthesis" in window)) {
    playBallPingSound();
    if (onSpeechEndCallback) setTimeout(onSpeechEndCallback, 1500);
    return `Letra ${letter}, ${number}`;
  }

  try {
    // Cancelar temporizador previo de seguridad
    if (speechFallbackTimer) {
      clearTimeout(speechFallbackTimer);
      speechFallbackTimer = null;
    }

    window.speechSynthesis.cancel();

    const fonetica = { B: 'Bé', I: 'I', N: 'Éne', G: 'Ge', O: 'O' };
    const letterPhonetic = fonetica[letter] || letter;

    const numVal = Number(number);
    const numWord = NUMBER_WORDS[numVal] || numVal.toString();

    let textToSpeak = `Letra ${letterPhonetic}, número ${numWord}.`;

    const randChoice = Math.random();

    // 1. Dichos tradicionales especiales por número
    const specialJoke = getBingoNumberJoke(numVal);
    if (specialJoke) {
      textToSpeak += ` ${specialJoke}`;
    } 
    // 2. Chanza sana para el Colero (25% probabilidad)
    else if (underdogInfo && underdogInfo.name && randChoice < 0.25) {
      textToSpeak += ` ${getRandomUnderdogPhrase(underdogInfo.name)}`;
    }
    // 3. Mención de Presión al Líder (25% probabilidad)
    else if (leaderInfo && leaderInfo.name && leaderInfo.hits >= 3 && randChoice < 0.50) {
      textToSpeak += ` ${getRandomLeaderPhrase(leaderInfo.name)}`;
    } 
    // 4. Comentario humorístico general de juego (20% probabilidad)
    else if (randChoice < 0.70) {
      textToSpeak += ` ${getRandomEventPhrase()}`;
    }

    const isNearVictory = Boolean(leaderInfo && leaderInfo.hits >= 4);
    const personality = getDynamicPersonality(drawnCount, isNearVictory, personalityModeKey);
    const fullPhrase = `${personality.prefix || ""}${textToSpeak}${personality.suffix || ""}`;

    const utterance = new SpeechSynthesisUtterance(fullPhrase);
    activeUtterance = utterance; // EVITAR GARBAGE COLLECTION EN SAFARI/CHROME MID-SPEECH

    const voices = window.speechSynthesis.getVoices();
    if (selectedVoiceURI) {
      const chosenVoice = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (chosenVoice) utterance.voice = chosenVoice;
    } else {
      const defaultEsVoice = voices.find((v) => v.lang.startsWith("es"));
      if (defaultEsVoice) utterance.voice = defaultEsVoice;
    }

    utterance.lang = utterance.voice?.lang || "es-ES";
    utterance.rate = personality.rate || 0.98;
    utterance.pitch = personality.pitch || 1.02;

    let hasHandledEnd = false;
    const finishSpeech = () => {
      if (hasHandledEnd) return;
      hasHandledEnd = true;

      if (speechFallbackTimer) {
        clearTimeout(speechFallbackTimer);
        speechFallbackTimer = null;
      }
      activeUtterance = null;
      duckBackgroundMusic(false);
      if (onSpeechEndCallback) onSpeechEndCallback();
    };

    utterance.onstart = () => {
      duckBackgroundMusic(true);
    };

    utterance.onend = finishSpeech;
    utterance.onerror = finishSpeech;

    // TEMPORIZADOR DE SEGURIDAD GARANTIZADO: Si el navegador no dispara onend tras tiempo estimado, forzar continuacion
    const estimatedDurationMs = Math.max(3500, textToSpeak.split(" ").length * 350 + 2500);
    speechFallbackTimer = setTimeout(finishSpeech, estimatedDurationMs);

    window.speechSynthesis.speak(utterance);
    return textToSpeak;
  } catch (err) {
    console.error("Error en locución perfeccionada:", err);
    playBallPingSound();
    if (onSpeechEndCallback) setTimeout(onSpeechEndCallback, 1500);
    return `Letra ${letter}, ${number}`;
  }
}

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

function playSynthesizedTrack(trackId) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!ambientAudioCtx) {
      ambientAudioCtx = new AudioContext();
    }
    if (ambientAudioCtx.state === "suspended") {
      ambientAudioCtx.resume();
    }

    if (ambientOsc1) {
      try { ambientOsc1.stop(); } catch (e) {}
    }
    if (ambientOsc2) {
      try { ambientOsc2.stop(); } catch (e) {}
    }

    ambientOsc1 = ambientAudioCtx.createOscillator();
    ambientOsc2 = ambientAudioCtx.createOscillator();
    musicGainNode = ambientAudioCtx.createGain();

    if (trackId === "track1") {
      ambientOsc1.type = "sine";
      ambientOsc1.frequency.setValueAtTime(220, ambientAudioCtx.currentTime);
      ambientOsc2.type = "sawtooth";
      ambientOsc2.frequency.setValueAtTime(329.63, ambientAudioCtx.currentTime);
    } else {
      ambientOsc1.type = "triangle";
      ambientOsc1.frequency.setValueAtTime(174.61, ambientAudioCtx.currentTime);
      ambientOsc2.type = "sine";
      ambientOsc2.frequency.setValueAtTime(261.63, ambientAudioCtx.currentTime);
    }

    musicGainNode.gain.setValueAtTime(0.08, ambientAudioCtx.currentTime);

    ambientOsc1.connect(musicGainNode);
    ambientOsc2.connect(musicGainNode);
    musicGainNode.connect(ambientAudioCtx.destination);

    ambientOsc1.start();
    ambientOsc2.start();
  } catch (err) {
    console.warn("Fallback sintetizado no disponible:", err);
  }
}

/**
 * Carga y Reproduce Pistas MP3 reales de public/audio/track1.mp3 y track2.mp3 al 20%
 */
export function toggleBackgroundMusic(enable = true, trackId = "track1") {
  currentTrackId = trackId;

  if (bgAudioElement) {
    bgAudioElement.pause();
    bgAudioElement = null;
  }
  if (ambientOsc1) {
    try { ambientOsc1.stop(); } catch (e) {}
    ambientOsc1 = null;
  }
  if (ambientOsc2) {
    try { ambientOsc2.stop(); } catch (e) {}
    ambientOsc2 = null;
  }

  if (enable && trackId !== "off") {
    const audioPath = TRACK_PATHS[trackId] || TRACK_PATHS.track1;

    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = BASE_MUSIC_VOLUME; // 20% del volumen master

    audio.play().then(() => {
      bgAudioElement = audio;
      isMusicPlaying = true;
    }).catch(() => {
      // Fallback a sintetizador nativo si el archivo MP3 no existe aún
      playSynthesizedTrack(trackId);
      isMusicPlaying = true;
    });
  } else {
    isMusicPlaying = false;
  }
}

export function playVictoryAudio(audioUrl = "/audio/victory.mp3") {
  playSynthesizedFanfare();
}

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
