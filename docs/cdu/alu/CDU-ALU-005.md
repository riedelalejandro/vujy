# CDU-ALU-005 — Ver tareas pendientes (Primaria 2do ciclo)

← [Volver al índice](../README.md)

---

## CDU-ALU-005 — Ver tareas pendientes (Primaria 2do ciclo)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Alumno de 2do ciclo de primaria
**Canales:** App

**Trigger:** El alumno consulta qué tiene pendiente. Ejemplos: "¿Qué tareas tengo para mañana?", "¿Cuáles son mis misiones?".

**Flujo conversacional:**
```
Alumno: "¿Qué tareas tengo para mañana?"

Asistente: [llama get_tasks@v1(alumno_id, solo_pendientes=true)]
→ "Para mañana tenés:
   - Matemática: ejercicios 3 y 4 de la página 48
   - Lengua: traer el libro 'El hombre que calculaba'
   ¿Querés que te explique alguno?"
```

**Tool MCP requerida:**
- `get_tasks@v1`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin tareas | "No tenés tareas para mañana. ✅" |
| Tarea atrasada | "Hay un ejercicio que no completaste. ¿Lo hacemos ahora?" |
| Material adjunto en una tarea | Muestra el material disponible en la app |

**Principio III:** El alumno solo puede ver sus propias tareas.
