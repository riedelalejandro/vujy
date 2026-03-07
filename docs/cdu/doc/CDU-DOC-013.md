# CDU-DOC-013 — Gestión de previas y seguimiento (secundaria)

← [Volver al índice](../README.md)

---

## CDU-DOC-013 — Gestión de previas y seguimiento (secundaria)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Profesor de secundaria
**Canales:** App · Web · WhatsApp

**Trigger:** El profesor consulta sobre previas en su materia. Ejemplo: "¿Quiénes tienen materias previas en 4to A?".

**Flujo conversacional:**
```
Profesor: "¿Quiénes tienen previas en Historia en 4to A?"

Asistente: [llama get_notas(grado_id="4toA", materia="historia", trimestre=anterior)]
→ "Alumnos de 4to A con previa en Historia (de 3er año):
   - Lucas Fernández
   - Valentina Gómez
   Son los únicos dos. ¿Querés notificarles el examen de recuperación?"

Profesor: "Sí, avisales que es el 20/3 a las 14hs en el aula 5"

Asistente: [llama enviar_comunicado(destinatarios=alumnos_previas, cuerpo="...")]
→ "Notificación enviada a Lucas Fernández y Valentina Gómez ✅."
```

**Tool MCP requerida:**
- `get_notas` (para identificar alumnos con previas)
- `enviar_comunicado` (notificación a alumnos o tutores)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin previas | "Ningún alumno de 4to A tiene previas en tu materia." |
| Consulta por varios cursos | Responde por curso, con posibilidad de consolidar |
