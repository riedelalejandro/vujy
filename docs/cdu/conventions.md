# Vujy CDU — Convenciones y Leyenda

← [Volver al índice](README.md)

---

## Prefijos de ID

| Prefijo | Perfil |
|---------|--------|
| `CDU-PAD` | Padre / Tutor |
| `CDU-DOC` | Docente (jardinera, maestra primaria, profesor secundaria salvo indicación) |
| `CDU-ADM` | Administrador / Directivo / Secretaría |
| `CDU-ALU` | Alumno |
| `CDU-CROSS` | Flujo cross-perfil |

## Prioridad

| Valor | Criterio |
|-------|----------|
| **P1 (MVP)** | Fase 2 del go-to-market: asistente conversacional, comunicados, pagos/morosidad |
| **P2** | Fase 3: actividades gamificadas, dashboard administrativo, informes pedagógicos |
| **P3** | Fase 4 o diferenciación competitiva avanzada |

## Origen (trazabilidad multiagente)

| Tag | Significado |
|-----|-------------|
| `[Base]` | Presente en el agente conservador; respaldado por FRs y user stories del SPEC |
| `[Extension]` | Aportado por el agente mid-level; amplía un CDU base con valor claro |
| `[Innovation]` | Aportado por el agente creativo; diferenciación competitiva viable |

## Canales habilitados por perfil

| Perfil | App | Web | WhatsApp |
|--------|-----|-----|----------|
| Padre / Tutor | Sí | Sí | Sí |
| Docente | Sí | Sí | Sí |
| Administrador / Directivo | Sí | Sí | Sí (solo comunicaciones institucionales/operativas) |
| Alumno | Sí | No | **No** (menores — NON-NEGOTIABLE) |

## Nota sobre Principio III (Privacidad de Menores)

> **CRÍTICO.** Toda CDU que involucre datos de alumnos debe respetar estrictamente las siguientes reglas derivadas del Principio III de la Constitución de Vujy:
> - El padre/tutor solo puede ver datos de sus propios hijos. Nunca datos de otros alumnos.
> - El docente solo puede ver alumnos de sus propios grados/cursos.
> - El alumno solo puede ver sus propios datos académicos. Nunca datos de otros alumnos.
> - Las conversaciones del alumno son confidenciales. Las alertas al equipo de orientación incluyen solo el patrón observable, nunca el contenido literal del chat.
> - El canal WhatsApp está vedado para alumnos (menores de edad) de forma absoluta.
> - Los datos de benchmark entre escuelas son estrictamente agregados y anonimizados.

## Paridad UI para perfiles de staff (Corolario del Principio II)

> **OBLIGATORIO para ADM y DOC.** Derivado del Corolario del Principio II de la Constitución:
> - Toda acción que el asistente pueda ejecutar para los perfiles **ADM** y **DOC** MUST tener una ruta equivalente mediante formulario, dashboard o flujo guiado en **app y web**.
> - La conversación es la ruta preferida; la UI estructurada es el fallback garantizado.
> - Los perfiles **PAD** y **ALU** están excluidos de este requisito: su experiencia puede ser predominantemente conversacional o exclusiva de app.
> - Todo CDU de perfil ADM o DOC MUST declarar `App · Web` en su campo **Canales** como mínimo. WhatsApp es opcional según la naturaleza del CDU.
