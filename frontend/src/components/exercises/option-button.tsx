// A large, touch-friendly answer button used by several exercise types.
// Shows its state with colour AND an icon/text, never colour alone (accessibility).
import { Check, LoaderCircle, X } from "lucide-react";
import type { ChoiceOption } from "@/types/exercise";
import { cn } from "@/lib/cn";

export type OptionState = "idle" | "selected" | "checking" | "correct" | "incorrect" | "dimmed";

type OptionButtonProps = {
  option: ChoiceOption;
  state: OptionState;
  onSelect: () => void;
  disabled?: boolean;
  /** Keyboard shortcut number shown in the corner (1, 2, 3…). */
  shortcut?: number;
  /** Use bigger text, e.g. when the option is written in an Indian script. */
  large?: boolean;
  /** A single letter: very large and centred. */
  glyph?: boolean;
  showSubtext?: boolean;
};

const stateClasses: Record<OptionState, string> = {
  idle: "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50",
  selected: "border-brand-500 bg-brand-50 ring-4 ring-brand-100",
  // Waiting for the server: neutral orange, never red/green until the answer is known.
  checking: "border-marigold-500 bg-marigold-50 ring-4 ring-marigold-100 text-ink",
  correct: "border-emerald-500 bg-emerald-50 text-emerald-900",
  incorrect: "border-rose-500 bg-rose-50 text-rose-900 animate-shake",
  dimmed: "border-slate-200 bg-white opacity-50",
};

/** Text size for the option label: single letters are biggest, then Indian-script words. */
function optionTextSize(glyph?: boolean, large?: boolean): string {
  if (glyph) return "font-display text-5xl leading-tight sm:text-6xl";
  if (large) return "font-display text-xl sm:text-2xl";
  return "text-lg";
}

export function OptionButton({
  option,
  state,
  onSelect,
  disabled,
  shortcut,
  large,
  glyph,
  showSubtext = true,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={state === "selected"}
      className={cn(
        "relative flex min-h-16 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition",
        "disabled:cursor-default",
        stateClasses[state],
      )}
    >
      {shortcut !== undefined && (
        <span
          aria-hidden="true"
          className="hidden size-7 shrink-0 items-center justify-center rounded-lg border-2 border-slate-200 text-xs font-bold text-slate-500 sm:flex"
        >
          {shortcut}
        </span>
      )}
      <span className={cn("flex-1", glyph && "text-center")}>
        <span className={cn("block font-bold", optionTextSize(glyph, large))}>{option.text}</span>
        {showSubtext && option.subtext && (
          <span className="block text-sm text-slate-500">{option.subtext}</span>
        )}
      </span>
      {state === "checking" && (
        <span className="flex items-center gap-1 text-sm font-bold text-marigold-700">
          <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          <span className="sr-only">Checking your answer</span>
        </span>
      )}
      {state === "correct" && (
        <span className="flex items-center gap-1 text-sm font-bold text-emerald-700">
          <Check aria-hidden="true" className="size-5" />
          <span className="sr-only">Correct answer</span>
        </span>
      )}
      {state === "incorrect" && (
        <span className="flex items-center gap-1 text-sm font-bold text-rose-700">
          <X aria-hidden="true" className="size-5" />
          <span className="sr-only">Your answer, incorrect</span>
        </span>
      )}
    </button>
  );
}

/**
 * Works out how an option should look before and after the answer is checked.
 * After "Check", the server tells us the correct answer as text, so we compare texts.
 * Until it does, the selected option shows an orange "checking" state.
 */
export function getOptionState(params: {
  option: ChoiceOption;
  selectedId: string | null;
  correctAnswer: string | null;
  isLocked: boolean;
}): OptionState {
  const { option, selectedId, correctAnswer, isLocked } = params;
  if (!isLocked) return option.id === selectedId ? "selected" : "idle";
  // Locked but no correct answer yet = the answer is still being checked/saved
  // (or, in the placement test, is never revealed). Don't mark anything right or wrong.
  if (correctAnswer === null) return option.id === selectedId ? "checking" : "dimmed";
  if (option.text === correctAnswer) return "correct";
  if (option.id === selectedId) return "incorrect";
  return "dimmed";
}
