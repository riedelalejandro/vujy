# Vujy — Plan de Implementación por Entregables

**Versión:** 1.0 | **Fecha:** 2026-03-07
**Relacionado con:** `docs/05-ARCHITECTURE.md` · `docs/cdu/README.md` · `CLAUDE.md`

---

## Principio organizador: Vertical Journey Slices

**Nunca por capa** (todo el backend primero, luego el front).
**Nunca por perfil** (todo el padre, luego todo el docente).
Siempre por **journey completo**: un CDU o grupo de CDUs relacionados, con todas las
superficies que los tocan (API + Web + App + WhatsApp), en un solo ciclo speckit.

Cada feature = un ciclo speckit completo:
```
/speckit.specify → /speckit.clarify → /speckit.plan → /speckit.tasks → /speckit.implement
```

---

## Grafo de dependencias

```
001-foundation          ← bloquea todo lo demás
      │
      ▼
002-legal-gates         ← bloquea cualquier flujo con datos de usuarios
      │
      ├──► 003-whatsapp-infra   ← iniciar desde semana 1 (Meta tarda 60-90 días)
      │
      ▼
004-parent-assistant ──► 007-payments ──► 011-admin-advanced
005-teacher-assistant                ▲
006-admin-dashboard  ────────────────┘
      │
      ▼
008-notifications
      │
      ▼
009-student-app
010-teacher-advanced
      │
      ▼
012+ (P2/P3 diferenciadores)
```

---

## Los 12 entregables

### 001 · Foundation

**Branch:** `001-foundation`
**Estado:** spec existente como `001-educational-platform` — ejecutar `/speckit.plan` acotado a infraestructura

**Qué incluye:**
- Schema completo Supabase (25+ tablas, ver `docs/15-MIGRATIONS-STRATEGY.md`)
- RLS policies para todos los roles
- Auth: magic link (staff/padres app+web) + OTP por teléfono (padres WhatsApp)
- Multi-tenancy: `school_id` en todas las tablas + función helper `get_my_school_id()`
- CI/CD: GitHub Actions con `npm audit` como gate bloqueante (ver `docs/05-ARCHITECTURE.md §8`)
- Shared types (`packages/types`) compartidos entre Next.js y Expo
- Estructura de carpetas Next.js App Router + Expo SDK
- Seed de desarrollo con una escuela ficticia + usuarios de prueba por perfil

**Superficies:** Backend (Supabase + API routes base)

**Entregable visible:** Ninguna feature de usuario. Cualquier developer puede correr la app localmente con datos de prueba.

**Por qué todo junto:** Las RLS policies son relacionales entre tablas. Un schema incremental por feature rompe foreign keys y obliga a refactors costosos. El modelo de datos completo desde el arranque es más seguro.

**Dependencias:** Ninguna.

---

### 002 · Legal Gates

**Branch:** `002-legal-gates`
**CDUs:** CROSS-005 (consentimiento onboarding) · CROSS-006 (ARCO) · ADM-015 (revocación acceso tutor)
**Prioridad:** P0 BLOQUEANTE

**Qué incluye:**
- Flujo de consentimiento informado en onboarding (app + web + WhatsApp)
- Tools `register_consent@v1` + `get_consent_status@v1` como gate universal
- Endpoint de solicitud ARCO (acceso, rectificación, cancelación, oposición)
- Revocación de acceso de tutor: flag `foto_bloqueada` + desvinculación inmediata
- Audit log de todas las acciones de consentimiento

**Superficies:** App · Web · WhatsApp (consentimiento)

**Por qué antes que cualquier feature:** Sin opt-in confirmado y sin revocación de tutor no puede haber datos de menores en el sistema. Es la condición legal de existencia del MVP bajo Ley 25.326.

**Dependencias:** 001-foundation

---

### 003 · WhatsApp Infrastructure

**Branch:** `003-whatsapp-infra`
**CDUs:** Base para todos los CDUs con canal WhatsApp
**Prioridad:** P0 — iniciar en paralelo con 001 desde semana 1

**Qué incluye:**
- Webhook Meta Cloud API (`app/api/webhooks/whatsapp`)
- Verificación de firma `X-Hub-Signature-256` (HMAC-SHA256) — fail-closed
- Provisioning de número virtual por escuela (Opción A: número nuevo)
- Submission de los 5 templates P0 a Meta para aprobación
- Sistema de routing de mensajes entrantes por `phone` → `profile`
- Sesión persistente por thread de WhatsApp (OTP una sola vez)
- Fallback conversacional cuando el asistente no puede responder

**Superficies:** WhatsApp Business API (Meta Cloud API directo)

**Por qué en paralelo desde semana 1:** La verificación como Tech Provider Meta tarda 60-90 días. La aprobación de templates tarda 1-7 días por template. Si no arranca en semana 1, bloquea todos los journeys de WhatsApp del MVP.

**Entregable visible:** La escuela puede recibir y enviar un mensaje de texto simple por WhatsApp. No hay asistente todavía.

**Dependencias:** 001-foundation (para webhook y DB). Puede desarrollarse en paralelo a 002.

