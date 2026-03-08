# Definicion CDU por Perfil (Consenso Multiagente — Historico)

> Documento historico de trabajo (iteracion previa de 32 CDUs).
> El catalogo vigente y definitivo esta en `docs/cdu/README.md` (73 CDUs, v2.0).

> **Estado de uso:** este documento es histórico y **no es fuente canónica operativa** para tools.
> Para implementación real, usar `docs/09-MCP-DEFINITIONS.md` y `docs/10-MCP-SCHEMAS.md` con nomenclatura canónica `tool_name@v1`.

Base: sintesis de 3 agentes en paralelo (Conservador, Mid-Level, Super Creativo) con convergencia sobre riesgo, valor MVP y factibilidad.

## Matriz de Cobertura

| Perfil | CDU totales | P0 | P1 | P2 |
|---|---:|---:|---:|---:|
| Padre/Tutor | 8 | 4 | 3 | 1 |
| Docente | 8 | 4 | 3 | 1 |
| Admin/Directivo | 8 | 4 | 3 | 1 |
| Alumno | 8 | 4 | 3 | 1 |

## Perfil: Padre/Tutor

### CDU-P-01: Ver resumen academico de hijo
- Actor: Padre/Tutor
- Disparador: "Como viene mi hijo esta semana?"
- Precondiciones: Tutor autenticado; vinculacion tutor-alumno activa.
- Flujo principal (pasos 1..N):
1. Usuario solicita resumen.
2. Asistente valida permisos por alumno.
3. Consulta asistencia/notas/tareas/comentarios.
4. Responde estado consolidado y proximos hitos.
- Flujos alternos / errores:
1. Sin vinculacion valida -> deriva a secretaria.
2. Datos incompletos -> entrega parcial y aclara faltantes.
- Datos requeridos: Asistencia, notas, tareas, observaciones (Estructurado/function calling).
- Accion/tool esperada (si aplica): `get_resumen_alumno`, `get_notas`, `get_asistencia`, `get_tareas`.
- Resultado esperado para usuario: Entiende progreso y riesgos sin navegar modulos.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Exposicion de datos de otro alumno.
- Metrica de exito: % consultas resueltas sin derivacion > 90%.

### CDU-P-02: Registrar ausencia de hijo
- Actor: Padre/Tutor
- Disparador: "Mi hija no va hoy".
- Precondiciones: Tutor autorizado; fecha valida.
- Flujo principal (pasos 1..N):
1. Usuario informa ausencia.
2. Asistente confirma alumno, fecha y motivo.
3. Registra ausencia.
4. Notifica docente/preceptoria.
- Flujos alternos / errores:
1. Fecha pasada bloqueada por politica -> deriva a secretaria.
2. Alumno ambiguo -> pide desambiguacion.
- Datos requeridos: Alumno, fecha, motivo (Estructurado).
- Accion/tool esperada (si aplica): `registrar_ausencia`.
- Resultado esperado para usuario: Ausencia formalizada y comunicada.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Registro en alumno incorrecto.
- Metrica de exito: % ausencias bien registradas al primer intento > 98%.

### CDU-P-03: Consultar deuda y vencimientos
- Actor: Padre/Tutor
- Disparador: "Cuanto debo y cuando vence?"
- Precondiciones: Tutor con familia asociada.
- Flujo principal (pasos 1..N):
1. Usuario pide estado de cuenta.
2. Asistente consulta saldo, items y vencimientos.
3. Devuelve deuda actual y riesgo de recargo.
- Flujos alternos / errores:
1. Sin deuda -> informa saldo al dia.
2. Error de facturacion -> abre ticket administrativo.
- Datos requeridos: Cuenta corriente familiar (Estructurado).
- Accion/tool esperada (si aplica): `get_estado_cuenta`.
- Resultado esperado para usuario: Claridad de deuda y proximo vencimiento.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Exponer datos de otra familia.
- Metrica de exito: Tiempo medio a respuesta < 6s.

