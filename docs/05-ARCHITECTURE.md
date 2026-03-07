# Vujy — Arquitectura Técnica

**Versión:** 1.0
**Fecha:** 4 de marzo de 2026
**Relacionado con:** SPEC.md §7 · SPEC.md §13 · constitution.md (TODO(WHATSAPP_NUMBER_STRATEGY), TODO(TEMPLATE_LIBRARY), TODO(OPTIN_FLOW), TODO(DATA_REGULATION))

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

**Paridad UI — perfiles ADM y DOC (Constitución §II Corolario):** Toda acción ejecutable
por el asistente para estos perfiles MUST tener una ruta de UI estructurada equivalente en
app y web (formulario, dashboard o flujo guiado). Implicación arquitectónica: cada endpoint
de API que sirva a ADM/DOC desde el asistente MUST estar también consumible desde un
componente de UI. Los perfiles PAD y ALU están exentos.

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

> Catálogo canónico vigente de tools: [09-MCP-DEFINITIONS.md](09-MCP-DEFINITIONS.md).
> Schemas JSON publicados: [10-MCP-SCHEMAS.md](10-MCP-SCHEMAS.md).
> Este documento mantiene la arquitectura de alto nivel; el detalle operativo vive en esos dos documentos.

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
npm audit (0 HIGH/CRITICAL) → lint → typecheck → tests unitarios → preview deploy (Vercel automático)
```

**Merge a main:**
```
npm audit → tests → migraciones Supabase (staging) → deploy Vercel staging → smoke tests → producción
```

**Tag `v*.*.*`:**
```
npm audit → Expo EAS build (iOS + Android) → submit a App Store / Play Store
```

> `npm audit --audit-level=high` es un **gate bloqueante** en todos los pipelines. Un resultado con vulnerabilidades HIGH o CRITICAL detiene el pipeline. No se puede hacer merge ni build sin resolverlas.

### Observabilidad

| Qué | Herramienta |
|-----|------------|
| Errores y excepciones | Sentry (Next.js + Expo) |
| Logs de API y funciones | Vercel Logs |
| Analytics de producto | Posthog |
| Uptime y alertas | Better Uptime |

---

## 8. Security Gates

### Principio general

**Ningún build ni push puede ejecutarse sin pasar los gates de seguridad.** Esto aplica a frontend (Next.js), backend (API routes), mobile (Expo) y migraciones (Supabase).

### Gate 1 — Auditoría de dependencias (pre-build)

| Check | Comando | Umbral bloqueante |
|-------|---------|-------------------|
| Vulnerabilidades conocidas | `npm audit --audit-level=high` | 0 HIGH / 0 CRITICAL |
| Paquetes desactualizados con CVE | `npm outdated` | revisar manualmente |
| Integridad del lock file | `package-lock.json` commiteado | obligatorio |

### Gate 2 — Revisión de seguridad (pre-push)

Obligatorio cuando el cambio afecta cualquiera de estas áreas:

| Área | Riesgo principal | OWASP 2025 |
|------|-----------------|------------|
| Rutas API (`app/api/**`) | Endpoint sin auth, exposición de datos | A01, A07 |
| Middleware de auth | Bypass de sesión, fail-open | A07, A10 |
| Políticas RLS / queries Supabase | Cross-tenant data leak, IDOR | A01 |
| Webhooks (WhatsApp, Mercado Pago) | Requests no verificados, replay attacks | A07, A08 |
| Variables de entorno | Secrets en client bundle | A04 |
| Nuevas dependencias | Supply chain, typosquatting | A03 |
| Manejo de errores | Stack traces expuestos, fail-open | A10 |

### Checks específicos del stack

**RLS (multi-tenant):**
- Toda tabla nueva: `ALTER TABLE x ENABLE ROW LEVEL SECURITY` + política con `school_id`
- Verificar que ninguna query de servicio omita el filtro de tenant

**WhatsApp webhook** (`app/api/webhooks/whatsapp`):
- Verificar `X-Hub-Signature-256` con HMAC-SHA256 del `APP_SECRET`
- Fail-closed: `401` inmediato si la firma no coincide

**Mercado Pago webhook:**
- Verificar firma `x-signature` + `x-request-id` antes de procesar
- Idempotencia: tabla de `processed_events` para evitar doble procesamiento

**Claude API / Function calling:**
- Toda tool MUST recibir y propagar `school_id` del contexto de sesión
- Los datos retornados al LLM MUST estar filtrados por tenant antes de enviarse

**Client bundle (Next.js):**
- Solo variables con prefijo `NEXT_PUBLIC_` llegan al browser
- Ningún secret, token de API ni credencial puede tener ese prefijo

**Supabase Storage:**
- Buckets de datos de alumnos: `public = false`
- Acceso mediante signed URLs con expiración corta (≤ 1 hora)

### Skill obligatorio

Usar `/vulnerability-scanner` en PRs que toquen las áreas listadas arriba.
Usar `/code-review-checklist` como check complementario en todo PR.

## 9. Pendientes

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| `TODO(CDU_BY_PROFILE)` | **CERRADO** — catálogo consolidado en `docs/cdu/README.md` (73 CDUs) | Cerrado |
| `TODO(MCP_DEFINITIONS)` | **CERRADO** — catálogo canónico en `docs/09-MCP-DEFINITIONS.md` | Cerrado |
| `TODO(WHATSAPP_NUMBER_STRATEGY)` | ¿Número virtual nuevo por escuela o migración de número existente? Ver [04-WHATSAPP-API.md](04-WHATSAPP-API.md) | Media |
| `TODO(TEMPLATE_LIBRARY)` | Definir set mínimo de templates de WhatsApp para MVP y someterlos a aprobación de Meta | Media |
| `TODO(OPTIN_FLOW)` | Diseñar flujo de consentimiento explícito de padres integrado con onboarding de la escuela | Media |
| `TODO(MIGRATIONS_STRATEGY)` | **CERRADO** — estrategia publicada en `docs/15-MIGRATIONS-STRATEGY.md` | Cerrado |
| `TODO(DATA_REGULATION)` | Investigar normativa argentina sobre datos de menores — impacta diseño de RLS y retención | Alta |

---

*Vujy · vujy.app — Arquitectura Técnica v1.0 · Marzo 2026*

---

## Runbook operativo inicial (Plan 001)

1. Setear variables en `.env` usando `.env.example`.
2. Verificar contratos MCP con `npm run validate:mcp-schemas`.
3. Ejecutar pruebas de harness/contratos/integración del plan.
4. Habilitar monitoreo de auditoría para invocaciones de tools.
5. Validar aislamiento multi-tenant antes de cualquier piloto con datos reales.
