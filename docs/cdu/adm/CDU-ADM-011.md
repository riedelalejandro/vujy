# CDU-ADM-011 — Gestión de personal y masa salarial

← [Volver al índice](../README.md)

---

## CDU-ADM-011 — Gestión de personal y masa salarial

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin consulta impacto financiero de decisiones de personal. Ejemplos: "¿Cuánto es la masa salarial?", "Si tomo un docente más, ¿cómo impacta?".

**Flujo conversacional:**
```
Admin: "Si tomo un docente más para desdoblar 4to, ¿cómo impacta?"

Asistente: [llama simulate_financial_scenario@v1 con parámetro de nuevo docente]
→ "Impacto de contratar un docente para desdoblar 4to grado:
   Masa salarial actual: $4.200.000/mes
   Costo estimado nuevo docente (medio turno): $280.000/mes
   Nueva masa salarial: $4.480.000/mes (+6.7%)
   Ratio salarios/recaudación: actual 41.7% → nuevo 44.4%
   El umbral de sostenibilidad es 50% — todavía hay margen."
```

**Tool MCP requerida:**
- `simulate_financial_scenario@v1`
- Datos de personal (función futura — no en API-SPEC actual)
