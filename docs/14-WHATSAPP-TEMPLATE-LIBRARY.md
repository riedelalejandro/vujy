# Vujy — WhatsApp Template Library

**Versión:** 1.0 | **Fecha:** 2026-03-05
**Relacionado con:** `docs/04-WHATSAPP-API.md` · `docs/09-MCP-DEFINITIONS.md §14`

> Estos templates deben someterse a aprobación de Meta antes del primer envío outbound.
> Tiempo estimado de aprobación: 24–48 h por template en condiciones normales.

---

## Convenciones

- **Nombre:** `snake_case`, solo minúsculas, guiones bajos y números. Máx 512 chars. Prefijo `vujy_`.
- **Variables:** `{{1}}`, `{{2}}`, etc. — siempre en orden, sin saltar números.
- **Categoría Meta:** `UTILITY` (transaccional), `AUTHENTICATION` (OTPs), `MARKETING` (nunca para MVP).
- **Idioma:** `es` (español genérico — Meta no tiene `es_AR`).
- **Longitud máxima del body:** 1.024 chars.
- **Footer:** opcional, máx 60 chars. No acepta variables.
- **Botones:** hasta 10 por template. Tipos: `QUICK_REPLY` (texto predefinido) o `URL` (link con variable opcional).

---

## Índice de templates

| # | Template | Categoría | CDU | Prioridad | Estado |
|---|----------|-----------|-----|-----------|--------|
| 1 | `vujy_bienvenida` | UTILITY | Onboarding | **P0** | Pendiente aprobación |
| 2 | `vujy_otp_verificacion` | AUTHENTICATION | Auth WA | **P0** | Pendiente aprobación |
| 3 | `vujy_magic_link` | AUTHENTICATION | Auth App/Web | **P0** | Pendiente aprobación |
| 4 | `vujy_suspension_clases` | UTILITY | CDU-CROSS-002 | **P0** | Pendiente aprobación |
| 5 | `vujy_incidente_urgente` | UTILITY | CDU-PAD-015 | **P0** | Pendiente aprobación |
| 6 | `vujy_recordatorio_cuota` | UTILITY | CDU-PAD-003, CDU-ADM-003 | **P1** | Pendiente aprobación |
| 7 | `vujy_comunicado_escolar` | UTILITY | CDU-DOC-003, CDU-CROSS-002 | **P1** | Pendiente aprobación |
| 8 | `vujy_resumen_semanal` | UTILITY | CDU-PAD-012 | **P1** | Pendiente aprobación |
| 9 | `vujy_recordatorio_reinscripcion` | UTILITY | CDU-ADM-016 | **P1** | Pendiente aprobación |
| 10 | `vujy_diario_visual_disponible` | UTILITY | CDU-PAD-017 | **P2** | Pendiente aprobación |
| 11 | `vujy_alerta_academica` | UTILITY | CDU-PAD-014 | **P2** | Pendiente aprobación |

---

## Templates P0 — Bloqueantes para lanzamiento

---

### 1. `vujy_bienvenida`

**Propósito:** Primer mensaje que recibe un tutor cuando la escuela lo da de alta en Vujy.
**CDU:** Onboarding
**Categoría:** UTILITY
**Idioma:** es

**Header:** TEXT
```
Bienvenido/a a Vujy — {{1}}
```
> `{{1}}` = nombre de la escuela (ej: "Colegio San Martín")

**Body:**
```
Hola {{2}}, la escuela {{1}} te sumó a Vujy, su asistente educativo.

Desde acá vas a poder consultar la agenda, las notas y la asistencia de {{3}}, avisar ausencias, leer comunicados y mucho más.

Para activar tu cuenta, tocá el botón de abajo. El enlace es válido por 48 horas.
```
> `{{2}}` = nombre del tutor (ej: "Pablo")
> `{{3}}` = nombre del alumno (ej: "Mati")

**Footer:**
```
Vujy · vujy.app
```

**Botones:**
```
[URL] Activar mi cuenta → {{4}}
```
> `{{4}}` = URL del magic link (variable en el botón URL de Meta)

