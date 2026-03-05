# CDU-DOC-002 — Toma de asistencia por lista (tap)

← [Volver al índice](../README.md)

---

## CDU-DOC-002 — Toma de asistencia por lista (tap)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App

**Trigger:** La docente abre la lista de asistencia y marca individualmente. Variante táctil documentada en el SPEC como "por toque".

**Flujo conversacional:**
```
Seño: "Asistencia de hoy"

Asistente: [recupera lista del grado]
→ Muestra lista con toggles. La docente toca solo los ausentes.
  "Guardás la asistencia de 4to B — 28 presentes, 2 ausentes
   (Lucas Fernández, Valentina Gómez). ¿Notificamos a los tutores?"

Seño: "Sí"

Asistente: [llama tomar_asistencia_grado(grado_id, fecha, asistencias=[...])]
→ "Asistencia guardada ✅. 2 tutores notificados."
```

**Tool MCP requerida:**
- `tomar_asistencia_grado`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La docente marca tardanza | El estado "tardanza" es válido en la tool |
| Alumnos nuevos no en la lista | Informa el caso y sugiere que secretaría actualice el legajo |
