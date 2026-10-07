// Tutor evaluation: runs backend/evaluation/tutor-dataset.json through the full tutor pipeline
// with the configured LLM (Gemini/Groq) and checks, per question:
//   - status:    answered / insufficient / refused as expected
//   - retrieval: a relevant note was retrieved AND cited by the answer
//   - grounded:  the answer mentions the expected word/idea, cites at least one note, and every
//                native-script word in it appears in the retrieved notes (nothing invented)
//   - level:     the answer is short enough for the learner's level
// Writes backend/evaluation/tutor-latest-results.json and docs/evaluation/TUTOR.md, and exits
// with code 1 if a threshold is missed.
// Run: npm run tutor:eval -w backend   (--delay 6500 = ms between LLM calls; free tiers allow
// about 10 requests per minute)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { HttpError } from "../../lib/http-error.ts";
import { prisma } from "../../lib/prisma.ts";
import { RAG_PATHS, type KnowledgeLevelName } from "../../rag/config.ts";
import type { LanguageCode } from "../../rag/types.ts";
import { getLlmStatus } from "../llm/index.ts";
import { askTutor } from "../tutor/tutor.service.ts";

type Case = {
  id: string;
  question: string;
  previous?: string;
  language: LanguageCode;
  level: KnowledgeLevelName;
  lessonId?: string;
  exerciseId?: string;
  wrongAttempt?: boolean;
  expect: "answered" | "insufficient" | "refused";
  sources?: string[];
  mention?: string[];
  llmOnly?: boolean;
};
type Dataset = {
  levelWordLimits: Record<KnowledgeLevelName, number>;
  thresholds: Record<
    "statusCorrect" | "relevantRetrieval" | "grounded" | "levelRespected" | "nativeWordsFromNotes",
    number
  >;
  cases: Case[];
};
/** The result for one question. */
type Row = {
  testCase: Case;
  status: string | null;
  statusOk: boolean;
  retrievalOk: boolean;
  groundedOk: boolean;
  levelOk: boolean;
  words: number;
  nativeCount: number;
  unsupported: string[];
  usedIds: string[];
  ms: number;
  model: string | null;
  answer: string;
};
type Check = { name: string; value: number; min: number; passed: boolean };

const { values } = parseArgs({ options: { delay: { type: "string" } } });
const status = getLlmStatus();
const delayMs = Number(values.delay ?? (status.isTestDouble ? 0 : 6500));
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Calls the tutor; if the provider is busy or out of quota, waits 20 s and tries once more. */
async function askWithPatience(...args: Parameters<typeof askTutor>) {
  try {
    return await askTutor(...args);
  } catch (error) {
    const code = error instanceof HttpError ? error.code : "";
    if (!["LLM_UNAVAILABLE", "LLM_RATE_LIMITED", "LLM_TIMEOUT"].includes(code)) throw error;
    console.log(`   … ${code}: waiting 20 s and trying this question again`);
    await sleep(20_000);
    return askTutor(...args);
  }
}

const docsPath = fileURLToPath(new URL("../../../../docs/evaluation/TUTOR.md", import.meta.url));
const pct = (value: number) => `${Math.round(value * 1000) / 10}%`;
/** Expected source ids may end in "*" to match any id with that prefix. */
const matchesSource = (patterns: string[], id: string) =>
  patterns.some((p) => (p.endsWith("*") ? id.startsWith(p.slice(0, -1)) : id === p));
/** Words of 2+ characters in an Indian script (Devanagari up to Malayalam, plus ZWNJ/ZWJ). */
const nativeWords = (text: string) => text.normalize("NFC").match(/[ऀ-ൿ‌‍]{2,}/gu) ?? [];
const squash = (text: string) => text.normalize("NFC").replace(/\s+/g, "");

