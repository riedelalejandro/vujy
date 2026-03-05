# CDU-PAD-006 — Lectura de comunicados

← [Volver al índice](../README.md)

---

## CDU-PAD-006 — Lectura de comunicados

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta por comunicados. Ejemplos: "¿Hay comunicados nuevos?", "¿Qué mandó la escuela?".

**Flujo conversacional:**
```
Padre: "¿Hay algo nuevo de la escuela?"

Asistente: [llama get_comunicados(destinatario_id, leidos=false, limite=5)]
→ "Tenés 2 comunicados sin leer:
   1. 'Acto del 25 de mayo — indumentaria' — Seño Andrea, ayer
   2. 'Reunión de padres — 20/3 a las 19hs' — Secretaría, hace 3 días
   ¿Querés confirmar asistencia a la reunión ahora?"
```

**Tool MCP requerida:**
- `get_comunicados`
- `get_calendario` (para cruzar fechas de eventos mencionados)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin comunicados sin leer | "Estás al día — no hay comunicados nuevos." |
| Comunicado urgente pendiente | Lo marca claramente y lo prioriza sobre los normales |
| El padre busca un comunicado específico | Búsqueda por RAG en historial de comunicados |
