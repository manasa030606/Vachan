// npm run rag:eval -w backend
//
// Measures retrieval quality on backend/evaluation/retrieval-dataset.json and compares
// "vector search only" with "vector search + metadata filtering/re-ranking".
// Writes backend/evaluation/latest-results.json and docs/RAG_EVALUATION.md.
// Exit code 1 when a threshold in the dataset is not met — retrieval is never assumed to work.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { prisma } from "../../lib/prisma.ts";
import { RAG_CONFIG, RAG_PATHS, type KnowledgeLevelName } from "../config.ts";
import { searchKnowledge, type SearchResponse } from "../retrieval.service.ts";
import type { LanguageCode } from "../types.ts";

type EvalCase = {
  id: string;
  category: string;
  query: string;
  language?: LanguageCode;
  level?: KnowledgeLevelName;
  topic?: string;
  expectLanguage: LanguageCode;
  relevant: string[];
};
type Dataset = {
  thresholds: Record<
    "hitAt3" | "mrr" | "languagePrecision" | "inScopeSufficient" | "outOfScopeRejected",
    number
  >;
  cases: EvalCase[];
  outOfScope: Array<{ id: string; query: string; language?: LanguageCode }>;
};

const K = 5;
const datasetPath = `${RAG_PATHS.evaluation}retrieval-dataset.json`;
const docsPath = fileURLToPath(new URL("../../../../docs/RAG_EVALUATION.md", import.meta.url));

/** Scores one run of one case. */
function scoreCase(testCase: EvalCase, response: SearchResponse) {
  const ids = response.results.map((result) => result.id);
  const firstHit = ids.findIndex((id) => testCase.relevant.includes(id));
  const rank = firstHit === -1 ? null : firstHit + 1;
  const sameLanguage = response.results.filter(
    (r) => r.metadata.language === testCase.expectLanguage,
  ).length;
  const harder = testCase.level
    ? response.results.slice(0, 3).filter((r) => r.relevance.levelMatch === "harder").length
    : 0;
  return {
    rank,
    hit1: rank === 1,
    hit3: rank !== null && rank <= 3,
    hit5: rank !== null && rank <= K,
    reciprocalRank: rank ? 1 / rank : 0,
    languagePrecision: response.results.length ? sameLanguage / response.results.length : 0,
    harderInTop3: harder,
    sufficient: response.retrieval.sufficient,
    bestSimilarity: response.retrieval.bestSimilarity,
    top3: response.results
      .slice(0, 3)
      .map((r) => ({ id: r.id, score: r.relevance.score, similarity: r.relevance.similarity })),
    languageSource: response.filters.language.source,
  };
}

type CaseScore = ReturnType<typeof scoreCase>;

function summarize(scores: CaseScore[]) {
  const mean = (values: number[]) =>
    Math.round((values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1)) * 1000) / 1000;
  return {
    hitAt1: mean(scores.map((s) => Number(s.hit1))),
    hitAt3: mean(scores.map((s) => Number(s.hit3))),
    hitAt5: mean(scores.map((s) => Number(s.hit5))),
    mrr: mean(scores.map((s) => s.reciprocalRank)),
    languagePrecision: mean(scores.map((s) => s.languagePrecision)),
    inScopeSufficient: mean(scores.map((s) => Number(s.sufficient))),
  };
}

const pct = (value: number) => `${Math.round(value * 1000) / 10}%`;

