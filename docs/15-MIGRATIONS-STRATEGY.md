# Vujy — Migrations Strategy

**Versión:** 1.0 | **Fecha:** 2026-03-05
**Relacionado con:** `docs/05-ARCHITECTURE.md` · `docs/09-MCP-DEFINITIONS.md` · `docs/13-CDU-DATASOURCE-SLA.md`

---

## 1. Decisiones

| Decisión | Elección | Motivo |
|----------|----------|--------|
| Herramienta | **Supabase CLI — SQL nativo** | Control total sobre RLS policies, triggers y funciones Postgres. Prisma/Drizzle abstraen demasiado para un esquema con RLS complejo. |
| ORM en el servidor | **ninguno en MVP** | Las tools MCP usan la librería `supabase-js` con `service_role` key. Las queries son simples y tipadas con los schemas JSON ya definidos. |
| Formato de archivos | `.sql` secuenciales en `supabase/migrations/` | Convención estándar de Supabase CLI |
| Multi-tenancy | `school_id UUID NOT NULL` en todas las tablas | Shared DB con RLS — nunca schemas separados por tenant en MVP |
| RLS approach | Función helper `get_my_school_id()` + claims de perfil | Más mantenible que JWT custom claims; no requiere refresh de token al cambiar rol |
| Admin / incidencias | `service_role key` en servidor + `postgres` role directo | Ver §6 |

---

## 2. Estructura de carpetas

```
supabase/
├── migrations/
│   ├── 20260305000001_initial_schema.sql        # tablas core
│   ├── 20260305000002_rls_policies.sql          # todas las políticas RLS
│   ├── 20260305000003_functions_triggers.sql    # funciones helpers y triggers
│   ├── 20260305000004_indexes.sql               # índices de performance
│   └── 20260305000005_seed_roles.sql            # datos base (roles, enum values)
├── seed/
│   └── dev_seed.sql                             # datos de desarrollo (nunca a producción)
└── config.toml                                  # configuración del proyecto Supabase
```

**Convención de naming:**
- `YYYYMMDDHHMMSS_descripcion_snake_case.sql`
- Una migración por tema — nunca mezclar schema + RLS en el mismo archivo
- Las migraciones son **append-only** — nunca modificar una migración ya aplicada; siempre crear una nueva

---

## 3. Esquema completo MVP

### Convenciones

- Todas las tablas tienen `school_id UUID NOT NULL REFERENCES schools(id)` excepto `schools`, `auth.users` y `audit_log`
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ` — solo en tablas mutables, actualizado por trigger
- Soft delete con `deleted_at TIMESTAMPTZ` en entidades principales — nunca `DELETE` físico en producción

---

### 3.1 Core — Tenants y usuarios

```sql
-- Escuelas (tenants)
CREATE TABLE schools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,           -- usado en subdomain / URLs
  plan          TEXT NOT NULL DEFAULT 'basico'  -- basico | premium | enterprise
                CHECK (plan IN ('basico', 'premium', 'enterprise')),
  settings      JSONB NOT NULL DEFAULT '{}',    -- config del tenant (working_hours, etc.)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- Extensión de auth.users — un perfil por usuario por escuela
-- Un usuario puede pertenecer a múltiples escuelas (ej: docente que trabaja en 2 colegios)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id     UUID NOT NULL REFERENCES schools(id),
  role          TEXT NOT NULL
                CHECK (role IN ('guardian', 'teacher', 'admin', 'director', 'secretary', 'preceptor', 'student')),
  full_name     TEXT NOT NULL,
  phone         TEXT,                           -- número de WhatsApp (sin +, sin espacios)
  whatsapp_optin        BOOLEAN NOT NULL DEFAULT false,
  photo_optin           BOOLEAN NOT NULL DEFAULT false,
  consent_registered    BOOLEAN NOT NULL DEFAULT false,
  consent_version       TEXT,                   -- versión del documento aceptado
  access_status TEXT NOT NULL DEFAULT 'active'
                CHECK (access_status IN ('active', 'revoked', 'pending_verification')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ,
  deleted_at    TIMESTAMPTZ,
  UNIQUE (id, school_id)                        -- un usuario puede tener un solo perfil por escuela
);

