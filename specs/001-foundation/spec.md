# Spec: 001 — Foundation

**Rama:** `001-foundation`
**Estado:** Consolidado
**Fuente canónica:** `docs/17-IMPLEMENTATION-PLAN.md §001` · `docs/15-MIGRATIONS-STRATEGY.md` · `docs/05-ARCHITECTURE.md`

---

## Objetivo

Establecer la base técnica completa de Vujy sobre la que se construyen todas las features posteriores. Sin entregable visible para usuarios finales. Entregable visible: cualquier developer puede clonar el repo, correr el seed y tener la plataforma funcionando localmente con datos ficticios.

---

## User Stories

### US1 (P1) — Schema completo con multi-tenancy y RLS

**Como developer** quiero correr `supabase db reset` y obtener un schema completo (25+ tablas), con `school_id` en cada tabla y las políticas RLS activas — **para poder desarrollar cualquier feature con la garantía de que la separación de tenants está enforced a nivel de base de datos, no solo de aplicación.**

**Criterio de aceptación:**
- Todas las tablas del MVP existen con sus columnas, constraints y foreign keys
- `school_id UUID NOT NULL` presente en todas las tablas excepto `schools`, `auth.users` y `audit_log`
- RLS habilitado (`ENABLE ROW LEVEL SECURITY`) en todas las tablas con `school_id`
- Una query ejecutada con el JWT de la escuela A no puede retornar datos de la escuela B
- `get_my_school_id()` y demás funciones helper disponibles

**Tablas (agrupadas por módulo):**
- Core: `schools`, `profiles`, `academic_years`, `sections`
- Académico: `students`, `enrollments`, `subjects`, `grade_records`, `attendance_records`
- Pedagógico: `pedagogical_notes` (con embedding pgvector), `wellbeing_alerts`
- Comunicación: `announcements`, `messages`, `consents`, `whatsapp_sessions`
- Pagos: `payment_items`, `payment_intents`, `processed_events`
- IA/Infra: `conversations`, `conversation_messages`, `audit_log`
- Tareas escolares: `tasks`, `task_submissions`
- Nivel inicial: `daily_journal_entries`, `daily_journal_photos`
- Notificaciones: `push_subscriptions`, `notification_log`

---

### US2 (P1) — Autenticación por perfil

**Como developer** quiero poder autenticarme como cualquier perfil del sistema (admin, docente, padre, alumno) usando el método correspondiente — **para poder probar cualquier journey sin configuración adicional.**

**Criterio de aceptación:**
- Magic link funciona para: `admin`, `director`, `teacher`, `secretary`, `preceptor`, `guardian` (app/web)
- OTP por teléfono funciona para: `guardian` (WhatsApp)
- El JWT resultante incluye `school_id` y `role` como claims
- Un usuario multi-escuela (docente en 2 colegios) puede seleccionar escuela al login
- `profiles` se crea / actualiza automáticamente en el primer login de cada usuario-escuela

---

### US3 (P1) — Estructura del proyecto y tipos compartidos

**Como developer** quiero clonar el repo, correr `pnpm install` y tener Next.js (web/API) y Expo (mobile) funcionando apuntando al mismo backend — **para poder desarrollar cualquier superficie sin fricción de configuración.**

**Criterio de aceptación:**
- Monorepo con pnpm workspaces: `apps/web` (Next.js App Router), `apps/mobile` (Expo), `packages/types`
- `packages/types` exporta los tipos TypeScript del schema (generados desde Drizzle o escritos a mano)
- `lib/db/` contiene conexión Drizzle + schema tipado + queries vacías por dominio
- `lib/supabase/` contiene solo clientes de Auth y Storage
- `lib/llm/` contiene la interfaz `LLMProvider` + adaptador Claude por defecto
- Variables de entorno documentadas en `.env.example` con todos los valores necesarios
- `pnpm dev` arranca web en `localhost:3000` y mobile con Expo Go

---

### US4 (P1) — CI/CD con security gate

**Como developer** quiero que todo PR a `main` ejecute automáticamente el pipeline de CI y bloquee el merge si `npm audit --audit-level=high` falla — **para que ninguna vulnerabilidad de seguridad llegue a producción sin ser detectada.**

**Criterio de aceptación:**
- GitHub Actions workflow en `.github/workflows/ci.yml`
- Steps: checkout → install → lint → type-check → `npm audit --audit-level=high` → build
- El `npm audit` es un **gate bloqueante** — si falla, el pipeline falla y el merge queda bloqueado
- PRs que toquen `app/api/`, RLS, webhooks tienen instrucción en la CI de correr `/vulnerability-scanner`
- El workflow corre en `push` a cualquier rama y en `pull_request` a `main`

---

### US5 (P1) — Seed de desarrollo

**Como developer** quiero correr `pnpm seed` y obtener una escuela ficticia "Escuela Demo" con usuarios de prueba para todos los perfiles — **para poder probar cualquier CDU sin datos reales de alumnos (cumplimiento del bloqueante DATA_REGULATION).**

**Criterio de aceptación:**
- Escuela ficticia: `id` fijo (para reproducibilidad), `slug: demo`, `plan: premium`
- Un usuario de prueba por perfil: `admin@demo.vujy.app`, `docente@demo.vujy.app`, `padre@demo.vujy.app`, `alumno@demo.vujy.app`
- Al menos 2 alumnos ficticios (Mati y Sofi) con: inscripción activa, sección, notas y asistencia de la semana actual
- Al menos 1 familia con 2 hijos (para testear multi-hijo)
- El seed **nunca** corre en producción (guard: `if (process.env.NODE_ENV !== 'development') throw`)
- Datos 100% ficticios — ningún nombre o DNI real

---

## Superficie

**Backend únicamente (Supabase + API routes base)**. Sin UI de usuario final. Sin canal WhatsApp.

## Dependencias

**Ninguna** — este entregable desbloquea todo lo demás.

## Entregable mínimo verificable

```bash
git clone repo && pnpm install && supabase db reset && pnpm seed && pnpm dev
# → App web en localhost:3000, login con magic link funciona, seed visible en DB
```
