"use client";

// /admin/lessons/[id] — edit a lesson: details, the words it teaches, and its exercises.
// Answers are visible here (admin only); learners never receive them before answering.
import { ArrowDown, ArrowLeft, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  admin,
  EXERCISE_TYPES,
  LESSON_KINDS,
  type AdminExercise,
  type AdminLesson,
  type ExerciseBody,
  type ExerciseType,
  type LessonKind,
} from "@/lib/api/admin";
import {
  blankExercise,
  draftProblems,
  optionMode,
  toDraft,
  toRequestBody,
} from "@/lib/admin-exercise";
import {
  ActionButton,
  DeleteControl,
  Field,
  Input,
  Notice,
  Select,
  StatusBadge,
  Textarea,
} from "./admin-ui";
import { useLoad } from "./use-load";

const nice = (value: string) => value.toLowerCase().replace(/_/g, " ");

export function LessonEditor({ lessonId }: { lessonId: string }) {
  const { data, error, reload } = useLoad(() => admin.lesson(lessonId), lessonId);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const say = (tone: "error" | "success", text: string) => setMessage({ tone, text });

  if (error && !data) return <Notice>{error}</Notice>;
  if (!data) return <p className="text-slate-500">Loading…</p>;
  const lesson = data.lesson;

  return (
    <div className="space-y-5">
      <Link href="/admin/content" className={buttonStyles({ size: "sm", variant: "ghost" })}>
        <ArrowLeft aria-hidden="true" className="size-4" /> All content
      </Link>
      <Card className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
            {lesson.language.name} · {lesson.course.title} · {lesson.unit.title}
          </p>
          <p className="text-sm text-slate-600">
            {lesson.learnersStarted} learner(s) started this lesson.
            {!lesson.unit.isPublished && " Its unit is unpublished, so learners can't see it yet."}
          </p>
        </div>
        <StatusBadge published={lesson.isPublished} />
        <ActionButton
          size="sm"
          variant={lesson.isPublished ? "secondary" : "success"}
          onFail={(t) => say("error", t)}
          action={async () => {
            await admin.publish("lessons", lesson.id, !lesson.isPublished);
            say(
              "success",
              lesson.isPublished
                ? "Lesson unpublished — learners no longer see it."
                : "Lesson published.",
            );
            reload();
          }}
        >
          {lesson.isPublished ? "Unpublish" : "Publish lesson"}
        </ActionButton>
      </Card>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <LessonDetails
        key={`${lesson.id}-${lesson.title}-${lesson.vocabulary.length}`}
        lesson={lesson}
        say={say}
        reload={reload}
      />
      <Exercises lesson={lesson} say={say} reload={reload} />
    </div>
  );
}

