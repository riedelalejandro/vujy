# Plataforma Educativa con Asistente Conversacional IA

## Especificación de Producto — Documento en Progreso

---

## 1. Visión General

Plataforma educativa integral para instituciones privadas argentinas (nivel inicial, primaria y secundaria) cuyo diferencial principal es un **asistente conversacional inteligente** como interfaz primaria de interacción para todos los actores del ecosistema educativo.

### Propuesta de valor central

Pasar de herramientas de registro pasivas a un **copiloto institucional** que conecta datos, anticipa necesidades, ejecuta acciones y genera contenido — accesible desde una conversación natural.

### Principios de diseño

- **Conversación como interfaz primaria** (no secundaria ni decorativa)
- **Ubicuidad**: app nativa, web, WhatsApp — misma experiencia, cualquier canal
- **Cero fricción**: cualquier acción en la menor cantidad de pasos posible
- **Inteligencia conectada**: datos cruzados para generar insights, no solo registrar información
- **Proactividad**: el sistema anticipa, sugiere y alerta — no espera que le pregunten
- **Configurabilidad por perfil**: tono, herramientas, permisos y skills adaptados a cada rol y nivel educativo

---

## 2. Problema que resuelve

### Contexto del mercado argentino

Las plataformas existentes (Acadeu, Blended, Aula1, Colegium, etc.) son funcionales pero frías, fragmentadas y con UX desactualizada. Los usuarios terminan en WhatsApp porque la plataforma oficial es incómoda. La comunicación está dispersa entre WhatsApp, email, cuadernos de comunicados y planillas de Excel.

### Dolores por actor

| Actor | Dolor principal |
|-------|----------------|
| Administrador/Dueño | Gestiona a ciegas: morosidad, retención, costos, regulador |
| Directivo/Coordinador | Se entera tarde de los problemas pedagógicos e institucionales |
| Docente | Pierde tiempo en burocracia en vez de enseñar |
| Padre/Madre | Información dispersa, no sabe qué pasa en la escuela |
| Alumno | Desorganización, falta de apoyo personalizado, desconexión |

---

## 3. Arquitectura del Asistente Configurable

### 3.1 Configuración por perfil

Cada institución configura el asistente para cada perfil a través de un panel visual (sin necesidad de escribir código ni prompts).

#### Dimensiones configurables

| Dimensión | Descripción | Ejemplo |
|-----------|-------------|---------|
| **Tono y personalidad** | Presets o sliders de estilo comunicativo | Inicial: cálido, dice "la seño". Secundaria: directo. Administración: profesional y conciso |
| **Tools habilitadas** | Qué acciones puede ejecutar el asistente según el perfil | Padre: consultar notas, pagar, reportar ausencia. Alumno: ver tareas, pedir explicaciones. Docente: cargar asistencia, generar comunicados |
| **Skills por nivel** | Conocimiento contextual del nivel educativo | Inicial: salas, informes narrativos, áreas de experiencia. Primaria: grados, boletines. Secundaria: materias, correlatividades, orientaciones |
| **MCPs / Integraciones** | Servicios externos conectados por perfil | Mercado Pago para admin, calendario para docentes, etc. |
| **Permisos y visibilidad** | Qué datos puede ver/acceder cada perfil | Notas en tiempo real vs. liberadas por trimestre (configurable por escuela) |

#### Perfiles del sistema

- **Administrador/Dueño**
- **Directivo/Coordinador pedagógico**
- **Docente** (con sub-variantes por nivel: jardinera, maestra primaria, profesor secundaria)
- **Preceptor** (secundaria)
- **Secretario/a administrativo/a**
- **Padre/Madre/Tutor**
- **Alumno** (con experiencia adaptada por nivel y edad)

### 3.2 Coherencia multicanal

El asistente mantiene la misma configuración de perfil sin importar el canal:
- App nativa (iOS / Android)
- Web responsive
- WhatsApp Business API
- Notificaciones push inteligentes

---

## 4. Funcionalidades por Actor

### 4.1 Padres / Tutores

#### Comunicación y seguimiento

- Cuaderno de comunicados digital con confirmación de lectura
- Chat organizado con docentes y la institución (no WhatsApp caótico)
- Notificaciones push para urgencias (el chico se siente mal, suspensión de clases)
- Resumen proactivo semanal: "La semana que viene Mati tiene prueba el miércoles, acto el viernes, y natación el martes — recordá la malla"

