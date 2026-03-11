# Plan: 001 — Foundation

**Rama:** `001-foundation`
**Fuente canónica:** `docs/05-ARCHITECTURE.md` · `docs/15-MIGRATIONS-STRATEGY.md` · `docs/17-IMPLEMENTATION-PLAN.md §001`

---

## Stack técnico

| Capa | Tecnología | Versión / Notas |
|------|-----------|-----------------|
| Base de datos | Supabase (Postgres + RLS + pgvector) | Supabase CLI para migraciones |
| ORM | Drizzle ORM | Queries de negocio — portable |
| Auth | Supabase Auth | Magic link + OTP por teléfono |
| Storage | Supabase Storage | Solo para archivos/fotos (no en MVP de foundation) |
| Backend + web | Next.js + TypeScript | App Router — Vercel |
| Mobile | React Native + Expo | Expo SDK 52+ |
| Paquetes compartidos | pnpm workspaces | Monorepo |
| CI/CD | GitHub Actions | `npm audit` como gate bloqueante |
| LLM | Claude API (Anthropic) | Adaptador configurable en `lib/llm/` |

---

## Estructura de carpetas

```
/                               ← repo root
├── apps/
│   ├── web/                    ← Next.js App Router (web + API backend)
│   │   ├── app/
│   │   │   ├── (auth)/         ← login, magic link callback
│   │   │   ├── (dashboard)/    ← dashboard por perfil (vacío en foundation)
│   │   │   └── api/
│   │   │       ├── webhooks/
│   │   │       │   └── whatsapp/   ← skeleton (implementado en 003)
│   │   │       └── ai/
│   │   │           └── chat/       ← skeleton (implementado en 004+)
│   │   ├── lib/
│   │   │   ├── db/             ← Drizzle ORM (conexión + schema + queries vacías)
│   │   │   │   ├── index.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── queries/
│   │   │   ├── supabase/       ← Solo Auth y Storage
│   │   │   │   ├── client.ts   ← browser client
│   │   │   │   └── server.ts   ← server client
│   │   │   └── llm/            ← LLM Provider (adaptador configurable)
│   │   │       ├── provider.ts
│   │   │       ├── adapters/
│   │   │       │   └── claude.ts
│   │   │       └── index.ts
│   │   ├── .env.example
│   │   └── package.json
│   └── mobile/                 ← React Native + Expo
│       ├── app/                ← Expo Router
│       ├── components/
│       └── package.json
├── packages/
│   └── types/                  ← Tipos TypeScript compartidos
│       ├── src/
│       │   ├── database.ts     ← tipos del schema DB
│       │   └── index.ts
│       └── package.json
├── supabase/
│   ├── migrations/
│   │   ├── 20260305000001_initial_schema.sql      ← tablas core
│   │   ├── 20260305000002_rls_policies.sql        ← políticas RLS
│   │   ├── 20260305000003_functions_triggers.sql  ← helpers + triggers
│   │   ├── 20260305000004_indexes.sql             ← índices performance
│   │   └── 20260305000005_seed_roles.sql          ← enums + roles base
│   ├── seed/
│   │   └── dev_seed.sql                           ← datos de desarrollo
│   └── config.toml
├── .github/
│   └── workflows/
│       └── ci.yml                                 ← pipeline CI/CD
├── pnpm-workspace.yaml
├── package.json                                   ← root (devDeps comunes)
└── .env.example                                   ← variables de entorno de referencia
```

---

## Módulos / Librerías principales

| Módulo | Paquete | Ámbito |
|--------|---------|--------|
| ORM | `drizzle-orm` + `drizzle-kit` | apps/web |
| Postgres driver | `postgres` | apps/web |
| Supabase client | `@supabase/ssr` + `@supabase/supabase-js` | apps/web |
| LLM (Claude) | `@anthropic-ai/sdk` | apps/web lib/llm |
| Validación | `zod` | apps/web + packages/types |
| Expo | `expo`, `expo-router`, `expo-notifications` | apps/mobile |
| React Native | `react-native` | apps/mobile |
| TypeScript | `typescript` | raíz (shared config) |
| Linting | `eslint` + `@typescript-eslint` | raíz |
| Formatting | `prettier` | raíz |

---

## Migraciones SQL (secuencia)

1. `initial_schema.sql` — todas las tablas en orden de dependencias (primero `schools`, luego las que dependen de ella)
2. `rls_policies.sql` — `ENABLE ROW LEVEL SECURITY` + `CREATE POLICY` para cada tabla con `school_id`
3. `functions_triggers.sql` — `get_my_school_id()` + triggers de `updated_at`
4. `indexes.sql` — índices en columnas de búsqueda frecuente + pgvector en `pedagogical_notes`
5. `seed_roles.sql` — enum values y datos base necesarios para el sistema

---

## Variables de entorno requeridas

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # nunca NEXT_PUBLIC_

# Database (Drizzle)
DATABASE_URL=                    # postgres://... (connection pooler de Supabase)

# LLM
LLM_PROVIDER=claude
LLM_MODEL=claude-sonnet-4-6
LLM_API_KEY=                     # nunca NEXT_PUBLIC_

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Decisiones técnicas relevantes

| Decisión | Elección | Razón |
|----------|----------|-------|
| Migraciones | Supabase CLI (SQL nativo) | Control total sobre RLS y triggers |
| ORM negocio | Drizzle ORM | Portable — no acoplado a Supabase client |
| Auth | Supabase Auth | Magic link + OTP nativo |
| Monorepo | pnpm workspaces | Types compartidos entre Next.js y Expo |
| LLM | Adaptador configurable | `LLM_PROVIDER` env — no lock-in a Claude |
| Multi-tenancy | Shared DB + RLS | Enforced a nivel DB, no solo aplicación |

---

## Orden de implementación sugerido

1. **Scaffolding** (US3 primero): monorepo, dependencias, tsconfig, eslint, prettier
2. **Schema** (US1): migraciones en orden, verificar con `supabase db reset`
3. **Auth** (US2): Supabase Auth configurado, JWT con claims, flujo de login
4. **CI/CD** (US4): GitHub Actions con npm audit gate
5. **Seed** (US5): dev_seed.sql + script pnpm seed

---

## Test mínimo de validación (no automatizado en foundation)

```bash
supabase db reset
# → sin errores
pnpm seed
# → "Escuela Demo creada. 2 alumnos, 4 usuarios de prueba."
pnpm dev
# → Next.js en localhost:3000, Expo con QR
curl localhost:3000/api/health
# → { status: "ok", db: "connected" }
```
