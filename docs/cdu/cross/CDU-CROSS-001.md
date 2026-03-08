# CDU-CROSS-001 — Docente y padre coordinando apoyo para un alumno

← [Volver al índice](../README.md)

---

## CDU-CROSS-001 — Docente y padre coordinando apoyo para un alumno

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
- `generate_announcement_draft@v1`
- `send_announcement@v1` (canal docente → familia)
- `get_calendar@v1` (para proponer y agendar)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| El padre responde agresivamente | El asistente mantiene tono institucional; deriva a la directora si escala |
| La reunión no puede concretarse | Ofrece alternativas: llamada, mensaje en la plataforma |

**Principio III:** El asistente no comparte datos académicos del alumno con el padre sin el consentimiento de la docente de ir más allá del mensaje inicial.
