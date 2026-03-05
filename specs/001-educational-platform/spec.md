# Feature Specification: Vujy — Plataforma Educativa con Asistente IA

**Feature Branch**: `001-educational-platform`
**Created**: 2026-03-04
**Status**: Draft
**Input**: Derived from SPEC.md — Plataforma educativa integral con asistente conversacional IA
para instituciones privadas argentinas (inicial, primaria y secundaria).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Asistente Conversacional del Padre vía WhatsApp (Priority: P1)

Un padre o madre puede consultar el estado académico y administrativo de su hijo, reportar
ausencias y pagar cuotas directamente desde WhatsApp, sin necesidad de descargar ninguna app.

**Why this priority**: Es el diferencial competitivo central y el canal de adopción con fricción
cero. Sin esta funcionalidad Vujy es otra plataforma más. La adopción depende de que el padre
no tenga que cambiar su comportamiento actual (ya usa WhatsApp).

**Independent Test**: Un padre envía "¿Cómo le fue a Mati esta semana?" por WhatsApp y recibe
un resumen de asistencia, notas y tareas pendientes sin abrir ninguna app ni registrarse en
ningún portal.

**Acceptance Scenarios**:

1. **Given** un padre registrado, **When** envía "¿Cuánto debo de cuota?" por WhatsApp,
   **Then** el asistente responde con el saldo pendiente y ofrece la opción de pagar en el
   mismo chat.
2. **Given** un padre, **When** escribe "Mati no va a ir mañana", **Then** el asistente
   registra la ausencia, notifica a la docente y pregunta si quiere recibir las tareas del día.
3. **Given** un padre, **When** consulta "¿Qué tiene que llevar mañana?", **Then** el
   asistente cruza calendario, materias y comunicados y responde con información contextual.
4. **Given** un padre, **When** consulta "¿Cuándo es la próxima reunión de padres?",
   **Then** el asistente informa la fecha y ofrece confirmar asistencia en la misma conversación.

---

### User Story 2 - Asistente Conversacional de la Docente (Priority: P1)

Una docente puede registrar asistencia, enviar comunicados y cargar notas mediante voz o texto
natural desde WhatsApp o la app, sin formularios ni navegación manual.

**Why this priority**: Compartido P1 con US1 — sin reducir la burocracia docente el producto
pierde su principal diferencial para el actor más crítico en la adopción institucional.

**Independent Test**: Una docente dicta "Hoy faltaron Mati y Sofi" y el sistema registra las
ausencias y notifica a los padres de ambos alumnos, sin que ella toque ningún formulario.

**Acceptance Scenarios**:

1. **Given** una docente autenticada, **When** dicta "Mandá comunicado a 3ro B, el viernes hay
   acto, vengan de blanco", **Then** el asistente genera el texto institucional, la docente lo
   aprueba con un tap y el comunicado llega a todos los padres con confirmación de lectura.
2. **Given** una docente, **When** ingresa "Notas de matemática: Mati 8, Sofi 9, Juani 6",
   **Then** el sistema registra las notas y actualiza los promedios automáticamente.
3. **Given** una docente al cierre de trimestre, **When** solicita el borrador de informe de
   un alumno, **Then** el asistente genera un borrador basado en las observaciones acumuladas
   para revisión y aprobación de la docente antes de ser compartido.
4. **Given** una docente, **When** pide "una trivia de 8 preguntas sobre fotosíntesis para 5to",
   **Then** el asistente genera la actividad en menos de 2 minutos, lista para revisión y
   publicación.

---

### User Story 3 - Gestión de Morosidad y Pagos para el Administrador (Priority: P2)

Un administrador puede ver en tiempo real el estado de morosidad, lanzar recordatorios
escalonados automáticos y ofrecer planes de pago mediante consulta conversacional o dashboard.

**Why this priority**: Impacto directo en el flujo de caja del administrador, quien toma la
decisión de compra. Segundo MVP crítico tras el asistente conversacional.

**Independent Test**: Un administrador pregunta "¿Quiénes deben más de un mes?" y recibe la
lista inmediata con montos, pudiendo enviar un recordatorio masivo en la misma conversación.

**Acceptance Scenarios**:

1. **Given** un administrador autenticado, **When** accede al dashboard de morosidad, **Then**
   ve en tiempo real las familias morosas con monto y antigüedad de deuda, sin exportar reportes.
2. **Given** una familia con dos meses de deuda acumulada, **When** el sistema detecta el patrón,
   **Then** envía recordatorios escalonados automáticos (amable → firme) sin intervención manual.
3. **Given** un administrador, **When** solicita "Generá plan de pago en 3 cuotas para familia
   López", **Then** el sistema genera la propuesta y la envía a los padres para confirmación.
4. **Given** un administrador, **When** consulta "¿Cuánto voy a recaudar este mes?", **Then**
   recibe una proyección de flujo de caja basada en el comportamiento histórico de pagos.

---

### User Story 4 - Alertas Proactivas de Riesgo de Deserción (Priority: P3)

El administrador recibe alertas automáticas cuando una familia presenta señales combinadas de
riesgo de baja, con recomendación de acción concreta, antes de que sea demasiado tarde.

