# Vujy

Plataforma educativa integral con asistente conversacional IA para instituciones privadas argentinas (nivel inicial, primaria y secundaria).

El diferencial central es un **copiloto institucional** accesible desde lenguaje natural — vía WhatsApp, app nativa o web — que conecta datos, ejecuta acciones y genera insights para todos los actores: administradores, docentes, padres y alumnos.

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/01-SPEC.md](docs/01-SPEC.md) | Especificación de producto completa |
| [docs/02-API-SPEC.md](docs/02-API-SPEC.md) | API del asistente: system prompts, tools, RAG, guardarraíles |
| [docs/03-BENCHMARKING.md](docs/03-BENCHMARKING.md) | Benchmarking competitivo del mercado EdTech argentino |
| [docs/04-WHATSAPP-API.md](docs/04-WHATSAPP-API.md) | Evaluación de integración WhatsApp Business API |
| [docs/05-ARCHITECTURE.md](docs/05-ARCHITECTURE.md) | Arquitectura técnica: stack, multi-tenancy, auth, IA, infra |
| [docs/06-AI-MODELS.md](docs/06-AI-MODELS.md) | Comparativa de modelos IA (Claude, GPT, Gemini, Grok) |
| [docs/cdu/README.md](docs/cdu/README.md) | Catálogo de CDUs por perfil (73 casos de uso) |
| [docs/08-DATA-MODEL.md](docs/08-DATA-MODEL.md) | Modelo de datos: familias, tutores y alumnos (schema, permisos, casos de borde) |
| [docs/09-MCP-DEFINITIONS.md](docs/09-MCP-DEFINITIONS.md) | Catálogo canónico MCP/tools por perfil, contratos I/O y errores |
| [docs/10-MCP-SCHEMAS.md](docs/10-MCP-SCHEMAS.md) | JSON Schemas publicados (input/output) para tools canónicas |

## Setup local

### Prerequisitos

- Node.js ≥ 22
- pnpm ≥ 10
- Docker Desktop (para Supabase local)
- Supabase CLI (`brew install supabase/tap/supabase`)

### Quick Start

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/tu-org/vujy.git
cd vujy
pnpm install

# 2. Variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores del proyecto Supabase local
# (los valores se muestran al correr `supabase start`)

# 3. Levantar Supabase (Docker debe estar corriendo)
supabase start
# → Copiar SUPABASE_URL y SUPABASE_ANON_KEY al .env.local

# 4. Aplicar migraciones + seed de desarrollo
pnpm seed
# → Crea esquema completo + Escuela Demo con datos ficticios

# 5. Correr la app
pnpm dev
# → http://localhost:3000
```

### Usuarios de prueba (después del seed)

| Email | Rol | Descripción |
|-------|-----|-------------|
| `admin@demo.vujy.app` | admin | Administrador de la Escuela Demo |
| `docente@demo.vujy.app` | teacher | Docente de 4to B y 5to A |
| `padre@demo.vujy.app` | guardian | Laura García — madre de Mati y Sofi |
| `alumno@demo.vujy.app` | student | Alumno demo |

Los magic links llegan al inbox local de Supabase: **http://127.0.0.1:54324**

### URLs de desarrollo

| URL | Descripción |
|-----|-------------|
| http://localhost:3000 | App web |
| http://127.0.0.1:54323 | Supabase Studio (DB, Auth, Storage) |
| http://127.0.0.1:54324 | Inbucket (emails de magic link) |
| http://localhost:3000/api/health | Health check de la API |

### Estructura del proyecto

```
/
├── app/                    # Next.js App Router (web + API)
│   ├── (auth)/             # Login, select-school
│   ├── (dashboard)/        # Dashboard por perfil
│   └── api/                # API routes
│       ├── health/         # Health check
│       ├── auth/session/   # JWT claims (school_id + role)
│       ├── webhooks/       # WhatsApp (003), Mercado Pago (007)
│       └── ai/chat/        # Asistente IA (004+)
├── lib/
│   ├── db/                 # Drizzle ORM (portable a cualquier Postgres)
│   ├── supabase/           # Supabase SDK (solo Auth y Storage)
│   └── llm/                # LLM Provider (Claude por defecto, configurable)
├── packages/
│   └── types/              # Tipos TypeScript compartidos
├── supabase/
│   ├── migrations/         # SQL migrations (Supabase CLI)
│   └── seed/               # Datos de desarrollo (ficticios)
├── specs/                  # Especificaciones de features (speckit)
└── docs/                   # Documentación de producto y arquitectura
```

## Features

| Feature | Rama | Estado |
|---------|------|--------|
| 001 — Foundation | `001-foundation` | En implementación |
| 002 — Legal Gates | `002-legal-gates` | Pendiente |
| 003 — WhatsApp Infra | `003-whatsapp-infra` | Pendiente |
| 004 — Parent Assistant | `004-parent-assistant` | Pendiente |
| 005 — Teacher Assistant | `005-teacher-assistant` | Pendiente |
| 006 — Admin Dashboard | `006-admin-dashboard` | Pendiente |

Ver plan completo en [docs/17-IMPLEMENTATION-PLAN.md](docs/17-IMPLEMENTATION-PLAN.md).

## Desarrollo

Este proyecto usa el flujo **speckit** para diseño y desarrollo:

```
/speckit.specify → /speckit.clarify → /speckit.plan → /speckit.tasks → /speckit.implement
```

Ver la [constitución del proyecto](.specify/memory/constitution.md) para principios rectores.

## Seguridad

- Toda tabla tiene RLS habilitado (`school_id = get_my_school_id()`)
- Ninguna query de negocio usa el cliente Supabase directamente — todo pasa por `lib/db/` (Drizzle)
- `npm audit --audit-level=high` es gate bloqueante en CI
- PRs que toquen auth/API/RLS/webhooks deben pasar `/vulnerability-scanner`

Ver [docs/05-ARCHITECTURE.md §8](docs/05-ARCHITECTURE.md) para las Security Gates completas.

## Dominio

[vujy.app](https://vujy.app)