### CDU-P-04: Iniciar pago y confirmar acreditacion
- Actor: Padre/Tutor
- Disparador: "Quiero pagar ahora".
- Precondiciones: Deuda activa; medio de pago habilitado.
- Flujo principal (pasos 1..N):
1. Usuario elige concepto y monto.
2. Asistente genera link/intent de pago.
3. Usuario paga.
4. Asistente confirma estado y comprobante.
- Flujos alternos / errores:
1. Pago pendiente -> informa ventana de acreditacion.
2. Pago rechazado -> propone reintento.
- Datos requeridos: Concepto, monto, estado transaccion (Estructurado).
- Accion/tool esperada (si aplica): `create_payment_intent`, `confirmar_pago`.
- Resultado esperado para usuario: Pago completado sin salir del flujo.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Fraude o doble imputacion.
- Metrica de exito: % pagos acreditados automaticamente > 95%.

### CDU-P-05: Ver calendario escolar relevante
- Actor: Padre/Tutor
- Disparador: "Que eventos tiene mi hijo este mes?"
- Precondiciones: Alumno vinculado.
- Flujo principal (pasos 1..N):
1. Usuario solicita periodo.
2. Asistente consulta calendario por alumno.
3. Devuelve eventos con fecha/hora y accion sugerida.
- Flujos alternos / errores:
1. Sin eventos -> confirma periodo vacio.
2. Evento reprogramado -> destaca cambio.
- Datos requeridos: Eventos por alumno (Estructurado).
- Accion/tool esperada (si aplica): `get_calendario`.
- Resultado esperado para usuario: Planificacion familiar clara.
- Prioridad: P1
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Desactualizacion de evento critico.
- Metrica de exito: % eventos correctos vs calendario oficial > 99%.

### CDU-P-06: Leer y confirmar comunicados
- Actor: Padre/Tutor
- Disparador: "Mostrame los ultimos comunicados".
- Precondiciones: Canal de comunicados habilitado.
- Flujo principal (pasos 1..N):
1. Asistente lista comunicados pendientes.
2. Usuario abre detalle.
3. Usuario confirma lectura cuando aplique.
- Flujos alternos / errores:
1. Comunicado expirado -> informa estado.
2. Confirmacion fallida -> reintento idempotente.
- Datos requeridos: Comunicados y estado lectura (Estructurado).
- Accion/tool esperada (si aplica): `get_comunicados`, `confirmar_lectura_comunicado`.
- Resultado esperado para usuario: No pierde informacion institucional.
- Prioridad: P1
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Confirmaciones no trazables.
- Metrica de exito: Tasa de lectura dentro de 48h > 80%.

### CDU-P-07: Agendar reunion con docente/escuela
- Actor: Padre/Tutor
- Disparador: "Quiero reunion con la seño".
- Precondiciones: Slots de agenda definidos por escuela.
- Flujo principal (pasos 1..N):
1. Asistente ofrece slots validos.
2. Usuario selecciona opcion.
3. Asistente reserva y envia confirmacion.
- Flujos alternos / errores:
1. Sin cupo -> lista de espera.
2. Solapamiento -> sugiere alternativas.
- Datos requeridos: Disponibilidad y reservas (Estructurado).
- Accion/tool esperada (si aplica): `get_disponibilidad_reuniones`, `reservar_reunion`.
- Resultado esperado para usuario: Reunion formal agendada.
- Prioridad: P1
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Conflictos de agenda.
- Metrica de exito: % turnos confirmados sin intervencion manual > 85%.

