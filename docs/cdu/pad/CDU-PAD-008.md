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

Asistente: [llama get_my_students@v1(guardian_id)]
           — Si el tutor tiene >1 hijo Y la consulta no nombra al hijo explícitamente
             Y no hay contexto previo en el thread → preguntar:
             "¿Me preguntás por [Nombre1] o [Nombre2]?"
           — Si nombra explícitamente al hijo → resolver directamente.
           — Si pide notas de "los dos" / "todos" → responder con ambos.
           — Verificar can_view_grades=true en guardian_students para el alumno.

           Si can_view_grades=false →
→ "No tenés habilitado el acceso a las calificaciones de [nombre].
   Para más información, comunicate con secretaría."
   [Fin del flujo]

           Si can_view_grades=true →

Asistente: [llama get_grades@v1(alumno_id, trimestre=actual)]
→ "Mati en el 1er trimestre:
   | Materia      | Promedio | Tendencia    |
   | Matemática   | 8.5      | ↑ Subiendo   |
   | Lengua       | 7.0      | → Estable    |
   | Ciencias Nat.| 8.0      | ↑ Subiendo   |
   Promedio general: 7.8 — Muy bien."

Padre: "¿Y comparado con el trimestre anterior?"

Asistente: [llama get_grades@v1(alumno_id, trimestre=anterior)]
→ "En el trimestre anterior el promedio fue 7.2. Subió 0.6 puntos 📈"
```

**Tool MCP requerida:**
- `get_my_students@v1` (para desambiguación multi-hijo y verificación de permisos al inicio del flujo)
- `get_grades@v1` (trimestre actual + anterior para comparación)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre tiene múltiples hijos y la consulta es genérica | "¿Me preguntás por [Nombre1] o [Nombre2]?" — siempre antes de llamar la tool académica |
| Hay contexto previo en el thread sobre un hijo | Asume el hijo mencionado sin preguntar |
| El padre pide notas de "los dos" | Responde con las notas de ambos (verificando `can_view_grades` para cada uno) |
| Tutor sin `can_view_grades` para ese alumno | "No tenés habilitado el acceso a las calificaciones de [nombre]. Para más información, comunicate con secretaría." |
| Notas no liberadas (config. del tenant) | Informa la política de visibilidad de la institución |
| Alumno de nivel inicial | Reemplaza notas por hitos de desarrollo — lenguaje diferente |
| Caída significativa entre trimestres | Alerta contextual + contexto de observaciones pedagógicas si las hay |

**Principio III:** Solo el tutor con `can_view_grades=true` puede ver notas de sus propios hijos.
