import assert from 'node:assert/strict';

export function assertSuccessEnvelope(response) {
  assert.equal(response?.success, true);
  return response;
}

export function assertErrorCode(response, expectedCode) {
  assert.equal(response?.success, false);
  const actualCode = response?.error?.code || response?.code || response?.error_code;
  assert.equal(actualCode, expectedCode);
}

export function assertContainsAuditTrail(entry, actionCode) {
  assert.equal(entry?.success, true);
  assert.equal(entry?.result?.action, actionCode);
}