-- Función helper para RLS — devuelve el school_id del usuario autenticado
CREATE OR REPLACE FUNCTION get_my_school_id()
RETURNS UUID LANGUAGE SQL STABLE AS $$
  SELECT school_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Función helper para RLS — devuelve el rol del usuario autenticado
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT LANGUAGE SQL STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;
```

---

### 3.2 Familia y alumnos

```sql
-- Familias (unidad de pago — puede tener múltiples tutores y múltiples alumnos)
CREATE TABLE families (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  name          TEXT NOT NULL,                  -- "Familia García"
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ
);

-- Alumnos
CREATE TABLE students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  family_id     UUID NOT NULL REFERENCES families(id),
  full_name     TEXT NOT NULL,
  birth_date    DATE NOT NULL,
  level         TEXT NOT NULL
                CHECK (level IN ('inicial', 'primaria_1er_ciclo', 'primaria_2do_ciclo', 'secundaria')),
  photo_blocked BOOLEAN NOT NULL DEFAULT false, -- flag de privacidad de imagen (CDU-CROSS-005)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ,
  deleted_at    TIMESTAMPTZ
);

-- Relación tutor ↔ alumno con permisos granulares
CREATE TABLE guardian_students (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id               UUID NOT NULL REFERENCES schools(id),
  guardian_id             UUID NOT NULL REFERENCES profiles(id),
  student_id              UUID NOT NULL REFERENCES students(id),
  family_id               UUID NOT NULL REFERENCES families(id),
  relationship            TEXT,                 -- "madre", "padre", "abuelo", etc.
  can_authorize_absence   BOOLEAN NOT NULL DEFAULT true,
  can_make_payments       BOOLEAN NOT NULL DEFAULT true,
  can_sign_authorizations BOOLEAN NOT NULL DEFAULT true,
  is_primary_contact      BOOLEAN NOT NULL DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (guardian_id, student_id)
);
```

---

### 3.3 Estructura académica

```sql
-- Cursos / grados (3ro B, Sala Amarilla, etc.)
CREATE TABLE courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  name          TEXT NOT NULL,                  -- "3ro B"
  level         TEXT NOT NULL
                CHECK (level IN ('inicial', 'primaria_1er_ciclo', 'primaria_2do_ciclo', 'secundaria')),
  school_year   SMALLINT NOT NULL,              -- 2026
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Relación docente ↔ curso (un docente puede tener múltiples cursos y materias)
CREATE TABLE teacher_courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  teacher_id    UUID NOT NULL REFERENCES profiles(id),
  course_id     UUID NOT NULL REFERENCES courses(id),
  subject       TEXT,                           -- NULL = maestro de grado (nivel inicial/primaria)
  is_homeroom   BOOLEAN NOT NULL DEFAULT false, -- true = maestro/docente principal del grado
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, course_id, subject)
);

-- Inscripciones de alumnos en cursos
CREATE TABLE course_enrollments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  student_id    UUID NOT NULL REFERENCES students(id),
  course_id     UUID NOT NULL REFERENCES courses(id),
  school_year   SMALLINT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'withdrawn', 'promoted')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, school_year)
);
```

---

### 3.4 Asistencia y calificaciones

```sql
-- Registros de asistencia (una fila por alumno por día)
CREATE TABLE absences (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  student_id    UUID NOT NULL REFERENCES students(id),
  course_id     UUID NOT NULL REFERENCES courses(id),
  date          DATE NOT NULL,
  status        TEXT NOT NULL
                CHECK (status IN ('absent', 'late', 'early_departure')),
  justified     BOOLEAN NOT NULL DEFAULT false,
  reason        TEXT,
  notified_at   TIMESTAMPTZ,                   -- cuándo se notificó al tutor
  recorded_by   UUID NOT NULL REFERENCES profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, date, status)
);

