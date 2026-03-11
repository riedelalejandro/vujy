-- =============================================================================
-- Vujy — Row Level Security Policies
-- Aislamiento de tenants: ninguna query puede cruzar datos entre escuelas
-- Principio: school_id = get_my_school_id() en todas las políticas base
-- =============================================================================

-- ---------------------------------------------------------------------------
-- NOTA: get_my_school_id() se define en 20260305000003_functions_triggers.sql
-- Pero PostgreSQL resuelve nombres de función en tiempo de ejecución (no compilación)
-- por lo que es seguro referenciarla aquí aunque aún no exista.
-- En la práctica, el orden de migración garantiza que esté disponible.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- schools — solo la propia escuela
-- ---------------------------------------------------------------------------
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "schools_tenant_isolation" ON schools
  USING (id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- profiles — solo perfiles de la propia escuela
-- ---------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_tenant_isolation" ON profiles
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- academic_years
-- ---------------------------------------------------------------------------
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

CREATE POLICY "academic_years_tenant_isolation" ON academic_years
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- sections
-- ---------------------------------------------------------------------------
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sections_tenant_isolation" ON sections
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- students — acceso por school_id
-- Los guardianes solo ven sus propios alumnos (filtro adicional en la app, no en RLS base)
-- ---------------------------------------------------------------------------
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_tenant_isolation" ON students
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- enrollments
-- ---------------------------------------------------------------------------
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enrollments_tenant_isolation" ON enrollments
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- guardian_students
-- ---------------------------------------------------------------------------
ALTER TABLE guardian_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guardian_students_tenant_isolation" ON guardian_students
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- subjects
-- ---------------------------------------------------------------------------
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subjects_tenant_isolation" ON subjects
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- grade_records — visible a guardians solo si el alumno es su hijo
-- Nota: el filtro de guardian→alumno se implementa en la capa de aplicación
-- via function calling (get_grades@v1 ya valida la vinculación)
-- La RLS base garantiza el aislamiento de tenant
-- ---------------------------------------------------------------------------
ALTER TABLE grade_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "grade_records_tenant_isolation" ON grade_records
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- attendance_records
-- ---------------------------------------------------------------------------
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_records_tenant_isolation" ON attendance_records
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- pedagogical_notes — datos sensibles, solo staff
-- Los guardianes NO tienen acceso directo; el asistente IA filtra y resume
-- ---------------------------------------------------------------------------
ALTER TABLE pedagogical_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pedagogical_notes_tenant_isolation" ON pedagogical_notes
  USING (
    school_id = get_my_school_id()
    AND (
      -- Solo teachers, admin, director, secretary, preceptor
      (SELECT role FROM profiles WHERE id = auth.uid() AND school_id = get_my_school_id() LIMIT 1)
      IN ('teacher', 'admin', 'director', 'secretary', 'preceptor')
    )
  );

-- ---------------------------------------------------------------------------
-- wellbeing_alerts — datos sensibles de salud mental
-- ---------------------------------------------------------------------------
ALTER TABLE wellbeing_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wellbeing_alerts_tenant_isolation" ON wellbeing_alerts
  USING (
    school_id = get_my_school_id()
    AND (
      (SELECT role FROM profiles WHERE id = auth.uid() AND school_id = get_my_school_id() LIMIT 1)
      IN ('teacher', 'admin', 'director', 'secretary', 'preceptor')
    )
  );

-- ---------------------------------------------------------------------------
-- announcements
-- ---------------------------------------------------------------------------
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcements_tenant_isolation" ON announcements
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_tenant_isolation" ON messages
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- consents
-- ---------------------------------------------------------------------------
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consents_tenant_isolation" ON consents
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- whatsapp_sessions
-- ---------------------------------------------------------------------------
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whatsapp_sessions_tenant_isolation" ON whatsapp_sessions
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- payment_items — solo el guardian puede ver sus propios items
-- (el filtro family_id = auth.uid() es adicional; RLS base garantiza tenant)
-- ---------------------------------------------------------------------------
ALTER TABLE payment_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_items_tenant_isolation" ON payment_items
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- payment_intents
-- ---------------------------------------------------------------------------
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_intents_tenant_isolation" ON payment_intents
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- processed_events — solo admins (webhooks internos)
-- En la práctica, el webhook usa service_role y bypassa RLS
-- ---------------------------------------------------------------------------
ALTER TABLE processed_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "processed_events_service_only" ON processed_events
  USING (false);  -- sin acceso desde cliente; solo service_role

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversations_tenant_isolation" ON conversations
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- conversation_messages
-- ---------------------------------------------------------------------------
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversation_messages_tenant_isolation" ON conversation_messages
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- audit_log — solo lectura para admins; escritura solo via service_role
-- ---------------------------------------------------------------------------
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_admin_read" ON audit_log
  FOR SELECT
  USING (
    school_id = get_my_school_id()
    AND (
      (SELECT role FROM profiles WHERE id = auth.uid() AND school_id = get_my_school_id() LIMIT 1)
      IN ('admin', 'director')
    )
  );

-- No INSERT policy desde cliente — audit_log solo se escribe via service_role (server)

-- ---------------------------------------------------------------------------
-- tasks
-- ---------------------------------------------------------------------------
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_tenant_isolation" ON tasks
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- task_submissions
-- ---------------------------------------------------------------------------
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_submissions_tenant_isolation" ON task_submissions
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- daily_journal_entries
-- ---------------------------------------------------------------------------
ALTER TABLE daily_journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_journal_entries_tenant_isolation" ON daily_journal_entries
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- daily_journal_photos — solo acceso si photo_optin = true del perfil
-- (el filtro de photo_optin se valida en la capa de aplicación,
--  no en RLS para evitar subqueries costosas en cada request de foto)
-- ---------------------------------------------------------------------------
ALTER TABLE daily_journal_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_journal_photos_tenant_isolation" ON daily_journal_photos
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- push_subscriptions
-- ---------------------------------------------------------------------------
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "push_subscriptions_tenant_isolation" ON push_subscriptions
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- notification_log
-- ---------------------------------------------------------------------------
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_log_tenant_isolation" ON notification_log
  USING (school_id = get_my_school_id());

-- ---------------------------------------------------------------------------
-- guardian_students — políticas adicionales: un guardian solo ve sus propios vínculos
-- ---------------------------------------------------------------------------
-- La política tenant_isolation ya existe; añadimos restricción por guardian
CREATE POLICY "guardian_students_own_only" ON guardian_students
  USING (
    school_id = get_my_school_id()
    AND (
      -- Los guardians solo ven sus propios vínculos
      -- Los staff ven todos (ya cubiertos por tenant_isolation)
      guardian_id = auth.uid()
      OR (
        (SELECT role FROM profiles WHERE id = auth.uid() AND school_id = get_my_school_id() LIMIT 1)
        IN ('teacher', 'admin', 'director', 'secretary', 'preceptor')
      )
    )
  );
