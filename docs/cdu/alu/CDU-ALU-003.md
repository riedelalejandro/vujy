# CDU-ALU-003 — Ver progreso personal (Primaria 1er ciclo)

← [Volver al índice](../README.md)

---

## CDU-ALU-003 — Ver progreso personal (Primaria 1er ciclo)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Alumno de 1er ciclo de primaria
**Canales:** App

**Trigger:** El alumno pregunta por sus misiones o monedas. Ejemplos: "¿Cuántas monedas tengo?", "¿Cuántas misiones hice?".

**Flujo conversacional:**
```
Alumno: "¿Cuántas monedas tengo?"

Asistente: "Tenés 85 monedas 💰
            Esta semana completaste 6 misiones.
            ¡Con 100 monedas podés cambiar el sombrero de tu avatar!
            Te faltan 15 monedas. ¿Hacemos una misión ahora?"
```

**Tool MCP requerida:**
- `get_resumen_alumno` (adaptado — solo logros y gamificación, datos del alumno propio)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno pregunta por las monedas de un compañero | "Solo puedo mostrarte las tuyas." |