### CDU-P-08: Recibir alerta proactiva de riesgo academico
- Actor: Padre/Tutor
- Disparador: Cambio relevante detectado (inasistencias/notas).
- Precondiciones: Opt-in notificaciones activo.
- Flujo principal (pasos 1..N):
1. Sistema detecta umbral de riesgo.
2. Asistente envia alerta explicable.
3. Propone accion concreta (reunion, seguimiento).
- Flujos alternos / errores:
1. Falso positivo -> permitir feedback y ajuste.
2. Sin contexto suficiente -> alerta suave.
- Datos requeridos: Series de asistencia/notas + contexto docente (Estructurado + RAG para explicacion).
- Accion/tool esperada (si aplica): `get_alertas_riesgo_alumno`, `sugerir_plan_apoyo`.
- Resultado esperado para usuario: Intervencion temprana.
- Prioridad: P2
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Sobrealerta o sesgo.
- Metrica de exito: % alertas accionadas con seguimiento > 60%.

## Perfil: Docente

### CDU-D-01: Tomar asistencia en menos de 2 minutos
- Actor: Docente
- Disparador: "Tomar asistencia 3ro B".
- Precondiciones: Docente asignado al curso.
- Flujo principal (pasos 1..N):
1. Asistente abre lista de curso.
2. Docente marca presentes/ausentes (voz o toque).
3. Confirma y guarda.
4. Se notifican familias segun politica.
- Flujos alternos / errores:
1. Alumno no listado -> deriva a secretaria.
2. Corte de conexion -> guardado diferido.
- Datos requeridos: Nomina curso, estado asistencia (Estructurado).
- Accion/tool esperada (si aplica): `registrar_asistencia`, `notificar_ausencias`.
- Resultado esperado para usuario: Asistencia completa y notificada rapido.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Error masivo por seleccion accidental.
- Metrica de exito: Tiempo mediano de toma < 120s.

### CDU-D-02: Cargar notas por lote
- Actor: Docente
- Disparador: "Cargar notas de matematica".
- Precondiciones: Materia y curso asignados.
- Flujo principal (pasos 1..N):
1. Docente dicta o pega notas.
2. Asistente parsea y muestra previsualizacion.
3. Docente confirma.
4. Sistema guarda y recalcula indicadores.
- Flujos alternos / errores:
1. Formato ambiguo -> solicita correccion.
2. Alumno inexistente -> marca conflicto.
- Datos requeridos: Evaluacion, alumnos, notas (Estructurado).
- Accion/tool esperada (si aplica): `cargar_notas_lote`, `validar_notas`.
- Resultado esperado para usuario: Menos carga administrativa.
- Prioridad: P0
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Nota asignada a alumno incorrecto.
- Metrica de exito: % cargas confirmadas sin correccion > 90%.

### CDU-D-03: Enviar comunicado con aprobacion
- Actor: Docente
- Disparador: "Mandar comunicado sobre salida educativa".
- Precondiciones: Permiso para emitir comunicados.
- Flujo principal (pasos 1..N):
1. Docente redacta o dicta borrador.
2. Asistente normaliza tono institucional.
3. Docente aprueba.
4. Sistema envia y trackea lectura.
- Flujos alternos / errores:
1. Falta dato clave (fecha/lugar) -> bloquea envio.
2. Politica invalida -> requiere visto bueno directivo.
- Datos requeridos: Texto comunicado, audiencia, metadata (Estructurado).
- Accion/tool esperada (si aplica): `generar_borrador_comunicado`, `enviar_comunicado`.
- Resultado esperado para usuario: Comunicacion clara y trazable.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Mensaje masivo con error.
- Metrica de exito: Tasa de lectura en 48h > 85%.

### CDU-D-04: Registrar observaciones por alumno
- Actor: Docente
- Disparador: "Registrar observacion de Sofia".
- Precondiciones: Docente con acceso al alumno.
- Flujo principal (pasos 1..N):
1. Docente dicta observacion.
2. Asistente clasifica por area/competencia.
3. Guarda en legajo pedagogico.
- Flujos alternos / errores:
1. Observacion sensible -> etiqueta acceso restringido.
2. Alumno ambiguo -> desambiguacion.
- Datos requeridos: Texto libre, etiqueta pedagogica (RAG + Estructurado).
- Accion/tool esperada (si aplica): `registrar_observacion_docente`.
- Resultado esperado para usuario: Seguimiento continuo util para informes.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Redaccion inadecuada o sesgada.
- Metrica de exito: % alumnos con observacion semanal > 70%.

