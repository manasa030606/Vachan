// Unit tests for the pure RAG pipeline steps (no database, no model).
// The retrieval quality itself is tested by `npm run rag:eval` / `npm run test:rag`.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chunkDocument, slugify, splitLongText } from "./chunking.ts";
import { cleanText } from "./cleaning.ts";
import { loadKnowledgeFiles } from "./content-loader.ts";
import { KnowledgeFormatError, parseKnowledgeFile, parseMetaComment } from "./document-parser.ts";
import { detectScripts, inferLanguage, nativeTerms } from "./language-detect.ts";
import { compareLevels, rankCandidates } from "./ranking.ts";
import { toVectorLiteral } from "./vector-store.ts";

const SAMPLE = `---
language: te
title: Telugu greetings
type: phrase
level: beginner
skill: conversation
topic: greetings
source: Vachan curated notes
---

# Telugu greetings

## Hello — నమస్కారం (namaskaaram)

Say **నమస్కారం** (namaskaaram).

## How are you? — ఎలా ఉన్నారు?

<!-- topic: everyday-phrases; level: elementary -->

మీరు ఎలా ఉన్నారు?
`;

describe("cleaning", () => {
  it("normalises Unicode to NFC so identical letters have identical bytes", () => {
    // Malayalam "ko": one code point for the vowel sign (U+0D4A) or two (U+0D46 + U+0D3E).
    const twoCodePoints = "\u0D15\u0D46\u0D3E";
    assert.equal(cleanText(twoCodePoints), "\u0D15\u0D4A");
  });

  it("removes markdown decoration, comments and extra whitespace but keeps the words", () => {
    assert.equal(
      cleanText("Say **నమస్కారం**  <!-- note -->\n\n\n\n_politely_ and `this`."),
      "Say నమస్కారం\n\npolitely and this.",
    );
  });

  it("removes zero-width spaces but keeps ZWJ/ZWNJ (they change how letters are drawn)", () => {
    assert.equal(cleanText("a​b"), "ab");
    assert.equal(cleanText("ന‍ന"), "ന‍ന");
  });
});

describe("document parsing", () => {
  it("reads front matter defaults and per-section overrides", () => {
    const document = parseKnowledgeFile("te/phrases.md", SAMPLE);
    assert.equal(document.id, "te/phrases");
    assert.equal(document.languageCode, "te");
    assert.equal(document.defaults.contentType, "phrase");
    assert.equal(document.sections.length, 2);
    assert.deepEqual(document.sections[1]!.overrides, {
      topic: "everyday-phrases",
      level: "elementary",
    });
  });

  it("rejects unknown metadata values with the file name in the message", () => {
    assert.throws(
      () => parseMetaComment("te/x.md", "<!-- level: expert -->"),
      KnowledgeFormatError,
    );
    assert.throws(
      () => parseKnowledgeFile("te/x.md", SAMPLE.replace("language: te", "language: fr")),
      /te\/x\.md: language "fr"/,
    );
  });
});

describe("chunking", () => {
  it("makes one chunk per ## section with stable ids, metadata and context", () => {
    const chunks = chunkDocument(parseKnowledgeFile("te/phrases.md", SAMPLE));
    assert.equal(chunks.length, 2);
    assert.equal(chunks[0]!.id, "te/phrases#hello-namaskaaram");
    assert.equal(chunks[0]!.topic, "greetings");
    assert.equal(chunks[1]!.topic, "everyday-phrases");
    assert.equal(chunks[1]!.level, "elementary");
    assert.equal(chunks[1]!.skill, "conversation"); // default kept
    assert.equal(chunks[0]!.content, "Say నమస్కారం (namaskaaram).");
    assert.match(chunks[0]!.embeddingText, /^Telugu — Telugu greetings — Hello/);
    assert.equal(chunks[0]!.reference, "backend/knowledge-base/te/phrases.md#hello-namaskaaram");
  });

  it("only splits sections that are too long, at paragraph boundaries", () => {
    const paragraph = "word ".repeat(50).trim();
    const parts = splitLongText([paragraph, paragraph, paragraph].join("\n\n"), 600);
    assert.equal(parts.length, 2);
    assert.ok(parts.every((part) => part.length <= 600));
    assert.deepEqual(splitLongText("short", 600), ["short"]);
  });

  it("slugs keep only the English letters of a heading", () => {
    assert.equal(slugify("I don't understand — నాకు అర్థం కాలేదు"), "i-dont-understand");
    assert.equal(slugify("నమస్కారం"), "");
  });

  it("every real knowledge-base file parses, and chunk ids are unique", async () => {
    const documents = await loadKnowledgeFiles();
    assert.ok(documents.length >= 60, `expected 10 files × 6 languages, got ${documents.length}`);
    const chunks = documents.flatMap((document) => chunkDocument(document));
    assert.equal(new Set(chunks.map((chunk) => chunk.id)).size, chunks.length);
    for (const code of ["hi", "te", "ta", "ml", "kn", "bn"]) {
      assert.ok(chunks.filter((chunk) => chunk.languageCode === code).length >= 40, code);
    }
  });
});

