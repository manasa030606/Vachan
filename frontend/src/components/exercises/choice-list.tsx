"use client";

// A list of OptionButtons with single selection + number-key shortcuts.
// Shared by multiple-choice, character-recognition and fill-in-the-blank.
import { useCallback } from "react";
import type { ChoiceOption } from "@/types/exercise";
import { cn } from "@/lib/cn";
import { useNumberShortcuts } from "@/hooks/use-number-shortcuts";
import { OptionButton, getOptionState } from "./option-button";

type ChoiceListProps = {
  options: ChoiceOption[];
  selectedId: string | null;
  correctId: string;
  isLocked: boolean;
  onSelect: (optionId: string) => void;
  large?: boolean;
  showSubtext: boolean;
  layout?: "grid" | "row";
  label: string;
};

export function ChoiceList({
  options,
  selectedId,
  correctId,
  isLocked,
  onSelect,
  large,
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
          showSubtext={showSubtext}
          disabled={isLocked}
          onSelect={() => onSelect(option.id)}
          state={getOptionState({ optionId: option.id, selectedId, correctId, isLocked })}
        />
      ))}
    </div>
  );
}
