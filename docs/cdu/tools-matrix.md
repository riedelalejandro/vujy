# Vujy CDU — Matriz de Tools por Perfil

← [Volver al índice](README.md)

---

## Matriz de Tools MCP

| Tool MCP | PAD | DOC | ADM | ALU |
|----------|-----|-----|-----|-----|
| `get_resumen_alumno` | 001, 011, 016 | 008 | — | 003 |
| `get_notas` | 008, 012, 016 | 004, 008, 009, 013 | — | 007, 008, 010, 013 |
| `get_asistencia` | 009 | 008, 009 | 001, 009, 010 | — |
| `get_estado_cuenta` | 003, 007 | — | 002, 004 | — |
| `get_calendario` | 002, 005 | 014 | — | 007, 010, 011 |
| `get_comunicados` | 006, 010 | 010 | 001 | — |
| `get_tareas` | 001, 002, 004, 012, 013 | — | — | 005, 006, 007 |
| `registrar_ausencia` | 004 | 001 | — | — |
| `tomar_asistencia_grado` | — | 001, 002 | — | — |
| `enviar_comunicado` | 010, 015 | 003, 010, 013 | 003, 004, 007 | — |
| `cargar_nota` | — | 004 | — | — |
| `procesar_pago` | 003 | — | — | — |
| `firmar_autorizacion` | 005 | — | — | — |
| `confirmar_reinscripcion` | 007 | — | — | — |
| `registrar_observacion_pedagogica` | — | 005, 012 | — | — |
| `generar_informe_pedagogico` | — | 006 | — | — |
| `generar_actividad_educativa` | — | 007, 014 | — | 011, 014, 015 |
| `generar_comunicado_borrador` | — | 003 | 003, 004 | — |
| `generar_plan_estudio` | 014 | — | — | 010 |
| `get_dashboard_morosidad` | — | — | 001, 002, 003, 009, 013 | — |
| `get_riesgo_desercion` | — | — | 002, 005, 007 | — |
| `simular_escenario_financiero` | — | — | 006, 011, 013 | — |
| `get_alertas_institucionales` | 014 | 009, 016 | 001, 007, 009 | — |
| RAG curricular | — | 011 | — | 004, 009 |
| RAG observaciones | 013, 014, 016 | 006 | — | 013 |
| RAG materiales de clase | 013 | — | — | 006, 009, 011 |
| RAG reglamento institucional | — | — | — | — |

---

## Resumen de CDUs por Perfil y Prioridad

| Perfil | P1 | P2 | P3 | Total |
|--------|----|----|-----|-------|
| Padre / Tutor | 8 (001-008, 015) | 6 (009-014) | 2 (015-016) | 16 |
| Docente | 7 (001-007) | 9 (008-016) | 0 | 16 |
| Admin / Directivo | 7 (001-007) | 6 (008-013) | 1 (014) | 14 |
| Alumno | 5 (001-002, 007-009, 016) | 6 (003-006, 012-014) | 2 (006, 015) | **16** |
| Cross-Perfil | 1 (002) | 2 (001, 003) | 1 (004) | 4 |
| **Total** | **28** | **29** | **6** | **66** |

> Nota: La numeración exacta de los CDU de cada prioridad puede variar marginalmente según cómo se reagrupen CDUs que son de base+extension. El total de 66 es la métrica relevante.
