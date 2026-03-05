# CDU-ADM-001 — Dashboard de pulso institucional

← [Volver al índice](../README.md)

---

## CDU-ADM-001 — Dashboard de pulso institucional

**Prioridad:** P1 | **Origen:** `[Base]`
**Actor:** Administrador / Directivo
**Canales:** App · Web

**Trigger:** El administrador abre la app o pide un resumen. Ejemplos: "¿Cómo estamos hoy?", "Buenos días, resumen".

**Flujo conversacional:**
```
Admin: "¿Cómo estamos hoy?"

Asistente: [llama get_asistencia(escuela_id, fecha=hoy)]
           [llama get_dashboard_morosidad(escuela_id)]
           [llama get_alertas_institucionales(escuela_id)]
           [llama get_comunicados (estadísticas de lectura)]
→ "Buenos días. Pulso de San Martín — lunes 4 de marzo:
   Asistencia (8:25am): 208/240 alumnos. 8 grados tomaron lista.
   Morosidad: $3.1M vencido. 3 familias en riesgo alto.
   Comunicados: 2 sin confirmar lectura en +100 familias.
   Alertas: Valentina Gómez (12 días ausente), Familia Pérez (riesgo deserción).
   ¿Por dónde querés empezar?"
```

**Tool MCP requerida:**
- `get_alertas_institucionales`
- `get_dashboard_morosidad`
- `get_asistencia`
- `get_comunicados`

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Día sin novedades relevantes | "Todo tranquilo hoy — no hay alertas activas ni urgencias." |
| Admin que no quiere el resumen automático | Configurable; no muestra el resumen si está deshabilitado |
