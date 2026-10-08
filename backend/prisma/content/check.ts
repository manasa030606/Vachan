// Validates a language content file: `npx tsx prisma/content/check.ts te`
// (or without a code to check every language that has a file).
// Checks completeness, script ranges, duplicates and references. Exit code 1 on problems.
import { existsSync } from "node:fs";
import { CONCEPTS, CURRICULUM, DIALOGUES, TOPICS, type ConceptKey } from "./curriculum.ts";
import { SCRIPT_PLANS } from "./script.ts";
import { isPhrase, type Entry, type LanguageContent } from "./types.ts";

const LESSON_KEYS = new Set(CURRICULUM.flatMap((unit) => unit.lessons.map((lesson) => lesson.key)));
const TOPIC_NAMES = new Set<string>(Object.values(TOPICS));
/** Characters allowed besides the script's own block. */
const ALLOWED = /[\s?!,.'"’“”\-–—()।॥0-9‌‍]/u;

export function scriptOf(entry: Entry): string {
  return isPhrase(entry) ? entry.words.map(([script]) => script).join(" ") : entry.script;
}
export function romanOf(entry: Entry): string {
  return isPhrase(entry) ? entry.words.map(([, roman]) => roman).join(" ") : entry.roman;
}

export function checkContent(content: LanguageContent): string[] {
  const problems: string[] = [];
  const plan = SCRIPT_PLANS[content.code];
  if (!plan) return [`unknown language code ${content.code}`];
  const inBlock = (char: string) => {
    const cp = char.codePointAt(0)!;
    return cp >= plan.base && cp < plan.base + 0x80;
  };
  const checkScript = (where: string, text: string) => {
    if (!text.trim()) problems.push(`${where}: empty script`);
    for (const char of text) {
      if (!inBlock(char) && !ALLOWED.test(char)) {
        problems.push(
          `${where}: character "${char}" (U+${char.codePointAt(0)!.toString(16)}) is not in the ${content.code} script`,
        );
        break;
      }
    }
  };
  const checkRoman = (where: string, text: string) => {
    if (!text.trim()) problems.push(`${where}: empty romanization`);
    if (/[^\x20-\x7e’ṉṟôāīūēō]/u.test(text))
      problems.push(`${where}: romanization "${text}" has unusual characters`);
  };
  const checkEntry = (where: string, entry: Entry, kind?: "WORD" | "PHRASE") => {
    if (isPhrase(entry)) {
      if (!entry.words.length) problems.push(`${where}: no words`);
      entry.words.forEach(([script, roman], index) => {
        checkScript(`${where}.words[${index}]`, script);
        checkRoman(`${where}.words[${index}]`, roman);
        if (/\s/.test(script.trim()))
          problems.push(`${where}.words[${index}]: one token per word ("${script}")`);
      });
      if (entry.blank !== undefined && (entry.blank < 0 || entry.blank >= entry.words.length)) {
        problems.push(`${where}: blank index out of range`);
      }
      if (kind === "PHRASE" && entry.words.length === 1) {
        // fine: some phrases are one word in some languages
      }
    } else {
      checkScript(where, entry.script);
      checkRoman(where, entry.roman);
    }
  };

  const seenScripts = new Map<string, string>();
  const remember = (where: string, entry: Entry) => {
    const script = scriptOf(entry)
      .replace(/[?!.,।]/g, "")
      .trim();
    const other = seenScripts.get(script);
    if (other)
      problems.push(`${where}: same script as ${other} ("${script}") — make them different`);
    else seenScripts.set(script, where);
  };

  for (const key of Object.keys(CONCEPTS) as ConceptKey[]) {
    const entry = content.entries[key];
    const def = CONCEPTS[key];
    if (!entry) {
      problems.push(`entries.${key}: missing (${def.en})`);
      continue;
    }
    checkEntry(`entries.${key}`, entry, def.kind);
    if ("localized" in def && def.localized && !entry.meaning) {
      problems.push(`entries.${key}: needs a "meaning" (${def.en})`);
    }
    if (entry.meaning?.includes("(")) {
      if (/\(a city|\(this language/.test(entry.meaning))
        problems.push(`entries.${key}: fill in the placeholder in meaning`);
    }
    remember(`entries.${key}`, entry);
  }
  for (const key of Object.keys(content.entries)) {
    if (!(key in CONCEPTS)) problems.push(`entries.${key}: not a curriculum concept`);
  }

  const extraKeys = new Set<string>();
  content.extras.forEach((extra, index) => {
    const where = `extras[${index}] (${extra.key})`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(extra.key)) problems.push(`${where}: key must be a slug`);
    if (extraKeys.has(extra.key)) problems.push(`${where}: duplicate key`);
    extraKeys.add(extra.key);
    if (!LESSON_KEYS.has(extra.lesson)) problems.push(`${where}: unknown lesson "${extra.lesson}"`);
    if (!TOPIC_NAMES.has(extra.topic)) problems.push(`${where}: unknown topic "${extra.topic}"`);
    if (!extra.meaning) problems.push(`${where}: meaning required`);
    checkEntry(where, extra);
    remember(where, extra);
  });

  for (const key of Object.keys(DIALOGUES)) {
    const dialogue = content.dialogues[key as keyof typeof DIALOGUES];
    if (!dialogue) {
      problems.push(`dialogues.${key}: missing`);
      continue;
    }
    if (dialogue.lines.length < 4) problems.push(`dialogues.${key}: too short`);
    dialogue.lines.forEach((line, index) => {
      checkScript(`dialogues.${key}[${index}]`, line.script);
      checkRoman(`dialogues.${key}[${index}]`, line.roman);
      if (!line.meaning) problems.push(`dialogues.${key}[${index}]: meaning missing`);
    });
  }
  for (const key of Object.keys(content.lessonNotes ?? {})) {
    if (!LESSON_KEYS.has(key)) problems.push(`lessonNotes.${key}: unknown lesson`);
  }
  return problems;
}

async function main() {
  const codes = process.argv[2] ? [process.argv[2]] : Object.keys(SCRIPT_PLANS);
  let failed = false;
  for (const code of codes) {
    const path = new URL(`./languages/${code}.ts`, import.meta.url);
    if (!existsSync(path)) {
      console.log(`- ${code}: no file yet`);
      continue;
    }
    const { content } = (await import(path.href)) as { content: LanguageContent };
    const problems = checkContent(content);
    const extras = content.extras.length;
    const phrases = Object.values(content.entries).filter(isPhrase).length;
    if (problems.length) {
      failed = true;
      console.log(`✗ ${code}: ${problems.length} problem(s)`);
      for (const problem of problems.slice(0, 80)) console.log(`   ${problem}`);
    } else {
      console.log(
        `✓ ${code}: ${Object.keys(content.entries).length} concepts (${phrases} phrases), ${extras} extras, ${Object.keys(content.dialogues).length} dialogues`,
      );
    }
  }
  process.exitCode = failed ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) void main();
