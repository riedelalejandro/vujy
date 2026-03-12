-- =============================================================================
-- Vujy — Base Data (enums, roles, sistema)
-- Datos que deben existir antes del seed de desarrollo y en producción
-- =============================================================================

-- Función helper para insertar roles del sistema si es necesario
-- (Vujy usa text CHECK constraints en vez de enums para mayor flexibilidad)
-- Este archivo puede usarse para insertar datos de referencia adicionales en el futuro.

-- Documentar los valores válidos como comentarios (la validación está en CHECK constraints)
COMMENT ON COLUMN profiles.role IS
  'guardian | teacher | admin | director | secretary | preceptor | student';
COMMENT ON COLUMN schools.plan IS
  'basico | premium | enterprise';
COMMENT ON COLUMN students.external_id IS
  'Nullable — para sincronización futura con SIS (docs/05-ARCHITECTURE.md §10). No usar en MVP.';
COMMENT ON COLUMN profiles.external_id IS
  'Nullable — para sincronización futura con SIS (docs/05-ARCHITECTURE.md §10). No usar en MVP.';
COMMENT ON TABLE audit_log IS
  'Append-only. NUNCA ejecutar UPDATE ni DELETE sobre esta tabla. Registra todos los accesos a datos.';
COMMENT ON TABLE processed_events IS
  'Tabla de idempotencia para webhooks de Mercado Pago y Meta. Insertar event_id antes de procesar.';
