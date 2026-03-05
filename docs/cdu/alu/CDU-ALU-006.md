# CDU-ALU-006 — Generar flashcards para estudio (Primaria 2do ciclo)

← [Volver al índice](../README.md)

---

## CDU-ALU-006 — Generar flashcards para estudio (Primaria 2do ciclo)

**Prioridad:** P3 | **Origen:** `[Base]`
**Actor:** Alumno de 2do ciclo de primaria
**Canales:** App

**Trigger:** El alumno quiere repasar un tema con tarjetas. Ejemplo: "Armame tarjetas para repasar los ríos de América".

**Flujo conversacional:**
```
Alumno: "Armame tarjetas para repasar los ríos de América"

Asistente: [RAG sobre materiales de clase + LLM]
→ "Acá van tus tarjetas:
   Tarjeta 1/5: ¿Cuál es el río más largo de América del Sur?
   [El alumno responde]
   Respuesta: El Amazonas (~6.400 km)
   ¿Pasamos a la siguiente?"
```

**Tool MCP requerida:**
- RAG sobre materiales de clase
- Módulo de flashcards con repetición espaciada (SRS)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Tema no visto en clase aún | "Todavía no trabajaron ese tema. ¿Querés que igual te arme tarjetas para adelantar?" |
