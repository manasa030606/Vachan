"use client";

// "Ask the tutor" panel inside a lesson: opens next to the exercise (the lesson keeps its state),
// starts with "Why is my answer wrong?" for the exercise the learner just answered.
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { getLanguage } from "@/data/languages";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { TutorChat } from "./tutor-chat";
import { useTutorChat } from "./use-tutor-chat";

const FOLLOW_UPS = [
  "Explain it more simply",
  "Give me another example.",
  "How do I remember this?",
];

export function TutorDrawer({
  lessonId,
  exerciseId,
  onClose,
}: {
  lessonId: string;
  exerciseId: string;
  onClose: () => void;
}) {
  const { languageCode } = useLearnerPreferences();
  const chat = useTutorChat({ lessonId, exerciseId });
  const asked = useRef(false);

  useEffect(() => {
    if (!asked.current) {
      asked.current = true;
      void chat.send("Why is my answer wrong?");
    }
  }, [chat]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/30" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Ask the tutor"
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col bg-paper p-4 shadow-2xl sm:rounded-l-3xl"
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">Ask the tutor</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the tutor"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>
        <TutorChat
          chat={chat}
          languageName={getLanguage(languageCode).name}
          suggestions={FOLLOW_UPS}
        />
      </aside>
    </div>
  );
}