-- Calificaciones
CREATE TABLE grade_records (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  student_id        UUID NOT NULL REFERENCES students(id),
  course_id         UUID NOT NULL REFERENCES courses(id),
  teacher_id        UUID NOT NULL REFERENCES profiles(id),
  subject           TEXT NOT NULL,
  evaluation_type   TEXT NOT NULL
                    CHECK (evaluation_type IN ('written_exam', 'oral', 'practical_work', 'project', 'participation')),
  grade             NUMERIC(4,2) CHECK (grade >= 1 AND grade <= 10),
  term              SMALLINT NOT NULL CHECK (term IN (1, 2, 3)),
  school_year       SMALLINT NOT NULL,
  date              DATE NOT NULL,
  comment           TEXT,
  published         BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  idempotency_key   TEXT UNIQUE                -- previene doble carga
);

-- Tareas
CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  course_id     UUID NOT NULL REFERENCES courses(id),
  teacher_id    UUID NOT NULL REFERENCES profiles(id),
  subject       TEXT,
  title         TEXT NOT NULL,
  description   TEXT,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date      DATE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Estado de tarea por alumno
CREATE TABLE task_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  task_id       UUID NOT NULL REFERENCES tasks(id),
  student_id    UUID NOT NULL REFERENCES students(id),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'submitted', 'late', 'excused')),
  submitted_at  TIMESTAMPTZ,
  UNIQUE (task_id, student_id)
);
```

---

### 3.5 Calendario y comunicados

```sql
-- Calendario escolar (evaluaciones, actos, feriados, etc.)
CREATE TABLE calendar_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  course_id     UUID,                           -- NULL = evento institucional (todos los cursos)
  title         TEXT NOT NULL,
  description   TEXT,
  event_type    TEXT NOT NULL
                CHECK (event_type IN ('exam', 'holiday', 'event', 'deadline', 'meeting', 'excursion', 'ceremony')),
  starts_at     TIMESTAMPTZ NOT NULL,
  ends_at       TIMESTAMPTZ,
  created_by    UUID NOT NULL REFERENCES profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comunicados
CREATE TABLE announcements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  sender_id       UUID NOT NULL REFERENCES profiles(id),
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  priority        TEXT NOT NULL DEFAULT 'normal'
                  CHECK (priority IN ('normal', 'urgent')),
  channels        TEXT[] NOT NULL DEFAULT '{app}',
  sent_at         TIMESTAMPTZ,
  idempotency_key TEXT UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Destinatarios de comunicados
CREATE TABLE announcement_recipients (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID NOT NULL REFERENCES schools(id),
  announcement_id  UUID NOT NULL REFERENCES announcements(id),
  course_id        UUID,                        -- NULL = toda la escuela
  recipient_type   TEXT NOT NULL
                   CHECK (recipient_type IN ('course', 'family', 'all_school'))
);

-- Lectura de comunicados por tutor
CREATE TABLE announcement_receipts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID NOT NULL REFERENCES schools(id),
  announcement_id  UUID NOT NULL REFERENCES announcements(id),
  guardian_id      UUID NOT NULL REFERENCES profiles(id),
  channel          TEXT NOT NULL CHECK (channel IN ('app', 'web', 'whatsapp')),
  read_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (announcement_id, guardian_id)
);
```

---

### 3.6 Finanzas

```sql
-- Conceptos / cuotas por familia
CREATE TABLE payment_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  family_id     UUID NOT NULL REFERENCES families(id),
  concept       TEXT NOT NULL,                  -- "Cuota marzo 2026"
  amount        NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  due_date      DATE NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'paid', 'overdue', 'in_plan')),
  school_year   SMALLINT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ
);

