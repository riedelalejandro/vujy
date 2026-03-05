# CDU-PAD-004 — Aviso de ausencia del hijo

← [Volver al índice](../README.md)

---

## CDU-PAD-004 — Aviso de ausencia del hijo

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Padre / Tutor
**Canales:** App · WhatsApp

**Trigger:** El padre informa que el hijo no va a concurrir. Ejemplos: "Avisá que Mati no va a ir el lunes", "Mati no va mañana", "Sofi está con fiebre".

**Flujo conversacional:**
```
Padre: "Mati no va a ir mañana, tiene fiebre"

Asistente: [llama get_my_students(guardian_id)]
           — Si el tutor tiene múltiples hijos y la consulta no especifica cuál,
             preguntar antes de continuar: "¿Me hablás de Mati o de Sofi?"
           — Una vez identificado el alumno, verificar can_authorize_absence=true
             en el vínculo guardian_students para ese alumno.

           Si can_authorize_absence=false →
→ "No tenés autorización para justificar inasistencias de Mati.
   Comunicate con secretaría o pedile al contacto principal de la familia que lo haga."
   [Fin del flujo]

           Si can_authorize_absence=true →

Asistente: "Voy a registrar la ausencia de Mati para mañana, viernes 6/3.
            La seño va a quedar notificada. ¿Confirmás?"

Padre: "Sí"

Asistente: [llama registrar_ausencia(alumno_ids=["alu_mati"], fecha="2026-03-06",
            motivo="salud", notificar_docente=true)]
→ "Ausencia registrada ✅. La seño fue notificada.
   ¿Querés que le pida las tareas del día para que Mati no se atrase?"
```

**Tool MCP requerida:**
- `get_my_students` (para desambiguación multi-hijo y verificación de permisos)
- `registrar_ausencia`
- `get_tareas` (si el padre acepta pedir las tareas del día)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| No se especifica la fecha | "¿Para qué día querés registrar la ausencia?" |
| Múltiples hijos y consulta ambigua | "¿Para cuál: Mati o Sofi?" — siempre antes de verificar permisos y llamar la tool |
| Tutor sin `can_authorize_absence` | "No tenés autorización para justificar inasistencias de [nombre]. Comunicate con secretaría o pedile al contacto principal de la familia que lo haga." |
| La fecha ya pasó | "El lunes 3/3 ya pasó. ¿Querés igualmente registrarla como justificada?" |
| Ausencia ya registrada por la docente | "Ya figura como ausente ese día. ¿Querés agregar el motivo?" |
| Alumno cerca del límite de inasistencias | Alerta proactiva: "Mati lleva 20 inasistencias. El límite es 25." |

**Principio III:** Solo el tutor autorizado puede registrar ausencia del alumno vinculado a su perfil.
