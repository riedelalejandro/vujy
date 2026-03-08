# CDU-ADM-004 — Generación de plan de pago para familia morosa

← [Volver al índice](../README.md)

---

## CDU-ADM-004 — Generación de plan de pago para familia morosa

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere ofrecer un plan de pago a una familia con deuda. Ejemplo: "Generá plan de pago en 3 cuotas para familia López".

**Flujo conversacional:**
```
Admin: "Generá plan de pago en 3 cuotas para familia Pérez"

Asistente: [llama get_account_status@v1(familia_id="fam_perez")]
→ "Familia Pérez — Deuda total: $126.000 (3 cuotas atrasadas)
   Plan de pago sugerido — 3 cuotas:
   | Cuota | Monto   | Vencimiento |
   | 1ra   | $42.000 | 15/3        |
   | 2da   | $42.000 | 15/4        |
   | 3ra   | $42.000 | 15/5        |
   Sin interés (política actual).
   ¿Aprobás y notificamos a la familia?"

Admin: "Sí, pero en 4 cuotas"

Asistente: [ajusta el plan con 4 cuotas]
→ "Plan actualizado. Enviando propuesta a la familia Pérez ✅."
```

**Lógica de notificación del plan acordado:**
Al enviar la propuesta de plan de pago, el sistema:
1. Contacta primero al tutor con `is_primary_contact = true` de la familia.
2. Copia la comunicación a todos los demás tutores de la familia con `can_make_payments = true`.

Cualquier tutor con `can_make_payments = true` puede efectuar los pagos del plan.

**Tool MCP requerida:**
- `get_account_status@v1`
- `generate_announcement_draft@v1` (propuesta al tutor)
- `send_announcement@v1`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La familia ya tiene un plan activo | Informa el plan existente y pregunta si se desea modificar |
| La familia rechaza el plan | Registra el rechazo y escala a directivo si hay riesgo de deserción |
| La familia no tiene tutor con `is_primary_contact=true` | Notifica a todos los tutores con `can_make_payments=true` |
