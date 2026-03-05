# Tarea Delegada: Definición de CDU por Perfil (Multiagente)

## Objetivo

Definir y cerrar los **Casos de Uso (CDU)** por perfil para Vujy:
- Padre/Tutor
- Docente
- Admin/Directivo
- Alumno

Esta tarea cierra `TODO(CDU_BY_PROFILE)` y deja insumo listo para `TODO(MCP_DEFINITIONS)`.

---

## Agentes

### 1) Agente Conservador

**Mandato:** minimizar riesgo y ambigüedad.
**Foco:** cumplimiento, permisos, datos sensibles, consistencia con docs existentes.
**No negocia:** seguridad, privacidad de menores, trazabilidad.

### 2) Agente Mid-Level

**Mandato:** bajar definición a algo implementable.
**Foco:** alcance MVP, priorización, dependencias, contratos funcionales claros.
**No negocia:** que cada CDU sea construible y testeable.

### 3) Agente Super Creativo

**Mandato:** maximizar valor diferencial conversacional.
**Foco:** experiencias nuevas, proactividad útil, flujos de alto impacto por perfil.
**No negocia:** evitar soluciones genéricas sin ventaja competitiva.

---

## Protocolo de Trabajo Entre Agentes

1. **Ronda 1 (individual):** cada agente propone CDU por perfil (sin editar a otros).
2. **Ronda 2 (cruce):** cada agente critica propuestas de los otros dos.
3. **Ronda 3 (convergencia):** consolidan una única lista por perfil con prioridad.
4. **Ronda 4 (cierre):** validan cobertura, conflictos y huecos; generan versión final.

Regla de resolución:
- Si hay conflicto, gana la opción que cumpla simultáneamente:
1. menor riesgo regulatorio,
2. mayor valor MVP,
3. menor complejidad de implementación.

---

## Entregable Obligatorio

Formato único por perfil:

```md
## Perfil: <perfil>

### CDU-<ID>: <nombre>
- Actor:
- Disparador:
- Precondiciones:
- Flujo principal (pasos 1..N):
- Flujos alternos / errores:
- Datos requeridos:
- Acción/tool esperada (si aplica):
- Resultado esperado para usuario:
- Prioridad: P0 | P1 | P2
- Canal: WhatsApp | App | Web | Multicanal
- Riesgos (privacidad/regulación/operativo):
- Métrica de éxito:
```

Además, incluir:
- Matriz de cobertura por perfil (mínimo 8 CDU por perfil).
- Ranking global de los 12 CDU más críticos para MVP.
- Lista de huecos detectados para `MCP_DEFINITIONS`.

---

## Criterios de Aceptación

La tarea se considera cerrada solo si:

1. Todos los perfiles tienen CDU priorizados y sin duplicados ambiguos.
2. Cada CDU tiene flujo principal y al menos un flujo alterno/error.
3. Se identifican explícitamente permisos y límites por perfil.
4. Se marca qué CDU requieren datos estructurados (function calling) vs contexto no estructurado (RAG).
5. Se explicitan dependencias con:
   - `TODO(MCP_DEFINITIONS)`
   - `TODO(MIGRATIONS_STRATEGY)`
   - `TODO(DATA_REGULATION)`

---

## Prompt Maestro para Ejecutar la Tarea

```txt
Actúen como un panel de 3 agentes colaborativos para Vujy:

1) Conservador: prioriza seguridad, cumplimiento y control de riesgo.
2) Mid-Level: prioriza implementación realista y foco MVP.
3) Super Creativo: prioriza innovación conversacional y alto impacto.

Contexto:
- Proyecto: Vujy (copiloto institucional educativo).
- Perfiles: padre/tutor, docente, admin/directivo, alumno.
- Objetivo: cerrar definición de CDU por perfil.
- Restricción: deben converger en una sola versión final consensuada.

Proceso obligatorio:
1. Propuesta individual por agente.
2. Crítica cruzada entre agentes.
3. Consolidación con resolución explícita de conflictos.
4. Salida final en formato CDU estándar.

Requisitos de salida:
- Mínimo 8 CDU por perfil.
- Cada CDU con actor, trigger, precondiciones, flujo principal, alternos, datos, resultado, prioridad, canal, riesgos y métrica.
- Matriz de cobertura por perfil.
- Top 12 CDU MVP.
- Lista de insumos pendientes para MCP_DEFINITIONS.

No entreguen ideas sueltas. Entreguen un documento operativo listo para pasar a planificación.
```

