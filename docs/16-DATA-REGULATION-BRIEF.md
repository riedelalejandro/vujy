# 16 — Brief Legal: Protección de Datos y Regulación

> **Versión:** 1.0.0 · **Fecha:** 2026-03-05
> **Estado:** PENDIENTE VALIDACIÓN LEGAL — bloqueante antes de usar datos reales de usuarios
> **Destinatario:** Asesor legal especializado en protección de datos y tecnología educativa (Argentina)

---

## 1. Contexto del Proyecto

**Vujy** es una plataforma SaaS B2B para escuelas privadas argentinas (nivel inicial, primario y secundario). Procesa datos personales de tres categorías de titulares:

- **Menores de edad** (alumnos): datos académicos, biométricos de asistencia, estados de bienestar, comunicaciones pedagógicas
- **Adultos responsables** (padres/tutores): datos de contacto, consentimientos, datos financieros (cuotas escolares)
- **Personal docente y administrativo** (staff): datos laborales mínimos necesarios para operar la plataforma

La plataforma utiliza **Inteligencia Artificial** (Claude API de Anthropic) para responder consultas de usuarios en lenguaje natural. Para responder, el modelo recibe contexto que puede incluir datos personales de los titulares mencionados arriba.

**Normativa aplicable identificada (a validar con asesor):**
- Ley 25.326 — Protección de Datos Personales
- Resolución AAIP 47/2018 y disposiciones complementarias
- Ley 26.061 — Protección Integral de los Derechos de las Niñas, Niños y Adolescentes
- Ley 25.506 — Firma Digital (relevante para consentimientos electrónicos)
- Normativa del BCRA sobre datos financieros (cuotas escolares)
- Regulaciones provinciales educativas aplicables (jurisdicción operativa inicial: CABA + GBA)

---

## 2. Preguntas para el Asesor Legal

### 2.1 Base Legal para Procesamiento de Datos de Menores

**Contexto técnico:**
Vujy procesa datos académicos, de asistencia y de bienestar de alumnos menores de edad. El acceso a estos datos está habilitado por el consentimiento del padre/tutor durante el proceso de inscripción escolar, gestionado por la institución educativa (cliente B2B de Vujy).

**Preguntas:**

1. ¿El contrato entre Vujy y la institución educativa es suficiente como base legal, o se requiere consentimiento parental explícito adicional dirigido a Vujy como plataforma tecnológica?

2. ¿Vujy opera como **responsable** o como **encargado de tratamiento** bajo la Ley 25.326? ¿Cambia la respuesta si la institución educativa subdelega el tratamiento a Vujy sin intervención directa de los padres?

3. Para el módulo de **bienestar emocional** (alertas sobre estados emocionales de alumnos generadas por IA): ¿requiere consentimiento parental específico diferenciado del consentimiento general de uso de la plataforma?

4. ¿Existe obligación de inscribir las bases de datos de alumnos menores ante la **AAIP** (ex-DNPDP)? ¿Qué plazo y procedimiento aplica?

5. ¿La edad de 13 años como umbral de consentimiento autónomo en redes sociales aplica analógicamente al uso de plataformas educativas con IA? ¿A partir de qué edad un alumno puede consentir directamente el uso de sus datos?

---

### 2.2 Transferencia Internacional de Datos (Claude API / Anthropic)

**Contexto técnico:**
Para responder consultas de usuarios, Vujy envía prompts a la **Claude API de Anthropic** (empresa con sede en San Francisco, CA, EE.UU.). Estos prompts pueden contener:

- Nombre y apellido del alumno
- Notas académicas y calificaciones
- Registros de asistencia
- Observaciones pedagógicas del docente sobre el alumno
- Alertas de bienestar emocional
- Datos del padre/tutor (nombre, teléfono)

Los datos se transmiten mediante HTTPS, no se almacenan permanentemente en servidores de Anthropic (según sus términos de servicio actuales), pero sí se procesan en infraestructura de EE.UU.

**Preguntas:**

6. ¿Esta transmisión de datos a Anthropic constituye una **transferencia internacional** en los términos de la Ley 25.326 Art. 12? ¿Requiere autorización previa de la AAIP?

7. ¿EE.UU. tiene nivel de protección adecuado reconocido por Argentina, o se requieren **cláusulas contractuales estándar** u otro mecanismo habilitante?

8. ¿Es suficiente con un **Data Processing Agreement (DPA)** firmado con Anthropic, o se requiere algún instrumento adicional bajo la normativa argentina?

9. Si la respuesta anterior requiere DPA, ¿qué cláusulas mínimas obligatorias debe contener bajo la ley argentina, específicamente para datos de menores de edad?

