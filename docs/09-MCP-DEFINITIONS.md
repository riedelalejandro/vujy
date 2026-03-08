# Vujy — MCP Definitions v2.0

## 1. Alcance

Este documento cierra `TODO(MCP_DEFINITIONS)`. Es la especificación operativa del catálogo completo de tools MCP, derivado de:
- CDU v2.0 cerrados (73 CDUs): `docs/cdu/README.md`
- Decisiones 90/10: `docs/12-CDU-DECISOR-90-10.md`
- Tools base: `docs/02-API-SPEC.md`

**Total tools canónicas:** 48 (28 MVP v1 + 16 v2.0 + 4 definidas en corrección de auditoría)
**Schemas JSON publicados:** 48 tools en `docs/10-MCP-SCHEMAS.md` (incluye la corrección v2.1).

Estado: **especificación implementable** — pendiente validación legal (ver §13).

---

## 2. Convenciones

- Nombre canónico de tool: `snake_case@v1`
- Idioma técnico obligatorio: **inglés** para código, nombres de tools, claves JSON, schemas, eventos, payloads y errores.
- Español permitido solo en copy UX orientado a usuario final.
- Todas las tools deben recibir `school_id` implícito por sesión JWT.
- Todas las tools deben aplicar RLS por `school_id` + scope de rol.
- Acciones críticas requieren confirmación explícita del usuario.

Permisos de rol:
- `P`: Padre/Tutor
- `D`: Docente
- `A`: Admin/Dueño
- `Dir`: Directivo
- `S`: Secretaría
- `Pre`: Preceptor
- `Al`: Alumno

---

## 3. Cumplimiento y Base Legal (Argentina)

Marco de referencia mínimo para implementación:
- Ley 25.326 (datos personales)
- Ley 26.061 (protección integral de niñas, niños y adolescentes)

Matriz base legal por categoría (a validar con asesoría legal):

| Categoría de dato | Ejemplos | Base legal operativa | Restricción |
|---|---|---|---|
| Académico/administrativo escolar | notas, asistencia, calendario, comunicados | relación contractual institución-familia + cumplimiento de función educativa | mínimo privilegio por rol |
| Financiero familiar | deuda, pagos, comprobantes | relación contractual y gestión de cobro | solo tutor autorizado y roles administrativos habilitados |
| Menores en contexto pedagógico | observaciones, alertas académicas | interés superior del niño + finalidad educativa explícita | prohibido uso para perfilado comercial |
| Señales de bienestar/riesgo | alertas de malestar | protección de integridad + protocolo institucional | acceso restringido, escalamiento controlado |

Lineamientos obligatorios:
- No usar datos de menores para publicidad/segmentación comercial.
- Mantener trazabilidad de acceso a datos de menores por `actor_user_id` y `role`.
- Separar datos educativos de datos financieros en políticas de acceso y retención.

### 3.1 Transferencias internacionales de datos

Cuando intervienen proveedores externos fuera de Argentina:
- Documentar país de procesamiento por proveedor.
- Firmar cláusulas contractuales apropiadas (DPA/SCC u homologables).
- Mantener registro de transferencias y finalidad.
- Si aplica, recabar consentimiento informado específico de la institución/tutor según caso.

---

## 4. Catálogo Canónico de Tools

### 4.1 Tools MVP (v1 — activas)

