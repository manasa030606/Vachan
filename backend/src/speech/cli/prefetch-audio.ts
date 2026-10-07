// Generates (and caches in the AudioClip table) the audio for every course word and phrase of a
// language, so the demo plays instantly and doesn't depend on the TTS quota at that moment.
// Already-cached phrases cost nothing. Stops politely when the free quota runs out.
// Run: npm run speech:prefetch -w backend -- --language te   [--delay 3000]
import { parseArgs } from "node:util";
import { HttpError } from "../../lib/http-error.ts";
import { prisma } from "../../lib/prisma.ts";
import { LANGUAGE_CODES } from "../../rag/types.ts";
import { getTtsStatus } from "../tts.ts";
import { getSpeechAudio } from "../tts.service.ts";

const { values } = parseArgs({
  options: { language: { type: "string" }, delay: { type: "string" } },
});
const language = values.language ?? "te";
const delayMs = Number(values.delay ?? 3000);

async function main() {
  if (!(LANGUAGE_CODES as readonly string[]).includes(language)) {
    console.error(`Unknown language "${language}". Use one of: ${LANGUAGE_CODES.join(", ")}`);
    process.exitCode = 1;
    return;
  }
  const tts = getTtsStatus();
  if (!tts.serverAudio) {
    console.log("TTS_PROVIDER=browser — nothing to generate on the server.");
    return;
  }
  const items = await prisma.vocabularyItem.findMany({
    where: { language: { code: language }, kind: { in: ["WORD", "PHRASE"] } },
    orderBy: { id: "asc" },
  });
  console.log(`\n🔊 Audio for ${items.length} ${language} words/phrases (${tts.provider})\n`);
  let generated = 0;
  for (const item of items) {
    try {
      const audio = await getSpeechAudio({ vocabularyItemId: item.id });
      console.log(
        `  ${audio.source === "cache" ? "·" : "✓"} ${item.script} (${audio.durationMs} ms, ${audio.source})`,
      );
      if (audio.source === "generated") {
        generated++;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      const code = error instanceof HttpError ? error.code : "ERROR";
      console.log(`  ✗ ${item.script}: ${code} — ${(error as Error).message}`);
      if (code === "LLM_RATE_LIMITED") {
        console.log(
          "\n  Free text-to-speech quota reached — run this again later (cached ones are kept).",
        );
        break;
      }
    }
  }
  console.log(`\n  ${generated} new clip(s) generated.\n`);
  await prisma.$disconnect();
}

void main();
