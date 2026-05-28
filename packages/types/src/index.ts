/**
 * @pdage/types — Shared TypeScript Types
 *
 * This package contains shared type definitions used across
 * the entire PDAGE monorepo (frontend and backend).
 */

// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'candidato' | 'admin' | 'secretaria';

export interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  role: UserRole;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Processo Avaliativo ──────────────────────────────────────────────────────

export type EtapaStatus =
  | 'pendente'
  | 'em_andamento'
  | 'concluido'
  | 'reprovado'
  | 'habilitado';

export type EtapaType =
  | 'inscricao'
  | 'habilitacao_documental'
  | 'avaliacao_cognitiva'
  | 'qualificacao_curricular'
  | 'plano_gestao'
  | 'resultado_final'
  | 'certificacao';

export interface Inscricao {
  id: number;
  candidatoId: number;
  numeroInscricao: string;
  etapaAtual: EtapaType;
  status: EtapaStatus;
  pontuacaoTotal: number | null;
  posicaoRanking: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Documento {
  id: number;
  inscricaoId: number;
  tipo: string;
  nomeArquivo: string;
  urlArquivo: string;
  validado: boolean;
  observacoes: string | null;
  createdAt: Date;
}

export interface Avaliacao {
  id: number;
  inscricaoId: number;
  etapa: EtapaType;
  pontuacao: number;
  observacoes: string | null;
  avaliadorId: number | null;
  createdAt: Date;
}

export interface Recurso {
  id: number;
  inscricaoId: number;
  etapa: EtapaType;
  justificativa: string;
  status: 'pendente' | 'deferido' | 'indeferido';
  resposta: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificado {
  id: number;
  inscricaoId: number;
  numeroCertificado: string;
  qrCodeToken: string;
  emitidoEm: Date;
  urlPdf: string;
}

// ─── Logs & Audit ─────────────────────────────────────────────────────────────

export interface LogAdmin {
  id: number;
  acao: string;
  usuarioId: number | null;
  detalhes: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: Date;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}
