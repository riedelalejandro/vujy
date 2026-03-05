# CDU-PAD-005 — Firma de autorización digital

← [Volver al índice](../README.md)

---

## CDU-PAD-005 — Firma de autorización digital

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App (firma digital requiere app) · WhatsApp (notificación + derivación a app)

**Trigger:** El padre recibe una autorización pendiente o la consulta directamente. Ejemplos: notificación push de autorización pendiente, "¿Tengo algo para firmar?".

**Flujo conversacional:**
```
[Notificación push: "Mati necesita tu autorización para la salida al Jardín Botánico"]

Asistente: "Tenés una autorización pendiente:
            Salida educativa: Jardín Botánico
            Fecha: viernes 20/3 | Costo: $4.500 | Vuelve: 17:30
            Llevar: vianda, repelente, ropa cómoda.
            ¿Autorizás la participación de Mati?"

Padre: "Sí"

Asistente: [llama firmar_autorizacion(autorizacion_id, familia_id, aprobado=true)]
→ "Autorización firmada ✅. El costo de $4.500 se agregó a tu cuenta."
```

**Tool MCP requerida:**
- `firmar_autorizacion`
- `get_calendario` (para mostrar contexto del evento)
- `get_estado_cuenta` (referencia al costo)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre rechaza | Registra aprobado=false, notifica a la docente |
| Plazo de firma vencido | "El plazo venció el [fecha]. Contactá a secretaría." |
| El padre tiene una pregunta antes de firmar | Ofrece redirigir la consulta a la docente dentro del sistema |