**Variables completas:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre de la escuela | Colegio San Martín |
| `{{2}}` | Nombre del tutor | Pablo |
| `{{3}}` | Nombre del alumno | Mati |
| `{{4}}` | URL magic link (en botón) | https://vujy.app/auth/magic?token=xxx |

---

### 2. `vujy_otp_verificacion`

**Propósito:** Verificación de número de WhatsApp al vincular el canal (OTP).
**CDU:** Auth WhatsApp
**Categoría:** AUTHENTICATION
**Idioma:** es

**Body:**
```
Tu código de verificación de Vujy es: *{{1}}*

Válido por 5 minutos. No lo compartas con nadie.
```
> `{{1}}` = código OTP de 6 dígitos

**Footer:**
```
Si no lo solicitaste, ignorá este mensaje.
```

**Botones:** ninguno (categoría Authentication no los requiere)

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Código OTP | 847291 |

> **Nota Meta:** Los templates de categoría AUTHENTICATION tienen aprobación acelerada (generalmente < 24 h).

---

### 3. `vujy_magic_link`

**Propósito:** Link de acceso enviado cuando un usuario solicita ingresar desde WhatsApp.
**CDU:** Auth App/Web iniciado desde WA
**Categoría:** AUTHENTICATION
**Idioma:** es

**Body:**
```
Hola {{1}}, recibimos tu solicitud de acceso a Vujy.

Tocá el botón para ingresar. El enlace expira en 15 minutos.

Si no lo solicitaste vos, ignorá este mensaje.
```
> `{{1}}` = nombre del tutor

**Botones:**
```
[URL] Ingresar a Vujy → {{2}}
```
> `{{2}}` = URL del magic link (variable en botón URL)

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre del tutor | Pablo |
| `{{2}}` | URL magic link (en botón) | https://vujy.app/auth/magic?token=xxx |

---

### 4. `vujy_suspension_clases`

**Propósito:** Alerta masiva y urgente de suspensión de clases a todas las familias.
**CDU:** CDU-CROSS-002
**Categoría:** UTILITY
**Idioma:** es

**Header:** TEXT
```
⚠️ Aviso urgente — {{1}}
```
> `{{1}}` = nombre de la escuela

**Body:**
```
{{2}}, {{3}} informa que *no habrá clases el {{4}}*{{5}}.

{{6}}

Ante consultas, comunicate directamente con la institución.
```
> `{{2}}` = saludo con nombre del tutor (ej: "Hola Pablo") o genérico "Estimadas familias"
> `{{3}}` = nombre de la escuela
> `{{4}}` = fecha (ej: "lunes 9 de marzo")
> `{{5}}` = alcance opcional (ej: " para todos los niveles" o " para nivel primario") — puede ser vacío
> `{{6}}` = motivo breve (ej: "Paro docente." / "Acto oficial." / "Fuerza mayor.") — puede ser vacío si no corresponde informar

**Footer:**
```
Comunicación oficial de {{1}}
```

**Botones:** ninguno (la urgencia no debe distraerse con acciones)

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre de la escuela | Colegio San Martín |
| `{{2}}` | Saludo personalizado o genérico | Hola Pablo |
| `{{3}}` | Nombre de la escuela (repetido en body) | Colegio San Martín |
| `{{4}}` | Fecha de la suspensión | lunes 9 de marzo |
| `{{5}}` | Alcance (opcional, puede ser string vacío) | para todos los niveles |
| `{{6}}` | Motivo (opcional, puede ser string vacío) | Paro docente. |

---

### 5. `vujy_incidente_urgente`

**Propósito:** Notificación urgente de incidente que involucra al alumno.
**CDU:** CDU-PAD-015
**Categoría:** UTILITY
**Idioma:** es

> **Nota de privacidad:** Este template intencionalmente no incluye detalles del incidente en el texto. El detalle se entrega en la app con sesión autenticada. Esto protege la privacidad del menor y evita que información sensible quede en el historial de WhatsApp.

**Header:** TEXT
```
⚠️ Aviso urgente — {{1}}
```
> `{{1}}` = nombre de la escuela

**Body:**
```
Hola {{2}}, {{1}} necesita que te comuniques con la institución a la brevedad en relación a {{3}}.

Por favor ingresá a la app para ver los detalles o llamá directamente a la escuela.
```
> `{{2}}` = nombre del tutor
> `{{3}}` = nombre del alumno

