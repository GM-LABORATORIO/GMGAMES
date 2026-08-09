import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCP7ff7oxn2lT5JAMf2hVP2GOh5tG_TjhI",
  authDomain: "bingo-loaiza-sille.firebaseapp.com",
  databaseURL: "https://bingo-loaiza-sille-default-rtdb.firebaseio.com",
  projectId: "bingo-loaiza-sille",
  storageBucket: "bingo-loaiza-sille.firebasestorage.app",
  messagingSenderId: "806323006496",
  appId: "1:806323006496:web:99eca8ea3fe2d9ea066045",
  measurementId: "G-L9PGL9YDEC"
};

// Evitar errores de inicialización duplicada en recargas HMR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getDatabase(app);
