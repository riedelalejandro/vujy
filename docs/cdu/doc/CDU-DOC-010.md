# CDU-DOC-010 — Consulta de estadísticas de comunicados enviados

← [Volver al índice](../README.md)

---

## CDU-DOC-010 — Consulta de estadísticas de comunicados enviados

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Docente
**Canales:** App · Web · WhatsApp

**Trigger:** La docente consulta cuántos padres leyeron un comunicado. Ejemplo: "¿Cuántos papás leyeron el comunicado del acto?".

**Flujo conversacional:**
```
Seño: "¿Cuántos papás leyeron el comunicado del acto?"

Asistente: [llama get_announcements@v1(grado_id, limite=1)]
→ "Comunicado 'Acto escolar — viernes 20/3':
   ✅ Leído: 18 de 24 familias (75%)
   ❌ Sin leer: 6 familias (García, López, Torres y 3 más)
   ¿Querés mandarles un recordatorio a los que no leyeron?"

Seño: "Sí"

Asistente: [llama send_announcement@v1(destinatarios=no_lectores, cuerpo="Recordatorio: ...")]
→ "Recordatorio enviado ✅."
```

**Tool MCP requerida:**
- `get_announcements@v1` (con estado de lectura por familia)
- `send_announcement@v1` (recordatorio a no-lectores)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| 100% de lectura | "¡Todas las familias leyeron el comunicado! 🎉" |
| Familia sin canal activo (sin app ni WhatsApp) | "3 familias no tienen canal activo — secretaría puede contactarlas." |
