// Chooses the LLM provider from the environment (LLM_PROVIDER + the matching API key).
// The key is read only here, on the server; it is never sent to the browser or logged.
import { env } from "../../config/env.ts";
import { TUTOR_CONFIG, type ProviderName } from "../../config/tutor.ts";
import { GeminiProvider } from "./gemini.ts";
import { GroqProvider } from "./groq.ts";
import { MockProvider } from "./mock.ts";
import { LlmError, type GenerateRequest, type LlmProvider } from "./types.ts";

const looksLikePlaceholder = (key: string | undefined) =>
  !key || key.length < 20 || /^(your|replace|xxx|paste)/i.test(key);

export function getProviderName(): ProviderName {
  return env.LLM_PROVIDER;
}

/** Safe-to-show configuration status (never contains the key). */
export function getLlmStatus() {
  const name = env.LLM_PROVIDER;
  const provider = TUTOR_CONFIG.providers[name];
  const key =
    name === "gemini" ? env.GEMINI_API_KEY : name === "groq" ? env.GROQ_API_KEY : undefined;
  const configured = name === "mock" || !looksLikePlaceholder(key);
  return {
    provider: name,
    providerLabel: provider.label,
    model: env.LLM_MODEL ?? provider.defaultModel,
    fallbackModel: env.LLM_FALLBACK_MODEL ?? null,
    configured,
    keyVariable: provider.keyVariable,
    isTestDouble: name === "mock",
  };
}

/** Busy, slow, or out of free quota → the fallback model (each model has its own free quota). */
export const FALLBACK_CODES: string[] = ["LLM_UNAVAILABLE", "LLM_TIMEOUT", "LLM_RATE_LIMITED"];

/**
 * Optional LLM_FALLBACK_MODEL: if the main model is still busy after the retries (free-tier
 * "high demand" 503s), too slow, or out of its free quota (429), the same request is sent once to
 * this other model of the same provider. Also used by speech-to-text and pronunciation notes.
 */
export class WithFallback implements LlmProvider {
  readonly name: string;
  readonly model: string;
  constructor(
    private readonly primary: LlmProvider,
    private readonly fallback: LlmProvider,
  ) {
    this.name = primary.name;
    this.model = primary.model;
  }
  async generate(request: GenerateRequest) {
    try {
      return await this.primary.generate(request);
    } catch (error) {
      if (!(error instanceof LlmError) || !FALLBACK_CODES.includes(error.code)) throw error;
      console.warn(
        `[llm] ${this.primary.model} ${error.code} — trying fallback ${this.fallback.model}`,
      );
      return this.fallback.generate(request);
    }
  }
}

let cached: LlmProvider | null = null;

export function getLlmProvider(): LlmProvider {
  if (cached) return cached;
  const status = getLlmStatus();
  if (!status.configured) {
    const info = TUTOR_CONFIG.providers[status.provider];
    throw new LlmError(
      "LLM_NOT_CONFIGURED",
      `The AI tutor needs ${info.keyVariable} in backend/.env (free key: ${info.keyUrl}). See docs/AI_TUTOR.md → Setup.`,
    );
  }
  const base = env.LLM_BASE_URL ?? TUTOR_CONFIG.providers[status.provider].baseUrl;
  const make = (model: string): LlmProvider =>
    status.provider === "gemini"
      ? new GeminiProvider(env.GEMINI_API_KEY!, model, base, env.LLM_TIMEOUT_MS)
      : status.provider === "groq"
        ? new GroqProvider(env.GROQ_API_KEY!, model, base, env.LLM_TIMEOUT_MS)
        : new MockProvider();
  const primary = make(status.model);
  cached =
    env.LLM_FALLBACK_MODEL && status.provider !== "mock"
      ? new WithFallback(primary, make(env.LLM_FALLBACK_MODEL))
      : primary;
  return cached;
}
