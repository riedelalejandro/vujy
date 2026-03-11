# Tasks: 001 — Foundation

**Input**: `specs/001-foundation/spec.md` · `specs/001-foundation/plan.md`
**Rama:** `001-foundation`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede correr en paralelo (archivos distintos, sin dependencias)
- **[Story]**: Historia de usuario a la que pertenece la tarea
- Tests no solicitados — no incluidos.

---

## Phase 1: Setup (Monorepo Init)

**Objetivo:** Estructura de repositorio mínima para que `pnpm install` funcione.

- [x] T001 Inicializar monorepo pnpm — crear `pnpm-workspace.yaml`, `package.json` raíz con devDependencies compartidas (typescript, eslint, prettier) y `turbo.json` (o `nx.json`) si se usa orquestador
- [x] T002 [P] Configurar TypeScript base compartido en `tsconfig.base.json` (target ES2022, strict mode, path aliases `@vujy/*`)
- [x] T003 [P] Configurar ESLint raíz con `@typescript-eslint` y reglas de seguridad básicas en `eslint.config.mjs`
- [x] T004 [P] Configurar Prettier raíz en `.prettierrc` y `.prettierignore`

---

## Phase 2: Foundational — Estructura del Proyecto (US3)

**Objetivo:** Monorepo completo con todas las carpetas y librerías base. Bloquea US1, US2, US4 y US5.

**⚠️ CRÍTICO:** Ninguna tarea de historia de usuario puede comenzar hasta completar esta fase.

- [x] T005 Crear `apps/web` — Next.js 15 App Router con TypeScript. Archivos: `apps/web/package.json`, `apps/web/next.config.ts`, `apps/web/tsconfig.json`. Incluir dependencias: `next`, `react`, `react-dom`, `@supabase/ssr`, `@supabase/supabase-js`, `drizzle-orm`, `postgres`, `@anthropic-ai/sdk`, `zod`
- [x] T006 [P] Crear `apps/mobile` — Expo SDK con expo-router. Archivos: `apps/mobile/package.json`, `apps/mobile/app.json`, `apps/mobile/tsconfig.json`. Incluir dependencias: `expo`, `expo-router`, `react-native`, `expo-notifications`
- [x] T007 [P] Crear `packages/types` — paquete compartido. Archivos: `packages/types/package.json`, `packages/types/src/index.ts` (barrel export vacío por ahora), `packages/types/tsconfig.json`
- [x] T008 Crear estructura `lib/db/` en `apps/web` — conexión Drizzle + schema vacío + directorio de queries por dominio. Archivos: `apps/web/lib/db/index.ts` (conexión con `DATABASE_URL`), `apps/web/lib/db/schema.ts` (esqueleto vacío), `apps/web/lib/db/queries/.gitkeep`
- [x] T009 [P] Crear `lib/supabase/` en `apps/web` — solo clientes de Auth y Storage. Archivos: `apps/web/lib/supabase/client.ts` (browser client con `createBrowserClient`), `apps/web/lib/supabase/server.ts` (server client con cookies de Next.js)
- [x] T010 [P] Crear `lib/llm/` en `apps/web` — interfaz `LLMProvider` + adaptador Claude. Archivos: `apps/web/lib/llm/provider.ts` (interfaz TypeScript con `chat()`, `stream()`, `formatTools()`), `apps/web/lib/llm/adapters/claude.ts` (implementación con `@anthropic-ai/sdk`), `apps/web/lib/llm/index.ts` (factory que lee `LLM_PROVIDER` de env)
- [x] T011 [P] Crear esqueleto de rutas API en `apps/web/app/api/` — directorios vacíos con `route.ts` placeholder. Archivos: `apps/web/app/api/health/route.ts` (único endpoint real en esta fase — responde `{ status: "ok" }`), `apps/web/app/api/webhooks/whatsapp/.gitkeep`, `apps/web/app/api/ai/chat/.gitkeep`
- [x] T012 [P] Crear `.env.example` raíz y en `apps/web` con todas las variables documentadas (ver `specs/001-foundation/plan.md §Variables de entorno`). Incluir comentarios explicativos por variable. Confirmar que `.env.local` y `.env` están en `.gitignore`
- [x] T013 Crear directorio `supabase/` con `config.toml`, `migrations/` y `seed/`. Archivo `supabase/config.toml` configurado para proyecto local (project_id, ports). Directorio `supabase/migrations/` vacío. Directorio `supabase/seed/` vacío.

**Checkpoint:** `pnpm install` sin errores. `pnpm build` (solo apps/web) compila sin errores de TypeScript.

