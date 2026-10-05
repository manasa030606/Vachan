"use client";

// Small menu to switch the course language. Saves the choice to the profile (PATCH /api/me).
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { getLanguage } from "@/data/languages";
import { useLanguages } from "@/hooks/use-languages";
import { useLearnerPreferences, useUpdatePreferences } from "@/lib/learner-preferences";
import { cn } from "@/lib/cn";
import { LanguageTile } from "@/components/ui/language-tile";

export function LanguageSwitcher() {
  const { languageCode } = useLearnerPreferences();
  const current = getLanguage(languageCode);
  const { languages } = useLanguages();
  const updatePreferences = useUpdatePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!isOpen) return;
    function handlePointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-1.5 rounded-2xl px-1.5 py-1 transition hover:bg-slate-100"
      >
        <LanguageTile language={current} size="sm" />
        <span className="sr-only">Current course: {current.name}. Change language</span>
        <ChevronDown aria-hidden="true" className="size-4 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-40 mt-2 w-64 animate-pop rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-xl">
          <p className="px-3 pt-1 pb-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
            Switch language
          </p>
          <ul>
            {languages.map((language) => {
              const isCurrent = language.code === languageCode;
              return (
                <li key={language.code}>
                  <button
                    type="button"
                    onClick={() => {
                      void updatePreferences({ languageCode: language.code });
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-slate-100",
                      isCurrent && "bg-brand-50",
                    )}
                  >
                    <LanguageTile language={language} size="sm" />
                    <span className="flex-1 font-bold">{language.name}</span>
                    {isCurrent && <Check aria-label="Current" className="size-5 text-brand-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
