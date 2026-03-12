// LLM Provider abstraction — see docs/05-ARCHITECTURE.md §6
// Allows switching between Claude, OpenAI, or local models via LLM_PROVIDER env var
// without code changes.

export interface ChatMessage {
  role: "user" | "assistant" | "tool";
  content: string;
  toolName?: string;
  toolUseId?: string;
}

export interface CanonicalTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>; // JSON Schema Draft 2020-12
}

export interface ProviderTool {
  // Provider-specific format (each adapter translates from CanonicalTool)
  [key: string]: unknown;
}

export interface ChatParams {
  systemPrompt: string;
  messages: ChatMessage[];
  tools?: CanonicalTool[];
  maxTokens?: number;
  temperature?: number;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ChatResponse {
  content: string;
  toolCalls?: ToolCall[];
  stopReason: "end_turn" | "tool_use" | "max_tokens" | "stop_sequence";
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface ChatChunk {
  type: "text" | "tool_call_start" | "tool_call_delta" | "tool_call_end" | "done";
  content?: string;
  toolCall?: Partial<ToolCall>;
}

export interface LLMProvider {
  chat(params: ChatParams): Promise<ChatResponse>;
  stream(params: ChatParams): AsyncIterable<ChatChunk>;
  formatTools(tools: CanonicalTool[]): ProviderTool[];
}
