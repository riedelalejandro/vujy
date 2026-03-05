# Vujy

Plataforma educativa integral con asistente conversacional IA para instituciones privadas argentinas (nivel inicial, primaria y secundaria).

El diferencial central es un **copiloto institucional** accesible desde lenguaje natural — vía WhatsApp, app nativa o web — que conecta datos, ejecuta acciones y genera insights para todos los actores: administradores, docentes, padres y alumnos.

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/01-SPEC.md](docs/01-SPEC.md) | Especificación de producto completa |
| [docs/02-API-SPEC.md](docs/02-API-SPEC.md) | API del asistente: system prompts, tools, RAG, guardarraíles |
| [docs/03-BENCHMARKING.md](docs/03-BENCHMARKING.md) | Benchmarking competitivo del mercado EdTech argentino |
| [docs/04-WHATSAPP-API.md](docs/04-WHATSAPP-API.md) | Evaluación de integración WhatsApp Business API |
| [docs/05-ARCHITECTURE.md](docs/05-ARCHITECTURE.md) | Arquitectura técnica: stack, multi-tenancy, auth, IA, infra |
| [docs/06-AI-MODELS.md](docs/06-AI-MODELS.md) | Comparativa de modelos IA (Claude, GPT, Gemini, Grok) |
| [docs/cdu/README.md](docs/cdu/README.md) | Catálogo de CDUs por perfil (73 casos de uso) |
| [docs/08-DATA-MODEL.md](docs/08-DATA-MODEL.md) | Modelo de datos: familias, tutores y alumnos (schema, permisos, casos de borde) |
| [docs/09-MCP-DEFINITIONS.md](docs/09-MCP-DEFINITIONS.md) | Catálogo canónico MCP/tools por perfil, contratos I/O y errores |
| [docs/10-MCP-SCHEMAS.md](docs/10-MCP-SCHEMAS.md) | JSON Schemas publicados (input/output) para tools canónicas |

## Especificaciones de features

Actualmente no hay una carpeta `specs/` versionada en este repositorio. La especificación funcional vigente está centralizada en [docs/01-SPEC.md](docs/01-SPEC.md).

## Desarrollo

Este proyecto usa el flujo **speckit** para diseño y desarrollo:

1. `/speckit.specify` — definir user stories y criterios de aceptación
2. `/speckit.clarify` — resolver ambigüedades
3. `/speckit.plan` — plan de implementación y modelo de datos
4. `/speckit.tasks` — lista de tareas ordenada por dependencias
5. `/speckit.implement` — ejecución

Ver la [constitución del proyecto](.specify/memory/constitution.md) para principios rectores y decisiones de arquitectura.

## Estado actual

- Fase: Especificación / Planificación
- MVP priorizado: asistente conversacional (padre + docente) vía WhatsApp → comunicados → pagos y morosidad
- Dominio: [vujy.app](https://vujy.app)