async function main() {
  const dataset = JSON.parse(
    await readFile(`${RAG_PATHS.evaluation}tutor-dataset.json`, "utf8"),
  ) as Dataset;
  console.log(
    `\n🧑‍🏫 Tutor evaluation — ${dataset.cases.length} questions · ${status.provider}/${status.model}${status.isTestDouble ? " (OFFLINE TEST DOUBLE — not a real AI)" : ""}\n`,
  );
  if (!status.configured)
    throw new Error(`Not configured: set ${status.keyVariable} in backend/.env (npm run ai:check)`);

  const email = `tutor-eval-${Date.now()}@example.com`;
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: "not-a-real-hash",
      profile: { create: { displayName: "Tutor eval", selfAssessment: "new" } },
    },
  });

  const rows: Row[] = [];
  try {
    for (const testCase of dataset.cases) {
      if (testCase.llmOnly && status.isTestDouble) {
        console.log(`– ${testCase.id.padEnd(24)} skipped (needs a real AI)`);
        continue;
      }
      let conversationId: string | undefined;
      if (testCase.previous) {
        const first = await askWithPatience(user.id, {
          question: testCase.previous,
          language: testCase.language,
          level: testCase.level,
        });
        conversationId = first.conversation.id;
        await sleep(delayMs);
      }
      if (testCase.wrongAttempt && testCase.exerciseId) {
        const wrong = await prisma.exerciseOption.findFirstOrThrow({
          where: { exerciseId: testCase.exerciseId, isCorrect: false },
        });
        const exercise = await prisma.exercise.findUniqueOrThrow({
          where: { id: testCase.exerciseId },
        });
        await prisma.userExerciseAttempt.create({
          data: {
            userId: user.id,
            exerciseId: exercise.id,
            lessonId: exercise.lessonId,
            answer: { optionId: wrong.id },
            isCorrect: false,
          },
        });
      }

      const started = performance.now();
      let result: Awaited<ReturnType<typeof askTutor>>;
      try {
        result = await askWithPatience(user.id, {
          question: testCase.question,
          conversationId,
          language: testCase.language,
          level: testCase.level,
          lessonId: testCase.lessonId,
          exerciseId: testCase.exerciseId,
        });
      } catch (error) {
        // One failing call must not stop the whole evaluation: record it and continue.
        const reason = error instanceof HttpError ? error.code : String(error);
        console.log(`✗ ${testCase.id.padEnd(24)} ERROR ${reason}`);
        rows.push({
          testCase,
          status: `error: ${reason}`,
          statusOk: false,
          retrievalOk: false,
          groundedOk: false,
          levelOk: false,
          words: 0,
          nativeCount: 0,
          unsupported: [],
          usedIds: [],
          ms: Math.round(performance.now() - started),
          model: null,
          answer: `(no answer — ${reason})`,
        });
        await sleep(delayMs);
        continue;
      }
      const ms = Math.round(performance.now() - started);
      const answer = result.messages[1]!;
      const retrievedIds = answer.references.map((r) => r.id);
      const usedIds = answer.references.filter((r) => r.used).map((r) => r.id);

      // Full text of everything the model was allowed to use (notes + exercise + question).
      const chunks = await prisma.knowledgeChunk.findMany({
        where: { id: { in: retrievedIds } },
        select: { heading: true, content: true },
      });
      const exerciseText = testCase.exerciseId
        ? JSON.stringify(
            await prisma.exercise.findUnique({
              where: { id: testCase.exerciseId },
              include: { options: true },
            }),
          )
        : "";
      const allowed = squash(
        chunks.map((c) => `${c.heading}\n${c.content}`).join("\n") +
          exerciseText +
          testCase.question +
          (testCase.previous ?? ""),
      );
      const native = nativeWords(answer.content);
      const unsupported = native.filter((word) => !allowed.includes(squash(word)));

      const words = answer.content.split(/\s+/).filter(Boolean).length;
      const statusOk = answer.status === testCase.expect;
      const isAnswerCase = testCase.expect === "answered";
      const retrievalOk =
        !isAnswerCase ||
        (retrievedIds.some((id) => matchesSource(testCase.sources ?? [], id)) &&
          usedIds.some((id) => matchesSource(testCase.sources ?? [], id)));
      const mentionOk =
        !isAnswerCase ||
        (testCase.mention ?? []).length === 0 ||
        (testCase.mention ?? []).some((m) =>
          answer.content.toLowerCase().includes(m.toLowerCase()),
        );
      const groundedOk =
        !isAnswerCase || (statusOk && usedIds.length > 0 && mentionOk && unsupported.length === 0);
      const levelOk = !isAnswerCase || words <= dataset.levelWordLimits[testCase.level];
      const nonLlmOk = testCase.expect === "answered" || testCase.llmOnly || answer.model === null;

      rows.push({
        testCase,
        status: answer.status,
        statusOk: statusOk && nonLlmOk,
        retrievalOk,
        groundedOk,
        levelOk,
        words,
        nativeCount: native.length,
        unsupported,
        usedIds,
        ms,
        model: answer.model,
        answer: answer.content,
      });
      const mark = (ok: boolean) => (ok ? "✓" : "✗");
      console.log(
        `${mark(statusOk && retrievalOk && groundedOk && levelOk)} ${testCase.id.padEnd(24)} ${String(answer.status).padEnd(12)} ` +
          `status ${mark(statusOk)} retrieval ${mark(retrievalOk)} grounded ${mark(groundedOk)} level ${mark(levelOk)} (${words} words)  ${ms} ms` +
          (unsupported.length ? `  ⚠ not in notes: ${unsupported.join(" ")}` : ""),
      );
      await sleep(delayMs);
    }
  } finally {
    await prisma.user.delete({ where: { id: user.id } }); // its test conversations are deleted too
  }

  // Share of rows (optionally only some of them) that pass a check; 1 when there are none.
  const share = (pick: (r: Row) => boolean, filter: (r: Row) => boolean = () => true) => {
    const subset = rows.filter(filter);
    return subset.length ? subset.filter(pick).length / subset.length : 1;
  };
  const answerRows = (r: Row) => r.testCase.expect === "answered";
  const nativeTotal = rows.reduce((sum, r) => sum + r.nativeCount, 0);
  const nativeBad = rows.reduce((sum, r) => sum + r.unsupported.length, 0);
  const summary = {
    statusCorrect: share((r) => r.statusOk),
    relevantRetrieval: share((r) => r.retrievalOk, answerRows),
    grounded: share((r) => r.groundedOk, answerRows),
    levelRespected: share((r) => r.levelOk, answerRows),
    nativeWordsFromNotes: nativeTotal ? (nativeTotal - nativeBad) / nativeTotal : 1,
  };
  const checks: Check[] = (Object.keys(dataset.thresholds) as Array<keyof typeof summary>).map(
    (name) => ({
      name,
      value: summary[name],
      min: dataset.thresholds[name],
      passed: summary[name] >= dataset.thresholds[name],
    }),
  );

  console.log("");
  for (const check of checks)
    console.log(
      `  ${check.passed ? "PASS" : "FAIL"}  ${check.name}: ${pct(check.value)} (needs ≥ ${pct(check.min)})`,
    );

  const generatedAt = new Date().toISOString();
  await writeFile(
    `${RAG_PATHS.evaluation}tutor-latest-results.json`,
    `${JSON.stringify({ generatedAt, provider: status.provider, model: status.model, summary, checks, rows }, null, 2)}\n`,
  );
  await mkdir(dirname(docsPath), { recursive: true });
  await writeFile(docsPath, buildReport(dataset, checks, rows, generatedAt));
  console.log(
    `\n  Saved backend/evaluation/tutor-latest-results.json and docs/evaluation/TUTOR.md\n`,
  );
  if (status.isTestDouble) {
    console.log(
      "  ℹ️  Offline test double: the pipeline ran end-to-end, but answer-quality numbers are not meaningful.\n     Run with LLM_PROVIDER=gemini (or groq) for the real evaluation.\n",
    );
  } else if (checks.some((c) => !c.passed)) process.exitCode = 1;
}

