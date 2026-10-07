// Turns provider errors (LlmError) into clear HTTP errors for the learner.
// Shared by the tutor, speech and conversation features.
import { HttpError } from "../../lib/http-error.ts";
import type { LlmError } from "./types.ts";

/**
 * @param feature   who is asking, for the log line ("tutor", "speech", …)
 * @param notConfiguredCode  the error code when the API key is missing (e.g. TUTOR_NOT_CONFIGURED)
 */
export function llmErrorToHttp(
  error: LlmError,
  feature: string,
  notConfiguredCode: string,
): HttpError {
  const map: Record<LlmError["code"], [number, string]> = {
    LLM_NOT_CONFIGURED: [503, "Add the API key to backend/.env and restart the backend."],
    LLM_AUTH_FAILED: [502, "The AI provider rejected the API key. Check it in backend/.env."],
    LLM_RATE_LIMITED: [429, "The free AI quota is used up for now. Please try again in a minute."],
    LLM_MODEL_NOT_FOUND: [
      502,
      "The configured AI model doesn't exist. Check the model name in backend/.env.",
    ],
    LLM_TIMEOUT: [504, "The AI took too long to answer. Please try again."],
    LLM_BLOCKED: [502, "The AI provider refused this request."],
    LLM_UNAVAILABLE: [503, "The AI service is very busy right now. Please try again in a minute."],
    LLM_BAD_REQUEST: [
      502,
      "The AI service rejected the request. Check the model name in backend/.env.",
    ],
    LLM_FAILED: [502, "The AI service had a problem. Please try again."],
  };
  const [status, message] = map[error.code];
  console.warn(`[${feature}] ${error.code}: ${error.message}`); // server log only (never the key)
  return new HttpError(
    status,
    error.code === "LLM_NOT_CONFIGURED" ? notConfiguredCode : error.code,
    error.code === "LLM_RATE_LIMITED" && error.quotaWindow === "day"
      ? "Today's free AI quota is used up. Please try again tomorrow."
      : message,
    error.quotaWindow ? { quotaWindow: error.quotaWindow } : undefined,
  );
}
