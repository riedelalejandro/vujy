# CDU-DOC-011 — Planificación didáctica asistida

← [Volver al índice](../README.md)

---

## CDU-DOC-011 — Planificación didáctica asistida

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · Web

**Trigger:** La docente solicita sugerencias pedagógicas. Ejemplos: "¿Qué actividades puedo hacer para introducir fracciones en 4to?", "Ayudame a planificar la unidad de ecosistemas".

**Flujo conversacional:**
```
Seño: "Ayudame a planificar la unidad de ecosistemas para 4to, tengo 4 semanas"

Asistente: [RAG sobre diseño curricular PBA / CABA para 4to grado — Ciencias Naturales]
→ "Propuesta — Ecosistemas — 4to grado — 4 semanas:
   Semana 1: ¿Qué es un ecosistema? Componentes bióticos y abióticos
   Semana 2: Cadenas y redes alimentarias
   Semana 3: Ecosistemas de Argentina (selva, pampa, Patagonia)
   Semana 4: Impacto humano y conservación — cierre con portfolio digital
   ¿Querés que genere fichas o actividades interactivas para alguna semana?"
```

**Tool MCP requerida:**
- RAG sobre diseño curricular jurisdiccional (PBA/CABA)
- `generar_actividad_educativa` (si la docente genera algo directamente)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Jurisdicción no configurada | "¿Trabajás con el diseño curricular de PBA o CABA?" |
| Tema no en el currículo oficial disponible | Responde con conocimiento general del LLM y lo aclara |
| Planificación anual completa solicitada | Advierte que puede ser extenso; ofrece generarla por sección |