describe("language detection", () => {
  it("uses a language named in the question", () => {
    assert.deepEqual(inferLanguage("How do I say hello in Telugu?"), {
      code: "te",
      reason: "named-in-query",
    });
    assert.deepEqual(inferLanguage("bangla numbers"), { code: "bn", reason: "named-in-query" });
  });

  it("uses the script of native words in the question", () => {
    assert.deepEqual(inferLanguage("What does அம்மா mean?"), {
      code: "ta",
      reason: "script-in-query",
    });
    assert.deepEqual(detectScripts("नमस्ते నమస్కారం"), ["hi", "te"]);
  });

  it("gives up (searches all languages) when unclear", () => {
    assert.equal(inferLanguage("How do I say thank you?"), null);
    assert.equal(inferLanguage("Hindi or Tamil?"), null);
  });

  it("extracts native-script words for exact matching", () => {
    assert.deepEqual(nativeTerms("What is అమ్మ and అమ్మ?"), ["అమ్మ"]);
  });
});

describe("ranking", () => {
  const candidate = (id: string, similarity: number, level: string, topic = "x", content = "") => ({
    id,
    similarity,
    level,
    topic,
    content,
    heading: id,
  });

  it("compares chunk level with learner level", () => {
    assert.equal(compareLevels("BEGINNER", "elementary"), "easier");
    assert.equal(compareLevels("ELEMENTARY", "elementary"), "exact");
    assert.equal(compareLevels("INTERMEDIATE", "beginner"), "harder");
    assert.equal(compareLevels("BEGINNER", undefined), "not-requested");
  });

  it("prefers the learner's level and topic when similarities are close", () => {
    const ranked = rankCandidates(
      [candidate("hard", 0.86, "INTERMEDIATE"), candidate("right", 0.85, "BEGINNER", "greetings")],
      { level: "beginner", topic: "greetings", terms: [] },
    );
    assert.deepEqual(
      ranked.map((chunk) => chunk.id),
      ["right", "hard"],
    );
    assert.equal(ranked[0]!.relevance.levelMatch, "exact");
    assert.equal(ranked[0]!.relevance.topicMatch, true);
  });

  it("does not let metadata rescue a clearly unrelated chunk", () => {
    const ranked = rankCandidates(
      [
        candidate("relevant", 0.9, "INTERMEDIATE"),
        candidate("unrelated", 0.8, "BEGINNER", "greetings"),
      ],
      { level: "beginner", topic: "greetings", terms: [] },
    );
    assert.equal(ranked[0]!.id, "relevant");
  });

  it("boosts chunks that contain the exact native word from the question", () => {
    const ranked = rankCandidates(
      [
        candidate("other", 0.86, "BEGINNER"),
        candidate("amma", 0.84, "BEGINNER", "family", "అమ్మ (amma, mother)"),
      ],
      { terms: ["అమ్మ"] },
    );
    assert.equal(ranked[0]!.id, "amma");
    assert.deepEqual(ranked[0]!.relevance.matchedTerms, ["అమ్మ"]);
  });
});

describe("vector storage", () => {
  it("formats vectors the way pgvector expects", () => {
    assert.equal(toVectorLiteral([0.1, -0.25, 1]), "[0.1,-0.25,1]");
  });
});
