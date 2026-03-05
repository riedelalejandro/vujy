# CDU-DOC-009 — Detección y seguimiento de alumnos en dificultad

← [Volver al índice](../README.md)

---

## CDU-DOC-009 — Detección y seguimiento de alumnos en dificultad

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Docente / Sistema (proactivo)
**Canales:** App

**Trigger:** Proactivo del sistema al detectar patrones, o la docente consulta. Ejemplos: "¿Quiénes necesitan más atención?", "¿Quiénes van mal en matemática?".

**Flujo conversacional:**
```
[Lunes 8:30 — al abrir la app]

Asistente: "Buenos días, seño Andrea. Antes de empezar la semana:
            ⚠️ Juan García bajó a 5 en la última evaluación de Matemática (tenía 8).
            ⚠️ Valentina Gómez faltó 4 de los últimos 5 días.
            ¿Querés que te prepare algo para hacer seguimiento hoy?"
```

**Flujo consultado:**
```
Seño: "¿Quiénes necesitan atención en el grado?"

Asistente: [llama get_notas(grado, trimestre=actual)]
           [llama get_asistencia(grado, periodo=reciente)]
           [llama get_alertas_institucionales(filtro=docente)]
→ "Alumnos que requieren atención — 4to B:
   Pedagógico: Juan García (↓ Mat. y Lengua), Pedro Suárez (3 notas bajo 6)
   Asistencia: Mati López (4 ausencias sin justificar este mes)
   Comunicación: Papás de Pedro no leyeron los últimos 3 comunicados."
```

**Tool MCP requerida:**
- `get_notas` (análisis de tendencias por grado)
- `get_asistencia`
- `get_alertas_institucionales` (filtro por docente y grado)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| No hay alumnos con dificultades | "El grado viene muy parejo. Sin alertas críticas por ahora." |
| Sobrecarga de alertas | El asistente agrupa y prioriza — máximo 3 alertas por apertura de sesión |
| Docente quiere ignorar una alerta | Puede descartarla; no reaparece hasta nuevo umbral |
