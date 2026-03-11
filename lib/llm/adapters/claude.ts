import Anthropic from "@anthropic-ai/sdk";
import type {
  LLMProvider,
  ChatParams,
  ChatResponse,
  ChatChunk,
  CanonicalTool,
  ProviderTool,
  ChatMessage,
} from "../provider";

export class ClaudeAdapter implements LLMProvider {
  private client: Anthropic;
  private model: string;

  constructor() {
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) throw new Error("LLM_API_KEY is not set");

    this.client = new Anthropic({ apiKey });
    this.model = process.env.LLM_MODEL ?? "claude-sonnet-4-6";
  }

  formatTools(tools: CanonicalTool[]): ProviderTool[] {
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema,
    }));
  }

  private toAnthropicMessages(messages: ChatMessage[]): Anthropic.MessageParam[] {
    return messages.map((msg) => ({
      role: msg.role === "tool" ? "user" : (msg.role as "user" | "assistant"),
      content: msg.content,
    }));
  }

  async chat(params: ChatParams): Promise<ChatResponse> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: params.maxTokens ?? 4096,
      temperature: params.temperature ?? 0.3,
      system: params.systemPrompt,
      messages: this.toAnthropicMessages(params.messages),
      ...(params.tools && params.tools.length > 0
        ? { tools: this.formatTools(params.tools) as unknown as Anthropic.Tool[] }
        : {}),
    });

    const textContent = response.content
      .filter((c) => c.type === "text")
      .map((c) => (c as Anthropic.TextBlock).text)
      .join("");

    const toolCalls = response.content
      .filter((c) => c.type === "tool_use")
      .map((c) => {
        const toolUse = c as Anthropic.ToolUseBlock;
        return {
          id: toolUse.id,
          name: toolUse.name,
          input: toolUse.input as Record<string, unknown>,
        };
      });

    return {
      content: textContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      stopReason:
        response.stop_reason === "tool_use"
          ? "tool_use"
          : response.stop_reason === "max_tokens"
            ? "max_tokens"
            : "end_turn",
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }

  async *stream(params: ChatParams): AsyncIterable<ChatChunk> {
    const stream = this.client.messages.stream({
      model: this.model,
      max_tokens: params.maxTokens ?? 4096,
      system: params.systemPrompt,
      messages: this.toAnthropicMessages(params.messages),
      ...(params.tools && params.tools.length > 0
        ? { tools: this.formatTools(params.tools) as unknown as Anthropic.Tool[] }
        : {}),
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield { type: "text", content: event.delta.text };
      }
    }

    yield { type: "done" };
  }
}
