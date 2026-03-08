# Vujy — MCP JSON Schemas (Publicados)

Alcance de este documento:
- Esquemas publicados de input/output para tools canónicas del catálogo.
- **Total publicado:** 48 tools con schema.
- Catálogo completo de referencia: `docs/09-MCP-DEFINITIONS.md` (48 canónicas).
- Canonical-only: no legacy aliases.

Convenciones:
- Standard: JSON Schema Draft 2020-12.
- English-only for technical artifacts: code, tool names, JSON keys, enums, schemas, events, payloads.
- All tools assume `school_id` resolved by session/JWT (not exposed in input except institution-level tools).
- All actions must include `idempotency_key`.

## Common

## 0) Estado de publicación de schemas (v2.1)

Esta versión publica **48 tools** del catálogo canónico total de **48 tools**.

Con esto, quedaron cerrados los pendientes de publicación de schemas de A3.

El resto de las tools tiene schema publicado en este documento.

### Error Schema
```json
{
  "$id": "vujy.common.error.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "code": {
      "type": "string",
      "enum": [
        "VALIDATION_ERROR",
        "FORBIDDEN_SCOPE",
        "NOT_FOUND",
        "DATA_UNAVAILABLE",
        "CONFIRMATION_REQUIRED",
        "DUPLICATE_REQUEST",
        "PAYMENT_REJECTED",
        "TEMPLATE_NOT_APPROVED",
        "OPTIN_REQUIRED",
        "MODEL_UNAVAILABLE",
        "ACCESS_ALREADY_REVOKED",
        "CONSENT_ALREADY_ACTIVE",
        "ARCO_REQUEST_ALREADY_OPEN",
        "EXPORT_IN_PROGRESS",
        "EVENT_MODE_NOT_ACTIVE",
        "EVENT_MODE_ALREADY_ACTIVE",
        "PHOTO_BLOCKED_BY_POLICY",
        "REENROLLMENT_ALREADY_CONFIRMED",
        "INSUFFICIENT_DATA_FOR_GENERATION",
        "ASYNC_JOB_QUEUED"
      ]
    },
    "message": { "type": "string" },
    "request_id": { "type": "string" }
  },
  "required": ["code", "message", "request_id"]
}
```

### Money Schema
```json
{
  "$id": "vujy.common.money.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "amount": { "type": "number", "minimum": 0 },
    "currency": { "type": "string", "enum": ["ARS"] }
  },
  "required": ["amount", "currency"]
}
```

---

## 1) `get_student_summary@v1`
### Input
```json
{
  "$id": "vujy.get_student_summary.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string", "minLength": 1 },
    "period": {
      "type": "string",
      "enum": ["current_week", "previous_week", "current_term", "previous_term"]
    }
  },
  "required": ["student_id", "period"]
}
```

### Output
```json
{
  "$id": "vujy.get_student_summary.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "attendance": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "days_present": { "type": "integer", "minimum": 0 },
        "days_absent": { "type": "integer", "minimum": 0 },
        "excused_absences": { "type": "integer", "minimum": 0 },
        "late_arrivals": { "type": "integer", "minimum": 0 }
      },
      "required": ["days_present", "days_absent", "excused_absences", "late_arrivals"]
    },
    "recent_grades": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "subject": { "type": "string" },
          "grade": { "type": "number", "minimum": 1, "maximum": 10 },
          "date": { "type": "string", "format": "date" },
          "teacher_comment": { "type": "string" }
        },
        "required": ["subject", "grade", "date"]
      }
    },
    "pending_tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "description": { "type": "string" },
          "subject": { "type": "string" },
          "due_date": { "type": "string", "format": "date" }
        },
        "required": ["description", "due_date"]
      }
    },
    "teacher_observations": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "text": { "type": "string" },
          "date": { "type": "string", "format": "date" },
          "teacher": { "type": "string" }
        },
        "required": ["text", "date"]
      }
    }
  },
  "required": ["attendance", "recent_grades", "pending_tasks", "teacher_observations"]
}
```

## 2) `record_absence@v1`
### Input
```json
{
  "$id": "vujy.record_absence.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_ids": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 1 } },
    "date": { "type": "string", "format": "date" },
    "reason": { "type": "string" },
    "notify_teacher": { "type": "boolean", "default": true },
    "notify_guardians": { "type": "boolean", "default": false },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["student_ids", "date", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.record_absence.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "recorded_absences": { "type": "array", "items": { "type": "string" } },
    "notifications_sent": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["success", "recorded_absences", "notifications_sent"]
}
```

## 3) `get_account_status@v1`
### Input
```json
{
  "$id": "vujy.get_account_status.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "family_id": { "type": "string", "minLength": 1 }
  },
  "required": ["family_id"]
}
```

### Output
```json
{
  "$id": "vujy.get_account_status.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "pending_balance": { "type": "number", "minimum": 0 },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "id": { "type": "string" },
          "concept": { "type": "string" },
          "amount": { "type": "number", "minimum": 0 },
          "due_date": { "type": "string", "format": "date" },
          "status": { "type": "string", "enum": ["pending", "paid", "overdue"] }
        },
        "required": ["id", "concept", "amount", "due_date", "status"]
      }
    },
    "payment_history": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "date": { "type": "string", "format": "date" },
          "amount": { "type": "number", "minimum": 0 },
          "concept": { "type": "string" },
          "receipt_id": { "type": "string" }
        },
        "required": ["date", "amount", "concept"]
      }
    }
  },
  "required": ["pending_balance", "items", "payment_history"]
}
```

## 4) `process_payment@v1`
### Input
```json
{
  "$id": "vujy.process_payment.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "family_id": { "type": "string", "minLength": 1 },
    "items_ids": { "type": "array", "minItems": 1, "items": { "type": "string" } },
    "payment_method": { "type": "string", "enum": ["saved_card", "new_method"], "default": "saved_card" },
    "explicit_confirmation": { "type": "boolean", "const": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["family_id", "items_ids", "explicit_confirmation", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.process_payment.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "transaction_id": { "type": "string" },
    "total_amount": { "type": "number", "minimum": 0 },
    "receipt_url": { "type": "string", "format": "uri" },
    "timestamp": { "type": "string", "format": "date-time" }
  },
  "required": ["success", "transaction_id", "total_amount", "timestamp"]
}
```

## 5) `take_attendance@v1`
### Input
```json
{
  "$id": "vujy.take_attendance.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "grade_id": { "type": "string" },
    "date": { "type": "string", "format": "date" },
    "attendance_entries": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "student_id": { "type": "string" },
          "status": { "type": "string", "enum": ["present", "absent", "late"] },
          "note": { "type": "string" }
        },
        "required": ["student_id", "status"]
      }
    },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["grade_id", "date", "attendance_entries", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.take_attendance.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "present_count": { "type": "integer", "minimum": 0 },
    "absent_count": { "type": "integer", "minimum": 0 },
    "notifications_sent": { "type": "integer", "minimum": 0 }
  },
  "required": ["success", "present_count", "absent_count", "notifications_sent"]
}
```

