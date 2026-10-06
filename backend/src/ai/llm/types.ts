// The small interface every LLM provider implements. The tutor only talks to this interface,
// so switching Gemini ↔ Groq is one environment variable (LLM_PROVIDER).

export type ChatTurn = { role: "user" | "assistant"; text: string };

export type GenerateRequest = {
  /** Rules for the model (the "system prompt"). */
  system: string;
  /** The conversation; the last turn is the learner's prompt with the retrieved notes. */
  turns: ChatTurn[];
  /** Ask for a JSON object as the answer. */
  json: boolean;
  temperature: number;
  maxOutputTokens: number;
};

export type GenerateResult = {
  text: string;
  /** "gemini/gemini-3.5-flash" */
  model: string;
  inputTokens?: number;
  outputTokens?: number;
};

export interface LlmProvider {
  readonly name: string;
  readonly model: string;
  generate(request: GenerateRequest): Promise<GenerateResult>;
}

/** Provider failures with a code the API turns into a clear error message. */
export class LlmError extends Error {
  constructor(
    readonly code:
      | "LLM_NOT_CONFIGURED"
      | "LLM_AUTH_FAILED"
      | "LLM_RATE_LIMITED"
      | "LLM_MODEL_NOT_FOUND"
      | "LLM_TIMEOUT"
      | "LLM_BLOCKED"
      | "LLM_UNAVAILABLE"
      | "LLM_BAD_REQUEST"
      | "LLM_FAILED",
    message: string,
  ) {
    super(message);
    this.name = "LlmError";
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** HTTP statuses that usually mean "busy right now" — worth a short wait and another try. */
const TRANSIENT = new Set([500, 502, 503, 504]);

/**
 * POST JSON with a timeout. Temporary provider problems (overloaded 503, 500/502/504, dropped
 * connection) are retried twice with a short pause (1.5 s, then 4 s). Maps HTTP errors of any
 * provider to LlmError codes. Never puts request headers (the API key) into messages.
 */
export async function postJson(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  timeoutMs: number,
  providerLabel: string,
  retryDelaysMs: number[] = [1500, 4000],
): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await postOnce(url, headers, body, timeoutMs, providerLabel);
    } catch (error) {
      const retryable =
        error instanceof LlmError &&
        (error.code === "LLM_UNAVAILABLE" || error.message.startsWith(`Can't reach`));
      if (!retryable || attempt >= retryDelaysMs.length) throw error;
      console.warn(
        `[llm] ${providerLabel} busy (${(error as LlmError).message.slice(0, 80)}) — retry ${attempt + 1}/${retryDelaysMs.length}`,
      );
      await sleep(retryDelaysMs[attempt]! + Math.random() * 500);
    }
  }
}

async function postOnce(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  timeoutMs: number,
  providerLabel: string,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new LlmError(
        "LLM_TIMEOUT",
        `${providerLabel} did not answer within ${timeoutMs / 1000}s`,
      );
    }
    throw new LlmError("LLM_FAILED", `Can't reach ${providerLabel}: ${(error as Error).message}`);
  }

  const data: unknown = await response.json().catch(() => null);
  if (response.ok) return data;

  // Never include request headers (the API key) in messages — only the provider's own error text.
  const providerMessage =
    (data as { error?: { message?: string } } | null)?.error?.message?.slice(0, 300) ??
    `HTTP ${response.status}`;
  if (response.status === 401 || response.status === 403 || /api key/i.test(providerMessage)) {
    throw new LlmError(
      "LLM_AUTH_FAILED",
      `${providerLabel} rejected the API key: ${providerMessage}`,
    );
  }
  if (response.status === 429) {
    throw new LlmError(
      "LLM_RATE_LIMITED",
      `${providerLabel} quota/rate limit reached: ${providerMessage}`,
    );
  }
  if (response.status === 404) {
    throw new LlmError("LLM_MODEL_NOT_FOUND", `${providerLabel}: ${providerMessage}`);
  }
  if (TRANSIENT.has(response.status)) {
    throw new LlmError(
      "LLM_UNAVAILABLE",
      `${providerLabel} is busy (${response.status}): ${providerMessage}`,
    );
  }
  if (response.status === 400) {
    throw new LlmError(
      "LLM_BAD_REQUEST",
      `${providerLabel} rejected the request: ${providerMessage}`,
    );
  }
  throw new LlmError("LLM_FAILED", `${providerLabel} error ${response.status}: ${providerMessage}`);
}
