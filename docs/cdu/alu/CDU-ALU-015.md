# CDU-ALU-015 — Tutor entre pares coordinado por IA (Secundaria)

← [Volver al índice](../README.md)

---

## CDU-ALU-015 — Tutor entre pares coordinado por IA (Secundaria)

**Prioridad:** P3 | **Origen:** `[Innovation]`
**Actor:** Alumno de secundaria (tutor y tutorado)
**Canales:** App

**Trigger:** El asistente sugiere al alumno de buen rendimiento ser tutor, o el alumno se ofrece espontáneamente.

**Flujo conversacional:**
```
[App — Renzo, 4to año, promedio 9.5 en Matemática]

[Proactivo]
Asistente: "Renzo, sos uno de los mejores en Matemática de 4to.
            ¿Te interesaría ser tutor de pares? Tu profe lo sabe y lo valora.
            El contacto es dentro de la app, con privacidad garantizada."

Renzo: "Por qué no. ¿Cómo funciona?"

[Cuando se conecta con un alumno que necesita ayuda — sin revelar identidad]

Asistente: "Renzo, tu compañero/a necesita ayuda con ecuaciones de segundo grado.
            ¿Tenés 20 minutos esta tarde?"

Renzo: "Dale, a las 18h"

Asistente: "Sesión coordinada para las 18h ✅"
```

**Tool MCP requerida:**
- `get_notas` (para identificar alumnos con alto rendimiento)
- Sistema de matching tutor-tutorado (anonimizado hasta que se acepte)
- Notificación al docente para aprobación

**Principio III (CRÍTICO):** La identidad del alumno que necesita ayuda NO se revela al tutor hasta que ambos acepten la sesión Y el docente la apruebe. Todas las interacciones son dentro de la app.
