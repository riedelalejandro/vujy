-- =============================================================================
-- Vujy — Performance Indexes
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Core: tenant isolation (school_id en todas las tablas)
-- ---------------------------------------------------------------------------
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_academic_years_school_id ON academic_years(school_id);
CREATE INDEX idx_sections_school_id ON sections(school_id);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_enrollments_school_id ON enrollments(school_id);
CREATE INDEX idx_guardian_students_school_id ON guardian_students(school_id);
CREATE INDEX idx_subjects_school_id ON subjects(school_id);
CREATE INDEX idx_grade_records_school_id ON grade_records(school_id);
CREATE INDEX idx_attendance_records_school_id ON attendance_records(school_id);
CREATE INDEX idx_pedagogical_notes_school_id ON pedagogical_notes(school_id);
CREATE INDEX idx_wellbeing_alerts_school_id ON wellbeing_alerts(school_id);
CREATE INDEX idx_announcements_school_id ON announcements(school_id);
CREATE INDEX idx_messages_school_id ON messages(school_id);
CREATE INDEX idx_consents_school_id ON consents(school_id);
CREATE INDEX idx_payment_items_school_id ON payment_items(school_id);
CREATE INDEX idx_conversations_school_id ON conversations(school_id);
CREATE INDEX idx_conversation_messages_school_id ON conversation_messages(school_id);
CREATE INDEX idx_tasks_school_id ON tasks(school_id);
CREATE INDEX idx_task_submissions_school_id ON task_submissions(school_id);
CREATE INDEX idx_daily_journal_entries_school_id ON daily_journal_entries(school_id);
CREATE INDEX idx_daily_journal_photos_school_id ON daily_journal_photos(school_id);
CREATE INDEX idx_push_subscriptions_school_id ON push_subscriptions(school_id);
CREATE INDEX idx_notification_log_school_id ON notification_log(school_id);

-- ---------------------------------------------------------------------------
-- Audit log: filtrado por fecha y escuela
-- ---------------------------------------------------------------------------
CREATE INDEX idx_audit_log_school_created ON audit_log(school_id, created_at DESC);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Queries de negocio frecuentes
-- ---------------------------------------------------------------------------

-- Guardian → sus alumnos
CREATE INDEX idx_guardian_students_guardian_id ON guardian_students(guardian_id);
CREATE INDEX idx_guardian_students_student_id ON guardian_students(student_id);

-- Notas por alumno (acceso docente)
CREATE INDEX idx_grade_records_student_subject ON grade_records(student_id, subject_id);
CREATE INDEX idx_grade_records_teacher ON grade_records(teacher_id);

-- Asistencia: búsqueda por alumno + fecha (CDU-PAD-001, CDU-DOC-001)
CREATE INDEX idx_attendance_student_date ON attendance_records(student_id, date DESC);
CREATE INDEX idx_attendance_section_date ON attendance_records(section_id, date DESC);

-- Notas pedagógicas por alumno
CREATE INDEX idx_pedagogical_notes_student ON pedagogical_notes(student_id, created_at DESC);

-- Alertas de bienestar por alumno
CREATE INDEX idx_wellbeing_alerts_student ON wellbeing_alerts(student_id, created_at DESC);

-- Mensajes: historial por fecha
CREATE INDEX idx_messages_created ON messages(school_id, created_at DESC);

-- Pagos: morosidad dashboard
CREATE INDEX idx_payment_items_family_status ON payment_items(family_id, status);
CREATE INDEX idx_payment_items_due_date ON payment_items(school_id, due_date, status);

-- Conversaciones por perfil
CREATE INDEX idx_conversations_profile ON conversations(profile_id, created_at DESC);

-- Historial de mensajes de conversación
CREATE INDEX idx_conversation_messages_conv ON conversation_messages(conversation_id, created_at ASC);

-- Tareas por sección y fecha
CREATE INDEX idx_tasks_section_due ON tasks(section_id, due_date);

-- Diario: por sección y fecha
CREATE INDEX idx_daily_journal_section_date ON daily_journal_entries(section_id, date DESC);

-- Push subscriptions activas por perfil
CREATE INDEX idx_push_subscriptions_profile ON push_subscriptions(profile_id) WHERE is_active = true;

-- WhatsApp sessions por teléfono (lookup de mensajes entrantes)
CREATE INDEX idx_whatsapp_sessions_phone ON whatsapp_sessions(school_id, phone);

-- Inscripciones activas por año
CREATE INDEX idx_enrollments_student_year ON enrollments(student_id, academic_year_id);
CREATE INDEX idx_enrollments_section_year ON enrollments(section_id, academic_year_id);

-- ---------------------------------------------------------------------------
-- pgvector: HNSW index para RAG en notas pedagógicas
-- Requiere pgvector extension (habilitada en 000001)
-- ef_construction y m son parámetros de calidad/velocidad del grafo HNSW
-- ---------------------------------------------------------------------------
CREATE INDEX idx_pedagogical_notes_embedding
  ON pedagogical_notes
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
