# CDU-PAD-013 — Consulta del diario del día (nivel inicial)

← [Volver al índice](../README.md)

---

## CDU-PAD-013 — Consulta del diario del día (nivel inicial)

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Padre / Tutor de alumno de nivel inicial
**Canales:** App · Web · WhatsApp (fotos requieren app o browser con cámara; web muestra el diario en modo lectura)

**Trigger:** El padre quiere saber qué hizo el hijo en el jardín. Ejemplos: "¿Qué hizo Sofi hoy en el jardín?", "¿Subió la seño fotos?".

**Flujo conversacional:**
```
Padre: "¿Qué hizo Sofi hoy?"

Asistente: [RAG sobre diario visual del día de la sala de Sofi]
→ "El diario de hoy en la sala de Sofi:
   La seño Gabi dejó un resumen: 'Hoy trabajamos con texturas — arroz,
   arena y algodón. A Sofi le encantó tocar el algodón y estuvo muy
   concentrada. También hicimos la ronda con la canción nueva.'
   [3 fotos adjuntas en la app]
   Sofi completó: actividad de asociación de colores."
```

**Tool MCP requerida:**
- RAG (diario visual del día, observaciones de la docente)
- Función de recuperación de multimedia del día

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La docente no cargó el diario | "La seño Gabi no publicó el diario de hoy todavía. Suele hacerlo antes de las 15hs." |
| Padre en WhatsApp | Recibe el resumen textual; las fotos requieren la app |
