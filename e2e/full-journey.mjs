// END-TO-END TEST in a real browser (Phase 8) — one learner's whole journey through the UI:
//   Landing → Register → (logout) Login → Select language → Self-assessment → Placement →
//   Learning path → Lesson → Exercises → XP → Streak → Review → AI Tutor → Speaking →
//   Conversation → Progress → Logout → Login again → everything is still there.
//
// Needs the app running locally with the OFFLINE test providers (no API key, no quota):
//   LLM_PROVIDER=mock STT_PROVIDER=mock TTS_PROVIDER=mock npm run dev -w backend
//   npm run dev -w frontend
//   cd e2e && npm install && npm test
// Only for localhost: it creates throw-away accounts (e2e-…@example.com).
// It reads the correct answers from the local database (DATABASE_URL from backend/.env).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { chromium } from "playwright";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE))
  throw new Error("E2E only runs against localhost");
const W = Number(process.env.W ?? 1280);
const root = fileURLToPath(new URL("..", import.meta.url));
const envFile = readFileSync(`${root}backend/.env`, "utf8");
const databaseUrl = process.env.DATABASE_URL ?? envFile.match(/^DATABASE_URL="?([^"\n]+)"?/m)?.[1];
const wav = `${root}postman/audio/speech-sample.wav`;
const shots = process.env.E2E_SHOTS; // optional folder for screenshots

const db = new pg.Client({ connectionString: databaseUrl?.replace(/\?.*$/, "") });
await db.connect();
const options = async (exerciseId) =>
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
  viewport: { width: W, height: 900 },
  permissions: ["microphone"],
  timezoneId: "Asia/Kolkata",
});
const p = await context.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
let step = 0;
const ok = async (message) => {
  step += 1;
  console.log(`✓ ${String(step).padStart(2)}. ${message}`);
  if (shots)
    await p.screenshot({ path: `${shots}/${String(step).padStart(2, "0")}.png`, fullPage: true });
};
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const optionButton = (text) =>
  p.getByRole("button", { name: new RegExp(`^${esc(text)}(\\s|$)`) }).first();

async function answer(exerciseId, correct) {
  const opts = await options(exerciseId);
  const type = await typeOf(exerciseId);
  if (type === "MATCHING") {
    for (const o of opts) {
      await optionButton(o.text).click();
      await optionButton(o.matchText).click();
    }
  } else if (type === "TRANSLATION") {
    await p
      .getByRole("textbox")
      .fill(correct ? opts.find((o) => o.isCorrect).text : "definitely wrong");
  } else if (type === "WORD_ORDER") {
    const words = opts
      .filter((o) => o.correctPosition)
      .sort((a, b) => a.correctPosition - b.correctPosition);
    for (const o of correct ? words : [...words].reverse()) await optionButton(o.text).click();
  } else {
    await optionButton(opts.find((o) => o.isCorrect === correct).text).click();
  }
  await p.getByRole("button", { name: "Check" }).click();
}

