// Browser end-to-end test: one learner's whole journey through the UI (register, placement,
// lesson, review, AI tutor, speaking, role-play), then logging in again to check it was all saved.
// Localhost only. First start the backend with LLM_PROVIDER=mock STT_PROVIDER=mock
// TTS_PROVIDER=mock (npm run dev -w backend) and the frontend, then run: npm test
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { chromium } from "playwright";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE))
  throw new Error("E2E only runs against localhost");
const viewportWidth = Number(process.env.W ?? 1280);
const root = fileURLToPath(new URL("..", import.meta.url));
const envFile = readFileSync(`${root}backend/.env`, "utf8");
const databaseUrl = process.env.DATABASE_URL ?? envFile.match(/^DATABASE_URL="?([^"\n]+)"?/m)?.[1];
const wav = `${root}postman/audio/speech-sample.wav`;
const shots = process.env.E2E_SHOTS; // optional folder for screenshots

// Database connection, used only to look up correct answers and remove the test account.
const db = new pg.Client({ connectionString: databaseUrl?.replace(/\?.*$/, "") });
await db.connect();
const optionsOf = async (exerciseId) =>
  (
    await db.query(`select * from "ExerciseOption" where "exerciseId"=$1 order by "sortOrder"`, [
      exerciseId,
    ])
  ).rows;
