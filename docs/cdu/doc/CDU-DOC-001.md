# CDU-DOC-001 — Toma de asistencia por voz

← [Volver al índice](../README.md)

---

## CDU-DOC-001 — Toma de asistencia por voz

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Docente
**Canales:** App · Web · WhatsApp

**Trigger:** La docente informa ausencias en lenguaje natural al inicio del día. Ejemplos: "Hoy faltaron Mati López y Sofi Ruiz", "Hoy están todos", "Faltó Lucas".

**Flujo conversacional:**
```
Seño: "Hoy faltaron Mati López y Sofi Ruiz"

Asistente: "Ausencias del lunes 3/3 — 4to B:
            - Matías López — ausente
            - Sofía Ruiz — ausente
            Los papás ya fueron notificados. ¿Querés pedirles que informen el motivo?"

Seño: "Sí"

Asistente: [llama tomar_asistencia_grado(grado_id, fecha=hoy, asistencias=[...])]
→ "Asistencia registrada ✅. 2 tutores notificados."
```

**Tool MCP requerida:**
- `tomar_asistencia_grado`
- `registrar_ausencia` (alternativa si es solo ausentes individuales)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| La docente dice "Hoy están todos" | Registra asistencia completa con confirmación |
| Nombre ambiguo (dos alumnos similares) | "¿Te referís a Matías López o a Mariano Loza?" |
| Tardanza (no ausencia) | "¿Valentina llegó tarde o estuvo ausente?" — distingue estados |
| Asistencia ya registrada ese día | "La asistencia de hoy ya fue registrada. ¿Querés modificarla?" |
| Múltiples grados (profesor secundaria) | "¿Para qué curso: 4to A o 4to B?" |
| Alumno con inasistencias acumuladas | Alerta proactiva: "Mati lleva 3 ausencias sin justificar este mes." |