---

### 004 · Parent Assistant

**Branch:** `004-parent-assistant`
**CDUs:** PAD-001 · PAD-002 · PAD-003 · PAD-004 · PAD-005 · PAD-006 · PAD-007 · PAD-008 · PAD-015
**Prioridad:** P1 MVP

**Qué incluye:**
- System prompt del perfil padre/tutor (ver `docs/02-API-SPEC.md`)
- Function calling: `get_student_summary@v1`, `get_attendance@v1`, `get_grades@v1`, `get_announcements@v1`, `get_calendar@v1`, `get_family_balance@v1`
- Tools de acción: `record_absence@v1`, `sign_authorization@v1`, `confirm_reenrollment@v1`
- UI conversacional en app (React Native) y web (Next.js)
- Notificaciones push (Expo) para urgencias

**Superficies:** WhatsApp · App · Web

**Flujo mínimo completo:** Padre escribe "¿Cómo estuvo Mati?" por WhatsApp → Claude llama tools → responde con resumen de asistencia, notas y agenda. Mismo journey desde App y Web.

**Dependencias:** 001-foundation · 002-legal-gates · 003-whatsapp-infra

---

### 005 · Teacher Assistant

**Branch:** `005-teacher-assistant`
**CDUs:** DOC-001 · DOC-002 · DOC-003 · DOC-004 · DOC-005 · DOC-006 · DOC-007
**Prioridad:** P1 MVP

**Qué incluye:**
- System prompt del perfil docente
- Function calling: `take_attendance@v1`, `record_absence@v1`, `record_grade_batch@v1`, `record_pedagogical_note@v1`, `generate_announcement_draft@v1`, `send_announcement@v1`, `generate_pedagogical_report@v1`, `generate_learning_activity@v1`
- Input de voz en app mobile (Expo Audio) con fallback explícito a lista (DOC-002) en web
- UI de lista de asistencia (tap) en app y web
- Editor de comunicados con borrador IA + aprobación docente
- Generador de informes pedagógicos con RAG sobre observaciones del trimestre
- Paridad total App · Web (Constitución §II Corolario)

**Superficies:** App · Web · WhatsApp (DOC-001, 003, 004, 005)

**Dependencias:** 001-foundation · 002-legal-gates · 003-whatsapp-infra

---

### 006 · Admin Dashboard

**Branch:** `006-admin-dashboard`
**CDUs:** ADM-001 · ADM-005 · ADM-007 · ADM-009
**Prioridad:** P1 MVP

**Qué incluye:**
- System prompt del perfil admin/directivo
- Function calling: `get_institutional_alerts@v1`, `get_delinquency_dashboard@v1`, `get_attendance@v1`, `get_announcements@v1`, `get_dropout_risk@v1`
- Dashboard de pulso institucional (conversacional + widgets visuales)
- Índice de riesgo de deserción con cruce de datos entre módulos
- Alertas tempranas automáticas (Supabase Edge Function cron)
- Comparación de períodos

**Superficies:** App · Web

**Flujo mínimo completo:** Admin pregunta "¿Cómo estamos hoy?" → pulso institucional + alertas + riesgo de deserción. Conversacional y con UI de dashboard en paralelo.

**Dependencias:** 001-foundation · 002-legal-gates · (004 y 005 para tener datos reales)

---

### 007 · Payments & Collections

**Branch:** `007-payments`
**CDUs:** ADM-002 · ADM-003 · ADM-004 · PAD-003
**Prioridad:** P1 MVP

**Qué incluye:**
- Integración Mercado Pago SDK (pagos + webhooks)
- Verificación de firma `x-signature` + idempotencia (tabla `processed_events`)
- Dashboard de morosidad en tiempo real (admin)
- Recordatorios escalonados automáticos (amable → firme)
- Generación de plan de pago para familia morosa
- Padre paga cuota desde WhatsApp o app (checkout MP)
- Historial de pagos y facturación descargable

**Superficies:** App · Web (admin) · App · WhatsApp (padre)

**Dependencias:** 001-foundation · 004-parent-assistant · 006-admin-dashboard

---

### 008 · Notifications & Alerts

**Branch:** `008-notifications`
**CDUs:** CROSS-002 · PAD-014 · PAD-012 · ADM-007 (avanzado)
**Prioridad:** P1-P2

**Qué incluye:**
- WhatsApp templates de urgencia (suspensión de clases, incidente alumno)
- Push notifications Expo (FCM + APNs) desde Supabase Edge Functions
- Resumen proactivo semanal para padres (cron)
- Alerta proactiva de caída académica (cruce asistencia + notas)
- Cascada multicanal: Push → App → WhatsApp según disponibilidad del canal

**Superficies:** Push · App · Web · WhatsApp

**Dependencias:** 001-foundation · 003-whatsapp-infra · 004-parent-assistant · 005-teacher-assistant

---

### 009 · Student App

**Branch:** `009-student-app`
**CDUs:** ALU-001 a ALU-011 (agrupados por nivel: inicial, primaria 1er ciclo, primaria 2do ciclo, secundaria)
**Prioridad:** P1-P2

