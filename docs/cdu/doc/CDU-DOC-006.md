# CDU-DOC-006 — Generación de informe pedagógico trimestral

← [Volver al índice](../README.md)

---

## CDU-DOC-006 — Generación de informe pedagógico trimestral

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · Web (la revisión y edición de borradores requiere interfaz mayor que WhatsApp)

**Trigger:** La docente solicita el borrador del informe de un alumno al cierre del trimestre. Ejemplo: "Generame el informe de Lucas para el primer trimestre".

**Flujo conversacional:**
```
Seño: "Generame el informe de Lucas para el 1er trimestre"

Asistente: "Lucas tiene 4 observaciones y 3 notas cargadas. Generando borrador..."

Asistente: [llama generate_pedagogical_report@v1(alumno_id, trimestre=1, anio=2026, estilo="descriptivo_primaria")]
→ "Borrador del informe de Lucas:
   ---
   Lucas muestra un progreso notorio en Lengua, particularmente en
   comprensión lectora. Ha logrado inferir el significado de palabras
   a partir del contexto sin apoyo externo, habilidad que en el
   trimestre anterior requería mediación docente...
   ---
   ⚠️ Requiere tu revisión antes de publicar.
   ¿Lo aprobás, lo editás o querés que reformule alguna sección?"

Seño: "Agregar que mejoró en trabajo en equipo"

Asistente: [actualiza el borrador con el nuevo párrafo]
→ "Agregado. ¿Lo aprobamos así?"

Seño: "Aprobado"

Asistente: "Informe de Lucas aprobado ✅. Guardado para publicar al boletín."
```

**Tool MCP requerida:**
- `generate_pedagogical_report@v1`
- `record_pedagogical_note@v1` (datos de entrada precargados)
- RAG sobre observaciones del trimestre

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Pocas observaciones (<3) | "Lucas solo tiene 1 observación. El informe puede quedar muy escueto. ¿Agregamos ahora o seguimos?" |
| Generar todos los informes del grado | "Voy a generar 28 borradores. ¿Arrancamos?" — cada uno requiere aprobación individual |
| Informe ya publicado | Advierte y pide confirmación para generar una versión revisada |
| Nivel inicial | Usa estilo "narrativo_inicial" — sin notas numéricas, con hitos de desarrollo |
| Alumno con conducta problemática | El borrador evita lenguaje estigmatizante; la docente puede agregar contexto |
