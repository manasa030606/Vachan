"use client";

// Four onboarding questions + a summary. Each step is its own small component;
// this file only keeps the answers and decides which step to show.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getLanguage } from "@/data/languages";
import { useLanguages } from "@/hooks/use-languages";
import { ApiError } from "@/lib/api/client";
import {
  LEARNING_GOALS,
  getDailyGoal,
  getSelfAssessmentLevel,
  type DailyGoalId,
  type LearningGoalId,
  type SelfAssessmentId,
} from "@/data/onboarding-options";
import { useUpdatePreferences } from "@/lib/learner-preferences";
import type { LanguageCode } from "@/types/learning";
import { StepDailyGoal } from "./step-daily-goal";
import { StepLanguage } from "./step-language";
import { StepLearningGoal } from "./step-learning-goal";
import { StepSelfAssessment } from "./step-self-assessment";
import { StepSummary } from "./step-summary";

type Answers = {
  languageCode: LanguageCode | null;
  learningGoalId: LearningGoalId | null;
  dailyGoalId: DailyGoalId | null;
  selfAssessmentId: SelfAssessmentId | null;
};

const STEPS = ["language", "goal", "daily-goal", "level", "summary"] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const updatePreferences = useUpdatePreferences();
  const { languages, isLoading: languagesLoading, error: languagesError } = useLanguages();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    languageCode: null,
    learningGoalId: null,
    dailyGoalId: "regular",
    selfAssessmentId: null,
  });

  const step = STEPS[stepIndex];
  const language =
    languages.find((item) => item.code === answers.languageCode) ??
    getLanguage(answers.languageCode ?? "hi");

  // Is the current step answered?
  const canContinue =
    (step === "language" && answers.languageCode !== null) ||
    (step === "goal" && answers.learningGoalId !== null) ||
    (step === "daily-goal" && answers.dailyGoalId !== null) ||
    (step === "level" && answers.selfAssessmentId !== null) ||
    step === "summary";

  async function goNext() {
    if (step !== "summary") {
      setStepIndex(stepIndex + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    // Finish: save the choices to the learner's profile (PATCH /api/me).
    setIsSaving(true);
    setSaveError(null);
    try {
      await updatePreferences({
        languageCode: answers.languageCode ?? "hi",
        learningGoal: answers.learningGoalId,
        dailyGoal: answers.dailyGoalId ?? "regular",
        selfAssessment: answers.selfAssessmentId,
        onboardingDone: true,
      });
      router.push(
        answers.selfAssessmentId && answers.selfAssessmentId !== "new" ? "/placement" : "/learn",
      );
    } catch (error) {
      setSaveError(
        error instanceof ApiError ? error.message : "Couldn't save your choices. Try again.",
      );
      setIsSaving(false);
    }
  }

  const level = answers.selfAssessmentId ? getSelfAssessmentLevel(answers.selfAssessmentId) : null;
  const goal = LEARNING_GOALS.find((item) => item.id === answers.learningGoalId);
  const dailyGoal = getDailyGoal(answers.dailyGoalId ?? "regular");

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header: back, progress, exit */}
      <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 pt-5">
        <button
          type="button"
          onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
          disabled={stepIndex === 0}
          aria-label="Previous step"
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 disabled:invisible"
        >
          <ArrowLeft aria-hidden="true" className="size-6" />
        </button>
        <ProgressBar
          value={stepIndex + 1}
          max={STEPS.length}
          label="Onboarding progress"
          size="lg"
        />
        <Link
          href="/"
          aria-label="Exit setup"
          className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
        >
          <X aria-hidden="true" className="size-6" />
        </Link>
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <p className="mb-2 text-sm font-bold tracking-wide text-brand-600 uppercase">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
        {step === "language" && (
          <StepLanguage
            languages={languages}
            isLoading={languagesLoading}
            error={languagesError?.message ?? null}
            value={answers.languageCode}
            onChange={(languageCode) => setAnswers({ ...answers, languageCode })}
          />
        )}
        {step === "goal" && (
          <StepLearningGoal
            languageName={language.name}
            value={answers.learningGoalId}
            onChange={(learningGoalId) => setAnswers({ ...answers, learningGoalId })}
          />
        )}
        {step === "daily-goal" && (
          <StepDailyGoal
            value={answers.dailyGoalId}
            onChange={(dailyGoalId) => setAnswers({ ...answers, dailyGoalId })}
          />
        )}
        {step === "level" && (
          <StepSelfAssessment
            languageName={language.name}
            value={answers.selfAssessmentId}
            onChange={(selfAssessmentId) => setAnswers({ ...answers, selfAssessmentId })}
          />
        )}
        {step === "summary" && (
          <StepSummary
            language={language}
            goalLabel={goal?.label ?? "—"}
            dailyGoalLabel={`${dailyGoal.label} · ${dailyGoal.xp} XP`}
            levelLabel={level?.label ?? "—"}
            startHint={level?.startHint ?? "You'll start at Unit 1"}
            offersPlacement={answers.selfAssessmentId !== "new"}
          />
        )}
        {saveError && (
          <p
            role="alert"
            className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-center font-bold text-rose-700"
          >
            {saveError}
          </p>
        )}
      </main>

      <div className="sticky bottom-0 border-t-2 border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-3xl justify-end px-4 py-4">
          <Button
            size="lg"
            onClick={goNext}
            disabled={!canContinue}
            className="w-full sm:w-auto sm:min-w-44"
          >
            {step !== "summary"
              ? "Continue"
              : isSaving
                ? "Saving…"
                : answers.selfAssessmentId !== "new"
                  ? "Continue to placement"
                  : "Start learning"}
          </Button>
        </div>
      </div>
    </div>
  );
}
