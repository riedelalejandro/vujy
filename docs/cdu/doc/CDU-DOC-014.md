# CDU-DOC-014 — Sugerencia proactiva de actividad de repaso antes de evaluación

← [Volver al índice](../README.md)

---

## CDU-DOC-014 — Sugerencia proactiva de actividad de repaso antes de evaluación

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Sistema → Docente (proactivo)
**Canales:** App (push proactivo)

**Trigger:** El asistente detecta que hay una evaluación programada en los próximos 3 días y la docente no generó actividad de repaso aún.

**Flujo conversacional:**
```
[App — lunes 9:00am — push proactivo]

Asistente: "Seño, la prueba de Matemática de 3ro B es el jueves.
            ¿Querés que genere una actividad de repaso para que los chicos
            practiquen mañana y miércoles?"

Seño: "Sí, fracciones y decimales, nivel medio"

Asistente: [genera dos actividades cortas]
→ "Publicadas ✅. Mañana: Repaso Fracciones | Miércoles: Repaso Decimales."
```

**Tool MCP requerida:**
- `get_calendario` (evaluaciones próximas)
- `generar_actividad_educativa`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La docente no quiere sugerencias proactivas | Configurable en preferencias |
| No hay evaluación cargada en el calendario | El asistente no puede disparar el trigger |
