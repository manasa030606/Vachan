"use client";

// A list of OptionButtons with single selection and number-key shortcuts (1, 2, 3...).
// Shared by multiple-choice, character-sound, character-recognition and fill-in-the-blank.
import { useCallback } from "react";
import type { ChoiceOption } from "@/types/exercise";
import { cn } from "@/lib/cn";
import { useNumberShortcuts } from "@/hooks/use-number-shortcuts";
import { OptionButton, getOptionState } from "./option-button";

type ChoiceListProps = {
  options: ChoiceOption[];
  selectedId: string | null;
  correctAnswer: string | null;
  isLocked: boolean;
  onSelect: (optionId: string) => void;
  large?: boolean;
  /** Options are single letters: show them very large and centred. */
  glyph?: boolean;
  showSubtext: boolean;
  layout?: "grid" | "row";
  label: string;
};

export function ChoiceList({
  options,
  selectedId,
  correctAnswer,
  isLocked,
  onSelect,
  large,
  glyph,
  showSubtext,
  layout = "grid",
  label,
}: ChoiceListProps) {
  const pickByIndex = useCallback(
    (index: number) => {
      const option = options[index];
      if (option) onSelect(option.id);
    },
    [options, onSelect],
  );
  useNumberShortcuts(options.length, pickByIndex, !isLocked);

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "grid gap-3",
        layout === "grid" ? "sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3",
      )}
    >
      {options.map((option, index) => (
        <OptionButton
          key={option.id}
          option={option}
          shortcut={index + 1}
          large={large}
          glyph={glyph}
          showSubtext={showSubtext}
          disabled={isLocked}
          onSelect={() => onSelect(option.id)}
          state={getOptionState({ option, selectedId, correctAnswer, isLocked })}
        />
      ))}
    </div>
  );
}
