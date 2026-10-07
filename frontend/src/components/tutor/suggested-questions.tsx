// Clickable example questions, e.g. based on the lesson the learner is in.
import { Lightbulb } from "lucide-react";

/** Row of question buttons; hidden when there are no suggestions. */
export function SuggestedQuestions({
  questions,
  onPick,
  disabled,
}: {
  questions: string[];
  onPick: (question: string) => void;
  disabled: boolean;
}) {
  if (questions.length === 0) return null;
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-500">
        <Lightbulb aria-hidden="true" className="size-4 text-marigold-500" />
        Try asking
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            disabled={disabled}
            onClick={() => onPick(question)}
            className="rounded-full border-2 border-brand-100 bg-white px-3 py-1.5 text-left text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
