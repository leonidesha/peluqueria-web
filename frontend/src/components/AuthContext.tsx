import { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  isAuth: boolean;
  user: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(() => {
    // Recupera el estado inicial del localStorage
    return localStorage.getItem("isAuth") === "true";
  });
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem("user") || null;
  });

  const login = (username: string, token: string) => {
    setIsAuth(true);
    setUser(username);
    // Guarda en localStorage
    localStorage.setItem("isAuth", "true");
    localStorage.setItem("user", username);
    localStorage.setItem("token", token);
    // Opcional: Establece tiempo de expiración (ej. 1 hora)
    localStorage.setItem("expiresAt", String(Date.now() + 1500000)); // 25 minutos
  };

  const logout = () => {
    setIsAuth(false);
    setUser(null);
    // Limpia el localStorage
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
  };

  useEffect(() => {
    const expiresAt = localStorage.getItem("expiresAt");
    if (expiresAt && Date.now() > Number(expiresAt)) {
      logout();
    }
  }, []);

  // Usamos useMemo para optimizar rendimiento
  const value = useMemo(
    () => ({ isAuth, user, login, logout }),
    [isAuth, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
