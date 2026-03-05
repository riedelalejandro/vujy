# Vujy — Arquitectura Técnica

**Versión:** 1.0
**Fecha:** 4 de marzo de 2026
**Relacionado con:** SPEC.md §7 · SPEC.md §13 · constitution.md (TODO(CDU_BY_PROFILE), TODO(MCP_DEFINITIONS), TODO(MIGRATIONS_STRATEGY), TODO(DATA_REGULATION))

---

## Índice

1. [Stack resumen](#1-stack-resumen)
2. [Multi-tenancy](#2-multi-tenancy)
3. [Autenticación](#3-autenticación)
4. [Backend y web](#4-backend-y-web)
5. [Mobile](#5-mobile)
6. [Inteligencia artificial](#6-inteligencia-artificial)
7. [Infraestructura y CI/CD](#7-infraestructura-y-cicd)
8. [Pendientes](#8-pendientes)

---

## 1. Stack Resumen

| Capa | Tecnología | Notas |
|------|-----------|-------|
| **Base de datos** | Supabase (Postgres + RLS) | Multi-tenant vía Row Level Security |
| **Auth** | Supabase Auth | Magic link + OTP por teléfono |
| **Storage** | Supabase Storage | Archivos, fotos, documentos |
| **Vector store** | pgvector (en Supabase) | Solo para contenido no estructurado |
| **Backend + web** | Next.js + TypeScript | App Router · API routes |
| **Deployment web** | Vercel | Auto-deploy desde GitHub |
| **Mobile** | React Native + Expo | iOS + Android |
| **Mobile builds** | Expo EAS | CI para App Store / Play Store |
| **IA — LLM** | Claude API (Anthropic) | Todos los perfiles |
| **IA — acción** | Function calling / MCPs | Acceso a datos en tiempo real |
| **WhatsApp** | Twilio → Meta Cloud API | Twilio en MVP; migrar a escala |
| **Pagos** | Mercado Pago | — |
| **Monitoreo** | Sentry + Posthog | Errores + analytics de uso |

---

## 2. Multi-tenancy

**Modelo elegido: Shared database + Row Level Security (RLS)**

Cada escuela es un tenant identificado por `school_id`. Todas las tablas tienen esta columna.
Las políticas de RLS en Postgres garantizan que ninguna query pueda acceder a datos de otro
tenant, incluso si hay un error en la capa de aplicación.

```sql
-- Ejemplo de política RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON students
  USING (school_id = auth.jwt() ->> 'school_id');
```

**Por qué esta opción:**
- Supabase tiene RLS como ciudadano de primera clase — tooling, dashboard y APIs lo soportan nativamente
- El aislamiento de tenant es enforced a nivel de base de datos, no solo de aplicación
- Sin overhead operativo de gestionar N schemas o N bases de datos
- Escala sin cambios de arquitectura hasta cientos de escuelas

**Path de migración si se necesita mayor aislamiento:**
Si un tenant requiere aislamiento físico (regulación específica, contrato enterprise), se puede
mover a schema-per-tenant o DB dedicada sin cambiar el modelo de datos — solo la capa de
routing de conexión.

---

## 3. Autenticación

**Método por perfil:**

| Perfil | Canal | Método | Notas |
|--------|-------|--------|-------|
| Admin / dueño | App, web | Magic link | Sin contraseña |
| Directivo / coordinador | App, web | Magic link | Sin contraseña |
| Docente | App, web, WhatsApp | Magic link | Sin contraseña |
| Secretaría / preceptor | App, web | Magic link | Sin contraseña |
| Padre / tutor (app o web) | App, web | Magic link al email registrado | Email cargado por la escuela al onboardear |
| Padre / tutor (WhatsApp) | WhatsApp | OTP por teléfono — una sola vez | Sesión persiste en el thread de WhatsApp |
| Alumno | App | Magic link o PIN simple | PIN para niveles inicial y primaria |

**SSO institucional** (Google Workspace / Microsoft del colegio): diferido a tier Enterprise.
No forma parte del MVP. La estrategia de autenticación del MVP está resuelta.

**Implementación:** Supabase Auth maneja magic links, OTP por SMS y OAuth2. El JWT incluye
`school_id` y `role` para que las políticas de RLS puedan aplicarse automáticamente.

---

## 4. Backend y Web

**Framework: Next.js + TypeScript — desplegado en Vercel**

```
/
├── app/                    # Web frontend (responsive)
│   ├── (auth)/             # Páginas de login
│   ├── (dashboard)/        # Dashboard por perfil
│   └── ...
├── app/api/                # API routes (backend)
│   ├── webhooks/
│   │   └── whatsapp/       # Webhook de Twilio / Meta
│   ├── ai/
│   │   └── chat/           # Endpoint principal del asistente
│   └── ...
├── lib/
│   ├── supabase/           # Cliente de Supabase (server + client)
│   ├── claude/             # Cliente de Claude API + MCPs
│   └── whatsapp/           # Cliente de Twilio / WhatsApp
└── packages/
    └── types/              # Tipos compartidos con React Native
```

**API routes como backend unificado:** el frontend web y la app mobile consumen los mismos
endpoints en `/app/api`. No hay un servidor backend separado.

**Supabase Edge Functions** para operaciones que deben correr cerca de la base de datos:
triggers internos, procesamiento de eventos en tiempo real, cron jobs.

---

## 5. Mobile

**React Native + Expo**

- Expo SDK para acceso a cámara, micrófono (input de voz), notificaciones push y biometría
- Expo EAS para builds de CI/CD (App Store + Google Play)
- Comparte tipos TypeScript con el backend vía `/packages/types`
- Mismos endpoints de API que el web frontend

**Notificaciones push:** Expo Push Notifications (usa FCM y APNs por debajo). Las
notificaciones de eventos críticos (alumno ausente, cuota vencida) se disparan desde
Supabase Edge Functions directamente.

---

## 6. Inteligencia Artificial

### Arquitectura principal: Function calling / MCPs

El asistente de Vujy accede a los datos en tiempo real mediante function calling. Claude
decide qué herramienta invocar según la consulta del usuario; cada herramienta ejecuta una
query directa a Supabase y devuelve datos exactos.

```
Usuario: "¿Cuánto debo de cuota?"
    │
    ▼
Claude (con system prompt del perfil)
    │  decide llamar a:
    ▼
get_family_balance({ family_id, school_id })
    │
    ▼
Supabase → SELECT balance FROM payments WHERE family_id = $1 AND school_id = $2
    │
    ▼
Claude responde con el saldo exacto + opción de pagar
```

**Principio:** los datos estructurados (notas, asistencia, cuotas, calendario, comunicados)
se obtienen siempre vía function calling — nunca vía RAG. Esto garantiza precisión y datos
en tiempo real.

> **TODO(MCP_DEFINITIONS):** Definir el catálogo completo de MCPs/tools por perfil de usuario,
> una vez cerrados los CDU por perfil (`TODO(CDU_BY_PROFILE)`).
> Ver [02-API-SPEC.md](02-API-SPEC.md) para referencia de tools existentes. Incluir:
> - Tools del padre: consultas académicas, pagos, ausencias, calendario
> - Tools del docente: asistencia, notas, comunicados, observaciones, actividades
> - Tools del admin: morosidad, proyecciones, alertas, reportes regulatorios
> - Tools del alumno: actividades, progreso, tutor IA
> - Contratos de input/output de cada tool
> - Manejo de errores y fallbacks conversacionales

### RAG (uso limitado)

pgvector en Supabase se usa exclusivamente para contenido no estructurado donde no hay
query SQL posible:

| Caso de uso | Por qué RAG |
|-------------|------------|
| Micro-observaciones docentes → informe de trimestre | Texto libre acumulado; necesita síntesis semántica |
| Documentos institucionales (reglamentos, circulares históricas) | PDFs sin estructura relacional |
| Contexto de conversaciones largas | Recuperar historia relevante que no entra en el context window |

**Modelo de embeddings:** OpenAI `text-embedding-3-small` (bajo costo, calidad suficiente
para el volumen por escuela).

### System prompts y configuración por perfil

Cada perfil tiene un system prompt base + módulos configurables por institución (tono,
tools habilitadas, permisos de visibilidad). La configuración se almacena en Supabase y
se carga en cada conversación. Ver [02-API-SPEC.md](02-API-SPEC.md).

---

## 7. Infraestructura y CI/CD

### Environments

| Environment | Branch | URL | Base de datos |
|-------------|--------|-----|--------------|
| Producción | `main` | vujy.app | Supabase producción |
| Staging | `staging` | staging.vujy.app | Supabase staging |
| Preview | `feature/*` (PR) | `<hash>.vercel.app` | Supabase branch por PR |

Supabase Database Branching permite tener una branch de DB por cada PR de Vercel.

### Pipelines GitHub Actions

**PR (feature → main):**
```
lint → typecheck → tests unitarios → preview deploy (Vercel automático)
```

**Merge a main:**
```
tests → migraciones Supabase (staging) → deploy Vercel staging → smoke tests → producción
```

**Tag `v*.*.*`:**
```
Expo EAS build (iOS + Android) → submit a App Store / Play Store
```

### Observabilidad

| Qué | Herramienta |
|-----|------------|
| Errores y excepciones | Sentry (Next.js + Expo) |
| Logs de API y funciones | Vercel Logs |
| Analytics de producto | Posthog |
| Uptime y alertas | Better Uptime |

---

## 8. Pendientes

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| `TODO(CDU_BY_PROFILE)` | Definir y cerrar todos los casos de uso (CDU) por perfil (padre, docente, admin, alumno) como insumo de tools/permisos | **Alta — prerequisito para MCP_DEFINITIONS** |
| `TODO(MCP_DEFINITIONS)` | Definir catálogo completo de MCPs/tools por perfil (padre, docente, admin, alumno) con contratos de input/output, derivado de CDU_BY_PROFILE | **Alta — bloqueante para implementación del asistente** |
| `TODO(WHATSAPP_NUMBER_STRATEGY)` | ¿Número virtual nuevo por escuela o migración de número existente? Ver [04-WHATSAPP-API.md](04-WHATSAPP-API.md) | Media |
| `TODO(TEMPLATE_LIBRARY)` | Definir set mínimo de templates de WhatsApp para MVP y someterlos a aprobación de Meta | Media |
| `TODO(OPTIN_FLOW)` | Diseñar flujo de consentimiento explícito de padres integrado con onboarding de la escuela | Media |
| `TODO(MIGRATIONS_STRATEGY)` | Definir estrategia de migraciones de Supabase para schema multi-tenant con RLS | Alta |
| `TODO(DATA_REGULATION)` | Investigar normativa argentina sobre datos de menores — impacta diseño de RLS y retención | Alta |

---

*Vujy · vujy.app — Arquitectura Técnica v1.0 · Marzo 2026*
