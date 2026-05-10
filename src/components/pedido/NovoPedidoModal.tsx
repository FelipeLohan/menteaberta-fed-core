"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { CriarPedidoPayload } from "@/src/types/pedido";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

interface NovoPedidoModalProps {
  onClose: () => void;
  onSubmit: (payload: CriarPedidoPayload) => Promise<void>;
}

export default function NovoPedidoModal({ onClose, onSubmit }: NovoPedidoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!titulo.trim()) {
      setError("Informe um título para o seu pedido.");
      return;
    }
    if (descricao.trim().length < 20) {
      setError("Descreva sua situação com pelo menos 20 caracteres.");
      return;
    }
    if (!whatsapp && !email && !telefone) {
      setError("Informe ao menos uma forma de contato.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        contato: {
          whatsapp: whatsapp.trim() || undefined,
          email: email.trim() || undefined,
          telefone: telefone.trim() || undefined,
        },
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar pedido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="font-semibold text-slate-900">Pedir ajuda</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Somente psicólogos voluntários verão seu pedido
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          <Input
            label="Título"
            placeholder="Ex: Ansiedade no trabalho, luto, relacionamento..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={loading}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">
              Descreva sua situação
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900
                placeholder:text-slate-400 outline-none resize-none min-h-32
                focus:ring-2 focus:ring-[#008B8B] focus:border-[#008B8B]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200"
              placeholder="Conte um pouco sobre o que está sentindo. Quanto mais detalhes, mais fácil para um psicólogo entender como ajudar."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={loading}
              rows={4}
            />
            <p className="text-xs text-slate-400 text-right">
              {descricao.length} caracteres
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-slate-700">
              Formas de contato{" "}
              <span className="text-slate-400 font-normal">(ao menos uma)</span>
            </p>
            <Input
              label="WhatsApp"
              placeholder="Ex: 11999990000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              disabled={loading}
              type="tel"
            />
            <Input
              label="E-mail"
              placeholder="Ex: seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              type="email"
            />
            <Input
              label="Telefone"
              placeholder="Ex: 11988880000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              disabled={loading}
              type="tel"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="flex-1"
            >
              Enviar pedido
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
