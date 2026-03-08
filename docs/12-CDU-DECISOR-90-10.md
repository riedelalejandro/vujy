# CDU Definitivo — Decisión 90/10

**Decisor:** Agente de Negocio (regla 90/10 — 10% de riesgo consciente)
**Fecha:** 2026-03-05
**Input:** `.tmp-cdu-conservative.md` + `.tmp-cdu-creative.md`
**Output:** Lista definitiva de adiciones y cambios al catálogo CDU de Vujy

---

## Criterio de Decisión

- **90% de las decisiones** = menor riesgo regulatorio + mayor valor MVP + menor complejidad de implementación.
- **10% de las decisiones** = apuesta consciente donde el diferencial competitivo y el impacto en monetización justifican asumir un riesgo operativo o de privacidad manejable con controles específicos.
- Un CDU "no pasa" si requiere infraestructura que no existe hoy, viola normativa sin solución viable, o su complejidad supera el valor en la fase actual.
- Un CDU "pasa con condiciones" si el riesgo del conservador es mitigable con un control técnico o contractual concreto.

---

## Resumen Ejecutivo de Decisiones

| Propuesta | Origen | Decisión | Razonamiento |
|-----------|--------|----------|--------------|
| CDU-SEC-001 (revocación tutor) | Conservador | ✅ **PASA — P0 BLOQUEANTE** | No es riesgo, es obligación legal y ética. Sin esto no puede haber menores en la plataforma. |
| CDU-SEC-002 (consentimiento onboarding) | Conservador | ✅ **PASA — P0 BLOQUEANTE** | BLOQUEANTE para MVP bajo Ley 25.326. Primer CDU que se implementa. |
| CDU-SEC-003 (ARCO datos) | Conservador | ✅ **PASA — P0** | Requerido por ley. Implementación técnica acotada. Sin esto hay riesgo de sanción. |
| CDU-ADM-NEW-01 (reinscripción proactiva) | Creativo | ✅ **PASA — P1** | ROI directo demostrable. Usa infraestructura ya diseñada (riesgo deserción + estado reinscripción). Es el CDU que cierra la venta con admins. |
| CDU-PAD-NEW-01 (diario visual inicial) | Creativo | ✅ **PASA — P1 con condiciones** | Mayor potencial viral del catálogo. Condición: sin reconocimiento facial, tags 100% manuales. El riesgo de privacidad es manejable. |
| CDU-DOC-NEW-01 (portfolio docente) | Creativo | ✅ **PASA — P2** | Sin riesgo legal si es 100% interno. Convierte docentes en defensores del producto. Diferenciador silencioso de alto impacto en retención. |
| CDU-CROSS-NEW-01 (modo corresponsal/acto) | Creativo | ✅ **PASA — P2 [APUESTA 10%]** | El 10% de riesgo consciente. Ver sección específica. |
| CDU-ADM-NEW-02 (NPS benchmark red) | Creativo | ⏸ **DIFIERE — Fase 3 Enterprise** | Depende de escala de red. Sin N > 10 escuelas, el benchmark no tiene valor estadístico. Diseñar el modelo de datos hoy, lanzar cuando haya red. |
| 9 fixes del conservador | Conservador | ✅ **PASAN como requisitos hard** | No son CDUs nuevos — son constraints obligatorios en CDUs existentes. Se incorporan como "Condiciones de Implementación" en cada CDU afectado. |
| Insumos 3, 4, 5, 6, 9 (cerrados) | Conservador | ✅ **PASAN completos** | Cierran gaps críticos de MCP_DEFINITIONS. Adoptados sin modificación. |
| 10 mejoras de stickiness | Creativo | ✅ **PASAN las 7 de bajo/medio esfuerzo** | Las 3 de alto esfuerzo (mini-timeline visual, carta de cierre año, loop alumno-docente) difieren a Fase 3. |
| Modelo de tiers CDU-first | Creativo | ✅ **PASA con ajuste de precios** | Estructura correcta. Ajuste: Básico ~$4 USD, Premium ~$7 USD, Enterprise ~$12 USD (ver sección). |

---

## El 10% — Apuesta Consciente: CDU-CROSS-NEW-01 (Modo Corresponsal)

