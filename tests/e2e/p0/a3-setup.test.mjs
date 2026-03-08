import test from 'node:test';
import assert from 'node:assert/strict';
import { loadA3Seed } from '../_helpers/seed.mjs';

test('A3 preconditions are present', async () => {
  const seed = await loadA3Seed();
  assert.equal(Boolean(seed.school_id), true);
  assert.equal(Boolean(process.env.A3_ADMIN_SESSION_TOKEN), true, 'Missing A3_ADMIN_SESSION_TOKEN');
  assert.equal(Boolean(process.env.A3_PARENT_SESSION_TOKEN), true, 'Missing A3_PARENT_SESSION_TOKEN');
  assert.equal(Boolean(process.env.A3_STUDENT_SESSION_TOKEN), true, 'Missing A3_STUDENT_SESSION_TOKEN');
  assert.equal(Boolean(process.env.MCP_ENDPOINT || process.env.A3_MCP_ENDPOINT), true, 'Missing MCP_ENDPOINT/A3_MCP_ENDPOINT');

  // Optional: validate that runtime endpoint responde a POST JSON
  assert.ok(seed.contracts.consent_tool.endsWith('@v1'));
});
