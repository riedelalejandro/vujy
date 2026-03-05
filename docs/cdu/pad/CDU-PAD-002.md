# CDU-PAD-002 — Consulta de agenda del día siguiente

← [Volver al índice](../README.md)

---

## CDU-PAD-002 — Consulta de agenda del día siguiente

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta qué tiene el hijo al día siguiente o en una fecha específica. Ejemplos: "¿Qué tiene mañana?", "¿Qué tiene Mati el lunes?", "¿Necesita llevar algo mañana?".

**Flujo conversacional:**
```
Padre: "¿Qué tiene mañana Mati?"

Asistente: [llama get_my_students(guardian_id)]
           — Si el tutor tiene >1 hijo Y la consulta no nombra al hijo explícitamente
             Y no hay contexto previo en el thread → preguntar:
             "¿Me preguntás por [Nombre1] o [Nombre2]?"
           — Si nombra explícitamente al hijo → resolver directamente.
           — Si pide la agenda de "los dos" / "todos" → responder con ambos.

Asistente: [llama get_calendario(alumno_id, desde=mañana, hasta=mañana)]
           [llama get_tareas(alumno_id, solo_pendientes=true) en paralelo]
→ "Mañana jueves Mati tiene:
   - Matemática, Lengua, Ed. Física, Ciencias
   - Ed. Física: llevar ropa deportiva y zapatillas
   - Matemática: traer la ficha impresa (te la mandé el lunes)
   - Lengua: tiene entrega del TP el viernes, hoy podría avanzar
   ¿Querés que te mande la ficha de nuevo?"

Padre: "Sí"

Asistente: [recupera el adjunto del sistema y lo envía]
→ "Acá está: [Ficha_Matematica.pdf]"
```

**Tool MCP requerida:**
- `get_my_students` (para desambiguación multi-hijo al inicio del flujo)
- `get_calendario`
- `get_tareas`
- `get_comunicados` (para recordatorios de materiales a llevar)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre tiene múltiples hijos y la consulta es genérica | "¿Me preguntás por [Nombre1] o [Nombre2]?" — siempre antes de llamar la tool académica |
| Hay contexto previo en el thread sobre un hijo | Asume el hijo mencionado sin preguntar |
| El padre pide la agenda de "los dos" | Responde con la agenda de ambos hijos |
| La fecha consultada es feriado | "El lunes es feriado, no hay clases." |
| El padre consulta por "esta semana" | Devuelve resumen de los próximos 5 días hábiles |
| No hay nada especial ese día | Responde con el horario estándar del grado si está disponible |
| El adjunto no está en el sistema | "No encuentro ese archivo. Podés pedírselo directamente a la seño." |
