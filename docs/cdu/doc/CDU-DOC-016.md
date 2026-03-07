# CDU-DOC-016 — Alerta de bienestar emocional de alumno

← [Volver al índice](../README.md)

---

## CDU-DOC-016 — Alerta de bienestar emocional de alumno

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Sistema → Docente (confidencial)
**Canales:** App · Web (solo visible para la docente — acceso discreto, sin exposición en listados generales)

**Trigger:** El sistema detecta combinación de señales preocupantes en un alumno: aumento de ausencias, cese abrupto de interacción en la plataforma, y señales de malestar en conversaciones del alumno.

**Flujo conversacional:**
```
[App — push discreto para la docente]

Asistente: "Seño, quería comentarle algo sobre Valentina Gómez.
            En los últimos 10 días:
            - Faltó 4 veces (antes tenía asistencia perfecta)
            - Dejó de completar actividades en la app
            - Sus conversaciones con el asistente mostraron palabras
              relacionadas con tristeza y aislamiento
              (no puedo mostrarle el contenido exacto — privacidad)
            El equipo de orientación también fue notificado.
            ¿Querés que agende una charla con Valentina para el martes?"
```

**Tool MCP requerida:**
- `get_asistencia` (histórica del alumno)
- Señales de bienestar del asistente del alumno (alertas anonimizadas — protocolo API SPEC §5.3)
- `get_alertas_institucionales` (tipo: bienestar)
- `enviar_comunicado` (al equipo de orientación)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Señales ambiguas | "No es una situación crítica, pero hay un patrón que vale la pena atender." |
| La docente pide más contexto de las conversaciones | "Por privacidad del alumno no puedo mostrar las conversaciones, solo el patrón observable." |

**Principio III (CRÍTICO):** Las conversaciones del alumno son estrictamente confidenciales. La alerta a la docente incluye SOLO el patrón de comportamiento observable, NUNCA el contenido literal del chat. Esto es NON-NEGOTIABLE.