**Footer:**
```
Comunicación oficial de {{1}}
```

**Botones:**
```
[URL] Ver detalles en la app → {{4}}
```
> `{{4}}` = deep link a la notificación en la app

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre de la escuela | Colegio San Martín |
| `{{2}}` | Nombre del tutor | Pablo |
| `{{3}}` | Nombre del alumno | Mati |
| `{{4}}` | Deep link app (en botón) | https://vujy.app/alerts/inc_abc123 |

---

## Templates P1 — Necesarios para MVP completo

---

### 6. `vujy_recordatorio_cuota`

**Propósito:** Recordatorio de cuota vencida o próxima a vencer.
**CDU:** CDU-PAD-003, CDU-ADM-003
**Categoría:** UTILITY
**Idioma:** es

**Body:**
```
Hola {{1}}, te recordamos que tenés una cuota pendiente en {{2}}:

📋 *{{3}}*
💰 ${{4}}
📅 Vencimiento: {{5}}

Respondé con *PAGAR* para gestionar el pago o ingresá a la app.
```
> `{{1}}` = nombre del tutor
> `{{2}}` = nombre de la escuela
> `{{3}}` = descripción del concepto (ej: "Cuota marzo 2026")
> `{{4}}` = monto (ej: "45.000")
> `{{5}}` = fecha de vencimiento (ej: "10 de marzo")

**Footer:**
```
{{2}} · vujy.app
```

**Botones:**
```
[QUICK_REPLY] Pagar ahora
[QUICK_REPLY] Ver estado de cuenta
```

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre del tutor | Pablo |
| `{{2}}` | Nombre de la escuela | Colegio San Martín |
| `{{3}}` | Concepto de la cuota | Cuota marzo 2026 |
| `{{4}}` | Monto sin símbolo de moneda | 45.000 |
| `{{5}}` | Fecha de vencimiento | 10 de marzo |

> **Nota de implementación:** Las respuestas QUICK_REPLY `Pagar ahora` y `Ver estado de cuenta` abren una ventana de servicio de 24 h — la respuesta del asistente a esas acciones es *gratuita* (service message).
> **Tool MCP:** Este template se envía mediante `create_collection_campaign@v1` (CDU-ADM-003) con segmentación por familia morosa, o directamente desde `send_announcement@v1` para recordatorios individuales (CDU-PAD-003). Ver `docs/09-MCP-DEFINITIONS.md`.

---

### 7. `vujy_comunicado_escolar`

**Propósito:** Comunicado institucional enviado por docente o admin a las familias.
**CDU:** CDU-DOC-003, CDU-CROSS-002
**Categoría:** UTILITY
**Idioma:** es

**Header:** TEXT
```
📣 {{1}} — {{2}}
```
> `{{1}}` = nombre de la escuela
> `{{2}}` = título del comunicado (ej: "Reunión de padres 3ro B")

**Body:**
```
Hola {{3}}:

{{4}}

{{5}}
```
> `{{3}}` = saludo personalizado (ej: "Pablo" o "Estimadas familias")
> `{{4}}` = cuerpo del comunicado (máx ~700 chars para dejar margen al template)
> `{{5}}` = cierre opcional (ej: "Ante consultas, respondé este mensaje." o vacío)

**Footer:**
```
{{1}} · via Vujy
```

**Botones:**
```
[QUICK_REPLY] Confirmar lectura
```

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre de la escuela | Colegio San Martín |
| `{{2}}` | Título del comunicado | Reunión de padres 3ro B |
| `{{3}}` | Saludo o nombre del tutor | Pablo |
| `{{4}}` | Cuerpo del comunicado | Les informamos que la reunión de padres... |
| `{{5}}` | Cierre (puede ser string vacío) | Ante consultas, respondé este mensaje. |

> **Nota de implementación:** El botón `Confirmar lectura` dispara `confirm_announcement_read@v1` — registra la lectura en la tabla `announcement_receipts` y cierra la ventana de tracking del comunicado.

---

### 8. `vujy_resumen_semanal`

**Propósito:** Resumen proactivo semanal del hijo enviado al tutor.
**CDU:** CDU-PAD-012
**Categoría:** UTILITY
**Idioma:** es

