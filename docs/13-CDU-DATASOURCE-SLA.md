# Vujy — CDU Datasource + SLA Map

**Versión:** 1.0 | **Fecha:** 2026-03-05
**Complementa:** `docs/09-MCP-DEFINITIONS.md`

Fuente generada de `docs/.tmp-mcp-insumos-7-8-10.md §Insumo 7`.

## Criterios de clasificación

| Tipo | Descripción |
|------|-------------|
| **SQL/RLS** | Datos estructurados en Postgres con Row Level Security |
| **RAG** | Contenido no estructurado en pgvector (observaciones pedagógicas, materiales curriculares, historial IA) |
| **SQL+RAG** | Cruce de datos estructurados con texto semántico |
| **SQL+GEN-IA** | Datos estructurados como contexto para generación Claude API |
| **SQL+RAG+GEN-IA** | Los tres — caso más complejo |

## Columnas RLS por perfil

- **PAD:** `guardian_students.guardian_id` + `guardian_students.student_id`
- **DOC:** `teacher_courses.teacher_id` + `teacher_courses.course_id`
- **ADM:** `profiles.user_id` + `profiles.school_id` WHERE `role IN ('admin','director')`
- **ALU:** `students.user_id` (versión acotada, sin datos financieros/familiares)

---

## CDU-PAD (Padre / Tutor)

| CDU | Nombre | Tools @v1 | Fuente | SLA máx. ms | RLS control |
|-----|--------|-----------|--------|-------------|-------------|
| CDU-PAD-001 | Resumen semanal del hijo | `get_my_students@v1`, `get_student_summary@v1`, `get_grades@v1`, `get_tasks@v1` | SQL+RAG | 1500 | `guardian_students.guardian_id → student_id` |
| CDU-PAD-002 | Agenda del día siguiente | `get_my_students@v1`, `get_calendar@v1`, `get_tasks@v1` | SQL/RLS | 500 | `guardian_students.guardian_id → student_id → course_id` |
| CDU-PAD-003 | Estado de cuenta y pago | `get_account_status@v1`, `process_payment@v1` | SQL/RLS | 500 (+2000 Mercado Pago externo) | `families.id` vía `guardian_students.family_id`; `can_make_payments` |
| CDU-PAD-004 | Aviso de ausencia | `get_my_students@v1`, `record_absence@v1`, `get_tasks@v1` | SQL/RLS | 500 | `guardian_students.can_authorize_absence = true` |
| CDU-PAD-005 | Firma de autorización digital | `get_calendar@v1`, `sign_authorization@v1` | SQL/RLS | 500 | `authorizations.family_id` + `guardian_students.guardian_id` |
| CDU-PAD-006 | Lectura de comunicados | `get_announcements@v1`, `confirm_announcement_read@v1` | SQL/RLS | 300 | `announcements.school_id` + filtro por `course_id` del alumno |
| CDU-PAD-007 | Reinscripción ciclo siguiente | `get_account_status@v1`, `confirm_reenrollment@v1` | SQL/RLS | 500 | `guardian_students.guardian_id`; bloqueo si `account_status.overdue > 0` |
| CDU-PAD-008 | Consulta de calificaciones | `get_my_students@v1`, `get_grades@v1` | SQL/RLS | 500 | `guardian_students.guardian_id → student_id`; respeta `grades_published` |
| CDU-PAD-009 | Asistencia acumulada | `get_my_students@v1`, `get_attendance@v1` | SQL/RLS | 300 | `guardian_students.guardian_id → student_id` |
| CDU-PAD-010 | Contacto con la docente | `get_announcements@v1`, `send_announcement@v1` | SQL/RLS | 500 | `teacher_courses.teacher_id` filtrado por `course_id` del alumno |
| CDU-PAD-011 | Seguimiento de múltiples hijos | `get_my_students@v1`, `get_student_summary@v1`, `get_grades@v1`, `get_attendance@v1` | SQL+RAG | 2000 | `guardian_students.guardian_id` — múltiples `student_id` |
| CDU-PAD-012 | Resumen proactivo semanal | `get_calendar@v1`, `get_tasks@v1`, `get_student_summary@v1` | SQL/RLS | 800 | `guardian_students.guardian_id → student_id` |
| CDU-PAD-013 | Diario del día (nivel inicial) | `get_daily_journal@v1` | SQL+RAG | 1000 | `students.level = 'inicial'`; `foto_bloqueada` controla imágenes |
| CDU-PAD-014 | Alerta proactiva: caída académica | `get_grades@v1`, `get_institutional_alerts@v1`, `generate_study_plan@v1` | SQL+RAG+GEN-IA | 6000 | `guardian_students.guardian_id → student_id` |
| CDU-PAD-015 | Urgencia: incidente escolar | `send_announcement@v1` (prioridad urgente) | SQL/RLS | 300 | Solo tutores en `guardian_students` del alumno afectado |
| CDU-PAD-016 | Trayectoria acumulada multi-año | `get_my_students@v1`, `get_grades@v1`, `get_attendance@v1` | SQL+RAG | 2000 | `guardian_students.guardian_id → student_id`; multi-año con `school_year` |
| CDU-PAD-017 | Diario visual diario (nivel inicial) | `get_daily_journal@v1` | SQL+RAG | 1000 | `students.level = 'inicial'`; `foto_bloqueada` filtra imágenes |

