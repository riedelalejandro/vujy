# CDU-PAD-001 — Consulta de resumen semanal del hijo

← [Volver al índice](../README.md)

---

## CDU-PAD-001 — Consulta de resumen semanal del hijo

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · Web · WhatsApp

**Trigger:** El padre pregunta en lenguaje natural por el estado general del hijo en la semana. Ejemplos: "¿Cómo le fue a Mati esta semana?", "¿Cómo viene Sofi?", "Contame de Mati".

**Flujo conversacional:**
```
Padre: "¿Cómo le fue a Mati esta semana?"

Asistente: [llama get_my_students@v1(guardian_id)]
           — Si el tutor tiene >1 hijo Y la consulta no nombra al hijo explícitamente
             Y no hay contexto previo en el thread → preguntar:
             "¿Me preguntás por [Nombre1] o [Nombre2]?"
           — Si nombra explícitamente al hijo → resolver directamente.
           — Si pide resumen de "los dos" / "todos" → responder con ambos.

Asistente: [llama get_student_summary@v1(alumno_id, periodo="semana_actual")]
→ "Semana de Mati (4to B):
   Asistencia: 4/5 días (faltó el miércoles, ya justificado).
   Notas: Sacó 9 en Matemática el jueves. Muy bien.
   La seño dejó un comentario: 'Mati participó mucho en la clase de ecosistemas.'
   Tareas pendientes: TP de Lengua para el viernes.
   ¿Querés ver las tareas o las notas completas del trimestre?"

Padre: "Las notas completas"

Asistente: [llama get_grades@v1(alumno_id, trimestre=actual)]
→ [Tabla con notas por materia y promedio]
```

**Tool MCP requerida:**
- `get_my_students@v1` (para desambiguación multi-hijo al inicio del flujo)
- `get_student_summary@v1` (periodo: semana_actual)
- `get_grades@v1` (si el padre profundiza)
- `get_tasks@v1` (si el padre pregunta por pendientes)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre tiene múltiples hijos y la consulta es genérica | "¿Me preguntás por [Nombre1] o [Nombre2]?" — siempre antes de llamar la tool académica |
| Hay contexto previo en el thread sobre un hijo | Asume el hijo mencionado sin preguntar |
| El padre pide resumen de "los dos" | Responde con el resumen de ambos hijos |
| Semana recién iniciada (pocos datos) | Responde con lo disponible y aclara "Es temprano en la semana" |
| Docente no dejó observaciones | Responde con asistencia y notas, omite observaciones sin fabricar contenido |
| Error de backend | "No pude obtener ese dato ahora. Intentá en unos minutos o consultá a secretaría." |
| Notas no liberadas aún (config. del tenant) | "Las notas del trimestre se publican al cierre. Puedo mostrarte el trimestre anterior." |

**Principio III:** El asistente solo puede acceder a datos del alumno vinculado al padre autenticado.