const email = `e2e-${W}-${Date.now()}@example.com`;
const password = "learn1234";
let exitCode = 0;
try {
  // Landing → Register
  await p.goto(BASE);
  await p
    .getByRole("link", { name: /Get started|Start learning/i })
    .first()
    .click();
  await p.waitForURL("**/register");
  await p.getByLabel("Your name").fill("Asha");
  await p.getByLabel("Email").fill(email);
  await p.getByLabel("Password", { exact: true }).fill(password);
  await p.getByRole("button", { name: "Create account" }).click();
  await p.waitForURL("**/onboarding");
  await ok("landing → register → onboarding");

  // Language + self-assessment → placement
  await p.getByRole("radio", { name: /^Telugu/ }).check({ force: true });
  await p.getByRole("button", { name: "Continue", exact: true }).click();
  await p.getByRole("radio", { name: /^Travel/ }).check({ force: true });
  await p.getByRole("button", { name: "Continue", exact: true }).click();
  await p.getByRole("button", { name: "Continue", exact: true }).click();
  await p.getByRole("radio", { name: /alphabet\/script/ }).check({ force: true });
  await p.getByRole("button", { name: "Continue", exact: true }).click();
  await p.getByRole("button", { name: "Continue to placement" }).click();
  await p.waitForURL("**/placement");
  await ok("selected Telugu + self-assessment “I know the script” → placement");

  // Placement: knows units 1, 2 and 4, not unit 3 → recommended Unit 3
  await p.getByRole("button", { name: "Start the test" }).click();
  for (let i = 0; i < 12; i++) {
    const label = await p
      .getByText(/^Unit \d · /)
      .first()
      .textContent();
    const unit = Number(label.match(/Unit (\d)/)[1]);
    const { rows } = await db.query(
      `select pq."exerciseId" from "PlacementQuestion" pq join "Language" l on l.id=pq."languageId" where l.code='te' and pq."sortOrder"=$1`,
      [i + 1],
    );
    const exerciseId = rows[0].exerciseId;
    const opts = await options(exerciseId);
    const right = unit !== 3;
    if ((await typeOf(exerciseId)) === "TRANSLATION")
      await p.getByRole("textbox").fill(right ? opts[0].text : "zzz");
    else await optionButton(opts.find((o) => o.isCorrect === right).text).click();
    await p.getByRole("button", { name: i === 11 ? "See my result" : "Next", exact: true }).click();
    if (i < 11) await p.getByText(`${i + 2} / 12`).waitFor();
  }
  await p.getByRole("heading", { name: /ready for Unit 3/ }).waitFor();
  await p.getByRole("button", { name: "Start at Unit 3" }).click();
  await p.waitForURL("**/learn");
  await p.getByText("8 / 16 lessons").waitFor();
  await ok("placement → Unit 3 recommended and accepted; learning path shows 8 / 16");

  // Lesson + exercises: one mistake, then everything right
  await p.goto(`${BASE}/lesson/te-u3-l1`);
  await p.getByRole("button", { name: "Let's start" }).click();
  const { rows: exercises } = await db.query(
    `select id from "Exercise" where "lessonId"='te-u3-l1' order by "sortOrder"`,
  );
  await answer(exercises[0].id, false);
  await p.getByText("Not quite").waitFor();
  await p.getByRole("button", { name: "Continue", exact: true }).click();
  // The missed exercise comes back at the end of the lesson.
  for (const exercise of [...exercises.slice(1), exercises[0]]) {
    await answer(exercise.id, true);
    await p.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await p.getByText("Lesson complete!").waitFor();
  await ok("lesson te-u3-l1: one wrong answer, then completed");

  // XP + streak in the top bar
  await p.getByRole("link", { name: "Continue" }).click();
  await p.waitForURL("**/learn");
  await p
    .getByTitle(/total XP/)
    .first()
    .waitFor();
  await p.getByTitle("1 day streak").first().waitFor();
  const xp = await p
    .getByTitle(/total XP/)
    .first()
    .getAttribute("title");
  await ok(`XP and streak updated (${xp}, 1 day streak)`);

  // Review the mistake
  await p.goto(`${BASE}/practice`);
  await p.getByRole("heading", { name: "Review your mistakes" }).waitFor();
  await p.getByText("1 to review").waitFor();
  await p.getByRole("link", { name: "Start review" }).click();
  await p.waitForURL("**/review");
  await p.getByRole("button", { name: "Let's start" }).click();
  await answer(exercises[0].id, true);
  await p.getByRole("button", { name: "Continue", exact: true }).click();
  await p.getByText("Review complete!").waitFor();
  await ok("review: the mistake was practised and cleared");

  // AI Tutor (RAG-grounded answer with sources)
  await p.goto(`${BASE}/tutor`);
  await p.getByRole("button", { name: "How do I say hello in Telugu?" }).click();
  await p.getByText(/According to the Vachan notes/).waitFor({ timeout: 30000 });
  await p
    .getByText(/Sources \(\d\)/)
    .first()
    .waitFor();
  await ok("AI Tutor answered from the knowledge base, with sources");

  // Speaking: record → speech-to-text → feedback
  await p.goto(`${BASE}/speak`);
  await p.getByRole("tab", { name: "Speak" }).click();
  await p
    .getByRole("button", { name: /^నమస్కారం/ })
    .first()
    .click();
  await p.getByRole("button", { name: "Record yourself" }).click();
  await p.waitForTimeout(2500);
  await p.getByRole("button", { name: "Stop recording" }).click();
  await p.getByText("Speech-to-text heard").waitFor({ timeout: 30000 });
  await p.getByText("Matches the phrase").waitFor();
  await ok("speaking exercise: recorded, transcribed and evaluated");

  // Conversation role-play
  await p.getByRole("tab", { name: "Conversation" }).click();
  const card = p.locator("li", { has: p.getByRole("heading", { name: "At a restaurant" }) });
  await card.getByRole("button", { name: "Start" }).click();
  await p.getByLabel(/Your reply in Telugu/).fill("నాకు భోజనం కావాలి");
  await p.getByRole("button", { name: "Send reply" }).click();
  await p.getByText("Understood").first().waitFor({ timeout: 30000 });
  await p.getByRole("button", { name: "End role-play" }).click();
  await p.getByRole("heading", { name: "Session summary" }).waitFor({ timeout: 30000 });
  await ok("conversation: reply → partner answer → session summary");

  // Progress
  await p.goto(`${BASE}/profile`);
  await p.getByText(/of 8 earned/).waitFor();
  await p.getByText(/9 of 16 lessons completed/).waitFor();
  await ok("profile shows progress (9 of 16 lessons) and badges");

  // Logout → login again → data persisted
  const xpBefore = await p
    .getByTitle(/total XP/)
    .first()
    .getAttribute("title"); // review added a little XP
  await p.getByRole("button", { name: "Log out" }).click();
  await p.waitForURL(`${BASE}/`);
  await p.goto(`${BASE}/learn`);
  await p.waitForURL("**/login**");
  await p.getByLabel("Email").fill(email);
  await p.getByLabel("Password", { exact: true }).fill(password);
  await p.getByRole("button", { name: /Log in/i }).click();
  await p.waitForURL("**/learn");
  await p.getByText("9 / 16 lessons").waitFor();
  await p.getByTitle(xpBefore).first().waitFor();
  await p.getByTitle("1 day streak").first().waitFor();
  await p.goto(`${BASE}/tutor`);
  await p.getByText(/Ask me anything about Telugu/).waitFor();
  if ((await p.getByRole("button", { name: "Chats" }).count()) > 0)
    await p.getByRole("button", { name: "Chats" }).click();
  await p
    .getByRole("navigation", { name: "Tutor conversations" })
    .getByText("How do I say hello in Telugu?")
    .first()
    .waitFor();
  await p.goto(`${BASE}/speak`);
  await p.getByRole("tab", { name: "Conversation" }).click();
  await p.getByText("Recent role-plays").waitFor();
  await ok(
    "logout → login again: lessons, XP, streak, tutor chat and role-play are all still there",
  );
} catch (error) {
  exitCode = 1;
  console.error(`✗ step ${step + 1} failed: ${String(error.message).split("\n")[0]}`);
  if (shots) await p.screenshot({ path: `${shots}/FAILED.png`, fullPage: true });
} finally {
  await db.query(`delete from "User" where email=$1`, [email]); // clean up the throw-away account
  await db.end();
  await browser.close();
}
if (errors.length) console.log("page errors:", errors);
console.log(exitCode ? "E2E FAILED" : `E2E PASSED — ${step} steps`);
process.exit(exitCode);
