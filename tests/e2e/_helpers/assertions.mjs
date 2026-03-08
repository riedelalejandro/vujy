import assert from 'node:assert/strict';
import { normalizeErrorCode } from './contract.mjs';

export function assertSuccessEnvelope(response) {
  assert.equal(response?.success, true);
  return response;
}

export function assertErrorCode(response, ...expectedCodes) {
  assert.equal(response?.success, false);
  const actualCode = normalizeErrorCode(response?.error?.code || response?.code || response?.error_code);
  const uniqueAccepted = new Set(expectedCodes.map((code) => normalizeErrorCode(code)));
  assert.ok(uniqueAccepted.has(actualCode), `Expected one of ${[...uniqueAccepted].join(', ')} but got ${actualCode}`);
}

export function assertContainsAuditTrail(entry, actionCode) {
  assert.equal(entry?.success, true);
  assert.equal(entry?.result?.action, actionCode);
}