## 6) `record_grade_batch@v1`
### Input
```json
{
  "$id": "vujy.record_grade_batch.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "grade_id": { "type": "string" },
    "subject": { "type": "string" },
    "evaluation_type": { "type": "string", "enum": ["written_exam", "oral", "practical_work", "project", "participation"] },
    "date": { "type": "string", "format": "date" },
    "grades": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "student_id": { "type": "string" },
          "grade": { "type": "number", "minimum": 1, "maximum": 10 },
          "comment": { "type": "string" }
        },
        "required": ["student_id", "grade"]
      }
    },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["grade_id", "subject", "evaluation_type", "date", "grades", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.record_grade_batch.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "grades_recorded": { "type": "integer", "minimum": 0 },
    "alerts": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["success", "grades_recorded", "alerts"]
}
```

## 7) `send_announcement@v1`
### Input
```json
{
  "$id": "vujy.send_announcement.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "title": { "type": "string", "minLength": 3 },
    "body": { "type": "string", "minLength": 5 },
    "recipients": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "grade_ids": { "type": "array", "items": { "type": "string" } },
        "family_ids": { "type": "array", "items": { "type": "string" } },
        "all": { "type": "boolean" }
      }
    },
    "priority": { "type": "string", "enum": ["normal", "urgent"], "default": "normal" },
    "channels": { "type": "array", "items": { "type": "string", "enum": ["app", "whatsapp", "email"] }, "default": ["app"] },
    "explicit_confirmation": { "type": "boolean", "const": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["title", "body", "recipients", "explicit_confirmation", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.send_announcement.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "announcement_id": { "type": "string" },
    "recipients_count": { "type": "integer", "minimum": 0 },
    "channels_used": { "type": "array", "items": { "type": "string" } },
    "timestamp": { "type": "string", "format": "date-time" }
  },
  "required": ["announcement_id", "recipients_count", "channels_used", "timestamp"]
}
```

## 8) `record_pedagogical_note@v1`
### Input
```json
{
  "$id": "vujy.record_pedagogical_note.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string" },
    "text": { "type": "string", "minLength": 3 },
    "area": { "type": "string", "enum": ["cognitive", "socioemotional", "motor_skills", "language", "math", "science", "language_arts", "general"] },
    "date": { "type": "string", "format": "date" },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["student_id", "text", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.record_pedagogical_note.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "note_id": { "type": "string" },
    "student": { "type": "string" },
    "date": { "type": "string", "format": "date" },
    "report_preview_updated": { "type": "boolean" }
  },
  "required": ["note_id", "date", "report_preview_updated"]
}
```

## 9) `get_delinquency_dashboard@v1`
### Input
```json
{
  "$id": "vujy.get_delinquency_dashboard.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "school_id": { "type": "string" },
    "segmentation": { "type": "string", "enum": ["summary", "by_family", "by_grade"], "default": "summary" }
  },
  "required": ["school_id"]
}
```

### Output
```json
{
  "$id": "vujy.get_delinquency_dashboard.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "up_to_date": {
      "type": "object",
      "properties": { "count": { "type": "integer" }, "percentage": { "type": "number" } },
      "required": ["count", "percentage"]
    },
    "debt_1_month": {
      "type": "object",
      "properties": { "count": { "type": "integer" }, "total_amount": { "type": "number" }, "families": { "type": "array", "items": { "type": "string" } } },
      "required": ["count", "total_amount", "families"]
    },
    "debt_2_plus_months": {
      "type": "object",
      "properties": { "count": { "type": "integer" }, "total_amount": { "type": "number" }, "families": { "type": "array", "items": { "type": "string" } } },
      "required": ["count", "total_amount", "families"]
    },
    "total_overdue": { "type": "number", "minimum": 0 }
  },
  "required": ["up_to_date", "debt_1_month", "debt_2_plus_months", "total_overdue"]
}
```

## 10) `get_dropout_risk@v1`
### Input
```json
{
  "$id": "vujy.get_dropout_risk.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "school_id": { "type": "string" },
    "risk_threshold": { "type": "string", "enum": ["high", "medium", "all"], "default": "high" }
  },
  "required": ["school_id"]
}
```

### Output
```json
{
  "$id": "vujy.get_dropout_risk.output.v1",
  "type": "array",
  "items": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "family_id": { "type": "string" },
      "family_name": { "type": "string" },
      "risk_index": { "type": "number", "minimum": 0, "maximum": 100 },
      "factors": { "type": "array", "items": { "type": "string" } },
      "recommendation": { "type": "string" }
    },
    "required": ["family_id", "risk_index", "factors"]
  }
}
```

## 11) `simulate_financial_scenario@v1`
### Input
```json
{
  "$id": "vujy.simulate_financial_scenario.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "school_id": { "type": "string" },
    "tuition_change_pct": { "type": "number", "minimum": -100, "maximum": 500 },
    "student_count_change": { "type": "integer" },
    "additional_concept": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "name": { "type": "string" },
        "amount": { "type": "number" }
      },
      "required": ["name", "amount"]
    }
  },
  "required": ["school_id"]
}
```

### Output
```json
{
  "$id": "vujy.simulate_financial_scenario.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "current_revenue": { "type": "number" },
    "projected_revenue": { "type": "number" },
    "difference": { "type": "number" },
    "break_even_point": { "type": "number" },
    "detail": { "type": "string" }
  },
  "required": ["current_revenue", "projected_revenue", "difference", "break_even_point", "detail"]
}
```

## 12) `get_tasks@v1`
### Input
```json
{
  "$id": "vujy.get_tasks.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string" },
    "grade_id": { "type": "string" },
    "only_pending": { "type": "boolean", "default": true },
    "subject": { "type": "string" }
  },
  "anyOf": [
    { "required": ["student_id"] },
    { "required": ["grade_id"] }
  ]
}
```

### Output
```json
{
  "$id": "vujy.get_tasks.output.v1",
  "type": "array",
  "items": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "id": { "type": "string" },
      "title": { "type": "string" },
      "description": { "type": "string" },
      "subject": { "type": "string" },
      "assigned_date": { "type": "string", "format": "date" },
      "due_date": { "type": "string", "format": "date" },
      "status": { "type": "string", "enum": ["pending", "submitted", "late"] },
      "attachments": { "type": "array", "items": { "type": "string", "format": "uri" } }
    },
    "required": ["id", "title", "due_date", "status"]
  }
}
```

## 13) `create_collection_campaign@v1`



### Input
```json
{
  "$id": "vujy.create_collection_campaign.input.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "school_id": { "type": "string" },
    "segment": { "type": "string", "enum": ["debt_1_month", "debt_2_plus_months", "custom_ids"] },
    "family_ids": { "type": "array", "items": { "type": "string" } },
    "channels": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string", "enum": ["app", "whatsapp", "email"] }
    },
    "message_draft": { "type": "string", "minLength": 5 },
    "require_preview": { "type": "boolean", "const": true },
    "explicit_confirmation": { "type": "boolean", "const": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": [
    "school_id",
    "segment",
    "channels",
    "message_draft",
    "require_preview",
    "explicit_confirmation",
    "idempotency_key"
  ],
  "allOf": [
    {
      "if": { "properties": { "segment": { "const": "custom_ids" } } },
      "then": { "required": ["family_ids"] }
    }
  ]
}
```

