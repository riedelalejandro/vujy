# Vujy — Comparativa de Modelos de IA

**Versión:** 1.0
**Fecha:** 4 de marzo de 2026
**Relacionado con:** 05-ARCHITECTURE.md · TODO(MCP_DEFINITIONS)

---

## Índice

1. [Criterios de evaluación para Vujy](#1-criterios-de-evaluación)
2. [Modelos evaluados](#2-modelos-evaluados)
3. [Comparativa general](#3-comparativa-general)
4. [Análisis por criterio](#4-análisis-por-criterio)
5. [Estimación de costo por escuela/mes](#5-costo-por-escuela)
6. [Recomendación](#6-recomendación)

---

## 1. Criterios de Evaluación

Los criterios están ordenados por importancia para el producto:

| # | Criterio | Por qué importa en Vujy |
|---|---------|------------------------|
| 1 | **Function calling / tool use** | Es la arquitectura principal del asistente — MCPs que ejecutan queries reales a Supabase |
| 2 | **Safety y guardarraíles** | Datos de menores de edad; Constitución Principio III es NON-NEGOTIABLE |
| 3 | **Calidad en español** | Todos los usuarios son argentinos; el tono y la naturalidad son parte del diferencial |
| 4 | **Latencia** | Conversación en tiempo real — respuestas lentas matan la adopción |
| 5 | **Consistencia** | Misma entrada → misma salida; crítico para workflows predecibles (MCPs) |
| 6 | **Precio** | COGS directo del producto; afecta la viabilidad por escuela |
| 7 | **Context window** | Conversaciones largas, historial de trimestre, documentos institucionales |

---

## 2. Modelos Evaluados

Se evalúan los modelos de API disponibles a marzo 2026, en dos tiers por proveedor:
un modelo **inteligente** (para tareas complejas) y uno **rápido/barato** (para tareas simples y alto volumen).

| Proveedor | Modelo inteligente | Modelo rápido |
|-----------|-------------------|---------------|
| **Anthropic** | Claude Sonnet 4.6 | Claude Haiku 4.5 |
| **OpenAI** | GPT-5.2 | GPT-4o mini |
| **Google** | Gemini 3.1 Pro | Gemini 3 Flash |
| **xAI** | Grok 4.1 | Grok 4.1 Fast |

---

## 3. Comparativa General

### Modelos inteligentes (tier principal)

| Criterio | Claude Sonnet 4.6 | GPT-5.2 | Gemini 3.1 Pro | Grok 4.1 |
|----------|:-----------------:|:-------:|:--------------:|:--------:|
| Function calling | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Safety / guardarraíles | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Calidad en español | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Latencia | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Consistencia | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Precio (input/output por 1M tokens) | $3 / $15 | $1.75 / $14 | $2 / $12 | $— / $— |
| Context window | 200K | Extended | 1M | 2M |

### Modelos rápidos (tier de alto volumen)

| Criterio | Claude Haiku 4.5 | GPT-4o mini | Gemini 3 Flash | Grok 4.1 Fast |
|----------|:----------------:|:-----------:|:--------------:|:-------------:|
| Function calling | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Safety / guardarraíles | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Calidad en español | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Latencia | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Precio (input/output por 1M tokens) | $1 / $5 | $0.15 / $0.60 | $0.50 / $3 | $0.20 / $0.50 |

---

## 4. Análisis por Criterio

### 4.1 Function calling / tool use

**Claude** es el más confiable para workflows multi-step: sigue instrucciones estrictamente,
no inventa llamadas a tools que no existen, maneja bien el encadenamiento de herramientas
(ej: consultar balance → ofrecer pago → confirmar → registrar). Ideal para los MCPs de Vujy.

**GPT-5.2** soporta parallel function calling muy bien (llama múltiples tools simultáneamente),
lo que puede ser útil para consultas que requieren datos de varias fuentes a la vez.

**Gemini** tiene buen soporte de function calling pero menor madurez en edge cases complejos.

**Grok** es el menos documentado en este criterio — riesgoso como base de un producto en producción.

### 4.2 Safety y guardarraíles

**Claude** es el líder indiscutido. Anthropic tiene la política de seguridad más robusta del
mercado, con Constitutional AI. Para un producto que procesa datos de menores (Constitución
Principio III NON-NEGOTIABLE), esto no es menor.

**GPT y Gemini** tienen buenas políticas pero menos estrictas. Ambos tienen casos documentados
de jailbreak en contextos educativos.

**Grok** (xAI) tiene la política de safety menos restrictiva del grupo — por diseño, xAI
prioriza respuestas menos censuradas. **Incompatible con el Principio III de la Constitución
de Vujy.** No recomendado para ningún perfil que interactúe con o sobre menores.

### 4.3 Calidad en español rioplatense

**Claude y GPT-5.2** son los mejores en español. Claude en particular maneja bien el contexto
cultural argentino (voseo, modismos locales, tono institucional sin sonar robótico).

**Gemini** es bueno pero en evaluaciones independientes muestra mayor variabilidad en
español latinoamericano vs. español europeo.

**Grok** tiene menor entrenamiento en español regional — respuestas correctas pero sin
naturalidad local.

### 4.4 Latencia

**Gemini 3 Flash** es el más rápido (~250 tokens/seg). Ideal para respuestas inmediatas.

**GPT-4o mini** también muy rápido (~200 tokens/seg).

**Claude Sonnet** es más lento (~80 tokens/seg) pero suficiente para conversación — el
usuario percibe respuesta natural, no instantánea.

**Claude Haiku** equilibra bien velocidad y calidad para el tier de alto volumen.

### 4.5 Precio

Grok es el más barato, pero con los problemas de safety mencionados.
Gemini Flash es la opción económica viable — buena calidad a muy bajo costo.
Claude Haiku es la opción económica de Anthropic, más cara que Gemini Flash pero
con las garantías de safety de Anthropic.

---

## 5. Costo por Escuela/Mes

### Estimación de consumo (escuela tipo, 200 alumnos)

| Actor | Interacciones/día | Tokens promedio por interacción | Tokens/mes |
|-------|------------------|---------------------------------|-----------|
| Padres (WhatsApp + app) | 60 | 800 input + 300 output | 2.1M input / 0.78M output |
| Docentes | 30 | 600 input + 400 output | 0.54M input / 0.36M output |
| Admin / staff | 10 | 1.000 input + 500 output | 0.3M input / 0.15M output |
| **Total/mes** | | | **~3M input / ~1.3M output** |

### Costo mensual por modelo (escuela tipo)

| Modelo | Input cost | Output cost | **Total/mes** | Viabilidad |
|--------|-----------|-------------|--------------|-----------|
| **Claude Haiku 4.5** | $3.00 | $6.50 | **~$9.50** | ✅ Excelente |
| **Gemini 3 Flash** | $1.50 | $3.90 | **~$5.40** | ✅ Excelente |
| **GPT-4o mini** | $0.45 | $0.78 | **~$1.23** | ✅ Muy barato |
| **Claude Sonnet 4.6** | $9.00 | $19.50 | **~$28.50** | ⚠️ Caro para todo |
| **GPT-5.2** | $5.25 | $18.20 | **~$23.45** | ⚠️ Caro para todo |
| **Gemini 3.1 Pro** | $6.00 | $15.60 | **~$21.60** | ⚠️ Caro para todo |
| **Grok 4.1 Fast** | $0.60 | $0.65 | **~$1.25** | ❌ Safety inaceptable |

**Conclusión de costos**: usar el modelo inteligente para todo es inviable (~$20-28/escuela/mes
solo en IA). La arquitectura de dos tiers (fast para queries simples, smart para razonamiento
complejo) baja el costo a ~$5-10/escuela/mes.

---

## 6. Recomendación

### Arquitectura de dos tiers (propuesta)

```
Query entrante
    │
    ├── Simple (consulta de datos, registro de asistencia)
    │       └── Claude Haiku 4.5  →  rápido, barato, safe
    │
    └── Compleja (generación de informe, análisis financiero,
                  síntesis de observaciones, razonamiento multi-paso)
            └── Claude Sonnet 4.6  →  máxima calidad, function calling robusto
```

**Por qué Claude en ambos tiers:**

1. **Safety consistente en toda la plataforma** — mismo proveedor, misma política, sin edge cases entre modelos de distinto origen. Para datos de menores esto es crítico.
2. **Function calling más confiable** — los MCPs de Vujy van a encadenar múltiples tools; Claude es el más predecible en este escenario.
3. **Un solo SDK** — menos complejidad operativa, un solo contrato, un solo punto de fallo.
4. **Costo manejable** — Haiku para el ~80% de las interacciones simples + Sonnet para el ~20% complejo → ~$10-12 USD/escuela/mes total de IA.

### ¿Cuándo considerar Gemini Flash?

Si el costo de IA se vuelve un problema a escala (>200 escuelas), Gemini 3 Flash es el
candidato natural para reemplazar Haiku en el tier simple: misma latencia, menor costo,
calidad aceptable. Requiere evaluar safety para el contexto de menores antes de migrar.

### Grok: descartado

La política de safety de xAI es incompatible con el Principio III de la Constitución de Vujy
(Privacidad y Seguridad de Menores — NON-NEGOTIABLE). No se evalúa para ningún tier.

### Decisión final

| Tier | Modelo | Casos de uso |
|------|--------|-------------|
| **Fast** | Claude Haiku 4.5 | Consultas de datos (notas, asistencia, cuota), registro de asistencia, respuestas simples |
| **Smart** | Claude Sonnet 4.6 | Generación de informes pedagógicos, análisis financiero, síntesis de observaciones, razonamiento complejo, onboarding |
| **Futuro** | Gemini 3 Flash | Candidato a reemplazar Haiku si el costo escala — sujeto a evaluación de safety |

---

*Vujy · vujy.app — Comparativa de Modelos IA v1.0 · Marzo 2026*
*Fuentes: [IntuitionLabs Pricing Comparison](https://intuitionlabs.ai/articles/ai-api-pricing-comparison-grok-gemini-openai-claude) · [Artificial Analysis](https://artificialanalysis.ai/models) · [Collabnix Developer Guide](https://collabnix.com/openai-api-vs-claude-api-vs-gemini-api-developer-comparison-guide-2025/)*
