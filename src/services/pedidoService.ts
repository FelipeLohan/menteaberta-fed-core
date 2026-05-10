import type { CriarPedidoPayload, Pedido } from "@/src/types/pedido";

// ── Service contract ─────────────────────────────────────────────────────────
export interface IPedidoService {
  criar(payload: CriarPedidoPayload): Promise<Pedido>;
  listarMeus(): Promise<Pedido[]>;
  listarTodos(): Promise<Pedido[]>;
  encerrar(id: string): Promise<void>;
}

// ── HTTP implementation ───────────────────────────────────────────────────────
function createHttpPedidoService(baseUrl: string): IPedidoService {
  async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
      ...init,
    });

    if (!res.ok) {
      let message = "Erro inesperado";
      try {
        const body = await res.json();
        message = body?.message ?? message;
      } catch {
        // sem body
      }
      throw new Error(message);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  return {
    criar: (payload) =>
      req("/api/pedidos", { method: "POST", body: JSON.stringify(payload) }),
    listarMeus: () => req("/api/pedidos/meus"),
    listarTodos: () => req("/api/pedidos"),
    encerrar: (id) =>
      req(`/api/pedidos/${id}/encerrar`, { method: "PATCH" }).then(
        () => undefined
      ),
  };
}

export const pedidoService = createHttpPedidoService(
  process.env.NEXT_PUBLIC_CORE_API_URL ?? "http://localhost:8082"
);