### Output
```json
{
  "$id": "vujy.create_collection_campaign.output.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "campaign_id": { "type": "string" },
    "estimated_recipients": { "type": "integer", "minimum": 0 },
    "message_preview": { "type": "string" },
    "delivery_risk": { "type": "string", "enum": ["low", "medium", "high"] },
    "status": { "type": "string", "enum": ["draft", "ready", "blocked"] }
  },
  "required": ["campaign_id", "estimated_recipients", "message_preview", "delivery_risk", "status"]
}
```

---

## Críticas MVP faltantes (v2.0)

## 14) `escalate_wellbeing@v1`

### Input
```json
{
  "$id": "vujy.escalate_wellbeing.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string", "minLength": 1 },
    "signal_type": {
      "type": "string",
      "enum": [
        "self_reported_distress",
        "teacher_observation",
        "behavioral_pattern",
        "peer_report"
      ]
    },
    "severity": {
      "type": "string",
      "enum": ["low", "medium", "high", "critical"]
    },
    "signal_description": {
      "type": "string",
      "minLength": 5,
      "maxLength": 2000
    },
    "escalate_to_roles": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string",
        "enum": ["coordinator", "director", "counselor", "admin"]
      }
    },
    "notify_guardian": {
      "type": "boolean",
      "default": false,
      "description": "Solo activar en casos de baja severidad donde la institución lo autorice"
    },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["student_id", "signal_type", "severity", "signal_description", "escalate_to_roles", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.escalate_wellbeing.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "alert_id": { "type": "string" },
    "student_id": { "type": "string" },
    "escalated_at": { "type": "string", "format": "date-time" },
    "notified_roles": {
      "type": "array",
      "items": { "type": "string" }
    },
    "protocol_reference": {
      "type": "string",
      "description": "Referencia al protocolo institucional activado"
    },
    "guardian_notified": { "type": "boolean" },
    "requires_human_followup": {
      "type": "boolean",
      "const": true,
      "description": "Siempre true — este CDU nunca se resuelve de forma autónoma por el asistente"
    }
  },
  "required": ["alert_id", "student_id", "escalated_at", "notified_roles", "guardian_notified", "requires_human_followup"]
}
```

---

## 15) `confirm_announcement_read@v1`

### Input
```json
{
  "$id": "vujy.confirm_announcement_read.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "announcement_id": { "type": "string", "minLength": 1 },
    "guardian_id": { "type": "string", "minLength": 1 },
    "channel": {
      "type": "string",
      "enum": ["app", "web", "whatsapp"],
      "description": "Canal desde donde se confirmó la lectura"
    },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["announcement_id", "guardian_id", "channel", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.confirm_announcement_read.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "announcement_id": { "type": "string" },
    "guardian_id": { "type": "string" },
    "read_at": { "type": "string", "format": "date-time" },
    "was_already_read": {
      "type": "boolean",
      "description": "true si idempotency aplicó — ya estaba registrada la lectura"
    }
  },
  "required": ["success", "announcement_id", "guardian_id", "read_at", "was_already_read"]
}
```

---

## 16) `create_payment_plan@v1`

### Input
```json
{
  "$id": "vujy.create_payment_plan.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "family_id": { "type": "string", "minLength": 1 },
    "overdue_item_ids": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string" },
      "description": "IDs de las cuotas vencidas a incluir en el plan"
    },
    "installments": {
      "type": "integer",
      "minimum": 2,
      "maximum": 12,
      "description": "Cantidad de cuotas del plan"
    },
    "first_installment_date": {
      "type": "string",
      "format": "date",
      "description": "Fecha del primer vencimiento del plan"
    },
    "interest_rate_pct": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Tasa de interés mensual aplicada. 0 para plan sin interés."
    },
    "notes": { "type": "string", "maxLength": 500 },
    "explicit_confirmation": { "type": "boolean", "const": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["family_id", "overdue_item_ids", "installments", "first_installment_date", "interest_rate_pct", "explicit_confirmation", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.create_payment_plan.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "plan_id": { "type": "string" },
    "family_id": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["active"],
      "description": "El plan queda activo inmediatamente tras la confirmación"
    },
    "total_amount": { "type": "number", "minimum": 0 },
    "installments": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "installment_number": { "type": "integer", "minimum": 1 },
          "due_date": { "type": "string", "format": "date" },
          "amount": { "type": "number", "minimum": 0 }
        },
        "required": ["installment_number", "due_date", "amount"]
      }
    },
    "automatic_reminders_paused": {
      "type": "boolean",
      "const": true,
      "description": "Siempre true — los recordatorios automáticos de deuda se suspenden mientras el plan esté vigente"
    },
    "created_at": { "type": "string", "format": "date-time" }
  },
  "required": ["plan_id", "family_id", "status", "total_amount", "installments", "automatic_reminders_paused", "created_at"]
}
```

---

## Tools v2.0 — Nuevas (CDUs añadidos)

## 17) `revoke_guardian_access@v1`

### Input
```json
{
  "$id": "vujy.revoke_guardian_access.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "guardian_id": { "type": "string", "minLength": 1 },
    "reason": {
      "type": "string",
      "enum": ["legal_request", "custody_dispute", "security_incident", "school_policy", "guardian_request", "other"]
    },
    "reason_notes": { "type": "string", "maxLength": 500 },
    "notify_guardian": { "type": "boolean", "default": false },
    "explicit_confirmation": { "type": "boolean", "const": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["guardian_id", "reason", "explicit_confirmation", "idempotency_key"],
  "if": { "properties": { "reason": { "const": "other" } } },
  "then": { "required": ["reason_notes"] }
}
```

### Output
```json
{
  "$id": "vujy.revoke_guardian_access.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "guardian_id": { "type": "string" },
    "revoked_at": { "type": "string", "format": "date-time" },
    "channels_blocked": {
      "type": "array",
      "items": { "type": "string", "enum": ["app", "web", "whatsapp"] }
    },
    "audit_event_id": { "type": "string" },
    "reactivation_requires": { "type": "string", "const": "manual_admin_action" }
  },
  "required": ["success", "guardian_id", "revoked_at", "channels_blocked", "audit_event_id", "reactivation_requires"]
}
```

---

## 18) `search_guardian@v1`

### Input
```json
{
  "$id": "vujy.search_guardian.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "query": { "type": "string", "minLength": 2, "maxLength": 100 },
    "query_type": { "type": "string", "enum": ["name", "dni", "email", "phone"], "default": "name" },
    "include_inactive": { "type": "boolean", "default": false }
  },
  "required": ["query"]
}
```

### Output
```json
{
  "$id": "vujy.search_guardian.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "results": {
      "type": "array",
      "maxItems": 10,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "guardian_id": { "type": "string" },
          "full_name": { "type": "string" },
          "dni": { "type": "string" },
          "access_status": { "type": "string", "enum": ["active", "revoked", "pending_verification"] },
          "linked_students": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "student_id": { "type": "string" },
                "student_name": { "type": "string" },
                "grade": { "type": "string" }
              },
              "required": ["student_id", "student_name"]
            }
          }
        },
        "required": ["guardian_id", "full_name", "access_status", "linked_students"]
      }
    },
    "total_found": { "type": "integer", "minimum": 0 },
    "truncated": { "type": "boolean" }
  },
  "required": ["results", "total_found", "truncated"]
}
```

