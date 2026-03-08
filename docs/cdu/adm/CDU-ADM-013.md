# CDU-ADM-013 — Proyección de flujo de caja

← [Volver al índice](../README.md)

---

## CDU-ADM-013 — Proyección de flujo de caja

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere proyectar la recaudación del mes. Ejemplo: "¿Cuánto voy a recaudar este mes?".

**Flujo conversacional:**
```
[App — 28 del mes — proactivo]

Asistente: "A 3 días del cierre de marzo, tengo la proyección:
            Recaudación proyectada: $12.8M (87% de meta)
            Ya cobrado: $11.2M
            Probable de cobrar (familias con historial tardío): $1.4M
            En riesgo real de no cobrar: $600K (patrón de no pago)
            Mes anterior fue 91%. Diferencia: 4 puntos.
            3 familias que siempre pagan entre el 28-31 no pagaron aún.
            ¿Les mando un recordatorio suave?"
```

**Tool MCP requerida:**
- `get_delinquency_dashboard@v1`
- `simulate_financial_scenario@v1` (proyección basada en historial)
- `send_announcement@v1`