#### Consultas conversacionales — Ejemplos

```
"¿Cómo le fue a Mati esta semana?"
→ Resumen: asistencia, notas, tareas pendientes, comentarios de la docente.

"¿Cuánto debo de cuota?"
→ Saldo + opción de pagar ahí mismo + recordatorio de vencimientos.

"¿Qué tienen mañana?"
→ Horario, clases especiales, si necesita llevar algo, clima.

"Avisá que Mati no va a ir el lunes"
→ Registra ausencia, notifica docente, pregunta si quiere la tarea.

"¿Cuándo es la próxima reunión de padres?"
→ Fecha, hora, confirmar asistencia.
```

#### Académico

- Calificaciones y boletines digitales actualizados
- Tareas y trabajos asignados con fechas de entrega
- Contenidos y materiales de clase (PDFs, videos, fichas)
- Seguimiento del progreso con comentarios cualitativos

#### Administrativo y pagos

- Estado de cuenta de cuota con historial
- Pago online (integración Mercado Pago)
- Facturación descargable
- Reinscripción online

#### Calendario y organización

- Calendario escolar integrado (actos, feriados, reuniones, salidas)
- Autorización digital para salidas y eventos (firma desde el celular)
- Recordatorios automáticos contextuales

#### Asistencia

- Registro de asistencia diario visible
- Avisar ausencias desde la app/WhatsApp
- Seguimiento de transporte escolar (si aplica)

#### Comunidad

- Fotos y videos de actividades escolares
- Directorio de contacto de otros padres (con consentimiento)
- Encuestas y participación

#### Experiencia específica para padres de inicial

- **Diario visual del día a día**: la jardinera dicta un resumen + sube fotos → el padre recibe una "story" del día de su hijo
- **Seguimiento de hitos de desarrollo**: línea de tiempo de logros (motricidad, socialización, reconocimiento de letras/números) en vez de notas

---

### 4.2 Docentes

#### Principio rector

Devolverle tiempo a la maestra. Cada funcionalidad debe reducir burocracia, no agregarla.

#### Asistencia simplificada

- Por toque (ve la lista, marca solo los ausentes)
- Por voz: "Hoy faltaron Mati López y Sofi Ruiz" → registrado, padres notificados

#### Comunicados automatizados

- Dictado natural: "Mandá comunicado a 3ro B, el viernes hay acto, vengan de blanco y traigan algo para compartir"
- El asistente genera el texto con tono institucional, la docente aprueba con un tap
- Sale a todos los padres con confirmación de lectura

#### Registro pedagógico continuo

- Micro-observaciones por voz durante el trimestre: "Mati participó mucho en ciencias, le interesan los planetas" / "Sofi confunde la d y la b"
- **Al cierre del trimestre, el asistente genera un borrador del informe pedagógico por alumno** basado en todas las observaciones acumuladas
- La docente revisa, ajusta y aprueba

#### Planificación asistida

- El asistente sugiere actividades y secuencias didácticas basadas en el diseño curricular (PBA / CABA según jurisdicción)
- Genera fichas de trabajo y evaluaciones adaptadas
- No reemplaza el criterio docente, ahorra horas de búsqueda

#### Carga de notas inteligente

- Por voz o texto: "Notas de matemática 3ro B: Mati 8, Sofi 9, Juani 6"
- Actualización automática de promedios
- Alerta si un alumno bajó significativamente respecto al trimestre anterior

#### Barrera de horarios con padres

- El asistente del padre resuelve consultas rutinarias sin molestar a la docente
- Los mensajes que sí necesitan respuesta llegan organizados, no como audios a medianoche
- La docente responde en su horario laboral

#### Creación de actividades para alumnos

- Interfaz conversacional: "Creame una trivia de 8 preguntas sobre fotosíntesis para 5to, dificultad media"
- El asistente genera, la docente revisa y publica en < 2 minutos
- Sugerencias proactivas: "¿Querés que genere una actividad de repaso de fracciones antes de la prueba del viernes?"
- Tipos de actividades disponibles:
  - Trivias / opción múltiple
  - Verdadero/falso
  - Completar espacios en blanco
  - Ordenar secuencias
  - Asociar conceptos (unir con flechas)
  - Preguntas abiertas cortas (con evaluación automática o manual)
  - Sopas de letras y crucigramas temáticos
  - Cálculo mental con tiempo
  - Comprensión de texto
  - Actividades con imágenes y audio (inicial)