---

## 19) `register_consent@v1`

### Input
```json
{
  "$id": "vujy.register_consent.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "guardian_id": { "type": "string", "minLength": 1 },
    "document_version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "ip_address": { "type": "string" },
    "channel": { "type": "string", "enum": ["app", "web", "whatsapp", "in_person"] },
    "consent_options": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "terms_accepted": { "type": "boolean", "const": true },
        "privacy_policy_accepted": { "type": "boolean", "const": true },
        "whatsapp_communications": { "type": "boolean" },
        "educational_data_use": { "type": "boolean" },
        "photo_publication": { "type": "boolean" }
      },
      "required": ["terms_accepted", "privacy_policy_accepted"]
    },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["guardian_id", "document_version", "channel", "consent_options", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.register_consent.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "consent_id": { "type": "string" },
    "guardian_id": { "type": "string" },
    "document_version": { "type": "string" },
    "registered_at": { "type": "string", "format": "date-time" },
    "status": { "type": "string", "enum": ["active", "superseded"] },
    "whatsapp_optin": { "type": "boolean" }
  },
  "required": ["consent_id", "guardian_id", "document_version", "registered_at", "status", "whatsapp_optin"]
}
```

---

## 20) `get_consent_status@v1`

### Input
```json
{
  "$id": "vujy.get_consent_status.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "guardian_id": { "type": "string", "minLength": 1 },
    "required_document_version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" }
  },
  "required": ["guardian_id"]
}
```

### Output
```json
{
  "$id": "vujy.get_consent_status.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "has_active_consent": { "type": "boolean" },
    "guardian_id": { "type": "string" },
    "document_version": { "type": ["string", "null"] },
    "accepted_at": { "type": ["string", "null"], "format": "date-time" },
    "consent_options": {
      "type": ["object", "null"],
      "additionalProperties": false,
      "properties": {
        "whatsapp_communications": { "type": "boolean" },
        "educational_data_use": { "type": "boolean" },
        "photo_publication": { "type": "boolean" }
      }
    },
    "requires_renewal": { "type": "boolean" }
  },
  "required": ["has_active_consent", "guardian_id", "document_version", "accepted_at", "requires_renewal"]
}
```

---

## 21) `export_user_data@v1`

### Input
```json
{
  "$id": "vujy.export_user_data.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "subject_guardian_id": { "type": "string", "minLength": 1 },
    "include_sections": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string",
        "enum": ["profile", "linked_students", "payment_history", "communications", "consents", "conversations", "access_log"]
      },
      "default": ["profile", "linked_students", "payment_history", "communications", "consents"]
    },
    "format": { "type": "string", "enum": ["json", "zip"], "default": "json" },
    "arco_request_reference": { "type": "string" },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["subject_guardian_id", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.export_user_data.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "status": { "type": "string", "enum": ["ready", "processing"] },
    "export_id": { "type": "string" },
    "download_url": { "type": ["string", "null"], "format": "uri" },
    "job_id": { "type": ["string", "null"] },
    "estimated_ready_at": { "type": ["string", "null"], "format": "date-time" },
    "sections_included": { "type": "array", "items": { "type": "string" } },
    "generated_at": { "type": "string", "format": "date-time" }
  },
  "required": ["status", "export_id", "download_url", "job_id", "sections_included", "generated_at"]
}
```

---

## 22) `request_data_rectification@v1`

### Input
```json
{
  "$id": "vujy.request_data_rectification.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "subject_guardian_id": { "type": "string", "minLength": 1 },
    "fields_to_rectify": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "field_name": { "type": "string" },
          "current_value": { "type": "string" },
          "requested_value": { "type": "string" },
          "supporting_document_url": { "type": "string", "format": "uri" }
        },
        "required": ["field_name", "requested_value"]
      }
    },
    "requester_note": { "type": "string", "maxLength": 1000 },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["subject_guardian_id", "fields_to_rectify", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.request_data_rectification.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "ticket_id": { "type": "string" },
    "status": { "type": "string", "enum": ["received", "duplicate"] },
    "created_at": { "type": "string", "format": "date-time" },
    "sla_response_deadline": { "type": "string", "format": "date-time" },
    "assigned_to_role": { "type": "string", "enum": ["admin", "secretaria"] },
    "tracking_url": { "type": ["string", "null"], "format": "uri" }
  },
  "required": ["ticket_id", "status", "created_at", "sla_response_deadline", "assigned_to_role"]
}
```

---

## 23) `request_data_deletion@v1`

### Input
```json
{
  "$id": "vujy.request_data_deletion.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "subject_guardian_id": { "type": "string", "minLength": 1 },
    "scope": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string",
        "enum": ["profile_data", "conversation_history", "communications", "access_log"]
      }
    },
    "deletion_reason": {
      "type": "string",
      "enum": ["arco_right", "no_longer_enrolled", "data_minimization", "other"]
    },
    "requester_note": { "type": "string", "maxLength": 1000 },
    "explicit_confirmation": { "type": "boolean", "const": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["subject_guardian_id", "scope", "deletion_reason", "explicit_confirmation", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.request_data_deletion.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "request_id": { "type": "string" },
    "status": { "type": "string", "enum": ["pending_review", "duplicate"] },
    "created_at": { "type": "string", "format": "date-time" },
    "sla_response_deadline": { "type": "string", "format": "date-time" },
    "scope_requested": { "type": "array", "items": { "type": "string" } },
    "excluded_data_note": { "type": "string" },
    "admin_notified": { "type": "boolean" }
  },
  "required": ["request_id", "status", "created_at", "sla_response_deadline", "scope_requested", "excluded_data_note", "admin_notified"]
}
```

---

## 24) `get_reenrollment_status@v1`

### Input
```json
{
  "$id": "vujy.get_reenrollment_status.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "school_id": { "type": "string", "minLength": 1 },
    "cycle": { "type": "string", "pattern": "^\\d{4}$" },
    "segmentation": { "type": "string", "enum": ["summary", "by_grade", "by_risk"], "default": "summary" },
    "risk_filter": { "type": "string", "enum": ["all", "high_risk", "no_response"], "default": "all" }
  },
  "required": ["school_id", "cycle"]
}
```

### Output
```json
{
  "$id": "vujy.get_reenrollment_status.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "cycle": { "type": "string" },
    "summary": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "total_students": { "type": "integer", "minimum": 0 },
        "confirmed": { "type": "integer", "minimum": 0 },
        "pending": { "type": "integer", "minimum": 0 },
        "no_response": { "type": "integer", "minimum": 0 },
        "withdrawn": { "type": "integer", "minimum": 0 },
        "conversion_rate_pct": { "type": "number", "minimum": 0, "maximum": 100 }
      },
      "required": ["total_students", "confirmed", "pending", "no_response", "withdrawn", "conversion_rate_pct"]
    },
    "segments": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "segment_label": { "type": "string" },
          "count": { "type": "integer", "minimum": 0 },
          "risk_level": { "type": "string", "enum": ["low", "medium", "high"] },
          "family_ids": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["segment_label", "count", "risk_level"]
      }
    },
    "last_updated_at": { "type": "string", "format": "date-time" }
  },
  "required": ["cycle", "summary", "segments", "last_updated_at"]
}
```

