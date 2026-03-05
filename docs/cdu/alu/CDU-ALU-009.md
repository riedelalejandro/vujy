# CDU-ALU-009 — Explicación de contenido curricular (Secundaria)

← [Volver al índice](../README.md)

---

## CDU-ALU-009 — Explicación de contenido curricular (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno no entiende un tema y consulta al asistente. Ejemplos: "Explicame la revolución francesa como si fuera una historia", "No entiendo las funciones cuadráticas".

**Flujo conversacional:**
```
Alumno: "No entiendo la revolución rusa, tengo historia mañana"

Asistente: "¿Qué parte no te cierra — las causas, lo que pasó durante
            la revolución, o lo que vino después?"

Alumno: "Las causas"

Asistente: [explica con contexto, adaptado al nivel]
→ "La Revolución Rusa de 1917 tenía tres problemas acumulándose:
   1. El zar gobernaba de forma absoluta y no escuchaba al pueblo
   2. Rusia estaba perdiendo la Primera Guerra Mundial
   3. Millones pasaban hambre mientras la nobleza vivía bien
   ¿Algo de esto no te queda claro? ¿O querés que veamos la diferencia
   entre la revolución de febrero y la de octubre?"
```

**Tool MCP requerida:**
- RAG sobre materiales de clase del docente
- LLM sin tools externas (explicación pedagógica general del nivel)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno pide que le haga el TP | "No te escribo el trabajo — sí puedo ayudarte a entender el tema." |
| Alumno frustrado | Reconoce la frustración antes de responder el contenido |
| Sin materiales de clase en RAG | "No tengo los apuntes de tu clase, pero te explico el tema de forma general." |
| Tema fuera del scope educativo | Redirige al contexto escolar con amabilidad |
