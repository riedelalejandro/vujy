# CDU-PAD-011 — Seguimiento de múltiples hijos

← [Volver al índice](../README.md)

---

## CDU-PAD-011 — Seguimiento de múltiples hijos

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Padre / Tutor con 2+ hijos en la institución
**Canales:** App · WhatsApp

**Trigger:** El padre pregunta por todos sus hijos. Ejemplos: "¿Cómo van los chicos?", "Resumen de todos mis hijos".

**Flujo conversacional:**
```
Padre: "¿Cómo van los chicos esta semana?"

Asistente: [llama get_resumen_alumno(alu_mati, semana_actual)]
           [llama get_resumen_alumno(alu_sofi, semana_actual)]  ← en paralelo

→ "Resumen de esta semana:

   Mati (4to B):
   - Asistencia: 4/5 (faltó el miércoles)
   - Notas: 9 en Matemática ✅
   - Pendiente: TP de Lengua para el viernes

   Sofi (2do A):
   - Asistencia: 5/5 — perfecta
   - Notas: Sin notas nuevas esta semana
   - Pendiente: Misión de lectura para el lunes

   ¿Querés profundizar en alguno de los dos?"
```

**Tool MCP requerida:**
- `get_resumen_alumno` (llamado en paralelo para cada hijo)
- `get_tareas` (pendientes por hijo)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Hijos en distintos niveles | Adapta el lenguaje del resumen según el nivel de cada uno |
| Estado de cuenta familiar | La cuenta es de la familia completa — lo aclara si hay confusión |
| Sin información de un hijo | "De Sofi no tengo datos nuevos. ¿Querés que le consulte a la seño?" |

**Principio III:** El padre solo ve datos de sus propios hijos, incluso cuando consulta por todos a la vez.