**Why this priority**: Diferencial de inteligencia conectada — implementable una vez que los
módulos de asistencia, pagos y comunicación (US1–US3) estén operativos como fuentes de datos.

**Independent Test**: El sistema genera una alerta sobre una familia en riesgo sin que el
administrador haya consultado, con suficiente contexto para tomar acción inmediata.

**Acceptance Scenarios**:

1. **Given** una familia con morosidad creciente + alumno con 4 ausencias en 5 días + padre
   que no abre comunicados hace un mes, **When** el sistema cruza los datos, **Then** genera
   una alerta proactiva al administrador con resumen y acción sugerida.
2. **Given** el administrador recibe la alerta, **When** responde "Agendame una reunión con la
   familia", **Then** el asistente coordina la reunión y notifica a la familia.

---

### User Story 5 - Experiencia Gamificada del Alumno (Priority: P4)

Alumnos de todos los niveles acceden a actividades educativas gamificadas publicadas por su
docente, con progreso visible adaptado a su edad (mascota en inicial, misiones en primaria,
portfolio en secundaria).

**Why this priority**: Aumenta el valor percibido por la institución y contribuye a la
retención de familias; depende de que el sistema docente (US2) esté operativo primero.

**Independent Test**: Un alumno de primaria completa una misión de matemáticas generada por su
maestra desde la app sin intervención de ningún adulto, y la docente ve el resultado en su panel.

**Acceptance Scenarios**:

1. **Given** una docente que publicó una trivia de ciencias, **When** el alumno abre la app,
   **Then** ve la actividad disponible, la completa y recibe feedback inmediato con puntos o
   progreso visual acorde a su nivel.
2. **Given** un alumno de secundaria, **When** consulta "No entiendo la división de polinomios",
   **Then** recibe una explicación paso a paso con un ejercicio de práctica contextualizado con
   el contenido de su clase.
3. **Given** un niño de inicial (3–5 años), **When** accede a la pantalla de actividades,
   **Then** ve una interfaz completamente visual y auditiva sin texto, con íconos grandes, voz
   narradora y feedback sonoro positivo.

---

### Edge Cases

- **Asistente no puede resolver**: El sistema MUST escalar a una persona humana de la
  institución, pasándole el contexto completo de la conversación.
- **Contenido IA incorrecto**: Todo contenido generado por IA (informes, comunicados) MUST
  requerir aprobación humana explícita; no existe envío automático sin confirmación.
- **Perfil de alumno desde teléfono del padre**: El sistema MUST distinguir entre perfiles;
  el asistente de alumnos menores opera con guardarraíles de privacidad independientes.
- **Alumno sin dispositivo propio (inicial)**: La experiencia del nivel inicial opera a través
  del perfil del padre o de la pantalla compartida de la sala; no requiere dispositivo propio.
- **Administrador de múltiples instituciones**: Los datos de cada institución MUST estar
  completamente aislados, incluso si un usuario administra más de una.
- **Comunicado sin revisión docente**: El tap de aprobación MUST ser obligatorio; no existe
  camino de envío automático sin confirmación explícita.

## Requirements *(mandatory)*

### Functional Requirements

**Actor: Padre / Tutor**

- **FR-001**: El padre MUST poder consultar notas, asistencia, tareas y saldo de cuota
  mediante lenguaje natural desde WhatsApp y la app, sin completar formularios.
- **FR-002**: El padre MUST poder reportar la ausencia de su hijo desde WhatsApp con
  confirmación automática a la docente correspondiente.
- **FR-003**: El padre MUST recibir resúmenes proactivos semanales sin solicitarlos,
  incluyendo eventos próximos, tareas y novedades relevantes para su hijo.
- **FR-004**: El padre MUST poder iniciar un pago de cuota desde el chat o la app, con
  historial de pagos descargable.
- **FR-005**: El padre MUST poder confirmar asistencia a reuniones y firmar autorizaciones
  digitales desde su dispositivo móvil.

**Actor: Docente**

- **FR-006**: La docente MUST poder registrar la asistencia de toda su clase mediante dictado
  por voz o texto en menos de 30 segundos.
- **FR-007**: La docente MUST poder crear y enviar comunicados mediante dictado natural, con
  borrador generado automáticamente para revisión y aprobación explícita antes del envío.
- **FR-008**: La docente MUST poder cargar notas de múltiples alumnos en un único mensaje de
  voz o texto, con actualización automática de promedios.
- **FR-009**: La docente MUST poder registrar micro-observaciones cualitativas sobre alumnos
  durante el trimestre; al cierre, el sistema MUST generar un borrador de informe pedagógico
  por alumno basado en esas observaciones, para revisión y aprobación docente.
- **FR-010**: La docente MUST poder crear actividades interactivas (trivias, completar
  espacios, ordenar secuencias, entre otros) mediante interfaz conversacional en menos de
  2 minutos.

**Actor: Administrador / Dueño**

- **FR-011**: El administrador MUST ver un dashboard de morosidad en tiempo real con filtros
  por antigüedad de deuda y estado de familia.
