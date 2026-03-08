import test from 'node:test';
import assert from 'node:assert/strict';
import { callMcpTool } from '../_helpers/client.mjs';
import { headersForRole, requiresRole } from '../_helpers/auth.mjs';
import { assertSuccessEnvelope, assertErrorCode } from '../_helpers/assertions.mjs';
import { CONTRACT } from '../_helpers/contract.mjs';

for (const role of ['admin']) {
  const missing = requiresRole(role);
  if (missing) {
    test(`${role}: required token missing`, () => {
      assert.equal(false, true, missing);
    });
  }
}

test('A3-004 P0 - adm 015 revoke access happy path', { skip: Boolean(requiresRole('admin')) }, async () => {
  const adminHeaders = headersForRole('admin');
  const guardId = process.env.A3_GUARDIAN_ID || 'GUARDIAN_A3';
  const revoked = await callMcpTool({
    tool: CONTRACT.tools.revoke_guardian_access,
    arguments: {
      student_id: process.env.A3_STUDENT_ID,
      guardian_id: guardId,
      reason: 'auditoría_salida',
      pin_verified: true,
      idempotency_key: 'a3-004',
    },
    headers: adminHeaders,
  });
  assertSuccessEnvelope(revoked);

  const audit = await callMcpTool({
    tool: CONTRACT.tools.log_security_action,
    arguments: {
      action: 'revoke_guardian_access',
      actor_user_id: 'admin-a3',
      target_user_id: guardId,
      reason: 'P0 prelaunch guard',
    },
    headers: adminHeaders,
  });
  assertSuccessEnvelope(audit);
});

test('A3-005 P0 - adm 015 reject without confirmation', { skip: Boolean(requiresRole('admin')) }, async () => {
  const adminHeaders = headersForRole('admin');
  const guardId = process.env.A3_GUARDIAN_ID || 'GUARDIAN_A3';
  const blocked = await callMcpTool({
    tool: CONTRACT.tools.revoke_guardian_access,
    arguments: {
      student_id: process.env.A3_STUDENT_ID,
      guardian_id: guardId,
      reason: 'auditoría_salida',
      pin_verified: false,
      idempotency_key: 'a3-005',
    },
    headers: adminHeaders,
  });
  assertErrorCode(
    blocked,
    'CONFIRMATION_REQUIRED',
    'CONFIRMATION_MISSING',
    'CONFIRMATION_REQUIRED_ERROR',
  );
});

test('A3-006 P0 - adm 015 idempotency', { skip: Boolean(requiresRole('admin')) }, async () => {
  const adminHeaders = headersForRole('admin');
  const payload = {
    student_id: process.env.A3_STUDENT_ID,
    guardian_id: process.env.A3_GUARDIAN_ID || 'GUARDIAN_A3',
    reason: 'duplicado',
    pin_verified: true,
    idempotency_key: 'a3-006',
  };
  const first = await callMcpTool({ tool: CONTRACT.tools.revoke_guardian_access, arguments: payload, headers: adminHeaders });
  const second = await callMcpTool({ tool: CONTRACT.tools.revoke_guardian_access, arguments: payload, headers: adminHeaders });
  assertSuccessEnvelope(first);
  assert.equal(second?.success, true);
});