---

## 25) `create_reenrollment_campaign@v1`

### Input
```json
{
  "$id": "vujy.create_reenrollment_campaign.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "school_id": { "type": "string", "minLength": 1 },
    "cycle": { "type": "string", "pattern": "^\\d{4}$" },
    "target_segment": {
      "type": "string",
      "enum": ["pending", "no_response", "high_risk", "custom_ids"]
    },
    "family_ids": { "type": "array", "items": { "type": "string" } },
    "message_template": {
      "type": "string",
      "enum": ["friendly_reminder", "urgency_notice", "personalized_offer"]
    },
    "channels": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string", "enum": ["app", "whatsapp", "email"] }
    },
    "deadline_date": { "type": "string", "format": "date" },
    "require_preview": { "type": "boolean", "const": true },
    "explicit_confirmation": { "type": "boolean", "const": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["school_id", "cycle", "target_segment", "message_template", "channels", "require_preview", "explicit_confirmation", "idempotency_key"],
  "if": { "properties": { "target_segment": { "const": "custom_ids" } } },
  "then": { "required": ["family_ids"] }
}
```

### Output
```json
{
  "$id": "vujy.create_reenrollment_campaign.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "campaign_id": { "type": "string" },
    "status": { "type": "string", "enum": ["draft", "ready", "blocked"] },
    "estimated_recipients": { "type": "integer", "minimum": 0 },
    "blocked_recipients": { "type": "integer", "minimum": 0 },
    "message_preview": { "type": "string" },
    "scheduled_at": { "type": ["string", "null"], "format": "date-time" },
    "delivery_risk": { "type": "string", "enum": ["low", "medium", "high"] }
  },
  "required": ["campaign_id", "status", "estimated_recipients", "blocked_recipients", "message_preview", "delivery_risk"]
}
```

---

## 26) `get_daily_journal@v1`

### Input
```json
{
  "$id": "vujy.get_daily_journal.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string", "minLength": 1 },
    "grade_id": { "type": "string", "minLength": 1 },
    "date": { "type": "string", "format": "date" }
  },
  "anyOf": [
    { "required": ["student_id"] },
    { "required": ["grade_id"] }
  ]
}
```

### Output
```json
{
  "$id": "vujy.get_daily_journal.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "date": { "type": "string", "format": "date" },
    "grade_id": { "type": "string" },
    "published": { "type": "boolean" },
    "published_at": { "type": ["string", "null"], "format": "date-time" },
    "activities": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "time_slot": { "type": "string" },
          "subject": { "type": "string" },
          "description": { "type": "string" },
          "photo_urls": { "type": "array", "items": { "type": "string", "format": "uri" } }
        },
        "required": ["description"]
      }
    },
    "emotional_checkin": {
      "type": ["object", "null"],
      "additionalProperties": false,
      "properties": {
        "overall_mood": { "type": "string", "enum": ["very_positive", "positive", "neutral", "needs_attention"] },
        "notes": { "type": "string" }
      },
      "required": ["overall_mood"]
    },
    "teacher_narrative": { "type": ["string", "null"] }
  },
  "required": ["date", "grade_id", "published", "published_at", "activities"]
}
```

---

## 27) `publish_daily_journal@v1`

### Input
```json
{
  "$id": "vujy.publish_daily_journal.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "grade_id": { "type": "string", "minLength": 1 },
    "date": { "type": "string", "format": "date" },
    "activities": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "time_slot": { "type": "string" },
          "subject": { "type": "string" },
          "description": { "type": "string", "minLength": 5 },
          "photo_upload_ids": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["description"]
      }
    },
    "emotional_checkin": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "overall_mood": { "type": "string", "enum": ["very_positive", "positive", "neutral", "needs_attention"] },
        "notes": { "type": "string" }
      },
      "required": ["overall_mood"]
    },
    "teacher_narrative": { "type": "string", "maxLength": 2000 },
    "notify_guardians": { "type": "boolean", "default": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["grade_id", "date", "activities", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.publish_daily_journal.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "journal_id": { "type": "string" },
    "published_at": { "type": "string", "format": "date-time" },
    "notifications_sent": { "type": "integer", "minimum": 0 },
    "is_update": { "type": "boolean" }
  },
  "required": ["success", "journal_id", "published_at", "notifications_sent", "is_update"]
}
```

---

## 28) `get_teacher_portfolio@v1`

### Input
```json
{
  "$id": "vujy.get_teacher_portfolio.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "teacher_id": { "type": "string", "minLength": 1 },
    "period": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "from": { "type": "string", "format": "date" },
        "to": { "type": "string", "format": "date" }
      },
      "required": ["from", "to"]
    },
    "view_mode": { "type": "string", "enum": ["internal", "external"], "default": "internal" }
  },
  "required": ["teacher_id", "period"]
}
```

### Output
```json
{
  "$id": "vujy.get_teacher_portfolio.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "teacher_id": { "type": "string" },
    "teacher_name": { "type": "string" },
    "period": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "from": { "type": "string", "format": "date" },
        "to": { "type": "string", "format": "date" }
      },
      "required": ["from", "to"]
    },
    "activities_published": { "type": "integer", "minimum": 0 },
    "reports_generated": { "type": "integer", "minimum": 0 },
    "observations_recorded": { "type": "integer", "minimum": 0 },
    "institutional_metrics": {
      "type": ["object", "null"],
      "additionalProperties": false,
      "properties": {
        "avg_attendance_taken_minutes": { "type": "number" },
        "announcement_read_rate_pct": { "type": "number", "minimum": 0, "maximum": 100 },
        "communication_response_rate_pct": { "type": "number", "minimum": 0, "maximum": 100 }
      }
    },
    "highlights": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "type": { "type": "string", "enum": ["activity", "report", "observation", "announcement"] },
          "title": { "type": "string" },
          "date": { "type": "string", "format": "date" },
          "description": { "type": "string" }
        },
        "required": ["type", "title", "date"]
      }
    }
  },
  "required": ["teacher_id", "teacher_name", "period", "activities_published", "reports_generated", "observations_recorded", "highlights"]
}
```

---

## 29) `generate_teacher_portfolio_pdf@v1`

### Input
```json
{
  "$id": "vujy.generate_teacher_portfolio_pdf.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "teacher_id": { "type": "string", "minLength": 1 },
    "period": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "from": { "type": "string", "format": "date" },
        "to": { "type": "string", "format": "date" }
      },
      "required": ["from", "to"]
    },
    "mode": { "type": "string", "enum": ["internal", "external"] },
    "include_highlights_count": { "type": "integer", "minimum": 1, "maximum": 20, "default": 5 },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["teacher_id", "period", "mode", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.generate_teacher_portfolio_pdf.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "status": { "type": "string", "enum": ["ready", "processing"] },
    "pdf_url": { "type": ["string", "null"], "format": "uri" },
    "job_id": { "type": ["string", "null"] },
    "estimated_ready_at": { "type": ["string", "null"], "format": "date-time" },
    "generated_at": { "type": ["string", "null"], "format": "date-time" },
    "mode": { "type": "string", "enum": ["internal", "external"] }
  },
  "required": ["status", "pdf_url", "job_id", "mode"]
}
```

