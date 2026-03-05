# Vujy — Evaluación de Integración WhatsApp Business API

**Versión:** 1.0
**Fecha:** 4 de marzo de 2026
**Relacionado con:** SPEC.md §13 · constitution.md Principio II (Ubicuidad Multicanal)

---

## Índice

1. [Contexto y alcance](#1-contexto-y-alcance)
2. [Modelo de pricing de Meta (vigente desde julio 2025)](#2-modelo-de-pricing-de-meta)
3. [Arquitectura multi-tenant para Vujy](#3-arquitectura-multi-tenant)
4. [Comparativa de proveedores (BSPs)](#4-comparativa-de-proveedores)
5. [Análisis de costo operativo por escuela](#5-análisis-de-costo-operativo)
6. [Consideraciones de compliance y ToS](#6-compliance-y-tos)
7. [Recomendación](#7-recomendación)

---

## 1. Contexto y Alcance

WhatsApp es el canal de adopción principal de Vujy (Constitución Principio II y VI). Los padres
ya están en WhatsApp — la integración elimina la necesidad de descargar una app para los casos
de uso de mayor frecuencia.

### Casos de uso por actor

| Actor | Caso de uso | Tipo de mensaje |
|-------|-------------|-----------------|
| **Padre** | Consultar notas, asistencia, cuota | Service (inbound + respuesta) |
| **Padre** | Reportar ausencia | Service (inbound) |
| **Padre** | Recibir resumen semanal proactivo | Utility (template outbound) |
| **Padre** | Recibir recordatorio de cuota | Utility (template outbound) |
| **Padre** | Confirmar reunión | Service (respuesta a template) |
| **Docente** | Registrar asistencia, cargar notas | Service (inbound) |
| **Docente** | Enviar comunicado a todos los padres | Utility (template outbound, bulk) |
| **Admin** | Consultar morosidad, lanzar recordatorios | Service (inbound) |

### Clasificación de mensajes (post julio 2025)

- **Service**: respuesta dentro de la ventana de 24 h tras un mensaje del usuario → **gratis**
- **Utility**: templates transaccionales (recordatorios, resúmenes, notificaciones) → tarifa por mensaje
- **Marketing**: templates promocionales → tarifa por mensaje (más cara)
- **Authentication**: OTPs → tarifa por mensaje

**Insight crítico**: La mayoría de las interacciones de Vujy son _inbound_ (el padre pregunta, el
sistema responde). Si el padre inicia la conversación, todas las respuestas dentro de las 24 h
siguientes son gratuitas. Esto cambia radicalmente el modelo de costos.

---

## 2. Modelo de Pricing de Meta

**Cambio efectivo 1° de julio de 2025**: Meta pasó de cobrar por _conversación_ (ventana 24 h)
a cobrar por _mensaje entregado_ para templates outbound. Los mensajes service siguen siendo
gratuitos dentro de la ventana de 24 h.

### Tarifas para Argentina (USD por mensaje entregado)

| Categoría | Tarifa | Notas |
|-----------|--------|-------|
| **Marketing** | $0.0618 | Templates promocionales, anuncios |
| **Utility** | $0.026 | Templates transaccionales: recordatorios, resúmenes |
| **Authentication** | $0.026 | OTPs, verificación de login |
| **Service** | $0.000 | Respuestas dentro de ventana de 24 h (cliente inicia) |

*Fuente: flowcall.co, vigente desde oct 2025 con reducción de tarifas para Argentina.*

### Ventanas gratuitas extendidas

- Utility templates enviados **dentro** de la ventana de 24 h activa → **gratis**
- Si el padre escribe y Vujy responde con un resumen (utility template) dentro de 24 h → **$0**
- Si Vujy envía el resumen semanal de forma proactiva (sin mensaje previo del padre) → **$0.026/msg**

**Implicación de diseño**: Diseñar flujos que maximicen el uso de la ventana de servicio reduce
el costo hasta cero en los casos más frecuentes.

---

## 3. Arquitectura Multi-Tenant

### Opción A — WABA dedicado por escuela (recomendado para MVP)

Cada escuela tiene su propio número de WhatsApp Business y su WABA (WhatsApp Business Account).
Vujy actúa como plataforma que gestiona múltiples WABAs bajo un Business Solution Provider.

```
Vujy (ISV) ←→ BSP (Twilio / 360dialog / Meta Cloud API)
    ├── Escuela A: WABA-001 · +54 11 XXXX-XXXX
    ├── Escuela B: WABA-002 · +54 11 XXXX-XXXX
    └── Escuela C: WABA-003 · +54 11 XXXX-XXXX
```

**Ventajas:**
- El padre ve el nombre y número de la escuela, no de "Vujy"
- Aislamiento completo de datos entre tenants (requerimiento FR-023)
- Cada escuela puede tener su nombre de display ("Colegio San Martín")
- Si una escuela abandona Vujy, se lleva su número

**Desventajas:**
- Costo fijo por número/mes (BSP fee independiente del volumen)
- Onboarding: cada escuela necesita verificar su Facebook Business Manager
- Número de teléfono físico o virtual por escuela

### Opción B — Número compartido + routing interno

Un único número de Vujy atiende a todas las escuelas y enruta internamente por ID de
institución.

**Por qué descartarla:**
- Los padres conversan con un número genérico ("Vujy"), no con su escuela → peor adopción
- Viola la percepción de producto white-label que esperan las instituciones
- Riesgo de bloqueo: si el número es reportado por spam en una escuela, afecta a todas

### Flujo de onboarding de una escuela nueva (Opción A)

```
1. Admin de la escuela crea / verifica su Facebook Business Manager
2. Vujy (como ISV del BSP) solicita acceso a su WABA vía API
3. La escuela aprueba el acceso en el Business Manager de Meta
4. Vujy provisiona el número (virtual o SIM) y registra el webhook
5. La escuela ya puede recibir y enviar mensajes desde el dashboard de Vujy
```

Tiempo estimado: 24-72 h (sujeto a revisión de Meta).

### Gestión de templates

- Los Utility templates (recordatorios de cuota, resúmenes semanales) **deben ser pre-aprobados**
  por Meta antes de enviarse
- Vujy debe crear y gestionar la biblioteca de templates aprobados por institución
- Tiempo de aprobación: 24-48 h por template
- Vujy puede tener templates globales aprobados y personalizarlos por variable de escuela

---

## 4. Comparativa de Proveedores

### Providers evaluados

| # | Proveedor | Tipo | Modelo | Fortaleza |
|---|-----------|------|--------|-----------|
| 1 | **Meta Cloud API (directa)** | Meta oficial | Sin BSP | Sin markup, máximo control |
| 2 | **360dialog** | BSP oficial | Licencia mensual/número | Más barato a volumen medio-alto |
| 3 | **Twilio** | BSP oficial | Por mensaje (con markup) | Mejor DX, docs, soporte |
| 4 | **Gupshup** | BSP oficial | Por mensaje | Presencia Latam |
| 5 | **Infobip** | BSP oficial | Enterprise | Contractual, caro |

### Comparativa detallada

| Criterio | Meta Cloud API | 360dialog | Twilio |
|----------|:---:|:---:|:---:|
| Markup sobre tarifa Meta | 0% | 0% | +$0.005–0.010/msg |
| Fee fijo por número/mes | $0 | ~$49–99 | $0 |
| Setup / onboarding | Complejo | Medio | Fácil |
| SDK / docs | Graph API (REST) | REST | SDK múltiples lenguajes |
| Soporte técnico | Foros | Email/chat | 24/7 enterprise |
| Programa ISV / SaaS | ✅ (Tech Provider) | ✅ (Partner Program) | ✅ |
| Velocidad de go-to-market | Lenta (90+ días verificación) | Media (30-45 días) | Rápida (días) |
| Escalabilidad | Alta | Alta | Alta |
| Presencia en Argentina | ✅ | ✅ | ✅ |
| Webhooks multi-tenant | Manual | Dashboard de partner | SDK integrado |
| Ideal para | Escala (>50 escuelas) | MVP + escala | MVP |

### Meta Cloud API (Tech Provider Program)

Vujy se registra como **Tech Provider** en Meta, lo que permite:
- Provisionar WABAs para sus clientes sin que cada escuela vaya al Business Manager de Meta
- 0% markup sobre las tarifas de Meta
- Acceso a la API directa de WhatsApp (Graph API v21+)

**Requisito**: el proceso de verificación como Tech Provider toma 60-90 días y requiere
revisión por parte de Meta. No apto para MVP si hay urgencia de time-to-market.

### 360dialog Partner Program

BSP especializado en WhatsApp con programa oficial para ISVs/SaaS:
- El partner (Vujy) onboarda escuelas en su dashboard
- Cada número paga ~$49/mes de licencia + tarifas Meta a costo 0%
- Opción de facturación directa al cliente final (la escuela)
- Webhooks configurables por número (multi-tenant nativo)

### Twilio

Más caro pero más rápido:
- Costo adicional: ~$0.005-0.010 por mensaje business-initiated sobre tarifa Meta
- Para 200 utility messages/escuela/mes: overhead de $1-2/escuela/mes (marginal)
- Docs y SDK excelentes (Node.js, Python, etc.)
- Subaccounts de Twilio para separación de tenants y facturación
- Time-to-market: días desde registro hasta primer mensaje

---

## 5. Análisis de Costo Operativo

### Parámetros de una escuela tipo (200 alumnos)

| Perfil | Usuarios en WhatsApp | Notas |
|--------|---------------------|-------|
| Padres / tutores | 180 | 90% de 200 alumnos |
| Docentes | 15 | Todos usan el canal para asistencia y comunicados |
| Admin / directivos | 3 | Consultas de morosidad, alertas, reportes |
| Secretaría / preceptores | 3 | Reinscripciones, legajos, alertas |
| Alumnos | 0 | Canal exclusivo app/web — ver nota de compliance §6 |
| **Total usuarios activos** | **201** | |

### Principio fundamental de costos: quién inicia el mensaje

| Origen | Destino | Tipo | Costo |
|--------|---------|------|-------|
| Docente habla con el agente | → Vujy | Service (inbound) | **$0** |
| Admin consulta morosidad | → Vujy | Service (inbound) | **$0** |
| Padre consulta notas o ausencia | → Vujy | Service (inbound) | **$0** |
| Vujy responde dentro de 24 h | → cualquier usuario | Service (outbound) | **$0** |
| Vujy envía resumen semanal proactivo | → padres | Utility (outbound) | $0.026/msg |
| Vujy envía recordatorio de cuota | → padres | Utility (outbound) | $0.026/msg |
| Vujy envía comunicado masivo de docente | → padres | Utility (outbound) | $0.026/msg |
| Vujy envía digest semanal de clase | → docentes | Utility (outbound) | $0.026/msg |
| Vujy envía alerta proactiva de riesgo | → admin | Utility (outbound) | $0.026/msg |

**Conclusión**: el 100% de las interacciones conversacionales (usuarios hablando con el agente
y el agente respondiendo) son gratuitas. Solo los mensajes **proactivos iniciados por Vujy**
generan costo.

### Volumen de utility templates outbound por perfil destinatario

#### Padres (180 familias)

| Mensaje | Frecuencia | Msgs/mes |
|---------|-----------|---------|
| Resumen semanal proactivo | 1/semana × 180 | 720 |
| Recordatorio de cuota | ~30% morosos | 55 |
| Comunicados de docentes (batched por familia) | 2–4/semana × 180 | 360–720 |
| **Subtotal padres** | | **~1.135–1.495** |

#### Docentes (15)

| Mensaje | Frecuencia | Msgs/mes |
|---------|-----------|---------|
| Digest semanal de su clase (asistencia, notas, alertas) | 1/semana × 15 | 60 |
| Notificación de aprobación de comunicado enviado | ~2/semana × 15 | 120 |
| **Subtotal docentes** | | **~180** |

#### Admin / directivos / secretaría (6)

| Mensaje | Frecuencia | Msgs/mes |
|---------|-----------|---------|
| Alertas proactivas de riesgo de deserción | ~5/mes × 3 admins | 15 |
| Resumen ejecutivo semanal (morosidad, asistencia) | 1/semana × 3 | 12 |
| Alertas de documentación pendiente (secretaría) | ~5/mes × 3 | 15 |
| **Subtotal admin/staff** | | **~42** |

#### Total por escuela/mes

| Perfil | Msgs outbound | Costo Meta ($0.026) |
|--------|--------------|---------------------|
| Padres | 1.135–1.495 | $29.50–$38.90 |
| Docentes | 180 | $4.70 |
| Admin / staff | 42 | $1.10 |
| **Total base** | **~1.357–1.717** | **~$35–45 USD** |

Con ventana de servicio activa (~30% de msgs cae dentro de 24 h y es gratuita):

| **Total neto estimado — Meta fees/escuela/mes** | **~$25–32 USD** |
|-------------------------------------------------|-----------------|

### Escenario optimizado (outbound como feature de tier premium)

Si los mensajes outbound se habilitan solo en tiers Premium/Enterprise, el tier Básico
tiene costo WhatsApp de $0 para Vujy (solo hay interacciones inbound-gratuitas).

| Tier | Outbound habilitado | Costo Meta/escuela/mes |
|------|--------------------|-----------------------|
| Básico | No | **$0** |
| Premium | Sí (padres + docentes) | **~$22–28 USD** |
| Enterprise | Sí (todos los perfiles + alertas avanzadas) | **~$25–32 USD** |

Con batching y triggers inteligentes (ver §5 Optimización), el volumen baja a ~600–800
msgs/mes en Premium, llevando el costo Meta a **$16–21 USD/escuela/mes**.

### Costo BSP por escuela/mes

| Proveedor | Fee mensual/número | Markup msgs | **Total BSP** |
|-----------|-------------------|-------------|--------------|
| Meta Cloud API directo | $0 | $0 | **$0** |
| 360dialog | $49–99 | $0 | **$49–99** |
| Twilio | $0 | ~$7–12 (1.400 msgs × $0.005–0.008) | **$7–12** |

### Costo total WhatsApp por escuela/mes (todos los perfiles, escenario base)

| Escenario | Meta fees | BSP fees | **Total USD** |
|-----------|-----------|----------|--------------|
| Meta directo (escala) | $25–32 | $0 | **$25–32** |
| 360dialog (MVP/escala) | $25–32 | $49 | **$74–81** |
| Twilio (MVP) | $25–32 | $7–12 | **$32–44** |

### Impacto sobre el modelo de negocio

Habilitando outbound solo en tiers pagos:

- **Tier Básico**: $0 COGS de WhatsApp. El canal actúa como soporte conversacional puro.
- **Tier Premium**: ~$32–44 USD COGS/escuela/mes (Twilio MVP). Con ARPU de varios cientos
  de dólares por escuela, el canal es viable desde el primer cliente.
- **Meta directo a escala**: $25–32 USD/escuela/mes sin BSP overhead. A 50 escuelas: $1.250–1.600
  USD/mes vs. $2.200–3.750 con 360dialog — la migración se amortiza rápido.

### Optimización de costos mediante diseño

Estrategias para minimizar utility templates outbound:

1. **Batching de comunicados**: en vez de un mensaje por evento, un resumen diario por familia
   (N comunicados del día → 1 solo mensaje)
2. **Trigger on demand**: resumen semanal solo si el usuario no inició conversación esa semana
   (si ya conversó, la info se entregó como service message gratuito)
3. **Opt-in selectivo**: recordatorios de cuota solo a familias morosas (~55/mes vs. 180)
4. **Digest docente on-demand**: enviar digest de clase solo si el docente no abrió la app
   en los últimos 3 días
5. **Umbral de silencio**: si un usuario interactúa frecuentemente (inbound), no interrumpir
   con outbound proactivo — toda la info ya llegó gratis vía service messages

---

## 6. Compliance y ToS

### Políticas de Meta para contenido educativo con menores

- WhatsApp prohíbe explícitamente usar la API para contactar menores sin consentimiento
  parental verificado
- Los alumnos menores NO deben ser el destinatario directo de mensajes vía WhatsApp Business API
- **Los mensajes van a los padres/tutores, nunca directamente al alumno menor**
- Guardarraíles ya definidos en FR-020: el asistente de alumnos menores tiene restricciones
  independientes — aplican al canal app/web, no a WhatsApp (que es canal de padres/docentes/admin)

### Registro de datos y privacidad argentina

- Los números de WhatsApp de los padres son datos personales bajo Ley 25.326
- Deben obtenerse con consentimiento explícito al momento de inscripción
- El número no puede compartirse entre tenants ni usarse para comunicaciones no relacionadas
  con la institución
- Deben poder desuscribirse en cualquier momento (STOP keyword)
- Implementar opt-out en el onboarding y respetar las desuscripciones inmediatamente

### Términos de uso de WhatsApp Business

- **Prohibido**: spam, mensajes de marketing no solicitados, comprar/vender bases de datos de números
- **Permitido**: notificaciones transaccionales opt-in, soporte al cliente, comunicaciones de servicio
- **Templates**: deben ser aprobados y no pueden modificarse sin re-aprobación
- **Horario**: Meta no impone horario pero las buenas prácticas y la regulación argentina
  recomiendan no enviar comunicados entre 22:00 y 08:00

### Opciones de número por escuela

| Tipo | Pros | Contras |
|------|------|---------|
| Número fijo existente de la escuela | Continuidad, familias lo reconocen | Requiere migrar número; la escuela pierde acceso a WhatsApp personal en ese número |
| Número virtual nuevo dedicado a Vujy | Fácil de provisionar | Las familias deben guardar un número nuevo |
| Coexistencia WA Business App + API | La escuela sigue usando WA Business App para uso manual | Funcionalidad limitada en el canal API (solo durante ventanas no activas) |

**Recomendación**: número virtual nuevo por escuela, con display name del colegio configurado
en el WABA. Las familias lo guardan en la agenda la primera vez que reciben el mensaje de
bienvenida. Costo de número virtual: $0–5 USD/mes según el proveedor de telefonía.

---

## 7. Recomendación

### Decisión para MVP

**Usar Twilio como BSP para el MVP**, migrando a Meta Cloud API (Tech Provider) al superar
las 20–30 escuelas activas.

**Justificación:**

| Factor | Detalle |
|--------|---------|
| Time-to-market | Twilio: integración en días. Meta Tech Provider: 60-90 días de revisión. |
| DX | SDK de Twilio para Node.js/Python es superior; menor fricción para el primer producto |
| Costo incremental | El sobrecosto de Twilio vs. Meta directo es ~$15–20/escuela/mes. Con 10 escuelas en MVP: $150-200/mes total. Ruido frente al riesgo de retraso. |
| Escalabilidad | Twilio Subaccounts permite aislamiento real de tenants con facturación separada |
| Soporte | Soporte 24/7 de Twilio reduce el riesgo operativo en el MVP |
| Migración | La migración a Meta directo es posible sin cambiar la arquitectura de webhooks ni los números de las escuelas |

### Hoja de ruta

| Fase | Proveedor | Trigger |
|------|-----------|---------|
| **MVP (0–20 escuelas)** | Twilio | Desde el día 1 |
| **Escala temprana (20–50 escuelas)** | 360dialog Partner | Cuando el costo BSP supere $1.500 USD/mes |
| **Escala (50+ escuelas)** | Meta Cloud API Tech Provider | Cuando el proceso de verificación valga el esfuerzo |

### Próximos pasos técnicos

1. **Registrar cuenta Twilio** y activar el canal WhatsApp Business
2. **Crear un WABA de prueba** con un número virtual de sandbox para el primer piloto
3. **Definir los templates** que necesitan pre-aprobación (resumen semanal, recordatorio de cuota,
   bienvenida, comunicado escolar)
4. **Implementar el handler de webhooks** con routing multi-tenant por número de destino
5. **Diseñar el flujo de opt-in** para padres al momento de inscripción (consentimiento explícito,
   opción STOP)
6. **Medir el volumen real** de utility templates en el primer mes de piloto para ajustar
   la estimación de costos antes de escalar

### Decisiones pendientes derivadas

- `TODO(WHATSAPP_NUMBER_STRATEGY)`: ¿número virtual nuevo por escuela o migración de número existente?
  Depende del primer colegio piloto.
- `TODO(TEMPLATE_LIBRARY)`: definir el set mínimo de templates para MVP y someterlos a aprobación de Meta
- `TODO(OPTIN_FLOW)`: diseñar el flujo de consentimiento explícito de padres integrado con el
  onboarding de la escuela

---

*Vujy · vujy.app — Evaluación WhatsApp API v1.0 · Marzo 2026*
*Fuentes: Meta Business Platform Pricing, flowcall.co, respond.io, controlhippo.com, Twilio Docs, 360dialog.com*
