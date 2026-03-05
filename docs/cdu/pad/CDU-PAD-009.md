# CDU-PAD-009 — Consulta de asistencia acumulada

← [Volver al índice](../README.md)

---

## CDU-PAD-009 — Consulta de asistencia acumulada

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre consulta inasistencias. Ejemplos: "¿Cuántas faltas tiene Mati?", "¿Cuántas inasistencias lleva?".

**Flujo conversacional:**
```
Padre: "¿Cuántas faltas tiene Mati?"

Asistente: [llama get_asistencia(alumno_id, desde=inicio_anio, hasta=hoy)]
→ "Mati lleva 4 inasistencias en lo que va del año:
   - 12/2: ausente (justificada — certificado médico)
   - 19/2: tardanza
   - 5/3: ausente
   - 10/3: ausente
   El límite reglamentario es 25 inasistencias anuales."
```

**Tool MCP requerida:**
- `get_asistencia`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno cerca del límite | Alerta proactiva: "Mati lleva 20 inasistencias. El límite es 25. Quedan 5." |
| Asistencia perfecta | "Mati tiene asistencia perfecta hasta hoy." |