-- Pagos realizados
CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  family_id         UUID NOT NULL REFERENCES families(id),
  guardian_id       UUID NOT NULL REFERENCES profiles(id),
  total_amount      NUMERIC(12,2) NOT NULL,
  payment_method    TEXT NOT NULL,
  external_tx_id    TEXT,                       -- ID de transacción de Mercado Pago
  receipt_url       TEXT,
  status            TEXT NOT NULL DEFAULT 'completed'
                    CHECK (status IN ('completed', 'failed', 'refunded')),
  idempotency_key   TEXT NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ítems de pago cubiertos por cada pago
CREATE TABLE payment_item_payments (
  school_id       UUID NOT NULL REFERENCES schools(id),  -- tenant isolation
  payment_id      UUID NOT NULL REFERENCES payments(id),
  payment_item_id UUID NOT NULL REFERENCES payment_items(id),
  PRIMARY KEY (payment_id, payment_item_id)
);

-- Planes de pago para familias morosas
CREATE TABLE payment_plans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  family_id         UUID NOT NULL REFERENCES families(id),
  created_by        UUID NOT NULL REFERENCES profiles(id),
  total_amount      NUMERIC(12,2) NOT NULL,
  interest_rate_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'completed', 'defaulted', 'cancelled')),
  idempotency_key   TEXT NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payment_plan_installments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  plan_id         UUID NOT NULL REFERENCES payment_plans(id),
  installment_num SMALLINT NOT NULL,
  due_date        DATE NOT NULL,
  amount          NUMERIC(12,2) NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'paid', 'overdue'))
);
```

---

### 3.7 Observaciones pedagógicas

```sql
-- Observaciones pedagógicas (también indexadas en pgvector para RAG)
CREATE TABLE pedagogical_notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  student_id    UUID NOT NULL REFERENCES students(id),
  teacher_id    UUID NOT NULL REFERENCES profiles(id),
  course_id     UUID NOT NULL REFERENCES courses(id),
  area          TEXT NOT NULL
                CHECK (area IN ('cognitive', 'socioemotional', 'motor_skills', 'language',
                                'math', 'science', 'language_arts', 'general')),
  text          TEXT NOT NULL,
  embedding     vector(1536),                  -- pgvector embedding para RAG
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  idempotency_key TEXT UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 3.8 Legal y consentimientos

```sql
-- Consentimientos de tutores (CDU-CROSS-005)
CREATE TABLE consent_records (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  guardian_id       UUID NOT NULL REFERENCES profiles(id),
  document_version  TEXT NOT NULL,
  channel           TEXT NOT NULL CHECK (channel IN ('app', 'web', 'whatsapp', 'in_person')),
  ip_address        TEXT,
  terms_accepted              BOOLEAN NOT NULL,
  privacy_policy_accepted     BOOLEAN NOT NULL,
  whatsapp_communications     BOOLEAN NOT NULL DEFAULT false,
  educational_data_use        BOOLEAN NOT NULL DEFAULT false,
  photo_publication           BOOLEAN NOT NULL DEFAULT false,
  idempotency_key   TEXT NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
  -- append-only: nunca UPDATE ni DELETE
);

-- Solicitudes ARCO (CDU-CROSS-006)
CREATE TABLE arco_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  requester_id      UUID NOT NULL REFERENCES profiles(id),
  subject_guardian_id UUID NOT NULL REFERENCES profiles(id),
  request_type      TEXT NOT NULL
                    CHECK (request_type IN ('access', 'rectification', 'deletion', 'opposition')),
  status            TEXT NOT NULL DEFAULT 'received'
                    CHECK (status IN ('received', 'in_progress', 'resolved', 'rejected')),
  details           JSONB NOT NULL DEFAULT '{}',  -- campos a rectificar, scope de borrado, etc.
  sla_deadline      TIMESTAMPTZ NOT NULL,
  resolved_at       TIMESTAMPTZ,
  idempotency_key   TEXT NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ
);

-- Autorizaciones para firmar (CDU-PAD-005)
CREATE TABLE authorizations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  student_id      UUID NOT NULL REFERENCES students(id),
  calendar_event_id UUID REFERENCES calendar_events(id),
  title           TEXT NOT NULL,
  description     TEXT,
  requires_all_guardians BOOLEAN NOT NULL DEFAULT false,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'signed', 'rejected', 'expired')),
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE authorization_signatures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  authorization_id UUID NOT NULL REFERENCES authorizations(id),
  guardian_id     UUID NOT NULL REFERENCES profiles(id),
  signed_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  channel         TEXT NOT NULL CHECK (channel IN ('app', 'web')),
  UNIQUE (authorization_id, guardian_id)
);

-- Reinscripciones (CDU-PAD-007)
CREATE TABLE reenrollment_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  student_id      UUID NOT NULL REFERENCES students(id),
  family_id       UUID NOT NULL REFERENCES families(id),
  cycle           SMALLINT NOT NULL,            -- año del ciclo siguiente (2027)
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('confirmed', 'pending', 'no_response', 'withdrawn')),
  confirmed_by    UUID REFERENCES profiles(id),
  confirmed_at    TIMESTAMPTZ,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 3.9 Alertas y bienestar

```sql
-- Alertas institucionales (CDU-ADM-007)
CREATE TABLE school_alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  alert_type      TEXT NOT NULL
                  CHECK (alert_type IN ('attendance_drop', 'grade_risk', 'financial_delinquency',
                                        'dropout_risk', 'wellbeing_signal', 'operational',
                                        'reenrollment_risk', 'class_suspension')),
  severity        TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  subject_type    TEXT NOT NULL CHECK (subject_type IN ('student', 'family', 'grade', 'school')),
  subject_id      UUID,
  description     TEXT NOT NULL,
  suggested_action TEXT,
  acknowledged    BOOLEAN NOT NULL DEFAULT false,
  acknowledged_by UUID REFERENCES profiles(id),
  acknowledged_at TIMESTAMPTZ,
  triggered_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alertas de bienestar emocional — tabla separada por sensibilidad (CDU-ALU-016, CDU-DOC-016)
