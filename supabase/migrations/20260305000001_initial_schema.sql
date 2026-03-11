-- =============================================================================
-- Vujy — Initial Schema
-- Tablas core del MVP en orden de dependencias (sin FK forward references)
-- Convenciones:
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid()
--   school_id UUID NOT NULL REFERENCES schools(id) — en TODAS las tablas excepto:
--     schools, audit_log (no school_id FK — denormalizado intencional)
--   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
--   deleted_at TIMESTAMPTZ — soft delete en entidades principales
--   updated_at TIMESTAMPTZ — solo en tablas mutables, actualizado por trigger
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ---------------------------------------------------------------------------
-- Core: Tenants
-- ---------------------------------------------------------------------------

CREATE TABLE schools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  plan          TEXT NOT NULL DEFAULT 'basico'
                CHECK (plan IN ('basico', 'premium', 'enterprise')),
  settings      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Core: Profiles (extensión de auth.users)
-- Un usuario puede pertenecer a múltiples escuelas (ej: docente en 2 colegios)
-- ---------------------------------------------------------------------------

CREATE TABLE profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id             UUID NOT NULL REFERENCES schools(id),
  role                  TEXT NOT NULL
                        CHECK (role IN ('guardian', 'teacher', 'admin', 'director',
                                        'secretary', 'preceptor', 'student')),
  full_name             TEXT NOT NULL,
  phone                 TEXT,
  whatsapp_optin        BOOLEAN NOT NULL DEFAULT false,
  photo_optin           BOOLEAN NOT NULL DEFAULT false,
  consent_registered    BOOLEAN NOT NULL DEFAULT false,
  consent_version       TEXT,
  access_status         TEXT NOT NULL DEFAULT 'active'
                        CHECK (access_status IN ('active', 'revoked', 'pending_verification')),
  external_id           UUID,          -- nullable — para futura sincronización con SIS (§10)
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ,
  deleted_at            TIMESTAMPTZ,
  UNIQUE (id, school_id)               -- un usuario, un perfil por escuela
);

-- ---------------------------------------------------------------------------
-- Core: Academic structure
-- ---------------------------------------------------------------------------

CREATE TABLE academic_years (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  name        TEXT NOT NULL,           -- ej: "2026"
  start_date  TIMESTAMPTZ NOT NULL,
  end_date    TIMESTAMPTZ NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  academic_year_id  UUID NOT NULL REFERENCES academic_years(id),
  name              TEXT NOT NULL,     -- ej: "4to B"
  grade             INTEGER NOT NULL,  -- nivel numérico
  level             TEXT NOT NULL
                    CHECK (level IN ('inicial', 'primaria', 'secundaria')),
  teacher_id        UUID REFERENCES profiles(id),   -- homeroom teacher
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Academic: Students & Enrollments
-- ---------------------------------------------------------------------------

CREATE TABLE students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  birth_date  TIMESTAMPTZ,
  external_id UUID,                    -- nullable — para futura sincronización con SIS (§10)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ,
  deleted_at  TIMESTAMPTZ
);

CREATE TABLE enrollments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  student_id        UUID NOT NULL REFERENCES students(id),
  section_id        UUID NOT NULL REFERENCES sections(id),
  academic_year_id  UUID NOT NULL REFERENCES academic_years(id),
  status            TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'transferred', 'withdrawn')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ
);

-- Guardian ↔ Student (many-to-many)
CREATE TABLE guardian_students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  guardian_id   UUID NOT NULL REFERENCES profiles(id),
  student_id    UUID NOT NULL REFERENCES students(id),
  relationship  TEXT NOT NULL DEFAULT 'parent',  -- parent | tutor | other
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (guardian_id, student_id)
);

CREATE TABLE subjects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  name        TEXT NOT NULL,
  level       TEXT NOT NULL CHECK (level IN ('inicial', 'primaria', 'secundaria')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE grade_records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  student_id  UUID NOT NULL REFERENCES students(id),
  subject_id  UUID NOT NULL REFERENCES subjects(id),
  teacher_id  UUID NOT NULL REFERENCES profiles(id),
  score       DECIMAL(5,2),
  period      TEXT NOT NULL,           -- ej: "trimestre_1"
  notes       TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

CREATE TABLE attendance_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  student_id      UUID NOT NULL REFERENCES students(id),
  section_id      UUID NOT NULL REFERENCES sections(id),
  date            TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL
                  CHECK (status IN ('present', 'absent', 'late', 'justified_absent')),
  justification   TEXT,
  recorded_by     UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Pedagogical: Notes & Wellbeing
-- ---------------------------------------------------------------------------

CREATE TABLE pedagogical_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  student_id  UUID NOT NULL REFERENCES students(id),
  teacher_id  UUID NOT NULL REFERENCES profiles(id),
  content     TEXT NOT NULL,
  embedding   vector(1536),            -- pgvector — RAG sobre observaciones
  period      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

CREATE TABLE wellbeing_alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id),
  student_id      UUID NOT NULL REFERENCES students(id),
  triggered_by    UUID REFERENCES profiles(id),   -- null = disparado por IA
  alert_type      TEXT NOT NULL,                  -- ej: "mood_pattern", "absence_cluster"
  severity        TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  description     TEXT NOT NULL,
  is_anonymized   BOOLEAN NOT NULL DEFAULT true,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Communication
