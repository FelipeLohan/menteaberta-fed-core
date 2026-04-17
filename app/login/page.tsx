"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Card from "@/src/components/ui/Card";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !senha) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      await login(email, senha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F9F9] flex items-center justify-center px-4">
      {/* Blobs decorativos */}
      <div
        aria-hidden
        className="fixed top-0 left-1/4 w-96 h-96 bg-[#CCF0F0] rounded-full blur-3xl opacity-40 pointer-events-none"
      />
      <div
        aria-hidden
        className="fixed bottom-0 right-1/4 w-80 h-80 bg-[#E0F5F5] rounded-full blur-3xl opacity-40 pointer-events-none"
      />

      <Card className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#008B8B] rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              Bem-vindo de volta
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Entre na sua conta Mente Aberta
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={loading}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-2"
          >
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Não tem conta?{" "}
          <Link
            href="/cadastro"
            className="text-[#008B8B] font-medium hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </Card>
    </div>
  );
}
