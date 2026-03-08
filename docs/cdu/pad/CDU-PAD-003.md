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

Asistente: [llama get_account_status@v1(familia_id)]
→ "Estado de cuenta:
   | Concepto         | Monto   | Vencimiento | Estado    |
   | Cuota marzo      | $42.000 | 31/3        | Pendiente |
   | Salida educativa | $4.500  | 13/3        | Pendiente |
   Total: $46.500"

           — Verificar can_make_payments en guardian_students para este tutor.

           Si can_make_payments=false →
→ "Si querés realizar el pago, cualquier otro tutor autorizado de la familia puede hacerlo."
   [No ofrecer opción de pago; fin de flujo de cobro]

           Si can_make_payments=true →
→ "¿Pagamos ahora?"

Padre: "Sí, todo"

Asistente: "Voy a procesar el pago de $46.500 con la tarjeta guardada
            (terminada en 4521). ¿Confirmás?"

Padre: "Sí"

Asistente: [llama process_payment@v1(familia_id, items_ids=[...], metodo_pago="tarjeta_guardada")]
→ "Pago procesado ✅. Comprobante disponible en la app."
```

**Tool MCP requerida:**
- `get_account_status@v1`
- `process_payment@v1` (solo con confirmación explícita del usuario; solo si `can_make_payments=true`)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Tutor sin `can_make_payments` | Muestra el saldo pero no ofrece la opción de pago: "Si querés realizar el pago, cualquier otro tutor autorizado de la familia puede hacerlo." |
| Sin método de pago guardado | "No tenés tarjeta guardada. Podés agregar una desde la sección de pagos." |
| Pago parcial | Lista los ítems y deja elegir cuál pagar |
| El pago falla (error Mercado Pago) | "Hubo un problema. El cargo no se realizó. Intentá de nuevo o usá otro método." — nunca registra el pago como exitoso si falló |
| Sin deuda | "Estás al día. No tenés pagos pendientes." |
| Deuda > 2 meses | Deriva contextualmente a secretaría para plan de pago |
