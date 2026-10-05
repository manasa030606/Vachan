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

/** Starts a lesson and answers every exercise correctly. */
async function completeLesson(lessonId: string) {
  await call("POST", `/lessons/${lessonId}/start`);
  const lesson = await call("GET", `/lessons/${lessonId}`);
  for (const exercise of lesson.body.lesson.exercises) {
    await call("POST", `/exercises/${exercise.id}/attempt`, {
      answer: await correctAnswerFor(exercise.id),
    });
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

  it("8. course detail: 4 units, first lesson available, the rest locked", async () => {
    const result = await call("GET", "/courses/te-course");
    assert.equal(result.status, 200);
    const course = result.body.course;
    assert.equal(course.units.length, 4);
    const lessons = course.units.flatMap((unit: Json) => unit.lessons);
    assert.equal(lessons.length, 16);
    assert.equal(lessons[0].status, "available");
    assert.ok(lessons.slice(1).every((lesson: Json) => lesson.status === "locked"));
    assert.equal(course.progress.currentLessonId, "te-u1-l1");
    assert.equal(course.units[0].status, "active");
    assert.equal(course.units[1].status, "locked");
    assert.equal((await call("GET", "/courses/nope")).status, 404);
  });

  it("9. lesson: exercises without answers; locked lesson → 403; unknown → 404", async () => {
    const lesson = await call("GET", "/lessons/te-u1-l1");
    assert.equal(lesson.status, 200);
    const text = JSON.stringify(lesson.body);
    for (const secret of ["isCorrect", "correctPosition", "explanation"]) {
      assert.ok(!text.includes(secret), `${secret} must not leak`);
    }
    assert.equal(lesson.body.lesson.progress.status, "NOT_STARTED");
    assert.equal(lesson.body.lesson.exercises[0].type, "character-sound");
    assert.equal((await call("GET", "/lessons/te-u1-l2")).status, 403);
    assert.equal((await call("POST", "/lessons/te-u1-l2/start")).status, 403);
    assert.equal((await call("GET", "/lessons/does-not-exist")).status, 404);
  });

  it("10. starting a lesson records it and makes it 'current'", async () => {
    const started = await call("POST", "/lessons/te-u1-l1/start");
    assert.equal(started.status, 200);
    assert.equal(started.body.resumed, false);
    assert.equal(started.body.progress.status, "IN_PROGRESS");
    const course = await call("GET", "/courses/te-course");
    assert.equal(course.body.course.units[0].lessons[0].status, "current");
  });

  it("11. attempts are saved with feedback; leaving and coming back resumes the lesson", async () => {
    const wrongOption = await prisma.exerciseOption.findFirstOrThrow({
      where: { exerciseId: "te-u1-l1-e1", isCorrect: false },
    });
    const wrong = await call("POST", "/exercises/te-u1-l1-e1/attempt", {
      answer: { optionId: wrongOption.id },
    });
    assert.equal(wrong.status, 201);
    assert.equal(wrong.body.attempt.isCorrect, false);
    assert.equal(wrong.body.attempt.correctAnswer, "a");
    assert.match(wrong.body.attempt.explanation, /అ is “a”/);
    assert.equal(wrong.body.lessonProgress.incorrectAttempts, 1);

    for (const id of ["te-u1-l1-e1", "te-u1-l1-e2"]) {
      const right = await call("POST", `/exercises/${id}/attempt`, {
        answer: await correctAnswerFor(id),
      });
      assert.equal(right.body.attempt.isCorrect, true, id);
    }

    // "Come back later": start again → resume with two exercises already done.
    const resumed = await call("POST", "/lessons/te-u1-l1/start");
    assert.equal(resumed.body.resumed, true);
    assert.deepEqual(resumed.body.progress.completedExerciseIds.sort(), [
      "te-u1-l1-e1",
      "te-u1-l1-e2",
    ]);
  });

  it("12. answering the last exercise completes the lesson", async () => {
    let last: Json = {};
    for (const id of ["te-u1-l1-e3", "te-u1-l1-e4"]) {
      last = await call("POST", `/exercises/${id}/attempt`, { answer: await correctAnswerFor(id) });
    }
    const progress = last.body.lessonProgress;
    assert.equal(progress.justCompleted, true);
    assert.equal(progress.status, "COMPLETED");
    assert.equal(progress.timesCompleted, 1);
    assert.equal(progress.correctAttempts, 4);
    assert.equal(progress.incorrectAttempts, 1);
    assert.equal(progress.accuracy, 80); // 4 right out of 5 answers
  });

  it("13. completing a lesson unlocks the next one", async () => {
    const course = await call("GET", "/courses/te-course");
    const lessons = course.body.course.units.flatMap((unit: Json) => unit.lessons);
    assert.equal(lessons[0].status, "completed");
    assert.equal(lessons[1].status, "available");
    assert.equal(lessons[2].status, "locked");
    assert.equal(course.body.course.progress.currentLessonId, "te-u1-l2");
    assert.equal((await call("GET", "/lessons/te-u1-l2")).status, 200);
  });

  it("14. practising a completed lesson starts a fresh run and keeps it completed", async () => {
    const again = await call("POST", "/lessons/te-u1-l1/start");
    assert.equal(again.body.resumed, false);
    assert.equal(again.body.progress.status, "COMPLETED");
    assert.deepEqual(again.body.progress.completedExerciseIds, []);
  });

  it("15. typed answers ignore capitals and spaces; wrong format → 400", async () => {
    await completeLesson("te-u1-l2");
    await completeLesson("te-u1-l3");
    for (const text of ["EE", " i i "]) {
      const result = await call("POST", "/exercises/te-u1-l4-e5/attempt", { answer: { text } });
      assert.equal(result.body.attempt.isCorrect, true, text);
    }
    const wrong = await call("POST", "/exercises/te-u1-l4-e5/attempt", { answer: { text: "u" } });
    assert.equal(wrong.body.attempt.isCorrect, false);
    const badFormat = await call("POST", "/exercises/te-u1-l1-e1/attempt", {
      answer: { text: "aa" },
    });
    assert.equal(badFormat.status, 400);
    assert.equal(badFormat.body.error.code, "INVALID_ANSWER_FORMAT");
  });

  it("16. review lists open mistakes and incorrect attempts (no answers in the session)", async () => {
    const review = await call("GET", "/review?languageCode=te");
    assert.equal(review.status, 200);
    assert.equal(review.body.review.openMistakes, 2);
    const ids = review.body.review.mistakes.map((mistake: Json) => mistake.exerciseId);
    assert.deepEqual(ids, ["te-u1-l4-e5", "te-u1-l1-e1"]); // newest first
    assert.equal(review.body.review.mistakes[0].yourAnswer, "u");
    assert.equal(review.body.review.mistakes[0].correctAnswer, "ii");
    assert.ok(review.body.review.learnedVocabulary.length >= 6);

    const attempts = await call("GET", "/review/attempts?languageCode=te&limit=10");
    assert.equal(attempts.body.attempts.length, 2);

    const session = await call("GET", "/review/session?languageCode=te");
    assert.equal(session.body.session.exercises.length, 2);
    assert.ok(!JSON.stringify(session.body).includes("isCorrect"));
    assert.equal((await call("GET", "/review", undefined, false)).status, 401);
  });

  it("17. a correct review answer clears the mistake without changing lesson counters", async () => {
    const before = await call("GET", "/progress/te-u1-l1");
    const result = await call("POST", "/exercises/te-u1-l1-e1/attempt", {
      answer: await correctAnswerFor("te-u1-l1-e1"),
      mode: "review",
    });
    assert.equal(result.status, 201);
    assert.equal(result.body.attempt.mode, "review");
    const afterwards = await call("GET", "/progress/te-u1-l1");
    assert.equal(afterwards.body.progress.correctAttempts, before.body.progress.correctAttempts);
    assert.equal(afterwards.body.progress.exercises[0].reviewAttempts, 1);

    const review = await call("GET", "/review?languageCode=te");
    assert.equal(review.body.review.openMistakes, 1);
    assert.equal(review.body.review.resolvedMistakes, 1);
  });

  it("18. progress summary, resume point and per-lesson progress", async () => {
    await call("POST", "/lessons/te-u1-l4/start");
    const summary = await call("GET", "/progress");
    assert.equal(summary.status, 200);
    const { totals, resume, courses } = summary.body.progress;
    assert.equal(totals.lessonsCompleted, 3);
    assert.equal(totals.lessonsInProgress, 1);
    assert.ok(totals.incorrectAnswers >= 2);
    assert.ok(totals.lastActivityAt);
    assert.equal(resume.lessonId, "te-u1-l4");
    assert.equal(
      courses.find((course: Json) => course.courseId === "te-course").completedLessons,
      3,
    );

    const lesson = await call("GET", "/progress/te-u1-l1");
    assert.equal(lesson.body.progress.status, "COMPLETED");
    assert.equal(lesson.body.progress.exercises.length, 4);
    const untouched = await call("GET", "/progress/hi-u1-l1");
    assert.equal(untouched.body.progress.status, "NOT_STARTED");
  });

  it("19. logout invalidates the token", async () => {
    const result = await call("POST", "/auth/logout");
    assert.equal(result.status, 200);
    assert.equal((await call("GET", "/me")).status, 401);
  });
});
