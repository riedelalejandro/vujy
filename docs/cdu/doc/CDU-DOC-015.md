# CDU-DOC-015 — Barrera de horarios: filtrar mensajes de padres fuera de horario laboral

← [Volver al índice](../README.md)

---

## CDU-DOC-015 — Barrera de horarios: filtrar mensajes de padres fuera de horario laboral

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Docente (protección) · Padre (contención)
**Canales:** App · Web · WhatsApp

**Trigger:** Un padre envía un mensaje a la docente fuera del horario laboral (ej: 22:30). El asistente intercepta y gestiona.

**Flujo conversacional:**
```
[Perspectiva del padre — WA 22:30]

Padre: "Seño, no sé cómo está Mati con la lectura, me tiene preocupado"

Asistente (hacia el padre): "Entiendo la preocupación, Pablo.
   Según lo que tengo, en la última evaluación de Lengua Mati sacó 7,
   y la seño observó que está trabajando en comprensión de textos.
   ¿Esta información te ayuda o necesitás hablar específicamente con la seño?"

Padre: "Quiero hablar con la seño"

Asistente: "La seño trabaja de lunes a viernes hasta las 18h. Tu mensaje
            le va a llegar mañana a la mañana. ¿Lo envío?"

[Perspectiva de la docente — mañana 8:15am]

Asistente (hacia la seño): "Seño, Pablo García (papá de Mati) escribió anoche.
   Quiere hablar sobre la lectura de Mati. ¿Querés responder ahora?"
```

**Tool MCP requerida:**
- `get_notas` (para responder la consulta del padre sin molestar a la docente)
- `get_comunicados` (mensajes pendientes)
- `enviar_comunicado` (cuando la docente responde en horario)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La consulta es urgente (hijo lastimado) | Pasa el filtro y notifica a la docente con prioridad alta |
| La docente quiere ver todos los mensajes sin filtro | Configurable en preferencias |
| El padre insiste repetidamente fuera del horario | El asistente mantiene el límite con amabilidad |
