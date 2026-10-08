// API tests for the admin dashboard: access control, content editing and publishing,
// vocabulary, knowledge-base notes and re-indexing, analytics and the audit log.
// Needs a migrated + seeded database and rag:index (a test note is embedded and indexed).
// Run with:  npm run test:admin -w backend
import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import { createApp } from "../../src/app.ts";
import { prisma } from "../../src/lib/prisma.ts";

let server: Server;
let base = "";
const stamp = Date.now();
const tokens: Record<string, string> = {}; // "admin" / "learner" → login token
// Content created by the tests, removed again in after().
const created: { lessonId?: string; vocabularyId?: string; knowledgeId?: string } = {};

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Calls the API as "admin", "learner", or anonymously (who = null). */
async function call(method: string, path: string, body?: unknown, who: string | null = "admin") {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(who && tokens[who] ? { Authorization: `Bearer ${tokens[who]}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: (await response.json()) as Json };
}

/** Registers a user, finishes onboarding and stores their token under `who`. */
async function register(who: string) {
  const res = await call(
    "POST",
    "/auth/register",
    { name: who, email: `admin-test-${who}-${stamp}@example.com`, password: "learn1234" },
    null,
  );
  assert.equal(res.status, 201, JSON.stringify(res.body));
  tokens[who] = res.body.token;
  await call(
    "PATCH",
    "/me",
    { languageCode: "te", selfAssessment: "new", onboardingDone: true },
    who,
  );
  return res.body.user.id as string;
}

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
  const adminId = await register("admin");
  await register("learner");
  // Admins are made with the CLI (npm run admin:grant) — here directly in the database.
  await prisma.user.update({ where: { id: adminId }, data: { role: "ADMIN" } });
});

after(async () => {
  if (created.lessonId) await prisma.lesson.deleteMany({ where: { id: created.lessonId } });
  if (created.vocabularyId)
    await prisma.vocabularyItem.deleteMany({ where: { id: created.vocabularyId } });
  if (created.knowledgeId)
    await prisma.knowledgeDocument.deleteMany({ where: { id: created.knowledgeId } });
  await prisma.unit.updateMany({ where: { id: "te-u3" }, data: { isPublished: true } });
  await prisma.user.deleteMany({ where: { email: { contains: `-${stamp}@example.com` } } });
  server.close();
  await prisma.$disconnect();
});

describe("admin authorization", () => {
  it("anonymous → 401, learner → 403, admin → 200", async () => {
    assert.equal((await call("GET", "/admin/languages", undefined, null)).status, 401);
    const learner = await call("GET", "/admin/languages", undefined, "learner");
    assert.equal(learner.status, 403);
    assert.equal(learner.body.error.code, "ADMIN_ONLY");
    const admin = await call("GET", "/admin/languages");
    assert.equal(admin.status, 200);
    assert.equal(admin.body.languages.length >= 6, true);
  });

  it("a learner can't reach any admin route (writes included)", async () => {
    for (const [method, path] of [
      ["POST", "/admin/lessons"],
      ["DELETE", "/admin/lessons/te-u1-l1"],
      ["POST", "/admin/knowledge-reindex"],
      ["GET", "/admin/analytics"],
    ] as const) {
      assert.equal(
        (await call(method, path, method === "GET" ? undefined : {}, "learner")).status,
        403,
        path,
      );
    }
  });
});

describe("content management", () => {
  it("GET /content: the course tree with publish flags and counts", async () => {
    const { status, body } = await call("GET", "/admin/content?language=te");
    assert.equal(status, 200);
    const unit = body.courses[0].units[0];
    assert.equal(unit.lessons[0].id, "te-u1-l1");
    assert.equal(typeof unit.lessons[0].exercises, "number");
    assert.equal(typeof unit.lessons[0].learnersStarted, "number");
  });

  it("creates a lesson (unpublished), refuses to publish it empty", async () => {
    const water = await prisma.vocabularyItem.findFirstOrThrow({
      where: { language: { code: "te" }, script: "నీళ్ళు" },
    });
    const lesson = await call("POST", "/admin/lessons", {
      unitId: "te-u3",
      title: "At the market (test)",
      introText: "Words for shopping.",
      kind: "VOCABULARY",
      vocabularyIds: [water.id],
    });
    assert.equal(lesson.status, 201);
    assert.equal(lesson.body.lesson.isPublished, false);
    created.lessonId = lesson.body.lesson.id;
    const publish = await call("POST", `/admin/lessons/${created.lessonId}/publish`, {
      published: true,
    });
    assert.equal(publish.status, 409);
    assert.equal(publish.body.error.code, "LESSON_EMPTY");
  });

  it("validates exercises with the answer-checker rules", async () => {
    const bad = await call("POST", "/admin/exercises", {
      lessonId: created.lessonId,
      type: "MULTIPLE_CHOICE",
      instruction: "Select the meaning",
      prompt: "నీళ్ళు",
      options: [
        { text: "Water", isCorrect: true },
        { text: "Milk", isCorrect: true },
      ],
    });
    assert.equal(bad.status, 400);
    assert.equal(bad.body.error.code, "INVALID_EXERCISE");
    const good = await call("POST", "/admin/exercises", {
      lessonId: created.lessonId,
      type: "MULTIPLE_CHOICE",
      instruction: "Select the meaning",
      prompt: "నీళ్ళు",
      explanation: "నీళ్ళు (neellu) means water.",
      options: [{ text: "Water", isCorrect: true }, { text: "Milk" }, { text: "Food" }],
    });
    assert.equal(good.status, 201, JSON.stringify(good.body));
  });

  it("publish → learners can load it; unpublish the unit → hidden", async () => {
    const publish = await call("POST", `/admin/lessons/${created.lessonId}/publish`, {
      published: true,
    });
    assert.equal(publish.status, 200);
    const course = await call("GET", "/courses/te-course", undefined, "learner");
    const unit3 = course.body.course.units.find((u: Json) => u.id === "te-u3");
    assert.ok(unit3.lessons.some((l: Json) => l.id === created.lessonId));

    await call("POST", "/admin/units/te-u3/publish", { published: false });
    const hidden = await call("GET", "/courses/te-course", undefined, "learner");
    assert.ok(!hidden.body.course.units.some((u: Json) => u.id === "te-u3"));
    const lesson = await call("GET", "/lessons/te-u3-l1", undefined, "learner");
    assert.equal(lesson.status, 404);
    await call("POST", "/admin/units/te-u3/publish", { published: true });
  });

  it("edits, moves and shows the lesson WITH answers to admins only", async () => {
    const patch = await call("PATCH", `/admin/lessons/${created.lessonId}`, {
      title: "At the market",
    });
    assert.equal(patch.body.lesson.title, "At the market");
    const move = await call("POST", `/admin/lessons/${created.lessonId}/move`, { direction: "up" });
    assert.equal(move.body.moved, true);
    const lesson = await call("GET", `/admin/lessons/${created.lessonId}`);
    assert.equal(lesson.body.lesson.exercises[0].options[0].isCorrect, true);
  });

  it("refuses to delete content with learner progress unless forced", async () => {
    await call("POST", "/lessons/te-u1-l1/start", {}, "learner");
    const refused = await call("DELETE", "/admin/lessons/te-u1-l1");
    assert.equal(refused.status, 409);
    assert.equal(refused.body.error.code, "HAS_LEARNER_DATA");
    const exercise = await call("DELETE", "/admin/exercises/te-u1-l1-e01");
    assert.equal(exercise.status, 409);
  });

  it("vocabulary: create, duplicate → 409, edit, delete", async () => {
    const item = await call("POST", "/admin/vocabulary", {
      languageCode: "te",
      kind: "WORD",
      script: "గాలిపటం",
      romanization: "gaalipatam",
      meaning: "Kite",
      topic: "Hobbies",
    });
    assert.equal(item.status, 201);
    created.vocabularyId = item.body.item.id;
    const duplicate = await call("POST", "/admin/vocabulary", {
      languageCode: "te",
      kind: "WORD",
      script: "గాలిపటం",
      romanization: "gaalipatam",
      meaning: "Kite",
      topic: "Hobbies",
    });
    assert.equal(duplicate.status, 409);
    const edited = await call("PATCH", `/admin/vocabulary/${created.vocabularyId}`, {
      meaning: "Bazaar",
    });
    assert.equal(edited.body.item.meaning, "Bazaar");
    const list = await call("GET", "/admin/vocabulary?language=te&search=bazaar");
    assert.equal(list.body.vocabulary.length, 1);
    assert.equal((await call("DELETE", `/admin/vocabulary/${created.vocabularyId}`)).status, 200);
    created.vocabularyId = undefined;
  });

  it("validates input (bad language code, unknown stage)", async () => {
    assert.equal((await call("POST", "/admin/languages", { code: "Marathi" })).status, 400);
    assert.equal(
      (
        await call("POST", "/admin/units", {
          courseId: "te-course",
          title: "x",
          description: "y",
          stage: "MAGIC",
        })
      ).status,
      400,
    );
  });
});

describe("knowledge-base management (RAG)", () => {
  const body =
    "## Platform — ప్లాట్‌ఫాం (platform)\n\nTo ask which platform a train leaves from in Telugu, say ఈ రైలు ఏ ప్లాట్‌ఫాం? (ee railu e platform? — which platform is this train?).\n\n## Waiting room\n\n<!-- level: beginner -->\n\nThe waiting room at a Telugu railway station is simply called వెయిటింగ్ రూమ్ (waiting room).";
  const noteId = () => encodeURIComponent(created.knowledgeId!);
  // Ids of the chunks a learner's search for the note's topic returns.
  const search = async () =>
    (
      await call(
        "POST",
        "/rag/search",
        { query: "which platform does the train leave from", language: "te" },
        "learner",
      )
    ).body.results.map((r: Json) => r.id as string);

  it("rejects text without ## sections", async () => {
    const res = await call("POST", "/admin/knowledge", {
      languageCode: "te",
      title: "Broken",
      source: "test",
      level: "beginner",
      topic: "travel",
      contentType: "phrase",
      skill: "conversation",
      body: "Just a paragraph without any section heading at all.",
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, "INVALID_KNOWLEDGE_FORMAT");
  });

  it("creates a draft (not searchable) with a chunk preview", async () => {
    const res = await call("POST", "/admin/knowledge", {
      languageCode: "te",
      title: `Railway station test ${stamp}`,
      source: "Vachan admin notes",
      level: "elementary",
      topic: "travel",
      contentType: "phrase",
      skill: "conversation",
      body,
    });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    created.knowledgeId = res.body.document.id;
    assert.equal(res.body.document.status, "DRAFT");
    assert.equal(res.body.document.preview.length, 2);
    assert.equal(res.body.document.preview[1].level, "beginner"); // section override
    assert.ok(!(await search()).some((id: string) => id.startsWith(created.knowledgeId!)));
  });

  it("publish → indexed and found by search; unpublish → gone immediately", async () => {
    const publish = await call("POST", `/admin/knowledge/${noteId()}/publish`, { published: true });
    assert.equal(publish.status, 200, JSON.stringify(publish.body));
    assert.equal(publish.body.chunks, 2);
    assert.ok((await search())[0]!.startsWith(created.knowledgeId!));

    const unpublish = await call("POST", `/admin/knowledge/${noteId()}/publish`, {
      published: false,
    });
    assert.equal(unpublish.body.status, "DRAFT");
    assert.ok(!(await search()).some((id: string) => id.startsWith(created.knowledgeId!)));
  });

  it("editing a published note keeps the old chunks until re-index", async () => {
    await call("POST", `/admin/knowledge/${noteId()}/publish`, { published: true });
    const edit = await call("PATCH", `/admin/knowledge/${noteId()}`, {
      body: `${body}\n\n## Ticket counter\n\nThe ticket counter is the టికెట్ కౌంటర్ (ticket counter).`,
    });
    assert.equal(edit.body.document.needsReindex, true);
    assert.equal(edit.body.document.chunkCount, 2);
    const reindex = await call("POST", `/admin/knowledge/${noteId()}/reindex`);
    assert.equal(reindex.body.chunks, 3);
    const doc = await call("GET", `/admin/knowledge/${noteId()}`);
    assert.equal(doc.body.document.needsReindex, false);
    assert.equal(doc.body.document.chunks.length, 3);
  });

  it("file notes are read-only here (edit in git), but can be unpublished", async () => {
    const edit = await call("PATCH", `/admin/knowledge/${encodeURIComponent("te/idioms")}`, {
      title: "x",
    });
    assert.equal(edit.status, 409);
    assert.equal(edit.body.error.code, "READ_ONLY_DOCUMENT");
    const preview = await call(
      "GET",
      `/admin/knowledge/${encodeURIComponent("te/idioms")}/preview`,
    );
    assert.ok(preview.body.chunks.length > 0);
  });

  it("deletes an admin note", async () => {
    assert.equal((await call("DELETE", `/admin/knowledge/${noteId()}`)).status, 200);
    created.knowledgeId = undefined;
  });
});

