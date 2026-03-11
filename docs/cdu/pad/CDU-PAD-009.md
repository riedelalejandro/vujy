# CDU-PAD-009 — Consulta de asistencia acumulada

← [Volver al índice](../README.md)

---

## CDU-PAD-009 — Consulta de asistencia acumulada

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · Web · WhatsApp

**Trigger:** El padre consulta inasistencias. Ejemplos: "¿Cuántas faltas tiene Mati?", "¿Cuántas inasistencias lleva?".

**Flujo conversacional:**
```
Padre: "¿Cuántas faltas tiene Mati?"

Asistente: [llama get_my_students@v1(guardian_id)]
           — Si el tutor tiene >1 hijo Y la consulta no nombra al hijo explícitamente
             Y no hay contexto previo en el thread → preguntar:
             "¿Me preguntás por [Nombre1] o [Nombre2]?"
           — Si nombra explícitamente al hijo → resolver directamente.
           — Si pide asistencia de "los dos" / "todos" → responder con ambos.

Asistente: [llama get_attendance@v1(alumno_id, desde=inicio_anio, hasta=hoy)]
→ "Mati lleva 4 inasistencias en lo que va del año:
   - 12/2: ausente (justificada — certificado médico)
   - 19/2: tardanza
   - 5/3: ausente
   - 10/3: ausente
   El límite reglamentario es 25 inasistencias anuales."
```

**Tool MCP requerida:**
- `get_my_students@v1` (para desambiguación multi-hijo al inicio del flujo)
- `get_attendance@v1`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre tiene múltiples hijos y la consulta es genérica | "¿Me preguntás por [Nombre1] o [Nombre2]?" — siempre antes de llamar la tool académica |
| Hay contexto previo en el thread sobre un hijo | Asume el hijo mencionado sin preguntar |
| El padre pide asistencia de "los dos" | Responde con el detalle de ambos hijos |
| Alumno cerca del límite | Alerta proactiva: "Mati lleva 20 inasistencias. El límite es 25. Quedan 5." |
| Asistencia perfecta | "Mati tiene asistencia perfecta hasta hoy." |