---

## 30) `activate_event_mode@v1`

### Input
```json
{
  "$id": "vujy.activate_event_mode.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "event_id": { "type": "string", "minLength": 1 },
    "correspondent_user_ids": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string" }
    },
    "photo_blocked": { "type": "boolean", "default": false },
    "active_window": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "start_at": { "type": "string", "format": "date-time" },
        "end_at": { "type": "string", "format": "date-time" }
      },
      "required": ["start_at", "end_at"]
    },
    "target_audience": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "grade_ids": { "type": "array", "items": { "type": "string" } },
        "all_school": { "type": "boolean" }
      }
    },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["event_id", "correspondent_user_ids", "photo_blocked", "active_window", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.activate_event_mode.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "event_id": { "type": "string" },
    "event_mode_id": { "type": "string" },
    "activated_at": { "type": "string", "format": "date-time" },
    "photo_blocked": { "type": "boolean" },
    "active_until": { "type": "string", "format": "date-time" },
    "correspondents_enabled": { "type": "integer", "minimum": 1 }
  },
  "required": ["success", "event_id", "event_mode_id", "activated_at", "photo_blocked", "active_until", "correspondents_enabled"]
}
```

---

## 31) `publish_event_update@v1`

### Input
```json
{
  "$id": "vujy.publish_event_update.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "event_id": { "type": "string", "minLength": 1 },
    "text": { "type": "string", "minLength": 1, "maxLength": 1000 },
    "photo_upload_ids": { "type": "array", "items": { "type": "string" } },
    "update_type": { "type": "string", "enum": ["text", "photo", "milestone"], "default": "text" },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["event_id", "text", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.publish_event_update.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "update_id": { "type": "string" },
    "published_at": { "type": "string", "format": "date-time" },
    "photo_blocked_warning": { "type": "boolean" },
    "recipients_notified": { "type": "integer", "minimum": 0 }
  },
  "required": ["success", "update_id", "published_at", "photo_blocked_warning", "recipients_notified"]
}
```

---

## 32) `generate_event_album@v1`

### Input
```json
{
  "$id": "vujy.generate_event_album.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "event_id": { "type": "string", "minLength": 1 },
    "include_text_updates": { "type": "boolean", "default": true },
    "share_with_families": { "type": "boolean", "default": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["event_id", "idempotency_key"]
}
```

---

## 33) `get_my_students@v1`

### Input
```json
{
  "$id": "vujy.get_my_students.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "page": { "type": "integer", "minimum": 1, "default": 1 },
    "page_size": { "type": "integer", "minimum": 1, "maximum": 50, "default": 20 }
  }
}
```

### Output
```json
{
  "$id": "vujy.get_my_students.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "students": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "student_id": { "type": "string" },
          "full_name": { "type": "string" },
          "grade": { "type": "string" },
          "section": { "type": "string" }
        },
        "required": ["student_id", "full_name", "grade"]
      }
    },
    "page": { "type": "integer", "minimum": 1 },
    "page_size": { "type": "integer", "minimum": 1 },
    "total": { "type": "integer", "minimum": 0 }
  },
  "required": ["students", "page", "page_size", "total"]
}
```

#### Example (CDU-PAD-011)
```json
{
  "page": 1,
  "page_size": 2,
  "total": 2,
  "students": [
    { "student_id": "stu_123", "full_name": "Ana Pérez", "grade": "4to", "section": "A" },
    { "student_id": "stu_456", "full_name": "Luis Gómez", "grade": "1ro", "section": "B" }
  ]
}
```

---

## 34) `get_grades@v1`

### Input
```json
{
  "$id": "vujy.get_grades.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string", "minLength": 1 },
    "term": { "type": ["string", "null"], "enum": ["Q1", "Q2", "Q3", "Q4", "FINAL", null] },
    "subject": { "type": ["string", "null"], "minLength": 1 },
    "page": { "type": "integer", "minimum": 1, "default": 1 },
    "page_size": { "type": "integer", "minimum": 1, "maximum": 100, "default": 50 }
  },
  "required": ["student_id"]
}
```

### Output
```json
{
  "$id": "vujy.get_grades.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "grades": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "grade_id": { "type": "string" },
          "subject": { "type": "string" },
          "score": { "type": "number" },
          "scale": { "type": "number" },
          "recorded_at": { "type": "string", "format": "date-time" },
          "term": { "type": ["string", "null"] },
          "comment": { "type": ["string", "null"], "maxLength": 500 }
        },
        "required": ["grade_id", "subject", "score", "recorded_at"]
      }
    },
    "page": { "type": "integer", "minimum": 1 },
    "page_size": { "type": "integer", "minimum": 1 },
    "total": { "type": "integer", "minimum": 0 }
  },
  "required": ["grades", "page", "page_size", "total"]
}
```

#### Example (CDU-PAD-008)
```json
{
  "page": 1,
  "page_size": 3,
  "total": 3,
  "grades": [
    { "grade_id": "g1", "subject": "Matemática", "score": 9, "scale": 10, "recorded_at": "2026-03-01T12:00:00Z", "term": "Q1" },
    { "grade_id": "g2", "subject": "Lengua", "score": 8, "scale": 10, "recorded_at": "2026-03-02T12:00:00Z", "term": "Q1" },
    { "grade_id": "g3", "subject": "Ciencias", "score": 7, "scale": 10, "recorded_at": "2026-03-03T12:00:00Z", "term": "Q1" }
  ]
}
```

---

## 35) `get_attendance@v1`

### Input
```json
{
  "$id": "vujy.get_attendance.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string", "minLength": 1 },
    "start_date": { "type": ["string", "null"], "format": "date" },
    "end_date": { "type": ["string", "null"], "format": "date" }
  },
  "required": ["student_id"]
}
```

### Output
```json
{
  "$id": "vujy.get_attendance.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "summary": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "present": { "type": "integer", "minimum": 0 },
        "absent": { "type": "integer", "minimum": 0 },
        "late": { "type": "integer", "minimum": 0 }
      },
      "required": ["present", "absent", "late"]
    },
    "records": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "date": { "type": "string", "format": "date" },
          "status": { "type": "string", "enum": ["present", "absent", "late"] },
          "justification": { "type": ["string", "null"], "maxLength": 500 }
        },
        "required": ["date", "status"]
      }
    }
  },
  "required": ["summary", "records"]
}
```

#### Example (CDU-PAD-009)
```json
{
  "summary": { "present": 45, "absent": 2, "late": 1 },
  "records": [
    { "date": "2026-02-28", "status": "absent", "justification": "Enfermedad" },
    { "date": "2026-03-04", "status": "late", "justification": null }
  ]
}
```

---

## 36) `get_calendar@v1`

### Input
```json
{
  "$id": "vujy.get_calendar.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": ["string", "null"], "minLength": 1 },
    "from": { "type": "string", "format": "date" },
    "to": { "type": "string", "format": "date" }
  },
  "required": ["from", "to"]
}
```

