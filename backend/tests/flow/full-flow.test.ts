// INTEGRATION TEST — one learner's complete journey through the API (Phase 8):
//   register → language → self-assessment → placement → lesson → exercises → progress → XP/streak
//   → review → AI tutor → speaking → conversation → logout → login again → everything persisted
// Uses the offline test doubles for the AI and speech (no key, no internet):
//   npm run test:flow -w backend
// Needs: migrated + seeded database and `npm run rag:index -w backend`.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import { createApp } from "../../src/app.ts";
import { prisma } from "../../src/lib/prisma.ts";

let server: Server;
let base = "";
let token = "";
const email = `flow-${Date.now()}@example.com`;
const password = "learn1234";
const sample = readFileSync(new URL("../../../postman/audio/speech-sample.wav", import.meta.url));

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

async function answerFor(exerciseId: string, correct = true) {
  const exercise = await prisma.exercise.findUniqueOrThrow({
    where: { id: exerciseId },
    include: { options: true },
  });
  const options = exercise.options;
  if (!correct) {
    return exercise.type === "TRANSLATION"
      ? { text: "definitely wrong" }
      : exercise.type === "WORD_ORDER"
        ? { optionIds: [...options].reverse().map((o) => o.id) }
        : exercise.type === "MATCHING"
          ? {
              pairs: options.map((o, i) => ({
                leftId: o.id,
                rightId: options[(i + 1) % options.length]!.id,
              })),
            }
          : { optionId: options.find((o) => !o.isCorrect)!.id };
  }
  switch (exercise.type) {
    case "TRANSLATION":
      return { text: options.find((o) => o.isCorrect)!.text };
    case "WORD_ORDER":
      return {
        optionIds: options
          .filter((o) => o.correctPosition !== null)
          .sort((a, b) => a.correctPosition! - b.correctPosition!)
          .map((o) => o.id),
      };
    case "MATCHING":
      return { pairs: options.map((o) => ({ leftId: o.id, rightId: o.id })) };
    default:
      return { optionId: options.find((o) => o.isCorrect)!.id };
  }
}

before(async () => {
  assert.equal(process.env.LLM_PROVIDER, "mock", "Run with: npm run test:flow -w backend");
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
});

after(async () => {
  await prisma.user.deleteMany({ where: { email } });
  server.close();
  await prisma.$disconnect();
});

