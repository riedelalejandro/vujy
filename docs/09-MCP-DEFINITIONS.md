# Vujy — MCP Definitions (Borrador v0.2)

## 1. Alcance

Este documento baja `TODO(MCP_DEFINITIONS)` a una especificación operativa inicial, derivada de:
- CDU cerrados por perfil: `docs/08-CDU-BY-PROFILE-CONSENSUS.md`
- Tools base existentes: `docs/02-API-SPEC.md`

Estado: **borrador implementable** (requiere validación final legal con asesoría especializada).

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

| Tool canónica | Tipo | Estado |
|---|---|---|
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
| `record_grade_batch@v1` | Action | Active |
| `process_payment@v1` | Action | Active |
| `sign_authorization@v1` | Action | Active |
| `confirm_reenrollment@v1` | Action | Active |
| `record_pedagogical_note@v1` | Action | Active |
| `generate_pedagogical_report@v1` | Generate | Active |
| `generate_learning_activity@v1` | Generate | Active |
| `generate_announcement_draft@v1` | Generate | Active |
| `generate_study_plan@v1` | Generate | Active |
| `get_delinquency_dashboard@v1` | Analytics | Active |
| `get_dropout_risk@v1` | Analytics | Active |
| `simulate_financial_scenario@v1` | Analytics | Active |
| `get_institutional_alerts@v1` | Analytics | Active |
| `create_collection_campaign@v1` | Action | Active |

---

## 5. Naming y Versionado

Regla de naming obligatoria:
- Solo nombres canónicos `snake_case@v1`.
- No se aceptan aliases legacy.
- `docs/09-MCP-DEFINITIONS.md` y `docs/10-MCP-SCHEMAS.md` son la fuente de verdad.

---

## 6. Matriz de Tools por Perfil (MVP)

| Perfil | Tools P0 obligatorias | Tools P1/P2 |
|---|---|---|
| Padre/Tutor | `get_student_summary@v1`, `record_absence@v1`, `get_account_status@v1`, `process_payment@v1` | `get_calendar@v1`, `get_announcements@v1`, `generate_study_plan@v1` |
| Docente | `take_attendance@v1`, `record_grade_batch@v1`, `send_announcement@v1`, `record_pedagogical_note@v1` | `generate_pedagogical_report@v1`, `generate_learning_activity@v1`, `get_institutional_alerts@v1` |
| Admin/Directivo | `get_delinquency_dashboard@v1`, `simulate_financial_scenario@v1`, `get_dropout_risk@v1`, `get_institutional_alerts@v1` | `send_announcement@v1`, `get_announcements@v1` |
| Alumno | `get_tasks@v1`, `get_student_summary@v1` (vista alumno), `generate_study_plan@v1` | `generate_learning_activity@v1` (modo práctica guiada) |

Notas:
- `process_payment@v1` solo `P` y su propia familia.
- `send_announcement@v1` siempre con confirmación previa.
- `get_student_summary@v1` para `Al` devuelve versión acotada (sin datos familiares/financieros).

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

---

## 11. Mapeo CDU -> Toolset (Top 12 MVP)

| CDU | Tools canónicas |
|---|---|
| CDU-P-01 | `get_student_summary@v1`, `get_grades@v1`, `get_attendance@v1`, `get_tasks@v1` |
| CDU-P-02 | `record_absence@v1` |
| CDU-P-03 | `get_account_status@v1` |
| CDU-P-04 | `process_payment@v1` |
| CDU-D-01 | `take_attendance@v1` |
| CDU-D-02 | `record_grade_batch@v1` |
| CDU-D-03 | `generate_announcement_draft@v1`, `send_announcement@v1` |
| CDU-D-04 | `record_pedagogical_note@v1` |
| CDU-A-01 | `get_delinquency_dashboard@v1` |
| CDU-A-02 | `create_collection_campaign@v1`, `send_announcement@v1` |
| CDU-A-03 | `simulate_financial_scenario@v1` |
| CDU-L-01 | `get_tasks@v1` |

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

## 13. Pendientes para cerrar v1 final

1. Validación legal formal del esquema de base legal, transferencias y retención.
2. Cerrar `OPTIN_FLOW` y `TEMPLATE_LIBRARY` para `create_collection_campaign@v1`.
3. Publicar especificación JSON completa por tool MVP (cerrado en `docs/10-MCP-SCHEMAS.md`).
4. Publicar casos E2E por cada CDU P0 con payload real y test de permisos.
5. Migrar `docs/02-API-SPEC.md` para reflejar únicamente nombres canónicos `@v1`.
