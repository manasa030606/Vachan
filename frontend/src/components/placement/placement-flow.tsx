"use client";

// Placement test: intro → 12 questions (3 per unit) → result → choose where to start.
//   POST /api/placement/start · POST /api/placement/answer · GET /api/placement/result
//   POST /api/placement/decide
// Answers aren't marked right/wrong during the test; the result shows the score per unit
// and the simple rule that picked the starting unit. No hearts, no XP, no mistakes recorded.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Compass, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getSelfAssessmentLevel, type SelfAssessmentId } from "@/data/onboarding-options";
import { ApiError } from "@/lib/api/client";
import {
  answerPlacement,
  decidePlacement,
  getPlacementResult,
  startPlacement,
} from "@/lib/api/endpoints";
import { toExercise } from "@/lib/api/mappers";
import type { PlacementResultDto, PlacementSkill, PlacementStartDto } from "@/lib/api/types";
import { isAnswerReady, toAttemptAnswer } from "@/lib/exercises/check-answer";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import type { ExerciseAnswer } from "@/types/exercise";

const SKILL_LABELS: Record<PlacementSkill, string> = {
  SCRIPT: "Script & sounds",
  VOCABULARY: "Vocabulary",
  TRANSLATION: "Translation",
  SENTENCE: "Sentences",
};

type Phase = "intro" | "questions" | "result";

export function PlacementFlow() {
  const router = useRouter();
  const { languageCode, selfAssessmentId, showRomanization } = useLearnerPreferences();
  const [phase, setPhase] = useState<Phase>("intro");
  const [test, setTest] = useState<PlacementStartDto | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<ExerciseAnswer | null>(null);
  const [result, setResult] = useState<PlacementResultDto | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = test?.questions[index];
  const exercise = question ? toExercise(question.exercise) : null;
  const canSubmit = exercise ? isAnswerReady(exercise, answer) && !busy : false;

  const run = useCallback(async (task: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await task();
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }, []);

  const begin = () =>
    run(async () => {
      const started = await startPlacement(languageCode);
      setTest(started);
      setIndex(0);
      setAnswer(null);
      setPhase("questions");
    });

  const submit = useCallback(
    () =>
      run(async () => {
        if (!test || !question || !answer) return;
        const saved = await answerPlacement(test.test.id, question.id, toAttemptAnswer(answer));
        if (saved.completed) {
          setResult((await getPlacementResult(test.test.id)).result);
          setPhase("result");
        } else {
          setIndex((current) => current + 1);
          setAnswer(null);
        }
      }),
    [run, test, question, answer],
  );

  const decide = (choice: "recommended" | "beginning") =>
    run(async () => {
      if (!result) return;
      await decidePlacement(result.testId, choice);
      router.push("/learn");
    });

  // Enter = Next
  useEffect(() => {
    if (phase !== "questions") return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Enter" || (event.target as HTMLElement | null)?.tagName === "BUTTON")
        return;
      if (canSubmit) void submit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, canSubmit, submit]);

  const errorBox = error && (
    <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 font-bold text-rose-700">
      {error}
    </p>
  );

  if (phase === "intro") {
    const level = selfAssessmentId
      ? getSelfAssessmentLevel(selfAssessmentId as SelfAssessmentId)
      : null;
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <div className="flex size-16 items-center justify-center rounded-3xl bg-brand-100">
          <Compass aria-hidden="true" className="size-9 text-brand-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Find your starting point</h1>
          <p className="mt-2 text-lg text-slate-600">
            12 short questions — 3 for each unit — about letters and sounds, words, translation and
            sentences. About 3 minutes.
          </p>
        </div>
        {level && (
          <Card className="p-4">
            <p className="text-sm text-slate-500">Your self-assessment</p>
            <p className="font-bold text-ink">{level.label}</p>
          </Card>
        )}
        <ul className="space-y-2 text-slate-600">
          <li>• You won&apos;t see right/wrong during the test — your score comes at the end.</li>
          <li>
            • No hearts are lost and no XP is given; mistakes here don&apos;t go to your review
            list.
          </li>
          <li>• Not sure? It&apos;s fine to guess. You can always start from Unit 1.</li>
          <li>• Listening questions are added together with audio later.</li>
        </ul>
        {errorBox}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => void begin()} disabled={busy} className="sm:flex-1">
            {busy ? "Loading…" : "Start the test"}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push("/learn")}
            className="sm:flex-1"
          >
            Skip — start from Unit 1
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "questions" && test && question && exercise) {
    return (
      <div className="flex min-h-dvh flex-col">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 pt-4 sm:pt-6">
          <Link
            href="/learn"
            aria-label="Leave the placement test"
            className="-ml-2 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X aria-hidden="true" className="size-6" />
          </Link>
          <ProgressBar
            value={index}
            max={test.questions.length}
            label="Placement test progress"
            size="lg"
          />
          <span className="text-sm font-bold whitespace-nowrap text-slate-500">
            {index + 1} / {test.questions.length}
          </span>
        </div>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
          <p className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
            Unit {question.unit} · {SKILL_LABELS[question.skill]}
          </p>
          <ExerciseRenderer
            key={question.id}
            exercise={exercise}
            answer={answer}
            onAnswerChange={setAnswer}
            isLocked={busy}
            result={null}
            correctAnswer={null}
            showRomanization={showRomanization}
          />
          <div className="mt-4">{errorBox}</div>
        </main>
        <div className="sticky bottom-0 border-t-2 border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-2xl justify-end px-4 py-4">
            <Button
              size="lg"
              onClick={() => void submit()}
              disabled={!canSubmit}
              className="w-full sm:w-auto sm:min-w-44"
            >
              {busy ? "Saving…" : index + 1 === test.questions.length ? "See my result" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "result" && result) {
    const recommended = result.recommendedUnit;
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <div>
          <p className="text-sm font-bold tracking-wide text-brand-600 uppercase">
            Placement result · {result.correctCount} / {result.totalQuestions} correct
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">{result.message}</h1>
        </div>
        <ul className="space-y-2">
          {result.units.map((unit) => (
            <li
              key={unit.unit}
              className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4"
            >
              {unit.passed ? (
                <CheckCircle2 aria-hidden="true" className="size-6 shrink-0 text-emerald-600" />
              ) : (
                <XCircle aria-hidden="true" className="size-6 shrink-0 text-rose-500" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">
                  Unit {unit.unit}: {unit.title}
                </p>
                <p className="text-sm text-slate-500">
                  {unit.skills.map((skill) => SKILL_LABELS[skill]).join(" · ")}
                </p>
              </div>
              <span className="text-right text-sm font-bold">
                {unit.correct} / {unit.total}
                <span className={unit.passed ? "block text-emerald-700" : "block text-rose-600"}>
                  {unit.passed ? "Passed" : "Not yet"}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <Card className="p-4">
          <h2 className="font-bold">How this was decided</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {result.rules.map((rule) => (
              <li key={rule}>• {rule}</li>
            ))}
          </ul>
        </Card>
        {errorBox}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={() => void decide("recommended")}
            disabled={busy}
            className="sm:flex-1"
          >
            Start at Unit {recommended}
          </Button>
          {recommended > 1 && (
            <Button
              size="lg"
              variant="secondary"
              onClick={() => void decide("beginning")}
              disabled={busy}
              className="sm:flex-1"
            >
              Start from Unit 1
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