**Header:** TEXT
```
📋 Resumen de {{1}} — semana del {{2}}
```
> `{{1}}` = nombre del alumno
> `{{2}}` = fecha de inicio de semana (ej: "3 al 7 de marzo")

**Body:**
```
Hola {{3}}, acá va el resumen de esta semana de {{1}}:

✅ Asistencia: {{4}} de {{5}} días
📝 Últimas notas: {{6}}
📚 Tareas pendientes: {{7}}
{{8}}

Respondé con cualquier pregunta o ingresá a la app para ver el detalle completo.
```
> `{{3}}` = nombre del tutor
> `{{4}}` = días presentes
> `{{5}}` = días totales de clase
> `{{6}}` = resumen de notas (ej: "Matemática 8 · Lengua 7") o "Sin notas nuevas esta semana"
> `{{7}}` = cantidad de tareas pendientes (ej: "2 tareas" o "Sin tareas pendientes")
> `{{8}}` = alerta opcional (ej: "⚠️ Faltó 2 días esta semana." o vacío)

**Footer:**
```
{{1}} · {{9}} · via Vujy
```
> `{{9}}` = nombre de la escuela

**Botones:**
```
[QUICK_REPLY] Ver más detalles
[QUICK_REPLY] Hablar con la docente
```

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre del alumno | Mati |
| `{{2}}` | Rango de la semana | 3 al 7 de marzo |
| `{{3}}` | Nombre del tutor | Pablo |
| `{{4}}` | Días presentes | 4 |
| `{{5}}` | Días totales de clase | 5 |
| `{{6}}` | Resumen de notas | Matemática 8 · Lengua 7 |
| `{{7}}` | Tareas pendientes | 2 tareas |
| `{{8}}` | Alerta opcional (puede ser vacío) | ⚠️ Faltó 2 días esta semana. |
| `{{9}}` | Nombre de la escuela | Colegio San Martín |

---

### 9. `vujy_recordatorio_reinscripcion`

**Propósito:** Recordatorio de período de reinscripción abierto para el ciclo siguiente.
**CDU:** CDU-ADM-016
**Categoría:** UTILITY
**Idioma:** es

**Body:**
```
Hola {{1}}, {{2}} abrió el proceso de reinscripción para el ciclo {{3}}.

📅 Fecha límite: *{{4}}*

{{5}}

Respondé *REINSCRIBIR* para iniciar el proceso o ingresá a la app.
```
> `{{1}}` = nombre del tutor
> `{{2}}` = nombre de la escuela
> `{{3}}` = año del ciclo (ej: "2027")
> `{{4}}` = fecha límite (ej: "31 de marzo de 2026")
> `{{5}}` = mensaje personalizado opcional (ej: "Mati está confirmado para 4to grado. Solo falta tu firma digital." o vacío)

**Footer:**
```
{{2}} · via Vujy
```

**Botones:**
```
[QUICK_REPLY] Reinscribir ahora
[QUICK_REPLY] Consultar condiciones
```

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre del tutor | Pablo |
| `{{2}}` | Nombre de la escuela | Colegio San Martín |
| `{{3}}` | Año del ciclo | 2027 |
| `{{4}}` | Fecha límite | 31 de marzo de 2026 |
| `{{5}}` | Mensaje personalizado (puede ser vacío) | Mati está confirmado para 4to grado. |

> **Tool MCP:** Este template se envía mediante `create_reenrollment_campaign@v1` (CDU-ADM-016) con segmentación automática en 3 grupos (confirmados, pendientes, en riesgo). Requiere aprobación explícita del admin antes de disparar. Ver `docs/09-MCP-DEFINITIONS.md`.

---

## Templates P2 — Post-MVP

---

### 10. `vujy_diario_visual_disponible`

**Propósito:** Notificación de que el diario del día de nivel inicial fue publicado.
**CDU:** CDU-PAD-017
**Categoría:** UTILITY
**Idioma:** es

**Header:** TEXT
```
🎨 El diario de {{1}} está listo
```
> `{{1}}` = nombre del alumno

