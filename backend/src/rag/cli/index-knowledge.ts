// npm run rag:index -w backend            → index new/changed documents
// npm run rag:index -w backend -- --force → re-embed everything
import { prisma } from "../../lib/prisma.ts";
import { RAG_CONFIG } from "../config.ts";
import { indexKnowledgeBase } from "../indexer.ts";

const force = process.argv.includes("--force");

console.log(
  `\n📚 Indexing the Vachan knowledge base with ${RAG_CONFIG.embedding.model}${force ? " (--force)" : ""}`,
);
console.log("   (the first run loads/downloads the embedding model — this can take a minute)\n");

try {
  const report = await indexKnowledgeBase(prisma, { force, log: (line) => console.log(line) });
  console.log(
    `\n✅ Done in ${report.seconds}s — ${report.documents} documents, ${report.chunks} chunks ` +
      `(${report.embedded.length} documents embedded, ${report.skipped.length} unchanged, ${report.removed.length} removed).`,
  );
  if (report.removed.length > 0) console.log(`   Removed: ${report.removed.join(", ")}`);
  console.log("   Next: npm run rag:eval -w backend\n");
} catch (error) {
  console.error(
    `\n❌ Indexing failed: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