**Por qué es el 10%:**
El riesgo real es la foto de un alumno con restricción judicial o sin opt-in de sus padres publicada en tiempo real durante un acto escolar. Es el escenario de pesadilla de privacidad. El conservador tiene razón en marcarlo.

**Por qué lo apuesto igual:**
1. **El flywheel de adquisición más poderoso del catálogo.** Una foto del primer acto de su hijo en la app de Vujy que llega al padre en tiempo real se comparte en grupos de WhatsApp de otras familias. Esto genera awareness sin costo de adquisición en el mercado objetivo exacto.
2. **El riesgo es técnicamente mitigable con tres controles:**
   - El sistema bloquea publicar si el alumno mencionado manualmente tiene un flag `foto_bloqueada` en su perfil (el admin lo activa en CDU-SEC-001 o en onboarding).
   - Nunca hay reconocimiento facial — la mención es siempre manual y voluntaria.
   - El corresponsal ve un warning antes de publicar cualquier foto grupal: "¿Todos los alumnos en esta foto tienen opt-in de imágenes activo?"
3. **El costo de no apostar:** Si no está en Vujy, este momento igual ocurre — en un grupo de WhatsApp sin ningún control de privacidad. Vujy es estrictamente más seguro que la alternativa que ya existe.

**Condición de la apuesta:** Este CDU no se lanza sin que CDU-SEC-001 y CDU-SEC-002 estén implementados y el flag `foto_bloqueada` exista en el modelo de datos.

---

## CDUs Nuevos que Pasan al Catálogo Definitivo

### CDU-SEC-001 — Revocación de Acceso de Tutor (Urgente)

**Numeración definitiva:** CDU-ADM-015 (se añade al perfil Admin/Directivo por ser acción de gestión institucional)

| Campo | Valor |
|-------|-------|
| **Actor** | Admin/Directivo (ejecuta) · Secretaría (puede iniciar) |
| **Disparador** | Orden judicial, denuncia de violencia, suspensión de tutela |
| **Prioridad** | **P0 — BLOQUEANTE MVP** |
| **Canal** | App · Web (solo admin) |
| **Tools** | `revoke_guardian_access@v1`, `log_security_action@v1` |
| **SLA** | Revocación efectiva < 60 segundos, 100% de los casos |
| **Fuente de datos** | Estructurado — no RAG |
| **Requiere confirmación** | Sí — PIN de admin + aprobación de directivo superior para restauración |

**Condición de implementación:**
- El flag de revocación debe propagarse a TODOS los canales simultáneamente (RLS a nivel Supabase, no solo en UI).
- El log es INMUTABLE — no puede ser modificado ni eliminado por el admin.
- El tutor revocado nunca recibe motivo específico — solo "tu acceso fue modificado".

---

### CDU-SEC-002 — Consentimiento Informado en Onboarding

**Numeración definitiva:** CDU-CROSS-005

| Campo | Valor |
|-------|-------|
| **Actor** | Padre/Tutor (en primer acceso) |
| **Disparador** | Primera sesión en la plataforma |
| **Prioridad** | **P0 — BLOQUEANTE MVP** |
| **Canal** | App · Web · WhatsApp (versión simplificada) |
| **Tools** | `register_consent@v1`, `get_consent_status@v1` |
| **Fuente de datos** | Estructurado |
| **Requiere confirmación** | Sí — checkboxes separados para WhatsApp opt-in y fotos |

**Condición de implementación:**
- Sin consentimiento registrado = cero funcionalidades disponibles.
- Los checkboxes de WhatsApp y fotos son OPCIONALES (la plataforma funciona sin ellos).
- El documento de consentimiento incluye mención explícita de Anthropic como procesador de IA en EE.UU.
- Versión en lenguaje accesible (no jerga legal) — validada con al menos 5 padres antes de lanzar.

---

### CDU-SEC-003 — Solicitud ARCO

**Numeración definitiva:** CDU-CROSS-006

