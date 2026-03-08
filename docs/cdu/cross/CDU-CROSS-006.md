# CDU-CROSS-006 — Solicitud ARCO (acceso, rectificación, cancelación, oposición)

← [Volver al índice](../README.md)

---

## CDU-CROSS-006 — Solicitud ARCO

**Prioridad:** P0 | **Origen:** `[Seguridad]`
**Actor:** Padre / Tutor (para datos del hijo menor) · Alumno ≥ 13 años (para sus propios datos)
**Canales:** App · Web (nunca WhatsApp — requiere identidad segura)
**Tier:** Todos — requerimiento legal

**Trigger:** El usuario solicita ejercer derechos sobre sus datos personales: ver qué datos tiene Vujy, corregir un dato incorrecto, solicitar la eliminación de datos, u oponerse a un uso específico.

**Flujo conversacional:**
```
[Padre — desde Ajustes > Mis datos]

Padre: "Quiero ver qué datos tiene Vujy sobre mi hijo"

Asistente: "Podés ejercer cualquiera de estos derechos sobre los datos de [alumno]:

           1) Ver mis datos — descargá un resumen completo
           2) Corregir un dato — modificá información incorrecta
           3) Solicitar eliminación — pedí que se borren tus datos
           4) Oponer a un uso — cuestioná cómo se usan tus datos

           ¿Cuál querés ejercer?"

Padre: "Ver mis datos"

Asistente: [llama export_user_data@v1(tutor_id, alumno_id, formato="pdf")]
→ "Preparando tu descarga...

   El archivo incluye:
   • Datos personales de Mati registrados en Vujy
   • Historial de asistencia (ciclo actual)
   • Calificaciones y observaciones (ciclo actual)
   • Comunicados recibidos y estado de lectura
   • Log de consentimientos registrados
   • Historial de conversaciones con el asistente (últimos 12 meses)

   📄 Descargá el PDF [link — válido 24 hs]

   ¿Necesitás algo más?"

---

[Padre solicita corrección de dato]

Padre: "El apellido de Mati está mal escrito en el sistema"

Asistente: "Entendido. Para corregir datos del legajo de Mati necesito:
           ¿Qué dato está incorrecto y cuál es el valor correcto?"

Padre: "Aparece 'Lopez' sin tilde, es 'López'"

Asistente: [llama request_data_rectification@v1(alumno_id, campo="apellido", valor_actual="Lopez", valor_correcto="López", solicitante_id)]
→ "Solicitud registrada (ref: ARCO-2026-0312).
   La secretaría revisará y aplicará la corrección en hasta 5 días hábiles.
   Te avisaremos cuando esté hecho.

   Por ley (Ley 25.326, Art. 16), la corrección debe completarse en ese plazo."

---

[Alumno de 15 años solicita ver sus propios datos]

Alumno: "Quiero saber qué datos tiene la plataforma sobre mí"

Asistente: [verifica edad del alumno — ≥ 13 → habilita flujo ARCO propio]
→ "Podés ver, corregir u oponerte al uso de tus propios datos.
   Tu tutor legal también puede hacerlo en tu nombre.
   ¿Qué querés ejercer?"
```

**Tool MCP requerida:**
- `export_user_data@v1` (compila datos de múltiples tablas en formato estructurado — PDF / JSON)
- `request_data_rectification@v1` (genera ticket para secretaría con SLA trazable)
- `request_data_deletion@v1` (flujo de eliminación con advertencias y aprobación de admin)
- `register_data_opposition@v1` (queda en log para revisión legal)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Solicitud de eliminación de datos | Flujo de confirmación con advertencia: "Algunos datos no pueden eliminarse por obligación legal (certificados, legajos). Te indicamos cuáles se pueden borrar y cuáles no." |
| Datos con retención legal obligatoria | Se informa al usuario qué datos permanecen (ej. analíticos, actas) y por qué — nunca se eliminan silenciosamente |
| Alumno < 13 años solicita ARCO | "Los derechos ARCO de [nombre] los ejerce su tutor legal. Te redirigimos a la gestión del tutor." |
| Usuario no puede autenticarse para solicitar eliminación | Requiere re-autenticación vía magic link antes de proceder — nunca por WhatsApp |
| Exportación de datos muy grande (años de historial) | Generación asincrónica — "Te avisamos cuando el archivo esté listo (puede demorar hasta 10 minutos)" |
| Padre solicita datos de alumno mayor de 18 | El alumno mayor de edad gestiona sus propios datos. El padre ya no tiene acceso ARCO sobre él. |

**SLAs legales (Ley 25.326):**
| Tipo de solicitud | Plazo máximo |
|-------------------|-------------|
| Acceso (ver datos) | Inmediato (descarga automática) |
| Rectificación | 5 días hábiles |
| Cancelación (eliminación) | 30 días corridos |
| Oposición | 15 días hábiles |

**Implementación:** La exportación de datos nunca se envía por WhatsApp ni por email sin cifrado. Solo descarga directa desde la app o web con sesión activa. El log de solicitudes ARCO es auditable por Vujy ante una inspección de la DNPDP.
