"use client";

// Two columns (script word ↔ English meaning). Tap one item on each side to match them.
// Wrong pairs flash red briefly; correct pairs turn green and stay matched.
import { useState } from "react";
import { Check } from "lucide-react";
import type { ExerciseComponentProps, MatchingExercise } from "@/types/exercise";
import { cn } from "@/lib/cn";
import { ExerciseHeading } from "./exercise-heading";

type Side = "left" | "right";

type TileState = "idle" | "selected" | "matched" | "wrong";

const tileClasses: Record<TileState, string> = {
  idle: "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50",
  selected: "border-brand-500 bg-brand-50 ring-4 ring-brand-100",
  matched: "border-emerald-300 bg-emerald-50 text-emerald-800 opacity-70",
  wrong: "border-rose-500 bg-rose-50 text-rose-800 animate-shake",
};

export function Matching({
  exercise,
  onAnswerChange,
  isLocked,
  showRomanization,
}: ExerciseComponentProps<MatchingExercise>) {
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<{ side: Side; id: string } | null>(null);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);

  // Show the right column in a different order so it isn't a straight line across.
  const rightItems = [...exercise.pairs.slice(2), ...exercise.pairs.slice(0, 2)];

  function handleTap(side: Side, id: string) {
    if (isLocked || matchedIds.includes(id)) return;

    // First tap, or tapping the same side again → just (re)select.
    if (!selected || selected.side === side) {
      setSelected({ side, id });
      return;
    }

    const leftId = side === "left" ? id : selected.id;
    const rightId = side === "right" ? id : selected.id;
    setSelected(null);

    if (leftId === rightId) {
      const nextMatched = [...matchedIds, leftId];
      setMatchedIds(nextMatched);
      if (nextMatched.length === exercise.pairs.length) {
        onAnswerChange({ type: "matching", complete: true, matchedIds: nextMatched });
      }
    } else {
      setWrongPair({ left: leftId, right: rightId });
      window.setTimeout(() => setWrongPair(null), 700);
    }
  }

  function getState(side: Side, id: string): TileState {
    if (matchedIds.includes(id)) return "matched";
    if (wrongPair && wrongPair[side] === id) return "wrong";
    if (selected?.side === side && selected.id === id) return "selected";
    return "idle";
  }

  function renderTile(side: Side, id: string, text: string, subtext?: string) {
    const state = getState(side, id);
    return (
      <button
        key={`${side}-${id}`}
        type="button"
        onClick={() => handleTap(side, id)}
        disabled={isLocked || state === "matched"}
        aria-pressed={state === "selected"}
        className={cn(
          "flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl border-2 px-3 py-2 text-center transition",
          tileClasses[state],
        )}
      >
        {state === "matched" && <Check aria-hidden="true" className="size-4 shrink-0" />}
        <span>
          <span
            className={cn(
              "block font-bold",
              side === "left"
                ? "font-display text-xl [overflow-wrap:anywhere] sm:text-2xl"
                : "text-lg",
            )}
          >
            {text}
          </span>
          {showRomanization && subtext && (
            <span className="block text-xs text-slate-500">{subtext}</span>
          )}
        </span>
        {state === "matched" && <span className="sr-only">(matched)</span>}
        {state === "wrong" && <span className="sr-only">(not a match)</span>}
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <ExerciseHeading>{exercise.instruction}</ExerciseHeading>
      <p className="text-slate-600" aria-live="polite">
        {matchedIds.length} of {exercise.pairs.length} pairs matched
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div role="group" aria-label="Words" className="space-y-3">
          {exercise.pairs.map((pair) => renderTile("left", pair.id, pair.left, pair.leftSubtext))}
        </div>
        <div role="group" aria-label="Meanings" className="space-y-3">
          {rightItems.map((pair) => renderTile("right", pair.id, pair.right))}
        </div>
      </div>
    </div>
  );
}
