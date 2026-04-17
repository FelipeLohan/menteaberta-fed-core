"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/authService";
import type { RoleUsuario } from "@/src/types/auth";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: RoleUsuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, senha: string) => Promise<void>;
  register: (
    email: string,
    senha: string,
    role: RoleUsuario
  ) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restaurar sessão ao montar
  useEffect(() => {
    const savedAccess = localStorage.getItem("accessToken");
    const savedRefresh = localStorage.getItem("refreshToken");

    if (!savedAccess) {
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }

    authService
      .validate(savedAccess)
      .then((data) => {
        setState({
          accessToken: savedAccess,
          refreshToken: savedRefresh,
          role: data.role as RoleUsuario,
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setState({
          accessToken: null,
          refreshToken: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        });
      });
  }, []);

  const login = useCallback(
    async (email: string, senha: string) => {
      const data = await authService.login(email, senha);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setState({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role: data.role,
        isAuthenticated: true,
        isLoading: false,
      });
      router.push(
        data.role === "PACIENTE" ? "/paciente/dashboard" : "/psicologo/dashboard"
      );
    },
    [router]
  );

  const register = useCallback(
    async (email: string, senha: string, role: RoleUsuario) => {
      await authService.register(email, senha, role);
      await login(email, senha);
    },
    [login]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setState({
      accessToken: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/login");
  }, [router]);

  const refreshTokens = useCallback(async () => {
    const saved = localStorage.getItem("refreshToken");
    if (!saved) {
      logout();
      return;
    }
    try {
      const data = await authService.refresh(saved);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setState((s) => ({
        ...s,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role: data.role,
      }));
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshTokens }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
