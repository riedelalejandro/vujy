# CDU-ADM-006 — Simulación de escenario financiero

← [Volver al índice](../README.md)

---

## CDU-ADM-006 — Simulación de escenario financiero

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere modelar el impacto de cambios en cuota, matrícula o costos. Ejemplo: "Simulame qué pasa si subo la cuota 15% y pierdo 10 alumnos".

**Flujo conversacional:**
```
Admin: "Simulame qué pasa si subo 15% y pierdo 10 alumnos"

Asistente: [llama simulate_financial_scenario@v1(escuela_id, variacion_cuota_pct=15,
            variacion_alumnos=-10)]
→ "Simulación financiera:
   Estado actual: 240 alumnos × $42.000 = $10.080.000/mes
   Escenario (+15%, -10): 230 alumnos × $48.300 = $11.109.000/mes
   Diferencia: +$1.029.000/mes ✅
   El punto de equilibrio se mantiene incluso con 15 bajas.
   ¿Querés modelar otro escenario o ver el impacto en masa salarial?"

Admin: "Y si pierdo 25 alumnos?"

Asistente: [llama simulate_financial_scenario@v1 con variacion_alumnos=-25]
→ "Con 25 bajas: 215 alumnos × $48.300 = $10.384.500/mes (+$304.500).
   Todavía positivo pero margen mínimo."
```

**Tool MCP requerida:**
- `simulate_financial_scenario@v1`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Escenario con resultado negativo | Lo muestra con honestidad: "En este escenario la recaudación baja $X." |
| Admin quiere comparar dos escenarios | Genera tabla comparativa lado a lado |
| Admin quiere sumar cargo adicional (materiales) | Parámetro concepto_adicional={nombre, monto} |