function LessonDetails({
  lesson,
  say,
  reload,
}: {
  lesson: AdminLesson;
  say: (tone: "error" | "success", text: string) => void;
  reload: () => void;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [introText, setIntroText] = useState(lesson.introText);
  const [kind, setKind] = useState<LessonKind>(lesson.kind);
  const [words, setWords] = useState<string[]>(lesson.vocabulary.map((v) => v.id));
  const [search, setSearch] = useState("");
  const vocabulary = useLoad(() => admin.vocabulary(lesson.language.code), lesson.language.code);
  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (vocabulary.data?.vocabulary ?? []).filter(
      (v) =>
        words.includes(v.id) ||
        !term ||
        `${v.script} ${v.romanization} ${v.meaning}`.toLowerCase().includes(term),
    );
  }, [vocabulary.data, search, words]);

  return (
    <Card className="space-y-4">
      <CardHeader title="Lesson details" />
      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <Field label="Title">
          {(id) => <Input id={id} value={title} onChange={(e) => setTitle(e.target.value)} />}
        </Field>
        <Field label="Kind">
          {(id) => (
            <Select
              id={id}
              value={kind}
              onChange={(e) => setKind(e.target.value as LessonKind)}
              options={LESSON_KINDS}
            />
          )}
        </Field>
      </div>
      <Field label="Intro text" hint="Shown on the lesson's start screen.">
        {(id) => (
          <Textarea
            id={id}
            rows={3}
            className="font-sans"
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
          />
        )}
      </Field>
      <fieldset>
        <legend className="mb-1 text-sm font-bold text-slate-700">
          Words taught in this lesson ({words.length} selected, max 30)
        </legend>
        <Input
          aria-label="Filter words"
          placeholder="Filter words…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 p-2">
          {vocabulary.error && <Notice>{vocabulary.error}</Notice>}
          <ul className="grid gap-1 sm:grid-cols-2">
            {shown.slice(0, 200).map((v) => (
              <li key={v.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="size-4 accent-brand-600"
                    checked={words.includes(v.id)}
                    onChange={(e) =>
                      setWords(
                        e.target.checked ? [...words, v.id] : words.filter((w) => w !== v.id),
                      )
                    }
                  />
                  <span className="font-bold text-ink">{v.script}</span>
                  <span className="truncate text-slate-500">
                    {v.romanization} — {v.meaning}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </fieldset>
      <ActionButton
        onFail={(t) => say("error", t)}
        action={async () => {
          await admin.update("lessons", lesson.id, {
            title,
            introText,
            kind,
            vocabularyIds: words,
          });
          say("success", "Lesson saved.");
          reload();
        }}
      >
        Save details
      </ActionButton>
    </Card>
  );
}

function Exercises({
  lesson,
  say,
  reload,
}: {
  lesson: AdminLesson;
  say: (tone: "error" | "success", text: string) => void;
  reload: () => void;
}) {
  const [editing, setEditing] = useState<string | null>(null); // exercise id or "new"
  const [newType, setNewType] = useState<ExerciseType>("MULTIPLE_CHOICE");

  return (
    <Card className="space-y-4">
      <CardHeader
        title={`Exercises (${lesson.exercises.length})`}
        description="Learners answer them in this order. A lesson needs at least one exercise to be published."
      />
      <ol className="space-y-3">
        {lesson.exercises.map((exercise, index) =>
          editing === exercise.id ? (
            <li key={exercise.id}>
              <ExerciseForm
                initial={toDraft(exercise)}
                lockedType={false}
                onCancel={() => setEditing(null)}
                onSave={async (body) => {
                  await admin.updateExercise(exercise.id, body);
                  setEditing(null);
                  say("success", "Exercise saved.");
                  reload();
                }}
              />
            </li>
          ) : (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              number={index + 1}
              first={index === 0}
              last={index === lesson.exercises.length - 1}
              onEdit={() => setEditing(exercise.id)}
              say={say}
              reload={reload}
            />
          ),
        )}
      </ol>
      {editing === "new" ? (
        <ExerciseForm
          key={newType}
          initial={blankExercise(newType)}
          lockedType
          onCancel={() => setEditing(null)}
          onSave={async (body) => {
            await admin.createExercise(lesson.id, body);
            setEditing(null);
            say("success", "Exercise added.");
            reload();
          }}
        />
      ) : (
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-60">
            <Field label="New exercise type">
              {(id) => (
                <Select
                  id={id}
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ExerciseType)}
                  options={EXERCISE_TYPES}
                />
              )}
            </Field>
          </div>
          <Button variant="secondary" onClick={() => setEditing("new")}>
            <Plus aria-hidden="true" className="size-4" /> Add exercise
          </Button>
        </div>
      )}
    </Card>
  );
}

function ExerciseRow({
  exercise,
  number,
  first,
  last,
  onEdit,
  say,
  reload,
}: {
  exercise: AdminExercise;
  number: number;
  first: boolean;
  last: boolean;
  onEdit: () => void;
  say: (tone: "error" | "success", text: string) => void;
  reload: () => void;
}) {
  const mode = optionMode(exercise.type);
  const answer =
    mode === "pairs"
      ? exercise.options.map((o) => `${o.text} = ${o.matchText}`).join(", ")
      : mode === "order"
        ? exercise.options
            .filter((o) => o.correctPosition)
            .sort((a, b) => a.correctPosition! - b.correctPosition!)
            .map((o) => o.text)
            .join(" ")
        : exercise.options
            .filter((o) => o.isCorrect)
            .map((o) => o.text)
            .join(" / ");
  const move = (direction: "up" | "down") => async () => {
    await admin.move("exercises", exercise.id, direction);
    reload();
  };
  return (
    <li className="flex flex-wrap items-start gap-2 rounded-2xl border border-slate-200 p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 font-extrabold text-brand-700">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
          {nice(exercise.type)}
        </p>
        <p className="font-bold text-ink">{exercise.prompt || exercise.instruction}</p>
        <p className="text-sm text-slate-600">
          Answer: <span className="font-bold text-emerald-700">{answer || "—"}</span>
        </p>
        <p className="text-xs text-slate-500">
          {exercise.attempts} answer(s) from learners
          {exercise.usedInPlacement && " · used in the placement test"}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <ActionButton
          size="sm"
          variant="ghost"
          aria-label="Move up"
          title="Move up"
          disabled={first}
          action={move("up")}
          onFail={(t) => say("error", t)}
        >
          <ArrowUp aria-hidden="true" className="size-4" />
        </ActionButton>
        <ActionButton
          size="sm"
          variant="ghost"
          aria-label="Move down"
          title="Move down"
          disabled={last}
          action={move("down")}
          onFail={(t) => say("error", t)}
        >
          <ArrowDown aria-hidden="true" className="size-4" />
        </ActionButton>
        <Button size="sm" variant="ghost" onClick={onEdit}>
          <Pencil aria-hidden="true" className="size-4" /> Edit
        </Button>
        <DeleteControl
          what="exercise"
          remove={(force) => admin.remove("exercises", exercise.id, force)}
          onDeleted={() => {
            say("success", "Exercise deleted.");
            reload();
          }}
          onError={(t) => say("error", t)}
        />
      </div>
    </li>
  );
}

function ExerciseForm({
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
  const group = useId();
  const mode = optionMode(draft.type);
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
        <legend className="text-sm font-bold text-slate-700">
          {mode === "choice" && "Options — mark the one correct answer"}
          {mode === "accepted" && "Accepted answers (marked) and word-bank extras (unmarked)"}
          {mode === "order" &&
            "Words — position in the correct sentence (leave empty for extra words)"}
          {mode === "pairs" && "Pairs — left side and its match"}
        </legend>
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
                correctPosition: mode === "order" ? draft.options.length + 1 : null,
                matchText: "",
              },
            ])
          }
        >
          <Plus aria-hidden="true" className="size-4" /> Add{" "}
          {mode === "pairs" ? "pair" : mode === "order" ? "word" : "option"}
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
