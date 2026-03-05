# CDU-ADM-015 — Revocación de acceso de tutor (urgente)

← [Volver al índice](../README.md)

---

## CDU-ADM-015 — Revocación de acceso de tutor (urgente)

**Prioridad:** P0 BLOQUEANTE MVP | **Origen:** `[Seguridad]`
**Actor:** Administrador / Directivo (ejecuta) · Secretaría (puede iniciar)
**Canales:** App · Web (solo admin — nunca WhatsApp)

**Trigger:** El administrador recibe una orden judicial de restricción perimetral, una denuncia de violencia intrafamiliar, una suspensión de tutela o una solicitud formal de la familia para bloquear el acceso de un adulto al perfil del alumno.

**Flujo conversacional:**
```
[Admin — desde panel de gestión o conversación]

Admin: "Necesito revocar el acceso de Carlos López al perfil de Mati, hay una restricción judicial"

Asistente: [llama buscar_tutor(escuela_id, query="Carlos López")]
→ "Encontré a Carlos López — tutor de Matías López (3ro B).
   Acceso activo en: App (último ingreso: ayer 21:03), WhatsApp.

   ⚠️ Acción irreversible sin aprobación de directivo.
   Motivo a registrar:
   1) Orden judicial
   2) Denuncia de violencia
   3) Suspensión de tutela
   4) Solicitud de familia

   ¿Cuál es el motivo?"

Admin: "Orden judicial"

Asistente: "Confirmá la revocación de acceso de Carlos López:
           ▸ Alumno afectado: Matías López (3ro B)
           ▸ Motivo: Orden judicial
           ▸ Efecto: acceso bloqueado en TODOS los canales en < 60 segundos
           ▸ Mensaje al tutor: 'Tu acceso fue modificado. Contactá a la institución.'

           ¿Confirmás? (se requiere tu PIN de admin)"

Admin: [ingresa PIN]

Asistente: [llama revocar_acceso_tutor(tutor_id, motivo="orden_judicial", admin_id)]
           [llama log_auditoria_seguridad(accion, timestamp, admin_id, motivo)]
→ "✅ Acceso revocado (22:14:07).
   Carlos López no puede ingresar a ningún canal de Vujy.
   Mensaje enviado al tutor.
   Log de auditoría registrado — inmutable.

   El acceso puede restaurarse solo con aprobación del directivo. ¿Notificamos a alguien más?"
```

**Tool MCP requerida:**
- `buscar_tutor` (búsqueda por nombre/DNI dentro del tenant)
- `revocar_acceso_tutor` (propaga revocación a todos los canales vía RLS)
- `log_auditoria_seguridad` (log inmutable — no modificable ni por admin)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Admin revoca al tutor equivocado | Muestra flujo de restauración — requiere aprobación del directivo superior |
| Tutor intenta acceder después de la revocación | Bloqueado en todos los canales; se registra el intento en el log |
| Tutor revocado consulta por qué | Mensaje genérico: "Tu acceso fue modificado. Contactá a la institución." Sin dar motivo. |
| Dos tutores con el mismo nombre | Muestra ambos con DNI y vínculo al alumno — pide confirmar cuál antes de actuar |
| Revocación fuera de horario (ej. 2am) | El flujo está disponible 24/7 sin excepción — es una función de seguridad |
| Familia con custodia compartida sin restricción | El sistema NO revoca automáticamente — solo con instrucción explícita del admin |

**Principio III (NON-NEGOTIABLE):** La revocación debe propagarse a nivel RLS en Supabase — no solo en la UI. El tutor no puede recuperar acceso por ningún canal alternativo (WhatsApp, magic link, OTP) hasta que el acceso sea restaurado explícitamente.

**Nota de implementación:** El log de auditoría es inmutable. Ni el admin, ni el directivo, ni soporte de Vujy pueden modificarlo. Solo puede ser consultado con permiso de directivo + log del acceso a dicho log.
