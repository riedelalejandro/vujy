-- =============================================================================
-- Vujy — Dev Seed
-- Datos ficticios para desarrollo local. NUNCA correr en producción.
-- Todos los nombres, DNIs y datos son 100% ficticios.
--
-- Guard: este archivo solo se incluye cuando db.seed.enabled = true en config.toml
-- La verificación de entorno se hace a nivel de script (scripts/seed.ts)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- UUIDs fijos para reproducibilidad entre resets
-- ---------------------------------------------------------------------------
-- school:      a0000000-0000-0000-0000-000000000001
-- academic_yr: a0000000-0000-0000-0000-000000000002
-- section_4B:  a0000000-0000-0000-0000-000000000003
-- section_5A:  a0000000-0000-0000-0000-000000000004
-- student_mati:a0000000-0000-0000-0000-000000000005
-- student_sofi:a0000000-0000-0000-0000-000000000006
-- subject_mat: a0000000-0000-0000-0000-000000000007
-- subject_len: a0000000-0000-0000-0000-000000000008

-- ---------------------------------------------------------------------------
-- Escuela Demo
-- ---------------------------------------------------------------------------
INSERT INTO schools (id, name, slug, plan, settings)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Escuela Demo Vujy',
  'demo',
  'premium',
  '{"working_hours": {"start": "08:00", "end": "17:00"}, "timezone": "America/Argentina/Buenos_Aires"}'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Año académico 2026
