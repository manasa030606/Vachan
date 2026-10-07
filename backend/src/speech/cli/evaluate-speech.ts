// Speech evaluation: two small checks with the real providers (Gemini by default).
//
// A. Speech round trip, for course phrases of each language: text-to-speech (cached, so this
//    also pre-generates the app's audio), then speech-to-text, then content match with the
//    original text. Clear synthetic speech is easier than real learners (accents, noise,
//    mistakes), so this is an upper bound, not a learner score.
// B. Role-play partner, each scenario in the first language: start, 2 learner replies (the
//    partner's first suggestion), then end. Checks per partner line:
//      valid:    a usable JSON reply in the target script (no retry failure)
//      grounded: share of the line's native words found in the vocabulary / notes / chat
//      level:    line length within the learner level's budget
//      cited:    the line cites at least one knowledge-base note
//    and whether the end-of-session review is produced.
//
// Defaults are small on purpose (Telugu + Hindi, 2 phrases each, 3 scenarios, about 30 AI
// calls) because the free tier has small daily quotas per model. When a daily quota runs out,
// that part stops early instead of waiting.
// Writes backend/evaluation/speech-latest-results.json and docs/evaluation/SPEECH.md.
// Run: npm run speech:eval -w backend [-- --languages te,hi,ta --phrases 2 --scenarios 3 --delay 4000]
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { SCENARIO_IDS } from "../../config/conversation.ts";
import { HttpError } from "../../lib/http-error.ts";
import { prisma } from "../../lib/prisma.ts";
import { RAG_PATHS } from "../../rag/config.ts";
import { LANGUAGE_CODES, type LanguageCode } from "../../rag/types.ts";
import { getLlmStatus } from "../../ai/llm/index.ts";
import { LlmError } from "../../ai/llm/types.ts";
import {
  endConversation,
  replyToConversation,
  startConversation,
} from "../../ai/conversation/conversation.service.ts";
import { getSpeechToText, getSttStatus } from "../stt.ts";
import { compareTranscript } from "../text-compare.ts";
import { getTtsStatus } from "../tts.ts";
import { getSpeechAudio } from "../tts.service.ts";

const { values } = parseArgs({
  options: {
    languages: { type: "string" },
    phrases: { type: "string" },
    scenarios: { type: "string" },
    delay: { type: "string" },
  },
});
const stt = getSttStatus();
const tts = getTtsStatus();
const llm = getLlmStatus();
const testDouble = stt.isTestDouble || llm.isTestDouble;
const languages = (values.languages?.split(",") ?? ["te", "hi"]).filter((l): l is LanguageCode =>
  (LANGUAGE_CODES as readonly string[]).includes(l),
);
const phrasesPerLanguage = Number(values.phrases ?? 2);
const scenarioCount = Math.min(6, Number(values.scenarios ?? 3));
const delayMs = Number(values.delay ?? (testDouble ? 0 : 4000));
const LEVEL_WORDS = { beginner: 10, elementary: 16, intermediate: 30 };
const THRESHOLDS = {
  roundTripMatch: 0.7,
  partnerValid: 0.9,
  partnerGrounded: 0.6,
  partnerLevel: 0.8,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const pct = (value: number) => `${Math.round(value * 1000) / 10}%`;
const codeOf = (error: unknown) =>
  error instanceof HttpError || error instanceof LlmError ? error.code : "ERROR";

/** The free quota for TODAY is used up — waiting won't help. */
const isDailyQuota = (error: unknown) =>
  (error instanceof LlmError && error.quotaWindow === "day") ||
  (error instanceof HttpError &&
    (error.details as { quotaWindow?: string } | undefined)?.quotaWindow === "day");

/** Busy / per-minute quota / timeout → wait 20 s and try once more. */
async function patiently<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (isDailyQuota(error)) throw error;
    const code = codeOf(error);
    if (!["LLM_UNAVAILABLE", "LLM_RATE_LIMITED", "LLM_TIMEOUT"].includes(code)) throw error;
    console.log(`   … ${code}: waiting 20 s and trying again`);
    await sleep(20_000);
    return work();
  }
}

