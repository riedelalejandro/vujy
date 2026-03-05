# CDU-CROSS-005 — Consentimiento informado en onboarding

← [Volver al índice](../README.md)

---

## CDU-CROSS-005 — Consentimiento informado en onboarding

**Prioridad:** P0 BLOQUEANTE MVP | **Origen:** `[Seguridad]`
**Actor:** Padre / Tutor (en primer acceso)
**Canales:** App · Web · WhatsApp (versión simplificada si el primer contacto es por WA)
**Tier:** Todos — es un prerequisito legal, no un feature

**Trigger:** Primera sesión del padre/tutor en la plataforma, independientemente del canal de entrada.

**Flujo conversacional:**
```
[Padre — primer acceso via magic link]

[Pantalla de bienvenida — antes de cualquier funcionalidad]

Asistente: "Hola [nombre]. Antes de empezar, necesitamos que revises y aceptes
           cómo usamos tu información y la de [alumno].

           En Vujy guardamos:
           • Datos de [alumno]: asistencia, notas, tareas, observaciones docentes
           • Tus datos de contacto para comunicaciones de la escuela
           • Conversaciones con el asistente (para mejorar las respuestas contextuales)

           ¿Quién puede ver estos datos?
           • Vos (solo tus propios hijos)
           • Los docentes de [alumno] (solo su progreso académico)
           • El equipo directivo de la escuela
           • El asistente usa tecnología de Anthropic, empresa de EE.UU.
             (tus datos se procesan bajo acuerdos de privacidad internacionales)

           Tus derechos:
           Podés acceder, corregir o pedir la eliminación de tus datos en cualquier
           momento desde Ajustes > Mis datos (Ley 25.326).

           ☐ Acepto los términos de uso y política de privacidad [ver completo]

           Además, de forma opcional:
           ☐ Acepto recibir comunicaciones por WhatsApp
           ☐ Acepto que se compartan fotos de actividades donde aparezca [alumno]

           Podés usar Vujy sin activar las opciones opcionales."

Padre: [marca el checkbox obligatorio + los opcionales que quiere]
       [toca "Continuar"]

Asistente: [llama registrar_consentimiento_tutor(tutor_id, version_doc, opciones, timestamp, device)]
→ [redirige a la pantalla principal de la app]

---

[Flujo WhatsApp — primer contacto por WA]

Asistente: "Hola [nombre], soy el asistente de Vujy para [nombre de la escuela].
           Antes de continuar, necesito tu consentimiento para procesar tus datos.
           Respondé SÍ para aceptar o ingresá a la app para ver los detalles completos:
           [link a pantalla completa]"

Padre: "SÍ"

Asistente: [registra consentimiento básico por WA]
→ "Perfecto. Tus datos están protegidos bajo la Ley 25.326.
   Podés gestionar tus preferencias en cualquier momento respondiendo CONFIGURAR.
   ¿En qué puedo ayudarte?"
```

**Tool MCP requerida:**
- `registrar_consentimiento_tutor` (versión del documento, checkboxes, timestamp, IP/device, canal)
- `get_estado_consentimiento` (para validar antes de ejecutar cualquier otro CDU)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Padre rechaza el checkbox obligatorio | No puede avanzar — la app queda en modo "solo lectura de aviso". La escuela recibe alerta de padre sin consentimiento. |
| Padre rechaza WhatsApp opt-in | Puede usar la app normalmente. No recibirá nada por WhatsApp. El sistema marca el canal como inactivo para esa familia. |
| Padre rechaza opt-in de fotos | Puede usar la app. El alumno tendrá el flag interno que bloquea su aparición en diarios y álbumes para otras familias. |
| Cambio en la política de privacidad | En el próximo acceso se muestra la nueva versión y se requiere re-aceptación. Los datos procesados bajo la versión anterior se mantienen bajo esa política hasta que el usuario actualice. |
| Padre accede desde múltiples dispositivos | El consentimiento se registra por sesión — se considera válido el último registro. |
| Alumno con dos tutores legales | Cada tutor debe completar su propio consentimiento en su propio acceso. |
| Tutor sin smartphone / sin acceso digital | La secretaría puede registrar el consentimiento en papel y cargarlo manualmente — el sistema mantiene el flag `consentimiento_paper=true`. |

**Implementación crítica:**
- El botón "Continuar" está deshabilitado hasta que el checkbox obligatorio esté marcado.
- El consentimiento se guarda con: versión del documento, timestamp ISO 8601, IP del dispositivo, canal, opciones seleccionadas.
- Sin `consentimiento_registrado=true` en el perfil del tutor, NINGÚN CDU ejecuta llamadas a tools de datos de alumnos.
- La redacción del aviso debe ser validada con al menos 5 padres de distinto nivel socioeducativo antes del lanzamiento del MVP.

**Marco normativo:** Ley 25.326 (Protección de Datos Personales), Ley 26.061 (Derechos de NNyA), Disposición DNPDP 10/2015.