| Tool canónica | Tipo | Estado |
|---|---|---|
| `get_my_students@v1` | Query | Active |
| `get_student_summary@v1` | Query | Active |
| `get_grades@v1` | Query | Active |
| `get_attendance@v1` | Query | Active |
| `get_account_status@v1` | Query | Active |
| `get_calendar@v1` | Query | Active |
| `get_announcements@v1` | Query | Active |
| `get_tasks@v1` | Query | Active |
| `record_absence@v1` | Action | Active |
| `take_attendance@v1` | Action | Active |
| `send_announcement@v1` | Action | Active |
| `confirm_announcement_read@v1` | Action | Active |
| `record_grade_batch@v1` | Action | Active |
| `process_payment@v1` | Action | Active |
| `create_payment_plan@v1` | Action | Active |
| `sign_authorization@v1` | Action | Active |
| `confirm_reenrollment@v1` | Action | Active |
| `record_pedagogical_note@v1` | Action | Active |
| `escalate_wellbeing@v1` | Action | Active |
| `generate_pedagogical_report@v1` | Generate | Active |
| `generate_learning_activity@v1` | Generate | Active |
| `generate_announcement_draft@v1` | Generate | Active |
| `generate_study_plan@v1` | Generate | Active |
| `get_delinquency_dashboard@v1` | Analytics | Active |
| `get_dropout_risk@v1` | Analytics | Active |
| `simulate_financial_scenario@v1` | Analytics | Active |
| `get_institutional_alerts@v1` | Analytics | Active |
| `create_collection_campaign@v1` | Action | Active |

### 4.2 Tools v2.0 (nuevas — CDUs añadidos)

| Tool canónica | Tipo | CDU | Roles | Confirma? | Idempotente? |
|---|---|---|---|---|---|
| `revoke_guardian_access@v1` | Action | CDU-ADM-015 | A, Dir, S | Sí (irreversible) | Sí |
| `log_security_action@v1` | Action | CDU-ADM-015 | Sistema (append-only) | No | Sí |
| `search_guardian@v1` | Query | CDU-ADM-015 | A, Dir, S | No | No |
| `register_consent@v1` | Action | CDU-CROSS-005 | P, S, A | No | Sí |
| `get_consent_status@v1` | Query | CDU-CROSS-005 | P, S, A, D | No | No |
| `export_user_data@v1` | Action | CDU-CROSS-006 | P (propios), A | No | Sí |
| `request_data_rectification@v1` | Action | CDU-CROSS-006 | P (propios), A | No | Sí |
| `request_data_deletion@v1` | Action | CDU-CROSS-006 | P (propios), A | Sí (irreversible) | Sí |
| `register_data_opposition@v1` | Action | CDU-CROSS-006 | P (propios), A | No | Sí |
| `get_reenrollment_status@v1` | Query | CDU-ADM-016 | A, Dir, S | No | No |
| `create_reenrollment_campaign@v1` | Action | CDU-ADM-016 | A, Dir | Sí | Sí |
| `get_daily_journal@v1` | Query | CDU-PAD-017, CDU-DOC-012 | P, D, Dir | No | No |
| `publish_daily_journal@v1` | Action | CDU-DOC-012 | D | No | Sí |
| `get_teacher_portfolio@v1` | Query | CDU-DOC-017 | D (propio), Dir, A | No | No |
| `generate_teacher_portfolio_pdf@v1` | Generate | CDU-DOC-017 | D (propio), Dir, A | No | Sí |
| `detect_teacher_milestone@v1` | Query | CDU-DOC-017 | Sistema (cron) | No | No |
| `record_portfolio_milestone@v1` | Action | CDU-DOC-017 | Sistema (cron) | No | Sí |
| `activate_event_mode@v1` | Action | CDU-CROSS-007 | D, Dir, A | No | Sí |
| `publish_event_update@v1` | Action | CDU-CROSS-007 | D, Dir, A | No | Sí |
| `generate_event_album@v1` | Generate | CDU-CROSS-007 | D, Dir, A | No | Sí |

### 4.3 Notas de tools críticas

**`escalate_wellbeing@v1`** (CDU-ALU-016, CDU-DOC-016) — Escalada de señales de malestar emocional al personal autorizado. NON-NEGOTIABLE: CDU-ALU-016 es P1 por constitución. Dispara alerta a coordinador/directivo + crea registro inmutable. Solo roles habilitados reciben el detalle del alumno. Nunca se ejecuta en modo automático sin supervisión humana (Principio IV).

**`confirm_announcement_read@v1`** (CDU-PAD-006, CDU-DOC-010) — Registra la lectura explícita de un comunicado por parte de un tutor. Tool de escritura separada de `get_announcements@v1` (que es solo Query). Idempotente por `(guardian_id, announcement_id)`.

