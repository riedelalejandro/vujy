# CDU-ALU-001 — Actividad visual interactiva mediada (Inicial)

← [Volver al índice](../README.md)

---

## CDU-ALU-001 — Actividad visual interactiva mediada (Inicial)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de nivel inicial (mediado por adulto o docente)
**Canales:** App (experiencia táctil-visual)

**Trigger:** El niño o el adulto que lo acompaña abre la app de actividades del día.

**Flujo conversacional:**
```
[App — Sala de 4 años — en casa con mamá]

[Pantalla: avatar de Vujy (animalito), botón grande "¿Jugamos?"]

[El niño toca el botón]

Asistente (voz): "¡Hola Sofi! La seño nos mandó un juego divertido.
                  ¿Listos para jugar?"

[Pantalla: imagen de 4 animales]

Asistente (voz): "¿Cuál de estos animales dice 'muuuu'? ¡Tocalo!"

[Sofi toca la vaca]

Asistente (voz): "¡Muy bien, Sofi! ¡Es la vaquita! ¡Ganaste una estrellita!"

[Después de completar]

Asistente (voz): "¡Terminaste todas las actividades de hoy!
                  Tu mascota está muy contenta."

[Notificación automática al tutor]
"Sofi completó 3 actividades hoy. Reconoció todos los animales de granja."
```

**Tool MCP requerida:**
- Actividades asignadas por la docente (precargadas)
- `registrar_observacion_pedagogica` (automático basado en resultados — para la docente)
- Notificación al tutor (progreso del día)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El niño no puede completar por frustración | Aliento: "¡Casi! ¿Intentamos de nuevo? No hay apuro." — nunca hace sentir mal al niño |
| El niño repite opciones incorrectas 3 veces | Feedback visual de la respuesta correcta — refuerzo positivo siempre |
| Sin actividades asignadas (la docente no cargó) | La app muestra actividades de repaso del día anterior |

**Principio III:** No hay chat libre. Todo es interacción dirigida dentro de actividades predefinidas. El adulto siempre puede ver lo que el niño ve. Las actividades del niño solo son visibles para sus tutores autorizados y su docente.
