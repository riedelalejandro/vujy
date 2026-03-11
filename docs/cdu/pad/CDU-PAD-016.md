# CDU-PAD-016 — Trayectoria acumulada del hijo (multi-año)

← [Volver al índice](../README.md)

---

## CDU-PAD-016 — Trayectoria acumulada del hijo (multi-año)

**Prioridad:** P3 | **Origen:** `[Innovation]`
**Actor:** Padre / Tutor
**Canales:** App · Web · WhatsApp (resumen textual)

**Trigger:** El padre quiere una visión longitudinal del hijo. Ejemplos: "¿Cómo viene Mati en general?", "Mostrá la trayectoria de Mati desde que entró al colegio".

**Flujo conversacional:**
```
Madre: "Quiero ver cómo viene Mati desde que entró al colegio"

Asistente: [llama get_my_students@v1(guardian_id)]
           — Si el tutor tiene >1 hijo Y la consulta no nombra al hijo explícitamente
             Y no hay contexto previo en el thread → preguntar:
             "¿Me preguntás por [Nombre1] o [Nombre2]?"
           — Si nombra explícitamente al hijo → resolver directamente.

Asistente: [llama get_grades@v1(alumno_id, todos_los_trimestres=true)]
           [RAG sobre observaciones pedagógicas históricas]
→ "Trayectoria de Mati en Colegio San Martín (2022 — 2026):
   2022 — 1er grado: Promedio 8.2. 'Gran lector desde el inicio.'
   2023 — 2do grado: Promedio 8.7. 'Fortaleció mucho Matemática.'
   2024 — 3er grado: Promedio 7.9. 'Año difícil en Lengua — recuperó al 3er trim.'
   2025 — 4to grado: Promedio 8.3 (hasta ahora). Tendencia positiva.

   Fortalezas históricas: Matemática, Ciencias Naturales.
   Áreas con más trabajo: Comprensión de textos argumentativos (Lengua, 3er-4to).

   ¿Querés ver esto como gráfico o como informe para descargar?"
```

**Tool MCP requerida:**
- `get_my_students@v1` (para desambiguación multi-hijo al inicio del flujo)
- `get_grades@v1` (histórico multi-año)
- RAG sobre observaciones pedagógicas acumuladas
- `get_attendance@v1` (histórica)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre tiene múltiples hijos y la consulta es genérica | "¿Me preguntás por [Nombre1] o [Nombre2]?" — siempre antes de llamar la tool académica |
| Hay contexto previo en el thread sobre un hijo | Asume el hijo mencionado sin preguntar |
| Datos incompletos (migración desde otra plataforma) | "Solo tenemos datos desde 2024, cuando ingresaste a Vujy." |
| Alumno recién inscripto | Muestra lo que hay desde la fecha de inscripción |