async function main() {
  const dataset = JSON.parse(await readFile(datasetPath, "utf8")) as Dataset;

  // Every expected chunk id must exist — a typo would silently lower the score.
  const expectedIds = [...new Set(dataset.cases.flatMap((c) => c.relevant))];
  const found = new Set(
    (
      await prisma.knowledgeChunk.findMany({
        where: { id: { in: expectedIds } },
        select: { id: true },
      })
    ).map((c) => c.id),
  );
  const missing = expectedIds.filter((id) => !found.has(id));
  if (missing.length > 0) {
    throw new Error(
      `These expected chunk ids are not in the index (run npm run rag:index, or fix the dataset): ${missing.join(", ")}`,
    );
  }

  console.log(
    `\n🔎 Retrieval evaluation — ${dataset.cases.length} questions + ${dataset.outOfScope.length} out-of-scope, top ${K}\n`,
  );

  const rows: Array<{ testCase: EvalCase; full: CaseScore; vectorOnly: CaseScore }> = [];
  for (const testCase of dataset.cases) {
    const request = {
      query: testCase.query,
      language: testCase.language,
      level: testCase.level,
      topic: testCase.topic,
      limit: K,
    };
    const full = scoreCase(testCase, await searchKnowledge(request));
    const vectorOnly = scoreCase(testCase, await searchKnowledge({ ...request, vectorOnly: true }));
    rows.push({ testCase, full, vectorOnly });
    const mark = full.hit3 ? "✓" : "✗";
    console.log(
      `${mark} ${testCase.id.padEnd(22)} rank ${String(full.rank ?? "-").padEnd(2)} (vector-only ${String(vectorOnly.rank ?? "-").padEnd(2)}) ` +
        `lang ${pct(full.languagePrecision).padStart(6)}  sim ${full.bestSimilarity}  top: ${full.top3[0]?.id}`,
    );
  }

  const oos = [];
  for (const item of dataset.outOfScope) {
    const response = await searchKnowledge({
      query: item.query,
      language: item.language,
      limit: K,
    });
    oos.push({
      ...item,
      sufficient: response.retrieval.sufficient,
      bestSimilarity: response.retrieval.bestSimilarity,
      top: response.results[0]?.id,
    });
    console.log(
      `${response.retrieval.sufficient ? "✗" : "✓"} ${item.id.padEnd(22)} best similarity ${response.retrieval.bestSimilarity} → ${response.retrieval.sufficient ? "sufficient (should not be)" : "insufficient ✓"}`,
    );
  }

  const full = summarize(rows.map((r) => r.full));
  const vectorOnly = summarize(rows.map((r) => r.vectorOnly));
  const outOfScopeRejected = oos.filter((o) => !o.sufficient).length / Math.max(oos.length, 1);
  const levelCases = rows.filter((r) => r.testCase.level);
  const harderInTop3 = levelCases.reduce((sum, r) => sum + r.full.harderInTop3, 0);

  const checks = [
    { name: "hit@3", value: full.hitAt3, min: dataset.thresholds.hitAt3 },
    { name: "MRR@5", value: full.mrr, min: dataset.thresholds.mrr },
    {
      name: "language precision@5",
      value: full.languagePrecision,
      min: dataset.thresholds.languagePrecision,
    },
    {
      name: "in-scope marked sufficient",
      value: full.inScopeSufficient,
      min: dataset.thresholds.inScopeSufficient,
    },
    {
      name: "out-of-scope rejected",
      value: outOfScopeRejected,
      min: dataset.thresholds.outOfScopeRejected,
    },
  ].map((check) => ({ ...check, passed: check.value >= check.min }));

  console.log("\n                          vector only   vector + metadata");
  for (const key of ["hitAt1", "hitAt3", "hitAt5", "mrr", "languagePrecision"] as const) {
    console.log(
      `  ${key.padEnd(22)} ${pct(vectorOnly[key]).padStart(10)}   ${pct(full[key]).padStart(10)}`,
    );
  }
  console.log(
    `  out-of-scope rejected  ${"".padStart(10)}   ${pct(outOfScopeRejected).padStart(10)}`,
  );
  console.log(
    `  harder-level chunks in top 3 of the ${levelCases.length} level-filtered questions: ${harderInTop3}\n`,
  );
  for (const check of checks) {
    console.log(
      `  ${check.passed ? "PASS" : "FAIL"}  ${check.name}: ${pct(check.value)} (needs ≥ ${pct(check.min)})`,
    );
  }

  const failures = rows.filter((r) => !r.full.hit3);
  const result = {
    generatedAt: new Date().toISOString(),
    model: RAG_CONFIG.embedding.model,
    k: K,
    chunksIndexed: await prisma.knowledgeChunk.count(),
    summary: { full, vectorOnly, outOfScopeRejected, harderInTop3 },
    checks,
    cases: rows.map((r) => ({
      ...r.testCase,
      full: r.full,
      vectorOnly: { rank: r.vectorOnly.rank, languagePrecision: r.vectorOnly.languagePrecision },
    })),
    outOfScope: oos,
  };
  await writeFile(
    `${RAG_PATHS.evaluation}latest-results.json`,
    `${JSON.stringify(result, null, 2)}\n`,
  );
  await writeFile(docsPath, renderMarkdown(result, rows, oos, failures));
  console.log(`\n  Saved backend/evaluation/latest-results.json and docs/RAG_EVALUATION.md\n`);

  if (checks.some((check) => !check.passed)) process.exitCode = 1;
}

