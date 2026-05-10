"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Inbox } from "lucide-react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import AppLayout from "@/src/components/AppLayout";
import PedidoCard from "@/src/components/pedido/PedidoCard";
import NovoPedidoModal from "@/src/components/pedido/NovoPedidoModal";
import Button from "@/src/components/ui/Button";
import { pedidoService } from "@/src/services/pedidoService";
import type { CriarPedidoPayload, Pedido } from "@/src/types/pedido";

export default function PacienteDashboard() {
  return (
    <ProtectedRoute role="PACIENTE">
      <PacienteDashboardContent />
    </ProtectedRoute>
  );
}

function PacienteDashboardContent() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const lista = await pedidoService.listarMeus();
      setPedidos(lista);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleCriar(payload: CriarPedidoPayload) {
    await pedidoService.criar(payload);
    await carregar();
  }

  async function handleEncerrar(id: string) {
    await pedidoService.encerrar(id);
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "ENCERRADO" } : p))
    );
  }

  const abertos = pedidos.filter((p) => p.status === "ABERTO");
  const encerrados = pedidos.filter((p) => p.status === "ENCERRADO");

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Meus pedidos
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Somente psicólogos voluntários visualizam seus pedidos.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalAberto(true)}
            className="gap-2 shrink-0"
          >
            <Plus size={16} />
            Pedir ajuda
          </Button>
        </div>

        {carregando ? (
          <div className="flex justify-center py-16">
            <span className="w-8 h-8 border-2 border-[#008B8B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-[#E0F5F5] rounded-2xl flex items-center justify-center mb-4">
              <Inbox size={28} className="text-[#008B8B]" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">
              Nenhum pedido ainda
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Clique em &quot;Pedir ajuda&quot; para enviar sua situação a um psicólogo voluntário.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {abertos.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Em aberto ({abertos.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {abertos.map((p) => (
                    <PedidoCard
                      key={p.id}
                      pedido={p}
                      onEncerrar={handleEncerrar}
                    />
                  ))}
                </div>
              </section>
            )}

            {encerrados.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Encerrados ({encerrados.length})
                </h2>
                <div className="flex flex-col gap-3 opacity-60">
                  {encerrados.map((p) => (
                    <PedidoCard key={p.id} pedido={p} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {modalAberto && (
        <NovoPedidoModal
          onClose={() => setModalAberto(false)}
          onSubmit={handleCriar}
        />
      )}
    </AppLayout>
  );
}