---

## CDU-DOC (Docente)

| CDU | Nombre | Tools @v1 | Fuente | SLA máx. ms | RLS control |
|-----|--------|-----------|--------|-------------|-------------|
| CDU-DOC-001 | Toma de asistencia por voz | `take_attendance@v1`, `record_absence@v1` | SQL/RLS | 500 | `teacher_courses.teacher_id → course_id` |
| CDU-DOC-002 | Toma de asistencia por lista | `take_attendance@v1` | SQL/RLS | 300 | `teacher_courses.teacher_id → course_id` |
| CDU-DOC-003 | Envío de comunicado | `generate_announcement_draft@v1`, `send_announcement@v1` | SQL+GEN-IA | 4000 | `teacher_courses.teacher_id → course_id → family_ids` |
| CDU-DOC-004 | Carga de calificaciones | `record_grade_batch@v1` | SQL/RLS | 500 | `teacher_courses.teacher_id → course_id`; idempotencia obligatoria |
| CDU-DOC-005 | Registro de observación pedagógica | `record_pedagogical_note@v1` | SQL+RAG | 800 | `teacher_courses.teacher_id → student_id`; texto se indexa en pgvector |
| CDU-DOC-006 | Informe pedagógico trimestral | `generate_pedagogical_report@v1` | SQL+RAG+GEN-IA | 8000 | `teacher_courses.teacher_id → student_id`; Principio IV obligatorio |
| CDU-DOC-007 | Actividad educativa gamificada | `generate_learning_activity@v1` | SQL+GEN-IA | 6000 | `teacher_courses.teacher_id → course_id`; borrador hasta revisión |
| CDU-DOC-008 | Estado de alumno específico | `get_student_summary@v1`, `get_grades@v1`, `get_attendance@v1` | SQL+RAG | 1500 | `teacher_courses.teacher_id → course_id → student_id` |
| CDU-DOC-009 | Detección de alumnos en dificultad | `get_institutional_alerts@v1`, `get_grades@v1`, `get_attendance@v1` | SQL/RLS | 1000 | `teacher_courses.teacher_id → course_id` |
| CDU-DOC-010 | Estadísticas de comunicados | `get_announcements@v1` | SQL/RLS | 500 | `announcements.sender_id = teacher_id` |
| CDU-DOC-011 | Planificación didáctica asistida | `get_calendar@v1`, `generate_learning_activity@v1` | SQL+RAG+GEN-IA | 7000 | `teacher_courses.teacher_id → course_id` |
| CDU-DOC-012 | Diario visual del día (nivel inicial) | `publish_daily_journal@v1`, `get_daily_journal@v1` | SQL+RAG | 800 | `teacher_courses.teacher_id → course_id`; `students.level = 'inicial'` |
| CDU-DOC-013 | Gestión de previas y seguimiento | `get_grades@v1`, `send_announcement@v1`, `record_grade_batch@v1` | SQL/RLS | 800 | `teacher_courses.teacher_id → course_id`; `students.level = 'secundaria'` |
| CDU-DOC-014 | Sugerencia proactiva de repaso | `get_calendar@v1`, `generate_learning_activity@v1` | SQL+GEN-IA | 6000 | `teacher_courses.teacher_id → course_id` |
| CDU-DOC-015 | Barrera horaria | `get_announcements@v1`, `send_announcement@v1` | SQL/RLS | 500 | `school_settings.working_hours`; lógica en middleware |
| CDU-DOC-016 | Alerta bienestar emocional | `get_attendance@v1`, `get_institutional_alerts@v1`, `escalate_wellbeing@v1` | SQL+RAG | 1500 | `teacher_courses.teacher_id → student_id`; señales RAG anonimizadas |
| CDU-DOC-017 | Portfolio de impacto docente | `get_teacher_portfolio@v1`, `generate_teacher_portfolio_pdf@v1` | SQL+RAG | 2000 (consulta) / 5000 (PDF) | `teacher_courses.teacher_id`; privado sin permiso explícito |