/** Part A: text-to-speech, then speech-to-text, then content match. */
async function roundTrip() {
  const rows: Array<Record<string, unknown>> = [];
  if (!tts.serverAudio) {
    console.log("A. skipped — TTS_PROVIDER=browser (no server audio to transcribe)\n");
    return rows;
  }
  const recognizer = getSpeechToText();
  for (const language of languages) {
    const items = await prisma.vocabularyItem.findMany({
      where: { language: { code: language }, kind: { in: ["PHRASE", "WORD"] } },
      include: { language: true },
      orderBy: [{ kind: "desc" }, { id: "asc" }],
    });
    // Phrases first (harder), then words.
    for (const item of items.slice(0, phrasesPerLanguage)) {
      try {
        const audio = await patiently(() => getSpeechAudio({ vocabularyItemId: item.id }));
        const transcript = await patiently(() =>
          recognizer.transcribe({
            audio: audio.audio,
            mimeType: "audio/wav",
            languageCode: language,
            languageName: item.language.name,
            scriptName: item.language.scriptName,
          }),
        );
        const match = compareTranscript(item, transcript.text);
        const ok = match.verdict === "match" || match.verdict === "close";
        rows.push({
          language,
          id: item.id,
          expected: item.script,
          heard: transcript.text,
          score: match.score,
          verdict: match.verdict,
          ok,
          audio: audio.source,
        });
        console.log(
          `${ok ? "✓" : "✗"} ${language} ${item.script.padEnd(18)} → ${transcript.text || "(nothing)"}  ${match.verdict} ${match.score}`,
        );
      } catch (error) {
        if (isDailyQuota(error)) {
          console.log(
            `■ daily free quota used up (${(error as Error).message.slice(0, 120)}) — stopping part A`,
          );
          rows.push({ language, id: item.id, expected: item.script, skipped: "daily quota" });
          return rows;
        }
        rows.push({
          language,
          id: item.id,
          expected: item.script,
          error: codeOf(error),
          ok: false,
        });
        console.log(
          `✗ ${language} ${item.script} → ERROR ${codeOf(error)}: ${(error as Error).message.slice(0, 100)}`,
        );
      }
      await sleep(delayMs);
    }
  }
  return rows;
}

/** Part B: short role-plays where the "learner" always says the partner's first suggestion. */
async function partner() {
  const rows: Array<Record<string, unknown>> = [];
  const language = languages[0] ?? "te";
  const user = await prisma.user.create({
    data: {
      email: `speech-eval-${Date.now()}@example.com`,
      passwordHash: "not-a-login",
      profile: {
        create: {
          displayName: "Eval",
          currentLanguage: { connect: { code: language } },
          selfAssessment: "new",
        },
      },
    },
  });
  try {
    for (const scenario of SCENARIO_IDS.slice(0, scenarioCount)) {
      try {
        let conversation = await patiently(() =>
          startConversation(user.id, { scenario, language }),
        );
        await sleep(delayMs);
        for (let turn = 0; turn < 2; turn++) {
          const last = conversation.turns.at(-1)!;
          const suggestions = last.suggestions as Array<{ text: string }>;
          const reply = suggestions[0]?.text ?? conversation.turns[0]!.text;
          const next = await patiently(() =>
            replyToConversation(user.id, conversation.session.id, {
              text: reply,
              inputMode: "text",
            }),
          );
          conversation = { session: next.session, turns: [...conversation.turns, ...next.turns] };
          await sleep(delayMs);
        }
        const ended = await patiently(() => endConversation(user.id, conversation.session.id));
        const saved = await prisma.conversationTurn.findMany({
          where: { sessionId: conversation.session.id, role: "ASSISTANT" },
          orderBy: { createdAt: "asc" },
        });
        for (const turn of saved) {
          const context = (turn.context ?? {}) as { wordCoverage?: number | null };
          const words = turn.text.trim().split(/\s+/).length;
          const row = {
            scenario,
            language,
            text: turn.text,
            translation: turn.translation,
            valid: true,
            coverage: context.wordCoverage ?? null,
            grounded: (context.wordCoverage ?? 0) >= 0.6,
            words,
            levelOk: words <= LEVEL_WORDS.beginner,
            cited: Array.isArray(turn.references) && turn.references.length > 0,
          };
          rows.push(row);
          console.log(
            `${row.grounded && row.levelOk ? "✓" : "·"} ${scenario.padEnd(13)} ${turn.text}  (${turn.translation}) coverage=${row.coverage} words=${words}`,
          );
        }
        const review = (ended.session.summary as { review?: unknown } | null)?.review;
        rows.push({ scenario, language, summary: true, valid: Boolean(review) });
        console.log(`  ${review ? "✓" : "✗"} ${scenario} summary review`);
      } catch (error) {
        if (isDailyQuota(error)) {
          console.log(`■ daily free quota used up — stopping part B`);
          rows.push({ scenario, language, summary: true, skipped: "daily quota" });
          break;
        }
        rows.push({ scenario, language, valid: false, error: codeOf(error) });
        console.log(
          `✗ ${scenario} → ERROR ${codeOf(error)}: ${(error as Error).message.slice(0, 100)}`,
        );
      }
      await sleep(delayMs);
    }
  } finally {
    await prisma.user.delete({ where: { id: user.id } });
  }
  return rows;
}