CREATE TABLE wellbeing_alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  student_id      UUID NOT NULL REFERENCES students(id),
  signal_type     TEXT NOT NULL
                  CHECK (signal_type IN ('self_reported_distress', 'teacher_observation',
                                         'behavioral_pattern', 'peer_report')),
  severity        TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description     TEXT NOT NULL,               -- nunca exponer contenido literal del chat
  escalated_to    UUID[] NOT NULL DEFAULT '{}', -- array de profile_ids notificados
  guardian_notified BOOLEAN NOT NULL DEFAULT false,
  protocol_reference TEXT,
  resolved_at     TIMESTAMPTZ,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 3.10 Features premium

```sql
-- Diarios visuales diarios — nivel inicial (CDU-PAD-017, CDU-DOC-012)
CREATE TABLE daily_journals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  course_id       UUID NOT NULL REFERENCES courses(id),
  teacher_id      UUID NOT NULL REFERENCES profiles(id),
  date            DATE NOT NULL,
  activities      JSONB NOT NULL DEFAULT '[]',  -- array de actividades con time_slot, subject, description
  emotional_checkin JSONB,                      -- { overall_mood, notes }
  teacher_narrative TEXT,
  published       BOOLEAN NOT NULL DEFAULT false,
  published_at    TIMESTAMPTZ,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ,
  UNIQUE (course_id, date)
);

-- Hitos de portfolio docente (CDU-DOC-017)
CREATE TABLE teacher_portfolio_milestones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  teacher_id      UUID NOT NULL REFERENCES profiles(id),
  course_id       UUID REFERENCES courses(id),
  milestone_type  TEXT NOT NULL,               -- "100pct_submissions", "student_recovered", etc.
  description     TEXT NOT NULL,
  metric_context  JSONB,                       -- datos de contexto del hito
  notified        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Modo corresponsal de eventos (CDU-CROSS-007)
CREATE TABLE event_modes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id             UUID NOT NULL REFERENCES schools(id),
  calendar_event_id     UUID NOT NULL REFERENCES calendar_events(id),
  correspondent_ids     UUID[] NOT NULL,
  photo_blocked         BOOLEAN NOT NULL DEFAULT false,
  active_from           TIMESTAMPTZ NOT NULL,
  active_until          TIMESTAMPTZ NOT NULL,
  target_grade_ids      UUID[],
  all_school            BOOLEAN NOT NULL DEFAULT false,
  status                TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'closed')),
  idempotency_key       TEXT NOT NULL UNIQUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (calendar_event_id)
);

CREATE TABLE event_updates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  event_mode_id   UUID NOT NULL REFERENCES event_modes(id),
  author_id       UUID NOT NULL REFERENCES profiles(id),
  text            TEXT NOT NULL,
  photo_urls      TEXT[] DEFAULT '{}',
  update_type     TEXT NOT NULL DEFAULT 'text'
                  CHECK (update_type IN ('text', 'photo', 'milestone')),
  idempotency_key TEXT NOT NULL UNIQUE,
  published_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 3.11 Audit log (append-only)

```sql
-- Log inmutable de acciones críticas — nunca UPDATE ni DELETE
CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID,                         -- NULL para acciones de plataforma
  actor_user_id   UUID,                         -- NULL para acciones del sistema
  actor_role      TEXT,
  action          TEXT NOT NULL,                -- "revoke_guardian_access", "arco_deletion_approved", etc.
  target_type     TEXT,                         -- "guardian", "student", "payment", etc.
  target_id       UUID,
  input_hash      TEXT,                         -- hash del payload de entrada
  result_status   TEXT NOT NULL CHECK (result_status IN ('success', 'failure')),
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Revocar permisos de UPDATE y DELETE en audit_log para todos los roles excepto postgres
REVOKE UPDATE, DELETE ON audit_log FROM authenticated, anon, service_role;
```

---

## 4. Row Level Security

### Principio base

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE schools               ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE families              ENABLE ROW LEVEL SECURITY;
ALTER TABLE students              ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_students     ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_courses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences              ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_records         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_item_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedagogical_notes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records       ENABLE ROW LEVEL SECURITY;
ALTER TABLE arco_requests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorizations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_alerts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellbeing_alerts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_journals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reenrollment_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log             ENABLE ROW LEVEL SECURITY;
```

