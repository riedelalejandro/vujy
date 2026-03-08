# CDU-ADM-008 — Generación de documentación para el regulador (DIEGEP)

← [Volver al índice](../README.md)

---

## CDU-ADM-008 — Generación de documentación para el regulador (DIEGEP)

**Prioridad:** P2 | **Origen:** `[Base]`
**Actor:** Administrador
**Canales:** App · Web

**Trigger:** El admin solicita documentación requerida por DIEGEP o DGEGP. Ejemplo: "Generame el informe de matrícula para DIEGEP".

**Flujo conversacional:**
```
Admin: "Generame el informe de matrícula para DIEGEP con datos actualizados"

Asistente: [consolida datos de matrícula del sistema]
→ "Informe de Matrícula — Colegio San Martín — Marzo 2026:
   Matrícula total: 240 alumnos
   Inicial: 45 (Sala 3: 15, Sala 4: 15, Sala 5: 15)
   Primaria: 140 (1ro a 6to)
   Secundaria: 55 (1ro a 5to)
   Docentes: 28 (planta funcional completa)
   ⚠️ Este documento requiere tu revisión y firma antes de enviarlo.
   ¿Lo descargás en PDF, lo editás o lo compartís con secretaría para revisión?"

Admin: "Lo comparto con secretaría"

Asistente: "Enviado a secretaría para revisión ✅. Te aviso cuando lo aprueben."
```

**Tool MCP requerida:**
- Múltiples function calls para consolidar datos institucionales
- `generate_announcement_draft@v1` (para formatear el documento)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Datos de matrícula no actualizados | Informa la fecha del último cierre y advierte que el informe refleja ese estado |
| Alumnos sin documentación completa | "5 alumnos no tienen legajo completo — puede observarse en la inspección." |
| Formato del regulador cambió | El template se actualiza según el formulario vigente configurado en el sistema |