10. ¿Debe informarse a los padres/tutores, en el aviso de privacidad, que los datos son procesados por una IA con infraestructura en EE.UU.? ¿Con qué nivel de detalle?

11. ¿Existe alguna restricción adicional para transferir internacionalmente datos de salud/bienestar de menores (alertas del módulo de bienestar emocional)?

---

### 2.3 Retención y Eliminación de Datos

**Contexto técnico:**
La plataforma almacena en PostgreSQL (Supabase, infraestructura en AWS us-east-1):

| Tipo de dato | Tabla | Consideración especial |
|---|---|---|
| Calificaciones | `grade_records` | Historial académico completo |
| Asistencia | `attendance_records` | Registro diario |
| Observaciones docentes | `pedagogical_notes` + embeddings pgvector | Incluye evaluaciones subjetivas |
| Alertas de bienestar | `wellbeing_alerts` | Datos sensibles de salud mental |
| Consentimientos | `consents` | Registro de opt-in/opt-out |
| Log de auditoría | `audit_log` | Append-only, no modificable por diseño |
| Pagos | `payment_items` | Datos financieros |
| Comunicaciones WhatsApp | `messages` | Conversaciones completas |

**Preguntas:**

12. ¿Cuál es el **plazo mínimo de retención** obligatorio para datos académicos (calificaciones, asistencia) bajo la normativa educativa argentina? ¿Existe un plazo máximo obligatorio de eliminación?

13. Para datos de bienestar emocional de menores: ¿existe normativa específica sobre plazos de retención distintos a los datos académicos generales?

14. ¿El **derecho al olvido/supresión** de la Ley 25.326 Art. 16 aplica sobre datos académicos históricos? ¿Puede un padre solicitar la eliminación completa de los datos de su hijo una vez que egresa de la institución?

15. El `audit_log` es **append-only por diseño de seguridad** (registra quién accedió a qué datos y cuándo, para detectar accesos indebidos). Si un padre ejerce su derecho de supresión, ¿puede solicitarse la eliminación de las entradas del audit_log que referencian los datos de su hijo? ¿O el interés legítimo de seguridad prevalece?

16. ¿Qué sucede con los datos cuando una **institución educativa rescinde su contrato** con Vujy? ¿Cuál es el plazo máximo que Vujy puede retener los datos antes de eliminarlos? ¿Existe obligación de portabilidad/entrega a la institución?

---

### 2.4 Consentimiento y Opt-in

**Contexto técnico:**
El flujo de consentimiento diseñado (CDU-CROSS-005) captura:
- Consentimiento de uso de la plataforma educativa
- Consentimiento específico para comunicaciones por WhatsApp
- Consentimiento para procesamiento con IA

Los consentimientos se gestionan mediante `register_consent@v1` y `get_consent_status@v1` (tools del sistema).

**Preguntas:**

17. ¿El consentimiento capturado a través de WhatsApp (mensaje de texto confirmando "acepto") es **válido y ejecutable** bajo la Ley 25.506 y 25.326? ¿Requiere firma digital certificada?

18. Para comunicaciones de marketing/promocionales por WhatsApp (categoría MARKETING en Meta): ¿aplica el régimen de opt-in explícito de la AAIP además de los requisitos de Meta? (Nota: MVP solo usa categorías UTILITY y AUTHENTICATION, pero relevante para roadmap)

19. ¿Es suficiente un consentimiento parental único para todos los tipos de tratamiento (académico, bienestar, IA, WhatsApp), o deben ser consentimientos granulares separados?

20. Si un alumno cumple la mayoría de edad mientras está en la plataforma, ¿debe solicitarse un nuevo consentimiento a él directamente? ¿En qué plazo?

---

### 2.5 Aviso de Privacidad y Política de Privacidad

**Preguntas:**

21. ¿Qué menciones obligatorias debe incluir el aviso de privacidad bajo la ley argentina, considerando que el responsable es la institución educativa pero Vujy opera como plataforma tecnológica?

22. ¿Debe Vujy publicar su propia **Política de Privacidad** separada de la política de cada institución educativa cliente? ¿En qué URL y en qué idioma?

23. Para la integración con WhatsApp Business: Meta exige una URL de política de privacidad para aprobar el WABA (WhatsApp Business Account) de cada escuela. ¿Esta política puede ser la de Vujy o debe ser la de cada institución?

---

## 3. Información Técnica de Soporte

### 3.1 Infraestructura y Proveedores