- **Biblioteca compartida**: actividades creadas por una docente pueden ser reutilizadas por otros docentes de la misma escuela o de la red de escuelas en la plataforma (efecto de red)

---

### 4.3 Administrador / Dueño de la institución

#### Principio rector

Pasar de gestionar mirando el espejo retrovisor a tener un parabrisas. Visibilidad en tiempo real, predicción e inteligencia financiera.

#### Morosidad y flujo de caja

- Dashboard de morosidad en tiempo real
- Gestión de cobranza inteligente y automatizada:
  - Recordatorios escalonados (amable → firme)
  - Detección de patrones: "siempre paga tarde pero paga" vs "acumulando deuda, probable baja"
  - Ofrecimiento automático de planes de pago
- **Proyección de flujo de caja**: "Este mes vas a recaudar ~$X basado en comportamiento histórico"
- Conversacional: "¿Quiénes deben más de un mes?" / "Mandá recordatorio a los que deben febrero" / "Generá plan de pago en 3 cuotas para familia López"

#### Retención de familias

- **Índice de riesgo de deserción** cruzando datos:
  - Morosidad creciente
  - Padre dejó de leer comunicados
  - Alumno con más inasistencias que lo habitual
  - No confirmó reinscripción a la fecha habitual
- Alerta proactiva: "La familia Pérez tiene señales de riesgo de baja. ¿Querés que te agende una reunión?"
- Intervención temprana como diferencial de servicio

#### Simulador de escenarios financieros

- Modelado de aumentos de cuota: "Si subo 15%, ¿cuántas familias puedo perder y seguir viable?"
- Impacto de cambios: "Si subo 10% + cargo por materiales, ¿cómo queda?"
- Punto de equilibrio con matrícula actual
- Conversacional: "Simulame qué pasa si pierdo 10 alumnos y subo la cuota 20% en marzo"

#### Gestión de personal

- Visibilidad de masa salarial vs. recaudación
- Impacto de decisiones: "Si tomo un docente más para desdoblar 4to, ¿cómo impacta?"
- Seguimiento de presentismo, licencias, reemplazos
- No reemplaza al sistema de liquidación, sino que ofrece una capa de inteligencia sobre costos laborales

#### Satisfacción y reputación

- **Micro-encuestas inteligentes** en momentos clave (post-reunión de padres, fin de trimestre, post-evento)
- Preguntas puntuales y contextuales, no encuestas largas
- **NPS escolar** con tendencias: "La satisfacción bajó en 3ro B, quejas principales: comunicación de la maestra"
- Insights accionables

#### Relación con el regulador (DIEGEP / DGEGP)

- Generación automatizada de documentación requerida:
  - Informes de matrícula
  - Reportes de asistencia
  - Planta funcional
  - Justificación de aranceles
- Conversacional: "Generame el informe de matrícula para DIEGEP con datos actualizados"

#### Dashboard de pulso institucional

- Consultas conversacionales:
  - "¿Cómo está la asistencia esta semana vs. la anterior?"
  - "¿Qué grado tiene más inasistencias?"
  - "¿Cuántos padres leyeron el último comunicado?"
  - "¿Cómo viene la morosidad?"

#### Alertas tempranas automáticas

- Alumno que faltó 4 de los últimos 5 días
- Caída abrupta en notas
- Padre que no lee comunicados hace un mes
- Familia con señales combinadas de riesgo

---

### 4.4 Directivos y Coordinación Pedagógica

#### Dashboard de pulso institucional

(Compartido con administrador pero con foco pedagógico)

#### Observación pedagógica

- Feedback estructurado al docente post-observación de clase
- El asistente sugiere puntos de observación y ayuda a redactar devoluciones constructivas

#### Generación de documentación institucional

- Actas, informes para inspección, memorias anuales, PEI
- Borradores generados por el asistente basados en datos de la plataforma

---

### 4.5 Secretaría administrativa

#### Inscripción y reinscripción digital

