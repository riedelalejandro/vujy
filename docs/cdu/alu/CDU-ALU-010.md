# CDU-ALU-010 — Generación de plan de estudio personalizado (Secundaria)

← [Volver al índice](../README.md)

---

## CDU-ALU-010 — Generación de plan de estudio personalizado (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno tiene una prueba próxima y pide un plan. Ejemplos: "Tengo prueba de física el jueves, ¿me armás un plan?", "¿Por dónde empiezo a estudiar?".

**Flujo conversacional:**
```
Alumno: "Tengo física el jueves y no sé por dónde empezar"

Asistente: [llama get_calendar@v1(alumno_id) para verificar la evaluación]
           [llama get_grades@v1(alumno_id, materia="Física") para ver rendimiento previo]
→ "Tenés la prueba de Física el jueves 12/3 — quedan 3 días.
   Basándome en tus notas, el tema más flojo es Energía.
   Plan propuesto:
   - Hoy: repasar Fuerza y Leyes de Newton (1hs)
   - Miércoles: repasar Energía cinética y potencial (1.5hs) + simulacro
   ¿Lo activamos?"

Alumno: "Sí"

Asistente: [llama generate_study_plan@v1(alumno_id, evaluacion_id, dias_disponibles=3)]
→ "Plan activado ✅. Te recuerdo mañana a las 19hs para el primer bloque."
```

**Tool MCP requerida:**
- `get_calendar@v1`
- `get_grades@v1`
- `generate_study_plan@v1`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Quedan menos de 24 horas para la prueba | Adapta el plan a lo razonablemente posible en el tiempo disponible |
| Varias pruebas en la misma semana | Genera un plan que cubra todas con distribución de tiempo equitativa |
| Alumno no sabe de qué es la prueba | "¿Podés revisar el cuaderno para ver qué temas entran?" |
