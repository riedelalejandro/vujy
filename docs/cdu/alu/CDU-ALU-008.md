# CDU-ALU-008 — Consulta de situación académica propia (Secundaria)

← [Volver al índice](../README.md)

---

## CDU-ALU-008 — Consulta de situación académica propia (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno consulta cómo viene en sus materias. Ejemplos: "¿Cómo vengo en matemática?", "¿Me alcanza para aprobar si saco 7 en el próximo trimestre?".

**Flujo conversacional:**
```
Alumno: "¿Cómo vengo en matemática?"

Asistente: [llama get_notas(alumno_id, materia="Matemática")]
→ "Matemática — 2do trimestre:
   Parcial 1: 6 | TP grupal: 8 | Parcial 2: 5
   Promedio actual: 6.3 — tendencia a la baja ↓
   ¿Querés que calculemos qué necesitás sacar en el próximo parcial?"

Alumno: "Sí, quiero llegar a 7"

Asistente: "Para llegar a 7 de promedio necesitás sacar al menos 8 en el
            próximo parcial. ¿Querés que te arme un plan de estudio?"
```

**Tool MCP requerida:**
- `get_notas` (solo datos del alumno propio)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno tiene materias previas | Informa las previas claramente y cuándo son los exámenes de recuperación |
| Consulta por todas las materias | Genera panorama completo con todas las notas disponibles |
| Comparación con otros alumnos | "Solo puedo mostrarte tus propias notas." |
| Alumno angustiado | "Sé que no fue el resultado que esperabas. Todavía hay tiempo de mejorar." |
| Pregunta sobre escalas de recuperación | El asistente no improvisa: "Consultá con tu profe o preceptor sobre eso." |

**Principio III:** El alumno solo puede ver sus propios datos académicos.
