# CDU-ADM-005 — Consulta de riesgo de deserción

← [Volver al índice](../README.md)

---

## CDU-ADM-005 — Consulta de riesgo de deserción

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador / Sistema (proactivo)
**Canales:** App · Web

**Trigger:** El admin consulta qué familias tienen riesgo de baja, o el sistema alerta proactivamente.

**Flujo conversacional:**
```
Admin: "¿Qué familias tienen riesgo de irse?"

Asistente: [llama get_riesgo_desercion(escuela_id, umbral_riesgo="alto")]
→ "3 familias con riesgo ALTO de deserción:

   1. Familia Pérez (Tomás, 2do A) — Índice: 87/100
      Factores: morosidad 2 meses + padre no lee comunicados 3 semanas
              + no confirmó reinscripción 2027 (vence en 15 días)
      Recomendación: Llamado directo esta semana.

   2. Familia Gómez (Valentina, 4to B) — Índice: 74/100
      Factores: alumna faltó 12 días + morosidad 1 mes
      Recomendación: Entrevista con la docente.

   3. Familia Torres (3 hijos) — Índice: 71/100
      Factores: morosidad creciente desde enero
      Recomendación: Ofrecer plan de pagos.

   ¿Querés actuar sobre alguna de estas familias ahora?"
```

**Tool MCP requerida:**
- `get_riesgo_desercion`
- `get_estado_cuenta` (para profundizar en la situación financiera)
- `get_asistencia` (para profundizar en situación del alumno)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Sin familias en riesgo | "No hay familias con riesgo alto en este momento." |
| Admin quiere también riesgo medio | Re-ejecuta con umbral_riesgo="medio" |
| Familia ya avisó que se va | El asistente actualiza el índice y sugiere un protocolo de offboarding cuidadoso |
| Proactividad del sistema | Si una familia cruza el umbral durante la semana, el sistema alerta sin esperar consulta del admin |

**Principio III:** Los datos del índice de riesgo son de uso interno de la institución. No se comparten con otras escuelas ni con terceros.
