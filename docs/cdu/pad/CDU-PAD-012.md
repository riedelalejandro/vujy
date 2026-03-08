# CDU-PAD-012 — Resumen proactivo semanal

← [Volver al índice](../README.md)

---

## CDU-PAD-012 — Resumen proactivo semanal

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
- `get_calendar@v1` (semana siguiente)
- `get_tasks@v1` (pendientes)
- `get_student_summary@v1`
- `send_announcement@v1` (si el padre coordina con la docente)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Semana sin novedades | Resumen mínimo + confirmación de que no hay urgencias |
| La escuela no configuró el resumen proactivo | CDU no aplica — es feature configurable por tenant |
| Padre solicita no recibir más el resumen | Registra la preferencia — configurable desde el perfil |