### Políticas por tabla (críticas)

```sql
-- ─────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────

-- Cada usuario ve solo su propio perfil
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Admin y directivo ven todos los perfiles de su escuela
CREATE POLICY "profiles_select_school_admin" ON profiles
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() IN ('admin', 'director', 'secretary')
  );

-- ─────────────────────────────────────────────
-- STUDENTS
-- ─────────────────────────────────────────────

-- Tutor ve solo sus alumnos vinculados
CREATE POLICY "students_select_guardian" ON students
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() = 'guardian'
    AND id IN (
      SELECT student_id FROM guardian_students
      WHERE guardian_id = auth.uid()
    )
  );

-- Docente ve los alumnos de sus cursos
CREATE POLICY "students_select_teacher" ON students
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() = 'teacher'
    AND id IN (
      SELECT ce.student_id FROM course_enrollments ce
      JOIN teacher_courses tc ON tc.course_id = ce.course_id
      WHERE tc.teacher_id = auth.uid()
    )
  );

-- Admin/Directivo/Secretaria ven todos los alumnos de la escuela
CREATE POLICY "students_select_admin" ON students
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() IN ('admin', 'director', 'secretary', 'preceptor')
  );

-- Alumno ve solo su propio perfil
CREATE POLICY "students_select_self" ON students
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() = 'student'
    AND id IN (
      SELECT id FROM profiles WHERE id = auth.uid()
      -- join a través de la tabla students ↔ profiles vía auth.uid
    )
  );

-- ─────────────────────────────────────────────
-- GRADE_RECORDS
-- ─────────────────────────────────────────────

-- Tutor ve notas solo de sus alumnos vinculados, y solo si están publicadas
CREATE POLICY "grades_select_guardian" ON grade_records
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() = 'guardian'
    AND published = true
    AND student_id IN (
      SELECT student_id FROM guardian_students WHERE guardian_id = auth.uid()
    )
  );

-- Docente ve y puede insertar/actualizar notas de sus cursos
CREATE POLICY "grades_select_teacher" ON grade_records
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() = 'teacher'
    AND course_id IN (
      SELECT course_id FROM teacher_courses WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY "grades_insert_teacher" ON grade_records
  FOR INSERT WITH CHECK (
    school_id = get_my_school_id()
    AND get_my_role() = 'teacher'
    AND teacher_id = auth.uid()
    AND course_id IN (
      SELECT course_id FROM teacher_courses WHERE teacher_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- PAYMENT_ITEMS y PAYMENTS
-- ─────────────────────────────────────────────

-- Tutor ve solo las cuotas de su familia, y solo si tiene permiso de pagos
CREATE POLICY "payment_items_select_guardian" ON payment_items
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() = 'guardian'
    AND family_id IN (
      SELECT family_id FROM guardian_students
      WHERE guardian_id = auth.uid() AND can_make_payments = true
    )
  );

-- Guardian ve solo el join de sus propios pagos e ítems
CREATE POLICY "payment_item_payments_select_guardian" ON payment_item_payments
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND payment_id IN (
      SELECT id FROM payments
      WHERE school_id = get_my_school_id()
      AND family_id IN (
        SELECT family_id FROM guardian_students
        WHERE guardian_id = auth.uid() AND can_make_payments = true
      )
    )
  );

-- Admin/director ven todos los registros de su escuela
CREATE POLICY "payment_item_payments_select_admin" ON payment_item_payments
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() IN ('admin', 'director', 'secretary')
  );

-- ─────────────────────────────────────────────
-- WELLBEING_ALERTS — acceso extremadamente restringido
-- ─────────────────────────────────────────────

-- Solo admin, director y el docente que generó la alerta
CREATE POLICY "wellbeing_select_restricted" ON wellbeing_alerts
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() IN ('admin', 'director')
  );

-- Tutores NUNCA ven wellbeing_alerts directamente — se notifica por canal controlado

-- ─────────────────────────────────────────────
-- AUDIT_LOG — solo lectura para admin/director
-- ─────────────────────────────────────────────

CREATE POLICY "audit_log_select_admin" ON audit_log
  FOR SELECT USING (
    school_id = get_my_school_id()
    AND get_my_role() IN ('admin', 'director')
  );

-- INSERT permitido solo para service_role (desde el servidor)
CREATE POLICY "audit_log_insert_service" ON audit_log
  FOR INSERT WITH CHECK (true); -- el control real es que solo el backend usa service_role
```