describe("analytics & audit", () => {
  it("returns aggregates only — no emails, names or user ids", async () => {
    const { status, body } = await call("GET", "/admin/analytics?days=30");
    assert.equal(status, 200);
    for (const key of [
      "activeLearners",
      "lessons",
      "accuracy",
      "commonMistakes",
      "languages",
      "streaks",
      "tutor",
      "speaking",
    ]) {
      assert.ok(key in body, key);
    }
    assert.ok(Array.isArray(body.lessons.dropOff.lessons));
    const text = JSON.stringify(body);
    assert.ok(!text.includes("@example.com"), "no emails");
    assert.ok(!/"userId"/.test(text), "no user ids");
  });

  it("filters by language and validates the window", async () => {
    assert.equal(
      (await call("GET", "/admin/analytics?days=7&language=te")).body.window.language,
      "te",
    );
    assert.equal((await call("GET", "/admin/analytics?days=9999")).status, 400);
  });

  it("every change is in the audit log", async () => {
    const { body } = await call("GET", "/admin/audit-log");
    const actions = body.entries.map((entry: Json) => entry.action);
    for (const action of [
      "lesson.create",
      "exercise.create",
      "lesson.publish",
      "unit.unpublish",
      "knowledge.publish",
      "knowledge.reindex",
    ]) {
      assert.ok(actions.includes(action), action);
    }
  });
});
