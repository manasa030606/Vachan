"use client";

// Form to create or edit one exercise. The option rows change meaning with the exercise type
// (correct choice, accepted answers, word positions or matching pairs), see optionMode().
import { Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { EXERCISE_TYPES, type ExerciseBody, type ExerciseType } from "@/lib/api/admin";
import { draftProblems, optionMode, toRequestBody } from "@/lib/admin-exercise";
import { ActionButton, Field, Input, Notice, Select } from "./admin-ui";

type OptionMode = ReturnType<typeof optionMode>;

/** Heading above the option rows, per option mode. */
const OPTIONS_LEGEND: Record<OptionMode, string> = {
  choice: "Options — mark the one correct answer",
  accepted: "Accepted answers (marked) and word-bank extras (unmarked)",
  order: "Words — position in the correct sentence (leave empty for extra words)",
  pairs: "Pairs — left side and its match",
};

/** Word used on the "Add …" button, per option mode. */
const ADD_ROW_LABEL: Record<OptionMode, string> = {
  choice: "option",
  accepted: "option",
  order: "word",
  pairs: "pair",
};

/**
 * `lockedType` disables the type dropdown (a new exercise's type is chosen before the form opens).
 * `onSave` receives the cleaned-up request body; errors it throws are shown inside the form.
 */
export function ExerciseForm({
  initial,
  lockedType,
  onSave,
  onCancel,
}: {
  initial: ExerciseBody;
  lockedType: boolean;
  onSave: (body: ExerciseBody) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ExerciseBody>(initial);
  const [error, setError] = useState<string | null>(null);
  // Shared `name` so the "correct" radio buttons of this form act as one group.
  const group = useId();
  const mode = optionMode(draft.type);
  // Live checks; the save button stays disabled until there are none.
  const problems = draftProblems(draft);
  const set = <K extends keyof ExerciseBody>(key: K, value: ExerciseBody[K]) =>
    setDraft({ ...draft, [key]: value });
  const setOption = (index: number, patch: Partial<ExerciseBody["options"][number]>) =>
    set(
      "options",
      draft.options.map((o, i) => {
        if (i === index) return { ...o, ...patch };
        // Choice exercises have exactly one correct option.
        if (mode === "choice" && patch.isCorrect) return { ...o, isCorrect: false };
        return o;
      }),
    );

  return (
    <form
      className="space-y-3 rounded-2xl border-2 border-brand-200 bg-brand-50/30 p-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Type">
          {(id) => (
            <Select
              id={id}
              value={draft.type}
              disabled={lockedType}
              onChange={(e) => set("type", e.target.value as ExerciseType)}
              options={EXERCISE_TYPES}
            />
          )}
        </Field>
        <Field label="Instruction">
          {(id) => (
            <Input
              id={id}
              value={draft.instruction}
              onChange={(e) => set("instruction", e.target.value)}
            />
          )}
        </Field>
        <Field
          label="Prompt"
          hint={
            draft.type === "MATCHING"
              ? "Optional for matching."
              : "What the learner reads, e.g. a word in the script."
          }
        >
          {(id) => (
            <Input id={id} value={draft.prompt} onChange={(e) => set("prompt", e.target.value)} />
          )}
        </Field>
        <Field label="Prompt subtext" hint="Optional, e.g. the romanization.">
          {(id) => (
            <Input
              id={id}
              value={draft.promptSubtext ?? ""}
              onChange={(e) => set("promptSubtext", e.target.value)}
            />
          )}
        </Field>
        {draft.type === "FILL_IN_BLANK" && (
          <>
            <Field label="Sentence before the blank">
              {(id) => (
                <Input
                  id={id}
                  value={draft.sentenceBefore ?? ""}
                  onChange={(e) => set("sentenceBefore", e.target.value)}
                />
              )}
            </Field>
            <Field label="Sentence after the blank">
              {(id) => (
                <Input
                  id={id}
                  value={draft.sentenceAfter ?? ""}
                  onChange={(e) => set("sentenceAfter", e.target.value)}
                />
              )}
            </Field>
          </>
        )}
        <Field label="Translation" hint="Optional, shown after answering.">
          {(id) => (
            <Input
              id={id}
              value={draft.translation ?? ""}
              onChange={(e) => set("translation", e.target.value)}
            />
          )}
        </Field>
        <Field label="Explanation" hint="Optional, shown after answering.">
          {(id) => (
            <Input
              id={id}
              value={draft.explanation ?? ""}
              onChange={(e) => set("explanation", e.target.value)}
            />
          )}
        </Field>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-bold text-slate-700">{OPTIONS_LEGEND[mode]}</legend>
        {draft.options.map((option, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2">
            {(mode === "choice" || mode === "accepted") && (
              <input
                type={mode === "choice" ? "radio" : "checkbox"}
                name={group}
                aria-label={`Option ${index + 1} is correct`}
                className="size-5 accent-emerald-600"
                checked={Boolean(option.isCorrect)}
                onChange={(e) => setOption(index, { isCorrect: e.target.checked })}
              />
            )}
            {mode === "order" && (
              <Input
                aria-label={`Position of word ${index + 1}`}
                type="number"
                min={1}
                className="w-20"
                value={option.correctPosition ?? ""}
                onChange={(e) =>
                  setOption(index, {
                    correctPosition: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            )}
            <Input
              aria-label={`Option ${index + 1} text`}
              className="min-w-40 flex-1"
              value={option.text}
              onChange={(e) => setOption(index, { text: e.target.value })}
              placeholder="Text"
            />
            {mode === "pairs" ? (
              <Input
                aria-label={`Option ${index + 1} match`}
                className="min-w-40 flex-1"
                value={option.matchText ?? ""}
                onChange={(e) => setOption(index, { matchText: e.target.value })}
                placeholder="Match"
              />
            ) : (
              <Input
                aria-label={`Option ${index + 1} subtext`}
                className="min-w-32 flex-1"
                value={option.subtext ?? ""}
                onChange={(e) => setOption(index, { subtext: e.target.value })}
                placeholder="Subtext (optional)"
              />
            )}
            <Button
              size="sm"
              variant="ghost"
              aria-label={`Remove option ${index + 1}`}
              disabled={draft.options.length <= 1}
              onClick={() =>
                set(
                  "options",
                  draft.options.filter((_, i) => i !== index),
                )
              }
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="ghost"
          disabled={draft.options.length >= 12}
          onClick={() =>
            set("options", [
              ...draft.options,
              {
                text: "",
                subtext: "",
                isCorrect: false,
                // A new word goes at the end of the sentence by default.
                correctPosition: mode === "order" ? draft.options.length + 1 : null,
                matchText: "",
              },
            ])
          }
        >
          <Plus aria-hidden="true" className="size-4" /> Add {ADD_ROW_LABEL[mode]}
        </Button>
      </fieldset>

      {problems.length > 0 && (
        <ul className="list-inside list-disc text-sm text-amber-800">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      {error && <Notice>{error}</Notice>}
      <div className="flex gap-2">
        <ActionButton
          size="sm"
          disabled={problems.length > 0}
          onFail={setError}
          action={async () => {
            setError(null);
            await onSave(toRequestBody(draft));
          }}
        >
          Save exercise
        </ActionButton>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
