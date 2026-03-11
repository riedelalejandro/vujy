# CDU-PAD-010 — Contacto con la docente

← [Volver al índice](../README.md)

---

## CDU-PAD-010 — Contacto con la docente

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Padre / Tutor
**Canales:** App · Web · WhatsApp

**Trigger:** El padre quiere comunicarse con la docente. Ejemplos: "Quiero hablar con la seño", "¿Puedo mandar un mensaje a la maestra?".

**Flujo conversacional:**
```
Padre: "Quiero mandar un mensaje a la seño de Mati"

Asistente: "¿Qué le querés decir a la seño Andrea?
            (Escribilo como quieras — si querés, te ayudo a redactarlo)"

Padre: "Preguntarle si la ficha de matemática se puede entregar en digital"

Asistente: "Antes de molestar a la seño — el comunicado del lunes decía que la ficha
            debe estar impresa. ¿Querés igualmente consultarle o con eso alcanza?"

Padre: "Mandalo igual"

Asistente: [genera borrador y envía vía canal docente-familia interno]
→ "Enviado. La seño lo ve en horario laboral. Te notificamos cuando responda."
```

**Tool MCP requerida:**
- `send_announcement@v1` (canal padre → docente, dentro del sistema)
- `get_announcements@v1` (para verificar si la consulta ya fue respondida en un comunicado)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Mensaje fuera de horario | Avisa que la respuesta llegará en horario escolar |
| Consulta que el asistente puede resolver | Ofrece responderla primero sin molestar a la docente |
| Tono agresivo en el mensaje | Sugiere reformulación con amabilidad, sin censurar |
