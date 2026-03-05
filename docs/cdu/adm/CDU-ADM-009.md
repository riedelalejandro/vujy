# CDU-ADM-009 — Comparación de períodos / evolución institucional

← [Volver al índice](../README.md)

---

## CDU-ADM-009 — Comparación de períodos / evolución institucional

**Prioridad:** P1 | **Origen:** `[Extension]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere comparar métricas entre períodos. Ejemplos: "¿Cómo está la asistencia vs. la semana anterior?", "Compará morosidad de marzo vs. febrero".

**Flujo conversacional:**
```
Admin: "¿Cómo está la asistencia esta semana vs. la anterior?"

Asistente: [llama get_asistencia(escuela_id, desde=semana_actual)]
           [llama get_asistencia(escuela_id, desde=semana_anterior)]
→ "Comparación de asistencia:
   | Semana          | Presentes | Ausentes | % Asistencia |
   | Esta (3-7/3)    | 218/240   | 22       | 90.8%        |
   | Anterior (24-28/2) | 225/240| 15       | 93.8%        |
   Bajó 3 puntos. El grado con más ausencias esta semana: 4to B (5 ausentes de 24).
   ¿Querés investigar la causa o ver qué grado tiene más inasistencias?"
```

**Tool MCP requerida:**
- `get_asistencia` (con rangos de fecha para comparación)
- `get_dashboard_morosidad` (para comparación de morosidad)
- `get_alertas_institucionales` (para detectar patrones)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Datos del año anterior no disponibles (primer año en Vujy) | "No tengo datos históricos anteriores a 2026 — este es el primer año en Vujy." |
| Comparación con feriados en el período | Normaliza por días hábiles antes de comparar |
