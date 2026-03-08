import test from 'node:test';
import assert from 'node:assert/strict';
import { callMcpTool } from '../_helpers/client.mjs';
import { headersForRole, requiresRole } from '../_helpers/auth.mjs';
import { assertSuccessEnvelope, assertErrorCode } from '../_helpers/assertions.mjs';
import { CONTRACT } from '../_helpers/contract.mjs';

for (const role of ['parent']) {
  const missing = requiresRole(role);
  if (missing) {
    test(`${role}: required token missing`, () => {
      assert.equal(false, true, missing);
    });
  }
}

test('A3-007 P0 - cross 006 export data', { skip: Boolean(requiresRole('parent')) }, async () => {
  const headers = headersForRole('parent');
  const response = await callMcpTool({
    tool: CONTRACT.tools.export_user_data,
    arguments: {
      family_id: process.env.A3_FAMILY_ID || 'FAM_A3',
      student_id: process.env.A3_STUDENT_ID,
      format: 'json',
      idempotency_key: 'a3-007',
    },
    headers,
  });
  assertSuccessEnvelope(response);
  const hasArtifact = Boolean(response?.result?.download_url) || Boolean(response?.result?.request_id);
  assert.equal(hasArtifact, true);
});

test('A3-008 P0 - cross 006 rectification', { skip: Boolean(requiresRole('parent')) }, async () => {
  const headers = headersForRole('parent');
  const response = await callMcpTool({
    tool: CONTRACT.tools.request_data_rectification,
    arguments: {
      student_id: process.env.A3_STUDENT_ID,
      fields: ['contact_email', 'phone'],
      reason: 'telefono actual incorrecto',
      idempotency_key: 'a3-008',
    },
    headers,
  });
  assertSuccessEnvelope(response);
  assert.equal(response?.result?.request_status, 'received');
});

test('A3-009 P0 - cross 006 opposition', { skip: Boolean(requiresRole('parent')) }, async () => {
  const headers = headersForRole('parent');
  const response = await callMcpTool({
    tool: CONTRACT.tools.register_data_opposition,
    arguments: {
      student_id: process.env.A3_STUDENT_ID,
      opposition_scope: ['marketing', 'analytics'],
      opposition_reason: 'No consentido',
      idempotency_key: 'a3-009',
    },
    headers,
  });
  assertSuccessEnvelope(response);
  assert.equal(response?.result?.request_type, 'opposition');
});

test('A3-010 P0 - cross 006 deletion constrained', { skip: Boolean(requiresRole('parent')) }, async () => {
  const headers = headersForRole('parent');
  const response = await callMcpTool({
    tool: CONTRACT.tools.request_data_deletion,
    arguments: {
      student_id: process.env.A3_STUDENT_ID,
      deletion_scope: ['profile', 'communications'],
      pin_verified: true,
      idempotency_key: 'a3-010',
    },
    headers,
  });
  assertSuccessEnvelope(response);
});

test('A3-011 P0 - cross 006 forbidden for unauthorized actor', { skip: Boolean(requiresRole('student')) }, async () => {
  const headers = headersForRole('student');
  const response = await callMcpTool({
    tool: CONTRACT.tools.export_user_data,
    arguments: {
      family_id: process.env.A3_FAMILY_ID || 'FAM_A3',
      student_id: process.env.A3_STUDENT_ID,
      format: 'json',
    },
    headers,
  });
  assertErrorCode(response, 'FORBIDDEN_SCOPE', 'FORBIDDEN');
});