**`create_payment_plan@v1`** (CDU-ADM-004) — Genera un plan de pago personalizado para una familia morosa. Requiere confirmación admin antes de activar. Crea cuotas futuras en el estado de cuenta. Bloquea envío de recordatorios automáticos de deuda mientras el plan esté vigente.

**`get_my_students@v1`** (7 CDUs-PAD) — Devuelve la lista de alumnos vinculados a un tutor dentro del tenant. Es el prerequisito para CDU-PAD-001/002/004/008/009/011/016 antes de pasar `student_id` a otras tools. RLS garantiza `guardian_students.guardian_id` = JWT del usuario. Máx 10 alumnos (casos de familia extendida). Sin datos financieros ni de contacto — solo `student_id`, nombre y curso.

**`generate_learning_activity@v1`** — Enum `activity_type` extendido en v2.0: agrega `flashcards` (CDU-ALU-006) y `exam_simulation` (CDU-ALU-011) a los tipos existentes. Output siempre en `status: "draft"` hasta aprobación docente.

---

## 5. Naming y Versionado

Regla de naming obligatoria:
- Solo nombres canónicos `snake_case@v1`.
- No se aceptan aliases legacy.
- `docs/09-MCP-DEFINITIONS.md` es la fuente de verdad del catálogo.
- `docs/10-MCP-SCHEMAS.md` contiene los schemas publicados del catálogo.

---

## 6. Matriz de Tools por Perfil (MVP)

| Perfil | Tools P0 obligatorias | Tools P1/P2 |
|---|---|---|
| Padre/Tutor | `get_consent_status@v1` (gate), `get_student_summary@v1`, `record_absence@v1`, `get_account_status@v1`, `process_payment@v1` | `get_calendar@v1`, `get_announcements@v1`, `confirm_announcement_read@v1`, `generate_study_plan@v1`, `get_daily_journal@v1` |
| Docente | `take_attendance@v1`, `record_grade_batch@v1`, `send_announcement@v1`, `record_pedagogical_note@v1` | `generate_pedagogical_report@v1`, `generate_learning_activity@v1`, `get_institutional_alerts@v1`, `publish_daily_journal@v1`, `get_teacher_portfolio@v1` |
| Admin/Directivo | `revoke_guardian_access@v1`, `get_delinquency_dashboard@v1`, `simulate_financial_scenario@v1`, `get_dropout_risk@v1`, `get_institutional_alerts@v1` | `create_collection_campaign@v1`, `create_payment_plan@v1`, `get_reenrollment_status@v1`, `create_reenrollment_campaign@v1` |
| Alumno | `get_tasks@v1`, `get_student_summary@v1` (vista alumno), `generate_study_plan@v1` | `generate_learning_activity@v1` (modo práctica guiada), `escalate_wellbeing@v1` (autoreporte) |

Notas:
- `get_consent_status@v1` es el gate de todos los CDUs — sin `has_active_consent=true`, ninguna tool de datos de alumnos ejecuta.
- `process_payment@v1` solo `P` y su propia familia.
- `send_announcement@v1` siempre con confirmación previa.
- `get_student_summary@v1` para `Al` devuelve versión acotada (sin datos familiares/financieros).
- `revoke_guardian_access@v1` solo roles administrativos (`A`, `Dir`, `S`).

---

## 7. Matriz de Habilitación por Edad y Canal (Alumno)

| Tool | Inicial | Primaria 1er ciclo | Primaria 2do ciclo | Secundaria |
|---|---|---|---|---|
| `get_tasks@v1` | App supervisada (solo lectura visual/auditiva) | App/Web | App/Web | App/Web/WhatsApp |
| `get_student_summary@v1` (vista alumno) | No habilitado | App/Web simplificado | App/Web simplificado | App/Web completo alumno |
| `generate_study_plan@v1` | No habilitado | App/Web con plantillas cortas | App/Web | App/Web/WhatsApp |
| `generate_learning_activity@v1` | Solo catálogo curado docente | App/Web curado | App/Web con moderación | App/Web con moderación |