-- ---------------------------------------------------------------------------
INSERT INTO academic_years (id, school_id, name, start_date, end_date, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  '2026',
  '2026-03-01 00:00:00+00',
  '2026-12-19 00:00:00+00',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Materias
-- ---------------------------------------------------------------------------
INSERT INTO subjects (id, school_id, name, level)
VALUES
  ('a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Matemática', 'primaria'),
  ('a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Lengua y Literatura', 'primaria')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Usuarios de prueba en auth.users
-- Nota: en local dev, los usuarios se crean via Supabase Auth UI o magic link.
-- Para el seed usamos la función inauth.create_user del CLI de Supabase.
-- Si no está disponible, crear manualmente desde http://127.0.0.1:54323
--
-- Alternativa: insertar directamente en auth.users para entorno local ÚNICAMENTE
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  admin_id    UUID := 'b0000000-0000-0000-0000-000000000001';
  teacher_id  UUID := 'b0000000-0000-0000-0000-000000000002';
  guardian_id UUID := 'b0000000-0000-0000-0000-000000000003';
  student_uid UUID := 'b0000000-0000-0000-0000-000000000004';
  school_id   UUID := 'a0000000-0000-0000-0000-000000000001';
BEGIN
  -- Insertar en auth.users con todos los campos requeridos por Supabase Auth
  -- instance_id = '00000000...' es el valor estándar para entorno local
  -- aud = 'authenticated', role = 'authenticated' son requeridos para magic link
  INSERT INTO auth.users (
    instance_id, id, aud, role,
    email, email_confirmed_at,
    encrypted_password,
    confirmation_token, recovery_token,
    email_change_token_new, email_change,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  )
  VALUES
    (
      '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
      'admin@demo.vujy.app', now(),
      '',
      '', '',
      '', '',
      '{"provider":"email","providers":["email"],"school_id":"a0000000-0000-0000-0000-000000000001","role":"admin"}', '{}',
      now(), now()
    ),
    (
      '00000000-0000-0000-0000-000000000000', teacher_id, 'authenticated', 'authenticated',
      'docente@demo.vujy.app', now(),
      '',
      '', '',
      '', '',
      '{"provider":"email","providers":["email"],"school_id":"a0000000-0000-0000-0000-000000000001","role":"teacher"}', '{}',
      now(), now()
    ),
    (
      '00000000-0000-0000-0000-000000000000', guardian_id, 'authenticated', 'authenticated',
      'padre@demo.vujy.app', now(),
      '',
      '', '',
      '', '',
      '{"provider":"email","providers":["email"],"school_id":"a0000000-0000-0000-0000-000000000001","role":"guardian"}', '{}',
      now(), now()
    ),
    (
      '00000000-0000-0000-0000-000000000000', student_uid, 'authenticated', 'authenticated',
      'alumno@demo.vujy.app', now(),
      '',
      '', '',
      '', '',
      '{"provider":"email","providers":["email"],"school_id":"a0000000-0000-0000-0000-000000000001","role":"student"}', '{}',
      now(), now()
    )
  ON CONFLICT (id) DO NOTHING;

  -- Perfiles
  INSERT INTO profiles (id, school_id, role, full_name, phone, consent_registered, access_status)
  VALUES
    (admin_id,    school_id, 'admin',    'Ana Gómez',          '+5491100000001', true, 'active'),
    (teacher_id,  school_id, 'teacher',  'Carlos Rodríguez',   '+5491100000002', true, 'active'),
    (guardian_id, school_id, 'guardian', 'Laura García',       '+5491100000003', true, 'active'),
    (student_uid, school_id, 'student',  'Alumno Demo',        NULL,             true, 'active')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ---------------------------------------------------------------------------
-- Secciones
-- ---------------------------------------------------------------------------
INSERT INTO sections (id, school_id, academic_year_id, name, grade, level, teacher_id)
VALUES
  (
    'a0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    '4to B', 4, 'primaria',
    'b0000000-0000-0000-0000-000000000002'   -- Carlos Rodríguez
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    '5to A', 5, 'primaria',
    'b0000000-0000-0000-0000-000000000002'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Alumnos — Mati y Sofi (100% ficticios)
-- ---------------------------------------------------------------------------
INSERT INTO students (id, school_id, first_name, last_name, birth_date)
VALUES
  (
    'a0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000001',
    'Matías', 'García',
    '2016-05-15 00:00:00+00'
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000001',
    'Sofía', 'García',
    '2015-09-22 00:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;

-- Inscripciones activas
INSERT INTO enrollments (school_id, student_id, section_id, academic_year_id, status)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000005',   -- Mati → 4to B
    'a0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000002',
    'active'
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000006',   -- Sofi → 5to A
    'a0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000002',
    'active'
  )
ON CONFLICT DO NOTHING;

-- Familia: Laura García es guardián de ambos hijos (multi-hijo para testear CDU-PAD-001)
INSERT INTO guardian_students (school_id, guardian_id, student_id, relationship)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000003',   -- Laura García
    'a0000000-0000-0000-0000-000000000005',   -- Mati
    'parent'
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000006',   -- Sofi
    'parent'
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Notas de la semana actual — Mati
-- ---------------------------------------------------------------------------
INSERT INTO grade_records (school_id, student_id, subject_id, teacher_id, score, period, notes, is_published)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000007',   -- Matemática
    'b0000000-0000-0000-0000-000000000002',
    9.0, 'trimestre_1',
    'Mati participó activamente en la clase de fracciones.',
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000008',   -- Sofi - Lengua
    'b0000000-0000-0000-0000-000000000002',
    8.5, 'trimestre_1',
    'Excelente presentación oral.',
    true
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Asistencia de la semana actual — lunes a viernes
-- Mati faltó el miércoles (justificado), resto presente
-- ---------------------------------------------------------------------------
INSERT INTO attendance_records (school_id, student_id, section_id, date, status, justification, recorded_by)
VALUES
  -- Mati — semana actual (aproximado a fechas de seed)
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', date_trunc('week', now()) + interval '0 days', 'present',          NULL,            'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', date_trunc('week', now()) + interval '1 day',  'present',          NULL,            'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', date_trunc('week', now()) + interval '2 days', 'justified_absent', 'Turno médico.', 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', date_trunc('week', now()) + interval '3 days', 'present',          NULL,            'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', date_trunc('week', now()) + interval '4 days', 'present',          NULL,            'b0000000-0000-0000-0000-000000000002'),
  -- Sofi — toda la semana presente
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000004', date_trunc('week', now()) + interval '0 days', 'present', NULL, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000004', date_trunc('week', now()) + interval '1 day',  'present', NULL, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000004', date_trunc('week', now()) + interval '2 days', 'present', NULL, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000004', date_trunc('week', now()) + interval '3 days', 'present', NULL, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000004', date_trunc('week', now()) + interval '4 days', 'present', NULL, 'b0000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Tarea pendiente para Mati (para testear CDU-PAD-001 "tareas pendientes")
-- ---------------------------------------------------------------------------
INSERT INTO tasks (school_id, section_id, subject_id, teacher_id, title, description, due_date)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000008',   -- Lengua
  'b0000000-0000-0000-0000-000000000002',
  'TP de Lengua — Cuento corto',
  'Escribir un cuento corto de al menos una página sobre un personaje inventado.',
  date_trunc('week', now()) + interval '4 days 23:59:59'  -- viernes de esta semana
)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Log de confirmación
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  RAISE NOTICE '✓ Vujy Dev Seed completado:';
  RAISE NOTICE '  Escuela: Escuela Demo Vujy (slug: demo)';
  RAISE NOTICE '  Usuarios: admin@demo.vujy.app, docente@demo.vujy.app, padre@demo.vujy.app, alumno@demo.vujy.app';
  RAISE NOTICE '  Alumnos: Matías García (4to B), Sofía García (5to A)';
  RAISE NOTICE '  Familia multi-hijo: Laura García → Mati y Sofi';
  RAISE NOTICE '  Asistencia semana actual cargada (Mati faltó miércoles - justificado)';
END $$;
