export type StatusPedido = "ABERTO" | "EM_ATENDIMENTO" | "ENCERRADO";

export interface ContatoPaciente {
  whatsapp?: string;
  email?: string;
  telefone?: string;
}

export interface Pedido {
  id: string;
  pacienteId: string;
  titulo: string;
  descricao: string;
  contato: ContatoPaciente;
  status: StatusPedido;
  criadoEm: string;
}

export interface CriarPedidoPayload {
  titulo: string;
  descricao: string;
  contato: ContatoPaciente;
}