---

## CDU-ADM (Admin / Directivo)

| CDU | Nombre | Tools @v1 | Fuente | SLA máx. ms | RLS control |
|-----|--------|-----------|--------|-------------|-------------|
| CDU-ADM-001 | Dashboard de pulso institucional | `get_attendance@v1`, `get_delinquency_dashboard@v1`, `get_institutional_alerts@v1`, `get_announcements@v1` | SQL/RLS | 1000 (4 queries en paralelo) | `profiles.school_id` (role: admin/director) |
| CDU-ADM-002 | Estado de morosidad | `get_delinquency_dashboard@v1`, `get_dropout_risk@v1` | SQL/RLS | 800 | `profiles.school_id` (role: admin/director) |
| CDU-ADM-003 | Recordatorio de cobro | `generate_announcement_draft@v1`, `send_announcement@v1`, `create_collection_campaign@v1` | SQL+GEN-IA | 5000 | `profiles.school_id` (role: admin/director); `opt_in` requerido WA; confirmación obligatoria |
| CDU-ADM-004 | Plan de pago para familia morosa | `get_account_status@v1`, `create_payment_plan@v1` | SQL/RLS | 500 | `profiles.school_id` (role: admin/director); plan vinculado a `family_id` específico |
| CDU-ADM-005 | Riesgo de deserción | `get_dropout_risk@v1`, `get_account_status@v1`, `get_attendance@v1` | SQL/RLS | 1500 | `profiles.school_id` (role: admin/director) |
| CDU-ADM-006 | Simulación financiera | `simulate_financial_scenario@v1` | SQL/RLS | 2000 | `profiles.school_id` (role: admin/director) |
| CDU-ADM-007 | Alertas tempranas automáticas | `get_institutional_alerts@v1`, `get_dropout_risk@v1`, `send_announcement@v1` | SQL/RLS | 800 | `profiles.school_id` (role: admin/director) |
| CDU-ADM-008 | Documentación para DIEGEP | `get_attendance@v1`, `get_grades@v1` | SQL/RLS | 6000 | `profiles.school_id` (role: admin/director) |
| CDU-ADM-009 | Comparación de períodos | `get_attendance@v1`, `get_delinquency_dashboard@v1`, `get_grades@v1` | SQL/RLS | 1500 | `profiles.school_id` (role: admin/director); `group by school_year`; nunca cross-tenant |
| CDU-ADM-010 | Estadísticas de asistencia | `get_attendance@v1` | SQL/RLS | 800 | `profiles.school_id` (role: admin/director) |
| CDU-ADM-011 | Gestión de personal y nómina | `simulate_financial_scenario@v1` | SQL/RLS | 1500 | `profiles.school_id` (role: admin/director); solo ADM/Dir |
| CDU-ADM-012 | Encuestas NPS escolar | `send_announcement@v1` | SQL/RLS | 800 | `profiles.school_id` (role: admin/director) |
| CDU-ADM-013 | Proyección de flujo de caja | `get_delinquency_dashboard@v1`, `simulate_financial_scenario@v1` | SQL/RLS | 2000 | `profiles.school_id` (role: admin/director) |
| CDU-ADM-014 | Benchmark entre escuelas | _(herramienta de red — P3, deferred)_ | SQL/RLS | 2000 | Solo `network_id`; datos individuales anonimizados |
| CDU-ADM-015 | Revocación de acceso de tutor | `search_guardian@v1`, `revoke_guardian_access@v1` | SQL/RLS | 500 | Propaga a nivel RLS + todos los canales; log inmutable append-only |
| CDU-ADM-016 | Campaña de reinscripción | `get_reenrollment_status@v1`, `get_dropout_risk@v1`, `create_reenrollment_campaign@v1` | SQL+GEN-IA | 5000 | `profiles.school_id` (role: admin/director); throttle máx 3 msg/familia/período |