const typeOf = async (exerciseId) =>
  (await db.query(`select type from "Exercise" where id=$1`, [exerciseId])).rows[0].type;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: [
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
    `--use-file-for-fake-audio-capture=${wav}`,
  ],
});
const context = await browser.newContext({
  viewport: { width: viewportWidth, height: 900 },
  permissions: ["microphone"],
  timezoneId: "Asia/Kolkata",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
let step = 0;
// Logs a passed step (and saves a screenshot when E2E_SHOTS is set).
const passStep = async (message) => {
  step += 1;
  console.log(`✓ ${String(step).padStart(2)}. ${message}`);
  if (shots)
    await page.screenshot({
      path: `${shots}/${String(step).padStart(2, "0")}.png`,
      fullPage: true,
    });
};
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// The answer button whose label starts with `text`.
const optionButton = (text) =>
  page.getByRole("button", { name: new RegExp(`^${escapeRegExp(text)}(\\s|$)`) }).first();

/** Fills in the exercise on screen right or wrong, using the options stored in the database. */
async function fillIn(exerciseId, correct) {
  const exerciseOptions = await optionsOf(exerciseId);
  const type = await typeOf(exerciseId);
  if (type === "MATCHING") {
    for (const o of exerciseOptions) {
      await optionButton(o.text).click();
      await optionButton(o.matchText).click();
    }
  } else if (type === "TRANSLATION") {
    await page
      .getByRole("textbox")
      .fill(correct ? exerciseOptions.find((o) => o.isCorrect).text : "definitely wrong");
  } else if (type === "WORD_ORDER") {
    const words = exerciseOptions
      .filter((o) => o.correctPosition)
      .sort((a, b) => a.correctPosition - b.correctPosition);
    for (const o of correct ? words : [...words].reverse()) {
      await page
        .getByRole("button", { name: `Add ${o.text}`, exact: true })
        .first()
        .click();
    }
  } else {
    await optionButton(exerciseOptions.find((o) => o.isCorrect === correct).text).click();
  }
}

/** Answers the exercise on screen right or wrong and presses Check. */
async function answer(exerciseId, correct) {
  await fillIn(exerciseId, correct);
  await page.getByRole("button", { name: "Check" }).click();
}

const email = `e2e-${viewportWidth}-${Date.now()}@example.com`;
const password = "learn1234";
let exitCode = 0;
try {
  // Landing → Register
  await page.goto(BASE);
  await page
    .getByRole("link", { name: /Get started|Start learning/i })
    .first()
    .click();
  await page.waitForURL("**/register");
  await page.getByLabel("Your name").fill("Asha");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/onboarding");
  await passStep("landing → register → onboarding");

  // Language + self-assessment → placement
  await page.getByRole("radio", { name: /^Telugu/ }).check({ force: true });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("radio", { name: /^Travel/ }).check({ force: true });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("radio", { name: /alphabet\/script/ }).check({ force: true });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue to placement" }).click();
  await page.waitForURL("**/placement");
  await passStep("selected Telugu + self-assessment “I know the script” → placement");

  // Placement: knows every tested unit except Unit 4 (first words) → recommended Unit 4
  await page.getByRole("button", { name: "Start the test" }).click();
  const { rows: placement } = await db.query(
    `select pq."exerciseId", pq."unitNumber" from "PlacementQuestion" pq join "Language" l on l.id=pq."languageId" where l.code='te' order by pq."sortOrder"`,
  );
  for (const [i, question] of placement.entries()) {
    const label = await page
      .getByText(/^Unit \d+ · /)
      .first()
      .textContent();
    assert(
      Number(label.match(/Unit (\d+)/)[1]) === question.unitNumber,
      `question ${i + 1}: ${label}`,
    );
    await fillIn(question.exerciseId, question.unitNumber !== 4);
    const last = i === placement.length - 1;
    await page.getByRole("button", { name: last ? "See my result" : "Next", exact: true }).click();
    if (!last) await page.getByText(`${i + 2} / ${placement.length}`).waitFor();
  }
  await page.getByRole("heading", { name: /ready for Unit 4/ }).waitFor();
  await page.getByRole("button", { name: "Start at Unit 4" }).click();
  await page.waitForURL("**/learn");
  await page.getByText("17 / 95 lessons").waitFor();
  await passStep("placement → Unit 4 recommended and accepted; learning path shows 17 / 95");

  // Lesson + exercises: one mistake, then everything right
  await page.goto(`${BASE}/lesson/te-u4-l1`);
  await page.getByRole("button", { name: "Let's start" }).click();
  const { rows: exercises } = await db.query(
    `select id from "Exercise" where "lessonId"='te-u4-l1' order by "sortOrder"`,
  );
  await answer(exercises[0].id, false);
  await page.getByText("Not quite").waitFor();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  // The missed exercise comes back at the end of the lesson.
  for (const exercise of [...exercises.slice(1), exercises[0]]) {
    await answer(exercise.id, true);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await page.getByText("Lesson complete!").waitFor();
  await passStep("lesson te-u4-l1: one wrong answer, then completed");

  // XP + streak in the top bar
  await page.getByRole("link", { name: "Continue" }).click();
  await page.waitForURL("**/learn");
  await page
    .getByTitle(/total XP/)
    .first()
    .waitFor();
  await page.getByTitle("1 day streak").first().waitFor();
  const xp = await page
    .getByTitle(/total XP/)
    .first()
    .getAttribute("title");
  await passStep(`XP and streak updated (${xp}, 1 day streak)`);

  // Review the mistake
  await page.goto(`${BASE}/practice`);
  await page.getByRole("heading", { name: "Review your mistakes" }).waitFor();
  await page.getByText("1 to review").waitFor();
  await page.getByRole("link", { name: "Start review" }).click();
  await page.waitForURL("**/review");
  await page.getByRole("button", { name: "Let's start" }).click();
  await answer(exercises[0].id, true);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByText("Review complete!").waitFor();
  await passStep("review: the mistake was practised and cleared");

  // AI Tutor (RAG-grounded answer with sources)
  await page.goto(`${BASE}/tutor`);
  await page.getByRole("button", { name: "How do I say hello in Telugu?" }).click();
  await page.getByText(/According to the Vachan notes/).waitFor({ timeout: 30000 });
  await page
    .getByText(/Sources \(\d\)/)
    .first()
    .waitFor();
  await passStep("AI Tutor answered from the knowledge base, with sources");

  // Speaking: record → speech-to-text → feedback
  await page.goto(`${BASE}/speak`);
  await page.getByRole("tab", { name: "Speak" }).click();
  // The word list is grouped by lesson: open the Greetings lesson first.
  await page.getByLabel("Lesson").selectOption({ label: "Unit 4 · Greetings" });
  await page
    .getByRole("button", { name: /^నమస్కారం/ })
    .first()
    .click();
  await page.getByRole("button", { name: "Record yourself" }).click();
  await page.waitForTimeout(2500);
  await page.getByRole("button", { name: "Stop recording" }).click();
  await page.getByText("Speech-to-text heard").waitFor({ timeout: 30000 });
  await page.getByText("Matches the phrase").waitFor();
  await passStep("speaking exercise: recorded, transcribed and evaluated");

  // Conversation role-play
  await page.getByRole("tab", { name: "Conversation" }).click();
  const card = page.locator("li", { has: page.getByRole("heading", { name: "At a restaurant" }) });
  await card.getByRole("button", { name: "Start" }).click();
  await page.getByLabel(/Your reply in Telugu/).fill("నాకు భోజనం కావాలి");
  await page.getByRole("button", { name: "Send reply" }).click();
  await page.getByText("Understood").first().waitFor({ timeout: 30000 });
  await page.getByRole("button", { name: "End role-play" }).click();
  await page.getByRole("heading", { name: "Session summary" }).waitFor({ timeout: 30000 });
  await passStep("conversation: reply → partner answer → session summary");

  // Progress
  await page.goto(`${BASE}/profile`);
  await page.getByText(/of 8 earned/).waitFor();
  await page.getByText(/18 of 95 lessons completed/).waitFor();
  await passStep("profile shows progress (18 of 95 lessons) and badges");

  // Logout → login again → data persisted
  const xpBefore = await page
    .getByTitle(/total XP/)
    .first()
    .getAttribute("title"); // review added a little XP
  await page.getByRole("button", { name: "Log out" }).click();
  await page.waitForURL(`${BASE}/`);
  await page.goto(`${BASE}/learn`);
  await page.waitForURL("**/login**");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: /Log in/i }).click();
  await page.waitForURL("**/learn");
  await page.getByText("18 / 95 lessons").waitFor();
  await page.getByTitle(xpBefore).first().waitFor();
  await page.getByTitle("1 day streak").first().waitFor();
  await page.goto(`${BASE}/tutor`);
  await page.getByText(/Ask me anything about Telugu/).waitFor();
  if ((await page.getByRole("button", { name: "Chats" }).count()) > 0)
    await page.getByRole("button", { name: "Chats" }).click();
  await page
    .getByRole("navigation", { name: "Tutor conversations" })
    .getByText("How do I say hello in Telugu?")
    .first()
    .waitFor();
  await page.goto(`${BASE}/speak`);
  await page.getByRole("tab", { name: "Conversation" }).click();
  await page.getByText("Recent role-plays").waitFor();
  await passStep(
    "logout → login again: lessons, XP, streak, tutor chat and role-play are all still there",
  );
} catch (error) {
  exitCode = 1;
  console.error(
    `✗ step ${step + 1} failed: ${String(error.message)
      .split("\n")
      .slice(0, process.env.E2E_DEBUG ? 12 : 1)
      .join("\n")}`,
  );
  if (shots) await page.screenshot({ path: `${shots}/FAILED.png`, fullPage: true });
} finally {
  await db.query(`delete from "User" where email=$1`, [email]); // clean up the throw-away account
  await db.end();
  await browser.close();
}
if (errors.length) console.log("page errors:", errors);
console.log(exitCode ? "E2E FAILED" : `E2E PASSED — ${step} steps`);
process.exit(exitCode);