---

## Phase 3: US1 — Schema completo con multi-tenancy y RLS

**Objetivo:** `supabase db reset` produce todas las tablas, funciones y políticas sin errores.

**Independent Test:** Correr `supabase db reset` y ejecutar una query cross-tenant que devuelve 0 filas cuando se autentica como escuela A consultando datos de escuela B.

- [x] T014 [US1] Escribir `supabase/migrations/20260305000001_initial_schema.sql` — tablas Core (en orden de dependencias): `schools`, `profiles` (extensión de `auth.users` con `role`, `school_id`, `consent_registered`, `access_status`, `external_id UUID`), `academic_years`, `sections`, `students` (con `external_id UUID`), `enrollments`. Convenciones: `id UUID DEFAULT gen_random_uuid()`, `school_id UUID NOT NULL REFERENCES schools(id)`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `deleted_at TIMESTAMPTZ` en entidades principales, `updated_at TIMESTAMPTZ` en tablas mutables
- [x] T015 [US1] Extender `supabase/migrations/20260305000001_initial_schema.sql` — tablas Académicas: `subjects`, `grade_records`, `attendance_records`, `pedagogical_notes` (con columna `embedding vector(1536)` para pgvector), `wellbeing_alerts`
- [x] T016 [US1] Extender `supabase/migrations/20260305000001_initial_schema.sql` — tablas de Comunicación + Pagos + Infraestructura: `announcements`, `messages`, `consents`, `whatsapp_sessions`, `payment_items`, `payment_intents`, `processed_events` (idempotencia), `conversations`, `conversation_messages`, `audit_log` (append-only, sin `school_id` — registra todos los accesos), `tasks`, `task_submissions`, `daily_journal_entries`, `daily_journal_photos`, `push_subscriptions`, `notification_log`
- [x] T017 [US1] Escribir `supabase/migrations/20260305000002_rls_policies.sql` — para cada tabla con `school_id`: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + `CREATE POLICY "tenant_isolation" ON ... USING (school_id = get_my_school_id())`. Políticas adicionales por rol donde aplique (ej: `grade_records` visible a `guardian` solo si el alumno es su hijo)
- [x] T018 [US1] Escribir `supabase/migrations/20260305000003_functions_triggers.sql` — función `get_my_school_id()` (Lee JWT claim `school_id` con fallback a `profiles`), función `set_updated_at()` + triggers de `updated_at` en todas las tablas con esa columna, habilitar extensión `pgvector` (`CREATE EXTENSION IF NOT EXISTS vector`)
- [x] T019 [US1] Escribir `supabase/migrations/20260305000004_indexes.sql` — índices en: `profiles(school_id)`, `students(school_id)`, `enrollments(student_id, academic_year_id)`, `grade_records(student_id, subject_id)`, `attendance_records(student_id, date)`, `messages(school_id, created_at)`, `audit_log(created_at)`, `pedagogical_notes` HNSW index para pgvector (`USING hnsw (embedding vector_cosine_ops)`)
- [x] T020 [US1] Escribir `supabase/migrations/20260305000005_seed_roles.sql` — insertar roles base, enum values de plan (`basico`, `premium`, `enterprise`) y cualquier dato de referencia que el sistema necesita antes del seed de desarrollo
- [x] T021 [US1] Escribir `apps/web/lib/db/schema.ts` — schema Drizzle que replica todas las tablas SQL. Usar `pgTable`, tipos Drizzle (`uuid`, `text`, `timestamp`, `boolean`, `jsonb`, `vector`). Exportar tipos `InferSelectModel` + `InferInsertModel` por tabla
- [x] T022 [US1] Exportar tipos compartidos en `packages/types/src/database.ts` — re-exportar los tipos de `apps/web/lib/db/schema.ts` que son necesarios en mobile (ej: `Student`, `Profile`, `School`, `GradeRecord`, `AttendanceRecord`). Actualizar `packages/types/src/index.ts`

**Checkpoint:** `supabase db reset` sin errores. Las 25+ tablas existen en el schema local. Una query con JWT de escuela A no retorna datos de escuela B.

---

## Phase 4: US2 — Autenticación por perfil

**Objetivo:** Login funciona para todos los perfiles. JWT incluye `school_id` y `role`.

**Independent Test:** Hacer login con `admin@demo.vujy.app` via magic link → acceder a `/dashboard` → verificar que el JWT tiene `school_id` y `role` correctos en las dev tools.

