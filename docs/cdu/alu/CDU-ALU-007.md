# CDU-ALU-007 — Vista unificada de agenda académica (Secundaria)

← [Volver al índice](../README.md)

---

## CDU-ALU-007 — Vista unificada de agenda académica (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno consulta qué tiene pendiente o esta semana. Ejemplos: "¿Qué tengo esta semana?", "¿Qué tengo pendiente?".

**Flujo conversacional:**
```
Alumno: "¿Qué tengo esta semana?"

Asistente: [llama get_tareas(alumno_id, solo_pendientes=true)]
           [llama get_calendario(alumno_id, desde=hoy, hasta=fin_semana)]
→ "Esta semana — 4 al 8 de marzo:
   Martes: Ed. Física (llevar ropa deportiva)
   Miércoles: entregar TP de Historia ⚠️
   Jueves: prueba de Física (Fuerza y Energía)
   Viernes: Lengua — leer Capítulo 3 de 'El túnel'
   ¿Querés que te arme un plan de estudio para el parcial de Física?"
```

**Tool MCP requerida:**
- `get_tareas`
- `get_calendario`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Nada pendiente | "No tenés nada pendiente para esta semana. ✅" |
| Muchas cosas el mismo día | Sugiere revisar si se puede mover alguna fecha |
| Feriado en medio de la semana | Lo indica con impacto en días disponibles para estudiar |
