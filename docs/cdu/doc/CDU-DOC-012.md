# CDU-DOC-012 — Registro del diario visual del día (nivel inicial)

← [Volver al índice](../README.md)

---

## CDU-DOC-012 — Registro del diario visual del día (nivel inicial)

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Docente de nivel inicial
**Canales:** App · Web

**Trigger:** La docente quiere publicar el resumen del día para las familias. Ejemplo: "Quiero publicar el diario de hoy", "Subí las fotos de la actividad".

**Flujo conversacional:**
```
Seño Gabi: [sube 3 fotos desde el móvil]

Asistente: "¡Lindas fotos! ¿Querés agregar un resumen del día para los papás?"

Seño: "Hoy trabajamos con texturas — arroz, arena y algodón. A los chicos les encantó."

Asistente: "Listo el diario de hoy (martes 4/3 — Sala de 5):
            'Hoy exploramos texturas: arroz, arena y algodón. Los chicos
             disfrutaron mucho tocar y comparar.'
            [3 fotos adjuntas]
            ¿Lo publicamos para las familias?"

Seño: "Sí"

Asistente: [llama send_announcement@v1 con adjuntos multimedia]
→ "Diario publicado ✅. 20 familias van a recibir la notificación."
```

**Tool MCP requerida:**
- `send_announcement@v1` (con adjuntos multimedia)
- `record_pedagogical_note@v1` (si el resumen incluye observaciones de alumnos)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin fotos | Puede publicar solo el resumen textual |
| Fotos con contenido inapropiado | Guardarraíles rechazan el contenido con mensaje claro |

**Principio III:** Las fotos de alumnos de nivel inicial solo se envían a los tutores autorizados del grupo, nunca a terceros.
