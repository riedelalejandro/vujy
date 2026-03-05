# CDU-CROSS-002 — Suspensión de clases: alerta masiva en cascada

← [Volver al índice](../README.md)

---

## CDU-CROSS-002 — Suspensión de clases: alerta masiva en cascada

**Perfiles:** Admin → Docentes + Padres (en cascada)
**Prioridad:** P1 | **Origen:** `[Base]` `[Extension]`
**Canales:** WhatsApp + App + Push (todos los canales simultáneos)

**Flujo conversacional:**
```
[Admin — 6:30am]

Admin: "Suspendé las clases de hoy, hay un problema con la calefacción"

Asistente: "Voy a enviar alerta urgente de suspensión de clases.
            ALERTA PROPUESTA:
            Canal: WhatsApp + app + push — TODOS
            Prioridad: URGENTE
            Mensaje: 'URGENTE — Colegio San Martín: Se suspenden las clases
            de HOY 5/3 por inconveniente técnico. Clases normales mañana.'
            Destinatarios: 312 familias + 28 docentes. ¿Enviamos?"

Admin: "Sí"

Asistente: [llama enviar_comunicado(todos, prioridad=urgente, todos_canales=true)]
→ "Enviado ✅ (6:32am).
   Alcance: 186 familias por WhatsApp, 312 con push.
   Confirmaciones de lectura: 43% en los primeros 2 minutos.
   ¿Re-enviamos a los que no leyeron en 30 minutos?"

Admin: "Sí, automático"

[8:30am]
Asistente: "Resumen: 278 familias leyeron (89%). 34 sin confirmar — se les reenvió.
            12 familias aún sin confirmar. ¿Llamamos por teléfono a las de alumnos menores?"
```

**Tool MCP requerida:**
- `enviar_comunicado` (todos, prioridad urgente, todos los canales)
- `get_comunicados` (seguimiento de lectura)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Admin envía la suspensión por error | "¿Cancelamos la alerta? Solo podemos hacerlo en los primeros 2 minutos." |
| Familias sin canal digital | Genera la lista para llamado telefónico manual |
