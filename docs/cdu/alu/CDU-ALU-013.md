# CDU-ALU-013 — Portfolio digital y orientación vocacional (Secundaria)

← [Volver al índice](../README.md)

---

## CDU-ALU-013 — Portfolio digital y orientación vocacional (Secundaria)

**Prioridad:** P2 | **Origen:** `[Extension]`
**Actor:** Alumno de secundaria (4to y 5to año principalmente)
**Canales:** App

**Trigger:** El alumno consulta su portfolio o pide orientación. Ejemplos: "¿Qué tengo en mi portfolio?", "¿En qué soy bueno?".

**Flujo conversacional:**
```
Alumno: "¿Qué tengo en mi portfolio?"

Asistente: [llama get_grades@v1(alumno_id, todos_los_trimestres=true)]
           [RAG sobre proyectos y TPs completados]
→ "Tu portfolio — Valentina Gómez (5to año):
   TPs destacados: Historia (9), Biología (8.5), Física (8)
   Logros: 'Lectora Destacada 2025', '50 simulacros completados'
   Foros: 12 participaciones — destacada en Historia y Ciencias

   Áreas de mayor rendimiento: Biología (9.3), Literatura (8.8), Historia (8.5)
   Basado en tu trayectoria, tenés afinidad con ciencias naturales y escritura.
   ¿Querés explorar orientaciones vocacionales relacionadas?"
```

**Tool MCP requerida:**
- `get_grades@v1` (histórico completo — solo del alumno propio)
- RAG sobre proyectos completados
- Analytics de participación

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno en 1er año (poco portfolio) | Muestra lo que hay y lo motiva a construirlo |
| Alumno quiere exportar su portfolio | Genera un PDF descargable |
| Alumno con perfil muy heterogéneo | "Tus notas son muy variadas — eso también puede ser información útil para orientación." |
| El asistente recomienda una carrera | No es categórico: "Esto es una guía basada en datos — la decisión siempre es tuya." |

**Principio III:** El historial y portfolio del alumno son suyos. Los padres tienen acceso a notas pero no al portfolio completo (configurable por institución).
