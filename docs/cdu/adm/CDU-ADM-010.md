# CDU-ADM-010 — Estadísticas de asistencia institucional

← [Volver al índice](../README.md)

---

## CDU-ADM-010 — Estadísticas de asistencia institucional

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin consulta tendencias de asistencia a nivel institucional. Ejemplos: "¿Cómo está la asistencia esta semana?", "¿Qué grado tiene más inasistencias?".

**Flujo conversacional:**
```
Admin: "¿Qué grado tiene más inasistencias esta semana?"

Asistente: [llama get_attendance@v1(escuela_id, desde=inicio_semana, hasta=hoy) — agrupado por grado]
→ "Inasistencias esta semana por grado:
   1. 3er año (Secundaria): 12 — 24% del grado
   2. 2do B (Primaria): 8 — 22% del grado
   3. Sala 4 (Inicial): 5 — 33% de la sala
   ¿Querés ver los alumnos de alguno en particular?"
```

**Tool MCP requerida:**
- `get_attendance@v1`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Inasistencia masiva inusual | Alerta proactiva: "El lunes 3/3 faltó el 40% de 5to A. ¿Hubo alguna novedad ese día?" |
