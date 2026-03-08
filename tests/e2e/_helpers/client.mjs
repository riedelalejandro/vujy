const DEFAULT_MCP_ENDPOINT = 'http://127.0.0.1:3000/api/mcp';

function requireEndpoint() {
  return process.env.MCP_ENDPOINT || process.env.A3_MCP_ENDPOINT || DEFAULT_MCP_ENDPOINT;
}

export async function callMcpTool({
  tool,
  arguments: args = {},
  headers = {},
  timeoutMs = 30000,
  requestId,
  idempotencyKey,
}) {
  const endpoint = requireEndpoint();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      tool,
      arguments: args,
      request_id: requestId || crypto.randomUUID(),
      idempotency_key: idempotencyKey || args.idempotency_key || `a3_${crypto.randomUUID()}`,
    }),
    signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
  });

  const payloadText = await response.text();
  let payload;

  try {
    payload = JSON.parse(payloadText);
  } catch {
    throw new Error(`Invalid JSON from MCP endpoint ${endpoint}: ${payloadText}`);
  }

  if (!response.ok && !payload?.error) {
    throw new Error(`MCP request failed (${response.status}): ${payloadText}`);
  }

  return payload;
}
