// Google Gemini (Google AI Studio API, free tier) — REST call, no SDK.
// Docs: https://ai.google.dev/api/generate-content
import {
  LlmError,
  postJson,
  type GenerateRequest,
  type GenerateResult,
  type LlmProvider,
} from "./types.ts";

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
};

export class GeminiProvider implements LlmProvider {
  readonly name = "gemini";
  /** Set when the model rejects our thinking setting — we then stop sending it. */
  private thinkingSettingRejected = false;

  constructor(
    private readonly apiKey: string,
    readonly model: string,
    private readonly baseUrl: string,
    private readonly timeoutMs: number,
  ) {}

  /**
   * Gemini 3 models "think" before answering, which made a short tutor reply take ~17 s.
   * Short, note-based explanations don't need deep thinking, so we ask for the lowest level.
   * (2.5 Flash: thinking off.) If a model doesn't accept the setting, it is dropped automatically.
   */
  private thinkingConfig() {
    if (this.thinkingSettingRejected) return {};
    if (this.model.startsWith("gemini-2.5-flash")) return { thinkingConfig: { thinkingBudget: 0 } };
    if (/^gemini-[3-9]/.test(this.model)) return { thinkingConfig: { thinkingLevel: "low" } };
    return {};
  }

  async generate(request: GenerateRequest): Promise<GenerateResult> {
    try {
      return await this.call(request);
    } catch (error) {
      if (
        error instanceof LlmError &&
        error.code === "LLM_BAD_REQUEST" &&
        /think/i.test(error.message) &&
        !this.thinkingSettingRejected
      ) {
        console.warn(
          `[llm] ${this.model} does not accept the thinking setting — continuing without it`,
        );
        this.thinkingSettingRejected = true;
        return this.call(request);
      }
      throw error;
    }
  }

  private async call(request: GenerateRequest): Promise<GenerateResult> {
    const body = {
      systemInstruction: { parts: [{ text: request.system }] },
      contents: request.turns.map((turn) => ({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [
          // Gemini can listen: a recording goes in as inline data next to the text.
          ...(turn.audio
            ? [
                {
                  inlineData: {
                    mimeType: turn.audio.mimeType,
                    data: turn.audio.data.toString("base64"),
                  },
                },
              ]
            : []),
          { text: turn.text },
        ],
      })),
      generationConfig: {
        temperature: request.temperature,
        maxOutputTokens: request.maxOutputTokens,
        ...(request.json ? { responseMimeType: "application/json" } : {}),
        ...this.thinkingConfig(),
      },
    };
    const data = (await postJson(
      `${this.baseUrl}/models/${encodeURIComponent(this.model)}:generateContent`,
      { "x-goog-api-key": this.apiKey }, // header, not the URL, so the key never appears in logs
      body,
      this.timeoutMs,
      "Gemini",
    )) as GeminiResponse;

    if (data.promptFeedback?.blockReason) {
      throw new LlmError(
        "LLM_BLOCKED",
        `Gemini blocked the request (${data.promptFeedback.blockReason})`,
      );
    }
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
    if (!text) {
      throw new LlmError(
        "LLM_FAILED",
        `Gemini returned no text (finishReason: ${candidate?.finishReason ?? "none"})`,
      );
    }
    return {
      text,
      model: `gemini/${this.model}`,
      inputTokens: data.usageMetadata?.promptTokenCount,
      outputTokens: data.usageMetadata?.candidatesTokenCount,
    };
  }
}
