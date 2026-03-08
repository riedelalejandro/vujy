# CDU-DOC-008 — Consulta de estado de alumno específico

← [Volver al índice](../README.md)

---

## CDU-DOC-008 — Consulta de estado de alumno específico

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Docente
**Canales:** App · Web · WhatsApp

**Trigger:** La docente consulta el panorama de un alumno particular. Ejemplos: "¿Cómo viene Lucas este trimestre?", "¿Cuántas faltas tiene Valentina?".

**Flujo conversacional:**
```
Seño: "¿Cómo viene Lucas este trimestre?"

Asistente: [llama get_student_summary@v1(alu_lucas, trimestre_actual)]
           [llama get_grades@v1(alu_lucas, trimestre=1)]
           [llama get_attendance@v1(alu_lucas)]
→ "Lucas Fernández — 4to B, 1er trimestre:
   Académico: Promedio 7.8 — Matemática: 8, Lengua: 7, Ciencias: sin nota aún
   Asistencia: 18/20 días (2 ausencias, ambas justificadas)
   Mis observaciones: 4 — Última: 'Avanzó en comprensión lectora.'
   ¿Querés ver algo en particular?"
```

**Tool MCP requerida:**
- `get_student_summary@v1`
- `get_grades@v1`
- `get_attendance@v1`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno no en sus grados | "Lucas Rodríguez no está en ninguno de tus grados." |
| Comparación entre alumnos (promedio del grado) | Está permitido para el docente ver estadísticas de su propio grado |

**Principio III:** La docente solo puede consultar datos de sus propios alumnos.