| Proveedor | Rol | Ubicación de datos | Certificaciones |
|---|---|---|---|
| Supabase (AWS us-east-1) | Base de datos principal (Postgres) | Virginia, EE.UU. | SOC 2 Type II |
| Vercel | Frontend + API routes | Global CDN (edge en EE.UU.) | SOC 2 Type II |
| Anthropic | Procesamiento IA (Claude API) | EE.UU. | Ver términos de servicio |
| Meta (WhatsApp Cloud API) | Canal de mensajería | EE.UU. / Global | Ver políticas Meta |
| Mercado Pago | Procesamiento de pagos | Argentina + EE.UU. | PCI-DSS |
| Expo (React Native) | Distribución de app móvil | CDN global | - |

### 3.2 Categorías de Datos Procesados

**Datos ordinarios:**
- Nombre, apellido, DNI del alumno
- Fecha de nacimiento, grado/año escolar
- Nombre y apellido de padres/tutores
- Teléfono y email de padres/tutores
- Calificaciones y notas académicas
- Registros de asistencia

**Datos potencialmente sensibles (Art. 2 Ley 25.326):**
- Observaciones sobre comportamiento del alumno (notas pedagógicas)
- Alertas de bienestar emocional y estados anímicos
- Información sobre situaciones familiares relevantes para el seguimiento escolar

**Datos financieros:**
- Estado de cuenta de cuotas escolares
- Historial de pagos

### 3.3 Flujo de Datos con IA (Diagrama Simplificado)

```
Padre/Docente/Admin (WhatsApp/App/Web)
    ↓ mensaje en lenguaje natural
Vujy Backend (Vercel, EE.UU.)
    ↓ consulta datos del alumno
Supabase DB (AWS us-east-1, EE.UU.)
    ↓ datos recuperados
Vujy Backend
    ↓ construye prompt con datos del alumno
Claude API - Anthropic (EE.UU.)
    ↓ respuesta en lenguaje natural
Vujy Backend
    ↓ respuesta filtrada por guardarraíles
Usuario final
```

El prompt enviado a Anthropic incluye datos del alumno con propósito exclusivo de generar la respuesta. No se envían datos biométricos ni fotografías.

### 3.4 Medidas de Seguridad Implementadas

- Cifrado en tránsito: TLS 1.3 en todas las comunicaciones
- Cifrado en reposo: AES-256 (gestionado por Supabase/AWS)
- Row Level Security (RLS) en PostgreSQL: cada institución solo accede a sus propios datos
- Audit log inmutable: registro de todos los accesos a datos
- Autenticación: magic link (sin contraseñas) + OTP por WhatsApp
- Guardarraíles de IA: el asistente no puede revelar datos de menores a usuarios no autorizados

---

## 4. Acciones Requeridas del Asesor Legal

Con base en las respuestas a las preguntas anteriores, se solicita al asesor:

1. **Dictamen escrito** sobre base legal aplicable y viabilidad del tratamiento bajo la normativa argentina
2. **Modelo de cláusula DPA** con Anthropic (o validación de que el DPA estándar de Anthropic es suficiente)
3. **Modelo de aviso de privacidad** para padres/tutores (a incluir en el onboarding de cada institución)
4. **Política de privacidad** de Vujy para publicación en vujy.app
5. **Modelo de contrato de encargo de tratamiento** entre Vujy y las instituciones educativas clientes
6. **Procedimiento de ejercicio de derechos ARCO** (Acceso, Rectificación, Cancelación, Oposición) adaptado al modelo multi-tenant
7. **Recomendación sobre plazos de retención** por tipo de dato, para parametrizar en la plataforma
8. **Checklist de cumplimiento** antes de lanzamiento con datos reales

---

## 5. Estado y Seguimiento

| Ítem | Estado | Responsable | Fecha límite |
|---|---|---|---|
| Selección de asesor legal | PENDIENTE | Fundadores | — |
| Entrega de este brief al asesor | PENDIENTE | — | — |
| Dictamen sobre base legal | PENDIENTE | Asesor legal | — |
| DPA con Anthropic | PENDIENTE | Asesor + Fundadores | Antes de usar datos reales |
| Aviso de privacidad | PENDIENTE | Asesor legal | Antes de onboarding primera escuela |
| Política de privacidad pública | PENDIENTE | Asesor legal | Antes de lanzamiento |
| Contrato encargo de tratamiento | PENDIENTE | Asesor legal | Antes de primer contrato comercial |
| Registro ante AAIP (si aplica) | PENDIENTE | Asesor + Fundadores | Según dictamen |

> **BLOQUEANTE CRÍTICO:** No usar datos reales de alumnos (ni siquiera en staging/testing) hasta contar con el dictamen legal y el DPA con Anthropic firmado.

---

*Brief preparado por el equipo técnico de Vujy para facilitar la consulta legal. No constituye asesoramiento jurídico.*
