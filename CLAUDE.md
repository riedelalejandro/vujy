# CLAUDE.md — Vujy

Guía de contexto para agentes IA trabajando en este repositorio.

## Proyecto

**Vujy** es una plataforma educativa SaaS B2B para escuelas privadas argentinas (inicial, primaria, secundaria). El diferencial es un asistente conversacional IA multicanal (WhatsApp + app + web) que sirve a todos los actores: administradores, docentes, padres y alumnos.

- Dominio: vujy.app
- Stack: Next.js + TypeScript (Vercel) · React Native + Expo · Supabase (Postgres + RLS + Auth + Storage) · Claude API + function calling/MCPs · Twilio (WhatsApp MVP) · Mercado Pago
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
| `docs/04-WHATSAPP-API.md` | Evaluación WhatsApp API · decisión: Twilio MVP → Meta Cloud API a escala |
| `docs/05-ARCHITECTURE.md` | Arquitectura técnica — fuente de verdad de decisiones de stack |
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
- El código fuente se escribe en **inglés**
- Los mensajes de commit siguen el formato convencional: `type: descripción`

## Estado de features

| Feature | Rama | Estado |
|---------|------|--------|
| 001-educational-platform | `001-educational-platform` | Spec completa — pendiente `/speckit.plan` |

## TODOs pendientes antes de implementar

- `TODO(AUTH_STRATEGY)`: método de autenticación por definir (SSO institucional deseable)
- `TODO(DB_STRATEGY)`: base de datos y storage por definir
- `TODO(INFRA)`: infraestructura, CI/CD y deployment por definir
- `TODO(DATA_REGULATION)`: investigar normativa argentina sobre datos de menores de edad (impacta FR-020 y FR-023)
