# CDU-CROSS-003 — El alumno no entiende algo y la docente recibe el dato

← [Volver al índice](../README.md)

---

## CDU-CROSS-003 — El alumno no entiende algo y la docente recibe el dato

**Perfiles:** Alumno → Sistema → Docente
**Prioridad:** P2 | **Origen:** `[Innovation]`
**Canales:** App (alumno) → App (docente, siguiente mañana)

**Descripción:** El asistente detecta que un alumno no pudo resolver un tema después de 2+ intentos, y notifica al docente de forma agregada para que pueda reforzarlo en clase.

**Flujo conversacional:**
```
[Perspectiva del alumno — App]

Alumno: "No entiendo nada de las funciones cuadráticas"

Asistente: [explica el concepto, el alumno hace ejercicios, sigue sin entender]

[Después del segundo intento fallido]

Asistente: "A veces algunos temas necesitan que lo explique el profe en persona.
            ¿Querés que le avise que tenés dudas con este tema?"

Alumno: "Bueno"

[Perspectiva de la docente — siguiente mañana — App]

Asistente: "Profe, 3 alumnos de 4to A tuvieron dificultades con funciones
            cuadráticas ayer en el asistente. Los 3 intentaron 2+ veces sin resolver.
            ¿Querés repasar el tema hoy en clase?"

Docente: "Sí. ¿Quiénes son?"

Asistente: "Tomás Fernández, Lucía García y Pedro Ruiz."
```

**Tool MCP requerida:**
- LLM (explicación del concepto)
- Detección de "alumno no resuelve tras 2+ intentos"
- `record_pedagogical_note@v1` (automático: "dificultad detectada con funciones cuadráticas")
- Notificación al docente

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El alumno no quiere que se avise al profe | El asistente respeta su decisión pero mantiene la observación en forma agregada |
| El tema es difícil para 5+ alumnos | El asistente escala como patrón de clase, no individual |

**Principio III:** El asistente puede avisar a la docente que "X alumnos tuvieron dificultad". Si el alumno no consintió, los nombres individuales se revelan solo cuando la docente los necesite para actuar pedagógicamente.
