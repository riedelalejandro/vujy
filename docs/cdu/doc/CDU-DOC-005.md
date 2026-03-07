# CDU-DOC-005 — Registro de observación pedagógica

← [Volver al índice](../README.md)

---

## CDU-DOC-005 — Registro de observación pedagógica

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · Web · WhatsApp

**Trigger:** La docente dicta o escribe una observación sobre un alumno durante o después de la clase. Ejemplos: "Mati participó mucho en ciencias, le interesan los planetas" / "Sofi confunde la d y la b".

**Flujo conversacional:**
```
Seño: "Mati avanzó mucho en reconocimiento de números esta semana, llegó al 10"

Asistente: [llama registrar_observacion_pedagogica(alumno_id, texto="...", area="matematica")]
→ "Guardé la observación de Mati:
   '3/3 — Avanzó en reconocimiento numérico hasta el 10.'
   Ya tenés 4 observaciones de Mati este trimestre.
   ¿Hay algún otro alumno del que quieras dejar nota?"

Seño: "También que Sofi confunde la d y la b todavía"

Asistente: [llama registrar_observacion_pedagogica(alumno_id=alu_sofi, texto="...", area="lenguaje")]
→ "Guardado. ¿Seguimos con otro alumno?"
```

**Tool MCP requerida:**
- `registrar_observacion_pedagogica`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Observación sobre el grupo completo | "¿Esta observación es para el grupo o para un alumno en particular?" |
| Observación socioemocional delicada | Registra con discreción y pregunta: "¿Querés que notifique a orientación?" |
| Múltiples observaciones seguidas | Procesa una por una, confirmando cada una |
| Alumno no reconocido | "No encontré ese alumno en tu sala. ¿Podés confirmar el nombre completo?" |
