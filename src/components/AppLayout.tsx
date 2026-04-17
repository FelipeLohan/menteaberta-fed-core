"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Brain, LogOut } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import Button from "@/src/components/ui/Button";
import Container from "@/src/components/ui/Container";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { logout, accessToken } = useAuth();

  // Extrair email do payload JWT (sem biblioteca externa)
  let email = "";
  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      email = payload.sub ?? payload.email ?? "";
    } catch {
      // ignora erro de decode
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F9F9]">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <Container className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#008B8B] rounded-lg flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-lg">
              Mente Aberta
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {email && (
              <span className="text-sm text-slate-500 hidden sm:block">
                {email}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-1.5"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        <Container className="py-8">{children}</Container>
      </main>
    </div>
  );
}
