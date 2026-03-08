export const CONTRACT = {
  tools: {
    register_consent: 'register_consent@v1',
    get_consent_status: 'get_consent_status@v1',
    get_student_summary: 'get_student_summary@v1',
    revoke_guardian_access: 'revoke_guardian_access@v1',
    search_guardian: 'search_guardian@v1',
    log_security_action: 'log_security_action@v1',
    export_user_data: 'export_user_data@v1',
    request_data_rectification: 'request_data_rectification@v1',
    register_data_opposition: 'register_data_opposition@v1',
    request_data_deletion: 'request_data_deletion@v1',
  },
  expectedErrorCodes: {
    consent_required: ['CONSENT_REQUIRED', 'CONSENT_NOT_ACCEPTED'],
    confirmation_required: ['CONFIRMATION_REQUIRED', 'CONFIRMATION_MISSING', 'CONFIRMATION_REQUIRED_ERROR'],
    validation_error: ['VALIDATION_ERROR', 'BAD_REQUEST'],
    forbidden_scope: ['FORBIDDEN_SCOPE', 'FORBIDDEN'],
  },
};

export function normalizeTool(name) {
  if (!name) return name;
  const canonical = CONTRACT.tools[name];
  return canonical || name;
}

export function normalizeErrorCode(rawCode) {
  if (!rawCode) return rawCode;
  for (const bucket of Object.values(CONTRACT.expectedErrorCodes)) {
    if (bucket.includes(rawCode)) return bucket[0];
  }
  return rawCode;
}