### Output
```json
{
  "$id": "vujy.get_calendar.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "events": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "event_id": { "type": "string" },
          "title": { "type": "string" },
          "start": { "type": "string", "format": "date-time" },
          "end": { "type": ["string", "null"], "format": "date-time" },
          "location": { "type": ["string", "null"] },
          "requires_action": { "type": "boolean", "default": false }
        },
        "required": ["event_id", "title", "start", "requires_action"]
      }
    }
  },
  "required": ["events"]
}
```

#### Example (CDU-PAD-002)
```json
{
  "events": [
    { "event_id": "ev1", "title": "Reunión padres 4to A", "start": "2026-03-10T18:00:00Z", "end": "2026-03-10T19:00:00Z", "location": "Sala Zoom", "requires_action": true },
    { "event_id": "ev2", "title": "Excursión Museo", "start": "2026-03-15T12:00:00Z", "end": null, "location": "Museo Ciencias", "requires_action": true }
  ]
}
```

---

## 37) `get_announcements@v1`

### Input
```json
{
  "$id": "vujy.get_announcements.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "audience": { "type": "string", "enum": ["guardian", "teacher", "admin", "student"] },
    "unread_only": { "type": "boolean", "default": false },
    "page": { "type": "integer", "minimum": 1, "default": 1 },
    "page_size": { "type": "integer", "minimum": 1, "maximum": 100, "default": 50 }
  },
  "required": ["audience"]
}
```

### Output
```json
{
  "$id": "vujy.get_announcements.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "announcements": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "announcement_id": { "type": "string" },
          "title": { "type": "string" },
          "body": { "type": "string" },
          "sent_at": { "type": "string", "format": "date-time" },
          "requires_confirmation": { "type": "boolean" },
          "read": { "type": "boolean" }
        },
        "required": ["announcement_id", "title", "body", "sent_at", "requires_confirmation", "read"]
      }
    },
    "page": { "type": "integer", "minimum": 1 },
    "page_size": { "type": "integer", "minimum": 1 },
    "total": { "type": "integer", "minimum": 0 }
  },
  "required": ["announcements", "page", "page_size", "total"]
}
```

#### Example (CDU-PAD-006)
```json
{
  "page": 1,
  "page_size": 2,
  "total": 2,
  "announcements": [
    { "announcement_id": "a1", "title": "Salida educativa", "body": "Confirmar asistencia antes del viernes.", "sent_at": "2026-03-05T12:00:00Z", "requires_confirmation": true, "read": false },
    { "announcement_id": "a2", "title": "Recordatorio uniforme", "body": "Llevar buzo institucional el lunes.", "sent_at": "2026-03-04T15:00:00Z", "requires_confirmation": false, "read": true }
  ]
}
```

---

## 38) `get_institutional_alerts@v1`

### Input
```json
{
  "$id": "vujy.get_institutional_alerts.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "severity": { "type": ["string", "null"], "enum": ["low", "medium", "high", "critical", null] },
    "only_unresolved": { "type": "boolean", "default": true }
  }
}
```

### Output
```json
{
  "$id": "vujy.get_institutional_alerts.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "alerts": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "alert_id": { "type": "string" },
          "title": { "type": "string" },
          "severity": { "type": "string", "enum": ["low", "medium", "high", "critical"] },
          "created_at": { "type": "string", "format": "date-time" },
          "resolved": { "type": "boolean" }
        },
        "required": ["alert_id", "title", "severity", "created_at", "resolved"]
      }
    }
  },
  "required": ["alerts"]
}
```

#### Example (CDU-ADM-007)
```json
{
  "alerts": [
    { "alert_id": "al1", "title": "Alerta morosidad >15%", "severity": "high", "created_at": "2026-03-03T10:00:00Z", "resolved": false },
    { "alert_id": "al2", "title": "Servidor WA throttling", "severity": "critical", "created_at": "2026-03-04T08:00:00Z", "resolved": true }
  ]
}
```

---

## 39) `generate_announcement_draft@v1`

### Input
```json
{
  "$id": "vujy.generate_announcement_draft.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "audience": { "type": "string", "enum": ["families", "teachers", "all_staff"] },
    "purpose": { "type": "string", "minLength": 5, "maxLength": 200 },
    "tone": { "type": ["string", "null"], "enum": ["formal", "friendly", "urgent", null], "default": "formal" },
    "channels": {
      "type": "array",
      "items": { "type": "string", "enum": ["app", "web", "whatsapp", "email"] },
      "minItems": 1
    },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["audience", "purpose", "channels", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.generate_announcement_draft.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "draft": { "type": "string" },
    "word_count": { "type": "integer", "minimum": 1 }
  },
  "required": ["draft", "word_count"]
}
```

#### Example (CDU-DOC-003)
```json
{
  "draft": "Estimadas familias, el viernes realizaremos una salida educativa al museo. Por favor confirmen asistencia antes del miércoles.",
  "word_count": 27
}
```

---

## 40) `generate_learning_activity@v1`

### Input
```json
{
  "$id": "vujy.generate_learning_activity.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "activity_type": { "type": "string", "enum": ["quiz", "worksheet", "project", "flashcards", "exam_simulation"] },
    "subject": { "type": "string", "minLength": 2 },
    "topic": { "type": "string", "minLength": 2 },
    "grade_level": { "type": "string", "minLength": 1 },
    "learning_objectives": {
      "type": "array",
      "items": { "type": "string", "minLength": 3 },
      "minItems": 1
    },
    "duration_minutes": { "type": ["integer", "null"], "minimum": 5 },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["activity_type", "subject", "topic", "grade_level", "learning_objectives", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.generate_learning_activity.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "status": { "type": "string", "enum": ["draft"] },
    "activity": { "type": "string" },
    "estimated_time_minutes": { "type": ["integer", "null"], "minimum": 5 }
  },
  "required": ["status", "activity"]
}
```

#### Example (CDU-DOC-007)
```json
{
  "status": "draft",
  "activity": "Quiz de 8 preguntas sobre fracciones para 5to grado. Incluye ejercicios de simplificación y equivalencia.",
  "estimated_time_minutes": 20
}
```

---

## 41) `generate_pedagogical_report@v1`

### Input
```json
{
  "$id": "vujy.generate_pedagogical_report.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string", "minLength": 1 },
    "period": { "type": "string", "minLength": 1 },
    "observations": {
      "type": "array",
      "items": { "type": "string", "minLength": 3 },
      "default": []
    },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["student_id", "period", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.generate_pedagogical_report.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "status": { "type": "string", "enum": ["draft"] },
    "summary": { "type": "string" },
    "strengths": { "type": "array", "items": { "type": "string" } },
    "improvements": { "type": "array", "items": { "type": "string" } },
    "next_steps": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["status", "summary", "strengths", "improvements", "next_steps"]
}
```

#### Example (CDU-DOC-006)
```json
{
  "status": "draft",
  "summary": "Ana consolidó lectura comprensiva, necesita reforzar división de fracciones.",
  "strengths": ["Participa activamente", "Entrega tareas a tiempo"],
  "improvements": ["Practicar división de fracciones", "Revisar acentuación"],
  "next_steps": ["3 sesiones de práctica guiada", "Enviar ejercicios de acentuación"]
}
```

---

## 42) `generate_study_plan@v1`

