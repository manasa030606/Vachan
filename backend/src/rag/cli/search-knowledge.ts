// Quick retrieval check from the terminal (no server, no login):
//   npm run rag:search -w backend -- "How do I say hello in Telugu?"
//   npm run rag:search -w backend -- "What does అమ్మ mean?" --level beginner --topic family --limit 3
import { parseArgs } from "node:util";
import { prisma } from "../../lib/prisma.ts";
import { KNOWLEDGE_LEVELS, type KnowledgeLevelName } from "../config.ts";
import { searchKnowledge } from "../retrieval.service.ts";
import { LANGUAGE_CODES, type LanguageCode } from "../types.ts";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    language: { type: "string" },
    level: { type: "string" },
    topic: { type: "string" },
    limit: { type: "string", default: "5" },
  },
});
const query = positionals.join(" ").trim();

try {
  if (!query)
    throw new Error(
      'Give a question, e.g. npm run rag:search -w backend -- "How do I say hello in Telugu?"',
    );
  if (values.language && !(LANGUAGE_CODES as readonly string[]).includes(values.language))
    throw new Error(`--language must be one of ${LANGUAGE_CODES.join(", ")}`);
  if (values.level && !(KNOWLEDGE_LEVELS as readonly string[]).includes(values.level))
    throw new Error(`--level must be one of ${KNOWLEDGE_LEVELS.join(", ")}`);

  const result = await searchKnowledge({
    query,
    language: values.language as LanguageCode | undefined,
    level: values.level as KnowledgeLevelName | undefined,
    topic: values.topic,
    limit: Number(values.limit),
  });
  console.log(`\nQuestion: ${result.query}`);
  console.log(
    `Language: ${result.filters.language.code ?? "all"} (${result.filters.language.source}) · level: ${result.filters.level ?? "-"} · topic: ${result.filters.topic ?? "-"}`,
  );
  console.log(
    `Best similarity ${result.retrieval.bestSimilarity} → ${result.retrieval.sufficient ? "sufficient" : "NOT sufficient (tutor should not answer from this)"} · ${result.retrieval.tookMs} ms\n`,
  );
  for (const chunk of result.results) {
    const r = chunk.relevance;
    console.log(`#${chunk.rank}  ${chunk.id}`);
    console.log(
      `    score ${r.score} = similarity ${r.similarity} + boost ${r.boost}  (level: ${r.levelMatch}, topic: ${r.topicMatch ?? "-"}, words: ${r.matchedTerms.join(" ") || "-"}, curated: ${r.curated ? "yes" : "no"})`,
    );
    console.log(
      `    ${chunk.metadata.language} · ${chunk.metadata.level} · ${chunk.metadata.contentType} · ${chunk.metadata.topic} · ${chunk.metadata.source}`,
    );
    console.log(`    ${chunk.heading}: ${chunk.content.replace(/\s+/g, " ").slice(0, 160)}…\n`);
  }
} catch (error) {
  console.error(`\n❌ ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
