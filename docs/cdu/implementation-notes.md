# Vujy CDU — Notas de Implementación

← [Volver al índice](README.md)

---

## Prioridades para el MVP (P1)

Los 28 CDUs P1 se concentran en los flujos de mayor valor inmediato para el go-to-market de Fase 2:

**Padre/Tutor (P1):** Resumen semanal del hijo, agenda del día siguiente, pago de cuota, aviso de ausencia, firma de autorización, comunicados, reinscripción, calificaciones, urgencia/incidente escolar.

**Docente (P1):** Asistencia (voz + lista), comunicados, carga de calificaciones, observaciones pedagógicas, informe trimestral, creación de actividades gamificadas.

**Admin/Directivo (P1):** Dashboard de pulso, morosidad, recordatorios de cobro, plan de pago, riesgo de deserción, simulador financiero, alertas tempranas, comparación de períodos.

**Alumno (P1):** Actividad de inicial, misión diaria primaria, agenda académica secundaria, situación académica, plan de estudio, simulacro de examen, **malestar emocional** (NON-NEGOTIABLE independientemente de la fase).

## Tools MCP priorizadas para definición

Las tools que cubren más CDUs P1 y son fundacionales:

1. `get_resumen_alumno` — CDU-PAD-001, CDU-DOC-008 (alta frecuencia)
2. `tomar_asistencia_grado` / `registrar_ausencia` — CDU-DOC-001, CDU-DOC-002, CDU-PAD-004
3. `enviar_comunicado` + `generar_comunicado_borrador` — CDU-DOC-003, CDU-ADM-003
4. `cargar_nota` + `get_notas` — CDU-DOC-004, CDU-PAD-008
5. `get_dashboard_morosidad` — CDU-ADM-001, CDU-ADM-002
6. `procesar_pago` + `get_estado_cuenta` — CDU-PAD-003 (acción de mayor riesgo — doble confirmación obligatoria)
7. Protocolo de bienestar emocional (API SPEC §5.3) — CDU-ALU-016 (NON-NEGOTIABLE)

## Reglas de confirmación obligatoria

Los siguientes CDUs requieren confirmación explícita del usuario antes de ejecutar la acción irreversible:

| CDU | Acción que requiere confirmación |
|-----|----------------------------------|
| CDU-PAD-003 | `procesar_pago` — doble confirmación (monto + método) |
| CDU-PAD-005 | `firmar_autorizacion` — confirmación de identidad y condiciones |
| CDU-PAD-007 | `confirmar_reinscripcion` — aceptación de condiciones del ciclo |
| CDU-DOC-004 | `cargar_nota` — revisión visual de la tabla antes de confirmar |
| CDU-DOC-006 | Publicación del informe — aprobación línea por línea |
| CDU-ADM-003 | Envío masivo de recordatorios — cantidad de destinatarios visible |
| CDU-CROSS-002 | Suspensión de clases — urgente pero requiere confirmación |

## Guardarraíles por perfil (resumen)

| Perfil | Restricciones clave |
|--------|---------------------|
| Padre/Tutor | Solo sus propios hijos. Sin acceso a datos de otras familias. |
| Docente | Solo sus propios alumnos/grados. Sin acceso a datos financieros de familias. No modifica notas publicadas en boletín (requiere directivo). |
| Admin/Directivo | Acceso institucional completo. Sin acceso a contenido literal de chats de alumnos. |
| Alumno | Solo sus propios datos. Sin chat libre con internet. Sin WhatsApp. No recibe tareas resueltas. Protocolo de bienestar siempre activo. |

## Notas para definición de MCP Schemas

Al definir los JSON Schemas en `10-MCP-SCHEMAS.md`, considerar:

1. Todos los endpoints de datos de alumnos deben validar que `alumno_id` pertenece al perfil autenticado (padre → sus hijos, docente → sus grados, alumno → sí mismo).
2. `procesar_pago` debe tener idempotency key para evitar doble cobro en caso de timeout.
3. La tool de protocolo de bienestar no retorna datos al asistente que inició la alerta — solo confirma que la alerta fue disparada.
4. Las tools de generación (`generar_comunicado_borrador`, `generar_informe_pedagogico`, `generar_actividad_educativa`) retornan un borrador que debe ser aprobado antes de ejecutar la acción efectiva.
5. El campo `canal` en `enviar_comunicado` debe validar que el canal WhatsApp no se use para alumnos menores.

## CDUs de mayor diferenciación competitiva

Los siguientes CDUs [Innovation] son los que más diferencian a Vujy de cualquier plataforma existente en el mercado argentino:

| CDU | Diferenciación |
|-----|----------------|
| CDU-PAD-014 | Alerta proactiva de caída académica antes del boletín — el padre sabe antes de que sea tarde |
| CDU-PAD-015 | Notificación de incidente escolar en tiempo real con protocolo de respuesta |
| CDU-PAD-016 | Trayectoria acumulada multi-año — Vujy como registro de vida educativa |
| CDU-DOC-015 | Barrera de horarios — resuelve el dolor docente más reportado en Argentina (mensajes a cualquier hora) |
| CDU-DOC-016 | Alerta de bienestar emocional con privacidad preservada — ninguna plataforma tiene este nivel de detección temprana |
| CDU-ADM-005 | Riesgo de deserción proactivo — el administrador actúa antes de que la familia decida irse |
| CDU-ADM-014 | Benchmark entre escuelas — el flywheel de efecto de red de Vujy |
| CDU-CROSS-003 | El alumno no entiende → la docente recibe el dato — cierra el loop entre aprendizaje individual y planificación pedagógica |
| CDU-CROSS-004 | Biblioteca de actividades entre escuelas — el mecanismo de crecimiento de la red |
| CDU-ALU-015 | Tutor entre pares coordinado por IA — aprendizaje colaborativo con privacidad garantizada |

---

*Documento vivo — Vujy · vujy.app — v1.0 · 2026-03-05*
*Sintetizado de los outputs de 3 agentes paralelos: Conservador (a3b5c97bede51e0ce), Mid-Level (a6e639eb8a7180946), Creativo (a7d6f025893b23feb)*
*Todos los CDUs cumplen con el Principio III de la Constitución de Vujy (Privacidad y Seguridad de Menores — NON-NEGOTIABLE)*
