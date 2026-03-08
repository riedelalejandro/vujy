# CDU-CROSS-004 — Biblioteca de actividades compartida entre escuelas

← [Volver al índice](../README.md)

---

## CDU-CROSS-004 — Biblioteca de actividades compartida entre escuelas

**Perfiles:** Docente de escuela A → Docente de escuela B
**Prioridad:** P3 | **Origen:** `[Innovation]`
**Canales:** App

**Descripción:** Una docente puede descubrir, importar y usar actividades creadas por docentes de otras escuelas de la red Vujy, y viceversa. El efecto de red mejora la calidad del contenido disponible para todos.

**Flujo conversacional:**
```
[Docente de escuela B]

Seño: "Necesito actividades de ciencias para 4to sobre el sistema solar"

Asistente: "Encontré actividades disponibles:
            De tu escuela (Colegio San Martín):
            - 'Sistema Solar — Trivia' (seño Andrea, 4to B) — 4.8/5 ⭐ usada 28 veces

            De la red de escuelas Vujy (anonimizadas):
            - 'Viaje al Sistema Solar — Secuencia' — 4.9/5 — 156 usos en 8 escuelas
            - 'Planetas: Ordenar por tamaño' — 4.6/5 — 89 usos

            ¿Abrimos la de la red con más usos para ver cómo es?"

Seño: "La uso"

Asistente: "Actividad importada a tu clase de 4to A ✅"
```

**Tool MCP requerida:**
- Biblioteca compartida de actividades (con ratings y filtros)
- `generate_learning_activity@v1` (si la docente la modifica antes de publicar)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La actividad tiene errores conceptuales | El sistema tiene reporte de errores; las actividades con reportes se revisan antes de aparecer en el ranking |
| La docente quiere aportar la suya a la biblioteca | Agrega con toggle de privacidad: solo mi escuela / toda la red |

**Principio III:** Los datos de las actividades compartidas son de contenido pedagógico únicamente. Ningún dato de alumnos o familias se comparte entre escuelas. NON-NEGOTIABLE.
