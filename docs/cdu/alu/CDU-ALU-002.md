# CDU-ALU-002 — Misión diaria gamificada (Primaria 1er ciclo)

← [Volver al índice](../README.md)

---

## CDU-ALU-002 — Misión diaria gamificada (Primaria 1er ciclo)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de 1er ciclo de primaria
**Canales:** App

**Trigger:** El alumno abre la app y ve sus misiones del día asignadas por la docente.

**Flujo conversacional:**
```
[App — 2do grado, en casa]

Asistente: "¡Hola Mati! Tenés 2 misiones para hoy:
            Misión 1: Matemática — 3 sumas [5 monedas]
            Misión 2: Lectura — 5 palabras [8 monedas]
            Si completás las dos, ganás 13 monedas para tu avatar. ¿Arrancamos?"

[Mati toca Misión 1]

Asistente: "¡Misión Matemática! 5 + 3 = ?"

[Mati escribe 8]

Asistente: "¡Genial! Correcto. 7 + 4 = ?"

[Mati escribe 10]

Asistente: "Casi, Mati. 7 + 4 es 11. ¡Contá con los dedos si querés! ¿Lo intentamos?"

[Mati escribe 11]

Asistente: "¡Ahí está! ¡Lo lograste! 🎉 Ganaste 5 monedas 🪙"
```

**Tool MCP requerida:**
- `get_tareas` (misiones del día asignadas por docente)
- Módulo de actividades gamificadas
- Registro de progreso y monedas

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Respuesta incorrecta | Guía sin revelar la respuesta: "¡Casi! Contá de nuevo..." |
| Completa todas las misiones | Muestra celebración, actualiza monedas, muestra tablero del grado |
| Sin misiones asignadas | "¡Hoy no tenés misiones! Buen trabajo esta semana. ¿Querés repasar algo?" |
| Alumno pide chatear fuera del contexto | "Preguntale a tu seño o a tus papás." |

**Principio III:** El alumno solo ve sus propias misiones y monedas. Los datos de otros alumnos no son accesibles.
