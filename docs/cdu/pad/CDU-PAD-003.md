# CDU-PAD-003 — Consulta y pago de estado de cuenta

← [Volver al índice](../README.md)

---

## CDU-PAD-003 — Consulta y pago de estado de cuenta

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta por deudas o cuotas pendientes. Ejemplos: "¿Cuánto debo?", "¿Cuándo vence la cuota?", "¿Hay algo pendiente de pago?".

**Flujo conversacional:**
```
Padre: "¿Cuánto debo?"

Asistente: [llama get_estado_cuenta(familia_id)]
→ "Estado de cuenta:
   | Concepto         | Monto   | Vencimiento | Estado    |
   | Cuota marzo      | $42.000 | 31/3        | Pendiente |
   | Salida educativa | $4.500  | 13/3        | Pendiente |
   Total: $46.500
   ¿Pagamos ahora?"

Padre: "Sí, todo"

Asistente: "Voy a procesar el pago de $46.500 con la tarjeta guardada
            (terminada en 4521). ¿Confirmás?"

Padre: "Sí"

Asistente: [llama procesar_pago(familia_id, items_ids=[...], metodo_pago="tarjeta_guardada")]
→ "Pago procesado ✅. Comprobante disponible en la app."
```

**Tool MCP requerida:**
- `get_estado_cuenta`
- `procesar_pago` (solo con confirmación explícita del usuario)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin método de pago guardado | "No tenés tarjeta guardada. Podés agregar una desde la sección de pagos." |
| Pago parcial | Lista los ítems y deja elegir cuál pagar |
| El pago falla (error Mercado Pago) | "Hubo un problema. El cargo no se realizó. Intentá de nuevo o usá otro método." — nunca registra el pago como exitoso si falló |
| Sin deuda | "Estás al día. No tenés pagos pendientes." |
| Deuda > 2 meses | Deriva contextualmente a secretaría para plan de pago |
