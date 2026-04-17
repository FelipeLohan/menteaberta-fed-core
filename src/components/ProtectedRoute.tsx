"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import type { RoleUsuario } from "@/src/types/auth";

interface ProtectedRouteProps {
  role: RoleUsuario;
  children: ReactNode;
}

const dashboardByRole: Record<RoleUsuario, string> = {
  PACIENTE: "/paciente/dashboard",
  PSICOLOGO: "/psicologo/dashboard",
};

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, role: userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (userRole && userRole !== role) {
      router.replace(dashboardByRole[userRole]);
    }
  }, [isLoading, isAuthenticated, userRole, role, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoadingSpinner />;
  if (userRole && userRole !== role) return <LoadingSpinner />;

  return <>{children}</>;
}