**Body:**
```
Hola {{2}}, la seño publicó el diario del día de {{1}} ({{3}}).

{{4}}

Abrí la app para ver las fotos y actividades de hoy.
```
> `{{2}}` = nombre del tutor
> `{{3}}` = fecha (ej: "jueves 5 de marzo")
> `{{4}}` = extracto narrativo (ej: "Hoy trabajamos con plastilina y cantamos canciones de otoño." o vacío si no hay narrativa)

**Botones:**
```
[URL] Ver en la app → {{5}}
```
> `{{5}}` = deep link al diario del día

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre del alumno | Sofi |
| `{{2}}` | Nombre del tutor | Ana |
| `{{3}}` | Fecha del diario | jueves 5 de marzo |
| `{{4}}` | Extracto narrativo (puede ser vacío) | Hoy trabajamos con plastilina... |
| `{{5}}` | Deep link app (en botón) | https://vujy.app/journal/j_abc123 |

---

### 11. `vujy_alerta_academica`

**Propósito:** Alerta proactiva de caída académica del alumno.
**CDU:** CDU-PAD-014
**Categoría:** UTILITY
**Idioma:** es

> **Nota de privacidad:** El template no nombra la materia ni la nota específica — solo señala que hay un cambio relevante. El detalle está en la app con sesión autenticada.

**Body:**
```
Hola {{1}}, queremos contarte que detectamos un cambio en el rendimiento académico de {{2}} este trimestre.

Te recomendamos revisar el resumen en la app o hablar con la docente.

Respondé con cualquier pregunta.
```
> `{{1}}` = nombre del tutor
> `{{2}}` = nombre del alumno

**Footer:**
```
{{3}} · via Vujy
```
> `{{3}}` = nombre de la escuela

**Botones:**
```
[QUICK_REPLY] Ver resumen académico
[QUICK_REPLY] Contactar a la docente
```

**Variables:**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{1}}` | Nombre del tutor | Pablo |
| `{{2}}` | Nombre del alumno | Mati |
| `{{3}}` | Nombre de la escuela | Colegio San Martín |

---

## Proceso de aprobación

### Pasos para someter templates a Meta

```
1. Acceder al Meta Business Suite con la cuenta de Vujy (Tech Provider)
2. Ir a WhatsApp Manager → Account Tools → Message Templates
3. Crear cada template con nombre, categoría, idioma y contenido exacto
4. Someter a revisión → Meta responde en 24–48 h
5. En caso de rechazo, Meta indica el motivo → ajustar y re-someter
```

### Causas comunes de rechazo

| Causa | Ejemplo problemático | Corrección |
|-------|---------------------|------------|
| Variables sin contexto claro | `{{1}}` como único contenido del body | Siempre rodear variables con texto fijo |
| Contenido de marketing disfrazado de utility | "¡Oferta especial! Solo por este mes..." | Eliminar cualquier language promocional |
| Body demasiado corto | 1 sola oración | Añadir contexto y CTA claros |
| Variables que podrían contener contenido sensible sin moderación | Variable libre para el body de un comunicado | Limitar la longitud y el scope de `{{4}}` |
| Nombre de template con palabras reservadas | `template_test_1` | Usar nombres descriptivos del propósito |

### Orden de prioridad de aprobación

```
Semana 1: templates P0 (1–5) → son los bloqueantes del lanzamiento
Semana 2: templates P1 (6–9) → completan el MVP
Post-MVP: templates P2 (10–11)
```

---

## Restricciones de uso (operativas)

| Restricción | Detalle |
|-------------|---------|
| Opt-in obligatorio | Solo enviar a tutores con `whatsapp_communications: true` en `consent_options` |
| Opt-out inmediato | Respuesta `STOP` → marcar `whatsapp_optin: false` en el perfil · nunca reenviar |
| Sin modificación post-aprobación | Cambiar el texto de un template aprobado requiere nueva aprobación de Meta |
| Throttle de Vujy | Aplicar política de §14 de `09-MCP-DEFINITIONS.md` — no solo el límite de Meta |
| Horario | No enviar utility outbound entre 22:00 y 08:00 ART salvo emergencias P0 |
| Templates de AUTHENTICATION | No reutilizar para mensajes que no sean OTP o magic link — Meta los audita |

---

*Vujy · vujy.app — Template Library v1.0 · Marzo 2026*
