# CDU-DOC-004 — Carga de calificaciones

← [Volver al índice](../README.md)

---

## CDU-DOC-004 — Carga de calificaciones

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · Web · WhatsApp

**Trigger:** La docente dicta o escribe notas en lenguaje natural. Ejemplo: "Notas de matemática 3ro B: Mati 8, Sofi 9, Juani 6".

**Flujo conversacional:**
```
Seño: "Notas de matemática 3ro B: Mati 8, Sofi 9, Juani 6, Caro 7"

Asistente: "Voy a cargar en Matemática — Evaluación escrita — 3ro B:
            | Alumno         | Nota |
            | Matías López   |  8   |
            | Sofía Ruiz     |  9   |
            | Juan García    |  6   |
            | Carolina Pérez |  7   |
            ¿Confirmás?"

Seño: "Sí"

Asistente: [llama cargar_nota(grado_id, materia, tipo_evaluacion, fecha, notas=[...])]
→ "Cargadas ✅. Promedio: 7.5.
   Juani bajó respecto al trimestre anterior (tenía 8). ¿Querés que te avise si sigue la tendencia?"
```

**Tool MCP requerida:**
- `cargar_nota`
- `get_notas` (para comparar con trimestre anterior y disparar alertas)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Nombre ambiguo en el grado | "Tenés dos Matías — ¿Matías López o Matías García?" |
| Nota fuera del rango 1-10 | "La nota 11 no es válida. ¿Querés corregirla?" — no carga hasta recibir nota válida |
| Alumnos faltantes en la lista | "Faltan 3 alumnos: Pedro, Ana, Franco. ¿Estuvieron ausentes en la evaluación?" |
| Caída abrupta (>2 puntos) | Marca como alerta automática |
| Boletín ya cerrado | "El boletín del 1er trim. ya fue publicado. Modificar notas requiere autorización del directivo." |
| Tipo de evaluación no especificado | "¿Es evaluación escrita, oral o TP?" |

**Principio III:** El docente solo puede cargar notas de sus propios alumnos/grados.

**Nota:** La visibilidad de estas calificaciones para tutores está sujeta al permiso `can_view_grades` en el vínculo tutor↔alumno (`guardian_students`). Calificaciones cargadas correctamente pueden no ser visibles para tutores cuyo vínculo tenga `can_view_grades = false`.
