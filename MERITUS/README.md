# PDAGE — Plataforma Digital de Acesso à Gestão Escolar

Sistema digital de seleção de gestores escolares para o município de **Óbidos, Pará**, desenvolvido pela Prefeitura Municipal de Óbidos (PMO) em parceria com a Secretaria Municipal de Educação (SEMED).

---

## Visão Geral

O PDAGE gerencia todo o fluxo do processo seletivo para cargos de gestão escolar (Diretores e Coordenadores Pedagógicos), desde a inscrição online até a certificação dos aprovados.

### Etapas do Processo Seletivo

| # | Etapa | Descrição |
|---|-------|-----------|
| 1 | Cadastro e Inscrição | Formulário online com dados pessoais, funcionais e envio de documentos |
| 2 | Habilitação Documental | Análise e validação dos documentos enviados pelo candidato |
| 3 | Avaliação Cognitiva | Prova de conhecimentos gerais e específicos |
| 4 | Qualificação Curricular | Avaliação do currículo e tempo de serviço |
| 5 | Plano de Gestão | Apresentação e defesa do plano de gestão escolar |
| 6 | Resultado Final | Divulgação do resultado geral |
| 7 | Certificação | Certificação dos candidatos aprovados |

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | NestJS 10 |
| Banco de Dados | PostgreSQL 16 |
| ORM | Prisma |
| Autenticação | JWT (8h) |
| Proxy Reverso | NGINX |
| Containerização | Docker + Docker Compose |
| Monorepo | Turborepo + npm workspaces |

---

## Estrutura do Projeto

```
PDAGE/
├── apps/
│   ├── frontend/          # Next.js 14 — interface web
│   └── backend/           # NestJS 10 — API REST + Prisma
├── packages/
│   ├── types/             # Tipos TypeScript compartilhados (@pdage/types)
│   ├── ui/                # Componentes React compartilhados (@pdage/ui)
│   └── configs/           # Configurações compartilhadas (@pdage/configs)
├── docker/
│   ├── nginx/             # Proxy reverso (porta 80/443)
│   ├── frontend/          # Dockerfile multi-stage
│   ├── backend/           # Dockerfile multi-stage
│   └── postgres/          # init.sql
├── docker-compose.yml
└── turbo.json
```

---

## Rotas da Aplicação

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/` | Público | Landing page institucional |
| `/inscricao` | Público | Formulário de inscrição (4 etapas) |
| `/login` | Público | Login do candidato (CPF + data de nascimento) |
| `/candidato` | Candidato autenticado | Dashboard com acompanhamento do processo |
| `/admin/login` | Público | Login do administrador |
| `/admin` | Administrador | Painel de gestão dos candidatos |

---

## API REST

Base URL: `/api`

### Autenticação (`/api/auth`)
- `POST /login` — Login do candidato (CPF + data de nascimento)
- `POST /admin-login` — Login do administrador

### Candidato (`/api/candidato`) — requer token JWT
- `GET /me` — Perfil do candidato com inscrição e etapas
- `POST /etapa/:id/recurso` — Submissão de recurso (Anexo V)

### Inscrição (`/api/inscricao`) — público
- `POST /` — Cria candidato + inscrição + 6 etapas automaticamente

### Admin (`/api/admin`) — requer token de admin
- `GET /candidatos` — Lista todos os candidatos com dados completos
- `PATCH /etapa/:id` — Atualiza status, pontuação, observação e validação documental
- `DELETE /candidato/:id` — Remove candidato e todos os dados associados

---

## Configuração e Execução

### Pré-requisitos

- Node.js ≥ 20
- npm ≥ 10
- Docker e Docker Compose

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz de `apps/backend/`:

```env
DATABASE_URL=postgresql://pdage_user:pdage_password@postgres:5432/pdage_db
JWT_SECRET=seu_jwt_secret_aqui
ADMIN_LOGIN=admin
ADMIN_SENHA=sua_senha_aqui
```

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar frontend + backend em modo watch
npm run dev

# Ou usar o script de inicialização (Windows)
.\start.ps1
```

### Com Docker (ambiente completo)

```bash
# Build e inicializar todos os serviços
docker compose up --build

# Iniciar em modo detached
docker compose up -d

# Ver logs de um serviço específico
docker compose logs -f frontend
docker compose logs -f backend
```

### Prisma

```bash
# A partir de apps/backend/
npx prisma migrate dev      # Aplicar migrações + regenerar client
npx prisma migrate deploy   # Aplicar migrações em produção
npx prisma studio           # Visualizador de banco de dados
```

---

## Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `primary-700` | `#001b3d` | Azul marinho — marca, cabeçalhos, botões |
| `accent-400` | `#ffd21f` | Amarelo — borda do header, destaques CTA |
| `primary-400` | `#38b6ff` | Azul celeste — destaques, botões secundários |

---

## Funcionalidades Principais

- **Inscrição online** com formulário de 4 etapas, upload de documentos e protocolo gerado automaticamente
- **Painel do candidato** com acompanhamento em tempo real de cada etapa do processo seletivo
- **Validação documental** pelo administrador com checklists por documento (✓/✗) salvos automaticamente
- **Sistema de recursos** — candidato reprovado pode submeter recurso formal no formato Anexo V
- **Painel administrativo** com busca, filtros e editor inline por etapa
- **Autenticação segura** com JWT separado para candidatos e administradores

---

## Licença

Projeto desenvolvido para uso institucional pela Prefeitura Municipal de Óbidos — SEMED/PMO.
