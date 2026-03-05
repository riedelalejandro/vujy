# CDU-ADM-014 — Benchmark entre escuelas de la red

← [Volver al índice](../README.md)

---

## CDU-ADM-014 — Benchmark entre escuelas de la red

**Prioridad:** P3 | **Origen:** `[Innovation]`
**Actor:** Administrador
**Canales:** Web · App

**Trigger:** El admin quiere saber cómo está su escuela versus pares de la red. Ejemplo: "¿Cómo estamos en morosidad comparado con otras escuelas similares?".

**Flujo conversacional:**
```
Admin: "¿Cómo estamos en morosidad comparado con escuelas similares?"

Asistente: "Benchmark — Escuelas similares en Vujy
            (privadas, inicial+primaria+secundaria, GBA Norte, 250-350 alumnos):

            Tu escuela:        23% de familias con deuda
            Promedio de la red: 18%
            Mejor de la red:   11%

            Las escuelas con mejor performance disparan recordatorios
            desde el día 5 de retraso (vs. el día 15 que usás vos).
            ¿Ajustamos la configuración de recordatorios automáticos?"
```

**Tool MCP requerida:**
- `get_dashboard_morosidad` (propia escuela)
- Analytics agregados de la red (anonimizados, con consentimiento de escuelas participantes)

**Principio III (CRÍTICO):** Los datos del benchmark son estrictamente agregados y anonimizados. Ningún administrador puede ver datos individuales de otra escuela. NON-NEGOTIABLE.