### CDU-D-05: Generar informe trimestral asistido
- Actor: Docente
- Disparador: "Generame borrador de informes".
- Precondiciones: Observaciones acumuladas.
- Flujo principal (pasos 1..N):
1. Asistente resume observaciones historicas.
2. Genera borrador por alumno.
3. Docente corrige y aprueba.
- Flujos alternos / errores:
1. Datos insuficientes -> pide completar observaciones.
2. Tono no adecuado -> regenera.
- Datos requeridos: Observaciones historicas (RAG) + asistencia/notas (Estructurado).
- Accion/tool esperada (si aplica): `generar_informe_trimestral`.
- Resultado esperado para usuario: Ahorro de tiempo con control docente final.
- Prioridad: P1
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Alucinaciones textuales.
- Metrica de exito: Reduccion de tiempo de informe > 40%.

### CDU-D-06: Crear actividad y publicarla
- Actor: Docente
- Disparador: "Crear actividad de fracciones".
- Precondiciones: Curso activo.
- Flujo principal (pasos 1..N):
1. Docente indica objetivo y nivel.
2. Asistente propone actividad con rubric.
3. Docente aprueba y publica.
- Flujos alternos / errores:
1. Nivel no adecuado -> readecuacion.
2. Falta fecha entrega -> solicita completar.
- Datos requeridos: Programa, nivel, calendario (Estructurado + RAG contenido).
- Accion/tool esperada (si aplica): `generar_actividad`, `publicar_tarea`.
- Resultado esperado para usuario: Actividades consistentes en minutos.
- Prioridad: P1
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Contenido no alineado al curso.
- Metrica de exito: % actividades publicadas tras primera propuesta > 70%.

### CDU-D-07: Detectar alumnos en riesgo academico
- Actor: Docente
- Disparador: "Quienes estan en riesgo este mes?"
- Precondiciones: Datos minimos de asistencia y notas.
- Flujo principal (pasos 1..N):
1. Asistente calcula indicadores.
2. Lista alumnos con explicacion.
3. Sugiere microplan de intervencion.
- Flujos alternos / errores:
1. Falta historico -> usa ventana corta y advierte.
2. Riesgo controvertido -> solicita validacion docente.
- Datos requeridos: Notas, asistencia, tareas (Estructurado).
- Accion/tool esperada (si aplica): `get_alertas_riesgo_alumno`, `sugerir_intervenciones`.
- Resultado esperado para usuario: Priorizacion temprana de acompanamiento.
- Prioridad: P1
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Sesgo en score de riesgo.
- Metrica de exito: % casos detectados con accion docente > 65%.

### CDU-D-08: Barrera horaria para mensajes de familias
- Actor: Docente
- Disparador: Mensajes fuera de horario.
- Precondiciones: Politica horaria definida por escuela.
- Flujo principal (pasos 1..N):
1. Asistente filtra consultas rutinarias fuera de horario.
2. Resuelve lo resoluble automaticamente.
3. Deja bandeja priorizada para horario laboral.
- Flujos alternos / errores:
1. Caso urgente -> escalado inmediato.
2. Politica no definida -> fallback conservador.
- Datos requeridos: Politica horario, categorias consulta (Estructurado).
- Accion/tool esperada (si aplica): `clasificar_consulta_familia`, `escalar_urgencia`.
- Resultado esperado para usuario: Menos interrupciones y mejor bienestar docente.
- Prioridad: P2
- Canal: WhatsApp | App | Web
- Riesgos (privacidad/regulacion/operativo): Clasificar mal un urgente.
- Metrica de exito: Reduccion de interacciones fuera de horario > 50%.

## Perfil: Admin/Directivo

