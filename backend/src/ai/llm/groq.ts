// Groq (free tier) — OpenAI-compatible chat completions API, called with fetch, no SDK.
// Docs: https://console.groq.com/docs/api-reference#chat-create
import {
  LlmError,
  postJson,
  type GenerateRequest,
  type GenerateResult,
  type LlmProvider,
} from "./types.ts";

type ChatCompletion = {
  choices?: Array<{ message?: { content?: string | null }; finish_reason?: string }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
};

export class GroqProvider implements LlmProvider {
  readonly name = "groq";

  constructor(
    private readonly apiKey: string,
    readonly model: string,
    private readonly baseUrl: string,
    private readonly timeoutMs: number,
  ) {}

  async generate(request: GenerateRequest): Promise<GenerateResult> {
    const body = {
      model: this.model,
      temperature: request.temperature,
      max_tokens: request.maxOutputTokens,
      ...(request.json ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: request.system },
        ...request.turns.map((turn) => ({ role: turn.role, content: turn.text })),
      ],
    };
    const data = (await postJson(
      `${this.baseUrl}/chat/completions`,
      { Authorization: `Bearer ${this.apiKey}` },
      body,
      this.timeoutMs,
      "Groq",
    )) as ChatCompletion;

    const text = data.choices?.[0]?.message?.content ?? "";
    if (!text) {
      throw new LlmError(
        "LLM_FAILED",
        `Groq returned no text (finish_reason: ${data.choices?.[0]?.finish_reason ?? "none"})`,
      );
    }
    return {
      text,
      model: `groq/${this.model}`,
      inputTokens: data.usage?.prompt_tokens,
      outputTokens: data.usage?.completion_tokens,
    };
  }
}