| Campo | Valor |
|-------|-------|
| **Actor** | Padre/Tutor · Alumno ≥ 13 años |
| **Disparador** | Solicitud de acceso, rectificación, cancelación u oposición |
| **Prioridad** | **P0** |
| **Canal** | App · Web (nunca WhatsApp — requiere identidad segura) |
| **Tools** | `export_user_data@v1`, `request_data_rectification@v1`, `request_data_deletion@v1` |
| **SLA** | Rectificación: 5 días · Cancelación: 30 días · según Ley 25.326 |

**Condición de implementación:**
- Datos con obligación de retención legal (certificados analíticos, legajos) se informan como "no eliminables — ver política".
- Alumno < 13 que intenta acceder → redirigir a tutor legal, sin dar información sobre el motivo.

---

### CDU-ADM-016 — Campaña de Reinscripción Proactiva con IA

| Campo | Valor |
|-------|-------|
| **Actor** | Admin/Directivo |
| **Disparador** | Apertura de período de reinscripción + familias sin confirmar |
| **Prioridad** | **P1** |
| **Canal** | App · Web (admin) · WhatsApp · App (familias) |
| **Tools** | `get_reenrollment_status@v1`, `get_dropout_risk@v1`, `create_reenrollment_campaign@v1`, `create_reenrollment_campaign@v1` |
| **Fuente de datos** | Estructurado — no RAG |
| **Requiere confirmación** | Sí — preview de mensaje + N destinatarios antes de enviar |
| **Tier** | Premium |

**Condición de implementación:**
- Validar opt-in en tiempo de ejecución antes de cada envío (no solo al momento de inscripción).
- Máximo 3 mensajes por familia por período de reinscripción — throttling obligatorio.
- El segmento "en riesgo crítico" requiere aprobación explícita del admin con preview del tono del mensaje — no puede ser automático.

**Argumento de negocio:** Retener 5 familias adicionales en una escuela de 300 alumnos (a $7 USD/alumno/mes × 10 meses) = USD 350 recuperados. Costo anual de Vujy para esa escuela (300 alumnos × $7 × 12) = USD 25.200. El ROI no está en los 5 alumnos — está en que el admin *sabe* que puede medir el impacto, y eso justifica la compra.

---

### CDU-PAD-017 — Diario Visual Diario del Hijo (Nivel Inicial)

| Campo | Valor |
|-------|-------|
| **Actor** | Docente de inicial (emisor) · Padre/Tutor (receptor) |
| **Disparador** | Fin de jornada en nivel inicial (configurable) |
| **Prioridad** | **P1** |
| **Canal** | App (corresponsal) · App · WhatsApp texto+imagen (familias) |
| **Tools** | `publish_daily_journal@v1`, `publish_daily_journal@v1`, `send_announcement@v1` |
| **Fuente de datos** | STT + Estructurado + Storage + RAG (personalización por alumno) |
| **Tier** | Premium |

**Condiciones de implementación (NON-NEGOTIABLE):**
1. Sin reconocimiento facial bajo ninguna circunstancia.
2. Menciones de alumnos en fotos = 100% manuales (la docente elige quién está nombrado).
3. Opt-in de fotos es un checkbox SEPARADO en CDU-SEC-002.
4. Familias sin opt-in de fotos reciben SOLO el texto, sin imágenes.
5. El padre puede reaccionar con emoji pero no con texto libre — bloquea la conversación fuera de horario (consistente con CDU-DOC-015).

**Por qué es P1 y no P2:** Es el CDU con mayor potencial de viralización orgánica. Una familia que muestra el diario a otra familia en otro colegio es el canal de adquisición de costo cero más eficiente disponible. No lanzarlo en el MVP es dejar dinero sobre la mesa.

---

### CDU-DOC-017 — Portfolio de Impacto Docente

| Campo | Valor |
|-------|-------|
| **Actor** | Docente |
| **Disparador** | Detección automática de hito pedagógico |
| **Prioridad** | **P2** |
| **Canal** | App · Web (solo interno hasta Fase 2) |
| **Tools** | `detect_teacher_milestone@v1`, `record_portfolio_milestone@v1`, `generate_teacher_portfolio_pdf@v1` |
| **Fuente de datos** | Estructurado |
| **Tier** | Premium |

