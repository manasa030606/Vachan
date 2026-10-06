// API test for the RAG retrieval endpoints (Phase 5).
// Needs: migrated + seeded database, `npm run rag:index -w backend`, and the embedding model
// (downloaded on first use). Run with:  npm run test:rag -w backend
import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import { createApp } from "../../src/app.ts";
import { prisma } from "../../src/lib/prisma.ts";

let server: Server;
let base = "";
let token = "";

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

async function call(method: string, path: string, body?: unknown, auth = true) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: (await response.json()) as Json };
}

const search = (body: unknown) => call("POST", "/api/rag/search", body);
const topIds = (body: Json, n = 3) =>
  (body.results as Json[]).slice(0, n).map((r) => r.id as string);

before(async () => {
  server = createApp().listen(0);
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const email = `rag-${Date.now()}@example.com`;
  const register = await call(
    "POST",
    "/api/auth/register",
    { name: "RAG Test", email, password: "learn1234" },
    false,
  );
  assert.equal(register.status, 201, JSON.stringify(register.body));
  token = register.body.token;

  // Fail early with a clear reason instead of six confusing 503s.
  const stats = await call("GET", "/api/rag/stats");
  assert.equal(stats.status, 200, JSON.stringify(stats.body));
  assert.ok(
    stats.body.knowledgeBase.searchEnabled,
    `RAG search is OFF in this process (NODE_ENV=${process.env.NODE_ENV ?? "not set"}, RAG_ENABLED=${process.env.RAG_ENABLED ?? "not set"}). ` +
      "Run the tests with your local settings: `unset NODE_ENV DATABASE_URL RAG_ENABLED`, then try again.",
  );
  assert.ok(
    stats.body.knowledgeBase.chunks > 0,
    "Nothing indexed yet: run npm run rag:index -w backend",
  );
});

after(async () => {
  await prisma.user.deleteMany({ where: { email: { startsWith: "rag-" } } });
  server.close();
  await prisma.$disconnect();
});

describe("RAG retrieval API", () => {
  it("requires login", async () => {
    const response = await call("POST", "/api/rag/search", { query: "hello" }, false);
    assert.equal(response.status, 401);
  });

  it("GET /api/rag/stats shows every language indexed with embeddings", async () => {
    const { status, body } = await call("GET", "/api/rag/stats");
    assert.equal(status, 200);
    assert.deepEqual(Object.keys(body.knowledgeBase.byLanguage).sort(), [
      "bn",
      "hi",
      "kn",
      "ml",
      "ta",
      "te",
    ]);
    assert.equal(body.knowledgeBase.chunksWithoutEmbedding, 0);
    assert.equal(body.knowledgeBase.dimensions, 384);
  });

  it('"How do I say hello in Telugu?" → Telugu greeting chunk, language inferred', async () => {
    const { status, body } = await search({ query: "How do I say hello in Telugu?" });
    assert.equal(status, 200, JSON.stringify(body));
    assert.deepEqual(body.filters.language, { code: "te", source: "named-in-query" });
    assert.ok(topIds(body).includes("te/phrases#hello-namaskaaram"), topIds(body).join(", "));
    assert.ok(body.results.every((r: Json) => r.metadata.language === "te"));
    assert.equal(body.retrieval.sufficient, true);
    const first = body.results[0];
    for (const key of ["language", "level", "topic", "skill", "contentType", "source"]) {
      assert.ok(key in first.metadata, key);
    }
    assert.match(first.reference, /^backend\/knowledge-base\/te\/|^course:te/);
  });

  it('"What is this Telugu word? అమ్మ" → family vocabulary with the exact word matched', async () => {
    const { body } = await search({ query: "What is this Telugu word? అమ్మ" });
    const top = topIds(body);
    assert.ok(
      top.includes("te/vocabulary#family-words") ||
        top.includes("course/te/vocabulary#course-vocabulary-family"),
      top.join(", "),
    );
    assert.ok(body.results.some((r: Json) => r.relevance.matchedTerms.includes("అమ్మ")));
  });

  it("beginner grammar concept → word-order chunk, nothing harder than the level in the top 3", async () => {
    const { body } = await search({
      query:
        "Explain this beginner grammar concept: why does the verb come at the end of a sentence?",
      language: "te",
      level: "beginner",
    });
    assert.equal(topIds(body, 1)[0], "te/grammar#word-order-subject-object-verb");
    assert.ok(body.results.slice(0, 3).every((r: Json) => r.relevance.levelMatch !== "harder"));
  });

  it("language filter is strict: a Hindi question never returns another language", async () => {
    const { body } = await search({ query: "How do I say thank you?", language: "hi", limit: 10 });
    assert.equal(body.results.length, 10);
    assert.ok(body.results.every((r: Json) => r.metadata.language === "hi"));
  });

  it("out-of-scope question is marked insufficient", async () => {
    const { body } = await search({ query: "What is the capital of France?" });
    assert.equal(body.retrieval.sufficient, false);
  });

  it("validates input", async () => {
    assert.equal((await search({ query: "" })).status, 400);
    assert.equal((await search({ query: "hello", language: "fr" })).status, 400);
    assert.equal((await search({ query: "hello", level: "expert" })).status, 400);
    assert.equal((await search({ query: "hello", topic: "Not A Slug" })).status, 400);
    assert.equal((await search({ query: "hello", unknown: 1 })).status, 400);
  });
});
