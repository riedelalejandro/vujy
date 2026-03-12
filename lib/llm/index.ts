import type { LLMProvider } from "./provider";

let _provider: LLMProvider | null = null;

export async function getLLMProvider(): Promise<LLMProvider> {
  if (_provider) return _provider;

  const providerName = process.env.LLM_PROVIDER ?? "claude";

  switch (providerName) {
    case "claude": {
      const { ClaudeAdapter } = await import("./adapters/claude");
      _provider = new ClaudeAdapter();
      break;
    }
    default:
      throw new Error(`Unknown LLM_PROVIDER: "${providerName}". Supported: claude`);
  }

  return _provider;
}

export type { LLMProvider, ChatParams, ChatResponse, ChatChunk, CanonicalTool } from "./provider";
