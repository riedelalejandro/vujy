# CDU-ALU-011 — Simulacro de examen (Secundaria)

← [Volver al índice](../README.md)

---

## CDU-ALU-011 — Simulacro de examen (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno tiene una prueba próxima y pide un simulacro. Ejemplos: "Haceme un simulacro de historia", "Tengo prueba de física el jueves".

**Flujo conversacional:**
```
Alumno: "Haceme el simulacro de química"

Asistente: "Simulacro de Química — Reacciones Químicas
            10 preguntas | 25 minutos ¿Empezamos?"

[Vujy presenta las preguntas de a una — el alumno responde]

[Al finalizar]

Asistente: "Resultado: 7/10. Muy bien.
            Errores: Pregunta 3 (oxidación/reducción), Pregunta 7 (fórmula del agua).
            Estos 2 temas son los más importantes para estudiar esta noche.
            ¿Querés que te explique cada uno?"
```

**Tool MCP requerida:**
- RAG sobre materiales de clase
- `generate_learning_activity@v1` (tipo: simulacro)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin materiales del docente | Genera preguntas del currículo general del nivel; lo aclara |
| Alumno abandona a mitad | Se guarda el progreso; puede retomarlo |
| Alumno pide ver las respuestas antes de terminar | "Cuando termines, te las muestro todas." |
| Alumno repite el mismo simulacro | Mezcla las preguntas y varía los distractores |
