-- PDAGE — PostgreSQL Initialization Script
-- Plataforma Digital de Avaliação para Gestores Escolares
-- Secretaria Municipal de Educação — Óbidos/PA
--
-- Este script é executado automaticamente na primeira inicialização
-- do container PostgreSQL via docker-entrypoint-initdb.d
--
-- ─────────────────────────────────────────────────────────────────────────────
-- ESTRUTURA DO BANCO DE DADOS (implementada via Prisma Migrations)
-- ─────────────────────────────────────────────────────────────────────────────
--
-- Tabelas previstas:
--
-- candidatos       — Dados pessoais e profissionais dos candidatos
-- inscricoes       — Inscrições no processo seletivo com status e etapa atual
-- documentos       — Documentos enviados por candidato por etapa
-- avaliacoes       — Pontuações por etapa avaliativa
-- pontuacoes       — Pontuação consolidada e ranking final
-- recursos         — Recursos/contestações interpostos pelos candidatos
-- homologacoes     — Homologação de resultados pela secretaria
-- certificados     — Certificados digitais emitidos com QR Code
-- logs_admin       — Log de auditoria de todas as ações administrativas
--
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure we're connected to the correct database
\connect pdage_db;

-- ─── Audit Log Table (created as example) ────────────────────────────────────
-- This table stores immutable administrative audit logs.
-- All actions performed in the system are recorded here.

CREATE TABLE IF NOT EXISTS logs_admin (
    id          SERIAL PRIMARY KEY,
    acao        VARCHAR(255) NOT NULL,
    usuario_id  INTEGER,
    detalhes    JSONB,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Index for querying logs by user
CREATE INDEX IF NOT EXISTS idx_logs_admin_usuario_id ON logs_admin(usuario_id);

-- Index for querying logs by date range
CREATE INDEX IF NOT EXISTS idx_logs_admin_created_at ON logs_admin(created_at);

-- Index for searching logs by action type
CREATE INDEX IF NOT EXISTS idx_logs_admin_acao ON logs_admin(acao);

-- ─── Initial seed data ───────────────────────────────────────────────────────

-- Log the database initialization
INSERT INTO logs_admin (acao, usuario_id, detalhes, ip_address)
VALUES (
    'BANCO_INICIALIZADO',
    NULL,
    '{"descricao": "Banco de dados PDAGE inicializado com sucesso", "versao": "1.0.0", "municipio": "Obidos/PA"}'::jsonb,
    '127.0.0.1'
);

-- ─── Informational comments ──────────────────────────────────────────────────
-- The remaining tables will be created and managed by Prisma ORM migrations.
-- Run: npx prisma migrate deploy
--
-- Schema file: apps/backend/prisma/schema.prisma
-- ─────────────────────────────────────────────────────────────────────────────
