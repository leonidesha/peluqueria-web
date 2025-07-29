// src/components/Login.tsx
import {
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";
import { RecaptchaVerifier } from "firebase/auth/web-extension";
import { useState } from "react";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult; // Para almacenar el resultado de la confirmación del número de teléfono
  }
}

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario autenticado:", user);
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  const handlePhoneLogin = async () => {
    // Configurar reCAPTCHA
    const [loading, setloading] = useState(false);

    auth.useDeviceLanguage(); // Configura el idioma del dispositivo para la autenticación
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "sing-in-button", {
      size: "invisible",
      callback: (response: any) => {
        // Captcha resuelto, puedes proceder con la autenticación
        console.log("Captcha resuelto:", response);
        onSignInSubmit();
      },
      "expired-callback": () => {
        // El captcha ha expirado, puedes manejarlo aquí
        console.warn("Captcha expirado");
      },
    });
    const phoneNumber = "+5358943924"; // Reemplaza con el número de teléfono del usuario
    const sendCode = async () => {
      setloading(true);
      //StorageError("");
      try {
        const verifier = new RecaptchaVerifier(auth, "send-code-button", {
          size: "invisible",
          callback: (response: any) => {
            // Captcha resuelto, puedes proceder con la autenticación
            console.log("Captcha resuelto:", response);
          },
        });
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          verifier
        );
      } catch (error) {
        console.error("Error al enviar el código:", error);
      }
    };
  };

  function onSignInSubmit() {}
  //function signInWithPhoneNumber() {}
  return (
    <div>
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
      <button onClick={handlePhoneLogin}>Iniciar sesión con Telefono</button>
    </div>
  );
};

export default Login;
