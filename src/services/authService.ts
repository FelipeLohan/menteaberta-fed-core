import type { AuthResponse, RoleUsuario } from "@/src/types/auth";

const BASE_URL =
  //process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:8081";
  "https://auth.menteaberta.site";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!res.ok) {
    let message = "Erro inesperado. Tente novamente.";
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // body não é JSON
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export const authService = {
  register(
    email: string,
    senha: string,
    role: RoleUsuario
  ): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, senha, role }),
    });
  },

  login(email: string, senha: string): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
  },

  refresh(refreshToken: string): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  validate(accessToken: string): Promise<{ role: string }> {
    return request<{ role: string }>("/api/auth/validate", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