**Condiciones de implementación:**
- El portfolio descargable para uso externo (LinkedIn) solo incluye métricas del docente — NUNCA datos de alumnos, ni siquiera anonimizados.
- Los hitos son privados entre docente y directivo. Otros docentes no ven el portfolio de sus colegas.
- El opt-out de notificaciones de hitos debe ser accesible en 1 tap.

---

### CDU-CROSS-007 — Modo Corresponsal en Eventos Escolares [APUESTA 10%]

| Campo | Valor |
|-------|-------|
| **Actor** | Docente corresponsal (emisor) · Padres/Tutores (receptores) |
| **Disparador** | Admin activa "Modo Acto" para evento del calendario |
| **Prioridad** | **P2** |
| **Canal** | App (corresponsal) · App · WhatsApp · Push (familias) |
| **Tools** | `activate_event_mode@v1`, `publish_event_update@v1`, `generate_event_album@v1` |
| **Fuente de datos** | Estructurado + Storage |
| **Tier** | Premium |

**Condiciones de implementación (gates para el riesgo del 10%):**
1. **Gate bloqueante:** CDU-SEC-001 y CDU-SEC-002 deben estar en producción antes de activar este CDU.
2. El sistema cruza la lista de alumnos del evento contra el flag `foto_bloqueada` antes de publicar.
3. Warning obligatorio antes de cada publicación grupal: lista de alumnos sin opt-in de fotos en ese evento.
4. El corresponsal solo puede mencionar manualmente a alumnos del evento — no puede nombrar a un alumno de otro grado.
5. Las fotos tienen ventana de eliminación de 24 hs por el admin si se detecta un error post-publicación.

---

## Fixes Obligatorios en CDUs Existentes (9 Constraints Hard)

Estos no son CDUs nuevos — son requisitos de implementación que se añaden al CDU correspondiente:

| CDU | Fix obligatorio | Criterio |
|-----|----------------|---------|
| CDU-P-04 (pago) | `idempotency_key` obligatoria en `process_payment@v1`; reconciliación con MP antes de confirmar | CRÍTICO — doble cobro |
| CDU-D-04 / D-05 | `source_references[]` en output del informe; log inmutable de versiones aprobadas | ALTO — trazabilidad |
| CDU-D-03 (comunicado masivo) | Validar opt-in en tiempo de ejecución, no solo al inscribirse | ALTO — opt-in compliance |
| CDU-A-02 (cobranza) | Validar edad del titular antes de incluir en campaña; < 18 → canal humano | ALTO — mensajería a menores |
| CDU-A-04 (score deserción) | Score SOLO visible para Admin/Directivo — docentes ven alertas pedagógicas sin etiqueta financiera | ALTO — sesgo docente |
| CDU-L-08 / ALU-016 (bienestar) | Supervisor de turno configurable por institución; protocolo diferenciado para inicial | CRÍTICO — obligación legal |
| CDU-L-02 / ALU-009 (tutoría IA) | Flag `evaluacion_activa` bloquea tutoría durante evaluaciones en curso | ALTO — integridad académica |
| CDU-DOC-006 (informe IA) | Las correcciones docentes NO se usan para fine-tuning del modelo base | ALTO — privacidad datos pedagógicos |
| Todos los CDUs con Claude API | DPA con Anthropic firmado antes del MVP + mención en política de privacidad | CRÍTICO — Ley 25.326 |

---

## Insumos Cerrados — Adoptados del Conservador

Los insumos 3, 4, 5, 6 y 9 producidos por el agente conservador se adoptan sin modificación. Son operativos, específicos y cubren los gaps reales. Se incorporan a `docs/02-API-SPEC.md` como secciones nuevas.

| Insumo | Estado | Destino |
|--------|--------|---------|
| 3 — Matriz de permisos por rol/canal | ✅ Cerrado | `02-API-SPEC.md` §7 |
| 4 — Política de confirmaciones críticas | ✅ Cerrado | `02-API-SPEC.md` §8 |
| 5 — Taxonomía de errores conversacionales | ✅ Cerrado | `02-API-SPEC.md` §9 |
| 6 — Reglas de idempotencia y auditoría | ✅ Cerrado | `02-API-SPEC.md` §10 |
| 9 — Gaps regulatorios para menores (Argentina) | ✅ Cerrado | `02-API-SPEC.md` §11 |

