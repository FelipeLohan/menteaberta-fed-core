"use client";

import { Users, Clock, Award } from "lucide-react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import AppLayout from "@/src/components/AppLayout";
import Card from "@/src/components/ui/Card";

export default function PsicologoDashboard() {
  return (
    <ProtectedRoute role="PSICOLOGO">
      <AppLayout>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">
              Bem-vindo, psicólogo!
            </h1>
            <p className="text-slate-500 mt-2">
              Obrigado por fazer parte da rede de apoio voluntário.
            </p>
          </div>

          {/* Placeholder principal */}
          <Card className="mb-6 border-l-4 border-l-[#008B8B] bg-[#F4F9F9]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#E0F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                <Users size={20} className="text-[#008B8B]" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Em breve: visualize e aceite solicitações de pacientes
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Em breve você poderá ver as solicitações de pacientes e iniciar atendimentos voluntários de forma segura.
                </p>
              </div>
            </div>
          </Card>

          {/* Cards informativos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <div className="w-10 h-10 bg-[#E0F5F5] rounded-xl flex items-center justify-center mb-4">
                <Clock size={20} className="text-[#008B8B]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Flexibilidade Total
              </h3>
              <p className="text-sm text-slate-500">
                Atenda quando quiser, no seu próprio ritmo.
              </p>
            </Card>

            <Card>
              <div className="w-10 h-10 bg-[#E0F5F5] rounded-xl flex items-center justify-center mb-4">
                <Users size={20} className="text-[#008B8B]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Impacto Social
              </h3>
              <p className="text-sm text-slate-500">
                Ajude pessoas que precisam de apoio psicológico.
              </p>
            </Card>

            <Card>
              <div className="w-10 h-10 bg-[#E0F5F5] rounded-xl flex items-center justify-center mb-4">
                <Award size={20} className="text-[#008B8B]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Certificação
              </h3>
              <p className="text-sm text-slate-500">
                Horas voluntárias computadas com certificado.
              </p>
            </Card>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
