# CLAUDE.md — Vujy

Guía de contexto para agentes IA trabajando en este repositorio.

## Proyecto

**Vujy** es una plataforma educativa SaaS B2B para escuelas privadas argentinas (inicial, primaria, secundaria). El diferencial es un asistente conversacional IA multicanal (WhatsApp + app + web) que sirve a todos los actores: administradores, docentes, padres y alumnos.

- Dominio: vujy.app
- Stack: Next.js + TypeScript (Vercel) · React Native + Expo · Supabase (Postgres + RLS + Auth + Storage) · Claude API + function calling · Meta Cloud API directo (WhatsApp, sin BSP) · Mercado Pago
- Multi-tenancy: shared DB + Row Level Security (school_id en todas las tablas)
- Auth: magic link (staff/padres app+web) · OTP por teléfono (padres WhatsApp)
- IA: function calling como primario (datos estructurados en tiempo real) · pgvector RAG solo para contenido no estructurado (observaciones docentes, documentos)
- Ver decisiones completas en `docs/05-ARCHITECTURE.md`

## Documentos clave

| Archivo | Contenido |
|---------|-----------|
| `docs/01-SPEC.md` | Especificación de producto completa (fuente de verdad de negocio) |
| `docs/02-API-SPEC.md` | System prompts, tools por perfil, estrategia RAG, guardarraíles |
| `docs/03-BENCHMARKING.md` | Análisis competitivo del mercado EdTech argentino |
| `docs/04-WHATSAPP-API.md` | WhatsApp API · decisión: Meta Cloud API directo · número virtual por escuela |
| `docs/05-ARCHITECTURE.md` | Arquitectura técnica — fuente de verdad de stack y security gates |
| `docs/06-AI-MODELS.md` | Comparativa LLMs · decisión: Claude dual-tier (Haiku fast + Sonnet smart) |
| `docs/08-DATA-MODEL.md` | Modelo relacional familias/tutores/alumnos · SQL + RLS policies |
| `docs/09-MCP-DEFINITIONS.md` | Catálogo canónico de 48 tools MCP — roles, errores, mapeo CDU→tool |
| `docs/10-MCP-SCHEMAS.md` | JSON Schemas Draft 2020-12 para las 48 tools |
| `docs/cdu/README.md` | Índice de los 73 CDUs por perfil (v2.0) |
| `docs/11-JOURNEY-P0-PARENT-RESUMEN-AUSENCIA-PAGO.md` | Journey E2E P0 padre: resumen→ausencia→pago |
| `docs/12-CDU-DECISOR-90-10.md` | Decisiones 90/10 sobre CDUs — rationale de cada elección |
| `docs/13-CDU-DATASOURCE-SLA.md` | Mapeo CDU→fuente de datos + SLA máx. en ms para los 73 CDUs |
| `docs/14-WHATSAPP-TEMPLATE-LIBRARY.md` | 11 templates WhatsApp (5 P0 + 4 P1 + 2 P2) |
| `docs/15-MIGRATIONS-STRATEGY.md` | Migraciones Supabase CLI · esquema completo · RLS policies |
| `docs/16-DATA-REGULATION-BRIEF.md` | Brief legal menores · DPA Anthropic · **PENDIENTE validación legal** |
| `docs/17-IMPLEMENTATION-PLAN.md` | 12 entregables verticales con grafo de dependencias |
| `docs/18-A3-E2E-P0.md` | Harness E2E para 3 CDUs P0 bloqueantes (11 test cases) |
| `.specify/memory/constitution.md` | Constitución del proyecto — principios rectores, vinculante |

### Documentos deprecados (NO usar para implementación)

- `docs/08-CDU-BY-PROFILE-CONSENSUS.md` — v1 histórica (32 CDUs, naming obsoleto en español)
- `docs/07-CDU-MULTIAGENT-TASK.md` — protocolo de trabajo multiagente (ya cumplió su función)
- `docs/cdu/tools-matrix.md` · `docs/cdu/implementation-notes.md` — snapshots históricos

## Principios rectores (constitución v1.0.0)

1. **Conversación como interfaz primaria** — toda funcionalidad MUST ser accesible desde chat
2. **Ubicuidad multicanal** — journeys críticos MUST funcionar en app, web y WhatsApp
3. **Privacidad de menores** (NON-NEGOTIABLE) — normativa argentina, guardarraíles estrictos
4. **IA con supervisión humana** — aprobación humana antes de distribuir contenido generado
5. **Proactividad e inteligencia conectada** — alertas cruzando datos entre módulos
6. **Cero fricción en adopción** — si necesita capacitación, el diseño falló

La constitución supersede cualquier otra guía. Ver detalle completo en `.specify/memory/constitution.md`.

## Flujo de trabajo (speckit)

```
/speckit.specify → /speckit.clarify → /speckit.plan → /speckit.tasks → /speckit.implement
```

- Ramas: `###-feature-name` (ej: `001-foundation`)
- Todo PR MUST referenciar el `spec.md` correspondiente y pasar el Constitution Check

## Convenciones de código

- Documentos de dominio (specs, planes, constitución): **español**
- Artefactos técnicos (código, APIs, JSON, schemas, tablas, columnas, variables): **inglés**
- Commits: formato convencional `type: descripción`

## Dependencias

**Reglas de mantenimiento de dependencias:**

- Antes de cualquier PR a `main`, correr `pnpm update --latest` y fijar los cambios
- Si hay dependencias con versión major incompatible (peer warnings), resolver antes de mergear
- Vulnerabilidades `moderate` o superior bloquean el CI — deben resolverse o documentarse con override + justificación en `package.json` (`pnpm.overrides`)
- Al forzar una versión con override: agregar comentario inline explicando el motivo y el advisory (ej. `"esbuild": ">=0.25.0" // GHSA-67mh-4wv8-2f99`)
- `npm audit --audit-level=moderate` MUST pasar en CI; `pnpm audit` localmente antes de push

## Seguridad (NON-NEGOTIABLE)

> Fuente canónica: `docs/05-ARCHITECTURE.md §8 Security Gates`. Ante divergencia, ese documento prevalece.

**Reglas que el agente MUST seguir durante coding:**

- Toda tabla nueva → RLS habilitado + política `school_id = auth.jwt() ->> 'school_id'`
- Ninguna query omite filtro de `school_id` — nunca exponer datos entre tenants
- API routes (`app/api/**`) → validar sesión antes de ejecutar lógica
- Webhooks públicos → verificar firma (`X-Hub-Signature-256` para Meta, `x-signature` para MP) — fail-closed
- Variables de entorno → nunca `NEXT_PUBLIC_` para secrets; `.env` en `.gitignore`
- Claude API → datos filtrados por `school_id` antes de enviarse al LLM
- Storage → buckets de alumnos privados, signed URLs con TTL
- `npm audit --audit-level=high` MUST pasar antes de cualquier build
- Dependencias nuevas → verificar en Socket.dev antes de agregar

**Skills obligatorios en PRs sensibles:**
- `/vulnerability-scanner` → auth, API routes, RLS, webhooks, dependencias
- `/code-review-checklist` → recomendado en todo PR

## Bloqueante abierto

`TODO(DATA_REGULATION)`: brief en `docs/16-DATA-REGULATION-BRIEF.md` — requiere dictamen legal externo + DPA Anthropic antes de usar datos reales de menores.

## Estado de features

| Feature | Rama | Estado |
|---------|------|--------|
| 001-foundation | `001-foundation` | Spec consolidado · plan en `docs/17-IMPLEMENTATION-PLAN.md` · pendiente `/speckit.tasks` + `/speckit.implement` |