Reglas:
- En Inicial no hay chat libre; solo módulos guiados.
- En Primaria 1er ciclo, preguntas fuera de scope derivan a adulto/docente.
- En Secundaria se mantiene scope escolar (sin desbordar a temas no educativos).

---

## 8. Contratos I/O mínimos (Top 12 CDU MVP)

## `get_student_summary@v1`
- Input required: `alumno_id`, `periodo`
- Output required: `asistencia`, `notas_recientes`, `tareas_pendientes`, `observaciones_docente`
- Errores: `FORBIDDEN_SCOPE`, `NOT_FOUND`, `DATA_UNAVAILABLE`

## `record_absence@v1`
- Input required: `alumno_ids[]`, `fecha`
- Output required: `success`, `ausencias_registradas[]`, `notificaciones_enviadas[]`
- Errores: `VALIDATION_ERROR`, `FORBIDDEN_SCOPE`, `CONFLICT_DATE_LOCK`

## `get_account_status@v1`
- Input required: `familia_id`
- Output required: `saldo_pendiente`, `items[]`, `historial_pagos[]`
- Errores: `FORBIDDEN_SCOPE`, `NOT_FOUND`

## `process_payment@v1`
- Input required: `familia_id`, `items_ids[]`
- Output required: `success`, `transaccion_id`, `monto_total`, `comprobante_url`
- Errores: `CONFIRMATION_REQUIRED`, `PAYMENT_REJECTED`, `DUPLICATE_REQUEST`

## `take_attendance@v1`
- Input required: `grado_id`, `fecha`, `asistencias[]`
- Output required: `success`, `presentes`, `ausentes`, `notificaciones_enviadas`
- Errores: `FORBIDDEN_SCOPE`, `VALIDATION_ERROR`

## `record_grade_batch@v1`
- Input required: `grado_id`, `materia`, `tipo_evaluacion`, `fecha`, `notas[]`
- Output required: `success`, `notas_cargadas`, `alertas[]`
- Errores: `FORBIDDEN_SCOPE`, `VALIDATION_ERROR`, `DUPLICATE_REQUEST`

## `send_announcement@v1`
- Input required: `titulo`, `cuerpo`, `destinatarios`
- Output required: `comunicado_id`, `destinatarios_count`, `canales_usados`, `timestamp`
- Errores: `CONFIRMATION_REQUIRED`, `FORBIDDEN_SCOPE`, `TEMPLATE_NOT_APPROVED`

## `record_pedagogical_note@v1`
- Input required: `alumno_id`, `texto`
- Output required: `observacion_id`, `fecha`, `preview_informe_actualizado`
- Errores: `FORBIDDEN_SCOPE`, `VALIDATION_ERROR`

## `get_delinquency_dashboard@v1`
- Input required: `escuela_id`
- Output required: `al_dia`, `deuda_1_mes`, `deuda_2_mas`, `total_vencido`
- Errores: `FORBIDDEN_SCOPE`, `DATA_UNAVAILABLE`

## `get_dropout_risk@v1`
- Input required: `escuela_id`
- Output required: `familias[]` con `indice_riesgo` y `factores[]`
- Errores: `FORBIDDEN_SCOPE`, `MODEL_UNAVAILABLE`

## `simulate_financial_scenario@v1`
- Input required: `escuela_id` (+ parámetros opcionales)
- Output required: `recaudacion_actual`, `recaudacion_proyectada`, `diferencia`, `detalle`
- Errores: `FORBIDDEN_SCOPE`, `VALIDATION_ERROR`

## `get_tasks@v1`
- Input required: `alumno_id` o `grado_id`
- Output required: `tareas[]` con `estado`, `fecha_entrega`
- Errores: `FORBIDDEN_SCOPE`, `NOT_FOUND`

## `create_collection_campaign@v1` (CDU-A-02)
- Input required: `segmento` (`deuda_1_mes|deuda_2_mas|custom_ids`), `canal[]`, `mensaje_borrador`, `require_preview=true`
- Output required: `campaign_id`, `destinatarios_estimados`, `preview_mensaje`, `riesgo_envio`, `estado`
- Errores: `FORBIDDEN_SCOPE`, `CONFIRMATION_REQUIRED`, `TEMPLATE_NOT_APPROVED`, `OPTIN_REQUIRED`