### Input
```json
{
  "$id": "vujy.generate_study_plan.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string", "minLength": 1 },
    "timeframe_days": { "type": "integer", "minimum": 1, "maximum": 60, "default": 7 },
    "subjects": {
      "type": "array",
      "items": { "type": "string", "minLength": 2 },
      "minItems": 1
    },
    "goals": {
      "type": "array",
      "items": { "type": "string", "minLength": 3 },
      "minItems": 1
    },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["student_id", "subjects", "goals", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.generate_study_plan.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "status": { "type": "string", "enum": ["draft"] },
    "plan": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "day": { "type": "integer", "minimum": 1 },
          "tasks": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["day", "tasks"]
      }
    }
  },
  "required": ["status", "plan"]
}
```

#### Example (CDU-ALU-010)
```json
{
  "status": "draft",
  "plan": [
    { "day": 1, "tasks": ["Lengua: lectura capítulo 3", "Matemática: 10 ejercicios de fracciones"] },
    { "day": 2, "tasks": ["Ciencias: mapa conceptual del ciclo del agua"] }
  ]
}
```

---

## 43) `confirm_reenrollment@v1`

### Input
```json
{
  "$id": "vujy.confirm_reenrollment.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "student_id": { "type": "string", "minLength": 1 },
    "cycle_year": { "type": "integer", "minimum": 2024 },
    "payment_plan_id": { "type": ["string", "null"] },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["student_id", "cycle_year", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.confirm_reenrollment.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "status": { "type": "string", "enum": ["confirmed"] },
    "reenrollment_id": { "type": "string" },
    "confirmed_at": { "type": "string", "format": "date-time" }
  },
  "required": ["status", "reenrollment_id", "confirmed_at"]
}
```

#### Example (CDU-PAD-007)
```json
{
  "status": "confirmed",
  "reenrollment_id": "reenr_789",
  "confirmed_at": "2026-03-05T14:00:00Z"
}
```

---

## 44) `sign_authorization@v1`

### Input
```json
{
  "$id": "vujy.sign_authorization.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "authorization_id": { "type": "string", "minLength": 1 },
    "student_id": { "type": "string", "minLength": 1 },
    "signature_method": { "type": "string", "enum": ["tap", "otp", "digital_signature"], "default": "otp" },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["authorization_id", "student_id", "signature_method", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.sign_authorization.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "status": { "type": "string", "enum": ["signed"] },
    "signed_at": { "type": "string", "format": "date-time" },
    "receipt_id": { "type": ["string", "null"] }
  },
  "required": ["status", "signed_at", "receipt_id"]
}
```

#### Example (CDU-PAD-005)
```json
{
  "status": "signed",
  "signed_at": "2026-03-05T12:30:00Z",
  "receipt_id": "rec_456"
}
```

---

## 45) `log_security_action@v1`

### Input
```json
{
  "$id": "vujy.log_security_action.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "action": { "type": "string", "minLength": 1 },
    "actor_user_id": { "type": ["string", "null"] },
    "target_type": { "type": ["string", "null"] },
    "target_id": { "type": ["string", "null"] },
    "request_id": { "type": ["string", "null"] },
    "metadata": { "type": "object", "additionalProperties": true },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["action", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.log_security_action.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "audit_event_id": { "type": "string" },
    "logged_at": { "type": "string", "format": "date-time" },
    "action": { "type": "string" },
    "target_type": { "type": ["string", "null"] },
    "target_id": { "type": ["string", "null"] },
    "result_status": { "type": "string", "enum": ["success", "failure"] }
  },
  "required": ["success", "audit_event_id", "logged_at", "action", "result_status"]
}
```

---

## 46) `register_data_opposition@v1`

### Input
```json
{
  "$id": "vujy.register_data_opposition.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "subject_guardian_id": { "type": "string", "minLength": 1 },
    "opposition_scope": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string" }
    },
    "opposition_reason": { "type": "string", "minLength": 1 },
    "notes": { "type": "string", "maxLength": 1000 },
    "idempotency_key": { "type": "string", "minLength": 8 },
    "requester_note": { "type": "string", "maxLength": 1000 }
  },
  "required": ["subject_guardian_id", "opposition_scope", "opposition_reason", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.register_data_opposition.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "request_id": { "type": "string" },
    "status": { "type": "string", "enum": ["received", "duplicate"] },
    "created_at": { "type": "string", "format": "date-time" },
    "sla_response_deadline": { "type": "string", "format": "date-time" },
    "assigned_to_role": { "type": "string", "enum": ["admin", "secretary"] },
    "tracking_url": { "type": ["string", "null"], "format": "uri" },
    "request_type": { "type": "string", "const": "opposition" }
  },
  "required": ["request_id", "status", "created_at", "sla_response_deadline", "assigned_to_role", "request_type"]
}
```

---

## 47) `detect_teacher_milestone@v1`

### Input
```json
{
  "$id": "vujy.detect_teacher_milestone.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "period_start": { "type": "string", "format": "date" },
    "period_end": { "type": "string", "format": "date" },
    "course_ids": { "type": "array", "items": { "type": "string" } },
    "min_confidence": { "type": "number", "minimum": 0, "maximum": 1, "default": 0.7 },
    "run_id": { "type": ["string", "null"] },
    "idempotency_key": { "type": "string", "minLength": 8 }
  },
  "required": ["idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.detect_teacher_milestone.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "run_id": { "type": "string" },
    "execution_at": { "type": "string", "format": "date-time" },
    "milestones_detected": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "teacher_id": { "type": "string" },
          "course_id": { "type": ["string", "null"] },
          "milestone_type": { "type": "string" },
          "description": { "type": "string" },
          "confidence_score": { "type": "number", "minimum": 0, "maximum": 1 },
          "metric_context": { "type": "object", "additionalProperties": true }
        },
        "required": ["teacher_id", "milestone_type", "description", "confidence_score", "metric_context"]
      }
    },
    "scan_scope": { "type": "string" },
    "next_run_at": { "type": ["string", "null"], "format": "date-time" }
  },
  "required": ["run_id", "execution_at", "milestones_detected"]
}
```

---

## 48) `record_portfolio_milestone@v1`

### Input
```json
{
  "$id": "vujy.record_portfolio_milestone.input.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "teacher_id": { "type": "string", "minLength": 1 },
    "course_id": { "type": ["string", "null"] },
    "milestone_type": { "type": "string", "minLength": 1 },
    "description": { "type": "string", "minLength": 1, "maxLength": 500 },
    "metric_context": { "type": "object", "additionalProperties": true },
    "detected_at": { "type": "string", "format": "date-time" },
    "idempotency_key": { "type": "string", "minLength": 8 },
    "notify_teacher": { "type": "boolean", "default": true }
  },
  "required": ["teacher_id", "milestone_type", "description", "idempotency_key"]
}
```

### Output
```json
{
  "$id": "vujy.record_portfolio_milestone.output.v1",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "success": { "type": "boolean" },
    "milestone_id": { "type": "string" },
    "recorded_at": { "type": "string", "format": "date-time" },
    "teacher_id": { "type": "string" },
    "notified_guardian": { "type": "boolean" },
    "notified_teacher": { "type": "boolean" }
  },
  "required": ["success", "milestone_id", "recorded_at", "teacher_id"]
}
```
