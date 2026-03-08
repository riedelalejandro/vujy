# CDU-ALU-014 — Desafío colaborativo entre grados (Primaria)

← [Volver al índice](../README.md)

---

## CDU-ALU-014 — Desafío colaborativo entre grados (Primaria)

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Alumno de primaria (1er y 2do ciclo)
**Canales:** App

**Trigger:** La docente lanza un desafío de grado vs. grado o el asistente informa el progreso colectivo.

**Flujo conversacional:**
```
[Notificación]
"¡4to A vs. 4to B en tablas de multiplicar! 3 días."

Asistente: "¡Desafío activado!
            4to A vs. 4to B — Tablas de multiplicar.
            Puntaje actual: 4to A 42 puntos | 4to B 38 puntos.
            ¡Estamos ganando! ¿Jugamos?"

[Al finalizar el desafío]

Asistente: "4to A ganó con 128 puntos vs. 109 de 4to B.
            La seño va a anunciar el resultado mañana en clase."
```

**Tool MCP requerida:**
- `generate_learning_activity@v1` (serie de ejercicios para el desafío)
- Sistema de puntuación grupal (sin ranking individual visible al rival)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Grado con menos alumnos | La puntuación se normaliza por porcentaje de participación |
| Alumno que nunca participa | El asistente no presiona, solo invita con amabilidad |

**Principio III:** El ranking es colectivo (el grado), no individual. No se comparan alumnos individuales entre sí. Esto elimina el efecto de humillación del alumno rezagado.
