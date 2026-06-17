# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root via Turborepo unless noted.

```bash
# Development
npm run dev              # Start frontend + backend in watch mode
npm run build            # Build all apps and packages
npm run lint             # Lint all workspaces
npm run type-check       # TypeScript check across all workspaces

# Target a specific app
npm run dev --workspace=apps/frontend
npm run dev --workspace=apps/backend

# Prisma (from apps/backend)
npx prisma migrate dev   # Apply migrations + regenerate client
npx prisma migrate deploy  # Apply migrations in production
npx prisma studio        # Visual DB browser

# Docker (full stack)
docker compose up --build        # Build and start all services
docker compose up -d             # Start detached
docker compose logs -f frontend  # Tail a specific service
```

Requirements: Node ≥ 20, npm ≥ 10.

## Architecture

**Monorepo** managed with Turborepo + npm workspaces. PDAGE is a school manager selection process platform for the municipality of Óbidos, PA.

```
apps/
  frontend/   Next.js 14 (App Router, standalone output)
  backend/    NestJS 10 with Prisma, JWT auth
packages/
  types/      Shared TypeScript domain types (@pdage/types)
  ui/         Shared React components stub (@pdage/ui)
  configs/    Shared config stub (@pdage/configs)
docker/
  nginx/      Reverse proxy (port 80/443 → frontend:3000, /api → backend:3001)
  frontend/   Multi-stage Dockerfile
  backend/    Multi-stage Dockerfile
  postgres/   init.sql — Prisma migrations create tables on top of this
```

## Database Schema (Prisma)

Schema at `apps/backend/prisma/schema.prisma`. Three models:

- **Candidato** — personal + professional data, CPF as unique key, one registration per person
- **Inscricao** — application record linked to Candidato with auto-generated protocol number (`INS-YYYYMMDD-XXXXX`)
- **EtapaStatus** — one record per stage per Inscricao; 6 stages created automatically on registration

**EtapaTipo enum** (6 stages in order):
`HABILITACAO_DOCUMENTAL → AVALIACAO_COGNITIVA → QUALIFICACAO_CURRICULAR → PLANO_GESTAO → RESULTADO_FINAL → CERTIFICACAO`

**EtapaStatusTipo enum:** `PENDENTE | EM_ANALISE | APROVADO | REPROVADO`

## Backend (NestJS)

Global API prefix `/api`. Modules:

### Auth (`/api/auth`)
- `POST /login` — Candidate: validates CPF + `dataNascimento` (YYYY-MM-DD) against DB; returns JWT with `{ sub, cpf, nome, role: 'candidato' }`
- `POST /admin-login` — Admin: validates against env vars `ADMIN_LOGIN` / `ADMIN_SENHA`; returns JWT with `{ sub: 'admin', role: 'admin' }`
- JWT expires in 8 h, signed with `JWT_SECRET` env var
- `JwtAuthGuard` (candidate routes) and `AdminGuard` (admin routes) are separate guards

### Candidato (`/api/candidato`) — requires `JwtAuthGuard`
- `GET /me` — Returns candidate profile, linked Inscricao, and all EtapaStatus records

### Inscricao (`/api/inscricao`) — public
- `POST /` — Creates Candidato + Inscricao + 6 EtapaStatus rows atomically; rejects duplicate CPF with HTTP 409

### Admin (`/api/admin`) — requires `AdminGuard`
- `GET /candidatos` — All candidates with full application + stage data
- `PATCH /etapa/:id` — Update a single EtapaStatus (status, pontuacao, observacoes)

Also exposes `GET /api/health`.

## Frontend (Next.js 14)

App Router at `apps/frontend/src/app/`. Path alias `@/*` → `src/*`.

### Routes
| Route | Auth | Description |
|---|---|---|
| `/` | Public | Landing page (Header, Hero, About, ProcessFlow, Features, Security, Footer) |
| `/inscricao` | Public | 4-step registration form → calls `POST /api/inscricao` |
| `/login` | Public | Candidate login (CPF + birth date) → stores `meritus_token` in localStorage |
| `/admin/login` | Public | Admin login → stores `meritus_admin_token` in localStorage |
| `/candidato` | `meritus_token` | Dashboard: application status + stage progress + scores |
| `/admin` | `meritus_admin_token` | Management panel: candidate list, search, inline stage editor |

Auth check in protected pages: reads token from `localStorage`, calls `/api/candidato/me` or `/api/admin/candidatos` on mount, redirects to login on 401.

### API Client
`apps/frontend/src/lib/api.ts` — thin fetch wrapper that prepends `/api` and attaches the correct Authorization header based on token type.

### Registration Form (`/inscricao`)
4 steps: personal data → functional data → document uploads → confirmation. Conditional fields:
- Male candidates: additional document field
- Non-Pedagogia degree: `outrosDiplomas` field required
- Specialization ≠ "Não": post-grad certificate required

### Admin Panel (`/admin`)
Search by name, CPF, or school. Stats counters at top. Per-candidate stage editor opens in a modal; stage-specific fields differ (document checklist for HABILITACAO, score input for RESULTADO_FINAL, etc.).

## Design System (Tailwind)

Defined in `apps/frontend/tailwind.config.ts`:

| Token | Value | Usage |
|---|---|---|
| `primary-700` | `#001b3d` | Navy — brand, headings, buttons |
| `accent-400` | `#ffd21f` | Yellow — header bottom border, CTA accents |
| `primary-400` | `#38b6ff` | Sky blue — highlights, secondary buttons |
| `#f4f6f8` | `--cinza-fundo` | Alternating section background |

Section backgrounds alternate: white → `#f4f6f8` → white → `#f4f6f8`. Header is always navy with a 3 px yellow bottom border — no scroll-based color changes. Animations use Framer Motion with `viewport: { once: true }`.

## Environment Variables

Backend requires (via `.env` or Docker env):
```
DATABASE_URL=postgresql://pdage_user:pdage_password@postgres:5432/pdage_db
JWT_SECRET=<secret>
ADMIN_LOGIN=<username>
ADMIN_SENHA=<password>
```

## Infrastructure

- **NGINX** proxies `pdage.obidos.pa.gov.br`; routes `/api/*` to backend:3001, everything else to frontend:3000. Let's Encrypt paths pre-configured. Security headers: HSTS, CSP, `X-Frame-Options DENY`.
- **PostgreSQL 16** — credentials above; `docker/postgres/init.sql` creates the DB/user; Prisma migrations create all tables.
- **Next.js** `output: 'standalone'` — Docker image copies only `standalone/` and `static/`.
- `packages/types` (`@pdage/types`) defines shared domain types; the backend implements its own Prisma-based types independently.