Los insumos 1, 2, 7, 8 y 10 siguen abiertos — son input directo de `TODO(MCP_DEFINITIONS)`.

---

## Mejoras de Stickiness Aprobadas (7 de 10)

| CDU | Mejora | Prioridad ejecución |
|-----|--------|-------------------|
| CDU-PAD-014 | Comparación con historial propio del alumno (no con el grado) | Alta — implementar junto con el CDU |
| CDU-DOC-015 | Dashboard semanal "Vujy te devolvió X horas esta semana" | Alta — bajo esfuerzo, máximo impacto en adopción docente |
| CDU-DOC-003 | Sugerir mejor horario de envío basado en data histórica | Media |
| CDU-ADM-005 | Score deserción con explicación en lenguaje natural (3 señales nombradas) | Alta — reduce miedo al sesgo |
| CDU-ADM-006 | Guardar y comparar escenarios financieros en el tiempo | Media |
| CDU-ALU-011 | Comparación del alumno consigo mismo, no con el grado | Alta — crítico para evitar desmotivación |
| CDU-CROSS-003 | Notificación semanal al docente: "8 alumnos preguntaron sobre fracciones" | Media — cerrar el loop IA-planificación |

**Diferidas (3):** Mini-timeline visual (CDU-PAD-001), carta de cierre de año (CDU-PAD-016), ranking de funcionalidades de la red (CDU-ADM-014). Se evalúan en Fase 3.

---

## Modelo de Tiers Definitivo (CDU-First)

### Tier Básico — "Dejá el papel"
**Precio:** ~$4 USD/alumno/mes
**Propuesta:** Digitalizar lo que ya hacen en papel y WhatsApp. Cero capacitación requerida.

CDUs incluidos: CDU-DOC-001/002 (asistencia), CDU-DOC-003 (comunicados), CDU-DOC-004 (notas), CDU-PAD-004 (aviso ausencia), CDU-PAD-006 (comunicados), CDU-PAD-003 (estado de cuenta), CDU-ADM-002/003/004 (morosidad y cobro básico).

**Todos los CDU-SEC son incluidos en Básico** — son requisitos legales, no features.

### Tier Premium — "El copiloto que anticipa"
**Precio:** ~$7 USD/alumno/mes
**Propuesta:** El asistente entiende lenguaje natural, anticipa problemas y ejecuta acciones. La escuela pasa de reactiva a proactiva.

CDUs adicionales: CDU-PAD-001 (resumen IA), CDU-PAD-014/015 (alertas proactivas), CDU-DOC-005/006 (observaciones + informes IA), CDU-DOC-007 (actividades gamificadas), CDU-DOC-015 (barrera horaria), CDU-DOC-017 (portfolio docente), CDU-ADM-005/006/013 (riesgo deserción, simulador, proyección), CDU-ADM-016 (reinscripción proactiva), CDU-ALU-009/010/011 (tutor IA secundaria), CDU-PAD-017 (diario inicial), CDU-CROSS-007 (modo acto).

**El "momento aha" que cierra la venta al Premium:** CDU-DOC-015. Cuando el docente ve "Vujy te devolvió 2.1 horas esta semana", el upgrade se justifica solo.

### Tier Enterprise — "La inteligencia de red"
**Precio:** ~$12 USD/alumno/mes + onboarding fee
**Propuesta:** Los CDUs se vuelven más valiosos con cada escuela que se suma. Solo tiene sentido a escala.

CDUs adicionales (disponibles desde Fase 3): CDU-ADM-NEW-02 (NPS benchmark red — difiere hasta N > 10 escuelas), CDU-ADM-014 (benchmark entre escuelas), CDU-CROSS-004 (biblioteca de actividades entre escuelas), analytics avanzados de cohorte, integraciones custom.

---

## Catálogo CDU Actualizado — Resumen de Cambios

### Adiciones al catálogo (7 CDUs nuevos)

