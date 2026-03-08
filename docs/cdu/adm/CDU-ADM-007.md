# CDU-ADM-007 — Alertas tempranas automáticas

← [Volver al índice](../README.md)

---

## CDU-ADM-007 — Alertas tempranas automáticas

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Sistema → Administrador (proactivo)
**Canales:** App · Web (push)

**Trigger:** El sistema detecta anomalías automáticamente sin consulta del admin.

**Flujo conversacional:**
```
[Push al admin]

Asistente: "Alerta: Pedro González (3er año) faltó 4 de los últimos 5 días.
            Sus notas también cayeron este trimestre.
            La docente de 3ro B no tomó asistencia en 3 de los últimos 7 días.
            ¿Querés que el equipo de orientación lo tenga en el radar?"

Admin: "Sí, avisalos"

Asistente: [llama send_announcement@v1 al equipo de orientación — notificación interna]
→ "Equipo de orientación notificado ✅."
```

**Tool MCP requerida:**
- `get_institutional_alerts@v1` (ejecutado automáticamente por scheduler)
- `get_dropout_risk@v1`
- `send_announcement@v1` (notificación interna)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Admin quiere filtrar solo alertas de un tipo | "Solo morosidad" → tipo=["morosidad_nueva"] |
| Admin ya actuó sobre una alerta | No reaparece hasta que cambien los factores que la generaron |