- Formularios inteligentes
- Firma digital
- Carga de documentación (partida de nacimiento, vacunas)
- Seguimiento de estado de trámite
- "¿Cuántos faltan confirmar reinscripción 2027?" / "Mandá recordatorio a los que no confirmaron"

#### Legajos digitales

- Toda la documentación centralizada por alumno
- Certificados médicos, autorizaciones, antecedentes pedagógicos, actas
- Buscable: "Mostrá el certificado médico de Mati López"

---

## 5. Experiencia del Alumno por Nivel

### 5.1 Nivel Inicial (3 a 5 años)

El alumno no lee ni escribe. La interacción es táctil, visual, auditiva, mediada por adulto o pantalla de la sala.

#### Interfaz

- No parece una app escolar sino un juego
- Avatar personalizable (animalito, monstruo simpático)
- Íconos grandes, sin texto, todo narrado por voz
- Feedback sonoro (aplausos, estrellitas)
- Refuerzo positivo siempre, sin "notas" ni "errores"

#### Actividades disponibles

- **Trivias visuales con voz**: "¿Cuál de estos animales dice muuu?" → toca la imagen correcta
- **Juegos de asociación**: color → objeto, número → cantidad, forma → elemento
- **Ordenar secuencias**: del cuento leído en clase, de una rutina diaria
- **Desafíos semanales para casa**: "Encontrá 3 objetos redondos y sacales foto con mamá/papá" → padre sube fotos → maestra las usa en clase al día siguiente
- **Cuentos interactivos**: historias personalizadas (nombres de los chicos de la sala) con puntos de decisión ("¿El león va a la montaña o al río?")

#### Gamificación

- Mascota virtual que crece/se alimenta con actividades completadas
- Estrellitas por participación
- Sin rankings ni comparaciones individuales

#### Datos para docente y padre (por detrás)

- Registro de intentos, errores, mejoras
- Alimenta el seguimiento de hitos de desarrollo
- Padre ve: "Mati completó 4 actividades, avanza bien en reconocimiento de números"
- Docente ve: "3 chicos confunden triángulo con rombo → reforzar"

---

### 5.2 Primaria — Primer ciclo (1ro a 3ro, 6-8 años)

Aún muy lúdico pero el chico ya lee y escribe.

#### Actividades

- **Misiones diarias** (en vez de "tarea"):
  - "Leé estas 5 palabras y grabá un audio" → maestra evalúa lectoescritura
  - "Resolvé 3 problemas y ganá 10 monedas para tu avatar"
  - Configuradas por la maestra o generadas por el asistente según tema de la semana
- **Lectura con comprensión interactiva**:
  - Texto corto adaptado + preguntas creativas ("¿Qué creés que pasa después?")
  - Opción de dibujar respuesta (sube foto)
- **Tablero colaborativo de clase**: "3ro B completó 85 misiones esta semana, ¿llegamos a 100?"

#### Gamificación

- Monedas para personalizar avatar
- Misiones completadas = progreso visible
- Desafíos grupales (no individuales competitivos)

---

### 5.3 Primaria — Segundo ciclo (4to a 6to, 9-12 años)

Más autonomía. El alumno ya puede chatear con el asistente.

#### Asistente como compañero de estudio

- "No entiendo la división con dos cifras" → explicación paso a paso + ejemplo + ejercicio para probar
- Personalizado al contenido que están viendo en clase
- Refuerzo positivo al resolver, guía al equivocarse

#### Actividades

- **Proyectos colaborativos**: grupos con espacio compartido, el asistente ayuda a organizar información y armar presentaciones
- **Creación de contenido por alumnos**: "Creá 5 preguntas sobre el tema de hoy" → el asistente ayuda a formularlas → se publican para que el resto juegue
- **Desafíos entre grados**: "4to A vs 4to B en tablas de multiplicar" — ranking grupal, reconocimiento al grado ganador
- **Rincón de lectura gamificado**: registro de libros, reseñas, niveles de lector ("Lector Explorador → Lector Aventurero, te faltan 3 libros")

---

### 5.4 Secundaria (13 a 17 años)

El adolescente necesita utilidad real, no algo infantil ni que sienta como vigilancia.

#### Vista unificada de vida académica

- "Esta semana tenés que entregar el TP de historia el miércoles, estudiar para física el jueves, leer capítulo 3 de literatura el viernes"
- Unifica todo lo que hoy está disperso (Classroom, WhatsApp del curso, dictado, foto del pizarrón)

