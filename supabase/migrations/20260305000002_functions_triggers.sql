-- =============================================================================
-- Vujy — Functions & Triggers
-- =============================================================================

-- ---------------------------------------------------------------------------
-- get_my_school_id()
-- Función helper para RLS — devuelve el school_id del usuario autenticado.
--
-- Estrategia multi-escuela:
--   1. Prioridad: JWT claim 'school_id' — seteado en el login cuando el usuario
--      selecciona escuela. Correcto para usuarios multi-escuela (ej. docente
--      que trabaja en dos colegios) porque el claim es explícito por sesión.
--   2. Fallback: profiles.school_id — solo seguro para usuarios de una sola
--      escuela. Si el JWT no trae el claim (sesión legacy), se toma el de
--      profiles. LIMIT 1 se acepta solo porque en ese caso el usuario tiene
--      exactamente un profile row.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_my_school_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    -- 1. JWT claim (explícito, correcto para multi-escuela)
    (auth.jwt() ->> 'school_id')::UUID,
    -- 2. Fallback desde profiles (single-tenant solamente)
    (
      SELECT school_id
      FROM profiles
      WHERE id = auth.uid()
        AND deleted_at IS NULL
      LIMIT 1
    )
  )
$$;

-- ---------------------------------------------------------------------------
-- set_updated_at()
-- Trigger function para actualizar updated_at automáticamente
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_sections
  BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_students
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_enrollments
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_grade_records
  BEFORE UPDATE ON grade_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_pedagogical_notes
  BEFORE UPDATE ON pedagogical_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_announcements
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_payment_items
  BEFORE UPDATE ON payment_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_payment_intents
  BEFORE UPDATE ON payment_intents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_conversations
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_tasks
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_task_submissions
  BEFORE UPDATE ON task_submissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_daily_journal_entries
  BEFORE UPDATE ON daily_journal_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_push_subscriptions
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
