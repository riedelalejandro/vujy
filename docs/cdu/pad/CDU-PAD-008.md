# CDU-PAD-008 — Consulta de calificaciones

← [Volver al índice](../README.md)

---

## CDU-PAD-008 — Consulta de calificaciones

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta por notas. Ejemplos: "¿Qué nota sacó Mati en matemática?", "¿Cómo viene en el trimestre?".

**Flujo conversacional:**
```
Padre: "¿Cómo viene Mati en el trimestre?"

Asistente: [llama get_notas(alumno_id, trimestre=actual)]
→ "Mati en el 1er trimestre:
   | Materia      | Promedio | Tendencia    |
   | Matemática   | 8.5      | ↑ Subiendo   |
   | Lengua       | 7.0      | → Estable    |
   | Ciencias Nat.| 8.0      | ↑ Subiendo   |
   Promedio general: 7.8 — Muy bien."

Padre: "¿Y comparado con el trimestre anterior?"

Asistente: [llama get_notas(alumno_id, trimestre=anterior)]
→ "En el trimestre anterior el promedio fue 7.2. Subió 0.6 puntos 📈"
```

**Tool MCP requerida:**
- `get_notas` (trimestre actual + anterior para comparación)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Notas no liberadas (config. del tenant) | Informa la política de visibilidad de la institución |
| Alumno de nivel inicial | Reemplaza notas por hitos de desarrollo — lenguaje diferente |
| Caída significativa entre trimestres | Alerta contextual + contexto de observaciones pedagógicas si las hay |

**Principio III:** Solo el tutor puede ver notas de sus propios hijos.