/** The Markdown report written to docs/evaluation/TUTOR.md. */
function buildReport(dataset: Dataset, checks: Check[], rows: Row[], generatedAt: string) {
  return `# Vachan — AI tutor evaluation

> Generated by \`npm run tutor:eval -w backend\` on ${generatedAt.slice(0, 10)} — do not edit by hand.
> Provider: **${status.provider} / ${status.model}**${status.isTestDouble ? " — ⚠️ OFFLINE TEST DOUBLE (checks the pipeline, not answer quality)" : ""} · dataset: \`backend/evaluation/tutor-dataset.json\`

| Check | Result | Needed |
| --- | --- | --- |
${checks.map((c) => `| ${c.passed ? "✅" : "❌"} ${c.name} | ${pct(c.value)} | ≥ ${pct(c.min)} |`).join("\n")}

- **statusCorrect** — answered / insufficient / refused as expected (insufficient & refused must not call the LLM).
- **relevantRetrieval** — a relevant note was retrieved and cited.
- **grounded** — cites ≥ 1 retrieved note, mentions the expected word, and contains no native-script word that isn't in the notes.
- **levelRespected** — answer length within the level's word limit (${Object.entries(
    dataset.levelWordLimits,
  )
    .map(([level, limit]) => `${level} ≤ ${limit}`)
    .join(", ")}).
- **nativeWordsFromNotes** — share of all native-script words in all answers that appear in the retrieved notes.

## Answers

${rows
  .map(
    (
      r,
    ) => `### ${r.statusOk && r.retrievalOk && r.groundedOk && r.levelOk ? "✅" : "❌"} ${r.testCase.id} — ${r.testCase.language}, ${r.testCase.level}

**Q:** ${r.testCase.previous ? `_(after "${r.testCase.previous}")_ ` : ""}${r.testCase.question}

**Status:** ${r.status} · **cited:** ${r.usedIds.map((id) => `\`${id}\``).join(", ") || "—"} · ${r.words} words · ${r.ms} ms · ${r.model ?? "no LLM call"}${r.unsupported.length ? ` · ⚠ not in notes: ${r.unsupported.join(" ")}` : ""}

> ${r.answer.replace(/\n/g, "\n> ")}
`,
  )
  .join("\n")}`;
}

try {
  await main();
} catch (error) {
  console.error(`\n❌ ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
