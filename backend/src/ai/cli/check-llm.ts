// Checks the AI tutor setup without printing the key: provider, model, key present, and one tiny
// test call. Exits with code 1 (and a hint on how to fix it) if something is wrong.
// Run: npm run ai:check -w backend   (add -- --models to list the Gemini models your key can use)
import { env, ragEnabled } from "../../config/env.ts";
import { TUTOR_CONFIG } from "../../config/tutor.ts";
import { getLlmProvider, getLlmStatus } from "../llm/index.ts";
import { LlmError } from "../llm/types.ts";

const status = getLlmStatus();
const info = TUTOR_CONFIG.providers[status.provider];
let key: string | undefined;
if (status.provider === "gemini") key = env.GEMINI_API_KEY;
else if (status.provider === "groq") key = env.GROQ_API_KEY;

/** What to do for each kind of failure. */
const FIX_HINTS: Record<LlmError["code"], string> = {
  LLM_NOT_CONFIGURED: "Add the key to backend/.env (see docs/SETUP.md).",
  LLM_AUTH_FAILED:
    "The key is wrong or revoked. Create a new one and paste it again (no quotes or spaces).",
  LLM_RATE_LIMITED: "Free quota reached — wait a minute (or until tomorrow for the daily quota).",
  LLM_MODEL_NOT_FOUND:
    "The model name is not available for your key. Remove LLM_MODEL or set a current model name.",
  LLM_TIMEOUT:
    "No answer in time. Usually the free model is overloaded (it hangs instead of saying 503), rarely your internet. Try again in a few minutes, try another model for one run (LLM_MODEL=<name> npm run ai:check -w backend), or set LLM_FALLBACK_MODEL. List models: npm run ai:check -w backend -- --models",
  LLM_BLOCKED: "The provider blocked the test prompt — try again.",
  LLM_UNAVAILABLE:
    "The provider is overloaded right now (free tier). Try again in a few minutes, or set LLM_FALLBACK_MODEL (see: npm run ai:check -w backend -- --models).",
  LLM_BAD_REQUEST: "The provider rejected the request — check LLM_MODEL.",
  LLM_FAILED: "See the message above.",
};

/** Lists the Gemini models this key can use (npm run ai:check -w backend -- --models). */
async function listModels() {
  if (status.provider !== "gemini" || !key) return;
  try {
    const base = env.LLM_BASE_URL ?? info.baseUrl;
    const response = await fetch(`${base}/models?pageSize=200`, {
      headers: { "x-goog-api-key": key },
    });
    const data = (await response.json()) as {
      models?: Array<{ name: string; supportedGenerationMethods?: string[] }>;
    };
    const names = (data.models ?? [])
      .filter(
        (m) =>
          m.supportedGenerationMethods?.includes("generateContent") && m.name.includes("flash"),
      )
      .map((m) => m.name.replace("models/", ""));
    if (names.length) {
      console.log(
        `\n   Flash models available to your key:\n     ${names.slice(0, 15).join("\n     ")}`,
      );
      console.log(
        `   Use one in backend/.env:  LLM_MODEL=…  (main)  or  LLM_FALLBACK_MODEL=…  (when the main one is busy)`,
      );
    }
  } catch {
    // listing is only a hint
  }
}

console.log("\n🤖 Vachan AI tutor — configuration check\n");
console.log(`   Provider        ${status.provider} (${status.providerLabel})`);
console.log(
  `   Model           ${status.model}${env.LLM_MODEL ? " (from LLM_MODEL)" : " (default)"}`,
);
if (info.keyVariable) {
  console.log(
    `   ${info.keyVariable.padEnd(15)} ${key ? `set (${key.length} characters, ends with …${key.slice(-4)})` : "NOT SET"}`,
  );
}
if (status.fallbackModel) {
  console.log(`   Fallback model  ${status.fallbackModel} (used when the main model is busy)`);
}
console.log(
  `   RAG search      ${ragEnabled ? "on" : "OFF (RAG_ENABLED=false or NODE_ENV=production)"}`,
);

const wantsModels = process.argv.includes("--models");
// List first, so the list shows even when the test call fails.
if (wantsModels) await listModels();

try {
  if (!status.configured) {
    throw new LlmError(
      "LLM_NOT_CONFIGURED",
      `Add ${info.keyVariable}=… to backend/.env (free key: ${info.keyUrl}) and run this again.`,
    );
  }
  const started = performance.now();
  const result = await getLlmProvider().generate({
    system:
      'You are a test. Reply with the JSON object {"ok": true, "word": "నమస్కారం"} and nothing else.',
    turns: [{ role: "user", text: "Reply with the JSON object now." }],
    json: true,
    temperature: 0,
    maxOutputTokens: 1024, // thinking models need room before the short reply
  });
  const ms = Math.round(performance.now() - started);
  const parsed = JSON.parse(result.text.replace(/^\s*```(?:json)?|```\s*$/g, "")) as {
    ok?: boolean;
  };
  if (parsed.ok !== true && !status.isTestDouble)
    throw new LlmError("LLM_FAILED", `Unexpected reply: ${result.text.slice(0, 120)}`);
  console.log(
    `   Test call       ✅ ${result.model} answered in ${ms} ms (${result.inputTokens ?? "?"} → ${result.outputTokens ?? "?"} tokens)`,
  );
  if (status.isTestDouble)
    console.log(
      "\n   ⚠️  LLM_PROVIDER=mock is the offline TEST DOUBLE — set gemini or groq for real answers.",
    );
  console.log(
    ragEnabled
      ? "\n✅ The tutor is ready. Start the app and open /tutor.\n"
      : "\n⚠️  The LLM works, but RAG search is off, so the tutor can't answer.\n",
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.log(`   Test call       ❌ ${message}`);
  if (error instanceof LlmError && error.code === "LLM_MODEL_NOT_FOUND" && !wantsModels)
    await listModels();
  const hint = error instanceof LlmError ? FIX_HINTS[error.code] : "See the message above.";
  console.log(`\n❌ Not ready: ${hint}\n`);
  process.exitCode = 1;
}
