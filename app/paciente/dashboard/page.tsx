"use client";

import { Heart, Shield, MessageCircle } from "lucide-react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import AppLayout from "@/src/components/AppLayout";
import Card from "@/src/components/ui/Card";

export default function PacienteDashboard() {
  return (
    <ProtectedRoute role="PACIENTE">
      <AppLayout>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">
              Olá! Como você está?
            </h1>
            <p className="text-slate-500 mt-2">
              Estamos aqui para apoiar você em cada passo.
            </p>
          </div>

          {/* Placeholder principal */}
          <Card className="mb-6 border-l-4 border-l-[#008B8B] bg-[#F4F9F9]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#E0F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-[#008B8B]" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Em breve: conecte-se com um psicólogo voluntário
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Estamos preparando a funcionalidade de conexão com psicólogos. Em breve você poderá iniciar uma conversa segura e anônima.
                </p>
              </div>
            </div>
          </Card>

          {/* Cards informativos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <div className="w-10 h-10 bg-[#E0F5F5] rounded-xl flex items-center justify-center mb-4">
                <Heart size={20} className="text-[#008B8B]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Apoio Gratuito
              </h3>
              <p className="text-sm text-slate-500">
                Todos os atendimentos são realizados por psicólogos voluntários, sem nenhum custo para você.
              </p>
            </Card>

            <Card>
              <div className="w-10 h-10 bg-[#E0F5F5] rounded-xl flex items-center justify-center mb-4">
                <Shield size={20} className="text-[#008B8B]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Privacidade Total
              </h3>
              <p className="text-sm text-slate-500">
                Suas conversas são criptografadas e anônimas. Nenhum dado pessoal é compartilhado.
              </p>
            </Card>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