#### Asistente como tutor personal

- Preguntar sin el juicio social de la clase
- Adaptado al nivel del alumno según notas previas
- Conoce qué vieron en clase y puede contextualizar
- "Explicame la revolución francesa como si fuera una historia"
- "Dame resumen de funciones cuadráticas de esta semana"

#### Autoconocimiento académico

- "¿Cómo vengo en matemática?" → panorama claro y accionable
- "Si saco 7 en el próximo trimestre, ¿me alcanza para aprobar?"
- Materias previas, promedios, tendencias

#### Herramientas de estudio

- **Flashcards inteligentes**: generadas automáticamente del material de la unidad, con repetición espaciada
- **Simulacros de examen**: "Tengo prueba de historia el jueves" → examen de práctica → corrección → feedback por tema
- **Plan de estudio asistido**: "Tenés prueba de física el jueves, te sugiero repasar fuerza el martes y energía el miércoles. ¿Te armo un plan?"

#### Participación y pensamiento crítico

- **Debates y foros por materia**: profesor tira pregunta provocadora, alumnos debaten, asistente modera y desafía argumentos
- **Resolución colaborativa de problemas**: problemas opcionales desafiantes con pistas progresivas (no la respuesta), ranking de resolvedores

#### Portfolio digital

- Todo lo producido queda organizado: TPs, proyectos, presentaciones, participaciones en foros, logros
- Útil para orientación vocacional y entrevistas universitarias

#### Aprendizaje entre pares

- Alumno que domina un tema puede ofrecerse como tutor
- Plataforma conecta tutor con quien necesita ayuda
- Docente ve quién ayuda y puede reconocerlo

#### Orientación vocacional (últimos años)

- Basada en datos reales de rendimiento e intereses
- "Te fue muy bien en biología y química, tus proyectos favoritos fueron los de investigación. ¿Querés explorar carreras de ciencias de la salud?"

#### Bienestar (con cuidado)

- Detección de señales: interacción que baja de repente, deja de entregar, patrones preocupantes
- Alerta al equipo de orientación escolar (no invasiva)
- No reemplaza al gabinete psicopedagógico, ofrece señales tempranas

---

## 6. Hilo Conductor: Progreso Visible

En todos los niveles, el alumno siente que avanza:

| Nivel | Metáfora de progreso |
|-------|---------------------|
| Inicial | Mascota que crece |
| Primaria 1er ciclo | Misiones completadas, monedas, avatar |
| Primaria 2do ciclo | Niveles de lector, logros, creación |
| Secundaria | Portfolio, habilidades, simulacros que mejoran |

---

## 7. Stack Técnico (Alto Nivel)

| Componente | Tecnología sugerida |
|-----------|-------------------|
| Asistente IA | LLM (Claude API) + RAG sobre datos por familia/escuela + function calling para ejecutar acciones |
| WhatsApp | API oficial WhatsApp Business (Twilio / Meta directa / 360dialog) |
| Backend | Multi-tenant (cada escuela = un tenant), robusto y escalable |
| Frontend mobile | React Native o Flutter |
| Frontend web | Web responsive |
| Pagos | Mercado Pago |
| Autenticación | Por definir (SSO institucional deseable) |
| Storage | Por definir |
| Base de datos | Por definir |

---

## 8. Modelo de Negocio

### Estructura

- **SaaS B2B**: se vende a la escuela, no al padre
- Precio por alumno/mes
- El padre y el alumno no pagan

### Tiers posibles

| Tier | Incluye |
|------|---------|
| **Básico** | Comunicación, asistencia, pagos, calendario — sin asistente IA |
| **Premium** | Todo + asistente conversacional IA para todos los actores |
| **Enterprise** | Todo + analytics avanzados, simulador financiero, integraciones custom |

### Add-ons

- WhatsApp Business como canal (add-on premium)
- Módulo de actividades gamificadas para alumnos
- Generación de documentación para regulador

---

## 9. Pitch de venta al administrador

No se vende "una plataforma con IA". Se vende:

