# CDU-PAD-014 — Alerta proactiva: hijo con caída académica

← [Volver al índice](../README.md)

---

## CDU-PAD-014 — Alerta proactiva: hijo con caída académica

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Sistema → Padre / Tutor (iniciado por el sistema al detectar caída)
**Canales:** Push notification · App · WhatsApp

**Trigger:** El sistema detecta que el alumno bajó 2 o más puntos entre trimestres consecutivos o entre evaluaciones. El padre no preguntó nada.

**Flujo conversacional:**
```
[Push notification — sábado 10:00]
"Mati bajó en Lengua. Hablemos."

Asistente: "Quería contarte algo sobre Mati: en Lengua pasó de 8.5 (1er trim.)
            a 6 (2do trim.). La seño observó: 'Le está costando la comprensión
            de textos argumentativos. Necesita más práctica en casa.'
            No es una crisis, pero conviene atenderlo ahora.
            ¿Querés que:
            A) Te arme un plan de actividades cortas para hacer en casa
            B) Le mande un mensaje a la seño para coordinar apoyo
            C) Ver el detalle completo de sus notas de Lengua"

Padre: "A"

Asistente: [llama generate_study_plan@v1(alumno_id, materia="Lengua", dias=semana_actual)]
→ [Plan semanal con actividades cortas para el hogar]
```

**Tool MCP requerida:**
- `get_grades@v1` (comparativa entre trimestres — detección de caída)
- `get_institutional_alerts@v1` (disparador)
- `generate_study_plan@v1` (si el padre elige opción A)
- RAG sobre observaciones pedagógicas

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Caída por una sola evaluación mala | No dispara la alerta — espera confirmar tendencia con 2+ puntos de datos |
| La docente no dejó observación | Avisa la caída pero sin contexto cualitativo |
| Padre ya sabe y no quiere más alertas | Configurable en perfil de notificaciones |

**Principio III:** La alerta llega solo a los tutores autorizados del alumno en cuestión.
