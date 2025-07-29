// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
/*
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}
*/
// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEfNB6U96_i4kmBTU4crAKXya1ZQXDpks",
  authDomain: "peluqueria-web-792f0.firebaseapp.com",
  projectId: "peluqueria-web-792f0",
  storageBucket: "peluqueria-web-792f0.firebasestorage.app",
  messagingSenderId: "687230116423",
  appId: "1:687230116423:web:0cbe5688796a4a7b270762",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que vas a usar
export const auth = getAuth(app);
export const db = getFirestore(app);
