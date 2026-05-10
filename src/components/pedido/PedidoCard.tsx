"use client";

import { useState } from "react";
import { Clock, Phone, Mail, MessageCircle, X } from "lucide-react";
import type { Pedido, StatusPedido } from "@/src/types/pedido";
import Card from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";

const statusLabel: Record<StatusPedido, string> = {
  ABERTO: "Aberto",
  EM_ATENDIMENTO: "Em atendimento",
  ENCERRADO: "Encerrado",
};

const statusStyle: Record<StatusPedido, string> = {
  ABERTO: "bg-green-50 text-green-700 border border-green-200",
  EM_ATENDIMENTO: "bg-blue-50 text-blue-700 border border-blue-200",
  ENCERRADO: "bg-slate-100 text-slate-500 border border-slate-200",
};

function formatarData(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d} dia${d > 1 ? "s" : ""}`;
}

interface PedidoCardProps {
  pedido: Pedido;
  showContato?: boolean;
  onEncerrar?: (id: string) => Promise<void>;
}

export default function PedidoCard({
  pedido,
  showContato = false,
  onEncerrar,
}: PedidoCardProps) {
  const [encerrando, setEncerrando] = useState(false);

  async function handleEncerrar() {
    if (!onEncerrar) return;
    setEncerrando(true);
    try {
      await onEncerrar(pedido.id);
    } finally {
      setEncerrando(false);
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-base leading-snug">
            {pedido.titulo}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <Clock size={12} />
            {formatarData(pedido.criadoEm)}
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusStyle[pedido.status]}`}
        >
          {statusLabel[pedido.status]}
        </span>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">{pedido.descricao}</p>

      {showContato && (
        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Contato do paciente
          </p>
          <div className="flex flex-wrap gap-2">
            {pedido.contato.whatsapp && (
              <a
                href={`https://wa.me/55${pedido.contato.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
              >
                <MessageCircle size={14} />
                {pedido.contato.whatsapp}
              </a>
            )}
            {pedido.contato.email && (
              <a
                href={`mailto:${pedido.contato.email}`}
                className="inline-flex items-center gap-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Mail size={14} />
                {pedido.contato.email}
              </a>
            )}
            {pedido.contato.telefone && (
              <a
                href={`tel:${pedido.contato.telefone}`}
                className="inline-flex items-center gap-1.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Phone size={14} />
                {pedido.contato.telefone}
              </a>
            )}
            {!pedido.contato.whatsapp &&
              !pedido.contato.email &&
              !pedido.contato.telefone && (
                <span className="text-sm text-slate-400 italic">
                  Nenhum contato informado
                </span>
              )}
          </div>
        </div>
      )}

      {onEncerrar && pedido.status === "ABERTO" && (
        <div className="flex justify-end border-t border-slate-100 pt-3">
          <Button
            variant="ghost"
            size="sm"
            loading={encerrando}
            onClick={handleEncerrar}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
          >
            <X size={14} />
            Encerrar pedido
          </Button>
        </div>
      )}
    </Card>
  );
}