### CDU-A-01: Ver dashboard de morosidad en tiempo real
- Actor: Admin/Directivo
- Disparador: "Como viene la morosidad este mes?"
- Precondiciones: Permiso financiero.
- Flujo principal (pasos 1..N):
1. Asistente consulta deuda segmentada.
2. Muestra total, aging y top riesgos.
3. Recomienda acciones inmediatas.
- Flujos alternos / errores:
1. Datos desfasados -> alerta timestamp.
2. Filtro invalido -> corrige consulta.
- Datos requeridos: Estado de cuenta familias (Estructurado).
- Accion/tool esperada (si aplica): `get_morosidad_dashboard`.
- Resultado esperado para usuario: Visibilidad financiera accionable.
- Prioridad: P0
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Decisiones con datos viejos.
- Metrica de exito: Latencia dashboard < 10s.

### CDU-A-02: Ejecutar campana de cobranza segmentada
- Actor: Admin/Directivo
- Disparador: "Mandar recordatorio a deudores de febrero".
- Precondiciones: Plantilla aprobada; segmentacion definida.
- Flujo principal (pasos 1..N):
1. Asistente genera segmento objetivo.
2. Muestra preview de mensaje y volumen.
3. Admin aprueba envio.
4. Trackea entregas y conversion.
- Flujos alternos / errores:
1. Segmento vacio -> no envia.
2. Template no aprobado -> bloquea.
- Datos requeridos: Deuda por familia, consentimientos (Estructurado).
- Accion/tool esperada (si aplica): `crear_segmento_cobranza`, `enviar_recordatorio_pago`.
- Resultado esperado para usuario: Mejor recaudacion sin operacion manual.
- Prioridad: P0
- Canal: WhatsApp | App | Web
- Riesgos (privacidad/regulacion/operativo): Mensajeria indebida sin opt-in.
- Metrica de exito: Tasa de conversion post recordatorio > 20%.

### CDU-A-03: Simular escenario financiero
- Actor: Admin/Directivo
- Disparador: "Si subo cuota 15% y pierdo 10 alumnos?"
- Precondiciones: Parametros economicos cargados.
- Flujo principal (pasos 1..N):
1. Asistente toma supuestos.
2. Corre simulacion comparativa.
3. Entrega impacto en caja y margen.
- Flujos alternos / errores:
1. Supuestos incompletos -> pide completar.
2. Variable fuera de rango -> advierte.
- Datos requeridos: Matricula, cuota, churn, costos (Estructurado).
- Accion/tool esperada (si aplica): `simular_escenario_financiero`.
- Resultado esperado para usuario: Decisiones economicas con respaldo.
- Prioridad: P0
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Interpretacion excesiva de simulacion.
- Metrica de exito: % decisiones respaldadas por simulador > 60%.

### CDU-A-04: Detectar riesgo de desercion
- Actor: Admin/Directivo
- Disparador: "Que familias estan en riesgo de baja?"
- Precondiciones: Modelo de riesgo configurado.
- Flujo principal (pasos 1..N):
1. Asistente cruza morosidad, lectura y asistencia.
2. Lista familias en riesgo con causa.
3. Sugiere plan de retencion.
- Flujos alternos / errores:
1. Datos incompletos -> baja confianza del score.
2. Riesgo alto -> sugerir contacto humano inmediato.
- Datos requeridos: Morosidad, engagement, asistencia (Estructurado).
- Accion/tool esperada (si aplica): `get_riesgo_desercion`, `sugerir_plan_retencion`.
- Resultado esperado para usuario: Prevencion de perdida de matricula.
- Prioridad: P0
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Sesgo o estigmatizacion.
- Metrica de exito: Reduccion de churn interanual.

