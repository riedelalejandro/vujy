# CDU-PAD-007 — Reinscripción para el ciclo siguiente

← [Volver al índice](../README.md)

---

## CDU-PAD-007 — Reinscripción para el ciclo siguiente

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre consulta sobre la reinscripción o responde a un recordatorio del sistema. Ejemplos: "¿Cómo confirmo la reinscripción de Mati?", "Quiero reinscribir a Mati para el año que viene".

**Flujo conversacional:**
```
Padre: "Quiero reinscribir a Mati para el año que viene"

Asistente: "Para confirmar la reinscripción de Mati para 5to grado (2027):
            Arancel de reinscripción: $15.000 (se descuenta de la primera cuota).
            Fecha límite: 30/3/2026.
            ¿Confirmás? (aceptás las condiciones del ciclo 2027)"

Padre: "Sí"

Asistente: [llama confirm_reenrollment@v1(alumno_id, ciclo_lectivo=2027, acepta_condiciones=true)]
→ "Reinscripción de Mati confirmada ✅. Confirmación enviada a tu email."
```

**Tool MCP requerida:**
- `confirm_reenrollment@v1`
- `get_account_status@v1` (bloqueo si hay deuda pendiente)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Período no abierto aún | "La reinscripción para 2027 todavía no está habilitada. Te avisamos cuando abra." |
| Deuda pendiente | "Hay un saldo pendiente de $42.000. ¿Lo pagamos ahora y después reinscribimos?" |
| Múltiples hijos | Ofrece reinscribir a todos en el mismo flujo, confirmación individual por hijo |
| Plazo vencido | "El período cerró el 30/3. Contactá a secretaría directamente." |
