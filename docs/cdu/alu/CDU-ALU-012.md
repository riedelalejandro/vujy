# CDU-ALU-012 — Participación en foro de debate (Secundaria)

← [Volver al índice](../README.md)

---

## CDU-ALU-012 — Participación en foro de debate (Secundaria)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El docente publicó una pregunta en el foro y el alumno quiere participar. Ejemplo: "¿Fue inevitable la Revolución Francesa?".

**Flujo conversacional:**
```
[Notificación: "Nueva pregunta en el foro de Historia"]

Alumno: "Creo que sí fue inevitable porque la situación social estaba muy mal"

Asistente (moderador): "Buen argumento. ¿Y si el Zar hubiera hecho reformas
                         antes de 1917? ¿Seguiría siendo inevitable?"

Alumno: "Quizás no, pero las reformas eran muy lentas"

Asistente: "Interesante. Tu argumento es que el resultado a largo plazo
            justifica los medios. ¿Estás de acuerdo con esa lógica en general?"
```

**Tool MCP requerida:**
- RAG (materiales del debate, respuestas previas)
- LLM (moderación y desafío de argumentos — sin revelar "la respuesta correcta")

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El alumno escribe algo ofensivo | No lo publica, advierte al alumno; si reincide, notifica al docente |
| El alumno pide la "respuesta correcta" | "En un debate no hay una sola respuesta correcta. El objetivo es argumentar bien." |