---

## 9. Política de Confirmación, Idempotencia y Auditoría

- Confirmación requerida:
- `process_payment@v1`
- `send_announcement@v1`
- `confirm_reenrollment@v1`

- Idempotencia obligatoria:
- Todas las `Action` y `Analytics` con efectos operativos deben aceptar `idempotency_key`.

- Auditoría mínima por ejecución:
- `request_id`, `tool_name`, `actor_user_id`, `role`, `school_id`, `input_hash`, `result_status`, `timestamp`.

### 9.1 Derechos ARCO (operativización)

Mínimos requeridos:
- Canal de solicitud ARCO por escuela (web o secretaría).
- SLA interno: recepción inmediata, trazabilidad y respuesta formal en plazo legal aplicable.
- Tooling administrativo para localizar, exportar y rectificar datos por `alumno_id`/`familia_id`.
- Registro de solicitudes ARCO con estado (`recibida`, `en_proceso`, `resuelta`, `rechazada_fundada`).

---

## 10. Taxonomía de Errores Conversacionales

| Código | Cuándo aplica | Respuesta conversacional esperada |
|---|---|---|
| `VALIDATION_ERROR` | Input faltante o inválido | Pedir solo el dato faltante (sin reiniciar flujo) |
| `FORBIDDEN_SCOPE` | Usuario fuera de permiso/RLS | Explicar límite y derivar canal correcto |
| `NOT_FOUND` | Recurso inexistente | Informar no encontrado + opción de verificar datos |
| `DATA_UNAVAILABLE` | Backend sin dato vigente | Respuesta parcial + sello de fecha y escalamiento |
| `CONFIRMATION_REQUIRED` | Acción crítica sin OK explícito | Pedir confirmación explícita antes de ejecutar |
| `DUPLICATE_REQUEST` | Reintento con misma operación | Confirmar operación previa, evitar duplicado |
| `PAYMENT_REJECTED` | Error de cobro | Informar rechazo y ofrecer reintento/método alterno |
| `TEMPLATE_NOT_APPROVED` | WhatsApp template no habilitado | Cambiar a canal permitido o solicitar aprobación |
| `MODEL_UNAVAILABLE` | Analytics/modelo no disponible | Fallback a reporte básico sin score |
| `OPTIN_REQUIRED` | Acción outbound sin consentimiento válido | Solicitar/derivar flujo de consentimiento |
| `ACCESS_ALREADY_REVOKED` | `revoke_guardian_access@v1` con tutor ya bloqueado | Informar estado actual, no ejecutar de nuevo |
| `CONSENT_ALREADY_ACTIVE` | `register_consent@v1` con versión ya aceptada | Confirmar consentimiento vigente, no duplicar |
| `ARCO_REQUEST_ALREADY_OPEN` | Solicitud ARCO duplicada para mismo campo | Informar ticket en curso con referencia |
| `EXPORT_IN_PROGRESS` | `export_user_data@v1` con job previo activo | Derivar a polling del job existente |
| `EVENT_MODE_NOT_ACTIVE` | `publish_event_update@v1` sin modo evento activo | Informar que el modo acto no está activado |
| `EVENT_MODE_ALREADY_ACTIVE` | `activate_event_mode@v1` con modo ya activo | Informar que ya está activo + link al modo |
| `PHOTO_BLOCKED_BY_POLICY` | Foto con `photo_blocked=true` en el evento | Warning no bloqueante — publicar texto sin foto |
| `REENROLLMENT_ALREADY_CONFIRMED` | `confirm_reenrollment@v1` duplicado | Confirmar reinscripción ya registrada |
| `INSUFFICIENT_DATA_FOR_GENERATION` | Generación sin datos históricos suficientes | Informar mínimo de datos necesario y fecha estimada |
| `ASYNC_JOB_QUEUED` | Proceso asincrónico iniciado correctamente | Informar `job_id` para polling y tiempo estimado |

---

## 11. Mapeo CDU -> Toolset

### P0 BLOQUEANTES (implementar primero)

