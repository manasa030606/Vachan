"use client";

// Loads the (mock) lesson for the current language and shows the player.
// Phase 3 replaces buildDemoLesson() with GET /api/lessons/:id.
import { useMemo } from "react";
import { Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { LANGUAGES } from "@/data/languages";
import { findLesson } from "@/data/mock-course";
import { buildDemoLesson } from "@/data/mock-lessons";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import type { LanguageCode } from "@/types/learning";
import { LessonPlayer } from "./lesson-player";

/** Lesson ids start with the language code, e.g. "te-u2-l2". Practice ids don't. */
function languageFromLessonId(lessonId: string): LanguageCode | null {
  const prefix = lessonId.split("-")[0];
  return LANGUAGES.find((language) => language.code === prefix)?.code ?? null;
}

export function LessonScreen({ lessonId }: { lessonId: string }) {
  const preferences = useLearnerPreferences();
  const languageCode = languageFromLessonId(lessonId) ?? preferences.languageCode;
  const lesson = useMemo(() => buildDemoLesson(languageCode, lessonId), [languageCode, lessonId]);
  const isLocked = findLesson(languageCode, lessonId)?.lesson.status === "locked";

  if (isLocked) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-slate-200">
          <Lock aria-hidden="true" className="size-9 text-slate-500" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold">This lesson is locked</h1>
        <p className="mt-2 text-slate-600">
          Complete the earlier lessons in your path to unlock it.
        </p>
        <ButtonLink href="/learn" size="lg" className="mt-8">
          Back to Learn
        </ButtonLink>
      </div>
    );
  }

  // `key` restarts the player if the language changes.
  return (
    <LessonPlayer
      key={lesson.id + languageCode}
      lesson={lesson}
      showRomanization={preferences.showRomanization}
    />
  );
}