describe("a learner's complete journey", () => {
  const remember: Json = {};

  it("1. registers", async () => {
    const res = await call(
      "POST",
      "/auth/register",
      { name: "Flow Learner", email, password },
      false,
    );
    assert.equal(res.status, 201);
    token = res.body.token;
  });

  it("2. chooses Telugu + self-assessment (onboarding)", async () => {
    const res = await call("PATCH", "/me", {
      languageCode: "te",
      selfAssessment: "few-words",
      dailyGoal: "regular",
      onboardingDone: true,
      timeZone: "Asia/Kolkata",
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.user.profile.currentLanguage.code, "te");
  });

  it("3. takes the placement test and starts at the recommended unit", async () => {
    const start = await call("POST", "/placement/start", {});
    assert.equal(start.status, 201);
    const testId = start.body.test.id;
    for (const question of start.body.questions as Json[]) {
      // Knows units 1–2 (letters), not the words and sentences yet.
      const answer = await answerFor(question.exercise.id, question.unit <= 2);
      await call("POST", "/placement/answer", { testId, questionId: question.id, answer });
    }
    const result = await call("GET", `/placement/result?testId=${testId}`);
    assert.equal(result.status, 200);
    assert.equal(result.body.result.recommendedUnit, 3);
    const decide = await call("POST", "/placement/decide", { testId, choice: "recommended" });
    assert.equal(decide.status, 200);
  });

  it("4. learning path: unit 3 is now open", async () => {
    const course = await call("GET", "/courses/te-course");
    const lesson = course.body.course.units[2].lessons[0];
    assert.equal(lesson.status, "available");
    remember.lessonId = lesson.id;
  });

  it("5. lesson + exercises: one mistake, the rest right → completed", async () => {
    const start = await call("POST", `/lessons/${remember.lessonId}/start`);
    assert.equal(start.status, 200);
    const lesson = await call("GET", `/lessons/${remember.lessonId}`);
    const exercises = lesson.body.lesson.exercises as Json[];
    const first = await call("POST", `/exercises/${exercises[0]!.id}/attempt`, {
      answer: await answerFor(exercises[0]!.id, false),
    });
    assert.equal(first.status, 201);
    assert.equal(first.body.attempt.isCorrect, false);
    remember.mistake = exercises[0]!.id;
    let last: Json = {};
    for (const exercise of exercises) {
      last = await call("POST", `/exercises/${exercise.id}/attempt`, {
        answer: await answerFor(exercise.id),
      });
      assert.equal(last.status, 201);
    }
    assert.equal(last.body.lessonProgress.status, "COMPLETED");
  });

  it("6. XP, level and streak were earned", async () => {
    const stats = await call("GET", "/stats");
    assert.ok(stats.body.stats.xp.total > 0);
    assert.equal(stats.body.stats.streak.current, 1);
    remember.xp = stats.body.stats.xp.total;
  });

  it("7. progress shows the completed lesson", async () => {
    const progress = await call("GET", "/progress");
    assert.ok(progress.body.progress.totals.lessonsCompleted >= 1);
    remember.completed = progress.body.progress.totals.lessonsCompleted;
  });

  it("8. review lists the mistake", async () => {
    const review = await call("GET", "/review?languageCode=te");
    assert.equal(review.status, 200);
    assert.ok(JSON.stringify(review.body).includes(remember.mistake));
  });

  it("9. asks the AI tutor (RAG-grounded, with sources)", async () => {
    const res = await call("POST", "/ai/tutor", {
      question: "How do I say hello in Telugu?",
      language: "te",
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.messages[1].status, "answered");
    assert.ok(res.body.messages[1].references.some((r: Json) => r.used));
    remember.tutorId = res.body.conversation.id;
  });

  it("10. speaking exercise: record → transcribe → evaluate → feedback", async () => {
    const form = new FormData();
    form.append(
      "audio",
      new Blob([new Uint8Array(sample)], { type: "audio/wav" }),
      "recording.wav",
    );
    form.append("language", "te");
    form.append("vocabularyItemId", "te-v16-hello");
    const response = await fetch(`${base}/speech/evaluate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const body = (await response.json()) as Json;
    assert.equal(response.status, 200, JSON.stringify(body));
    assert.equal(body.content.verdict, "match");
    assert.ok(body.fluency.rating);
    remember.attemptId = body.attemptId;
  });

  it("11. conversation: start → reply → AI response → end with summary", async () => {
    const start = await call("POST", "/ai/conversation", {
      scenario: "restaurant",
      language: "te",
    });
    assert.equal(start.status, 201);
    const id = start.body.session.id;
    const reply = await call("POST", `/ai/conversation/${id}/reply`, { text: "నాకు భోజనం కావాలి" });
    assert.equal(reply.body.turns[1].speaker, "partner");
    const end = await call("POST", `/ai/conversation/${id}/end`);
    assert.equal(end.body.session.status, "ended");
    assert.equal(end.body.session.summary.stats.replies, 1);
    remember.conversationId = id;
  });

  it("12. logout invalidates the token", async () => {
    const out = await call("POST", "/auth/logout");
    assert.equal(out.status, 200);
    assert.equal((await call("GET", "/me")).status, 401);
  });

  it("13. login again → everything is still there", async () => {
    const login = await call("POST", "/auth/login", { email, password }, false);
    assert.equal(login.status, 200);
    token = login.body.token;
    assert.equal(login.body.user.profile.currentLanguage.code, "te");
    assert.equal((await call("GET", "/stats")).body.stats.xp.total, remember.xp);
    assert.equal(
      (await call("GET", "/progress")).body.progress.totals.lessonsCompleted,
      remember.completed,
    );
    const course = await call("GET", "/courses/te-course");
    assert.equal(course.body.course.units[2].lessons[0].status, "completed");
    const tutor = await call("GET", "/ai/conversations?language=te");
    assert.ok(tutor.body.conversations.some((c: Json) => c.id === remember.tutorId));
    const attempts = await call("GET", "/speech/attempts?language=te");
    assert.ok(attempts.body.attempts.some((a: Json) => a.id === remember.attemptId));
    const roleplays = await call("GET", "/ai/conversation?language=te");
    assert.ok(
      roleplays.body.sessions.some(
        (s: Json) => s.id === remember.conversationId && s.status === "ended",
      ),
    );
  });
});