| CDU | Nombre | Tools canónicas |
|---|---|---|
| CDU-ADM-015 | Revocación de acceso de tutor | `search_guardian@v1`, `revoke_guardian_access@v1` |
| CDU-CROSS-005 | Consentimiento informado onboarding | `register_consent@v1`, `get_consent_status@v1` |
| CDU-CROSS-006 | Solicitud ARCO | `export_user_data@v1`, `request_data_rectification@v1`, `request_data_deletion@v1` |

### P1 MVP — Padre/Tutor

| CDU | Nombre | Tools canónicas |
|---|---|---|
| CDU-PAD-001 | Resumen semanal | `get_student_summary@v1`, `get_grades@v1`, `get_attendance@v1`, `get_tasks@v1` |
| CDU-PAD-002 | Agenda del día siguiente | `get_calendar@v1`, `get_tasks@v1` |
| CDU-PAD-003 | Estado de cuenta y pago | `get_account_status@v1`, `process_payment@v1` |
| CDU-PAD-004 | Aviso de ausencia | `record_absence@v1` |
| CDU-PAD-005 | Firma de autorización digital | `sign_authorization@v1` |
| CDU-PAD-006 | Lectura de comunicados | `get_announcements@v1`, `confirm_announcement_read@v1` |
| CDU-PAD-007 | Reinscripción ciclo siguiente | `confirm_reenrollment@v1`, `get_account_status@v1` |
| CDU-PAD-008 | Consulta de calificaciones | `get_grades@v1` |
| CDU-PAD-015 | Urgencia: incidente escolar | `get_student_summary@v1`, `get_calendar@v1` |
| CDU-PAD-017 | Diario visual diario (nivel inicial) | `get_daily_journal@v1` |

### P1 MVP — Docente

| CDU | Nombre | Tools canónicas |
|---|---|---|
| CDU-DOC-001 | Toma de asistencia por voz | `take_attendance@v1` |
| CDU-DOC-002 | Toma de asistencia por lista | `take_attendance@v1` |
| CDU-DOC-003 | Envío de comunicado | `generate_announcement_draft@v1`, `send_announcement@v1` |
| CDU-DOC-004 | Carga de calificaciones | `record_grade_batch@v1` |
| CDU-DOC-005 | Registro de observación | `record_pedagogical_note@v1` |
| CDU-DOC-006 | Informe pedagógico trimestral | `generate_pedagogical_report@v1` |
| CDU-DOC-007 | Actividad educativa gamificada | `generate_learning_activity@v1` |
| CDU-DOC-012 | Diario visual del día | `publish_daily_journal@v1`, `get_daily_journal@v1` |

### P1 MVP — Admin/Directivo

| CDU | Nombre | Tools canónicas |
|---|---|---|
| CDU-ADM-001 | Dashboard de pulso institucional | `get_institutional_alerts@v1`, `get_delinquency_dashboard@v1` |
| CDU-ADM-002 | Estado de morosidad | `get_delinquency_dashboard@v1` |
| CDU-ADM-003 | Recordatorio de cobro | `create_collection_campaign@v1`, `send_announcement@v1` |
| CDU-ADM-004 | Plan de pago para familia morosa | `create_payment_plan@v1`, `get_account_status@v1` |
| CDU-ADM-005 | Riesgo de deserción | `get_dropout_risk@v1` |
| CDU-ADM-006 | Simulación financiera | `simulate_financial_scenario@v1` |
| CDU-ADM-007 | Alertas tempranas automáticas | `get_institutional_alerts@v1` |
| CDU-ADM-016 | Campaña de reinscripción | `get_reenrollment_status@v1`, `create_reenrollment_campaign@v1` |

### P1 MVP — Alumno

| CDU | Nombre | Tools canónicas |
|---|---|---|
| CDU-ALU-007 | Agenda académica (Secundaria) | `get_calendar@v1`, `get_tasks@v1` |
| CDU-ALU-008 | Situación académica propia | `get_student_summary@v1`, `get_grades@v1`, `get_attendance@v1` |
| CDU-ALU-010 | Plan de estudio personalizado | `generate_study_plan@v1` |
| CDU-ALU-011 | Simulacro de examen | `generate_learning_activity@v1` (activity_type: exam_simulation) |
| CDU-ALU-016 | Detección malestar emocional | `escalate_wellbeing@v1` |

