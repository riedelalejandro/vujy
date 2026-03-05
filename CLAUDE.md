# CLAUDE.md — Vujy

Guía de contexto para agentes IA trabajando en este repositorio.

## Proyecto

**Vujy** es una plataforma educativa SaaS B2B para escuelas privadas argentinas (inicial, primaria, secundaria). El diferencial es un asistente conversacional IA multicanal (WhatsApp + app + web) que sirve a todos los actores: administradores, docentes, padres y alumnos.

- Dominio: vujy.app
- Stack: Next.js + TypeScript (Vercel) · React Native + Expo · Supabase (Postgres + RLS + Auth + Storage) · Claude API + function calling/MCPs · Meta Cloud API directo (WhatsApp, sin BSP) · Mercado Pago
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
| `docs/04-WHATSAPP-API.md` | WhatsApp API · decisión: Meta Cloud API directo desde MVP · Opción A (número virtual por escuela) |
| `docs/05-ARCHITECTURE.md` | Arquitectura técnica — fuente de verdad de decisiones de stack |
| `docs/09-MCP-DEFINITIONS.md` | Catálogo canónico de 43 tools MCP — roles, errores, mapeo CDU→tool |
| `docs/10-MCP-SCHEMAS.md` | JSON Schemas Draft 2020-12 para todas las tools |
| `docs/cdu/README.md` | Índice de los 73 CDUs por perfil (v2.0) |
| `docs/12-CDU-DECISOR-90-10.md` | Decisiones 90/10 sobre CDUs — rationale de cada elección |
| `docs/13-CDU-DATASOURCE-SLA.md` | Mapeo CDU→fuente de datos (SQL/RAG/GEN-IA) + SLA máx. en ms para los 73 CDUs |
| `docs/14-WHATSAPP-TEMPLATE-LIBRARY.md` | 11 templates de WhatsApp con spec completa (variables, botones, categoría Meta) |
| `docs/15-MIGRATIONS-STRATEGY.md` | Estrategia de migraciones Supabase CLI · esquema completo · RLS policies · acceso admin |
| `docs/16-DATA-REGULATION-BRIEF.md` | Brief legal para asesor: base legal menores, DPA Anthropic, retención, consentimiento · PENDIENTE validación |
| `.specify/memory/constitution.md` | Constitución del proyecto — principios rectores, vinculante |

## Principios rectores (constitución v1.0.0)

1. **Conversación como interfaz primaria** — toda funcionalidad MUST ser accesible desde chat; los formularios son rutas secundarias
2. **Ubicuidad multicanal** — los journeys críticos MUST funcionar en app, web y WhatsApp
3. **Privacidad y seguridad de menores** (NON-NEGOTIABLE) — cumplimiento normativa argentina; guardarraíles estrictos en asistentes para alumnos menores
4. **IA con supervisión humana** — todo contenido generado por IA MUST pasar por aprobación humana antes de distribuirse; siempre hay escalado a persona
5. **Proactividad e inteligencia conectada** — el sistema cruza datos entre módulos para generar alertas sin que el usuario las solicite
6. **Cero fricción en adopción** — si un feature necesita capacitación, el diseño falló; WhatsApp como canal de entrada preferido

## Flujo de trabajo (speckit)

El desarrollo sigue este ciclo en orden obligatorio:

```
/speckit.specify → /speckit.clarify → /speckit.plan → /speckit.tasks → /speckit.implement
```

- Las ramas siguen el formato `###-feature-name` (ej: `001-educational-platform`)
- Todo PR MUST referenciar el `spec.md` correspondiente y pasar el Constitution Check del `plan.md`
- La constitución supersede cualquier otra guía

## Convenciones de código

- Los documentos de dominio (specs, planes, constitución) se escriben en **español**
- Los artefactos técnicos se escriben en **inglés** (código, APIs, JSON, schemas, eventos, payloads, nombres de tablas/columnas/variables)
- Los mensajes de commit siguen el formato convencional: `type: descripción`

## Estado de features

| Feature | Rama | Estado |
|---------|------|--------|
| 001-educational-platform | `001-educational-platform` | Spec completa — pendiente `/speckit.plan` |

## TODOs pendientes antes de implementar

- ~~`TODO(CDU_BY_PROFILE)`~~ ✅ **CERRADO** — 73 CDUs definitivos en `docs/cdu/` · decisor 90/10 en `docs/12-CDU-DECISOR-90-10.md`
- ~~`TODO(MCP_DEFINITIONS)`~~ ✅ **CERRADO** — 43 tools canónicas en `docs/09-MCP-DEFINITIONS.md` · schemas JSON en `docs/10-MCP-SCHEMAS.md`
- ~~`TODO(MIGRATIONS_STRATEGY)`~~ ✅ **CERRADO** — Supabase CLI nativo · esquema completo 25+ tablas · RLS policies · admin access pattern en `docs/15-MIGRATIONS-STRATEGY.md`
- `TODO(DATA_REGULATION)`: ~~pendiente~~ brief técnico generado en `docs/16-DATA-REGULATION-BRIEF.md` · **BLOQUEANTE**: requiere dictamen legal externo + DPA Anthropic antes de usar datos reales
- ~~`TODO(WHATSAPP_NUMBER_STRATEGY)`~~ ✅ **CERRADO** — Meta Cloud API directo (sin BSP) · Opción A: número virtual nuevo por escuela · **ACCIÓN URGENTE: iniciar verificación Tech Provider Meta (60-90 días)**
- ~~`TODO(TEMPLATE_LIBRARY)`~~ ✅ **CERRADO** — 11 templates definidos en `docs/14-WHATSAPP-TEMPLATE-LIBRARY.md` · 5 P0 bloqueantes + 4 P1 MVP + 2 P2 · **ACCIÓN URGENTE: someter P0 a aprobación Meta (semana 1)**
- ~~`TODO(OPTIN_FLOW)`~~ ✅ **CERRADO** — CDU-CROSS-005 + `register_consent@v1` + `get_consent_status@v1` como gate universal