-- ---------------------------------------------------------------------------

CREATE TABLE announcements (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id           UUID NOT NULL REFERENCES schools(id),
  author_id           UUID NOT NULL REFERENCES profiles(id),
  title               TEXT NOT NULL,
  body                TEXT NOT NULL,
  target_audience     TEXT NOT NULL DEFAULT 'all',  -- all | section | grade
  target_section_id   UUID REFERENCES sections(id),
  requires_ack        BOOLEAN NOT NULL DEFAULT false,
  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ
);

CREATE TABLE messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id           UUID NOT NULL REFERENCES schools(id),
  sender_id           UUID REFERENCES profiles(id),    -- null = sistema/IA
  recipient_id        UUID REFERENCES profiles(id),
  channel             TEXT NOT NULL CHECK (channel IN ('app', 'web', 'whatsapp')),
  content             TEXT NOT NULL,
  direction           TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  whatsapp_message_id TEXT,                             -- Meta message ID para dedup
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE consents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  profile_id    UUID NOT NULL REFERENCES profiles(id),
  consent_type  TEXT NOT NULL,   -- platform | whatsapp | ai | marketing
  granted       BOOLEAN NOT NULL,
  version       TEXT NOT NULL,
  channel       TEXT NOT NULL,   -- dónde se capturó el consentimiento
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE whatsapp_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  profile_id        UUID NOT NULL REFERENCES profiles(id),
  phone             TEXT NOT NULL,
  is_authenticated  BOOLEAN NOT NULL DEFAULT false,
  last_activity_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Payments
-- ---------------------------------------------------------------------------

CREATE TABLE payment_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  family_id   UUID NOT NULL REFERENCES profiles(id),  -- guardian profile
  description TEXT NOT NULL,
  amount      DECIMAL(12,2) NOT NULL,
  due_date    TIMESTAMPTZ NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'paid', 'overdue', 'waived')),
  paid_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

CREATE TABLE payment_intents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  payment_item_id   UUID NOT NULL REFERENCES payment_items(id),
  mp_preference_id  TEXT,      -- Mercado Pago preference ID
  mp_payment_id     TEXT,
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ
);

-- Idempotencia de webhooks (Mercado Pago y Meta)
CREATE TABLE processed_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      TEXT NOT NULL UNIQUE,  -- ID del webhook para dedup
  source        TEXT NOT NULL,          -- "mercadopago" | "meta"
  processed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- AI: Conversations
-- ---------------------------------------------------------------------------

CREATE TABLE conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  profile_id  UUID NOT NULL REFERENCES profiles(id),
  channel     TEXT NOT NULL CHECK (channel IN ('app', 'web', 'whatsapp')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

CREATE TABLE conversation_messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  conversation_id   UUID NOT NULL REFERENCES conversations(id),
  role              TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'tool')),
  content           TEXT NOT NULL,
  tool_name         TEXT,              -- presente cuando role = 'tool'
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Audit Log — append-only, sin school_id FK (intencional — registra todo)
-- NUNCA hacer UPDATE ni DELETE sobre esta tabla
-- ---------------------------------------------------------------------------

CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id        UUID,                          -- null = sistema
  school_id       UUID,                          -- denormalizado, sin FK
  action          TEXT NOT NULL,                 -- ej: "grades.read", "consent.register"
  resource_type   TEXT NOT NULL,
  resource_id     UUID,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Tasks & Submissions
-- ---------------------------------------------------------------------------

CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  section_id  UUID NOT NULL REFERENCES sections(id),
  subject_id  UUID NOT NULL REFERENCES subjects(id),
  teacher_id  UUID NOT NULL REFERENCES profiles(id),
  title       TEXT NOT NULL,
  description TEXT,
  due_date    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

CREATE TABLE task_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  task_id       UUID NOT NULL REFERENCES tasks(id),
  student_id    UUID NOT NULL REFERENCES students(id),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'submitted', 'graded')),
  submitted_at  TIMESTAMPTZ,
  grade         DECIMAL(5,2),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Daily Journal (Nivel Inicial)
-- ---------------------------------------------------------------------------

CREATE TABLE daily_journal_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  section_id  UUID NOT NULL REFERENCES sections(id),
  teacher_id  UUID NOT NULL REFERENCES profiles(id),
  date        TIMESTAMPTZ NOT NULL,
  summary     TEXT,                    -- resumen generado por IA
  raw_notes   TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

CREATE TABLE daily_journal_photos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id),
  journal_entry_id  UUID NOT NULL REFERENCES daily_journal_entries(id),
  storage_key       TEXT NOT NULL,     -- path en Supabase Storage
  caption           TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Push Notifications
-- ---------------------------------------------------------------------------

CREATE TABLE push_subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id),
  profile_id  UUID NOT NULL REFERENCES profiles(id),
  expo_token  TEXT NOT NULL,
  platform    TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

CREATE TABLE notification_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id),
  recipient_id  UUID NOT NULL REFERENCES profiles(id),
  channel       TEXT NOT NULL CHECK (channel IN ('push', 'whatsapp', 'in_app')),
  template_id   TEXT,
  status        TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'failed')),
  sent_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata      JSONB DEFAULT '{}'
);
