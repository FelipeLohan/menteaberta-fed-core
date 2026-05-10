"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Search } from "lucide-react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import AppLayout from "@/src/components/AppLayout";
import PedidoCard from "@/src/components/pedido/PedidoCard";
import { pedidoService } from "@/src/services/pedidoService";
import type { Pedido } from "@/src/types/pedido";

export default function PsicologoDashboard() {
  return (
    <ProtectedRoute role="PSICOLOGO">
      <PsicologoDashboardContent />
    </ProtectedRoute>
  );
}

function PsicologoDashboardContent() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const lista = await pedidoService.listarTodos();
      setPedidos(lista);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtrados = pedidos.filter((p) => {
    if (!busca.trim()) return true;
    const q = busca.toLowerCase();
    return (
      p.titulo.toLowerCase().includes(q) ||
      p.descricao.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Pedidos de pacientes
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Entre em contato diretamente com o paciente para oferecer apoio voluntário.
          </p>
        </div>

        {/* Barra de busca */}
        <div className="relative mb-6">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900
              placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#008B8B] focus:border-[#008B8B]
              transition-all duration-200 text-sm"
          />
        </div>

        {carregando ? (
          <div className="flex justify-center py-16">
            <span className="w-8 h-8 border-2 border-[#008B8B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-[#E0F5F5] rounded-2xl flex items-center justify-center mb-4">
              <Users size={28} className="text-[#008B8B]" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">
              {busca ? "Nenhum resultado" : "Sem pedidos abertos"}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              {busca
                ? "Tente outros termos de busca."
                : "No momento não há pedidos de pacientes aguardando atendimento."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400">
              {filtrados.length} pedido{filtrados.length !== 1 ? "s" : ""} aberto
              {filtrados.length !== 1 ? "s" : ""}
            </p>
            {filtrados.map((p) => (
              <PedidoCard key={p.id} pedido={p} showContato />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