**Qué incluye:**
- Experiencia gamificada por nivel (ver `docs/01-SPEC.md §5`)
- Asistente tutor con guardarraíles estrictos de menores (Principio III)
- Actividades interactivas publicadas por docentes (005)
- Vista unificada de agenda académica (secundaria)
- Simulacro de examen + plan de estudio (secundaria)
- Detección de malestar emocional: señales → alerta anonimizada al equipo de orientación

**Superficies:** App únicamente (sin WhatsApp — NON-NEGOTIABLE · sin Web para alumnos)

**Dependencias:** 001-foundation · 002-legal-gates · 005-teacher-assistant

---

### 010 · Teacher Advanced

**Branch:** `010-teacher-advanced`
**CDUs:** DOC-008 · DOC-009 · DOC-010 · DOC-011 · DOC-012 · DOC-013 · DOC-014 · DOC-015 · DOC-016 · DOC-017
**Prioridad:** P2

**Qué incluye:**
- Consulta de estado de alumno específico
- Detección y seguimiento de alumnos en dificultad
- Planificación didáctica asistida (RAG sobre diseño curricular PBA/CABA)
- Diario visual del día — nivel inicial (fotos + resumen voz)
- Gestión de previas y seguimiento (secundaria)
- Sugerencia proactiva de actividad pre-evaluación
- Barrera de horarios: filtro de mensajes de padres fuera de horario laboral
- Alerta de bienestar emocional (solo patrón observable, nunca contenido — Principio III)
- Portfolio de impacto docente (DOC-017, tier Premium)

**Superficies:** App · Web · WhatsApp (según CDU)

**Dependencias:** 005-teacher-assistant · 009-student-app (para datos de bienestar)

---

### 011 · Admin Advanced

**Branch:** `011-admin-advanced`
**CDUs:** ADM-006 · ADM-008 · ADM-010 · ADM-011 · ADM-012 · ADM-013 · ADM-016
**Prioridad:** P2

**Qué incluye:**
- Simulador de escenarios financieros
- Generación de documentación para DIEGEP
- Estadísticas de asistencia institucional
- Gestión de personal y masa salarial
- Encuestas de satisfacción / NPS escolar
- Proyección de flujo de caja
- Campaña de reinscripción proactiva con IA

**Superficies:** App · Web

**Dependencias:** 006-admin-dashboard · 007-payments

---

### 012+ · Differentiators

**Branch:** branches separados por CDU
**CDUs:** CROSS-004 (biblioteca compartida entre escuelas) · CROSS-007 (modo corresponsal/acto) · ADM-014 (benchmark red)
**Prioridad:** P3

**Condición de CROSS-007:** No se lanza sin que 002-legal-gates esté implementado y el flag `foto_bloqueada` exista en el modelo de datos.

**Condición de ADM-014:** Requiere red de al menos 10 escuelas activas para que el benchmark tenga valor estadístico.

**Dependencias:** Red de escuelas activas.

---

## Decisión pendiente: branch 001

El branch `001-educational-platform` existe con spec de producto completa. Dos opciones:

| Opción | Descripción | Recomendación |
|--------|-------------|---------------|
| **A — Reutilizar** | `001-educational-platform` se convierte en `001-foundation`. Ejecutar `/speckit.plan` acotado a schema + auth + infraestructura. Las features van en 002+. | **Recomendada** |
| **B — Reestructurar** | Cerrar 001 como spec de producto general y arrancar la secuencia nueva desde `001-foundation` con spec técnico. | Mayor overhead |

**Razón de Opción A:** El spec de producto ya está validado y sirve como referencia en todos los planes siguientes. Solo hay que ejecutar `/speckit.plan` con scope reducido a foundation.

---

## Próximos pasos para retomar

- [ ] Ejecutar `/speckit.plan` en `001-educational-platform` — scope: foundation únicamente (schema + auth + RLS + CI/CD)
- [ ] Iniciar proceso de verificación Tech Provider Meta en paralelo — no esperar al final del foundation (60-90 días de lead time)
- [ ] Someter los 5 templates P0 de WhatsApp a Meta — ver `docs/14-WHATSAPP-TEMPLATE-LIBRARY.md`
- [ ] Ejecutar `/speckit.tasks` → `/speckit.implement` en 001 antes de abrir 002
- [ ] 002 y 003 pueden desarrollarse en paralelo una vez que 001 está mergeado a main

---

## Reglas del proceso (recordatorio)

- Cada feature branch sigue el formato `###-feature-name`
- Todo PR MUST referenciar el `spec.md` correspondiente y pasar el Constitution Check
- `npm audit --audit-level=high` es gate bloqueante en todo pipeline (ver `CLAUDE.md §Seguridad`)
- PRs que toquen auth/API/RLS/webhooks MUST usar `/vulnerability-scanner` antes del merge
- La constitución supersede cualquier otra guía — ver `.specify/memory/constitution.md`

---

*Vujy · vujy.app — Plan de Implementación v1.0 · Marzo 2026*