---

## 5. Índices de performance

```sql
-- school_id en todas las tablas es el filtro más frecuente
CREATE INDEX idx_students_school_id         ON students(school_id);
CREATE INDEX idx_profiles_school_id         ON profiles(school_id);
CREATE INDEX idx_absences_school_date       ON absences(school_id, date);
CREATE INDEX idx_absences_student_id        ON absences(student_id);
CREATE INDEX idx_grade_records_student      ON grade_records(student_id, school_year, term);
CREATE INDEX idx_payment_items_family       ON payment_items(family_id, status);
CREATE INDEX idx_announcements_school       ON announcements(school_id, sent_at DESC);
CREATE INDEX idx_guardian_students_guardian ON guardian_students(guardian_id);
CREATE INDEX idx_guardian_students_student  ON guardian_students(student_id);
CREATE INDEX idx_teacher_courses_teacher    ON teacher_courses(teacher_id);
CREATE INDEX idx_course_enrollments_student ON course_enrollments(student_id, school_year);
CREATE INDEX idx_school_alerts_school       ON school_alerts(school_id, acknowledged, triggered_at DESC);

-- pgvector para RAG sobre observaciones pedagógicas
CREATE INDEX idx_pedagogical_notes_embedding ON pedagogical_notes
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

## 6. Acceso administrativo para incidencias

### Opciones disponibles

| Herramienta | Cuándo usarla | Bypasea RLS |
|-------------|---------------|-------------|
| **Supabase Studio** | Incidencias rápidas, queries ad-hoc | ✅ Sí (usa rol `postgres`) |
| **service_role key** (backend) | Scripts de diagnóstico programáticos | ✅ Sí |
| **`SET LOCAL row_security = off`** | Sesión Postgres directa temporal | ✅ Sí |
| `anon key` / JWT de usuario | Nunca para incidencias | ❌ No (respeta RLS) |

### Buenas prácticas

```sql
-- En una sesión directa de Postgres (psql o Studio), para una query de diagnóstico:
SET LOCAL row_security = off;
SELECT * FROM absences WHERE school_id = 'sch_san_martin' AND date = '2026-03-05';
-- row_security vuelve a ON al terminar la transacción / sesión
```

```typescript
// En scripts de backend usando service_role key:
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // nunca exponer al cliente
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Esta query bypasea RLS
const { data } = await supabaseAdmin
  .from('absences')
  .select('*')
  .eq('school_id', 'sch_san_martin');
