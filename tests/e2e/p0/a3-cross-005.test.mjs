import test from 'node:test';
import assert from 'node:assert/strict';
import { callMcpTool } from '../_helpers/client.mjs';
import { headersForRole, requiresRole } from '../_helpers/auth.mjs';
import { assertSuccessEnvelope, assertErrorCode } from '../_helpers/assertions.mjs';
import { CONTRACT } from '../_helpers/contract.mjs';

for (const [role, envVar] of Object.entries({
  parent: 'A3_PARENT_SESSION_TOKEN',
})) {
  const missing = requiresRole(role);
  if (missing) {
    test(`${role}: required token missing -> ${envVar}`, () => {
      assert.equal(false, true, missing);
    });
  }
}

test('A3-001 P0 - cross 005 consent happy path', async () => {
  const headers = headersForRole('parent');
  const statusBefore = await callMcpTool({
    tool: CONTRACT.tools.get_consent_status,
    arguments: { student_id: process.env.A3_STUDENT_ID },
    headers,
  });
  assert.equal(statusBefore?.success, true);

  const register = await callMcpTool({
    tool: CONTRACT.tools.register_consent,
    arguments: {
      student_id: process.env.A3_STUDENT_ID,
      has_whatsapp_consent: true,
      privacy_policy_accepted: true,
      consent_version: '1.0.0',
    },
    headers,
  });
  assertSuccessEnvelope(register);

  const statusAfter = await callMcpTool({
    tool: CONTRACT.tools.get_consent_status,
    arguments: { student_id: process.env.A3_STUDENT_ID },
    headers,
  });
  assert.equal(statusAfter?.success, true);
});

test('A3-002 P0 - cross 005 blocks data tool without consent', { skip: Boolean(requiresRole('parent')) }, async () => {
  const headers = headersForRole('parent');
  const blocked = await callMcpTool({
    tool: CONTRACT.tools.get_student_summary,
    arguments: { student_id: process.env.A3_STUDENT_ID },
    headers,
  });
  assertErrorCode(blocked, 'CONSENT_REQUIRED', 'CONSENT_NOT_ACCEPTED');
});

test('A3-003 P0 - cross 005 validation error on consent payload', { skip: Boolean(requiresRole('parent')) }, async () => {
  const headers = headersForRole('parent');
  const invalid = await callMcpTool({
    tool: CONTRACT.tools.register_consent,
    arguments: { student_id: process.env.A3_STUDENT_ID },
    headers,
  });
  assertErrorCode(invalid, 'VALIDATION_ERROR', 'BAD_REQUEST');
});
