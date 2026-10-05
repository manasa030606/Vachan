// End-to-end API test: walks through the same order you use in Postman.
// Needs a migrated + seeded database (npm run db:migrate && npm run db:seed).
// Run with:  npm run test:api -w backend
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import type { Server } from "node:http";
import { createApp } from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";

let server: Server;
let base = "";
let token = "";
const email = `test-${Date.now()}@example.com`;
const password = "learn1234";

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

/** Builds the correct answer for an exercise straight from the database (test helper only). */
async function correctAnswerFor(exerciseId: string) {
  const exercise = await prisma.exercise.findUniqueOrThrow({
    where: { id: exerciseId },
    include: { options: true },
  });
  const options = exercise.options;
  switch (exercise.type) {
    case "TRANSLATION":
      return { text: options.find((option) => option.isCorrect)!.text };
    case "WORD_ORDER":
      return {
        optionIds: options
          .filter((option) => option.correctPosition !== null)
          .sort((a, b) => a.correctPosition! - b.correctPosition!)
          .map((option) => option.id),
      };
    case "MATCHING":
      return { pairs: options.map((option) => ({ leftId: option.id, rightId: option.id })) };
    default:
      return { optionId: options.find((option) => option.isCorrect)!.id };
  }
}

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://localhost:${(server.address() as AddressInfo).port}/api`;
});

after(async () => {
  await prisma.user.deleteMany({ where: { email } });
  server.close();
  await prisma.$disconnect();
});

