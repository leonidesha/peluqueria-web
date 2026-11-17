// src/pages/Login.tsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'login' | 'verify'>('login'); // login o verificar código
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1. Iniciar sesión con Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verificar si el usuario ya existe en Firestore
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Si no existe, crearlo
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || 'Usuario',
          email: user.email,
          phone: '',
          role: 'client',
          createdAt: new Date()
        });
      }

      // Redirigir según rol (por ahora todos van al dashboard)
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Configurar reCAPTCHA y enviar código por SMS
  const sendCode = async () => {
    setLoading(true);
    setError('');
    try {
      const appVerifier = new RecaptchaVerifier('send-code-button', {
        'size': 'invisible',
        'callback': () => {}
      }, auth);

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      (window as any).confirmationResult = confirmationResult;
      setMode('verify'); // Cambiar a pantalla de verificación
    } catch (err: any) {
      setError('Error al enviar el código. Verifica el número.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verificar el código SMS
  const verifyCode = async () => {
    setLoading(true);
    try {
      const confirmationResult = (window as any).confirmationResult;
      await confirmationResult.confirm(code);

      const user = auth.currentUser;
      if (user) {
        // Verificar si existe en Firestore
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: user.phoneNumber || 'Cliente',
            phone: user.phoneNumber,
            role: 'client',
            createdAt: new Date()
          });
        }

        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('Código inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Iniciar sesión</h2>
        {error && <p className="error">{error}</p>}

        {mode === 'login' ? (
          <div className="login-options">
            {/* Opción 1: Google */}
            <button className="btn-google" onClick={loginWithGoogle} disabled={loading}>
              🔵 Iniciar con Google
            </button>

            <div className="separator">o</div>

            {/* Opción 2: Teléfono */}
            <input
              type="tel"
              placeholder="+53 56558380"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
            <button id="send-code-button" onClick={sendCode} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </div>
        ) : (
          <div className="verify-code">
            <h3>Ingresa el código SMS</h3>
            <input
              type="text"
              placeholder="Código de 6 dígitos"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />
            <button onClick={verifyCode} disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
            <button onClick={() => setMode('login')} disabled={loading} className="btn-back">
              ← Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;