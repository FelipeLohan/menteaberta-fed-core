"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Card from "@/src/components/ui/Card";
import type { RoleUsuario } from "@/src/types/auth";

type Step = "escolha" | "formulario";

export default function CadastroPage() {
  const { register } = useAuth();
  const [step, setStep] = useState<Step>("escolha");
  const [role, setRole] = useState<RoleUsuario | null>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function escolher(r: RoleUsuario) {
    setRole(r);
    setStep("formulario");
  }

  function validarSenha(): string | null {
    if (senha.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
    if (senha !== confirmar) return "As senhas não coincidem.";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !senha || !confirmar) {
      setError("Preencha todos os campos.");
      return;
    }
    const senhaError = validarSenha();
    if (senhaError) {
      setError(senhaError);
      return;
    }
    if (!role) return;

    setLoading(true);
    try {
      await register(email, senha, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const forca = (() => {
    if (!senha) return 0;
    let score = 0;
    if (senha.length >= 8) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[0-9]/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++;
    return score;
  })();

  const forcaLabel = ["", "Fraca", "Razoável", "Boa", "Forte"][forca];
  const forcaCor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][forca];

  return (
    <div className="min-h-screen bg-[#F4F9F9] flex items-center justify-center px-4">
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
              {step === "escolha" ? "Criar conta" : "Seus dados"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {step === "escolha"
                ? "Como você vai usar o Mente Aberta?"
                : `Perfil: ${role === "PACIENTE" ? "Paciente" : "Psicólogo"}`}
            </p>
          </div>
        </div>

        {step === "escolha" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => escolher("PACIENTE")}
              className="group flex items-start gap-4 p-5 rounded-xl border-2 border-slate-200 hover:border-[#008B8B] hover:bg-[#E0F5F5] transition-all duration-200 text-left"
            >
              <span className="text-3xl">🧠</span>
              <div>
                <p className="font-semibold text-slate-900">Sou Paciente</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Busco apoio psicológico voluntário
                </p>
              </div>
            </button>

            <button
              onClick={() => escolher("PSICOLOGO")}
              className="group flex items-start gap-4 p-5 rounded-xl border-2 border-slate-200 hover:border-[#008B8B] hover:bg-[#E0F5F5] transition-all duration-200 text-left"
            >
              <span className="text-3xl">💼</span>
              <div>
                <p className="font-semibold text-slate-900">Sou Psicólogo</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Quero oferecer suporte voluntário
                </p>
              </div>
            </button>
          </div>
        )}

        {step === "formulario" && (
          <>
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

              <div className="flex flex-col gap-1">
                <Input
                  label="Senha"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />
                {senha && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${forcaCor}`}
                        style={{ width: `${(forca / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{forcaLabel}</span>
                  </div>
                )}
              </div>

              <Input
                label="Confirmar senha"
                type="password"
                placeholder="••••••••"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
                error={
                  confirmar && confirmar !== senha
                    ? "Senhas não coincidem"
                    : undefined
                }
              />

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-2 mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  className="w-full"
                >
                  Cadastrar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("escolha")}
                  disabled={loading}
                  className="w-full"
                >
                  Voltar
                </Button>
              </div>
            </form>
          </>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-[#008B8B] font-medium hover:underline"
          >
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