- **FR-012**: El sistema MUST enviar recordatorios de pago automáticos y escalonados
  (amable → firme) sin intervención manual del administrador.
- **FR-013**: El administrador MUST poder consultar proyecciones de flujo de caja y simular
  escenarios financieros (variaciones de arancel, de matrícula) mediante consulta
  conversacional.
- **FR-014**: El sistema MUST generar alertas proactivas de riesgo de deserción cruzando
  datos de asistencia, comportamiento de pago y apertura de comunicados.
- **FR-015**: El administrador MUST poder generar documentación regulatoria requerida
  (informes de matrícula, asistencia, planta funcional) mediante solicitud conversacional.

**Actor: Alumno**

- **FR-016**: El alumno MUST acceder a actividades educativas gamificadas publicadas por su
  docente, con interfaz adaptada a su nivel educativo y edad.
- **FR-017**: El alumno de secundaria MUST poder consultar al asistente como tutor personal,
  con respuestas contextualizadas con el contenido de su clase y su historial académico.
- **FR-018**: El alumno MUST visualizar su progreso de manera comprensible para su edad
  (mascota que crece en inicial; misiones y monedas en primaria; portfolio en secundaria).

**Plataforma y seguridad**

- **FR-019**: Cada institución MUST poder configurar el asistente por perfil (tono,
  herramientas habilitadas, permisos de visibilidad de datos) desde un panel sin código.
- **FR-020**: El asistente configurado para alumnos menores MUST tener guardarraíles que
  impidan contenido fuera del contexto educativo y acceso a datos de otros alumnos.
- **FR-021**: Todo contenido generado por IA destinado a distribución MUST requerir
  aprobación humana explícita antes de ser enviado a destinatarios.
- **FR-022**: La configuración de perfil y el estado del asistente MUST ser consistentes
  en los tres canales: app nativa, web y WhatsApp.
- **FR-023**: Los datos de cada institución MUST estar completamente aislados y no ser
  accesibles desde ningún otro tenant bajo ninguna circunstancia.

### Key Entities *(include if feature involves data)*

- **Institución**: Tenant aislado con configuración propia del asistente por perfil, niveles
  educativos activos, arancel y documentación regulatoria.
- **Usuario**: Persona con uno o más roles en la institución (administrador, directivo,
  docente, padre, alumno); tiene configuración de asistente según su rol activo.
- **Alumno**: Miembro de la institución con nivel educativo, sala/grado/año asignado, legajo
  digital e historial académico acumulado.
- **Comunicado**: Mensaje institucional con emisor, destinatarios (por grado o individual),
  contenido, fecha de envío y estado de lectura por destinatario.
- **Cuota / Pago**: Obligación financiera de una familia con monto, vencimiento, estado
  (pendiente / pagado / vencido) e historial de transacciones.
- **Asistencia**: Registro diario por alumno (presente / ausente / tarde) con notificación
  automática a padres en caso de ausencia no justificada.
- **Calificación**: Evaluación de un alumno por materia y período, con promedio calculado
  automáticamente y alerta ante caída significativa respecto al período anterior.
- **Observación pedagógica**: Nota cualitativa de un docente sobre un alumno en un momento
  específico; alimenta la generación de informes de trimestre.
- **Actividad**: Tarea interactiva gamificada con tipo, nivel educativo objetivo, respuestas
  y estado de completado por alumno.
- **Conversación**: Historial de interacciones de un usuario con el asistente, con contexto
  acumulado por sesión y perfil para respuestas contextualizadas.
- **Alerta**: Notificación proactiva generada por cruce de datos (riesgo de deserción,
  inasistencias, morosidad) dirigida al actor responsable de actuar.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un padre resuelve su consulta más frecuente (notas, asistencia, cuota) desde
  WhatsApp en menos de 60 segundos, sin abrir ninguna app ni portal web.
- **SC-002**: Una docente registra la asistencia de toda su clase en menos de 30 segundos
  mediante dictado de voz o texto.
- **SC-003**: Una docente envía un comunicado desde el dictado inicial hasta la entrega a los
  padres en menos de 2 minutos.
- **SC-004**: El administrador visualiza el estado de morosidad completo de la institución en
  tiempo real sin exportar ningún reporte.
- **SC-005**: El sistema genera alertas de riesgo de deserción antes de que el administrador
  identifique manualmente las familias en riesgo.
- **SC-006**: El 80% de las consultas rutinarias de padres (notas, asistencia, cuota,
  calendario) son respondidas por el asistente sin intervención humana.
- **SC-007**: La tasa de apertura de comunicados institucionales supera el 70% dentro de las
  primeras 24 horas post-envío.
- **SC-008**: Ningún feature destinado a docentes o padres requiere más de 2 minutos de
  aprendizaje para un usuario nuevo sin capacitación previa.
- **SC-009**: El 100% del contenido generado por IA (informes pedagógicos, comunicados) pasa
  por revisión y aprobación humana explícita antes de ser distribuido.
- **SC-010**: Los datos de una institución son completamente inaccesibles desde el contexto
  de cualquier otra institución en la plataforma.
