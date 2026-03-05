# CDU-DOC-007 — Creación de actividad educativa gamificada

← [Volver al índice](../README.md)

---

## CDU-DOC-007 — Creación de actividad educativa gamificada

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App

**Trigger:** La docente solicita la creación de una actividad gamificada. Ejemplo: "Creame una trivia de 8 preguntas sobre fotosíntesis para 5to, dificultad media".

**Flujo conversacional:**
```
Seño: "Creame una trivia de 8 preguntas sobre fotosíntesis para 5to, dificultad media"

Asistente: [llama generar_actividad_educativa(tema="fotosíntesis", materia="Ciencias",
            grado_id="5to", tipo="trivia", cantidad_preguntas=8, dificultad="media")]
→ "Trivia 'Fotosíntesis' — 5to grado (preview de 3 preguntas):
   1. ¿Dónde ocurre la fotosíntesis? a) Raíces b) Hojas c) Tallo...
   [8 preguntas con respuestas]
   ¿La publicamos para 5to B o querés revisarla primero?"

Seño: "Publicar para 5to B"

Asistente: "Actividad publicada ✅. Los alumnos ya la ven desde su app.
            ¿La agrego a la biblioteca compartida para que otras maestras la puedan usar?"
```

**Tool MCP requerida:**
- `generar_actividad_educativa`
- RAG sobre diseño curricular (para alinear con contenidos del año)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Tipo de actividad no soportado | Informa los tipos disponibles y sugiere el más cercano |
| Docente quiere modificar preguntas | Permite edición antes de publicar |
| Tema no alineado con el currículo | Avisa: "Este tema no aparece en el diseño curricular de 5to. ¿Igual procedemos?" |
| Hay una actividad similar en la biblioteca | "Encontré una trivia similar ya creada. ¿La usás o generamos una nueva?" |
