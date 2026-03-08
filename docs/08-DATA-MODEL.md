# Vujy — Modelo de Datos: Familias, Tutores y Alumnos

**Versión:** 1.0
**Fecha:** 5 de marzo de 2026
**Relacionado con:** 05-ARCHITECTURE.md · 09-MCP-DEFINITIONS.md · docs/cdu/

---

## Índice

1. [Contexto y decisiones](#1-contexto-y-decisiones)
2. [Entidades](#2-entidades)
3. [Schema SQL](#3-schema-sql)
4. [Casos de uso del modelo](#4-casos-de-uso-del-modelo)
5. [Implicancias para el asistente IA](#5-implicancias-para-el-asistente-ia)
6. [Implicancias para MCPs](#6-implicancias-para-mcps)

---

## 1. Contexto y Decisiones

### 1.1 El problema

Un tutor puede tener múltiples hijos en la misma institución. El sistema debe:

- Saber **qué hijos puede ver** cada tutor
- Saber **qué acciones puede realizar** cada tutor sobre cada hijo
- Facturar a la **familia como unidad**, no a cada tutor individualmente
- Enviar notificaciones a **las personas correctas** según el tipo de evento

### 1.2 Decisiones tomadas

| Decisión | Alternativa descartada | Motivo |
|----------|----------------------|--------|
| `family` = unidad de facturación (una cuota por familia) | Cuota por alumno | Así funciona la mayoría de las escuelas privadas argentinas; el descuento hermanos se aplica a nivel familia |
| Un alumno pertenece a UNA sola familia | Alumno en múltiples familias | Simplifica el modelo; la deuda es de la familia, cualquier tutor con `can_make_payments` puede pagarla íntegra |
| Permisos por vínculo tutor↔alumno (`guardian_students`) | Permisos a nivel familia | Permite casos como: abuelo que retira pero no ve notas; padre divorciado que ve notas pero no paga |
| Notificación de morosidad a todos con `can_make_payments = true` | Contacto de facturación único por familia | Evita campo extra en `families`; más flexible ante cambios de rol |

### 1.3 Caso de borde: padres divorciados

Ambos tutores mantienen acceso al hijo bajo la **misma familia**. La cuota es una sola.
Cualquiera de los dos puede pagarla. El sistema registra quién realizó cada pago.

```
families: familia_garcia → students: [Lucas García]

guardian_students:
  María García (madre)  →  Lucas  [can_make_payments: true, can_view_grades: true]
  Carlos García (padre) →  Lucas  [can_make_payments: true, can_view_grades: true]
```

No existe un modelo de "50% cada uno". El pago es de la familia; el tutor que paga queda registrado como pagador del movimiento.

---

## 2. Entidades

### `families`

Unidad de facturación. Agrupa a los hijos de una misma familia bajo una sola cuenta.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | PK |
| `school_id` | uuid FK | Tenant — escuela |
| `name` | text | Nombre de la familia (ej: "Familia García") |

> No tiene referencia directa a tutores. La relación se deriva vía `guardian_students → students → family_id`.

---

### `students`

Entidad académica. Pertenece a una escuela y a una familia de facturación.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | PK |
| `school_id` | uuid FK | Tenant |
| `family_id` | uuid FK | → `families` — unidad de facturación |
| `full_name` | text | Nombre completo |
| `grade_id` | uuid FK | → `grades` |
| `birth_date` | date | Fecha de nacimiento |

---

### `guardians`

Persona física que tiene vínculo con uno o más alumnos. Puede o no tener cuenta activa en el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | PK |
| `school_id` | uuid FK | Tenant |
| `user_id` | uuid FK (nullable) | → `auth.users` — null hasta que active cuenta |
| `full_name` | text | Nombre completo |
| `phone` | text | Teléfono (usado para WhatsApp OTP) |
| `email` | text | Email (usado para magic link) |

> Un `guardian` puede existir en el sistema (cargado por la escuela) antes de que la persona active su cuenta. `user_id` se vincula en el momento de la activación.

---

### `guardian_students`

Tabla de relación entre tutores y alumnos. **No es un simple join** — lleva permisos granulares por vínculo.

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `id` | uuid | — | PK |
| `school_id` | uuid FK | — | Tenant |
| `guardian_id` | uuid FK | — | → `guardians` |
| `student_id` | uuid FK | — | → `students` |
| `relationship_type` | text | — | `madre` · `padre` · `abuelo` · `tutor_legal` · `otro` |
| `can_authorize_absence` | bool | `false` | Puede justificar inasistencias |
| `can_view_grades` | bool | `true` | Puede ver calificaciones y progreso académico |
| `can_make_payments` | bool | `false` | Puede pagar la cuota de la familia |
| `is_primary_contact` | bool | `false` | Recibe comunicados institucionales prioritarios |
| `receives_notifications` | bool | `true` | Recibe push/WhatsApp del alumno |

---

## 3. Schema SQL

```sql
-- Familias (unidad de facturación)
CREATE TABLE families (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  uuid NOT NULL REFERENCES schools(id),
  name       text NOT NULL
);

ALTER TABLE families ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON families
  USING (school_id = (auth.jwt() ->> 'school_id')::uuid);

-- Alumnos
CREATE TABLE students (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  uuid NOT NULL REFERENCES schools(id),
  family_id  uuid NOT NULL REFERENCES families(id),
  full_name  text NOT NULL,
  grade_id   uuid NOT NULL REFERENCES grades(id),
  birth_date date
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON students
  USING (school_id = (auth.jwt() ->> 'school_id')::uuid);

-- Tutores
CREATE TABLE guardians (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  uuid NOT NULL REFERENCES schools(id),
  user_id    uuid REFERENCES auth.users(id),  -- nullable hasta activación
  full_name  text NOT NULL,
  phone      text,
  email      text
);

ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON guardians
  USING (school_id = (auth.jwt() ->> 'school_id')::uuid);

-- Relación tutor ↔ alumno con permisos granulares
CREATE TABLE guardian_students (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id             uuid NOT NULL REFERENCES schools(id),
  guardian_id           uuid NOT NULL REFERENCES guardians(id),
  student_id            uuid NOT NULL REFERENCES students(id),
  relationship_type     text NOT NULL
    CHECK (relationship_type IN ('madre','padre','abuelo','tutor_legal','otro')),
  can_authorize_absence bool NOT NULL DEFAULT false,
  can_view_grades       bool NOT NULL DEFAULT true,
  can_make_payments     bool NOT NULL DEFAULT false,
  is_primary_contact    bool NOT NULL DEFAULT false,
  receives_notifications bool NOT NULL DEFAULT true,
  UNIQUE (guardian_id, student_id)
);

ALTER TABLE guardian_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON guardian_students
  USING (school_id = (auth.jwt() ->> 'school_id')::uuid);
```

---

## 4. Casos de Uso del Modelo

### 4.1 ¿Qué hijos puede ver este tutor?

```sql
SELECT s.*
FROM students s
JOIN guardian_students gs ON s.id = gs.student_id
WHERE gs.guardian_id = :guardian_id
  AND gs.can_view_grades = true  -- o el permiso requerido por el contexto
  AND s.school_id = :school_id;
```

### 4.2 Notificación de cuota vencida (a todos los que pueden pagar)

```sql
SELECT g.phone, g.email, g.full_name
FROM guardians g
JOIN guardian_students gs ON g.id = gs.guardian_id
JOIN students s ON gs.student_id = s.id
WHERE s.family_id = :family_id
  AND gs.can_make_payments = true
  AND gs.receives_notifications = true;
```

### 4.3 ¿Puede este tutor justificar la inasistencia de este alumno?

```sql
SELECT EXISTS (
  SELECT 1 FROM guardian_students
  WHERE guardian_id = :guardian_id
    AND student_id  = :student_id
    AND can_authorize_absence = true
);
```

### 4.4 Hermanos de un alumno (misma familia)

```sql
SELECT s.*
FROM students s
WHERE s.family_id = (
  SELECT family_id FROM students WHERE id = :student_id
)
AND s.id != :student_id;
```

---

## 5. Implicancias para el Asistente IA

### Desambiguación de hijo en conversación

Cuando un tutor tiene múltiples hijos, el asistente DEBE resolver a qué alumno refiere la consulta antes de ejecutar cualquier tool.

**Lógica de desambiguación:**

1. **Un solo hijo**: asumir ese hijo, sin preguntar.
2. **Múltiples hijos, hijo mencionado por nombre**: resolver directamente.
3. **Múltiples hijos, consulta genérica** (ej: "¿cómo le fue hoy?"): preguntar explícitamente o responder con resumen de todos.
4. **Contexto previo en el thread**: si el tutor ya mencionó a un hijo en el mismo thread, asumir ese hijo hasta nuevo aviso.

**Ejemplo:**

> Tutor: "¿Cómo le fue hoy?"
> Sistema: get_my_students(guardian_id) → [Lucas, Sofía]
> Claude: "¿Me preguntás por Lucas o por Sofía?"

> Tutor: "Cuéntame cómo les fue a los dos"
> Claude: responde resumen de ambos.

### Permisos en contexto

Antes de ejecutar una tool que requiere permiso específico, el asistente verifica el flag correspondiente. Si el permiso no aplica, responde con un mensaje informativo en lugar de error técnico.

**Ejemplo:**

> Tutor sin `can_authorize_absence`: solicita justificar una inasistencia
> Claude: "No tenés autorización para justificar inasistencias de Lucas. Podés pedirle a [nombre del contacto primario] que lo haga."

---

## 6. Implicancias para MCPs

| MCP | Parámetro clave | Permiso requerido |
|-----|----------------|-------------------|
| `get_my_students` | `guardian_id` | — (siempre disponible) |
| `get_grades@v1` | `student_id`, `guardian_id` | `can_view_grades` |
| `get_attendance@v1` | `student_id`, `guardian_id` | `can_view_grades` |
| `record_absence@v1` | `student_id`, `guardian_id` | `can_authorize_absence` |
| `get_account_status@v1` | `family_id` | `can_make_payments` |
| `process_payment@v1` | `family_id`, `guardian_id` | `can_make_payments` |
| `get_announcements@v1` | `guardian_id` | — |
| `get_my_students@v1` | `family_id` | — |

> Los MCPs reciben tanto `guardian_id` (para auditoría y permisos) como `student_id` o `family_id` según el dominio de la operación. La validación de permisos ocurre dentro del MCP antes de ejecutar la query.

---

*Vujy · vujy.app — Modelo de Datos v1.0 · Marzo 2026*