- [x] T023 [US2] Configurar `supabase/config.toml` — habilitar magic link (`[auth] enable_email_otp = true`), OTP por SMS, JWT customization para incluir claims custom. Configurar `auth.email.otp_exp` y `auth.sms.otp_exp`
- [x] T024 [US2] Crear middleware Next.js para proteger rutas — `apps/web/middleware.ts`. Usar `@supabase/ssr` para verificar sesión en todas las rutas salvo `/(auth)/**` y `/api/auth/**`. Redirigir a `/login` si no hay sesión
- [x] T025 [US2] Crear página de login con magic link — `apps/web/app/(auth)/login/page.tsx`. Formulario de email, llama a `supabase.auth.signInWithOtp({ email })`. Mensaje de confirmación post-submit
- [x] T026 [US2] Crear callback de magic link — `apps/web/app/auth/callback/route.ts`. Intercambia el código por sesión (`supabase.auth.exchangeCodeForSession`). Si el usuario pertenece a múltiples escuelas → redirigir a `/select-school`. Si pertenece a una sola → redirigir a `/dashboard`
- [x] T027 [US2] Crear página de selección de escuela para usuarios multi-escuela — `apps/web/app/(auth)/select-school/page.tsx`. Lista las escuelas del usuario (query a `profiles` por `auth.uid()`). Al seleccionar, llama al endpoint `/api/auth/session` que setea `school_id` en el JWT
- [x] T028 [US2] Crear API route que inyecta `school_id` y `role` en el JWT de sesión — `apps/web/app/api/auth/session/route.ts`. Recibe `school_id` elegido, valida que el usuario tenga un `profile` en esa escuela, actualiza el JWT con los claims. Usar `supabase.auth.admin.updateUserById` con custom claims o Supabase `setSession` según el approach disponible
- [x] T029 [US2] Implementar endpoint de health check — `apps/web/app/api/health/route.ts`. Responde `{ status: "ok", db: "connected", timestamp: ISO }`. Verifica conexión a DB con query `SELECT 1`. Usar en CI para smoke test post-deploy

**Checkpoint:** `pnpm dev` → login con magic link → JWT con `school_id` y `role` → middleware protege `/dashboard` → `/api/health` responde 200.

---

## Phase 5: US4 — CI/CD con Security Gate

**Objetivo:** Todo PR a `main` corre el pipeline y bloquea si `npm audit --audit-level=high` falla.

**Independent Test:** Abrir un PR de prueba → verificar que el workflow corre en GitHub Actions → verificar que el step de `npm audit` es bloqueante.

- [x] T030 [US4] Crear GitHub Actions CI workflow — `.github/workflows/ci.yml`. Steps: checkout → pnpm install → lint (`pnpm lint`) → type-check (`pnpm tsc --noEmit`) → audit de seguridad (`npm audit --audit-level=high` en cada workspace) → build (`pnpm build`). Trigger en `push` a cualquier rama y `pull_request` a `main`. Añadir comentario en el YAML: "PRs que toquen app/api/, RLS o webhooks deben correr /vulnerability-scanner antes del merge"

**Checkpoint:** El workflow existe y su sintaxis YAML es válida (`act --list` o push a la rama).

---

## Phase 6: US5 — Seed de Desarrollo

**Objetivo:** `pnpm seed` carga datos ficticios reproducibles. Nunca datos reales.

**Independent Test:** Correr `supabase db reset && pnpm seed` → verificar que "Escuela Demo" existe en la tabla `schools` y los 2 alumnos (Mati, Sofi) tienen `grade_records` y `attendance_records` en la semana actual.

- [x] T031 [US5] Escribir `supabase/seed/dev_seed.sql` — insertar: escuela ficticia ("Escuela Demo", slug: `demo`, id: UUID fijo para reproducibilidad), 4 usuarios en `auth.users` (`admin@demo.vujy.app`, `docente@demo.vujy.app`, `padre@demo.vujy.app`, `alumno@demo.vujy.app`), sus `profiles` correspondientes, 1 `academic_year` activo, 2 `sections` (4to B, 5to A), 2 `students` (Matías García, Sofía López — datos 100% ficticios, sin DNI real), `enrollments` activos, 1 familia con 2 hijos para testear multi-hijo, `grade_records` de la semana actual, `attendance_records` de la semana actual con 1 ausencia justificada. Guard al inicio: `DO $$ BEGIN IF current_setting('app.seed_env', true) != 'development' THEN RAISE EXCEPTION 'Seed solo puede correr en entorno de desarrollo'; END IF; END $$;`
- [x] T032 [US5] Crear script `pnpm seed` — `apps/web/scripts/seed.ts`. Carga `supabase/seed/dev_seed.sql` usando `supabase db seed` o ejecutando el SQL directamente. Guard en TypeScript: `if (process.env.NODE_ENV !== 'development') throw new Error('Seed solo en desarrollo')`. Agregar script `"seed": "tsx scripts/seed.ts"` al `package.json` de `apps/web`