### P2+ — Seleccionados

| CDU | Nombre | Tools canónicas |
|---|---|---|
| CDU-PAD-009 | Asistencia acumulada | `get_attendance@v1` |
| CDU-ALU-006 | Flashcards para estudio | `generate_learning_activity@v1` (activity_type: flashcards) |
| CDU-DOC-017 | Portfolio de impacto docente | `get_teacher_portfolio@v1`, `generate_teacher_portfolio_pdf@v1` |
| CDU-CROSS-002 | Suspensión de clases | `send_announcement@v1` (priority: urgent, channels: all) |
| CDU-CROSS-007 | Corresponsal en eventos | `activate_event_mode@v1`, `publish_event_update@v1`, `generate_event_album@v1` |

---

## 12. Retención y Borrado por Categoría

| Categoría | Retención operativa | Borrado/anonimización |
|---|---|---|
| Logs técnicos de tools | 12 meses | purga automática mensual |
| Auditoría de acciones críticas | 24 meses | anonimización de payload sensible |
| Conversaciones de alumnos menores | mínima necesaria para finalidad educativa | borrado/anonimización según política institucional aprobada |
| Datos financieros de pagos | según obligación contable/fiscal aplicable | bloqueo y posterior anonimización cuando corresponda |

Notas:
- Los plazos finales deben validarse con asesoría legal y obligaciones regulatorias de cada institución.
- La retención no puede exceder la finalidad declarada sin justificación legal.

---

## 13. Estado y pendientes

**v2.1 — corrección de auditoría:** 4 tools fantasma detectadas y definidas: `log_security_action@v1` (ADM-015), `register_data_opposition@v1` (CROSS-006), `detect_teacher_milestone@v1` + `record_portfolio_milestone@v1` (DOC-017). Total: 48 tools.  
Los 4 schemas de estas tools están publicados en `docs/10-MCP-SCHEMAS.md`.

**v2.0 — estado al cierre de ese alcance:** catálogo canónico con 44 tools publicadas en ese corte, error taxonomy con 20 códigos, mapeo CDU→toolset completo, política de proactive messaging (§14), mapeo datasource+SLA en `docs/13-CDU-DATASOURCE-SLA.md`, casos E2E P0 por insumos pendientes.

**Pendientes pre-lanzamiento:**
1. Validación legal formal del esquema de base legal, transferencias internacionales (DPA Anthropic) y retención con asesoría especializada.
2. Cerrar `TEMPLATE_LIBRARY` para `create_collection_campaign@v1` y canales WhatsApp — aprobación Meta.
3. Casos E2E P0 pendientes (`Insumo 10`) — mover a CI pipeline antes de lanzamiento.
4. DPA con Anthropic (transferencia internacional de datos para Claude API) — BLOQUEANTE antes de datos reales.

---

## 14. Política de Proactive Messaging

Un mensaje es **proactivo** cuando el sistema lo inicia sin acción explícita del usuario en esa sesión. Los mensajes reactivos (respuesta a consulta del usuario) no están sujetos a esta política.

### Throttle global por perfil

| Perfil | Límite diario | Límite semanal | Observación |
|--------|--------------|----------------|-------------|
| PAD | 5/día | 15/semana | Por tutor — 2 hijos = 1 tutor para el contador |
| DOC | 3/día | 10/semana | Por docente |
| ADM | 5/día | Sin límite semanal | Alertas críticas no cuentan |
| ALU | 2/día | 8/semana | Solo App — ALU no recibe proactivos por WhatsApp |

Reseteo: 00:00 ART (UTC-3). Mensajes retenidos se procesan al inicio del siguiente período con contenido actualizado.

### Jerarquía de urgencia — mensajes que rompen el throttle

