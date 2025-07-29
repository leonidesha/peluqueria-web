// src/components/Login.tsx
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