**Checkpoint:** `supabase db reset && pnpm seed` completa sin errores. Las 4 cuentas de prueba pueden hacer login via magic link.

---

## Phase Final: Polish & Cross-Cutting

- [x] T033 [P] Documentar setup local en `README.md` raíz — secciones: Prerequisites, Quick Start (`git clone → pnpm install → supabase db reset → pnpm seed → pnpm dev`), Variables de entorno, Estructura de carpetas (referencia a `specs/001-foundation/plan.md`)
- [x] T034 Smoke test end-to-end del entregable: clonar repo fresh → seguir README → verificar que el health check responde, el seed cargó datos y el login con magic link funciona. Corregir cualquier fricción de setup encontrada

---

## Dependencies & Execution Order

### Dependencias entre fases

- **Phase 1 (Setup):** Sin dependencias — arrancar inmediatamente
- **Phase 2 (Foundational/US3):** Depende de Phase 1
- **Phase 3 (US1 Schema):** Depende de Phase 2 (necesita `supabase/` creado) ← **bloquea US2 y US5**
- **Phase 4 (US2 Auth):** Depende de Phase 3 (necesita tabla `profiles` y `schools`)
- **Phase 5 (US4 CI/CD):** Depende de Phase 2 (necesita `package.json` con scripts de lint/build) — puede ejecutarse en paralelo con US1
- **Phase 6 (US5 Seed):** Depende de Phase 3 (necesita todas las tablas creadas)
- **Phase Final:** Depende de todas las fases previas

### Dependencias entre historias de usuario

- **US3 (estructura):** Primera — bloquea todo
- **US1 (schema):** Después de US3 — bloquea US2 y US5
- **US2 (auth):** Después de US1 — depende de `profiles` table
- **US4 (CI/CD):** Después de US3 — puede ir en paralelo con US1
- **US5 (seed):** Después de US1 — puede ir en paralelo con US2

### Oportunidades de paralelismo

- T002, T003, T004 pueden correr en paralelo (configuraciones de herramientas)
- T006, T007 pueden correr en paralelo con T005 (workspace mobile y types, independientes de web)
- T009, T010, T011, T012 pueden correr en paralelo (librerías distintas dentro de apps/web)
- T015, T016 pueden extenderse en paralelo al T014 (mismo archivo — secuencial por contenido)
- T030 (CI/CD) puede empezar en paralelo con US1 una vez Phase 2 completa
- T031, T032 pueden empezar en paralelo con US2 (auth) una vez US1 completa

---

## Parallel Example: Phase 2 (Foundational)

```
# Después de T005 (apps/web creado), arrancar en paralelo:
T006 — apps/mobile scaffold
T007 — packages/types scaffold
T009 — lib/supabase/ client + server
T010 — lib/llm/ provider + claude adapter
T011 — app/api/ skeleton
T012 — .env.example
T013 — supabase/config.toml
```

---

## Implementation Strategy

### MVP de Foundation (Todo US3 + US1 + US2)

1. Phase 1: Setup (T001-T004) — ~1h
2. Phase 2: Foundational/US3 (T005-T013) — ~2-3h
3. Phase 3: US1 Schema (T014-T022) — ~3-4h
4. Phase 4: US2 Auth (T023-T029) — ~2-3h
5. **STOP y validar:** `supabase db reset && pnpm dev` → login funciona → JWT correcto
6. Continuar con US4 y US5

### Orden completo

1. Setup → Foundational → Schema → Auth → CI/CD → Seed → Polish
2. Cada phase tiene un checkpoint verificable antes de continuar

---

## Notes

- `[P]` = archivos distintos, sin dependencias entre sí
- US3 es la phase foundational porque establece dónde va todo el código
- US1 es bloqueante para US2 y US5 (dependen de las tablas)
- US4 (CI/CD) puede hacerse en paralelo con US1 una vez el workspace existe
- El seed NUNCA se ejecuta en producción — guard tanto en SQL como en TypeScript
- `external_id UUID` debe existir desde el inicio en `students` y `profiles` (nullable) para permitir future SIS sync sin migración (ver `docs/05-ARCHITECTURE.md §10`)
- Ninguna query de negocio usa el cliente Supabase directamente — todo pasa por `lib/db/` (Drizzle)
- `lib/supabase/` solo para Auth y Storage
