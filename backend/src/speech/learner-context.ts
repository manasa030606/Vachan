// Which language and level a speech request is about: the request's language, else the
// learner's current course language; the level from the request or the onboarding
// self-assessment (the same transparent rule as the tutor, ai/tutor/level.ts).
import { HttpError } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import { decideLevel } from "../ai/tutor/level.ts";
import type { KnowledgeLevelName } from "../rag/config.ts";
import type { LanguageCode } from "../rag/types.ts";

export type LearnerSpeechContext = {
  languageCode: LanguageCode;
  languageName: string;
  scriptName: string;
  level: KnowledgeLevelName;
  levelSource: "request" | "self-assessment" | "default";
};

export async function resolveLearnerContext(
  userId: string,
  input: { language?: LanguageCode; level?: KnowledgeLevelName },
): Promise<LearnerSpeechContext> {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { selfAssessment: true, currentLanguage: { select: { code: true } } },
  });
  const code = input.language ?? profile?.currentLanguage?.code;
  if (!code) {
    throw new HttpError(
      400,
      "NO_LANGUAGE",
      'Choose a language first (onboarding) or send "language"',
    );
  }
  const language = await prisma.language.findUnique({
    where: { code },
    select: { code: true, name: true, scriptName: true },
  });
  if (!language) throw new HttpError(400, "UNKNOWN_LANGUAGE", "Unknown language");
  const level = decideLevel(input.level, profile?.selfAssessment);
  return {
    languageCode: language.code as LanguageCode,
    languageName: language.name,
    scriptName: language.scriptName,
    level: level.level,
    levelSource: level.source,
  };
}