| Nivel | Tipo | CDUs |
|-------|------|------|
| CRÍTICO | Incidente seguridad / integridad física | CDU-PAD-015, CDU-ALU-016 nivel 2 |
| URGENTE | Suspensión de clases | CDU-CROSS-002 |
| ALTO | Bienestar emocional nivel 2 | CDU-ALU-016, CDU-DOC-016 |
| MEDIO | Alertas institucionales umbral crítico | CDU-ADM-007 |

**No rompen throttle:** CDU-PAD-012 (resumen semanal), CDU-PAD-014 (caída académica), CDU-ADM-016 (reinscripción).

### CDUs proactivos — resumen operativo

| CDU | Disparador técnico | Canal | Frecuencia máx. | Opt-in | Opt-out |
|-----|--------------------|-------|-----------------|--------|---------|
| CDU-PAD-012 | `cron` semanal `student_weekly_summary_view` | WhatsApp → Push | 1/semana/alumno | Sí | Ajustes |
| CDU-PAD-013/017 | `INSERT diary_entries` publicado por docente | Push → App | 1/día de clase | Sí (implícito) | Ajustes |
| CDU-PAD-014 | `grade_trend_job` semanal (delta ≥ 2 pts) | Push → App → WA | 1/trimestre/materia | Sí | Ajustes |
| CDU-PAD-015 | `INSERT incidents` severity medium/high/critical | Push + WA simultáneos | Sin límite | No | No disponible |
| CDU-DOC-014 | `cron` diario: evaluación en ≤3 días sin repaso | Push → App | 1/evaluación | Sí | Ajustes docente |
| CDU-DOC-016 | `wellbeing_signal_job` diario | Push discreto | 1/alumno/semana | No (protocolo) | No disponible |
| CDU-DOC-017 | `cron` semanal `course_stats_weekly_view` | Push → App | Máx 4/mes | Sí | Ajustes docente |
| CDU-ADM-007 | `institutional_alert_job` diario 6:00am | Push → App/Web | Configurable | No | Parcial |
| CDU-ADM-016 | Manual o `reenrollment_reminder_job` | WhatsApp → Push | Máx 3/familia/período | Sí (WA opt-in) | STOP WA |
| CDU-ALU-016 | Guardarraíl asistente durante conversación | Push interno | Sin límite nivel 2 | No | No disponible |
| CDU-CROSS-002 | `INSERT school_alerts` tipo `class_suspension` | WA + Push + App | Sin límite | No | No disponible |
| CDU-CROSS-007 | `INSERT event_updates` con `event_mode='active'` | Push → App | Sin límite (mín 5 min) | Sí (implícito) | Ajustes |

### Ventanas horarias (ART, UTC-3)

| Tipo | Días | Ventana | Excepción |
|------|------|---------|-----------|
| Resumen semanal (PAD-012) | Lun o Vie (config. tenant) | 07:30–09:00 | — |
| Diario visual (PAD-013/017) | Lun–Vie | 15:00–19:00 | — |
| Caída académica (PAD-014) | Mar–Sáb | 09:00–20:00 | — |
| Incidente (PAD-015) + Suspensión (CROSS-002) | Todos | 24/7 | Emergencia |
| Sugerencia repaso (DOC-014) | Lun–Vie | 08:00–18:00 | — |
| Mensajes en cola docente (DOC-015) | Lun–Vie | 07:45–08:30 | — |
| Bienestar docente (DOC-016) | Lun–Vie | 08:00–16:00 | Nivel 2: 24/7 |
| Hito pedagógico (DOC-017) | Viernes | 17:00–19:00 | — |
| Alertas admin (ADM-007) | Lun–Vie | 06:00–08:00 resumen | Críticas: 24/7 |
| Reinscripción (ADM-016) | Mar–Jue | 10:00–12:00 o 18:00–20:00 | — |
| Acto escolar (CROSS-007) | Durante evento | Mientras `event_mode='active'` | — |

**Referencia de datasource y SLA por CDU:** ver `docs/13-CDU-DATASOURCE-SLA.md` — tabla completa para los 73 CDUs con fuente (SQL/RLS, RAG, GEN-IA), SLA máx. en ms y columna RLS de control.
