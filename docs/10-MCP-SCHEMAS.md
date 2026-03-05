# Vujy — MCP JSON Schemas (MVP v1)

Alcance de este documento:
- Esquemas completos de input/output para el set MVP (Top 12 CDU + `create_collection_campaign@v1`).
- Canonical-only: no legacy aliases.

Convenciones:
- Standard: JSON Schema Draft 2020-12.
- English-only for technical artifacts: code, tool names, JSON keys, enums, schemas, events, payloads.
- All tools assume `school_id` resolved by session/JWT (not exposed in input except institution-level tools).
- All actions must include `idempotency_key`.

## Common

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
        "MODEL_UNAVAILABLE"
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
Legacy alias: none

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
