# CDU-ADM-012 — Encuestas de satisfacción / NPS escolar

← [Volver al índice](../README.md)

---

## CDU-ADM-012 — Encuestas de satisfacción / NPS escolar

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Administrador / Sistema (análisis post-evento)
**Canales:** App · Web

**Trigger:** Post-evento (reunión de padres, fin de trimestre) o consulta directa. Ejemplos: "Lanzá encuesta post-reunión", "¿Cómo está el NPS este trimestre?".

**Flujo conversacional:**
```
Admin: "¿Cómo está la satisfacción este trimestre?"

Asistente: "NPS Escolar — 1er trimestre 2026:
            Score: 62 (era 71 el trimestre anterior) ↓
            Positivo: instalaciones (9.1), actividades (8.8)
            Negativo: comunicación docente 3ro B (6.2) — mencionado por 8 familias.
            ¿Querés ver el detalle de 3ro B o preparar un plan de acción?"
```

**Tool MCP requerida:**
- Analytics de encuestas (función futura — no en API-SPEC actual)
- `get_institutional_alerts@v1` (si se detecta problema en grado específico)
- `send_announcement@v1` (para enviar la micro-encuesta a padres)
