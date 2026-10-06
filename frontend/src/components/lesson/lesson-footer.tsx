// Bottom bar of the lesson: "Check" button, then correct/incorrect feedback + "Continue".
import { CircleCheck, CircleX, MessageCircleQuestion } from "lucide-react";
import type { AnswerResult } from "@/types/exercise";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type LessonFooterProps = {
  result: AnswerResult | null;
  canCheck: boolean;
  /** True while the answer is being sent to the server. */
  isChecking: boolean;
  correctAnswerText: string;
  /** Set when a typed answer had a small spelling mistake but was accepted. */
  typoCorrection: string | null;
  /** Short teaching note from the server, e.g. "ఆ is “aa”: long “aa”, like the a in “father”." */
  explanation: string | null;

  onCheck: () => void;
  onContinue: () => void;
  /** Phase 6: opens the AI tutor for this exercise (shown after a wrong answer). */
  onAskTutor?: () => void;
};

const CORRECT_MESSAGES = ["Great job!", "Excellent!", "You got it!", "Nicely done!"];

export function LessonFooter({
  result,
  canCheck,
  isChecking,
  correctAnswerText,
  typoCorrection,
  explanation,
  onCheck,
  onContinue,
  onAskTutor,
}: LessonFooterProps) {
  // Pick an encouraging message based on the answer length (stable, not random).
  const praise = CORRECT_MESSAGES[correctAnswerText.length % CORRECT_MESSAGES.length];

  return (
    <div
      className={cn(
        "border-t-2 transition-colors",
        !result && "border-slate-200 bg-white",
        result === "correct" && "border-emerald-200 bg-emerald-50",
        result === "incorrect" && "border-rose-200 bg-rose-50",
      )}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-6">
        {/* Feedback (announced to screen readers) */}
        <div role="status" aria-live="polite" className="min-h-0 sm:min-h-14">
          {result === "correct" && (
            <div className="flex animate-pop items-center gap-3 text-emerald-800">
              <CircleCheck
                aria-hidden="true"
                className="size-10 shrink-0 fill-emerald-500 text-white"
              />
              <div>
                <p className="text-2xl font-extrabold">{praise}</p>
                {typoCorrection && (
                  <p className="mt-1">
                    <span className="font-bold">Watch the spelling:</span>{" "}
                    <span className="font-bold">{typoCorrection}</span>
                  </p>
                )}
                {explanation && <p className="mt-1 text-sm">{explanation}</p>}
              </div>
            </div>
          )}
          {result === "incorrect" && (
            <div className="flex animate-pop items-start gap-3 text-rose-800">
              <CircleX aria-hidden="true" className="size-10 shrink-0 fill-rose-500 text-white" />
              <div>
                <p className="text-2xl font-extrabold">Not quite</p>
                <p className="mt-1">
                  <span className="font-bold">Correct answer:</span>{" "}
                  <span className="font-display text-lg font-bold">{correctAnswerText}</span>
                </p>
                {explanation && <p className="mt-1 text-sm">{explanation}</p>}
                <p className="mt-1 text-sm font-bold">You&apos;ll see this one again at the end.</p>
                {onAskTutor && (
                  <button
                    type="button"
                    onClick={onAskTutor}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-brand-700 ring-2 ring-brand-100 transition hover:bg-brand-50"
                  >
                    <MessageCircleQuestion aria-hidden="true" className="size-4" />
                    Ask the tutor why
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {result ? (
          <Button
            size="lg"
            variant={result === "correct" ? "success" : "danger"}
            onClick={onContinue}
            className="sm:min-w-44"
            autoFocus
          >
            Continue
          </Button>
        ) : (
          <Button size="lg" onClick={onCheck} disabled={!canCheck} className="sm:min-w-44">
            {isChecking ? "Checking…" : "Check"}
          </Button>
        )}
      </div>
    </div>
  );
}