async function main() {
  console.log(
    `\n🎧 Speech evaluation — STT ${stt.provider}/${stt.model} · TTS ${tts.provider}/${tts.model ?? "auto"} · LLM ${llm.provider}/${llm.model}${testDouble ? " (TEST DOUBLES — numbers are not meaningful)" : ""}\n`,
  );
  console.log("A. Speech round trip (text-to-speech → speech-to-text → content match)\n");
  const trips = await roundTrip();
  console.log("\nB. Role-play partner\n");
  const lines = await partner();

  // Rows skipped because the daily quota ran out are not counted either way.
  const share = <T extends Record<string, unknown>>(all: T[], test: (row: T) => boolean) => {
    const rows = all.filter((row) => !row.skipped);
    return rows.length ? rows.filter(test).length / rows.length : 0;
  };
  const partnerLines = lines.filter((l) => !l.summary);
  const summary = {
    roundTripMatch: share(trips, (r) => r.ok === true),
    partnerValid: share(lines, (r) => r.valid === true),
    partnerGrounded: share(
      partnerLines.filter((l) => l.valid),
      (r) => r.grounded === true,
    ),
    partnerLevel: share(
      partnerLines.filter((l) => l.valid),
      (r) => r.levelOk === true,
    ),
    partnerCited: share(
      partnerLines.filter((l) => l.valid),
      (r) => r.cited === true,
    ),
  };
  const checks = (Object.keys(THRESHOLDS) as Array<keyof typeof THRESHOLDS>).map((name) => ({
    name,
    value: summary[name],
    min: THRESHOLDS[name],
    pass: summary[name] >= THRESHOLDS[name],
  }));
  console.log("");
  for (const c of checks)
    console.log(
      `  ${c.pass ? "PASS" : "FAIL"}  ${c.name}: ${pct(c.value)} (needs ≥ ${pct(c.min)})`,
    );
  console.log(`  info  partnerCited: ${pct(summary.partnerCited)}`);

  const generatedAt = new Date().toISOString();
  await writeFile(
    `${RAG_PATHS.evaluation}speech-latest-results.json`,
    `${JSON.stringify({ generatedAt, stt, tts, llm: { provider: llm.provider, model: llm.model }, summary, checks, trips, lines }, null, 2)}\n`,
  );
  const md = [
    "# Speech & conversation evaluation",
    "",
    `> Generated by \`npm run speech:eval -w backend\` on ${generatedAt.slice(0, 10)} · STT \`${stt.provider}/${stt.model}\` · TTS \`${tts.provider}/${tts.model ?? "auto"}\` · LLM \`${llm.provider}/${llm.model}\`${testDouble ? " · **TEST DOUBLES — not meaningful**" : ""}`,
    "",
    "## Results",
    "",
    "| Check | Result | Needs |",
    "| --- | --- | --- |",
    ...checks.map(
      (c) => `| ${c.pass ? "✅" : "❌"} ${c.name} | ${pct(c.value)} | ≥ ${pct(c.min)} |`,
    ),
    `| ℹ️ partnerCited (line cites a knowledge-base note) | ${pct(summary.partnerCited)} | – |`,
    "",
    "- **roundTripMatch** — course phrase → text-to-speech → speech-to-text → content match is *match* or *close*. Clear synthetic speech, so this is an upper bound for real learners, and it says nothing about the learner's pronunciation.",
    "- **partnerValid** — the role-play partner returned a usable reply in the target script (and the summary review was produced).",
    "- **partnerGrounded** — at least 60 % of the native-script words in a partner line appear in the course vocabulary, the retrieved notes or the conversation.",
    `- **partnerLevel** — a beginner partner line has at most ${LEVEL_WORDS.beginner} words.`,
    "",
    "## A. Speech round trip",
    "",
    "| Language | Expected | Heard | Verdict | Score |",
    "| --- | --- | --- | --- | --- |",
    ...trips.map(
      (r) =>
        `| ${r.language} | ${r.expected} | ${r.heard ?? (r.skipped ? `skipped: ${r.skipped}` : `error: ${r.error}`)} | ${r.verdict ?? "–"} | ${r.score ?? "–"} |`,
    ),
    "",
    "## B. Role-play partner lines",
    "",
    "| Scenario | Line | English | Words | Coverage | Cites a note |",
    "| --- | --- | --- | --- | --- | --- |",
    ...partnerLines.map((r) =>
      r.valid
        ? `| ${r.scenario} | ${r.text} | ${r.translation ?? ""} | ${r.words} | ${r.coverage ?? "–"} | ${r.cited ? "yes" : "no"} |`
        : `| ${r.scenario} | ${r.skipped ? `skipped: ${r.skipped}` : `error: ${r.error}`} | | | | |`,
    ),
    "",
  ].join("\n");
  const docsPath = fileURLToPath(new URL("../../../../docs/evaluation/SPEECH.md", import.meta.url));
  await mkdir(dirname(docsPath), { recursive: true });
  await writeFile(docsPath, md);
  console.log(
    "\n  Saved backend/evaluation/speech-latest-results.json and docs/evaluation/SPEECH.md\n",
  );
  if (!testDouble && checks.some((c) => !c.pass)) process.exitCode = 1;
  await prisma.$disconnect();
}

void main();