```

### Regla operativa

Toda query administrativa que bypasee RLS en producción **debe quedar registrada** en `audit_log` con `actor_user_id` del admin que la ejecutó. Los scripts de diagnóstico deben insertarlo manualmente si no pasan por las tools MCP.

---

## 7. Estrategia de entornos

| Entorno | Base de datos | Migraciones | Datos |
|---------|---------------|-------------|-------|
| `development` | Supabase local (`supabase start`) | Automáticas al hacer `supabase db reset` | `seed/dev_seed.sql` |
| `staging` | Proyecto Supabase dedicado | Manual: `supabase db push` | Copia anonimizada de producción |
| `production` | Proyecto Supabase principal | Manual con revisión: `supabase db push` | Datos reales |

```bash
# Flujo de una migración nueva:
supabase migration new add_campo_nuevo_a_students  # crea el archivo
# ... editar el SQL ...
supabase db reset       # aplica en local (borra y recrea con seed)
supabase db push        # aplica en staging/producción
```

**Regla:** nunca correr `supabase db reset` en producción. Solo `supabase db push` (aplica solo las migraciones pendientes).

---

## 8. Seed de desarrollo

El archivo `supabase/seed/dev_seed.sql` incluye:

```
- 1 escuela: "Colegio San Martín" (school_id fijo para tests)
- 3 cursos: Sala Amarilla (inicial), 3ro B (primaria), 2do año A (secundaria)
- 5 alumnos distribuidos entre los 3 cursos
- 3 tutores vinculados a los alumnos (uno con 2 hijos)
- 2 docentes (uno de primaria, uno de secundaria)
- 1 admin
- Consentimientos registrados para todos los tutores (consent_registered = true)
- 10 cuotas: 8 al día, 2 vencidas (para testear morosidad)
- 5 comunicados enviados
- 15 registros de asistencia del mes actual
- 3 notas cargadas en el trimestre actual
```

Este seed permite probar todos los CDUs P0/P1 del MVP sin datos reales.

---

## 9. Checklist pre-lanzamiento

- [ ] Todas las tablas tienen `ENABLE ROW LEVEL SECURITY`
- [ ] Todas las tablas tienen `school_id` con FK a `schools`
- [ ] Todas las políticas de RLS están testeadas con los casos E2E de `docs/.tmp-mcp-insumos-7-8-10.md §Insumo 10`
- [ ] `audit_log` tiene `REVOKE UPDATE, DELETE` para todos los roles excepto `postgres`
- [ ] `service_role key` solo existe en variables de entorno del servidor (nunca en el cliente)
- [ ] `pedagogical_notes.embedding` tiene índice `ivfflat` configurado
- [ ] `supabase db push` testeado en staging antes de producción
- [ ] Seed de desarrollo ejecutable en `< 5 segundos`

---

*Vujy · vujy.app — Migrations Strategy v1.0 · Marzo 2026*