function renderMarkdown(
  result: {
    generatedAt: string;
    model: string;
    k: number;
    chunksIndexed: number;
    summary: {
      full: ReturnType<typeof summarize>;
      vectorOnly: ReturnType<typeof summarize>;
      outOfScopeRejected: number;
      harderInTop3: number;
    };
    checks: Array<{ name: string; value: number; min: number; passed: boolean }>;
  },
  rows: Array<{ testCase: EvalCase; full: CaseScore; vectorOnly: CaseScore }>,
  oos: Array<{
    id: string;
    query: string;
    sufficient: boolean;
    bestSimilarity: number;
    top?: string;
  }>,
  failures: Array<{ testCase: EvalCase; full: CaseScore }>,
) {
  const { full, vectorOnly } = result.summary;
  const metric = (label: string, key: keyof typeof full) =>
    `| ${label} | ${pct(vectorOnly[key])} | ${pct(full[key])} |`;
  return `# Vachan — RAG retrieval evaluation

> Generated by \`npm run rag:eval -w backend\` on ${result.generatedAt.slice(0, 10)} — do not edit by hand.
> Model: \`${result.model}\` · chunks indexed: ${result.chunksIndexed} · top-k: ${result.k} · dataset: \`backend/evaluation/retrieval-dataset.json\`

## Summary

| Metric | Vector search only | Vector + metadata (Vachan) |
| --- | --- | --- |
${metric("Hit@1 (correct chunk ranked first)", "hitAt1")}
${metric("Hit@3", "hitAt3")}
${metric("Hit@5", "hitAt5")}
${metric("MRR@5", "mrr")}
${metric("Language precision@5 (results in the right language)", "languagePrecision")}
| Out-of-scope questions rejected (\`sufficient: false\`) | — | ${pct(result.summary.outOfScopeRejected)} |
| Harder-than-requested chunks in the top 3 (level-filtered questions) | — | ${result.summary.harderInTop3} |

**Checks:** ${result.checks.map((c) => `${c.passed ? "✅" : "❌"} ${c.name} ${pct(c.value)} (≥ ${pct(c.min)})`).join(" · ")}

- *Vector search only* = nearest neighbours over all languages, no language filter, no level/topic/word bonuses.
- *Vector + metadata* = language filter (given or inferred from the question) + level/topic/exact-word re-ranking.
- A question is a **hit@k** if any of its expected chunks is in the top k.

## Per question

| Question | Filters | Rank (vector only) | Rank (Vachan) | Best similarity | Top result |
| --- | --- | --- | --- | --- | --- |
${rows
  .map(
    (r) =>
      `| ${r.testCase.query.replace(/\|/g, "/")} | ${[r.testCase.language ? `lang=${r.testCase.language}` : `lang inferred: ${r.full.languageSource}`, r.testCase.level && `level=${r.testCase.level}`, r.testCase.topic && `topic=${r.testCase.topic}`].filter(Boolean).join(", ")} | ${r.vectorOnly.rank ?? "–"} | ${r.full.rank ?? "–"} | ${r.full.bestSimilarity} | \`${r.full.top3[0]?.id ?? "–"}\` |`,
  )
  .join("\n")}

## Out-of-scope questions

| Question | Best similarity | Result |
| --- | --- | --- |
${oos.map((o) => `| ${o.query} | ${o.bestSimilarity} | ${o.sufficient ? "❌ marked sufficient" : "✅ insufficient"} |`).join("\n")}

## Misses (not in the top 3)

${failures.length === 0 ? "None." : failures.map((f) => `- **${f.testCase.query}** — expected ${f.testCase.relevant.map((id) => `\`${id}\``).join(" or ")}, got ${f.full.top3.map((t) => `\`${t.id}\``).join(", ")}`).join("\n")}
`;
}

try {
  await main();
} catch (error) {
  console.error(`\n❌ ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
