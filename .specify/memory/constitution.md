<!--
Sync Impact Report
==================
Version change: (unversioned template) → 1.0.0
Modified principles: N/A — initial ratification; all principles derived from SPEC.md
Added sections:
  - Core Principles (6 principles derived from SPEC.md §1 and §12)
  - Arquitectura y Stack Técnico (from SPEC.md §7)
  - Flujo de Desarrollo de Producto (from SPEC.md §10)
  - Governance
Removed sections: N/A
Templates checked:
  ✅ .specify/templates/plan-template.md — Constitution Check placeholder is per-feature; no stale refs
  ✅ .specify/templates/spec-template.md — No constitution-specific refs; no updates needed
  ✅ .specify/templates/tasks-template.md — No constitution-specific refs; no updates needed
  ✅ .specify/templates/agent-file-template.md — No outdated refs; no updates needed
  ⚠ README.md — Does not exist yet; create alongside first feature delivery
Follow-up TODOs:
  - TODO(AUTH_STRATEGY): Authentication method not defined (SPEC.md §7 says "por definir")
  - TODO(DB_STRATEGY): Database and storage not defined (SPEC.md §7 says "por definir")
  - TODO(DATA_REGULATION): Argentine minor data regulation research pending (SPEC.md §13)
  - TODO(RATIFICATION_DATE): Set to 2026-03-04 (today); confirm with team if different date applies
-->

# Vuji Constitution

## Core Principles

### I. Conversación como Interfaz Primaria

Toda funcionalidad que involucre interacción con un usuario MUST ser accesible mediante
interfaz conversacional como ruta principal. Las interfaces de menú o formulario son rutas
secundarias y opcionales. Una funcionalidad NO está completa si requiere abandonar el chat
para ejecutarse. El asistente de cada perfil MUST poder resolver las acciones clave de ese
perfil sin salir de la conversación.

Rationale: La propuesta de valor central de Vuji es el copiloto institucional conversacional.
Cualquier funcionalidad que no sea conversacional degrada el diferencial competitivo.

### II. Ubicuidad Multicanal

Los journeys de usuario críticos MUST funcionar en los tres canales definidos: app nativa
(iOS/Android), web responsive y WhatsApp Business. La configuración de perfil y el estado
del asistente MUST ser consistentes entre canales. Los features exclusivos de un canal son
permitidos solo si están documentados como tales en el spec correspondiente.

Rationale: Los usuarios terminan en WhatsApp porque las plataformas existentes son
incómodas. La ubicuidad es el mecanismo de adopción, no una feature opcional.

### III. Privacidad y Seguridad de Menores (NON-NEGOTIABLE)

Todo feature que procese datos de alumnos menores de edad MUST cumplir con la normativa
argentina de protección de datos personales. El asistente configurado para alumnos menores
MUST tener guardarraíles estrictos que impidan contenido inapropiado, solicitudes fuera de
contexto educativo y acceso a datos de otros alumnos. El control parental sobre datos del
alumno MUST estar presente. La retención y uso de datos MUST ser transparente para todos
los actores.

Rationale: Datos de menores en una plataforma educativa tienen el mayor nivel de riesgo
legal y reputacional. Una brecha no es recuperable para un producto B2B vendido a escuelas.

### IV. IA con Supervisión Humana

Todo contenido generado por IA destinado a ser publicado o enviado a terceros (informes
pedagógicos, comunicados, actas, análisis financieros) MUST pasar por revisión y aprobación
explícita de un humano antes de su distribución. El sistema MUST tener siempre un camino de
escalado a persona humana cuando el asistente no puede resolver la consulta. Los usuarios
MUST saber en todo momento que están interactuando con IA.

Rationale: El asistente amplifica capacidades humanas; no las reemplaza. La confianza
institucional de las escuelas depende de que los adultos mantengan el control final.

### V. Proactividad e Inteligencia Conectada

