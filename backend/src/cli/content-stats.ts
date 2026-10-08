// Prints how much content is in the database, per language:
//   npm run content:stats -w backend
// Course (units, lessons, exercises, vocabulary) and knowledge base (documents, chunks,
// chunks without an embedding). Run it after `db:seed` and `rag:index`.
import "dotenv/config";
import { prisma } from "../lib/prisma.ts";

type Row = Record<string, string | number>;

async function main() {
  const languages = await prisma.language.findMany({ orderBy: { sortOrder: "asc" } });
  const rows: Row[] = [];
  for (const language of languages) {
    const where = { lesson: { unit: { course: { languageId: language.id } } } };
    const [units, lessons, exercises, words, phrases, letters, documents, chunks, missing] =
      await Promise.all([
        prisma.unit.count({ where: { course: { languageId: language.id } } }),
        prisma.lesson.count({ where: { unit: { course: { languageId: language.id } } } }),
        prisma.exercise.count({ where }),
        prisma.vocabularyItem.count({ where: { languageId: language.id, kind: "WORD" } }),
        prisma.vocabularyItem.count({ where: { languageId: language.id, kind: "PHRASE" } }),
        prisma.vocabularyItem.count({ where: { languageId: language.id, kind: "LETTER" } }),
        prisma.knowledgeDocument.count({
          where: { languageCode: language.code, status: "PUBLISHED" },
        }),
        prisma.knowledgeChunk.count({ where: { languageCode: language.code } }),
        prisma.$queryRaw<
          Array<{ count: bigint }>
        >`SELECT count(*) FROM "KnowledgeChunk" WHERE "languageCode" = ${language.code} AND embedding IS NULL`,
      ]);
    const [categories, topics] = await Promise.all([
      prisma.knowledgeChunk.groupBy({
        by: ["contentType"],
        where: { languageCode: language.code },
      }),
      prisma.knowledgeChunk.groupBy({ by: ["topic"], where: { languageCode: language.code } }),
    ]);
    rows.push({
      language: language.name,
      units,
      lessons,
      exercises,
      words,
      phrases,
      letters,
      "RAG docs": documents,
      "RAG chunks": chunks,
      "content types": categories.length,
      topics: topics.length,
      "no embedding": Number(missing[0]?.count ?? 0),
    });
  }
  console.table(rows);
  const total = (key: string) => rows.reduce((sum, row) => sum + Number(row[key] ?? 0), 0);
  console.log(
    `Total: ${total("lessons")} lessons · ${total("exercises")} exercises · ${total("words") + total("phrases")} words and phrases · ${total("RAG chunks")} knowledge-base chunks`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
