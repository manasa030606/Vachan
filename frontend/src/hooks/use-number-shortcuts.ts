"use client";

import { useEffect } from "react";

/**
 * Lets keyboard users press 1, 2, 3… to pick an answer option.
 * Ignored while typing in a text field.
 */
export function useNumberShortcuts(
  optionCount: number,
  onPick: (index: number) => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const number = Number.parseInt(event.key, 10);
      if (number >= 1 && number <= optionCount) {
        event.preventDefault();
        onPick(number - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [optionCount, onPick, enabled]);
}