| ID Definitivo | Nombre | Perfil | Prioridad | Tier |
|---------------|--------|--------|-----------|------|
| CDU-ADM-015 | Revocación de acceso de tutor — urgente | Admin | **P0 BLOQUEANTE** | Todos |
| CDU-CROSS-005 | Consentimiento informado en onboarding | Cross | **P0 BLOQUEANTE** | Todos |
| CDU-CROSS-006 | Solicitud ARCO — datos personales | Cross | **P0** | Todos |
| CDU-ADM-016 | Campaña de reinscripción proactiva con IA | Admin | P1 | Premium |
| CDU-PAD-017 | Diario visual diario (nivel inicial) | Pad | P1 | Premium |
| CDU-DOC-017 | Portfolio de impacto docente | Doc | P2 | Premium |
| CDU-CROSS-007 | Modo corresponsal en eventos [10%] | Cross | P2 | Premium |

### CDUs diferidos (no eliminados, fuera del MVP)

| ID | Nombre | Motivo del diferimiento |
|----|--------|------------------------|
| CDU-ADM-NEW-02 | NPS benchmark de red | Requiere N > 10 escuelas para valor estadístico — Fase 3 |

### CDUs con gate legal antes de lanzar

Los siguientes CDUs del catálogo existente tienen una condición previa que debe cumplirse antes de activarlos en producción:

| ID | Condición previa |
|----|-----------------|
| CDU-D-06 (informes IA) | Cláusula de descargo firmada por la escuela (el informe es borrador, responsabilidad del docente) |
| CDU-A-02 (cobranza WhatsApp) | Template aprobado por Meta + DPA con Twilio firmado |
| CDU-ALU-016 / CDU-DOC-016 (bienestar) | Protocolo institucional definido por cada escuela + supervisor de turno configurado |
| CDU-PAD-017 (diario inicial) | CDU-SEC-001 y CDU-SEC-002 en producción + flag `foto_bloqueada` en modelo de datos |
| CDU-CROSS-007 (modo acto) | CDU-SEC-001 y CDU-SEC-002 en producción (gate del 10%) |

---

## Estado de TODO(CDU_BY_PROFILE)

Con este documento se cierra formalmente `TODO(CDU_BY_PROFILE)`.

**Catálogo final:** 73 CDUs (66 originales + 7 nuevos) — 3 BLOQUEANTES para MVP.

**Insumos desbloqueados para MCP_DEFINITIONS:**
- ✅ Insumo 3 (matriz de permisos)
- ✅ Insumo 4 (confirmaciones críticas)
- ✅ Insumo 5 (taxonomía de errores)
- ✅ Insumo 6 (idempotencia y auditoría)
- ✅ Insumo 9 (regulación Argentina — menores)
- ⏳ Insumo 1 (catálogo canónico de tools) → siguiente paso en MCP_DEFINITIONS
- ⏳ Insumo 2 (contratos I/O JSON) → siguiente paso en MCP_DEFINITIONS
- ⏳ Insumo 7 (mapeo CDU → fuentes de datos + SLA) → siguiente paso en MCP_DEFINITIONS
- ⏳ Insumo 8 (proactive messaging — disparadores + opt-in) → siguiente paso en MCP_DEFINITIONS
- ⏳ Insumo 10 (casos de prueba E2E por CDU P0) → siguiente paso en MCP_DEFINITIONS

**Próximo TODO desbloqueado:** `TODO(MCP_DEFINITIONS)` — con los insumos 3, 4, 5, 6 y 9 cerrados, se puede iniciar la definición de contratos I/O de las tools priorizadas.

**Orden de implementación recomendado:**
1. CDU-CROSS-005 (consentimiento) + CDU-SEC-003 (ARCO) — sin estos no hay plataforma legal
2. CDU-ADM-015 (revocación tutor) — sin esto no hay menores en la plataforma
3. CDU-ADM-016 (reinscripción proactiva) — el CDU que cierra la primera venta
4. CDU-PAD-017 (diario inicial) — el CDU que genera la primera referencia

---

*Documento de decisión — Vujy · vujy.app*
*Decisor: Agente de Negocio 90/10*
*Fecha: 2026-03-05*
*Input: `.tmp-cdu-conservative.md` + `.tmp-cdu-creative.md`*
*Cierra: `TODO(CDU_BY_PROFILE)`*
*Desbloquea: `TODO(MCP_DEFINITIONS)`*
