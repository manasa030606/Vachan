"use client";

// Build a sentence by tapping words from the word bank. Tap a placed word to remove it.
import type { ExerciseComponentProps, WordOrderExercise } from "@/types/exercise";
import { cn } from "@/lib/cn";
import { ExerciseHeading } from "./exercise-heading";

export function WordOrder({
  exercise,
  answer,
  onAnswerChange,
  isLocked,
  result,
  showRomanization,
}: ExerciseComponentProps<WordOrderExercise>) {
  const placedIds = answer?.type === "order" ? answer.tokenIds : [];

  function updateOrder(tokenIds: string[]) {
    onAnswerChange(tokenIds.length > 0 ? { type: "order", tokenIds } : null);
  }

  function addToken(id: string) {
    if (isLocked) return;
    updateOrder([...placedIds, id]);
  }

  function removeToken(id: string) {
    if (isLocked) return;
    updateOrder(placedIds.filter((placedId) => placedId !== id));
  }

  const findToken = (id: string) => exercise.tokens.find((token) => token.id === id);

  return (
    <div className="space-y-6">
      <ExerciseHeading>{exercise.instruction}</ExerciseHeading>
      <p className="rounded-2xl bg-marigold-50 px-4 py-3 text-lg font-bold text-ink">
        “{exercise.prompt}”
      </p>

      {/* Answer line */}
      <div
        aria-label="Your sentence"
        role="group"
        className={cn(
          "flex min-h-20 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3",
          !result && "border-slate-300",
          result === "correct" && "border-emerald-500 bg-emerald-50",
          result === "incorrect" && "border-rose-500 bg-rose-50",
        )}
      >
        {placedIds.length === 0 && (
          <span className="px-2 text-slate-400">Tap the words below in the right order</span>
        )}
        {placedIds.map((id) => {
          const token = findToken(id);
          if (!token) return null;
          return (
            <WordChip
              key={id}
              text={token.text}
              subtext={showRomanization ? token.subtext : undefined}
              onClick={() => removeToken(id)}
              disabled={isLocked}
              ariaLabel={`Remove ${token.text}`}
            />
          );
        })}
      </div>

      {/* Word bank */}
      <div role="group" aria-label="Word bank" className="flex flex-wrap justify-center gap-2">
        {exercise.tokens.map((token) => {
          const isPlaced = placedIds.includes(token.id);
          return (
            <WordChip
              key={token.id}
              text={token.text}
              subtext={showRomanization ? token.subtext : undefined}
              onClick={() => addToken(token.id)}
              disabled={isLocked || isPlaced}
              faded={isPlaced}
              ariaLabel={isPlaced ? `${token.text} (already used)` : `Add ${token.text}`}
            />
          );
        })}
      </div>
    </div>
  );
}

type WordChipProps = {
  text: string;
  subtext?: string;
  onClick: () => void;
  disabled: boolean;
  faded?: boolean;
  ariaLabel: string;
};

function WordChip({ text, subtext, onClick, disabled, faded, ariaLabel }: WordChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "rounded-xl border-2 border-b-4 border-slate-200 bg-white px-4 py-2 text-center transition",
        "hover:border-brand-300 disabled:cursor-default",
        faded && "border-slate-100 bg-slate-100 text-transparent",
      )}
    >
      <span className="block font-display text-xl font-bold sm:text-2xl">{text}</span>
      {subtext && (
        <span className={cn("block text-xs", faded ? "text-transparent" : "text-slate-500")}>
          {subtext}
        </span>
      )}
    </button>
  );
}
