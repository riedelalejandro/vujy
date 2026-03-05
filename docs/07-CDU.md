# Vujy — Casos de Uso por Perfil (CDU)

**Versión:** 1.0
**Fecha:** 2026-03-05
**Relacionado con:** 05-ARCHITECTURE.md · 09-MCP-DEFINITIONS.md · 10-MCP-SCHEMAS.md

---

## Índice

1. [Convenciones y Leyenda](#convenciones-y-leyenda)
2. [Perfil: Padre / Tutor](#perfil-padre--tutor)
3. [Perfil: Docente](#perfil-docente)
4. [Perfil: Admin / Directivo / Secretaría](#perfil-admin--directivo--secretaría)
5. [Perfil: Alumno](#perfil-alumno)
6. [Flujos Cross-Perfil](#flujos-cross-perfil)
7. [Matriz de Tools por Perfil](#matriz-de-tools-por-perfil)
8. [Notas de Implementación](#notas-de-implementación)

---

## Convenciones y Leyenda

### Prefijos de ID

| Prefijo | Perfil |
|---------|--------|
| `CDU-PAD` | Padre / Tutor |
| `CDU-DOC` | Docente (jardinera, maestra primaria, profesor secundaria salvo indicación) |
| `CDU-ADM` | Administrador / Directivo / Secretaría |
| `CDU-ALU` | Alumno |
| `CDU-CROSS` | Flujo cross-perfil |

### Prioridad

| Valor | Criterio |
|-------|----------|
| **P1 (MVP)** | Fase 2 del go-to-market: asistente conversacional, comunicados, pagos/morosidad |
| **P2** | Fase 3: actividades gamificadas, dashboard administrativo, informes pedagógicos |
| **P3** | Fase 4 o diferenciación competitiva avanzada |

### Origen (trazabilidad multiagente)

| Tag | Significado |
|-----|-------------|
| `[Base]` | Presente en el agente conservador; respaldado por FRs y user stories del SPEC |
| `[Extension]` | Aportado por el agente mid-level; amplía un CDU base con valor claro |
| `[Innovation]` | Aportado por el agente creativo; diferenciación competitiva viable |

### Canales habilitados por perfil

| Perfil | App | Web | WhatsApp |
|--------|-----|-----|----------|
| Padre / Tutor | Sí | Sí | Sí |
| Docente | Sí | Sí | Sí |
| Administrador / Directivo | Sí | Sí | No |
| Alumno | Sí | No | **No** (menores — NON-NEGOTIABLE) |

### Nota sobre Principio III (Privacidad de Menores)

> **CRÍTICO.** Toda CDU que involucre datos de alumnos debe respetar estrictamente las siguientes reglas derivadas del Principio III de la Constitución de Vujy:
> - El padre/tutor solo puede ver datos de sus propios hijos. Nunca datos de otros alumnos.
> - El docente solo puede ver alumnos de sus propios grados/cursos.
> - El alumno solo puede ver sus propios datos académicos. Nunca datos de otros alumnos.
> - Las conversaciones del alumno son confidenciales. Las alertas al equipo de orientación incluyen solo el patrón observable, nunca el contenido literal del chat.
> - El canal WhatsApp está vedado para alumnos (menores de edad) de forma absoluta.
> - Los datos de benchmark entre escuelas son estrictamente agregados y anonimizados.

---

## Perfil: Padre / Tutor

> **Tono:** Cálido, claro, eficiente. Lenguaje argentino informal ("vos", "la seño", "boletín").
> **Restricción clave (Principio III):** Solo ve datos de sus propios hijos. Sin acceso a datos financieros de otras familias ni a legajos confidenciales.

---

### CDU-PAD-001 — Consulta de resumen semanal del hijo

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta en lenguaje natural por el estado general del hijo en la semana. Ejemplos: "¿Cómo le fue a Mati esta semana?", "¿Cómo viene Sofi?", "Contame de Mati".

**Flujo conversacional:**
```
Padre: "¿Cómo le fue a Mati esta semana?"

Asistente: [llama get_resumen_alumno(alumno_id, periodo="semana_actual")]
→ "Semana de Mati (4to B):
   Asistencia: 4/5 días (faltó el miércoles, ya justificado).
   Notas: Sacó 9 en Matemática el jueves. Muy bien.
   La seño dejó un comentario: 'Mati participó mucho en la clase de ecosistemas.'
   Tareas pendientes: TP de Lengua para el viernes.
   ¿Querés ver las tareas o las notas completas del trimestre?"

Padre: "Las notas completas"

Asistente: [llama get_notas(alumno_id, trimestre=actual)]
→ [Tabla con notas por materia y promedio]
```

**Tool MCP requerida:**
- `get_resumen_alumno` (periodo: semana_actual)
- `get_notas` (si el padre profundiza)
- `get_tareas` (si el padre pregunta por pendientes)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre tiene múltiples hijos | "¿Para cuál de tus hijos: Mati o Sofi?" — siempre antes de llamar la tool |
| Semana recién iniciada (pocos datos) | Responde con lo disponible y aclara "Es temprano en la semana" |
| Docente no dejó observaciones | Responde con asistencia y notas, omite observaciones sin fabricar contenido |
| Error de backend | "No pude obtener ese dato ahora. Intentá en unos minutos o consultá a secretaría." |
| Notas no liberadas aún (config. del tenant) | "Las notas del trimestre se publican al cierre. Puedo mostrarte el trimestre anterior." |

**Principio III:** El asistente solo puede acceder a datos del alumno vinculado al padre autenticado.

---

### CDU-PAD-002 — Consulta de agenda del día siguiente

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta qué tiene el hijo al día siguiente o en una fecha específica. Ejemplos: "¿Qué tiene mañana?", "¿Qué tiene Mati el lunes?", "¿Necesita llevar algo mañana?".

**Flujo conversacional:**
```
Padre: "¿Qué tiene mañana Mati?"

Asistente: [llama get_calendario(alumno_id, desde=mañana, hasta=mañana)]
           [llama get_tareas(alumno_id, solo_pendientes=true) en paralelo]
→ "Mañana jueves Mati tiene:
   - Matemática, Lengua, Ed. Física, Ciencias
   - Ed. Física: llevar ropa deportiva y zapatillas
   - Matemática: traer la ficha impresa (te la mandé el lunes)
   - Lengua: tiene entrega del TP el viernes, hoy podría avanzar
   ¿Querés que te mande la ficha de nuevo?"

Padre: "Sí"

Asistente: [recupera el adjunto del sistema y lo envía]
→ "Acá está: [Ficha_Matematica.pdf]"
```

**Tool MCP requerida:**
- `get_calendario`
- `get_tareas`
- `get_comunicados` (para recordatorios de materiales a llevar)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La fecha consultada es feriado | "El lunes es feriado, no hay clases." |
| El padre consulta por "esta semana" | Devuelve resumen de los próximos 5 días hábiles |
| No hay nada especial ese día | Responde con el horario estándar del grado si está disponible |
| El adjunto no está en el sistema | "No encuentro ese archivo. Podés pedírselo directamente a la seño." |

---

### CDU-PAD-003 — Consulta y pago de estado de cuenta

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta por deudas o cuotas pendientes. Ejemplos: "¿Cuánto debo?", "¿Cuándo vence la cuota?", "¿Hay algo pendiente de pago?".

**Flujo conversacional:**
```
Padre: "¿Cuánto debo?"

Asistente: [llama get_estado_cuenta(familia_id)]
→ "Estado de cuenta:
   | Concepto         | Monto   | Vencimiento | Estado    |
   | Cuota marzo      | $42.000 | 31/3        | Pendiente |
   | Salida educativa | $4.500  | 13/3        | Pendiente |
   Total: $46.500
   ¿Pagamos ahora?"

Padre: "Sí, todo"

Asistente: "Voy a procesar el pago de $46.500 con la tarjeta guardada
            (terminada en 4521). ¿Confirmás?"

Padre: "Sí"

Asistente: [llama procesar_pago(familia_id, items_ids=[...], metodo_pago="tarjeta_guardada")]
→ "Pago procesado ✅. Comprobante disponible en la app."
```

**Tool MCP requerida:**
- `get_estado_cuenta`
- `procesar_pago` (solo con confirmación explícita del usuario)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin método de pago guardado | "No tenés tarjeta guardada. Podés agregar una desde la sección de pagos." |
| Pago parcial | Lista los ítems y deja elegir cuál pagar |
| El pago falla (error Mercado Pago) | "Hubo un problema. El cargo no se realizó. Intentá de nuevo o usá otro método." — nunca registra el pago como exitoso si falló |
| Sin deuda | "Estás al día. No tenés pagos pendientes." |
| Deuda > 2 meses | Deriva contextualmente a secretaría para plan de pago |

---

### CDU-PAD-004 — Aviso de ausencia del hijo

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre informa que el hijo no va a concurrir. Ejemplos: "Avisá que Mati no va a ir el lunes", "Mati no va mañana", "Sofi está con fiebre".

**Flujo conversacional:**
```
Padre: "Mati no va a ir mañana, tiene fiebre"

Asistente: "Voy a registrar la ausencia de Mati para mañana, viernes 6/3.
            La seño va a quedar notificada. ¿Confirmás?"

Padre: "Sí"

Asistente: [llama registrar_ausencia(alumno_ids=["alu_mati"], fecha="2026-03-06",
            motivo="salud", notificar_docente=true)]
→ "Ausencia registrada ✅. La seño fue notificada.
   ¿Querés que le pida las tareas del día para que Mati no se atrase?"
```

**Tool MCP requerida:**
- `registrar_ausencia`
- `get_tareas` (si el padre acepta pedir las tareas del día)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| No se especifica la fecha | "¿Para qué día querés registrar la ausencia?" |
| Múltiples hijos | "¿Para cuál: Mati o Sofi?" |
| La fecha ya pasó | "El lunes 3/3 ya pasó. ¿Querés igualmente registrarla como justificada?" |
| Ausencia ya registrada por la docente | "Ya figura como ausente ese día. ¿Querés agregar el motivo?" |
| Alumno cerca del límite de inasistencias | Alerta proactiva: "Mati lleva 20 inasistencias. El límite es 25." |

**Principio III:** Solo el tutor autorizado puede registrar ausencia del alumno vinculado a su perfil.

---

### CDU-PAD-005 — Firma de autorización digital

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App (firma digital requiere app) · WhatsApp (notificación + derivación a app)

**Trigger:** El padre recibe una autorización pendiente o la consulta directamente. Ejemplos: notificación push de autorización pendiente, "¿Tengo algo para firmar?".

**Flujo conversacional:**
```
[Notificación push: "Mati necesita tu autorización para la salida al Jardín Botánico"]

Asistente: "Tenés una autorización pendiente:
            Salida educativa: Jardín Botánico
            Fecha: viernes 20/3 | Costo: $4.500 | Vuelve: 17:30
            Llevar: vianda, repelente, ropa cómoda.
            ¿Autorizás la participación de Mati?"

Padre: "Sí"

Asistente: [llama firmar_autorizacion(autorizacion_id, familia_id, aprobado=true)]
→ "Autorización firmada ✅. El costo de $4.500 se agregó a tu cuenta."
```

**Tool MCP requerida:**
- `firmar_autorizacion`
- `get_calendario` (para mostrar contexto del evento)
- `get_estado_cuenta` (referencia al costo)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre rechaza | Registra aprobado=false, notifica a la docente |
| Plazo de firma vencido | "El plazo venció el [fecha]. Contactá a secretaría." |
| El padre tiene una pregunta antes de firmar | Ofrece redirigir la consulta a la docente dentro del sistema |

---

### CDU-PAD-006 — Lectura de comunicados

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta por comunicados. Ejemplos: "¿Hay comunicados nuevos?", "¿Qué mandó la escuela?".

**Flujo conversacional:**
```
Padre: "¿Hay algo nuevo de la escuela?"

Asistente: [llama get_comunicados(destinatario_id, leidos=false, limite=5)]
→ "Tenés 2 comunicados sin leer:
   1. 'Acto del 25 de mayo — indumentaria' — Seño Andrea, ayer
   2. 'Reunión de padres — 20/3 a las 19hs' — Secretaría, hace 3 días
   ¿Querés confirmar asistencia a la reunión ahora?"
```

**Tool MCP requerida:**
- `get_comunicados`
- `get_calendario` (para cruzar fechas de eventos mencionados)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin comunicados sin leer | "Estás al día — no hay comunicados nuevos." |
| Comunicado urgente pendiente | Lo marca claramente y lo prioriza sobre los normales |
| El padre busca un comunicado específico | Búsqueda por RAG en historial de comunicados |

---

### CDU-PAD-007 — Reinscripción para el ciclo siguiente

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre consulta sobre la reinscripción o responde a un recordatorio del sistema. Ejemplos: "¿Cómo confirmo la reinscripción de Mati?", "Quiero reinscribir a Mati para el año que viene".

**Flujo conversacional:**
```
Padre: "Quiero reinscribir a Mati para el año que viene"

Asistente: "Para confirmar la reinscripción de Mati para 5to grado (2027):
            Arancel de reinscripción: $15.000 (se descuenta de la primera cuota).
            Fecha límite: 30/3/2026.
            ¿Confirmás? (aceptás las condiciones del ciclo 2027)"

Padre: "Sí"

Asistente: [llama confirmar_reinscripcion(alumno_id, ciclo_lectivo=2027, acepta_condiciones=true)]
→ "Reinscripción de Mati confirmada ✅. Confirmación enviada a tu email."
```

**Tool MCP requerida:**
- `confirmar_reinscripcion`
- `get_estado_cuenta` (bloqueo si hay deuda pendiente)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Período no abierto aún | "La reinscripción para 2027 todavía no está habilitada. Te avisamos cuando abra." |
| Deuda pendiente | "Hay un saldo pendiente de $42.000. ¿Lo pagamos ahora y después reinscribimos?" |
| Múltiples hijos | Ofrece reinscribir a todos en el mismo flujo, confirmación individual por hijo |
| Plazo vencido | "El período cerró el 30/3. Contactá a secretaría directamente." |

---

### CDU-PAD-008 — Consulta de calificaciones

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta por notas. Ejemplos: "¿Qué nota sacó Mati en matemática?", "¿Cómo viene en el trimestre?".

**Flujo conversacional:**
```
Padre: "¿Cómo viene Mati en el trimestre?"

Asistente: [llama get_notas(alumno_id, trimestre=actual)]
→ "Mati en el 1er trimestre:
   | Materia      | Promedio | Tendencia    |
   | Matemática   | 8.5      | ↑ Subiendo   |
   | Lengua       | 7.0      | → Estable    |
   | Ciencias Nat.| 8.0      | ↑ Subiendo   |
   Promedio general: 7.8 — Muy bien."

Padre: "¿Y comparado con el trimestre anterior?"

Asistente: [llama get_notas(alumno_id, trimestre=anterior)]
→ "En el trimestre anterior el promedio fue 7.2. Subió 0.6 puntos 📈"
```

**Tool MCP requerida:**
- `get_notas` (trimestre actual + anterior para comparación)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Notas no liberadas (config. del tenant) | Informa la política de visibilidad de la institución |
| Alumno de nivel inicial | Reemplaza notas por hitos de desarrollo — lenguaje diferente |
| Caída significativa entre trimestres | Alerta contextual + contexto de observaciones pedagógicas si las hay |

**Principio III:** Solo el tutor puede ver notas de sus propios hijos.

---

### CDU-PAD-009 — Consulta de asistencia acumulada

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre consulta inasistencias. Ejemplos: "¿Cuántas faltas tiene Mati?", "¿Cuántas inasistencias lleva?".

**Flujo conversacional:**
```
Padre: "¿Cuántas faltas tiene Mati?"

Asistente: [llama get_asistencia(alumno_id, desde=inicio_anio, hasta=hoy)]
→ "Mati lleva 4 inasistencias en lo que va del año:
   - 12/2: ausente (justificada — certificado médico)
   - 19/2: tardanza
   - 5/3: ausente
   - 10/3: ausente
   El límite reglamentario es 25 inasistencias anuales."
```

**Tool MCP requerida:**
- `get_asistencia`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno cerca del límite | Alerta proactiva: "Mati lleva 20 inasistencias. El límite es 25. Quedan 5." |
| Asistencia perfecta | "Mati tiene asistencia perfecta hasta hoy." |

---

### CDU-PAD-010 — Contacto con la docente

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre quiere comunicarse con la docente. Ejemplos: "Quiero hablar con la seño", "¿Puedo mandar un mensaje a la maestra?".

**Flujo conversacional:**
```
Padre: "Quiero mandar un mensaje a la seño de Mati"

Asistente: "¿Qué le querés decir a la seño Andrea?
            (Escribilo como quieras — si querés, te ayudo a redactarlo)"

Padre: "Preguntarle si la ficha de matemática se puede entregar en digital"

Asistente: "Antes de molestar a la seño — el comunicado del lunes decía que la ficha
            debe estar impresa. ¿Querés igualmente consultarle o con eso alcanza?"

Padre: "Mandalo igual"

Asistente: [genera borrador y envía vía canal docente-familia interno]
→ "Enviado. La seño lo ve en horario laboral. Te notificamos cuando responda."
```

**Tool MCP requerida:**
- `enviar_comunicado` (canal padre → docente, dentro del sistema)
- `get_comunicados` (para verificar si la consulta ya fue respondida en un comunicado)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Mensaje fuera de horario | Avisa que la respuesta llegará en horario escolar |
| Consulta que el asistente puede resolver | Ofrece responderla primero sin molestar a la docente |
| Tono agresivo en el mensaje | Sugiere reformulación con amabilidad, sin censurar |

---

### CDU-PAD-011 — Seguimiento de múltiples hijos

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Padre / Tutor con 2+ hijos en la institución
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta por todos sus hijos. Ejemplos: "¿Cómo van los chicos?", "Resumen de todos mis hijos".

**Flujo conversacional:**
```
Padre: "¿Cómo van los chicos esta semana?"

Asistente: [llama get_resumen_alumno(alu_mati, semana_actual)]
           [llama get_resumen_alumno(alu_sofi, semana_actual)]  ← en paralelo

→ "Resumen de esta semana:

   Mati (4to B):
   - Asistencia: 4/5 (faltó el miércoles)
   - Notas: 9 en Matemática ✅
   - Pendiente: TP de Lengua para el viernes

   Sofi (2do A):
   - Asistencia: 5/5 — perfecta
   - Notas: Sin notas nuevas esta semana
   - Pendiente: Misión de lectura para el lunes

   ¿Querés profundizar en alguno de los dos?"
```

**Tool MCP requerida:**
- `get_resumen_alumno` (llamado en paralelo para cada hijo)
- `get_tareas` (pendientes por hijo)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Hijos en distintos niveles | Adapta el lenguaje del resumen según el nivel de cada uno |
| Estado de cuenta familiar | La cuenta es de la familia completa — lo aclara si hay confusión |
| Sin información de un hijo | "De Sofi no tengo datos nuevos. ¿Querés que le consulte a la seño?" |

**Principio III:** El padre solo ve datos de sus propios hijos, incluso cuando consulta por todos a la vez.

---

### CDU-PAD-012 — Resumen proactivo semanal

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Sistema → Padre / Tutor (iniciado por el sistema)
**Canales:** App · WhatsApp

**Trigger:** Automático — el sistema envía un resumen semanal (lunes a las 8:00 o viernes a las 18hs según configuración del tenant). No hay acción del usuario.

**Flujo conversacional:**
```
[Lunes 8:05 — Push/WhatsApp — automático]

Asistente: "La semana de Mati:
            - Martes: prueba de Ciencias (ecosistemas)
            - Miércoles: natación — llevar malla y toalla
            - Viernes: acto (vengan de blanco)
            Tareas pendientes: TP de Lengua (¿venció el viernes pasado?)
            ¿Algo que quieras atender ahora?"

Padre: "El TP de Lengua — no lo entregó"

Asistente: "¿Querés que le mande un mensaje a la seño explicando la situación?"
```

**Tool MCP requerida:**
- `get_calendario` (semana siguiente)
- `get_tareas` (pendientes)
- `get_resumen_alumno`
- `enviar_comunicado` (si el padre coordina con la docente)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Semana sin novedades | Resumen mínimo + confirmación de que no hay urgencias |
| La escuela no configuró el resumen proactivo | CDU no aplica — es feature configurable por tenant |
| Padre solicita no recibir más el resumen | Registra la preferencia — configurable desde el perfil |

---

### CDU-PAD-013 — Consulta del diario del día (nivel inicial)

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Padre / Tutor de alumno de nivel inicial
**Canales:** App (fotos requieren app) · WhatsApp (solo resumen textual)

**Trigger:** El padre quiere saber qué hizo el hijo en el jardín. Ejemplos: "¿Qué hizo Sofi hoy en el jardín?", "¿Subió la seño fotos?".

**Flujo conversacional:**
```
Padre: "¿Qué hizo Sofi hoy?"

Asistente: [RAG sobre diario visual del día de la sala de Sofi]
→ "El diario de hoy en la sala de Sofi:
   La seño Gabi dejó un resumen: 'Hoy trabajamos con texturas — arroz,
   arena y algodón. A Sofi le encantó tocar el algodón y estuvo muy
   concentrada. También hicimos la ronda con la canción nueva.'
   [3 fotos adjuntas en la app]
   Sofi completó: actividad de asociación de colores."
```

**Tool MCP requerida:**
- RAG (diario visual del día, observaciones de la docente)
- Función de recuperación de multimedia del día

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La docente no cargó el diario | "La seño Gabi no publicó el diario de hoy todavía. Suele hacerlo antes de las 15hs." |
| Padre en WhatsApp | Recibe el resumen textual; las fotos requieren la app |

---

### CDU-PAD-014 — Alerta proactiva: hijo con caída académica

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Sistema → Padre / Tutor (iniciado por el sistema al detectar caída)
**Canales:** Push notification · App · WhatsApp

**Trigger:** El sistema detecta que el alumno bajó 2 o más puntos entre trimestres consecutivos o entre evaluaciones. El padre no preguntó nada.

**Flujo conversacional:**
```
[Push notification — sábado 10:00]
"Mati bajó en Lengua. Hablemos."

Asistente: "Quería contarte algo sobre Mati: en Lengua pasó de 8.5 (1er trim.)
            a 6 (2do trim.). La seño observó: 'Le está costando la comprensión
            de textos argumentativos. Necesita más práctica en casa.'
            No es una crisis, pero conviene atenderlo ahora.
            ¿Querés que:
            A) Te arme un plan de actividades cortas para hacer en casa
            B) Le mande un mensaje a la seño para coordinar apoyo
            C) Ver el detalle completo de sus notas de Lengua"

Padre: "A"

Asistente: [llama generar_plan_estudio(alumno_id, materia="Lengua", dias=semana_actual)]
→ [Plan semanal con actividades cortas para el hogar]
```

**Tool MCP requerida:**
- `get_notas` (comparativa entre trimestres — detección de caída)
- `get_alertas_institucionales` (disparador)
- `generar_plan_estudio` (si el padre elige opción A)
- RAG sobre observaciones pedagógicas

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Caída por una sola evaluación mala | No dispara la alerta — espera confirmar tendencia con 2+ puntos de datos |
| La docente no dejó observación | Avisa la caída pero sin contexto cualitativo |
| Padre ya sabe y no quiere más alertas | Configurable en perfil de notificaciones |

**Principio III:** La alerta llega solo a los tutores autorizados del alumno en cuestión.

---

### CDU-PAD-015 — Urgencia: alumno con incidente en la escuela

**Prioridad:** P1 | **Origen:** `[Innovation]`
**Actor:** Sistema → Padre / Tutor (iniciado por la institución)
**Canales:** Push de alta prioridad · App · WhatsApp

**Trigger:** Un adulto de la institución carga una notificación urgente sobre un incidente que involucra al hijo del padre.

**Flujo conversacional:**
```
[Push — alta prioridad — 10:35am]
"URGENTE: Notificación del Colegio San Martín sobre Mati."

Asistente: "Hola Pablo. La directora nos pidió que te contactemos urgente.
            Mati tuvo una caída en el recreo. Está con la enfermera.
            No es grave, pero tiene un golpe en el brazo derecho y la dirección
            recomienda que vengas a evaluarlo.
            ¿Podés venir al colegio?"

Padre: "Voy ahora. ¿Cuánto tarda?"

Asistente: "El colegio está a 12 minutos en auto desde tu ubicación habitual.
            ¿Le aviso a la preceptora que estás en camino?"

Padre: "Sí"

Asistente: "Gabriela fue notificada. Te esperan en la entrada principal."
```

**Tool MCP requerida:**
- `enviar_comunicado` (prioridad urgente)
- Notificación push de alta prioridad

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Padre no responde en 10 minutos | El sistema intenta al segundo tutor registrado |
| Situación médica grave | Informa que ya se llamó al servicio de emergencias; da el parte sin minimizar |
| Solo un tutor registrado y no responde | Escala a directivo para protocolo de emergencia |

**Principio III:** La información del incidente llega solo a los tutores autorizados registrados. Nunca a otros padres del grado.

---

### CDU-PAD-016 — Trayectoria acumulada del hijo (multi-año)

**Prioridad:** P3 | **Origen:** `[Innovation]`
**Actor:** Padre / Tutor
**Canales:** App (visualización rica) · WhatsApp (resumen textual)

**Trigger:** El padre quiere una visión longitudinal del hijo. Ejemplos: "¿Cómo viene Mati en general?", "Mostrá la trayectoria de Mati desde que entró al colegio".

**Flujo conversacional:**
```
Madre: "Quiero ver cómo viene Mati desde que entró al colegio"

Asistente: [llama get_notas(alumno_id, todos_los_trimestres=true)]
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
- `get_notas` (histórico multi-año)
- RAG sobre observaciones pedagógicas acumuladas
- `get_asistencia` (histórica)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Datos incompletos (migración desde otra plataforma) | "Solo tenemos datos desde 2024, cuando ingresaste a Vujy." |
| Alumno recién inscripto | Muestra lo que hay desde la fecha de inscripción |

---
## Perfil: Docente

> Los CDU aplican a los tres sub-perfiles (jardinera, maestra primaria, profesor secundaria) salvo que se indique variante específica por nivel.
> **Restricción clave (Principio III):** Solo ve datos de sus propios alumnos/grados. Sin acceso a datos financieros de familias.

---

### CDU-DOC-001 — Toma de asistencia por voz

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · WhatsApp

**Trigger:** La docente informa ausencias en lenguaje natural al inicio del día. Ejemplos: "Hoy faltaron Mati López y Sofi Ruiz", "Hoy están todos", "Faltó Lucas".

**Flujo conversacional:**
```
Seño: "Hoy faltaron Mati López y Sofi Ruiz"

Asistente: "Ausencias del lunes 3/3 — 4to B:
            - Matías López — ausente
            - Sofía Ruiz — ausente
            Los papás ya fueron notificados. ¿Querés pedirles que informen el motivo?"

Seño: "Sí"

Asistente: [llama tomar_asistencia_grado(grado_id, fecha=hoy, asistencias=[...])]
→ "Asistencia registrada ✅. 2 tutores notificados."
```

**Tool MCP requerida:**
- `tomar_asistencia_grado`
- `registrar_ausencia` (alternativa si es solo ausentes individuales)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La docente dice "Hoy están todos" | Registra asistencia completa con confirmación |
| Nombre ambiguo (dos alumnos similares) | "¿Te referís a Matías López o a Mariano Loza?" |
| Tardanza (no ausencia) | "¿Valentina llegó tarde o estuvo ausente?" — distingue estados |
| Asistencia ya registrada ese día | "La asistencia de hoy ya fue registrada. ¿Querés modificarla?" |
| Múltiples grados (profesor secundaria) | "¿Para qué curso: 4to A o 4to B?" |
| Alumno con inasistencias acumuladas | Alerta proactiva: "Mati lleva 3 ausencias sin justificar este mes." |

---

### CDU-DOC-002 — Toma de asistencia por lista (tap)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App

**Trigger:** La docente abre la lista de asistencia y marca individualmente. Variante táctil documentada en el SPEC como "por toque".

**Flujo conversacional:**
```
Seño: "Asistencia de hoy"

Asistente: [recupera lista del grado]
→ Muestra lista con toggles. La docente toca solo los ausentes.
  "Guardás la asistencia de 4to B — 28 presentes, 2 ausentes
   (Lucas Fernández, Valentina Gómez). ¿Notificamos a los tutores?"

Seño: "Sí"

Asistente: [llama tomar_asistencia_grado(grado_id, fecha, asistencias=[...])]
→ "Asistencia guardada ✅. 2 tutores notificados."
```

**Tool MCP requerida:**
- `tomar_asistencia_grado`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La docente marca tardanza | El estado "tardanza" es válido en la tool |
| Alumnos nuevos no en la lista | Informa el caso y sugiere que secretaría actualice el legajo |

---

### CDU-DOC-003 — Envío de comunicado a familias

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · WhatsApp

**Trigger:** La docente dicta o escribe un comunicado en lenguaje natural. Ejemplo: "Mandá comunicado a 3ro B, el viernes hay acto, vengan de blanco y traigan algo para compartir".

**Flujo conversacional:**
```
Seño: "Mandá comunicado a 3ro B: el viernes hay acto, vengan de blanco
       y traigan algo para compartir"

Asistente: [llama generar_comunicado_borrador(instruccion="...", destinatarios="3ro B")]
→ "Acá está el borrador:
   Título: Acto escolar — viernes 20 de marzo
   [Cuerpo del comunicado]
   ¿Lo enviamos así o querés cambiar algo?"

Seño: "Cambiá 'algo para compartir' por 'una fruta para compartir'"

Asistente: [actualiza borrador]
→ "Actualizado. ¿Enviamos a los 28 padres de 3ro B?"

Seño: "Sí"

Asistente: [llama enviar_comunicado(titulo, cuerpo, destinatarios={grado_ids:["3B"]}, canal=["app"])]
→ "Comunicado enviado a 28 familias ✅. Te aviso cuando lleguen las confirmaciones de lectura."
```

**Tool MCP requerida:**
- `generar_comunicado_borrador`
- `enviar_comunicado`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Comunicado urgente | Cambia canal a [app, whatsapp] y prioridad a "urgente" |
| Destinatarios poco claros | "¿A quién va: solo 3ro B o toda la primaria?" |
| El comunicado tiene fecha/hora que no coincide con el calendario | El asistente valida las fechas |
| La docente quiere enviarlo por WhatsApp | Agrega canal WA si el tenant tiene el add-on; si no, informa la limitación |

---

### CDU-DOC-004 — Carga de calificaciones

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · WhatsApp

**Trigger:** La docente dicta o escribe notas en lenguaje natural. Ejemplo: "Notas de matemática 3ro B: Mati 8, Sofi 9, Juani 6".

**Flujo conversacional:**
```
Seño: "Notas de matemática 3ro B: Mati 8, Sofi 9, Juani 6, Caro 7"

Asistente: "Voy a cargar en Matemática — Evaluación escrita — 3ro B:
            | Alumno         | Nota |
            | Matías López   |  8   |
            | Sofía Ruiz     |  9   |
            | Juan García    |  6   |
            | Carolina Pérez |  7   |
            ¿Confirmás?"

Seño: "Sí"

Asistente: [llama cargar_nota(grado_id, materia, tipo_evaluacion, fecha, notas=[...])]
→ "Cargadas ✅. Promedio: 7.5.
   Juani bajó respecto al trimestre anterior (tenía 8). ¿Querés que te avise si sigue la tendencia?"
```

**Tool MCP requerida:**
- `cargar_nota`
- `get_notas` (para comparar con trimestre anterior y disparar alertas)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Nombre ambiguo en el grado | "Tenés dos Matías — ¿Matías López o Matías García?" |
| Nota fuera del rango 1-10 | "La nota 11 no es válida. ¿Querés corregirla?" — no carga hasta recibir nota válida |
| Alumnos faltantes en la lista | "Faltan 3 alumnos: Pedro, Ana, Franco. ¿Estuvieron ausentes en la evaluación?" |
| Caída abrupta (>2 puntos) | Marca como alerta automática |
| Boletín ya cerrado | "El boletín del 1er trim. ya fue publicado. Modificar notas requiere autorización del directivo." |
| Tipo de evaluación no especificado | "¿Es evaluación escrita, oral o TP?" |

**Principio III:** El docente solo puede cargar notas de sus propios alumnos/grados.

---

### CDU-DOC-005 — Registro de observación pedagógica

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · WhatsApp

**Trigger:** La docente dicta o escribe una observación sobre un alumno durante o después de la clase. Ejemplos: "Mati participó mucho en ciencias, le interesan los planetas" / "Sofi confunde la d y la b".

**Flujo conversacional:**
```
Seño: "Mati avanzó mucho en reconocimiento de números esta semana, llegó al 10"

Asistente: [llama registrar_observacion_pedagogica(alumno_id, texto="...", area="matematica")]
→ "Guardé la observación de Mati:
   '3/3 — Avanzó en reconocimiento numérico hasta el 10.'
   Ya tenés 4 observaciones de Mati este trimestre.
   ¿Hay algún otro alumno del que quieras dejar nota?"

Seño: "También que Sofi confunde la d y la b todavía"

Asistente: [llama registrar_observacion_pedagogica(alumno_id=alu_sofi, texto="...", area="lenguaje")]
→ "Guardado. ¿Seguimos con otro alumno?"
```

**Tool MCP requerida:**
- `registrar_observacion_pedagogica`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Observación sobre el grupo completo | "¿Esta observación es para el grupo o para un alumno en particular?" |
| Observación socioemocional delicada | Registra con discreción y pregunta: "¿Querés que notifique a orientación?" |
| Múltiples observaciones seguidas | Procesa una por una, confirmando cada una |
| Alumno no reconocido | "No encontré ese alumno en tu sala. ¿Podés confirmar el nombre completo?" |

---

### CDU-DOC-006 — Generación de informe pedagógico trimestral

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App (la revisión y edición requiere interfaz mayor que WhatsApp)

**Trigger:** La docente solicita el borrador del informe de un alumno al cierre del trimestre. Ejemplo: "Generame el informe de Lucas para el primer trimestre".

**Flujo conversacional:**
```
Seño: "Generame el informe de Lucas para el 1er trimestre"

Asistente: "Lucas tiene 4 observaciones y 3 notas cargadas. Generando borrador..."

Asistente: [llama generar_informe_pedagogico(alumno_id, trimestre=1, anio=2026, estilo="descriptivo_primaria")]
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
- `generar_informe_pedagogico`
- `registrar_observacion_pedagogica` (datos de entrada precargados)
- RAG sobre observaciones del trimestre

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Pocas observaciones (<3) | "Lucas solo tiene 1 observación. El informe puede quedar muy escueto. ¿Agregamos ahora o seguimos?" |
| Generar todos los informes del grado | "Voy a generar 28 borradores. ¿Arrancamos?" — cada uno requiere aprobación individual |
| Informe ya publicado | Advierte y pide confirmación para generar una versión revisada |
| Nivel inicial | Usa estilo "narrativo_inicial" — sin notas numéricas, con hitos de desarrollo |
| Alumno con conducta problemática | El borrador evita lenguaje estigmatizante; la docente puede agregar contexto |

---

### CDU-DOC-007 — Creación de actividad educativa gamificada

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App

**Trigger:** La docente solicita la creación de una actividad gamificada. Ejemplo: "Creame una trivia de 8 preguntas sobre fotosíntesis para 5to, dificultad media".

**Flujo conversacional:**
```
Seño: "Creame una trivia de 8 preguntas sobre fotosíntesis para 5to, dificultad media"

Asistente: [llama generar_actividad_educativa(tema="fotosíntesis", materia="Ciencias",
            grado_id="5to", tipo="trivia", cantidad_preguntas=8, dificultad="media")]
→ "Trivia 'Fotosíntesis' — 5to grado (preview de 3 preguntas):
   1. ¿Dónde ocurre la fotosíntesis? a) Raíces b) Hojas c) Tallo...
   [8 preguntas con respuestas]
   ¿La publicamos para 5to B o querés revisarla primero?"

Seño: "Publicar para 5to B"

Asistente: "Actividad publicada ✅. Los alumnos ya la ven desde su app.
            ¿La agrego a la biblioteca compartida para que otras maestras la puedan usar?"
```

**Tool MCP requerida:**
- `generar_actividad_educativa`
- RAG sobre diseño curricular (para alinear con contenidos del año)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Tipo de actividad no soportado | Informa los tipos disponibles y sugiere el más cercano |
| Docente quiere modificar preguntas | Permite edición antes de publicar |
| Tema no alineado con el currículo | Avisa: "Este tema no aparece en el diseño curricular de 5to. ¿Igual procedemos?" |
| Hay una actividad similar en la biblioteca | "Encontré una trivia similar ya creada. ¿La usás o generamos una nueva?" |

---

### CDU-DOC-008 — Consulta de estado de alumno específico

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Docente
**Canales:** App · WhatsApp

**Trigger:** La docente consulta el panorama de un alumno particular. Ejemplos: "¿Cómo viene Lucas este trimestre?", "¿Cuántas faltas tiene Valentina?".

**Flujo conversacional:**
```
Seño: "¿Cómo viene Lucas este trimestre?"

Asistente: [llama get_resumen_alumno(alu_lucas, trimestre_actual)]
           [llama get_notas(alu_lucas, trimestre=1)]
           [llama get_asistencia(alu_lucas)]
→ "Lucas Fernández — 4to B, 1er trimestre:
   Académico: Promedio 7.8 — Matemática: 8, Lengua: 7, Ciencias: sin nota aún
   Asistencia: 18/20 días (2 ausencias, ambas justificadas)
   Mis observaciones: 4 — Última: 'Avanzó en comprensión lectora.'
   ¿Querés ver algo en particular?"
```

**Tool MCP requerida:**
- `get_resumen_alumno`
- `get_notas`
- `get_asistencia`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno no en sus grados | "Lucas Rodríguez no está en ninguno de tus grados." |
| Comparación entre alumnos (promedio del grado) | Está permitido para el docente ver estadísticas de su propio grado |

**Principio III:** La docente solo puede consultar datos de sus propios alumnos.

---

### CDU-DOC-009 — Detección y seguimiento de alumnos en dificultad

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Docente / Sistema (proactivo)
**Canales:** App

**Trigger:** Proactivo del sistema al detectar patrones, o la docente consulta. Ejemplos: "¿Quiénes necesitan más atención?", "¿Quiénes van mal en matemática?".

**Flujo conversacional:**
```
[Lunes 8:30 — al abrir la app]

Asistente: "Buenos días, seño Andrea. Antes de empezar la semana:
            ⚠️ Juan García bajó a 5 en la última evaluación de Matemática (tenía 8).
            ⚠️ Valentina Gómez faltó 4 de los últimos 5 días.
            ¿Querés que te prepare algo para hacer seguimiento hoy?"
```

**Flujo consultado:**
```
Seño: "¿Quiénes necesitan atención en el grado?"

Asistente: [llama get_notas(grado, trimestre=actual)]
           [llama get_asistencia(grado, periodo=reciente)]
           [llama get_alertas_institucionales(filtro=docente)]
→ "Alumnos que requieren atención — 4to B:
   Pedagógico: Juan García (↓ Mat. y Lengua), Pedro Suárez (3 notas bajo 6)
   Asistencia: Mati López (4 ausencias sin justificar este mes)
   Comunicación: Papás de Pedro no leyeron los últimos 3 comunicados."
```

**Tool MCP requerida:**
- `get_notas` (análisis de tendencias por grado)
- `get_asistencia`
- `get_alertas_institucionales` (filtro por docente y grado)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| No hay alumnos con dificultades | "El grado viene muy parejo. Sin alertas críticas por ahora." |
| Sobrecarga de alertas | El asistente agrupa y prioriza — máximo 3 alertas por apertura de sesión |
| Docente quiere ignorar una alerta | Puede descartarla; no reaparece hasta nuevo umbral |

---

### CDU-DOC-010 — Consulta de estadísticas de comunicados enviados

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Docente
**Canales:** App · WhatsApp

**Trigger:** La docente consulta cuántos padres leyeron un comunicado. Ejemplo: "¿Cuántos papás leyeron el comunicado del acto?".

**Flujo conversacional:**
```
Seño: "¿Cuántos papás leyeron el comunicado del acto?"

Asistente: [llama get_comunicados(grado_id, limite=1)]
→ "Comunicado 'Acto escolar — viernes 20/3':
   ✅ Leído: 18 de 24 familias (75%)
   ❌ Sin leer: 6 familias (García, López, Torres y 3 más)
   ¿Querés mandarles un recordatorio a los que no leyeron?"

Seño: "Sí"

Asistente: [llama enviar_comunicado(destinatarios=no_lectores, cuerpo="Recordatorio: ...")]
→ "Recordatorio enviado ✅."
```

**Tool MCP requerida:**
- `get_comunicados` (con estado de lectura por familia)
- `enviar_comunicado` (recordatorio a no-lectores)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| 100% de lectura | "¡Todas las familias leyeron el comunicado! 🎉" |
| Familia sin canal activo (sin app ni WhatsApp) | "3 familias no tienen canal activo — secretaría puede contactarlas." |

---

### CDU-DOC-011 — Planificación didáctica asistida

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App

**Trigger:** La docente solicita sugerencias pedagógicas. Ejemplos: "¿Qué actividades puedo hacer para introducir fracciones en 4to?", "Ayudame a planificar la unidad de ecosistemas".

**Flujo conversacional:**
```
Seño: "Ayudame a planificar la unidad de ecosistemas para 4to, tengo 4 semanas"

Asistente: [RAG sobre diseño curricular PBA / CABA para 4to grado — Ciencias Naturales]
→ "Propuesta — Ecosistemas — 4to grado — 4 semanas:
   Semana 1: ¿Qué es un ecosistema? Componentes bióticos y abióticos
   Semana 2: Cadenas y redes alimentarias
   Semana 3: Ecosistemas de Argentina (selva, pampa, Patagonia)
   Semana 4: Impacto humano y conservación — cierre con portfolio digital
   ¿Querés que genere fichas o actividades interactivas para alguna semana?"
```

**Tool MCP requerida:**
- RAG sobre diseño curricular jurisdiccional (PBA/CABA)
- `generar_actividad_educativa` (si la docente genera algo directamente)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Jurisdicción no configurada | "¿Trabajás con el diseño curricular de PBA o CABA?" |
| Tema no en el currículo oficial disponible | Responde con conocimiento general del LLM y lo aclara |
| Planificación anual completa solicitada | Advierte que puede ser extenso; ofrece generarla por sección |

---

### CDU-DOC-012 — Registro del diario visual del día (nivel inicial)

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Docente de nivel inicial
**Canales:** App

**Trigger:** La docente quiere publicar el resumen del día para las familias. Ejemplo: "Quiero publicar el diario de hoy", "Subí las fotos de la actividad".

**Flujo conversacional:**
```
Seño Gabi: [sube 3 fotos desde el móvil]

Asistente: "¡Lindas fotos! ¿Querés agregar un resumen del día para los papás?"

Seño: "Hoy trabajamos con texturas — arroz, arena y algodón. A los chicos les encantó."

Asistente: "Listo el diario de hoy (martes 4/3 — Sala de 5):
            'Hoy exploramos texturas: arroz, arena y algodón. Los chicos
             disfrutaron mucho tocar y comparar.'
            [3 fotos adjuntas]
            ¿Lo publicamos para las familias?"

Seño: "Sí"

Asistente: [llama enviar_comunicado con adjuntos multimedia]
→ "Diario publicado ✅. 20 familias van a recibir la notificación."
```

**Tool MCP requerida:**
- `enviar_comunicado` (con adjuntos multimedia)
- `registrar_observacion_pedagogica` (si el resumen incluye observaciones de alumnos)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin fotos | Puede publicar solo el resumen textual |
| Fotos con contenido inapropiado | Guardarraíles rechazan el contenido con mensaje claro |

**Principio III:** Las fotos de alumnos de nivel inicial solo se envían a los tutores autorizados del grupo, nunca a terceros.

---

### CDU-DOC-013 — Gestión de previas y seguimiento (secundaria)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Profesor de secundaria
**Canales:** App · WhatsApp

**Trigger:** El profesor consulta sobre previas en su materia. Ejemplo: "¿Quiénes tienen materias previas en 4to A?".

**Flujo conversacional:**
```
Profesor: "¿Quiénes tienen previas en Historia en 4to A?"

Asistente: [llama get_notas(grado_id="4toA", materia="historia", trimestre=anterior)]
→ "Alumnos de 4to A con previa en Historia (de 3er año):
   - Lucas Fernández
   - Valentina Gómez
   Son los únicos dos. ¿Querés notificarles el examen de recuperación?"

Profesor: "Sí, avisales que es el 20/3 a las 14hs en el aula 5"

Asistente: [llama enviar_comunicado(destinatarios=alumnos_previas, cuerpo="...")]
→ "Notificación enviada a Lucas Fernández y Valentina Gómez ✅."
```

**Tool MCP requerida:**
- `get_notas` (para identificar alumnos con previas)
- `enviar_comunicado` (notificación a alumnos o tutores)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin previas | "Ningún alumno de 4to A tiene previas en tu materia." |
| Consulta por varios cursos | Responde por curso, con posibilidad de consolidar |

---

### CDU-DOC-014 — Sugerencia proactiva de actividad de repaso antes de evaluación

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Sistema → Docente (proactivo)
**Canales:** App (push proactivo)

**Trigger:** El asistente detecta que hay una evaluación programada en los próximos 3 días y la docente no generó actividad de repaso aún.

**Flujo conversacional:**
```
[App — lunes 9:00am — push proactivo]

Asistente: "Seño, la prueba de Matemática de 3ro B es el jueves.
            ¿Querés que genere una actividad de repaso para que los chicos
            practiquen mañana y miércoles?"

Seño: "Sí, fracciones y decimales, nivel medio"

Asistente: [genera dos actividades cortas]
→ "Publicadas ✅. Mañana: Repaso Fracciones | Miércoles: Repaso Decimales."
```

**Tool MCP requerida:**
- `get_calendario` (evaluaciones próximas)
- `generar_actividad_educativa`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La docente no quiere sugerencias proactivas | Configurable en preferencias |
| No hay evaluación cargada en el calendario | El asistente no puede disparar el trigger |

---

### CDU-DOC-015 — Barrera de horarios: filtrar mensajes de padres fuera de horario laboral

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Docente (protección) · Padre (contención)
**Canales:** App · WhatsApp

**Trigger:** Un padre envía un mensaje a la docente fuera del horario laboral (ej: 22:30). El asistente intercepta y gestiona.

**Flujo conversacional:**
```
[Perspectiva del padre — WA 22:30]

Padre: "Seño, no sé cómo está Mati con la lectura, me tiene preocupado"

Asistente (hacia el padre): "Entiendo la preocupación, Pablo.
   Según lo que tengo, en la última evaluación de Lengua Mati sacó 7,
   y la seño observó que está trabajando en comprensión de textos.
   ¿Esta información te ayuda o necesitás hablar específicamente con la seño?"

Padre: "Quiero hablar con la seño"

Asistente: "La seño trabaja de lunes a viernes hasta las 18h. Tu mensaje
            le va a llegar mañana a la mañana. ¿Lo envío?"

[Perspectiva de la docente — mañana 8:15am]

Asistente (hacia la seño): "Seño, Pablo García (papá de Mati) escribió anoche.
   Quiere hablar sobre la lectura de Mati. ¿Querés responder ahora?"
```

**Tool MCP requerida:**
- `get_notas` (para responder la consulta del padre sin molestar a la docente)
- `get_comunicados` (mensajes pendientes)
- `enviar_comunicado` (cuando la docente responde en horario)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La consulta es urgente (hijo lastimado) | Pasa el filtro y notifica a la docente con prioridad alta |
| La docente quiere ver todos los mensajes sin filtro | Configurable en preferencias |
| El padre insiste repetidamente fuera del horario | El asistente mantiene el límite con amabilidad |

---

### CDU-DOC-016 — Alerta de bienestar emocional de alumno

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Sistema → Docente (confidencial)
**Canales:** App (solo a la docente, discreto)

**Trigger:** El sistema detecta combinación de señales preocupantes en un alumno: aumento de ausencias, cese abrupto de interacción en la plataforma, y señales de malestar en conversaciones del alumno.

**Flujo conversacional:**
```
[App — push discreto para la docente]

Asistente: "Seño, quería comentarle algo sobre Valentina Gómez.
            En los últimos 10 días:
            - Faltó 4 veces (antes tenía asistencia perfecta)
            - Dejó de completar actividades en la app
            - Sus conversaciones con el asistente mostraron palabras
              relacionadas con tristeza y aislamiento
              (no puedo mostrarle el contenido exacto — privacidad)
            El equipo de orientación también fue notificado.
            ¿Querés que agende una charla con Valentina para el martes?"
```

**Tool MCP requerida:**
- `get_asistencia` (histórica del alumno)
- Señales de bienestar del asistente del alumno (alertas anonimizadas — protocolo API SPEC §5.3)
- `get_alertas_institucionales` (tipo: bienestar)
- `enviar_comunicado` (al equipo de orientación)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Señales ambiguas | "No es una situación crítica, pero hay un patrón que vale la pena atender." |
| La docente pide más contexto de las conversaciones | "Por privacidad del alumno no puedo mostrar las conversaciones, solo el patrón observable." |

**Principio III (CRÍTICO):** Las conversaciones del alumno son estrictamente confidenciales. La alerta a la docente incluye SOLO el patrón de comportamiento observable, NUNCA el contenido literal del chat. Esto es NON-NEGOTIABLE.

---
## Perfil: Admin / Directivo / Secretaría

> **Tono:** Ejecutivo, preciso, orientado a datos. Números antes que narrativa.
> **Restricción clave:** Acceso total a datos institucionales. Máximo nivel de permiso. Sin acceso a contenido de conversaciones privadas de alumnos (Principio III).

---

### CDU-ADM-001 — Dashboard de pulso institucional

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador / Directivo
**Canales:** App · Web

**Trigger:** El administrador abre la app o pide un resumen. Ejemplos: "¿Cómo estamos hoy?", "Buenos días, resumen".

**Flujo conversacional:**
```
Admin: "¿Cómo estamos hoy?"

Asistente: [llama get_asistencia(escuela_id, fecha=hoy)]
           [llama get_dashboard_morosidad(escuela_id)]
           [llama get_alertas_institucionales(escuela_id)]
           [llama get_comunicados (estadísticas de lectura)]
→ "Buenos días. Pulso de San Martín — lunes 4 de marzo:
   Asistencia (8:25am): 208/240 alumnos. 8 grados tomaron lista.
   Morosidad: $3.1M vencido. 3 familias en riesgo alto.
   Comunicados: 2 sin confirmar lectura en +100 familias.
   Alertas: Valentina Gómez (12 días ausente), Familia Pérez (riesgo deserción).
   ¿Por dónde querés empezar?"
```

**Tool MCP requerida:**
- `get_alertas_institucionales`
- `get_dashboard_morosidad`
- `get_asistencia`
- `get_comunicados`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Día sin novedades relevantes | "Todo tranquilo hoy — no hay alertas activas ni urgencias." |
| Admin que no quiere el resumen automático | Configurable; no muestra el resumen si está deshabilitado |

---

### CDU-ADM-002 — Consulta de estado de morosidad

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin pregunta por la morosidad. Ejemplos: "¿Cómo viene la morosidad?", "¿Quiénes deben más de un mes?".

**Flujo conversacional:**
```
Admin: "¿Cómo viene la morosidad este mes?"

Asistente: [llama get_dashboard_morosidad(escuela_id, segmentacion="resumen")]
→ "Morosidad al 4/3/2026:
   | Estado        | Familias | % | Monto        |
   | Al día        | 187      |78%| —            |
   | Deuda 1 mes   |  32      |13%| $1.344.000   |
   | Deuda 2+ meses|  21      | 9%| $1.764.000   |
   Total vencido: $3.108.000
   3 familias combinan morosidad con riesgo de deserción.
   ¿Ver detalle por familia, mandar recordatorios o ver las familias de riesgo?"
```

**Tool MCP requerida:**
- `get_dashboard_morosidad`
- `get_riesgo_desercion` (si el admin quiere ver familias de riesgo)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin morosidad | "Todas las familias están al día. Recaudación completa del mes." |
| Admin pide comparación con mes anterior | Ejecuta get_dashboard_morosidad para ambos períodos y presenta diferencia |
| Admin pide segmentación por grado | Parámetro segmentacion="por_grado" |

---

### CDU-ADM-003 — Envío de recordatorio de cobro

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere enviar recordatorios a familias morosas. Ejemplo: "Mandá recordatorio a los que deben febrero".

**Flujo conversacional:**
```
Admin: "Mandá recordatorio a los que deben más de un mes, segmentalo:
        tono amable para los que siempre pagaron, firme para los reincidentes"

Asistente: [llama get_dashboard_morosidad(segmentacion="por_familia")]
           [llama get_riesgo_desercion para cruzar con riesgo]
→ "Segmentando:
   Recordatorio amable: 14 familias (historial de pago correcto, atraso puntual)
   Recordatorio firme: 8 familias (patrón de mora reincidente)
   Para llamada personal tuya: 4 familias (señal de riesgo combinada)
   Ya en gestión activa con secretaría: 6 familias (excluidas del envío)
   ¿Confirmamos el envío?"

Admin: "Sí"

Asistente: [llama enviar_comunicado(destinatarios=[...], cuerpo=..., prioridad="normal")]
→ "Recordatorios enviados ✅. En 48hs te digo cuántos pagaron."
```

**Tool MCP requerida:**
- `get_dashboard_morosidad`
- `get_riesgo_desercion`
- `generar_comunicado_borrador`
- `enviar_comunicado`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Familia con plan de pago vigente | El sistema las excluye automáticamente del envío |
| Admin quiere tono más firme | Genera una versión más directa pero siempre dentro de parámetros institucionales |

---

### CDU-ADM-004 — Generación de plan de pago para familia morosa

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere ofrecer un plan de pago a una familia con deuda. Ejemplo: "Generá plan de pago en 3 cuotas para familia López".

**Flujo conversacional:**
```
Admin: "Generá plan de pago en 3 cuotas para familia Pérez"

Asistente: [llama get_estado_cuenta(familia_id="fam_perez")]
→ "Familia Pérez — Deuda total: $126.000 (3 cuotas atrasadas)
   Plan de pago sugerido — 3 cuotas:
   | Cuota | Monto   | Vencimiento |
   | 1ra   | $42.000 | 15/3        |
   | 2da   | $42.000 | 15/4        |
   | 3ra   | $42.000 | 15/5        |
   Sin interés (política actual).
   ¿Aprobás y notificamos a la familia?"

Admin: "Sí, pero en 4 cuotas"

Asistente: [ajusta el plan con 4 cuotas]
→ "Plan actualizado. Enviando propuesta a la familia Pérez ✅."
```

**Tool MCP requerida:**
- `get_estado_cuenta`
- `generar_comunicado_borrador` (propuesta al tutor)
- `enviar_comunicado`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La familia ya tiene un plan activo | Informa el plan existente y pregunta si se desea modificar |
| La familia rechaza el plan | Registra el rechazo y escala a directivo si hay riesgo de deserción |

---

### CDU-ADM-005 — Consulta de riesgo de deserción

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador / Sistema (proactivo)
**Canales:** App · Web

**Trigger:** El admin consulta qué familias tienen riesgo de baja, o el sistema alerta proactivamente.

**Flujo conversacional:**
```
Admin: "¿Qué familias tienen riesgo de irse?"

Asistente: [llama get_riesgo_desercion(escuela_id, umbral_riesgo="alto")]
→ "3 familias con riesgo ALTO de deserción:

   1. Familia Pérez (Tomás, 2do A) — Índice: 87/100
      Factores: morosidad 2 meses + padre no lee comunicados 3 semanas
              + no confirmó reinscripción 2027 (vence en 15 días)
      Recomendación: Llamado directo esta semana.

   2. Familia Gómez (Valentina, 4to B) — Índice: 74/100
      Factores: alumna faltó 12 días + morosidad 1 mes
      Recomendación: Entrevista con la docente.

   3. Familia Torres (3 hijos) — Índice: 71/100
      Factores: morosidad creciente desde enero
      Recomendación: Ofrecer plan de pagos.

   ¿Querés actuar sobre alguna de estas familias ahora?"
```

**Tool MCP requerida:**
- `get_riesgo_desercion`
- `get_estado_cuenta` (para profundizar en la situación financiera)
- `get_asistencia` (para profundizar en situación del alumno)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin familias en riesgo | "No hay familias con riesgo alto en este momento." |
| Admin quiere también riesgo medio | Re-ejecuta con umbral_riesgo="medio" |
| Familia ya avisó que se va | El asistente actualiza el índice y sugiere un protocolo de offboarding cuidadoso |
| Proactividad del sistema | Si una familia cruza el umbral durante la semana, el sistema alerta sin esperar consulta del admin |

**Principio III:** Los datos del índice de riesgo son de uso interno de la institución. No se comparten con otras escuelas ni con terceros.

---

### CDU-ADM-006 — Simulación de escenario financiero

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere modelar el impacto de cambios en cuota, matrícula o costos. Ejemplo: "Simulame qué pasa si subo la cuota 15% y pierdo 10 alumnos".

**Flujo conversacional:**
```
Admin: "Simulame qué pasa si subo 15% y pierdo 10 alumnos"

Asistente: [llama simular_escenario_financiero(escuela_id, variacion_cuota_pct=15,
            variacion_alumnos=-10)]
→ "Simulación financiera:
   Estado actual: 240 alumnos × $42.000 = $10.080.000/mes
   Escenario (+15%, -10): 230 alumnos × $48.300 = $11.109.000/mes
   Diferencia: +$1.029.000/mes ✅
   El punto de equilibrio se mantiene incluso con 15 bajas.
   ¿Querés modelar otro escenario o ver el impacto en masa salarial?"

Admin: "Y si pierdo 25 alumnos?"

Asistente: [llama simular_escenario_financiero con variacion_alumnos=-25]
→ "Con 25 bajas: 215 alumnos × $48.300 = $10.384.500/mes (+$304.500).
   Todavía positivo pero margen mínimo."
```

**Tool MCP requerida:**
- `simular_escenario_financiero`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Escenario con resultado negativo | Lo muestra con honestidad: "En este escenario la recaudación baja $X." |
| Admin quiere comparar dos escenarios | Genera tabla comparativa lado a lado |
| Admin quiere sumar cargo adicional (materiales) | Parámetro concepto_adicional={nombre, monto} |

---

### CDU-ADM-007 — Alertas tempranas automáticas

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Sistema → Administrador (proactivo)
**Canales:** App · Web (push)

**Trigger:** El sistema detecta anomalías automáticamente sin consulta del admin.

**Flujo conversacional:**
```
[Push al admin]

Asistente: "Alerta: Pedro González (3er año) faltó 4 de los últimos 5 días.
            Sus notas también cayeron este trimestre.
            La docente de 3ro B no tomó asistencia en 3 de los últimos 7 días.
            ¿Querés que el equipo de orientación lo tenga en el radar?"

Admin: "Sí, avisalos"

Asistente: [llama enviar_comunicado al equipo de orientación — notificación interna]
→ "Equipo de orientación notificado ✅."
```

**Tool MCP requerida:**
- `get_alertas_institucionales` (ejecutado automáticamente por scheduler)
- `get_riesgo_desercion`
- `enviar_comunicado` (notificación interna)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Admin quiere filtrar solo alertas de un tipo | "Solo morosidad" → tipo=["morosidad_nueva"] |
| Admin ya actuó sobre una alerta | No reaparece hasta que cambien los factores que la generaron |

---

### CDU-ADM-008 — Generación de documentación para el regulador (DIEGEP)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin solicita documentación requerida por DIEGEP o DGEGP. Ejemplo: "Generame el informe de matrícula para DIEGEP".

**Flujo conversacional:**
```
Admin: "Generame el informe de matrícula para DIEGEP con datos actualizados"

Asistente: [consolida datos de matrícula del sistema]
→ "Informe de Matrícula — Colegio San Martín — Marzo 2026:
   Matrícula total: 240 alumnos
   Inicial: 45 (Sala 3: 15, Sala 4: 15, Sala 5: 15)
   Primaria: 140 (1ro a 6to)
   Secundaria: 55 (1ro a 5to)
   Docentes: 28 (planta funcional completa)
   ⚠️ Este documento requiere tu revisión y firma antes de enviarlo.
   ¿Lo descargás en PDF, lo editás o lo compartís con secretaría para revisión?"

Admin: "Lo comparto con secretaría"

Asistente: "Enviado a secretaría para revisión ✅. Te aviso cuando lo aprueben."
```

**Tool MCP requerida:**
- Múltiples function calls para consolidar datos institucionales
- `generar_comunicado_borrador` (para formatear el documento)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Datos de matrícula no actualizados | Informa la fecha del último cierre y advierte que el informe refleja ese estado |
| Alumnos sin documentación completa | "5 alumnos no tienen legajo completo — puede observarse en la inspección." |
| Formato del regulador cambió | El template se actualiza según el formulario vigente configurado en el sistema |

---

### CDU-ADM-009 — Comparación de períodos / evolución institucional

**Prioridad:** P1 | **Origen:** `[Extension]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere comparar métricas entre períodos. Ejemplos: "¿Cómo está la asistencia vs. la semana anterior?", "Compará morosidad de marzo vs. febrero".

**Flujo conversacional:**
```
Admin: "¿Cómo está la asistencia esta semana vs. la anterior?"

Asistente: [llama get_asistencia(escuela_id, desde=semana_actual)]
           [llama get_asistencia(escuela_id, desde=semana_anterior)]
→ "Comparación de asistencia:
   | Semana          | Presentes | Ausentes | % Asistencia |
   | Esta (3-7/3)    | 218/240   | 22       | 90.8%        |
   | Anterior (24-28/2) | 225/240| 15       | 93.8%        |
   Bajó 3 puntos. El grado con más ausencias esta semana: 4to B (5 ausentes de 24).
   ¿Querés investigar la causa o ver qué grado tiene más inasistencias?"
```

**Tool MCP requerida:**
- `get_asistencia` (con rangos de fecha para comparación)
- `get_dashboard_morosidad` (para comparación de morosidad)
- `get_alertas_institucionales` (para detectar patrones)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Datos del año anterior no disponibles (primer año en Vujy) | "No tengo datos históricos anteriores a 2026 — este es el primer año en Vujy." |
| Comparación con feriados en el período | Normaliza por días hábiles antes de comparar |

---

### CDU-ADM-010 — Estadísticas de asistencia institucional

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin consulta tendencias de asistencia a nivel institucional. Ejemplos: "¿Cómo está la asistencia esta semana?", "¿Qué grado tiene más inasistencias?".

**Flujo conversacional:**
```
Admin: "¿Qué grado tiene más inasistencias esta semana?"

Asistente: [llama get_asistencia(escuela_id, desde=inicio_semana, hasta=hoy) — agrupado por grado]
→ "Inasistencias esta semana por grado:
   1. 3er año (Secundaria): 12 — 24% del grado
   2. 2do B (Primaria): 8 — 22% del grado
   3. Sala 4 (Inicial): 5 — 33% de la sala
   ¿Querés ver los alumnos de alguno en particular?"
```

**Tool MCP requerida:**
- `get_asistencia`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Inasistencia masiva inusual | Alerta proactiva: "El lunes 3/3 faltó el 40% de 5to A. ¿Hubo alguna novedad ese día?" |

---

### CDU-ADM-011 — Gestión de personal y masa salarial

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin consulta impacto financiero de decisiones de personal. Ejemplos: "¿Cuánto es la masa salarial?", "Si tomo un docente más, ¿cómo impacta?".

**Flujo conversacional:**
```
Admin: "Si tomo un docente más para desdoblar 4to, ¿cómo impacta?"

Asistente: [llama simular_escenario_financiero con parámetro de nuevo docente]
→ "Impacto de contratar un docente para desdoblar 4to grado:
   Masa salarial actual: $4.200.000/mes
   Costo estimado nuevo docente (medio turno): $280.000/mes
   Nueva masa salarial: $4.480.000/mes (+6.7%)
   Ratio salarios/recaudación: actual 41.7% → nuevo 44.4%
   El umbral de sostenibilidad es 50% — todavía hay margen."
```

**Tool MCP requerida:**
- `simular_escenario_financiero`
- Datos de personal (función futura — no en API-SPEC actual)

---

### CDU-ADM-012 — Encuestas de satisfacción / NPS escolar

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Administrador / Sistema (análisis post-evento)
**Canales:** App · Web

**Trigger:** Post-evento (reunión de padres, fin de trimestre) o consulta directa. Ejemplos: "Lanzá encuesta post-reunión", "¿Cómo está el NPS este trimestre?".

**Flujo conversacional:**
```
Admin: "¿Cómo está la satisfacción este trimestre?"

Asistente: "NPS Escolar — 1er trimestre 2026:
            Score: 62 (era 71 el trimestre anterior) ↓
            Positivo: instalaciones (9.1), actividades (8.8)
            Negativo: comunicación docente 3ro B (6.2) — mencionado por 8 familias.
            ¿Querés ver el detalle de 3ro B o preparar un plan de acción?"
```

**Tool MCP requerida:**
- Analytics de encuestas (función futura — no en API-SPEC actual)
- `get_alertas_institucionales` (si se detecta problema en grado específico)
- `enviar_comunicado` (para enviar la micro-encuesta a padres)

---

### CDU-ADM-013 — Proyección de flujo de caja

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin quiere proyectar la recaudación del mes. Ejemplo: "¿Cuánto voy a recaudar este mes?".

**Flujo conversacional:**
```
[App — 28 del mes — proactivo]

Asistente: "A 3 días del cierre de marzo, tengo la proyección:
            Recaudación proyectada: $12.8M (87% de meta)
            Ya cobrado: $11.2M
            Probable de cobrar (familias con historial tardío): $1.4M
            En riesgo real de no cobrar: $600K (patrón de no pago)
            Mes anterior fue 91%. Diferencia: 4 puntos.
            3 familias que siempre pagan entre el 28-31 no pagaron aún.
            ¿Les mando un recordatorio suave?"
```

**Tool MCP requerida:**
- `get_dashboard_morosidad`
- `simular_escenario_financiero` (proyección basada en historial)
- `enviar_comunicado`

---

### CDU-ADM-014 — Benchmark entre escuelas de la red

**Prioridad:** P3 | **Origen:** `[Innovation]`
**Actor:** Administrador
**Canales:** Web · App

**Trigger:** El admin quiere saber cómo está su escuela versus pares de la red. Ejemplo: "¿Cómo estamos en morosidad comparado con otras escuelas similares?".

**Flujo conversacional:**
```
Admin: "¿Cómo estamos en morosidad comparado con escuelas similares?"

Asistente: "Benchmark — Escuelas similares en Vujy
            (privadas, inicial+primaria+secundaria, GBA Norte, 250-350 alumnos):

            Tu escuela:        23% de familias con deuda
            Promedio de la red: 18%
            Mejor de la red:   11%

            Las escuelas con mejor performance disparan recordatorios
            desde el día 5 de retraso (vs. el día 15 que usás vos).
            ¿Ajustamos la configuración de recordatorios automáticos?"
```

**Tool MCP requerida:**
- `get_dashboard_morosidad` (propia escuela)
- Analytics agregados de la red (anonimizados, con consentimiento de escuelas participantes)

**Principio III (CRÍTICO):** Los datos del benchmark son estrictamente agregados y anonimizados. Ningún administrador puede ver datos individuales de otra escuela. NON-NEGOTIABLE.

---
## Perfil: Alumno

> **Canales:** App nativa ÚNICAMENTE. WhatsApp está vedado para alumnos (menores de edad) — NON-NEGOTIABLE.
> **Principio III:** Guardarraíles estrictos en todo momento. Sin acceso a datos de otros alumnos. Sin salida libre a internet. No completa tareas por el alumno. Protocolo de malestar emocional activo en todos los niveles.
> **Tono:** Varía radicalmente por nivel educativo — ver sub-perfiles.

---

### Sub-perfil: Nivel Inicial (3 a 5 años)

> El alumno de inicial NO interactúa con chat libre. La experiencia es táctil, visual y mediada por adulto. Los CDU son de actividades gamificadas, no de conversación abierta.

---

### CDU-ALU-001 — Actividad visual interactiva mediada (Inicial)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de nivel inicial (mediado por adulto o docente)
**Canales:** App (experiencia táctil-visual)

**Trigger:** El niño o el adulto que lo acompaña abre la app de actividades del día.

**Flujo conversacional:**
```
[App — Sala de 4 años — en casa con mamá]

[Pantalla: avatar de Vujy (animalito), botón grande "¿Jugamos?"]

[El niño toca el botón]

Asistente (voz): "¡Hola Sofi! La seño nos mandó un juego divertido.
                  ¿Listos para jugar?"

[Pantalla: imagen de 4 animales]

Asistente (voz): "¿Cuál de estos animales dice 'muuuu'? ¡Tocalo!"

[Sofi toca la vaca]

Asistente (voz): "¡Muy bien, Sofi! ¡Es la vaquita! ¡Ganaste una estrellita!"

[Después de completar]

Asistente (voz): "¡Terminaste todas las actividades de hoy!
                  Tu mascota está muy contenta."

[Notificación automática al tutor]
"Sofi completó 3 actividades hoy. Reconoció todos los animales de granja."
```

**Tool MCP requerida:**
- Actividades asignadas por la docente (precargadas)
- `registrar_observacion_pedagogica` (automático basado en resultados — para la docente)
- Notificación al tutor (progreso del día)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El niño no puede completar por frustración | Aliento: "¡Casi! ¿Intentamos de nuevo? No hay apuro." — nunca hace sentir mal al niño |
| El niño repite opciones incorrectas 3 veces | Feedback visual de la respuesta correcta — refuerzo positivo siempre |
| Sin actividades asignadas (la docente no cargó) | La app muestra actividades de repaso del día anterior |

**Principio III:** No hay chat libre. Todo es interacción dirigida dentro de actividades predefinidas. El adulto siempre puede ver lo que el niño ve. Las actividades del niño solo son visibles para sus tutores autorizados y su docente.

---

### Sub-perfil: Primaria Primer Ciclo (1ro a 3ro, 6-8 años)

---

### CDU-ALU-002 — Misión diaria gamificada (Primaria 1er ciclo)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de 1er ciclo de primaria
**Canales:** App

**Trigger:** El alumno abre la app y ve sus misiones del día asignadas por la docente.

**Flujo conversacional:**
```
[App — 2do grado, en casa]

Asistente: "¡Hola Mati! Tenés 2 misiones para hoy:
            Misión 1: Matemática — 3 sumas [5 monedas]
            Misión 2: Lectura — 5 palabras [8 monedas]
            Si completás las dos, ganás 13 monedas para tu avatar. ¿Arrancamos?"

[Mati toca Misión 1]

Asistente: "¡Misión Matemática! 5 + 3 = ?"

[Mati escribe 8]

Asistente: "¡Genial! Correcto. 7 + 4 = ?"

[Mati escribe 10]

Asistente: "Casi, Mati. 7 + 4 es 11. ¡Contá con los dedos si querés! ¿Lo intentamos?"

[Mati escribe 11]

Asistente: "¡Ahí está! ¡Lo lograste! 🎉 Ganaste 5 monedas 🪙"
```

**Tool MCP requerida:**
- `get_tareas` (misiones del día asignadas por docente)
- Módulo de actividades gamificadas
- Registro de progreso y monedas

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Respuesta incorrecta | Guía sin revelar la respuesta: "¡Casi! Contá de nuevo..." |
| Completa todas las misiones | Muestra celebración, actualiza monedas, muestra tablero del grado |
| Sin misiones asignadas | "¡Hoy no tenés misiones! Buen trabajo esta semana. ¿Querés repasar algo?" |
| Alumno pide chatear fuera del contexto | "Preguntale a tu seño o a tus papás." |

**Principio III:** El alumno solo ve sus propias misiones y monedas. Los datos de otros alumnos no son accesibles.

---

### CDU-ALU-003 — Ver progreso personal (Primaria 1er ciclo)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Alumno de 1er ciclo de primaria
**Canales:** App

**Trigger:** El alumno pregunta por sus misiones o monedas. Ejemplos: "¿Cuántas monedas tengo?", "¿Cuántas misiones hice?".

**Flujo conversacional:**
```
Alumno: "¿Cuántas monedas tengo?"

Asistente: "Tenés 85 monedas 💰
            Esta semana completaste 6 misiones.
            ¡Con 100 monedas podés cambiar el sombrero de tu avatar!
            Te faltan 15 monedas. ¿Hacemos una misión ahora?"
```

**Tool MCP requerida:**
- `get_resumen_alumno` (adaptado — solo logros y gamificación, datos del alumno propio)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno pregunta por las monedas de un compañero | "Solo puedo mostrarte las tuyas." |

---

### Sub-perfil: Primaria Segundo Ciclo (4to a 6to, 9-12 años)

---

### CDU-ALU-004 — Explicación de tema de clase (Primaria 2do ciclo)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Alumno de 2do ciclo de primaria
**Canales:** App

**Trigger:** El alumno no entiende un tema y lo consulta. Ejemplo: "No entiendo la división con dos cifras", "¿Qué son las fracciones equivalentes?".

**Flujo conversacional:**
```
Alumno: "No entiendo las fracciones equivalentes"

Asistente: "Tranquilo, lo vemos juntos. Imaginá que tenés una pizza.
            Si la cortás en 2 y comés 1 parte, comiste 1/2.
            Si la misma pizza la cortás en 4 y comés 2 partes — ¿comiste
            más o menos? Lo mismo, ¿no? Eso es 2/4... y 2/4 = 1/2.
            Son fracciones equivalentes.
            ¿Lo probamos con un ejercicio?"

Alumno: "Sí"

Asistente: "¿Cuánto es 3/6? ¿Es equivalente a 1/2?"

[Alumno responde]

Asistente: "¡Exacto! 3/6 = 1/2. Lo entendiste perfectamente. 🌟"
```

**Tool MCP requerida:**
- RAG sobre materiales de clase (para contextualizar al contenido que están viendo)
- LLM sin tools externas (respuesta educativa general del nivel)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno pide que le haga la tarea | "No te puedo dar la respuesta, porque así no aprendés. Pero te ayudo a llegar." |
| Pregunta fuera del contexto escolar | "Eso no es algo que pueda explicarte. Si tenés dudas de clase, con gusto te ayudo." |
| Alumno frustrado | "Entiendo que es difícil. Vamos de a poco — ¿qué parte no te queda claro?" |
| Alumno menciona malestar | Activa protocolo de bienestar (CDU-ALU-011) |

---

### CDU-ALU-005 — Ver tareas pendientes (Primaria 2do ciclo)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Alumno de 2do ciclo de primaria
**Canales:** App

**Trigger:** El alumno consulta qué tiene pendiente. Ejemplos: "¿Qué tareas tengo para mañana?", "¿Cuáles son mis misiones?".

**Flujo conversacional:**
```
Alumno: "¿Qué tareas tengo para mañana?"

Asistente: [llama get_tareas(alumno_id, solo_pendientes=true)]
→ "Para mañana tenés:
   - Matemática: ejercicios 3 y 4 de la página 48
   - Lengua: traer el libro 'El hombre que calculaba'
   ¿Querés que te explique alguno?"
```

**Tool MCP requerida:**
- `get_tareas`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin tareas | "No tenés tareas para mañana. ✅" |
| Tarea atrasada | "Hay un ejercicio que no completaste. ¿Lo hacemos ahora?" |
| Material adjunto en una tarea | Muestra el material disponible en la app |

**Principio III:** El alumno solo puede ver sus propias tareas.

---

### CDU-ALU-006 — Generar flashcards para estudio (Primaria 2do ciclo)

**Prioridad:** P3 | **Origen:** `[Base]`
**Actor:** Alumno de 2do ciclo de primaria
**Canales:** App

**Trigger:** El alumno quiere repasar un tema con tarjetas. Ejemplo: "Armame tarjetas para repasar los ríos de América".

**Flujo conversacional:**
```
Alumno: "Armame tarjetas para repasar los ríos de América"

Asistente: [RAG sobre materiales de clase + LLM]
→ "Acá van tus tarjetas:
   Tarjeta 1/5: ¿Cuál es el río más largo de América del Sur?
   [El alumno responde]
   Respuesta: El Amazonas (~6.400 km)
   ¿Pasamos a la siguiente?"
```

**Tool MCP requerida:**
- RAG sobre materiales de clase
- Módulo de flashcards con repetición espaciada (SRS)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Tema no visto en clase aún | "Todavía no trabajaron ese tema. ¿Querés que igual te arme tarjetas para adelantar?" |

---

### Sub-perfil: Secundaria (1ro a 5to, 13-17 años)

---

### CDU-ALU-007 — Vista unificada de agenda académica (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno consulta qué tiene pendiente o esta semana. Ejemplos: "¿Qué tengo esta semana?", "¿Qué tengo pendiente?".

**Flujo conversacional:**
```
Alumno: "¿Qué tengo esta semana?"

Asistente: [llama get_tareas(alumno_id, solo_pendientes=true)]
           [llama get_calendario(alumno_id, desde=hoy, hasta=fin_semana)]
→ "Esta semana — 4 al 8 de marzo:
   Martes: Ed. Física (llevar ropa deportiva)
   Miércoles: entregar TP de Historia ⚠️
   Jueves: prueba de Física (Fuerza y Energía)
   Viernes: Lengua — leer Capítulo 3 de 'El túnel'
   ¿Querés que te arme un plan de estudio para el parcial de Física?"
```

**Tool MCP requerida:**
- `get_tareas`
- `get_calendario`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Nada pendiente | "No tenés nada pendiente para esta semana. ✅" |
| Muchas cosas el mismo día | Sugiere revisar si se puede mover alguna fecha |
| Feriado en medio de la semana | Lo indica con impacto en días disponibles para estudiar |

---

### CDU-ALU-008 — Consulta de situación académica propia (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno consulta cómo viene en sus materias. Ejemplos: "¿Cómo vengo en matemática?", "¿Me alcanza para aprobar si saco 7 en el próximo trimestre?".

**Flujo conversacional:**
```
Alumno: "¿Cómo vengo en matemática?"

Asistente: [llama get_notas(alumno_id, materia="Matemática")]
→ "Matemática — 2do trimestre:
   Parcial 1: 6 | TP grupal: 8 | Parcial 2: 5
   Promedio actual: 6.3 — tendencia a la baja ↓
   ¿Querés que calculemos qué necesitás sacar en el próximo parcial?"

Alumno: "Sí, quiero llegar a 7"

Asistente: "Para llegar a 7 de promedio necesitás sacar al menos 8 en el
            próximo parcial. ¿Querés que te arme un plan de estudio?"
```

**Tool MCP requerida:**
- `get_notas` (solo datos del alumno propio)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno tiene materias previas | Informa las previas claramente y cuándo son los exámenes de recuperación |
| Consulta por todas las materias | Genera panorama completo con todas las notas disponibles |
| Comparación con otros alumnos | "Solo puedo mostrarte tus propias notas." |
| Alumno angustiado | "Sé que no fue el resultado que esperabas. Todavía hay tiempo de mejorar." |
| Pregunta sobre escalas de recuperación | El asistente no improvisa: "Consultá con tu profe o preceptor sobre eso." |

**Principio III:** El alumno solo puede ver sus propios datos académicos.

---

### CDU-ALU-009 — Explicación de contenido curricular (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno no entiende un tema y consulta al asistente. Ejemplos: "Explicame la revolución francesa como si fuera una historia", "No entiendo las funciones cuadráticas".

**Flujo conversacional:**
```
Alumno: "No entiendo la revolución rusa, tengo historia mañana"

Asistente: "¿Qué parte no te cierra — las causas, lo que pasó durante
            la revolución, o lo que vino después?"

Alumno: "Las causas"

Asistente: [explica con contexto, adaptado al nivel]
→ "La Revolución Rusa de 1917 tenía tres problemas acumulándose:
   1. El zar gobernaba de forma absoluta y no escuchaba al pueblo
   2. Rusia estaba perdiendo la Primera Guerra Mundial
   3. Millones pasaban hambre mientras la nobleza vivía bien
   ¿Algo de esto no te queda claro? ¿O querés que veamos la diferencia
   entre la revolución de febrero y la de octubre?"
```

**Tool MCP requerida:**
- RAG sobre materiales de clase del docente
- LLM sin tools externas (explicación pedagógica general del nivel)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno pide que le haga el TP | "No te escribo el trabajo — sí puedo ayudarte a entender el tema." |
| Alumno frustrado | Reconoce la frustración antes de responder el contenido |
| Sin materiales de clase en RAG | "No tengo los apuntes de tu clase, pero te explico el tema de forma general." |
| Tema fuera del scope educativo | Redirige al contexto escolar con amabilidad |

---

### CDU-ALU-010 — Generación de plan de estudio personalizado (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno tiene una prueba próxima y pide un plan. Ejemplos: "Tengo prueba de física el jueves, ¿me armás un plan?", "¿Por dónde empiezo a estudiar?".

**Flujo conversacional:**
```
Alumno: "Tengo física el jueves y no sé por dónde empezar"

Asistente: [llama get_calendario(alumno_id) para verificar la evaluación]
           [llama get_notas(alumno_id, materia="Física") para ver rendimiento previo]
→ "Tenés la prueba de Física el jueves 12/3 — quedan 3 días.
   Basándome en tus notas, el tema más flojo es Energía.
   Plan propuesto:
   - Hoy: repasar Fuerza y Leyes de Newton (1hs)
   - Miércoles: repasar Energía cinética y potencial (1.5hs) + simulacro
   ¿Lo activamos?"

Alumno: "Sí"

Asistente: [llama generar_plan_estudio(alumno_id, evaluacion_id, dias_disponibles=3)]
→ "Plan activado ✅. Te recuerdo mañana a las 19hs para el primer bloque."
```

**Tool MCP requerida:**
- `get_calendario`
- `get_notas`
- `generar_plan_estudio`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Quedan menos de 24 horas para la prueba | Adapta el plan a lo razonablemente posible en el tiempo disponible |
| Varias pruebas en la misma semana | Genera un plan que cubra todas con distribución de tiempo equitativa |
| Alumno no sabe de qué es la prueba | "¿Podés revisar el cuaderno para ver qué temas entran?" |

---

### CDU-ALU-011 — Simulacro de examen (Secundaria)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El alumno tiene una prueba próxima y pide un simulacro. Ejemplos: "Haceme un simulacro de historia", "Tengo prueba de física el jueves".

**Flujo conversacional:**
```
Alumno: "Haceme el simulacro de química"

Asistente: "Simulacro de Química — Reacciones Químicas
            10 preguntas | 25 minutos ¿Empezamos?"

[Vujy presenta las preguntas de a una — el alumno responde]

[Al finalizar]

Asistente: "Resultado: 7/10. Muy bien.
            Errores: Pregunta 3 (oxidación/reducción), Pregunta 7 (fórmula del agua).
            Estos 2 temas son los más importantes para estudiar esta noche.
            ¿Querés que te explique cada uno?"
```

**Tool MCP requerida:**
- RAG sobre materiales de clase
- `generar_actividad_educativa` (tipo: simulacro)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin materiales del docente | Genera preguntas del currículo general del nivel; lo aclara |
| Alumno abandona a mitad | Se guarda el progreso; puede retomarlo |
| Alumno pide ver las respuestas antes de terminar | "Cuando termines, te las muestro todas." |
| Alumno repite el mismo simulacro | Mezcla las preguntas y varía los distractores |

---

### CDU-ALU-012 — Participación en foro de debate (Secundaria)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Alumno de secundaria
**Canales:** App

**Trigger:** El docente publicó una pregunta en el foro y el alumno quiere participar. Ejemplo: "¿Fue inevitable la Revolución Francesa?".

**Flujo conversacional:**
```
[Notificación: "Nueva pregunta en el foro de Historia"]

Alumno: "Creo que sí fue inevitable porque la situación social estaba muy mal"

Asistente (moderador): "Buen argumento. ¿Y si el Zar hubiera hecho reformas
                         antes de 1917? ¿Seguiría siendo inevitable?"

Alumno: "Quizás no, pero las reformas eran muy lentas"

Asistente: "Interesante. Tu argumento es que el resultado a largo plazo
            justifica los medios. ¿Estás de acuerdo con esa lógica en general?"
```

**Tool MCP requerida:**
- RAG (materiales del debate, respuestas previas)
- LLM (moderación y desafío de argumentos — sin revelar "la respuesta correcta")

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El alumno escribe algo ofensivo | No lo publica, advierte al alumno; si reincide, notifica al docente |
| El alumno pide la "respuesta correcta" | "En un debate no hay una sola respuesta correcta. El objetivo es argumentar bien." |

---

### CDU-ALU-013 — Portfolio digital y orientación vocacional (Secundaria)

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Alumno de secundaria (4to y 5to año principalmente)
**Canales:** App

**Trigger:** El alumno consulta su portfolio o pide orientación. Ejemplos: "¿Qué tengo en mi portfolio?", "¿En qué soy bueno?".

**Flujo conversacional:**
```
Alumno: "¿Qué tengo en mi portfolio?"

Asistente: [llama get_notas(alumno_id, todos_los_trimestres=true)]
           [RAG sobre proyectos y TPs completados]
→ "Tu portfolio — Valentina Gómez (5to año):
   TPs destacados: Historia (9), Biología (8.5), Física (8)
   Logros: 'Lectora Destacada 2025', '50 simulacros completados'
   Foros: 12 participaciones — destacada en Historia y Ciencias

   Áreas de mayor rendimiento: Biología (9.3), Literatura (8.8), Historia (8.5)
   Basado en tu trayectoria, tenés afinidad con ciencias naturales y escritura.
   ¿Querés explorar orientaciones vocacionales relacionadas?"
```

**Tool MCP requerida:**
- `get_notas` (histórico completo — solo del alumno propio)
- RAG sobre proyectos completados
- Analytics de participación

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno en 1er año (poco portfolio) | Muestra lo que hay y lo motiva a construirlo |
| Alumno quiere exportar su portfolio | Genera un PDF descargable |
| Alumno con perfil muy heterogéneo | "Tus notas son muy variadas — eso también puede ser información útil para orientación." |
| El asistente recomienda una carrera | No es categórico: "Esto es una guía basada en datos — la decisión siempre es tuya." |

**Principio III:** El historial y portfolio del alumno son suyos. Los padres tienen acceso a notas pero no al portfolio completo (configurable por institución).

---

### CDU-ALU-014 — Desafío colaborativo entre grados (Primaria)

**Prioridad:** P2 | **Origen:** `[Innovation]`
**Actor:** Alumno de primaria (1er y 2do ciclo)
**Canales:** App

**Trigger:** La docente lanza un desafío de grado vs. grado o el asistente informa el progreso colectivo.

**Flujo conversacional:**
```
[Notificación]
"¡4to A vs. 4to B en tablas de multiplicar! 3 días."

Asistente: "¡Desafío activado!
            4to A vs. 4to B — Tablas de multiplicar.
            Puntaje actual: 4to A 42 puntos | 4to B 38 puntos.
            ¡Estamos ganando! ¿Jugamos?"

[Al finalizar el desafío]

Asistente: "4to A ganó con 128 puntos vs. 109 de 4to B.
            La seño va a anunciar el resultado mañana en clase."
```

**Tool MCP requerida:**
- `generar_actividad_educativa` (serie de ejercicios para el desafío)
- Sistema de puntuación grupal (sin ranking individual visible al rival)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Grado con menos alumnos | La puntuación se normaliza por porcentaje de participación |
| Alumno que nunca participa | El asistente no presiona, solo invita con amabilidad |

**Principio III:** El ranking es colectivo (el grado), no individual. No se comparan alumnos individuales entre sí. Esto elimina el efecto de humillación del alumno rezagado.

---

### CDU-ALU-015 — Tutor entre pares coordinado por IA (Secundaria)

**Prioridad:** P3 | **Origen:** `[Innovation]`
**Actor:** Alumno de secundaria (tutor y tutorado)
**Canales:** App

**Trigger:** El asistente sugiere al alumno de buen rendimiento ser tutor, o el alumno se ofrece espontáneamente.

**Flujo conversacional:**
```
[App — Renzo, 4to año, promedio 9.5 en Matemática]

[Proactivo]
Asistente: "Renzo, sos uno de los mejores en Matemática de 4to.
            ¿Te interesaría ser tutor de pares? Tu profe lo sabe y lo valora.
            El contacto es dentro de la app, con privacidad garantizada."

Renzo: "Por qué no. ¿Cómo funciona?"

[Cuando se conecta con un alumno que necesita ayuda — sin revelar identidad]

Asistente: "Renzo, tu compañero/a necesita ayuda con ecuaciones de segundo grado.
            ¿Tenés 20 minutos esta tarde?"

Renzo: "Dale, a las 18h"

Asistente: "Sesión coordinada para las 18h ✅"
```

**Tool MCP requerida:**
- `get_notas` (para identificar alumnos con alto rendimiento)
- Sistema de matching tutor-tutorado (anonimizado hasta que se acepte)
- Notificación al docente para aprobación

**Principio III (CRÍTICO):** La identidad del alumno que necesita ayuda NO se revela al tutor hasta que ambos acepten la sesión Y el docente la apruebe. Todas las interacciones son dentro de la app.

---

### CDU-ALU-016 — Detección de malestar emocional y derivación (todos los niveles)

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Alumno (cualquier nivel) · Sistema (detección automática)
**Canales:** App

**Trigger:** El alumno expresa en el chat indicadores de malestar, tristeza, conflicto grave, bullying o riesgo según el protocolo API SPEC §5.3.

**Flujo conversacional — Nivel estándar:**
```
Alumno: "No quiero ir más a la escuela, todo el tiempo me hacen la vida imposible"

Asistente: "Entiendo que estás pasando algo muy difícil. Eso importa.
            ¿Hay un adulto de confianza con quien puedas hablar hoy —
            un familiar, una docente o alguien de orientación?
            No tenés que pasar por esto solo/a."

[El sistema genera una alerta interna para el equipo de orientación
 sin revelar el contenido exacto de la conversación]
```

**Flujo conversacional — Nivel urgencia extrema:**
```
Alumno: "Ya no quiero estar más"

Asistente: "Escucho que estás en un momento muy difícil. Eso es real.
            Por favor, si podés, hablá con alguien de tu familia ahora mismo,
            o llamá al 135 (Centro de Asistencia al Suicida — gratuito, 24hs).
            No estás solo/a."

[Alerta de alta prioridad INMEDIATA a directivo de turno + equipo de orientación]
```

**Tool MCP requerida:**
- Protocolo interno de alerta al equipo de orientación (API SPEC §5.3)
- Sistema de alertas escalonadas por nivel de urgencia

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Malestar ordinario (estrés de examen) | Contención empática sin escalar al nivel 2: "Es normal sentirse presionado. ¿Preparamos la prueba juntos?" |
| El alumno dice después que era un chiste | No lo ignora — mantiene la alerta discreta y responde con calma |
| Alumno de nivel inicial con malestar | Respuesta simple y cálida + notificación INMEDIATA al adulto supervisor |
| Riesgo inmediato para el alumno (se menciona hacerse daño) | Escala a urgente, llega al directivo de turno; reitera la línea de ayuda (135) |

**Principio III (NON-NEGOTIABLE):** El contenido exacto de la conversación NO se comparte con docentes ni con padres sin protocolo institucional. La alerta al equipo de orientación incluye SOLO el nivel de urgencia y el patrón observable, NUNCA el contenido literal del chat. Esta restricción es ABSOLUTA.

---
## Flujos Cross-Perfil

> Flujos que involucran coordinación entre dos o más perfiles a través del asistente.

---

### CDU-CROSS-001 — Docente y padre coordinando apoyo para un alumno

**Perfiles:** Docente + Padre / Tutor
**Prioridad:** P2 | **Origen:** `[Innovation]`
**Canales:** App (ambos) · WhatsApp (padre)

**Descripción:** El asistente actúa como intermediario que facilita la coordinación entre la docente y el padre para apoyar a un alumno con dificultades, sin exposición directa entre ellos fuera del canal institucional.

**Flujo conversacional:**
```
[Perspectiva de la docente — App]

Seño: "Quiero coordinar con los papás de Juan sobre sus dificultades
       en lectura, pero no quiero que se asusten"

Asistente: "Te propongo: primero un mensaje cálido, y si no responden en
            2 días, les mandamos una invitación para una reunión breve.
            ¿Querés que genere el mensaje?"

Seño: "Sí"

Asistente: [genera mensaje cálido] → Seño aprueba → Asistente envía

[2 días después — los papás no respondieron]

Asistente: "Los papás de Juan todavía no respondieron. ¿Les mando la
            invitación para una reunión el martes o miércoles a las 17h?"

Seño: "Sí"

[Perspectiva del padre — WA]

Asistente: "Hola Pablo, la Seño Andrea quería charlar sobre Juan.
            No es nada preocupante — quiere coordinar para apoyarlo
            en lectura. ¿Podés el martes o miércoles a las 17h?"

Padre: "El martes perfecto"

Asistente: "Reunión confirmada para el martes 10/3 a las 17h ✅. Le avisé a la seño."
```

**Tool MCP requerida:**
- `generar_comunicado_borrador`
- `enviar_comunicado` (canal docente → familia)
- `get_calendario` (para proponer y agendar)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre responde agresivamente | El asistente mantiene tono institucional; deriva a la directora si escala |
| La reunión no puede concretarse | Ofrece alternativas: llamada, mensaje en la plataforma |

**Principio III:** El asistente no comparte datos académicos del alumno con el padre sin el consentimiento de la docente de ir más allá del mensaje inicial.

---

### CDU-CROSS-002 — Suspensión de clases: alerta masiva en cascada

**Perfiles:** Admin → Docentes + Padres (en cascada)
**Prioridad:** P1 | **Origen:** `[Base]` `[Extension]`
**Canales:** WhatsApp + App + Push (todos los canales simultáneos)

**Flujo conversacional:**
```
[Admin — 6:30am]

Admin: "Suspendé las clases de hoy, hay un problema con la calefacción"

Asistente: "Voy a enviar alerta urgente de suspensión de clases.
            ALERTA PROPUESTA:
            Canal: WhatsApp + app + push — TODOS
            Prioridad: URGENTE
            Mensaje: 'URGENTE — Colegio San Martín: Se suspenden las clases
            de HOY 5/3 por inconveniente técnico. Clases normales mañana.'
            Destinatarios: 312 familias + 28 docentes. ¿Enviamos?"

Admin: "Sí"

Asistente: [llama enviar_comunicado(todos, prioridad=urgente, todos_canales=true)]
→ "Enviado ✅ (6:32am).
   Alcance: 186 familias por WhatsApp, 312 con push.
   Confirmaciones de lectura: 43% en los primeros 2 minutos.
   ¿Re-enviamos a los que no leyeron en 30 minutos?"

Admin: "Sí, automático"

[8:30am]
Asistente: "Resumen: 278 familias leyeron (89%). 34 sin confirmar — se les reenvió.
            12 familias aún sin confirmar. ¿Llamamos por teléfono a las de alumnos menores?"
```

**Tool MCP requerida:**
- `enviar_comunicado` (todos, prioridad urgente, todos los canales)
- `get_comunicados` (seguimiento de lectura)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Admin envía la suspensión por error | "¿Cancelamos la alerta? Solo podemos hacerlo en los primeros 2 minutos." |
| Familias sin canal digital | Genera la lista para llamado telefónico manual |

---

### CDU-CROSS-003 — El alumno no entiende algo y la docente recibe el dato

**Perfiles:** Alumno → Sistema → Docente
**Prioridad:** P2 | **Origen:** `[Innovation]`
**Canales:** App (alumno) → App (docente, siguiente mañana)

**Descripción:** El asistente detecta que un alumno no pudo resolver un tema después de 2+ intentos, y notifica al docente de forma agregada para que pueda reforzarlo en clase.

**Flujo conversacional:**
```
[Perspectiva del alumno — App]

Alumno: "No entiendo nada de las funciones cuadráticas"

Asistente: [explica el concepto, el alumno hace ejercicios, sigue sin entender]

[Después del segundo intento fallido]

Asistente: "A veces algunos temas necesitan que lo explique el profe en persona.
            ¿Querés que le avise que tenés dudas con este tema?"

Alumno: "Bueno"

[Perspectiva de la docente — siguiente mañana — App]

Asistente: "Profe, 3 alumnos de 4to A tuvieron dificultades con funciones
            cuadráticas ayer en el asistente. Los 3 intentaron 2+ veces sin resolver.
            ¿Querés repasar el tema hoy en clase?"

Docente: "Sí. ¿Quiénes son?"

Asistente: "Tomás Fernández, Lucía García y Pedro Ruiz."
```

**Tool MCP requerida:**
- LLM (explicación del concepto)
- Detección de "alumno no resuelve tras 2+ intentos"
- `registrar_observacion_pedagogica` (automático: "dificultad detectada con funciones cuadráticas")
- Notificación al docente

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El alumno no quiere que se avise al profe | El asistente respeta su decisión pero mantiene la observación en forma agregada |
| El tema es difícil para 5+ alumnos | El asistente escala como patrón de clase, no individual |

**Principio III:** El asistente puede avisar a la docente que "X alumnos tuvieron dificultad". Si el alumno no consintió, los nombres individuales se revelan solo cuando la docente los necesite para actuar pedagógicamente.

---

### CDU-CROSS-004 — Biblioteca de actividades compartida entre escuelas

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
- `generar_actividad_educativa` (si la docente la modifica antes de publicar)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La actividad tiene errores conceptuales | El sistema tiene reporte de errores; las actividades con reportes se revisan antes de aparecer en el ranking |
| La docente quiere aportar la suya a la biblioteca | Agrega con toggle de privacidad: solo mi escuela / toda la red |

**Principio III:** Los datos de las actividades compartidas son de contenido pedagógico únicamente. Ningún dato de alumnos o familias se comparte entre escuelas. NON-NEGOTIABLE.

---
## Matriz de Tools por Perfil

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

---

## Notas de Implementación

### Prioridades para el MVP (P1)

Los 28 CDUs P1 se concentran en los flujos de mayor valor inmediato para el go-to-market de Fase 2:

**Padre/Tutor (P1):** Resumen semanal del hijo, agenda del día siguiente, pago de cuota, aviso de ausencia, firma de autorización, comunicados, reinscripción, calificaciones, urgencia/incidente escolar.

**Docente (P1):** Asistencia (voz + lista), comunicados, carga de calificaciones, observaciones pedagógicas, informe trimestral, creación de actividades gamificadas.

**Admin/Directivo (P1):** Dashboard de pulso, morosidad, recordatorios de cobro, plan de pago, riesgo de deserción, simulador financiero, alertas tempranas, comparación de períodos.

**Alumno (P1):** Actividad de inicial, misión diaria primaria, agenda académica secundaria, situación académica, plan de estudio, simulacro de examen, **malestar emocional** (NON-NEGOTIABLE independientemente de la fase).

### Tools MCP priorizadas para definición

Las tools que cubren más CDUs P1 y son fundacionales:

1. `get_resumen_alumno` — CDU-PAD-001, CDU-DOC-008 (alta frecuencia)
2. `tomar_asistencia_grado` / `registrar_ausencia` — CDU-DOC-001, CDU-DOC-002, CDU-PAD-004
3. `enviar_comunicado` + `generar_comunicado_borrador` — CDU-DOC-003, CDU-ADM-003
4. `cargar_nota` + `get_notas` — CDU-DOC-004, CDU-PAD-008
5. `get_dashboard_morosidad` — CDU-ADM-001, CDU-ADM-002
6. `procesar_pago` + `get_estado_cuenta` — CDU-PAD-003 (acción de mayor riesgo — doble confirmación obligatoria)
7. Protocolo de bienestar emocional (API SPEC §5.3) — CDU-ALU-016 (NON-NEGOTIABLE)

### Reglas de confirmación obligatoria

Los siguientes CDUs requieren confirmación explícita del usuario antes de ejecutar la acción irreversible:

| CDU | Acción que requiere confirmación |
|-----|----------------------------------|
| CDU-PAD-003 | `procesar_pago` — doble confirmación (monto + método) |
| CDU-PAD-005 | `firmar_autorizacion` — confirmación de identidad y condiciones |
| CDU-PAD-007 | `confirmar_reinscripcion` — aceptación de condiciones del ciclo |
| CDU-DOC-004 | `cargar_nota` — revisión visual de la tabla antes de confirmar |
| CDU-DOC-006 | Publicación del informe — aprobación línea por línea |
| CDU-ADM-003 | Envío masivo de recordatorios — cantidad de destinatarios visible |
| CDU-CROSS-002 | Suspensión de clases — urgente pero requiere confirmación |

### Guardarraíles por perfil (resumen)

| Perfil | Restricciones clave |
|--------|---------------------|
| Padre/Tutor | Solo sus propios hijos. Sin acceso a datos de otras familias. |
| Docente | Solo sus propios alumnos/grados. Sin acceso a datos financieros de familias. No modifica notas publicadas en boletín (requiere directivo). |
| Admin/Directivo | Acceso institucional completo. Sin acceso a contenido literal de chats de alumnos. |
| Alumno | Solo sus propios datos. Sin chat libre con internet. Sin WhatsApp. No recibe tareas resueltas. Protocolo de bienestar siempre activo. |

### Notas para definición de MCP Schemas

Al definir los JSON Schemas en `10-MCP-SCHEMAS.md`, considerar:

1. Todos los endpoints de datos de alumnos deben validar que `alumno_id` pertenece al perfil autenticado (padre → sus hijos, docente → sus grados, alumno → sí mismo).
2. `procesar_pago` debe tener idempotency key para evitar doble cobro en caso de timeout.
3. La tool de protocolo de bienestar no retorna datos al asistente que inició la alerta — solo confirma que la alerta fue disparada.
4. Las tools de generación (`generar_comunicado_borrador`, `generar_informe_pedagogico`, `generar_actividad_educativa`) retornan un borrador que debe ser aprobado antes de ejecutar la acción efectiva.
5. El campo `canal` en `enviar_comunicado` debe validar que el canal WhatsApp no se use para alumnos menores.

### CDUs de mayor diferenciación competitiva

Los siguientes CDUs [Innovation] son los que más diferencian a Vujy de cualquier plataforma existente en el mercado argentino:

| CDU | Diferenciación |
|-----|----------------|
| CDU-PAD-014 | Alerta proactiva de caída académica antes del boletín — el padre sabe antes de que sea tarde |
| CDU-PAD-015 | Notificación de incidente escolar en tiempo real con protocolo de respuesta |
| CDU-PAD-016 | Trayectoria acumulada multi-año — Vujy como registro de vida educativa |
| CDU-DOC-015 | Barrera de horarios — resuelve el dolor docente más reportado en Argentina (mensajes a cualquier hora) |
| CDU-DOC-016 | Alerta de bienestar emocional con privacidad preservada — ninguna plataforma tiene este nivel de detección temprana |
| CDU-ADM-005 | Riesgo de deserción proactivo — el administrador actúa antes de que la familia decida irse |
| CDU-ADM-014 | Benchmark entre escuelas — el flywheel de efecto de red de Vujy |
| CDU-CROSS-003 | El alumno no entiende → la docente recibe el dato — cierra el loop entre aprendizaje individual y planificación pedagógica |
| CDU-CROSS-004 | Biblioteca de actividades entre escuelas — el mecanismo de crecimiento de la red |
| CDU-ALU-015 | Tutor entre pares coordinado por IA — aprendizaje colaborativo con privacidad garantizada |

---

*Documento vivo — Vujy · vujy.app — v1.0 · 2026-03-05*
*Sintetizado de los outputs de 3 agentes paralelos: Conservador (a3b5c97bede51e0ce), Mid-Level (a6e639eb8a7180946), Creativo (a7d6f025893b23feb)*
*Todos los CDUs cumplen con el Principio III de la Constitución de Vujy (Privacidad y Seguridad de Menores — NON-NEGOTIABLE)*
