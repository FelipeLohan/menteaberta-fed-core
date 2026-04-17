export type RoleUsuario = "PACIENTE" | "PSICOLOGO";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  role: RoleUsuario;
  expiresIn: number;
}

export interface ErrorResponse {
  message: string;
  status?: number;
}
