# CDU-PAD-017 — Diario visual diario del hijo (nivel inicial)

← [Volver al índice](../README.md)

---

## CDU-PAD-017 — Diario visual diario del hijo (nivel inicial)

**Prioridad:** P1 | **Origen:** `[Innovation]`
**Actor:** Padre / Tutor (receptor) · Docente de sala (emisor — ver CDU-DOC-012)
**Canales:** App · WhatsApp (solo texto + imagen, sin audio)
**Tier:** Premium
**Nivel educativo:** Inicial (salas de 3, 4 y 5 años)

**Trigger:** La jardinera completa el diario del día al cierre de la jornada. El padre recibe el diario de forma proactiva sin necesidad de pedirlo. También puede consultarlo manualmente: "¿Qué hizo Mati hoy?", "Mostrame el diario de hoy".

**Flujo conversacional:**
```
[Padre — 16:35, recibe push proactivo]

Notificación: "El diario de Mati del martes llegó 📖"

[Padre abre la app]

Asistente: [llama get_diario_inicial(alumno_id, fecha=hoy)]
→ "Diario de Mati — martes 5 de marzo

   La seño Claudia contó:
   'Hoy fue un día de mucho movimiento. Mati participó en la ronda de la mañana
   y fue uno de los primeros en reconocer el número 7 en el juego de dados.
   En el momento de juego libre eligió los bloques de construcción y armó
   una torre altísima — ¡casi llega al techo!'
   La sala trabajó los colores en una actividad con papel creppé.

   [📸 Foto 1: actividad grupal con papel creppé]
   [📸 Foto 2: momento de juego libre — torre de bloques]

   ¿Querés ver el diario de ayer?"

[Padre reacciona con ❤️ — sin texto libre disponible fuera de horario]

---

[Padre que consulta manualmente — WhatsApp, 17:20]

Padre: "¿Qué hizo Mati hoy?"

Asistente: [llama get_diario_inicial(alumno_id, fecha=hoy)]
→ "Diario de Mati de hoy:

   La seño Claudia contó:
   'Mati participó en la ronda de la mañana y reconoció el número 7 en el juego
   de dados. En juego libre armó una torre de bloques.'
   [Fotos disponibles en la app]"
```

**Tool MCP requerida:**
- `get_diario_inicial` (contenido generado por la docente, texto personalizado por alumno + fotos)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La docente no generó el diario ese día | "La seño no cargó el diario de hoy todavía. Te avisamos cuando esté disponible." (sin presionar a la docente) |
| Familia sin opt-in de fotos | Recibe solo el texto narrativo — las fotos no se muestran |
| Alumno no fue mencionado por la docente en el audio | Recibe el relato grupal del día sin mención individual — nunca se fabrica una mención |
| Padre pregunta por el diario de otro día | `get_diario_inicial(alumno_id, fecha=solicitada)` — disponible historial de los últimos 30 días |
| Padre quiere responder algo a la docente | "Los mensajes a la seño llegan a su bandeja en horario laboral. ¿Querés enviar una nota?" — deriva a CDU-PAD-010 |
| Familia sin app (solo WhatsApp) | Recibe texto + fotos comprimidas por WhatsApp; el álbum completo queda en la app |
| Escuela sin nivel inicial | Este CDU no aparece en el perfil del padre — solo se activa si el alumno está en sala |

**Condiciones de implementación (NON-NEGOTIABLE):**
- Sin reconocimiento facial bajo ninguna circunstancia — las menciones de alumnos en fotos son 100% manuales.
- Familias sin opt-in de fotos (CDU-CROSS-005) reciben únicamente el texto.
- El flag `foto_bloqueada` de un alumno bloquea su aparición en el diario de otras familias.
- El padre puede reaccionar con emoji en la app pero no con texto libre — evita conversación fuera de horario laboral.

**Principio I (conversación como interfaz):** El diario llega proactivamente sin que el padre lo pida. Es la materialización más directa del principio de proactividad para el perfil de padres de inicial.
