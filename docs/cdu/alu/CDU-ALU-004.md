# CDU-ALU-004 — Explicación de tema de clase (Primaria 2do ciclo)

← [Volver al índice](../README.md)

---

## CDU-ALU-004 — Explicación de tema de clase (Primaria 2do ciclo)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Alumno de 2do ciclo de primaria
**Canales:** App

**Trigger:** El alumno no entiende un tema y lo consulta. Ejemplo: "No entiendo la división con dos cifras", "¿Qué son las fracciones equivalentes?".

**Flujo conversacional:**
```
Alumno: "No entiendo las fracciones equivalentes"

Asistente: "Tranquilo, lo vemos juntos. Imaginá que tenés una pizza.
            Si la cortás en 2 y comés 1 parte, comiste 1/2.
            Si la misma pizza la cortás en 4 y comés 2 partes — ¿comiste
            más o menos? Lo mismo, ¿no? Eso es 2/4... y 2/4 = 1/2.
            Son fracciones equivalentes.
            ¿Lo probamos con un ejercicio?"

Alumno: "Sí"

Asistente: "¿Cuánto es 3/6? ¿Es equivalente a 1/2?"

[Alumno responde]

Asistente: "¡Exacto! 3/6 = 1/2. Lo entendiste perfectamente. 🌟"
```

**Tool MCP requerida:**
- RAG sobre materiales de clase (para contextualizar al contenido que están viendo)
- LLM sin tools externas (respuesta educativa general del nivel)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno pide que le haga la tarea | "No te puedo dar la respuesta, porque así no aprendés. Pero te ayudo a llegar." |
| Pregunta fuera del contexto escolar | "Eso no es algo que pueda explicarte. Si tenés dudas de clase, con gusto te ayudo." |
| Alumno frustrado | "Entiendo que es difícil. Vamos de a poco — ¿qué parte no te queda claro?" |
| Alumno menciona malestar | Activa protocolo de bienestar (CDU-ALU-011) |