describe("Vachan API (Postman order)", () => {
  it("1. registers a new user (201) and rejects a duplicate (409)", async () => {
    const first = await call(
      "POST",
      "/auth/register",
      { name: "Test User", email, password },
      false,
    );
    assert.equal(first.status, 201);
    assert.equal(first.body.user.email, email);
    assert.equal(first.body.user.passwordHash, undefined, "password hash must never be returned");
    const duplicate = await call(
      "POST",
      "/auth/register",
      { name: "Test User", email, password },
      false,
    );
    assert.equal(duplicate.status, 409);
  });

  it("2. rejects invalid registration data (400)", async () => {
    const result = await call(
      "POST",
      "/auth/register",
      { name: "A", email: "bad", password: "x" },
      false,
    );
    assert.equal(result.status, 400);
    assert.equal(result.body.error.code, "VALIDATION_ERROR");
  });

  it("3. logs in (200) and rejects a wrong password (401)", async () => {
    const wrong = await call("POST", "/auth/login", { email, password: "wrong-pass1" }, false);
    assert.equal(wrong.status, 401);
    const ok = await call("POST", "/auth/login", { email, password }, false);
    assert.equal(ok.status, 200);
    token = ok.body.token;
    assert.ok(token.length > 20);
  });

  it("4. GET /me works with a token and fails without one", async () => {
    assert.equal((await call("GET", "/me", undefined, false)).status, 401);
    const me = await call("GET", "/me");
    assert.equal(me.status, 200);
    assert.equal(me.body.user.profile.displayName, "Test User");
  });

  it("5. PATCH /me saves onboarding choices", async () => {
    const result = await call("PATCH", "/me", {
      languageCode: "te",
      dailyGoal: "serious",
      onboardingDone: true,
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.user.profile.currentLanguage.code, "te");
    assert.equal((await call("PATCH", "/me", { languageCode: "xx" })).status, 400);
  });

  it("6. lists the six languages", async () => {
    const result = await call("GET", "/languages", undefined, false);
    assert.equal(result.status, 200);
    assert.deepEqual(
      result.body.languages.map((language: Json) => language.code),
      ["hi", "te", "ta", "ml", "kn", "bn"],
    );
  });

  it("7. lists courses and filters by language", async () => {
    const all = await call("GET", "/courses", undefined, false);
    assert.equal(all.body.courses.length, 6);
    const telugu = await call("GET", "/courses?languageCode=te", undefined, false);
    assert.equal(telugu.body.courses[0].id, "te-course");
  });

  it("8. course detail: first lesson current, the rest locked", async () => {
    const result = await call("GET", "/courses/te-course");
    assert.equal(result.status, 200);
    const lessons = result.body.course.units.flatMap((unit: Json) => unit.lessons);
    assert.equal(lessons[0].status, "current");
    assert.ok(lessons.slice(1).every((lesson: Json) => lesson.status === "locked"));
    assert.equal((await call("GET", "/courses/nope")).status, 404);
  });

  it("9. lesson: open lesson returns exercises without answers; locked lesson → 403", async () => {
    const lesson = await call("GET", "/lessons/te-u1-l1");
    assert.equal(lesson.status, 200);
    const text = JSON.stringify(lesson.body);
    assert.ok(
      !text.includes("isCorrect") && !text.includes("correctPosition"),
      "answers must not leak",
    );
    assert.equal((await call("GET", "/lessons/te-u2-l1")).status, 403);
    assert.equal((await call("GET", "/lessons/does-not-exist")).status, 404);
  });

  it("10. attempts: wrong answer recorded, then completing every exercise completes the lesson", async () => {
    const wrong = await call("POST", "/exercises/te-u1-l1-e1/attempt", {
      answer: { optionId: "te-u1-l1-e1-o1" },
    });
    assert.equal(wrong.status, 201);
    assert.equal(wrong.body.attempt.isCorrect, false);
    assert.equal(wrong.body.attempt.correctAnswer, "aa");

    const lesson = await call("GET", "/lessons/te-u1-l1");
    let last: Json = {};
    for (const exercise of lesson.body.lesson.exercises) {
      last = await call("POST", `/exercises/${exercise.id}/attempt`, {
        answer: await correctAnswerFor(exercise.id),
      });
      assert.equal(last.status, 201);
      assert.equal(last.body.attempt.isCorrect, true, exercise.id);
    }
    assert.equal(last.body.lessonProgress.status, "COMPLETED");
    assert.equal(last.body.lessonProgress.accuracy, 75); // 3 right out of 4 answers
  });

  it("11. completing a lesson unlocks the next one", async () => {
    const course = await call("GET", "/courses/te-course");
    const lessons = course.body.course.units.flatMap((unit: Json) => unit.lessons);
    assert.equal(lessons[0].status, "completed");
    assert.equal(lessons[1].status, "current");
    assert.equal((await call("GET", "/lessons/te-u1-l2")).status, 200);
  });

  it("12. translation accepts capitals, missing spaces and small typos", async () => {
    // Unlock unit 2 quickly by completing lesson 2.
    const lesson2 = await call("GET", "/lessons/te-u1-l2");
    for (const exercise of lesson2.body.lesson.exercises) {
      await call("POST", `/exercises/${exercise.id}/attempt`, {
        answer: await correctAnswerFor(exercise.id),
      });
    }
    for (const text of ["THANKYOU", "Thnak you"]) {
      const result = await call("POST", "/exercises/te-u2-l1-e3/attempt", { answer: { text } });
      assert.equal(result.body.attempt.isCorrect, true, text);
    }
    const wrong = await call("POST", "/exercises/te-u2-l1-e3/attempt", {
      answer: { text: "water" },
    });
    assert.equal(wrong.body.attempt.isCorrect, false);
  });

  it("13. rejects an answer in the wrong format (400)", async () => {
    const result = await call("POST", "/exercises/te-u1-l1-e1/attempt", { answer: { text: "aa" } });
    assert.equal(result.status, 400);
    assert.equal(result.body.error.code, "INVALID_ANSWER_FORMAT");
  });

  it("14. progress summary and per-lesson progress", async () => {
    const summary = await call("GET", "/progress");
    assert.equal(summary.status, 200);
    assert.equal(summary.body.progress.totals.lessonsCompleted, 2);
    const lesson = await call("GET", "/progress/te-u1-l1");
    assert.equal(lesson.body.progress.status, "COMPLETED");
    assert.equal(lesson.body.progress.completedExercises, 3);
    const untouched = await call("GET", "/progress/hi-u1-l1");
    assert.equal(untouched.body.progress.status, "NOT_STARTED");
  });

  it("15. logout invalidates the token", async () => {
    const result = await call("POST", "/auth/logout");
    assert.equal(result.status, 200);
    assert.equal((await call("GET", "/me")).status, 401);
  });
});
