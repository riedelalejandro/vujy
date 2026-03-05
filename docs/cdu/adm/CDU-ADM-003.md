# CDU-ADM-003 — Envío de recordatorio de cobro

← [Volver al índice](../README.md)

---

## CDU-ADM-003 — Envío de recordatorio de cobro

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere enviar recordatorios a familias morosas. Ejemplo: "Mandá recordatorio a los que deben febrero".

**Flujo conversacional:**
```
Admin: "Mandá recordatorio a los que deben más de un mes, segmentalo:
        tono amable para los que siempre pagaron, firme para los reincidentes"

Asistente: [llama get_dashboard_morosidad(segmentacion="por_familia")]
           [llama get_riesgo_desercion para cruzar con riesgo]
→ "Segmentando:
   Recordatorio amable: 14 familias (historial de pago correcto, atraso puntual)
   Recordatorio firme: 8 familias (patrón de mora reincidente)
   Para llamada personal tuya: 4 familias (señal de riesgo combinada)
   Ya en gestión activa con secretaría: 6 familias (excluidas del envío)
   ¿Confirmamos el envío?"

Admin: "Sí"

Asistente: [llama enviar_comunicado(destinatarios=[...], cuerpo=..., prioridad="normal")]
→ "Recordatorios enviados ✅. En 48hs te digo cuántos pagaron."
```

**Lógica de destinatarios por familia morosa:**
Para cada familia morosa, los recordatorios se envían únicamente a los tutores que cumplen ambas condiciones en `guardian_students`:
- `can_make_payments = true` (son quienes pueden resolver la deuda)
- `receives_notifications = true` (tienen habilitadas las notificaciones)

Los tutores que no cumplen estas condiciones no reciben el recordatorio de mora.

**Tool MCP requerida:**
- `get_dashboard_morosidad`
- `get_riesgo_desercion`
- `generar_comunicado_borrador`
- `enviar_comunicado`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Familia con plan de pago vigente | El sistema las excluye automáticamente del envío |
| Familia morosa sin ningún tutor con `can_make_payments=true AND receives_notifications=true` | Se marca para gestión manual por secretaría |
| Admin quiere tono más firme | Genera una versión más directa pero siempre dentro de parámetros institucionales |