### CDU-A-05: Reporte regulatorio exportable
- Actor: Admin/Directivo
- Disparador: "Generar reporte para supervision".
- Precondiciones: Periodo y formato definidos.
- Flujo principal (pasos 1..N):
1. Asistente compila datos requeridos.
2. Genera preview.
3. Admin valida y exporta.
- Flujos alternos / errores:
1. Campo faltante -> marca pendiente.
2. Inconsistencia -> pide reconciliacion.
- Datos requeridos: Matricula, asistencia, indicadores oficiales (Estructurado).
- Accion/tool esperada (si aplica): `generar_reporte_regulatorio`.
- Resultado esperado para usuario: Cumplimiento mas rapido y trazable.
- Prioridad: P1
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Sancion por dato incorrecto.
- Metrica de exito: Tiempo armado reporte < 30 min.

### CDU-A-06: Monitorear lectura de comunicados institucionales
- Actor: Admin/Directivo
- Disparador: "Cuantos padres leyeron el ultimo comunicado?"
- Precondiciones: Comunicados enviados con tracking.
- Flujo principal (pasos 1..N):
1. Asistente consulta metricas de lectura.
2. Segmenta por curso/nivel.
3. Propone acciones para no lectores.
- Flujos alternos / errores:
1. Sin tracking -> sugiere reenviar con confirmacion.
2. Muestra parcial -> aclara cobertura.
- Datos requeridos: Logs lectura comunicados (Estructurado).
- Accion/tool esperada (si aplica): `get_metricas_comunicados`.
- Resultado esperado para usuario: Mejor comunicacion institucional.
- Prioridad: P1
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Mala interpretacion de falta de lectura.
- Metrica de exito: Lectura > 85% en 72h.

### CDU-A-07: Resolver excepciones de cobranza
- Actor: Admin/Directivo
- Disparador: "Aplicar plan 3 cuotas familia Lopez".
- Precondiciones: Permiso para refinanciacion.
- Flujo principal (pasos 1..N):
1. Asistente muestra deuda y politicas.
2. Admin selecciona plan.
3. Sistema genera cronograma y notifica.
- Flujos alternos / errores:
1. Politica excedida -> requiere aprobacion superior.
2. Familia sin canal activo -> derivar llamada.
- Datos requeridos: Deuda, reglas de plan, historial pagos (Estructurado).
- Accion/tool esperada (si aplica): `crear_plan_pago`, `notificar_plan_pago`.
- Resultado esperado para usuario: Acuerdo formal y trazable.
- Prioridad: P1
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Trato inequitativo entre familias.
- Metrica de exito: % planes cumplidos > 70%.

### CDU-A-08: Alertas operativas de alto impacto
- Actor: Admin/Directivo
- Disparador: Evento critico (caida asistencia, incidente, pico mora).
- Precondiciones: Reglas de alerta configuradas.
- Flujo principal (pasos 1..N):
1. Sistema detecta umbral.
2. Asistente notifica con contexto.
3. Propone playbook de respuesta.
- Flujos alternos / errores:
1. Falso positivo -> feedback para recalibrar.
2. Duplicado -> deduplicacion.
- Datos requeridos: KPIs operativos (Estructurado).
- Accion/tool esperada (si aplica): `emitir_alerta_operativa`, `sugerir_playbook`.
- Resultado esperado para usuario: Menor tiempo de reaccion ante desvio.
- Prioridad: P2
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Fatiga por alertas.
- Metrica de exito: Tiempo medio de respuesta a alerta.

## Perfil: Alumno

### CDU-L-01: Ver tareas pendientes y fechas
- Actor: Alumno
- Disparador: "Que tengo que entregar?"
- Precondiciones: Alumno autenticado.
- Flujo principal (pasos 1..N):
1. Asistente lista tareas por prioridad/fecha.
2. Muestra detalle y materiales.
3. Sugiere plan corto de trabajo.
- Flujos alternos / errores:
1. Sin tareas -> propone repaso.
2. Fecha vencida -> marca atraso y accion sugerida.
- Datos requeridos: Tareas, vencimientos (Estructurado).
- Accion/tool esperada (si aplica): `get_tareas`.
- Resultado esperado para usuario: Claridad inmediata de pendientes.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Mostrar datos de otros alumnos.
- Metrica de exito: % alumnos que consultan tareas semanalmente.

