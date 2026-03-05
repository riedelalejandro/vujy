# CDU-DOC-003 — Envío de comunicado a familias

← [Volver al índice](../README.md)

---

## CDU-DOC-003 — Envío de comunicado a familias

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · WhatsApp

**Trigger:** La docente dicta o escribe un comunicado en lenguaje natural. Ejemplo: "Mandá comunicado a 3ro B, el viernes hay acto, vengan de blanco y traigan algo para compartir".

**Flujo conversacional:**
```
Seño: "Mandá comunicado a 3ro B: el viernes hay acto, vengan de blanco
       y traigan algo para compartir"

Asistente: [llama generar_comunicado_borrador(instruccion="...", destinatarios="3ro B")]
→ "Acá está el borrador:
   Título: Acto escolar — viernes 20 de marzo
   [Cuerpo del comunicado]
   ¿Lo enviamos así o querés cambiar algo?"

Seño: "Cambiá 'algo para compartir' por 'una fruta para compartir'"

Asistente: [actualiza borrador]
→ "Actualizado. ¿Enviamos a los 28 padres de 3ro B?"

Seño: "Sí"

Asistente: [llama enviar_comunicado(titulo, cuerpo, destinatarios={grado_ids:["3B"]}, canal=["app"])]
→ "Comunicado enviado a 28 familias ✅. Te aviso cuando lleguen las confirmaciones de lectura."
```

**Tool MCP requerida:**
- `generar_comunicado_borrador`
- `enviar_comunicado`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Comunicado urgente | Cambia canal a [app, whatsapp] y prioridad a "urgente" |
| Destinatarios poco claros | "¿A quién va: solo 3ro B o toda la primaria?" |
| El comunicado tiene fecha/hora que no coincide con el calendario | El asistente valida las fechas |
| La docente quiere enviarlo por WhatsApp | Agrega canal WA si el tenant tiene el add-on; si no, informa la limitación |