- **"Vas a cobrar más y antes"** → gestión de morosidad inteligente
- **"Vas a perder menos familias"** → detección de riesgo de deserción
- **"Vas a tomar mejores decisiones financieras"** → simulador y proyecciones
- **"Vas a cumplir con DIEGEP sin sufrir"** → documentación automatizada
- **"Vas a saber cómo está tu escuela HOY"** → visibilidad en tiempo real
- **"Tus docentes van a estar más contentos"** → menos burocracia, más tiempo para enseñar
- **"Tus alumnos van a estar más enganchados"** → actividades gamificadas, tutor IA

---

## 10. Estrategia de Go-to-Market

### Fase 1: Validación

1. Identificar 2-3 escuelas privadas insatisfechas con su solución actual
2. Entrevistas de descubrimiento con administradores, docentes y padres
3. Validar dolores y disposición a pagar

### Fase 2: MVP

Foco en las 3 cosas que más dolor generan:
1. Asistente conversacional (padre + docente)
2. Comunicados digitales con confirmación de lectura
3. Gestión de pagos y morosidad

Canal prioritario: **WhatsApp primero** → adopción inmediata, sin fricción, sin necesidad de descargar nada.

### Fase 3: Iteración

- Agregar módulo de actividades gamificadas para alumnos
- Dashboard administrativo con proyecciones financieras
- Índice de riesgo de deserción
- Generación de informes pedagógicos

### Fase 4: Escala

- Biblioteca compartida de actividades (efecto de red)
- Red de escuelas
- Datos agregados (benchmark entre instituciones)

---

## 11. Diferencial Competitivo vs. Plataformas Existentes

| Dimensión | Competidores actuales | Esta plataforma |
|-----------|----------------------|-----------------|
| Interfaz | Menús, formularios, módulos | Conversación natural como interfaz primaria |
| Canal | App propia (baja adopción) | WhatsApp + App + Web (ubicuidad) |
| Inteligencia | Registro pasivo de datos | Predicción, alertas tempranas, insights conectados |
| Docente | Carga manual, más burocracia | Voz, asistente que genera contenido, menos burocracia |
| Alumno | No existe o es testimonial | Experiencia gamificada, tutor IA, herramientas de estudio |
| Administrador | Planillas y reportes estáticos | Simulador financiero, proyecciones, riesgo de deserción |
| Contenido | Estático | Generación asistida por IA + biblioteca colaborativa |

---

## 12. Consideraciones Críticas

### Privacidad y seguridad

- Datos sensibles de menores: cumplimiento con normativa argentina de protección de datos
- Transparencia total sobre qué datos se usan y dónde se almacenan
- Control parental sobre datos del alumno
- El asistente de alumnos menores debe tener guardarraíles estrictos

### Adopción

- WhatsApp como canal de entrada reduce la barrera a cero
- Onboarding gradual: no activar todo de golpe, ir habilitando funciones
- Training mínimo para docentes: si necesitan un curso, el producto falló

### Dependencia de IA

- Siempre tener fallback: si el asistente no puede resolver, escalar a humano
- Los informes generados por IA siempre pasan por revisión humana antes de publicarse
- Transparencia: que el usuario sepa que está interactuando con IA

---

## 13. Pendientes / Próximas iteraciones

- [x] Definir nombre del producto → **Vujy** · dominio: vujy.app
- [x] Detallar arquitectura técnica (base de datos, infraestructura, seguridad) → ver [05-ARCHITECTURE.md](05-ARCHITECTURE.md)
- [ ] Diseñar flujos de usuario detallados (wireframes)
- [ ] Definir feature map con priorización MoSCoW para MVP
- [x] Especificar API del asistente (tools, prompts por perfil) → ver [02-API-SPEC.md](02-API-SPEC.md)
- [ ] Investigar regulación argentina sobre datos de menores
- [x] Benchmarking detallado de competidores (features, precios, adopción) → ver [03-BENCHMARKING.md](03-BENCHMARKING.md)
- [ ] Definir métricas de éxito (KPIs por actor)
- [ ] Diseñar sistema de gamificación detallado por nivel
- [ ] Prototipar conversaciones del asistente por perfil
- [x] Evaluar integración WhatsApp API → ver [04-WHATSAPP-API.md](04-WHATSAPP-API.md)
- [ ] Evaluar integración Mercado Pago
- [ ] Evaluar integración SIS existentes (Acadeu, Colegium, etc.)

---

*Documento vivo — última actualización: 3 de marzo de 2026*
