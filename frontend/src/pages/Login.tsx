// src/components/PhoneAuth.tsx
/*import { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

const Login = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const recaptchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        recaptchaRef.current!,
        {
          size: "invisible",
          callback: (response: any) => {
            console.log("reCAPTCHA resuelto");
          },
        }
      );
    }
  }, []);

  const sendVerification = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      alert("Código enviado por SMS");
    } catch (error) {
      console.error("Error al enviar SMS:", error);
    }
  };

  const verifyCode = async () => {
    try {
      const result = await window.confirmationResult.confirm(code);
      const user = result.user;
      alert(`Autenticado como: ${user.phoneNumber}`);
    } catch (error) {
      console.error("Código incorrecto:", error);
    }
  };

  return (
    <div>
      <h2>Login por teléfono 📱</h2>
      <div ref={recaptchaRef}></div>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+53XXXXXXXXX"
      />
      <button onClick={sendVerification}>Enviar código</button>

      <br />

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Código de verificación"
      />
      <button onClick={verifyCode}>Verificar</button>
    </div>
  );
};

export default Login;

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";

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

  return <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>;
};

export default Login;
*/
import React, { useState } from 'react';
import { auth } from '../firebase';
import './Login.css';
import { GoogleAuthProvider, signInWithPopup, RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    confirmationResult?: any;
    recaptchaVerifier?: any;
  }
}

const Login = () => {
  // Estado global del componente
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'login' | 'verify'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  auth.useDeviceLanguage();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario:", result.user);
      // Aquí redirigirías al dashboard
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePhoneLogin = async () => {
    // Configurar reCAPTCHA
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'sign-in-button',
      {
        size: 'invisible',
        callback: (response: any) => {
          console.log("reCAPTCHA resuelto:", response);
          onSignInSubmit();
        },
        'expired-callback': () => {
          console.warn("Captcha expirado");
        },
      }
    );

    const phoneNumber = "+5358943924"; // Reemplaza con el número de teléfono del usuario
    const sendCode = async () => {
      setLoading(true);
      try {
        const verifier = new RecaptchaVerifier(
          auth,
          'send-code-button',
          {
            size: 'invisible',
            callback: (response: any) => {
              console.log("reCAPTCHA resuelto:", response);
            },
          }
        );
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        window.confirmationResult = confirmationResult;
        setMode('verify');
      } catch (error) {
        setError('No se pudo enviar el código. Verifica el número.');
      } finally {
        setLoading(false);
      }
    };
  };

  function onSignInSubmit() {}

  return (
    <div>
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
      <button onClick={handlePhoneLogin}>Iniciar sesión con Teléfono</button>
    </div>
  );
};

export default Login;