El sistema MUST cruzar datos entre módulos (asistencia, pagos, calificaciones, comunicación)
para generar alertas, predicciones e insights sin que el usuario los solicite explícitamente.
El registro pasivo de datos sin capa de inteligencia es insuficiente. Cada módulo nuevo MUST
definir en su spec al menos un comportamiento proactivo basado en los datos que genera.

Rationale: La diferenciación frente a plataformas existentes es la inteligencia conectada.
Un sistema que solo registra no justifica el costo de la IA.

### VI. Cero Fricción en Adopción

Ningún feature para docentes o padres MUST requerir capacitación formal para ser usado.
Si una funcionalidad necesita un curso o tutorial extenso, el diseño falló. WhatsApp es el
canal de entrada preferido para adopción inicial: reduce la barrera a cero (sin descarga,
sin registro nuevo). El onboarding MUST ser gradual — no activar todas las funciones desde
el primer día.

Rationale: Las plataformas existentes tienen baja adopción porque son difíciles. La
facilidad de uso es requisito de negocio, no un nice-to-have.

## Arquitectura y Stack Técnico

Decisiones de stack aprobadas (SPEC.md §7):

- **Asistente IA**: Claude API (Anthropic) + RAG sobre datos por familia/escuela +
  function calling para ejecutar acciones
- **WhatsApp**: API oficial WhatsApp Business (Twilio / Meta directa / 360dialog)
- **Backend**: Multi-tenant — cada escuela es un tenant aislado
- **Frontend mobile**: React Native o Flutter (decisión pendiente por feature)
- **Frontend web**: Web responsive
- **Pagos**: Mercado Pago

Decisiones pendientes que MUST ser resueltas antes de iniciar implementación:

- TODO(AUTH_STRATEGY): SSO institucional deseable; método concreto por definir
- TODO(DB_STRATEGY): Base de datos y storage por definir
- TODO(INFRA): Infraestructura, CI/CD y estrategia de deployment por definir

Toda decisión de arquitectura MUST ser documentada en el `plan.md` de la feature
correspondiente con justificación explícita.

## Flujo de Desarrollo de Producto

El desarrollo de Vuji sigue el ciclo speckit en orden obligatorio:

1. `/speckit.specify` — definir user stories y criterios de aceptación
2. `/speckit.clarify` — resolver ambigüedades antes del diseño
3. `/speckit.plan` — plan de implementación, modelo de datos y contratos
4. `/speckit.tasks` — lista de tareas ordenada por dependencias
5. `/speckit.implement` — ejecución de tareas según el plan

Prioridad de MVP (SPEC.md §10 Fase 2):
1. Asistente conversacional (padre + docente) vía WhatsApp
2. Comunicados digitales con confirmación de lectura
3. Gestión de pagos y morosidad

Feature branches MUST seguir el formato `###-feature-name` (ej: `001-whatsapp-assistant`).
Todo PR MUST referenciar el `spec.md` correspondiente y pasar el Constitution Check del
`plan.md` antes de ser mergeado.

## Governance

Esta constitución es el documento rector de Vuji y supersede cualquier otra guía o práctica
de desarrollo. Es vinculante para todos los contribuidores humanos y agentes de IA del
proyecto.

**Procedimiento de enmienda**:
1. Proponer la enmienda con justificación escrita en un PR
2. Incrementar versión según semver: MAJOR = cambio de gobernanza incompatible;
   MINOR = nuevo principio o sección; PATCH = clarificación o corrección de redacción
3. Actualizar `LAST_AMENDED_DATE` a la fecha de la enmienda (formato ISO YYYY-MM-DD)
4. Ejecutar `/speckit.constitution` para propagar cambios a templates y docs dependientes

**Cumplimiento**: Todo PR y plan generado por IA MUST verificar cumplimiento con esta
constitución antes de proceder. Las violaciones de principios MUST ser justificadas
explícitamente en la tabla de Complexity Tracking del `plan.md` correspondiente o el
trabajo MUST ser rediseñado.

**Version**: 1.0.0 | **Ratified**: 2026-03-04 | **Last Amended**: 2026-03-04
