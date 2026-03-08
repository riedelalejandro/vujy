# CDU-ADM-002 — Consulta de estado de morosidad

← [Volver al índice](../README.md)

---

## CDU-ADM-002 — Consulta de estado de morosidad

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin pregunta por la morosidad. Ejemplos: "¿Cómo viene la morosidad?", "¿Quiénes deben más de un mes?".

**Flujo conversacional:**
```
Admin: "¿Cómo viene la morosidad este mes?"

Asistente: [llama get_delinquency_dashboard@v1(escuela_id, segmentacion="resumen")]
→ "Morosidad al 4/3/2026:
   | Estado        | Familias | % | Monto        |
   | Al día        | 187      |78%| —            |
   | Deuda 1 mes   |  32      |13%| $1.344.000   |
   | Deuda 2+ meses|  21      | 9%| $1.764.000   |
   Total vencido: $3.108.000
   3 familias combinan morosidad con riesgo de deserción.
   ¿Ver detalle por familia, mandar recordatorios o ver las familias de riesgo?"
```

**Tool MCP requerida:**
- `get_delinquency_dashboard@v1`
- `get_dropout_risk@v1` (si el admin quiere ver familias de riesgo)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin morosidad | "Todas las familias están al día. Recaudación completa del mes." |
| Admin pide comparación con mes anterior | Ejecuta get_dashboard_morosidad para ambos períodos y presenta diferencia |
| Admin pide segmentación por grado | Parámetro segmentacion="por_grado" |
