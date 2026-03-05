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

## Especificaciones de features

Las especificaciones de features se encuentran en `specs/###-feature-name/`:

| Feature | Estado |
|---------|--------|
| [001-educational-platform](specs/001-educational-platform/spec.md) | Spec completa — pendiente planificación |

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
