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

# Docker (full stack)
docker compose up --build        # Build and start all services
docker compose up -d             # Start detached
docker compose logs -f frontend  # Tail a specific service

# Backend (NestJS) — from apps/backend
npm run build       # nest build → dist/
npm run start:prod  # node dist/main
```

Requirements: Node ≥ 20, npm ≥ 10.

## Architecture

**Monorepo** managed with Turborepo + npm workspaces:

```
apps/
  frontend/   Next.js 14 (App Router, standalone output)
  backend/    NestJS 10 stub — ready for feature development
packages/
  types/      Shared TypeScript domain types (@pdage/types)
  ui/         Shared React components stub (@pdage/ui)
  configs/    Shared config stub (@pdage/configs)
docker/
  nginx/      Reverse proxy (port 80/443 → frontend:3000, /api → backend:3001)
  frontend/   Multi-stage Dockerfile
  backend/    Multi-stage Dockerfile
  postgres/   init.sql base setup (Prisma migrations create tables)
```

### Frontend (Next.js 14)

- **App Router** at `apps/frontend/src/app/`. Route stubs exist for `/login`, `/candidato`, `/admin`, `/resultados`, `/recursos`, `/inscricao`.
- **Landing page** is `src/app/page.tsx` — composes `Header`, `Hero`, `About`, `ProcessFlow`, `Features`, `Security`, `Footer`.
- **Path alias:** `@/*` → `src/*`.
- **Animations:** Framer Motion with `viewport: { once: true }` scroll triggers throughout components.
- **`TechStack.tsx`** exists in components but is NOT rendered in `page.tsx` (intentionally excluded).

### Design system (Tailwind)

Defined in `apps/frontend/tailwind.config.ts`:

| Token | Value | Usage |
|---|---|---|
| `primary-700` | `#001b3d` | Navy — main brand, headings, buttons |
| `accent-400` | `#ffd21f` | Yellow — header border, CTA accents |
| `primary-400` | `#38b6ff` | Sky blue — highlights, links, secondary buttons |
| `#f4f6f8` | CSS var `--cinza-fundo` | Section backgrounds (alternating with white) |

Section backgrounds alternate: white → `#f4f6f8` → white → `#f4f6f8`.
Header is always dark navy (`#001b3d`) with a 3px yellow bottom border — no scroll-based color changes.

### Backend (NestJS)

Currently a stub (`apps/backend/src/main.ts`). Exposes `/api/health`. Dependencies are installed for the full implementation:
- **Auth:** `@nestjs/jwt`, `passport-jwt`, `bcrypt`
- **Database:** `@prisma/client` 5 (no `schema.prisma` yet — to be created)
- **Validation:** `class-validator`, `class-transformer`

Global API prefix `/api`, CORS enabled for `localhost:3000` and `pdage.obidos.pa.gov.br`.

### Shared types (`packages/types`)

`@pdage/types` defines the full domain model:
- `UserRole`: `'candidato' | 'admin' | 'secretaria'`
- `EtapaType`: 7 stages (`inscricao` → `habilitacao_documental` → `avaliacao_cognitiva` → `qualificacao_curricular` → `plano_gestao` → `resultado_final` → `certificacao`)
- Entities: `Inscricao`, `Documento`, `Avaliacao`, `Recurso`, `Certificado`, `LogAdmin`
- API helpers: `ApiResponse<T>`, `ApiError`

### Infrastructure

- **NGINX** proxies `pdage.obidos.pa.gov.br` — Let's Encrypt paths pre-configured, security headers set (HSTS, CSP, `X-Frame-Options DENY`).
- **PostgreSQL 16** credentials in docker-compose: `pdage_user` / `pdage_password` / db `pdage_db`.
- **Next.js** uses `output: 'standalone'` for Docker — the built image copies `standalone/` and `static/` only.
