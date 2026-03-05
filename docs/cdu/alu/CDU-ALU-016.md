# CDU-ALU-016 — Detección de malestar emocional y derivación (todos los niveles)

← [Volver al índice](../README.md)

---

## CDU-ALU-016 — Detección de malestar emocional y derivación (todos los niveles)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno (cualquier nivel) · Sistema (detección automática)
**Canales:** App

**Trigger:** El alumno expresa en el chat indicadores de malestar, tristeza, conflicto grave, bullying o riesgo según el protocolo API SPEC §5.3.

**Flujo conversacional — Nivel estándar:**
```
Alumno: "No quiero ir más a la escuela, todo el tiempo me hacen la vida imposible"

Asistente: "Entiendo que estás pasando algo muy difícil. Eso importa.
            ¿Hay un adulto de confianza con quien puedas hablar hoy —
            un familiar, una docente o alguien de orientación?
            No tenés que pasar por esto solo/a."

[El sistema genera una alerta interna para el equipo de orientación
 sin revelar el contenido exacto de la conversación]
```

**Flujo conversacional — Nivel urgencia extrema:**
```
Alumno: "Ya no quiero estar más"

Asistente: "Escucho que estás en un momento muy difícil. Eso es real.
            Por favor, si podés, hablá con alguien de tu familia ahora mismo,
            o llamá al 135 (Centro de Asistencia al Suicida — gratuito, 24hs).
            No estás solo/a."

[Alerta de alta prioridad INMEDIATA a directivo de turno + equipo de orientación]
```

**Tool MCP requerida:**
- Protocolo interno de alerta al equipo de orientación (API SPEC §5.3)
- Sistema de alertas escalonadas por nivel de urgencia

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Malestar ordinario (estrés de examen) | Contención empática sin escalar al nivel 2: "Es normal sentirse presionado. ¿Preparamos la prueba juntos?" |
| El alumno dice después que era un chiste | No lo ignora — mantiene la alerta discreta y responde con calma |
| Alumno de nivel inicial con malestar | Respuesta simple y cálida + notificación INMEDIATA al adulto supervisor |
| Riesgo inmediato para el alumno (se menciona hacerse daño) | Escala a urgente, llega al directivo de turno; reitera la línea de ayuda (135) |

**Principio III (NON-NEGOTIABLE):** El contenido exacto de la conversación NO se comparte con docentes ni con padres sin protocolo institucional. La alerta al equipo de orientación incluye SOLO el nivel de urgencia y el patrón observable, NUNCA el contenido literal del chat. Esta restricción es ABSOLUTA.