---

## CDU-ALU (Alumno)

| CDU | Nombre | Tools @v1 | Fuente | SLA máx. ms | RLS control |
|-----|--------|-----------|--------|-------------|-------------|
| CDU-ALU-001 | Actividad visual interactiva (Inicial) | `get_tasks@v1` (catálogo curado) | SQL/RLS | 300 | `students.user_id`; `students.level = 'inicial'`; sin chat libre |
| CDU-ALU-002 | Misión diaria gamificada (Primaria 1er ciclo) | `get_tasks@v1` | SQL/RLS | 300 | `students.user_id`; `students.level = 'primaria_1er_ciclo'` |
| CDU-ALU-003 | Ver progreso personal (Primaria 1er ciclo) | `get_student_summary@v1` (vista alumno acotada) | SQL/RLS | 400 | `students.user_id`; sin notas numéricas para este nivel |
| CDU-ALU-004 | Explicación de tema de clase (Primaria 2do ciclo) | `get_tasks@v1` | SQL+RAG | 1500 | `students.user_id`; RAG sobre `curriculum_materials` del `course_id` |
| CDU-ALU-005 | Ver tareas pendientes (Primaria 2do ciclo) | `get_tasks@v1` | SQL/RLS | 300 | `students.user_id → course_enrollments → tasks` |
| CDU-ALU-006 | Flashcards para estudio | `get_tasks@v1`, `generate_learning_activity@v1` | SQL+RAG+GEN-IA | 5000 | `students.user_id → course_id`; RAG sobre materiales del curso |
| CDU-ALU-007 | Agenda académica (Secundaria) | `get_calendar@v1`, `get_tasks@v1`, `get_grades@v1` | SQL/RLS | 600 | `students.user_id → course_enrollments`; `students.level = 'secundaria'` |
| CDU-ALU-008 | Situación académica propia (Secundaria) | `get_student_summary@v1`, `get_grades@v1` | SQL/RLS | 500 | `students.user_id`; sin scope financiero |
| CDU-ALU-009 | Explicación de contenido curricular (Secundaria) | `get_tasks@v1` | SQL+RAG+GEN-IA | 6000 | `students.user_id → course_id`; guardarraíl: scope escolar estricto |
| CDU-ALU-010 | Plan de estudio personalizado (Secundaria) | `get_calendar@v1`, `generate_study_plan@v1` | SQL+GEN-IA | 6000 | `students.user_id → course_enrollments → grades` |
| CDU-ALU-011 | Simulacro de examen (Secundaria) | `get_calendar@v1`, `generate_learning_activity@v1` | SQL+RAG+GEN-IA | 6000 | `students.user_id → course_id`; respuestas no persisten en perfil |
| CDU-ALU-012 | Participación en foro (Secundaria) | `get_announcements@v1` | SQL/RLS | 400 | `students.user_id → course_id`; moderación antes de publicar |
| CDU-ALU-013 | Portfolio y orientación vocacional (Secundaria) | `get_student_summary@v1`, `generate_study_plan@v1` | SQL+RAG | 2000 | `students.user_id`; RAG sobre historial de logros |
| CDU-ALU-014 | Desafío colaborativo entre grados (Primaria) | `get_tasks@v1` | SQL/RLS | 500 | `students.user_id → course_id`; scope definido por docente |
| CDU-ALU-015 | Tutor entre pares (Secundaria) | `get_student_summary@v1` | SQL+RAG | 1500 | `students.user_id`; matching dentro del mismo `school_id` |
| CDU-ALU-016 | Detección malestar emocional | `escalate_wellbeing@v1` | SQL/RLS | 300 | `students.user_id`; alerta a `orientation_team`; contenido chat NUNCA se expone |

