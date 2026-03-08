# CDU-ADM-016 — Campaña de reinscripción proactiva con IA

← [Volver al índice](../README.md)

---

## CDU-ADM-016 — Campaña de reinscripción proactiva con IA

**Prioridad:** P1 | **Origen:** `[Innovation]`
**Actor:** Administrador / Directivo
**Canales:** App · Web (admin) · WhatsApp · App (familias receptoras)
**Tier:** Premium

**Trigger:** Se abre el período de reinscripción y hay familias sin confirmar. También puede activarse por consulta directa: "¿Cómo viene la reinscripción?", "Mandá recordatorio a los que no confirmaron".

**Flujo conversacional:**
```
[Admin — mediados de octubre]

Admin: "¿Cómo viene la reinscripción para el año que viene?"

Asistente: [llama get_reenrollment_status@v1es(escuela_id, ciclo="2027")]
           [llama get_dropout_risk@v1(escuela_id)]
→ "Reinscripción 2027 — estado al 15 de octubre:
   ✅ Confirmados: 187 / 312 (60%)
   ⚠️ Sin respuesta — bajo riesgo: 89 familias
   🔴 Sin respuesta — riesgo alto: 36 familias

   Las 36 de riesgo alto combinan: cuota atrasada + no leyeron el último comunicado + asistencia irregular.

   ¿Lanzamos una campaña diferenciada?"

Admin: "Sí, mostrámela"

Asistente: [llama create_reenrollment_campaign@v1(escuela_id, ciclo="2027")]
→ "Campaña propuesta — 3 mensajes diferenciados:

   GRUPO A — 89 familias sin respuesta (bajo riesgo):
   'Hola [nombre], recordamos que el plazo de reinscripción para 2027 vence el 30/10.
   Confirmá en 1 tap: [link]'

   GRUPO B — 36 familias en riesgo alto (tono más personal):
   'Hola [nombre], queremos asegurarnos de contar con [alumno] el año que viene.
   ¿Podemos ayudarte con algo? Confirmá tu lugar: [link]
   Si preferís hablar, respondé este mensaje.'

   ¿Aprobás los mensajes o querés editar alguno?"

Admin: "Apruebo los dos"

Asistente: [llama create_reenrollment_campaign@v1(segmento_A, segmento_B, admin_aprobacion=true)]
→ "Enviando...
   ✅ Grupo A: 89 mensajes enviados (WhatsApp donde hay opt-in, push al resto)
   ✅ Grupo B: 36 mensajes enviados

   Seguimiento en vivo:
   📩 Confirmaciones en las últimas 2 horas: 12 nuevas (9 Grupo A, 3 Grupo B)
   Vuelvo a avisarte mañana a las 9am con el resumen."

[Día siguiente — 9am — proactivo]

Asistente: "Resultados de ayer:
   Nuevas confirmaciones: 31 (24%)
   Riesgo alto que confirmaron: 8 (22% del grupo B)
   Riesgo alto que no respondieron: 28 — ¿Querés que te arme una lista para llamado telefónico?"
```

**Tool MCP requerida:**
- `get_reenrollment_status@v1` (por ciclo lectivo)
- `get_dropout_risk@v1` (cruza morosidad + engagement + asistencia)
- `create_reenrollment_campaign@v1` (segmentación automática en 3 grupos)
- `create_reenrollment_campaign@v1` (con aprobación explícita del admin obligatoria)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Familia sin canal activo (sin WhatsApp, sin app) | Genera lista separada para seguimiento telefónico manual |
| Familia en riesgo que no responde a los 3 mensajes | Alerta de contacto humano directo — no envía un 4to mensaje automático |
| Admin quiere editar el mensaje antes de enviar | Flujo de edición disponible — no se envía sin aprobación final |
| Familia ya confirmó pero está en el segmento | La tool valida estado en tiempo real antes de enviar — no llega a confirmados |
| Tutor menor de 18 en la cuenta | Se excluye del envío automatizado — se agrega a lista de atención manual |
| Período de reinscripción no configurado | "Configurá el período en Ajustes > Ciclo escolar antes de lanzar la campaña" |

**Regla de throttling:** Máximo 3 mensajes por familia por período de reinscripción. El sistema bloquea el 4to envío automáticamente y notifica al admin.

**Principio IV (supervisión humana):** El admin aprueba explícitamente el contenido y el volumen de envío antes de cada campaña. El asistente no puede enviar mensajes masivos sin aprobación.