### CDU-L-02: Pedir explicacion adaptada de un tema
- Actor: Alumno
- Disparador: "No entendi fracciones".
- Precondiciones: Materia/tema identificado.
- Flujo principal (pasos 1..N):
1. Asistente detecta nivel del alumno.
2. Explica con ejemplo simple.
3. Verifica comprension con pregunta breve.
- Flujos alternos / errores:
1. Persisten dudas -> cambia estrategia (visual/pasos).
2. Tema fuera de programa -> avisa y sugiere consulta docente.
- Datos requeridos: Nivel academico + contenidos de materia (RAG + Estructurado).
- Accion/tool esperada (si aplica): `explicar_concepto`, `generar_ejemplo_guiado`.
- Resultado esperado para usuario: Comprension progresiva sin hacerle la tarea.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Sobreayuda que anule aprendizaje.
- Metrica de exito: Mejora en ejercicios posteriores.

### CDU-L-03: Practicar con mini quiz
- Actor: Alumno
- Disparador: "Tomame un mini quiz".
- Precondiciones: Tema seleccionado.
- Flujo principal (pasos 1..N):
1. Asistente genera quiz breve.
2. Alumno responde.
3. Asistente corrige y explica errores.
- Flujos alternos / errores:
1. Resultado bajo -> propone plan de refuerzo.
2. Alumno frustrado -> modo acompanamiento.
- Datos requeridos: Banco de ejercicios, desempeno previo (Estructurado + RAG).
- Accion/tool esperada (si aplica): `generar_quiz`, `corregir_quiz`.
- Resultado esperado para usuario: Practica frecuente y feedback inmediato.
- Prioridad: P0
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Desajuste de dificultad.
- Metrica de exito: Tasa de finalizacion de quiz > 70%.

### CDU-L-04: Ver progreso personal
- Actor: Alumno
- Disparador: "Como vengo en el trimestre?"
- Precondiciones: Datos academicos disponibles.
- Flujo principal (pasos 1..N):
1. Asistente resume notas/asistencia/logros.
2. Señala fortalezas y foco de mejora.
3. Sugiere meta semanal concreta.
- Flujos alternos / errores:
1. Datos incompletos -> resumen parcial.
2. Resultado sensible -> tono cuidadoso y accion positiva.
- Datos requeridos: Notas, asistencia, tareas (Estructurado).
- Accion/tool esperada (si aplica): `get_resumen_alumno`, `get_notas`, `get_asistencia`.
- Resultado esperado para usuario: Autonomia y motivacion.
- Prioridad: P0
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Efecto desmotivador por framing.
- Metrica de exito: % alumnos con meta semanal activa.

### CDU-L-05: Generar plan de estudio semanal
- Actor: Alumno
- Disparador: "Armame plan para esta semana".
- Precondiciones: Tareas y evaluaciones cargadas.
- Flujo principal (pasos 1..N):
1. Asistente distribuye carga por dias.
2. Ajusta por tiempos declarados.
3. Entrega checklist diario.
- Flujos alternos / errores:
1. Sobrecarga detectada -> reprioriza.
2. Nuevas tareas -> replanificacion.
- Datos requeridos: Tareas, examenes, disponibilidad (Estructurado).
- Accion/tool esperada (si aplica): `generar_plan_estudio`.
- Resultado esperado para usuario: Menor procrastinacion.
- Prioridad: P1
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Plan irrealizable.
- Metrica de exito: % tareas entregadas en fecha.

### CDU-L-06: Crear preguntas para clase (creatividad guiada)
- Actor: Alumno
- Disparador: "Ayudame a armar preguntas del tema".
- Precondiciones: Tema vigente de clase.
- Flujo principal (pasos 1..N):
1. Asistente propone formato de preguntas.
2. Alumno itera.
3. Publica para validacion docente.
- Flujos alternos / errores:
1. Contenido inadecuado -> bloquea y corrige.
2. Duplicado -> sugiere variante.
- Datos requeridos: Tema de clase, reglas de convivencia (RAG + Estructurado).
- Accion/tool esperada (si aplica): `co_crear_preguntas`, `enviar_a_revision_docente`.
- Resultado esperado para usuario: Participacion activa.
- Prioridad: P1
- Canal: App | Web
- Riesgos (privacidad/regulacion/operativo): Publicacion sin moderacion.
- Metrica de exito: % preguntas aprobadas por docente.