---

## CDU-CROSS (Cross-perfil)

| CDU | Nombre | Tools @v1 | Fuente | SLA máx. ms | RLS control |
|-----|--------|-----------|--------|-------------|-------------|
| CDU-CROSS-001 | Coordinación docente-padre para alumno | `get_student_summary@v1`, `send_announcement@v1` | SQL+RAG | 1500 | Docente: su curso; Padre: su hijo vinculado; RLS por sesión |
| CDU-CROSS-002 | Suspensión de clases: alerta masiva | `send_announcement@v1`, `get_announcements@v1` | SQL/RLS | 500 | `profiles.school_id` (role: admin/director); todos los canales simultáneos; ventana de cancelación 2 min |
| CDU-CROSS-003 | Alumno no entiende → docente recibe señal | `get_institutional_alerts@v1` | SQL+RAG | 1000 | `students.user_id → course_id → teacher_id`; señal anonimizada |
| CDU-CROSS-004 | Biblioteca de actividades entre escuelas | `get_announcements@v1` | SQL/RLS | 800 | `network_id`; actividades anonimizadas antes de publicar |
| CDU-CROSS-005 | Consentimiento informado onboarding | `register_consent@v1`, `get_consent_status@v1` | SQL/RLS | 300 | `tutors.user_id`; `consent_records.school_id`; BLOQUEANTE: gate de todos los CDUs |
| CDU-CROSS-006 | Solicitud ARCO | `export_user_data@v1`, `request_data_rectification@v1`, `request_data_deletion@v1` | SQL/RLS | 2000 (sync) / async | `tutors.user_id` o `students.user_id` ≥13; verificación de identidad obligatoria |
| CDU-CROSS-007 | Modo corresponsal en eventos | `activate_event_mode@v1`, `publish_event_update@v1`, `generate_event_album@v1` | SQL/RLS | 500 | `foto_bloqueada` en `students` controla imágenes; gate: CDU-ADM-015 + CDU-CROSS-005 |

---

## Herramientas deferred (P2/P3 — no en catálogo MVP)

| Tool | CDU | Estado |
|------|-----|--------|
| `generate_regulatory_report@v1` | CDU-ADM-008 (DIEGEP) | Deferred Phase 2 — formato DIEGEP requiere validación regulatoria |
| `get_staff_payroll@v1` | CDU-ADM-011, CDU-ADM-013 | Deferred Phase 2 — datos de personal sensibles, requiere RRHH integrado |
| `get_survey_results@v1` | CDU-ADM-012 | Deferred Phase 2 |
| `get_network_benchmark@v1` | CDU-ADM-014 | Deferred Phase 3 — requiere red de escuelas |
| `get_forum_threads@v1`, `post_forum_reply@v1` | CDU-ALU-012 | Deferred Phase 2 — moderación automática no trivial |
| `get_collaborative_challenge@v1`, `submit_challenge_response@v1` | CDU-ALU-014 | Deferred Phase 2 |
| `get_peer_tutor_match@v1` | CDU-ALU-015 | Deferred Phase 3 |
| `trigger_learning_signal@v1` | CDU-CROSS-003 | Deferred Phase 2 |
| `get_activity_library@v1`, `publish_to_library@v1` | CDU-CROSS-004 | Deferred Phase 3 |
