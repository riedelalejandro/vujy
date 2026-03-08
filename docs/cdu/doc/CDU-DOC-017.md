# CDU-DOC-017 — Portfolio de impacto docente

← [Volver al índice](../README.md)

---

## CDU-DOC-017 — Portfolio de impacto docente

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Docente
**Canales:** App · Web
**Tier:** Premium

**Trigger:** El sistema detecta automáticamente un hito pedagógico en el curso del docente y envía una notificación privada. También el docente puede consultar su portfolio en cualquier momento: "¿Cómo vengo este trimestre?", "Mostrá mi portfolio".

**Flujo conversacional:**
```
[Notificación automática — viernes 18:00]

Asistente: "Hola Claudia. Esta semana todos en 3ro B entregaron sus tareas.
           Es la primera vez desde que arrancó el año. 💪
           Guardé este hito en tu portfolio."

---

[Docente consulta su portfolio — fin de trimestre]

Docente: "Mostrá mi portfolio del trimestre"

Asistente: [llama get_teacher_portfolio@v1(docente_id, periodo="trimestre_1_2026")]
→ "Portfolio de Claudia Méndez — 1er Trimestre 2026:

   📊 Tu curso (3ro B):
   Asistencia promedio: 91% (vs 87% promedio institucional)
   Completud de actividades: 78% (subió 12 puntos desde marzo)
   Alumnos en riesgo que recuperaron: 2 de 3 detectados en febrero

   🏆 Hitos registrados:
   ▸ 14/3 — Primera semana con 100% de entregas
   ▸ 28/3 — Valentina P. recuperó su promedio de 5 a 7 en matemática
   ▸ 2/4 — Actividad de ecosistemas con 95% de participación (la más alta del año)

   ⏱ Estimado de tiempo ahorrado con Vujy este trimestre:
   Asistencia por voz: ~3.2 hs
   Comunicados asistidos: ~1.8 hs
   Total: ~5 horas devueltas

   ¿Querés generar el PDF de tu portfolio anual?"

Docente: "Sí, pero para uso personal — no para compartir"

Asistente: [llama generate_teacher_portfolio_pdf@v1(docente_id, modo="interno")]
→ "Generando PDF... Listo.
   Contiene tus métricas de curso y hitos — sin datos nominales de alumnos.
   📄 Disponible en tu perfil para descarga."
```

**Tool MCP requerida:**
- `detect_teacher_milestone@v1` (job periódico que evalúa umbrales estadísticos)
- `record_portfolio_milestone@v1` (guarda el hito con timestamp y contexto)
- `get_teacher_portfolio@v1` (por período — trimestre o año)
- `generate_teacher_portfolio_pdf@v1` (PDF descargable, dos modos: interno / externo-anonimizado)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Docente prefiere no recibir notificaciones de hitos | Opt-out en 1 tap desde la notificación — respeta la preferencia inmediatamente |
| Hito estadísticamente cuestionable (ej. solo 3 alumnos) | No se registra — solo supera el umbral si es estadísticamente significativo (≥ 70% del grupo) |
| Docente quiere compartir portfolio externamente (LinkedIn) | Genera versión con métricas propias únicamente — sin datos de alumnos ni siquiera anonimizados hasta Fase 2 |
| Directivo quiere ver el portfolio de un docente | Solo con permiso explícito del docente — no es accesible por defecto para directivos |
| Curso nuevo sin datos históricos | "Todavía no tenés suficiente historial para el portfolio. Volvé a consultar a fin del 1er trimestre." |
| Múltiples cursos asignados | El portfolio agrupa por curso — el docente puede ver cada uno por separado o el consolidado |

**Privacidad:** El portfolio descargable en versión "externa" nunca incluye datos de alumnos, ni nombres, ni promedios individuales. Solo métricas del docente como actor (actividades creadas, tiempo ahorrado, completud de su grupo como métrica agregada).

**Principio de diseño:** La plataforma que trabaja *para* el docente, no solo *con* él. Vujy es la primera plataforma educativa argentina que devuelve al docente evidencia tangible de su propio impacto.