### CDU-L-07: Recordatorio proactivo de entrega
- Actor: Alumno
- Disparador: Tarea por vencer en ventana critica.
- Precondiciones: Notificaciones activas.
- Flujo principal (pasos 1..N):
1. Sistema detecta deadline cercano.
2. Asistente envia recordatorio con accion.
3. Alumno marca avance o solicita ayuda.
- Flujos alternos / errores:
1. Exceso de recordatorios -> throttling.
2. Alumno ya entrego -> cancela recordatorio.
- Datos requeridos: Deadlines y estado entrega (Estructurado).
- Accion/tool esperada (si aplica): `programar_recordatorio_tarea`, `actualizar_estado_tarea`.
- Resultado esperado para usuario: Menos entregas tardias.
- Prioridad: P1
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Fatiga notificaciones.
- Metrica de exito: Reduccion de atrasos.

### CDU-L-08: Deteccion de malestar y derivacion cuidada
- Actor: Alumno
- Disparador: Mensajes de angustia/riesgo.
- Precondiciones: Politica de bienestar definida.
- Flujo principal (pasos 1..N):
1. Asistente detecta senal de malestar.
2. Responde con contencion breve y segura.
3. Deriva a adulto responsable/canal escolar segun protocolo.
- Flujos alternos / errores:
1. Señal dudosa -> chequeo adicional.
2. Riesgo alto -> escalado inmediato.
- Datos requeridos: Conversacion actual + protocolo institucional (RAG politica + Estructurado).
- Accion/tool esperada (si aplica): `detectar_riesgo_bienestar`, `escalar_orientacion`.
- Resultado esperado para usuario: Contencion y derivacion responsable.
- Prioridad: P2
- Canal: Multicanal
- Riesgos (privacidad/regulacion/operativo): Falso negativo.
- Metrica de exito: % casos escalados dentro de SLA.

## Top 12 CDU Criticos para MVP

1. CDU-P-01 Ver resumen academico de hijo
2. CDU-P-02 Registrar ausencia de hijo
3. CDU-P-03 Consultar deuda y vencimientos
4. CDU-P-04 Iniciar pago y confirmar acreditacion
5. CDU-D-01 Tomar asistencia en menos de 2 minutos
6. CDU-D-02 Cargar notas por lote
7. CDU-D-03 Enviar comunicado con aprobacion
8. CDU-D-04 Registrar observaciones por alumno
9. CDU-A-01 Ver dashboard de morosidad en tiempo real
10. CDU-A-02 Ejecutar campana de cobranza segmentada
11. CDU-A-03 Simular escenario financiero
12. CDU-L-01 Ver tareas pendientes y fechas

## Insumos Pendientes para MCP_DEFINITIONS

1. Catalogo final de tools por CDU con nombre canonico y version (`tool_name@v1`).
2. Contratos I/O por tool (JSON schema, required, enums, validaciones).
3. Matriz de permisos por rol y canal (incluye restricciones por edad).
4. Politica de confirmacion de acciones criticas (pagos, envios masivos, reportes).
5. Taxonomia de errores y fallback conversacional estandar.
6. Reglas de idempotencia y auditoria por accion.
7. Mapeo CDU -> fuentes de datos (SQL/RLS vs RAG) y SLA esperado.
8. Politicas de proactive messaging (disparadores, frecuencia, opt-in/opt-out).
9. Gaps regulatorios para menores ligados a retencion, visibilidad y exportes.
10. Casos de prueba de extremo a extremo por CDU P0.
