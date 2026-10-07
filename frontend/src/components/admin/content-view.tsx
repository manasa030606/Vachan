"use client";

// /admin/content — languages → courses → units → lessons. Everything can be created, edited,
// re-ordered, published/unpublished and deleted here; no source code changes are needed.
// Learners only see a lesson when its language, course, unit AND the lesson are all published.
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  admin,
  LEARNING_STAGES,
  LESSON_KINDS,
  type ContentTree,
  type LessonKind,
  type TreeCourse,
  type TreeLesson,
  type TreeUnit,
} from "@/lib/api/admin";
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

/** Shows a success or error message at the top of the page. */
type Say = (tone: "error" | "success", text: string) => void;
/** Passed down the tree so every row can show a message and refresh the page after a change. */
type TreeContext = { say: Say; reload: () => void };

export function ContentView() {
  const languages = useLoad(() => admin.languages(), "languages");
  const [picked, setPicked] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [addingLanguage, setAddingLanguage] = useState(false);

  const languageList = languages.data?.languages ?? [];
  // Show the first language until the admin picks another one.
  const code = picked ?? languageList[0]?.code ?? "";
  const tree = useLoad(() => (code ? admin.content(code) : Promise.resolve(null)), code);
  const say: Say = (tone, text) => setMessage({ tone, text });
  // Changes in the tree also change the language counts, so refresh both.
  const reload = () => {
    tree.reload();
    languages.reload();
  };
  const language = languageList.find((l) => l.code === code);

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-end gap-3">
        <div className="w-56">
          <Field label="Language">
            {(id) => (
              <Select
                id={id}
                value={code}
                onChange={(event) => {
                  setPicked(event.target.value);
                  setMessage(null);
                }}
                options={languageList.map((l) => ({
                  value: l.code,
                  label: `${l.name} (${l.code})${l.isActive ? "" : " — hidden"}`,
                }))}
              />
            )}
          </Field>
        </div>
        {language && (
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <StatusBadge published={language.isActive} labels={["Visible to learners", "Hidden"]} />
            <span className="text-sm text-slate-500">
              {language.counts.courses} course(s) · {language.counts.vocabulary} words ·{" "}
              {language.counts.learners} learner(s)
            </span>
            <ActionButton
              size="sm"
              variant="secondary"
              onFail={(text) => say("error", text)}
              action={async () => {
                await admin.publishLanguage(language.code, !language.isActive);
                say(
                  "success",
                  language.isActive
                    ? `${language.name} is hidden from learners.`
                    : `${language.name} is visible to learners.`,
                );
                reload();
              }}
            >
              {language.isActive ? "Hide language" : "Show to learners"}
            </ActionButton>
            <DeleteControl
              what="language"
              remove={(force) => admin.remove("languages", language.code, force)}
              onDeleted={() => {
                setPicked(null);
                say("success", "Language deleted.");
                reload();
              }}
              onError={(text) => say("error", text)}
            />
          </div>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto"
          onClick={() => setAddingLanguage((v) => !v)}
        >
          <Plus aria-hidden="true" className="size-4" /> New language
        </Button>
        {addingLanguage && (
          <NewLanguageForm
            onDone={(newCode) => {
              setAddingLanguage(false);
              setPicked(newCode);
              say(
                "success",
                "Language created. It stays hidden until it has a published course and you show it.",
              );
              languages.reload();
            }}
            onError={(text) => say("error", text)}
          />
        )}
      </Card>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      {(languages.error || tree.error) && <Notice>{languages.error ?? tree.error}</Notice>}
      {tree.loading && !tree.data && <p className="text-slate-500">Loading…</p>}

      {tree.data && <CourseTree tree={tree.data} ctx={{ say, reload }} />}
    </div>
  );
}

// Small inline form that creates a new (hidden) language.
function NewLanguageForm({
  onDone,
  onError,
}: {
  onDone: (code: string) => void;
  onError: (text: string) => void;
}) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    nativeName: "",
    scriptName: "",
    description: "",
  });
  const set = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm({ ...form, [key]: event.target.value });
  return (
    <form
      className="grid w-full gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <Field label="Code" hint="2–3 letter ISO 639 code, e.g. mr">
        {(id) => <Input id={id} value={form.code} onChange={set("code")} maxLength={3} />}
      </Field>
      <Field label="Name">
        {(id) => <Input id={id} value={form.name} onChange={set("name")} placeholder="Marathi" />}
      </Field>
      <Field label="Native name">
        {(id) => (
          <Input id={id} value={form.nativeName} onChange={set("nativeName")} placeholder="मराठी" />
        )}
      </Field>
      <Field label="Script">
        {(id) => (
          <Input
            id={id}
            value={form.scriptName}
            onChange={set("scriptName")}
            placeholder="Devanagari"
          />
        )}
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          {(id) => <Input id={id} value={form.description} onChange={set("description")} />}
        </Field>
      </div>
      <div>
        <ActionButton
          size="sm"
          onFail={onError}
          action={async () => {
            await admin.createLanguage({ ...form, code: form.code.trim().toLowerCase() });
            onDone(form.code.trim().toLowerCase());
          }}
        >
          Create language
        </ActionButton>
      </div>
    </form>
  );
}

// All courses of the selected language, plus the "Add course" button.
function CourseTree({ tree, ctx }: { tree: ContentTree; ctx: TreeContext }) {
  const [adding, setAdding] = useState(false);
  return (
    <div className="space-y-5">
      {tree.courses.length === 0 && (
        <Notice tone="info">No courses yet — add the first one.</Notice>
      )}
      {tree.courses.map((course) => (
        <CourseBlock key={course.id} course={course} ctx={ctx} />
      ))}
      {adding ? (
        <Card>
          <TitleForm
            submitLabel="Create course"
            onCancel={() => setAdding(false)}
            onSubmit={async ({ title, description }) => {
              await admin.createCourse({ languageCode: tree.language.code, title, description });
              setAdding(false);
              ctx.say("success", "Course created (unpublished).");
              ctx.reload();
            }}
            onError={(text) => ctx.say("error", text)}
          />
        </Card>
      ) : (
        <Button variant="secondary" onClick={() => setAdding(true)}>
          <Plus aria-hidden="true" className="size-4" /> Add course
        </Button>
      )}
    </div>
  );
}

// One course card: its details, its units and the "Add unit" form.
function CourseBlock({ course, ctx }: { course: TreeCourse; ctx: TreeContext }) {
  const [editing, setEditing] = useState(false);
  const [addingUnit, setAddingUnit] = useState(false);
  const [stage, setStage] = useState<string>(LEARNING_STAGES[0]);
  return (
    <Card className="space-y-4">
      {editing ? (
        <TitleForm
          initial={{ title: course.title, description: course.description }}
          submitLabel="Save course"
          onCancel={() => setEditing(false)}
          onError={(text) => ctx.say("error", text)}
          onSubmit={async (values) => {
            await admin.update("courses", course.id, values);
            setEditing(false);
            ctx.reload();
          }}
        />
      ) : (
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Course</p>
            <h2 className="text-xl font-extrabold text-ink">{course.title}</h2>
            <p className="text-sm text-slate-600">{course.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <StatusBadge published={course.isPublished} />
            <PublishButton type="courses" id={course.id} published={course.isPublished} ctx={ctx} />
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Pencil aria-hidden="true" className="size-4" /> Edit
            </Button>
            <DeleteControl
              what="course"
              remove={(force) => admin.remove("courses", course.id, force)}
              onDeleted={() => {
                ctx.say("success", "Course deleted.");
                ctx.reload();
              }}
              onError={(text) => ctx.say("error", text)}
            />
          </div>
        </div>
      )}

      <ol className="space-y-3">
        {course.units.map((unit, index) => (
          <UnitBlock
            key={unit.id}
            unit={unit}
            number={index + 1}
            first={index === 0}
            last={index === course.units.length - 1}
            ctx={ctx}
          />
        ))}
      </ol>

      {addingUnit ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-4">
          <TitleForm
            submitLabel="Create unit"
            onCancel={() => setAddingUnit(false)}
            onError={(text) => ctx.say("error", text)}
            extra={
              <Field label="Stage">
                {(id) => (
                  <Select
                    id={id}
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    options={LEARNING_STAGES}
                  />
                )}
              </Field>
            }
            onSubmit={async (values) => {
              await admin.createUnit({ courseId: course.id, ...values, stage });
              setAddingUnit(false);
              ctx.say("success", "Unit created (unpublished).");
              ctx.reload();
            }}
          />
        </div>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => setAddingUnit(true)}>
          <Plus aria-hidden="true" className="size-4" /> Add unit
        </Button>
      )}
    </Card>
  );
}

// One unit inside a course: its details, its lessons and the "Add lesson" form.
function UnitBlock({
  unit,
  number,
  first,
  last,
  ctx,
}: {
  unit: TreeUnit;
  number: number;
  first: boolean;
  last: boolean;
  ctx: TreeContext;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [stage, setStage] = useState(unit.stage);
  const [addingLesson, setAddingLesson] = useState(false);
  const [kind, setKind] = useState<LessonKind>("VOCABULARY");

  return (
    <li className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      {editing ? (
        <TitleForm
          initial={{ title: unit.title, description: unit.description }}
          submitLabel="Save unit"
          onCancel={() => setEditing(false)}
          onError={(text) => ctx.say("error", text)}
          extra={
            <Field label="Stage">
              {(id) => (
                <Select
                  id={id}
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  options={LEARNING_STAGES}
                />
              )}
            </Field>
          }
          onSubmit={async (values) => {
            await admin.update("units", unit.id, { ...values, stage });
            setEditing(false);
            ctx.reload();
          }}
        />
      ) : (
        <div className="flex flex-wrap items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Unit {number} · {unit.stage.toLowerCase().replace(/_/g, " ")}
            </p>
            <h3 className="font-extrabold text-ink">{unit.title}</h3>
            <p className="text-sm text-slate-600">{unit.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <StatusBadge published={unit.isPublished} />
            <PublishButton type="units" id={unit.id} published={unit.isPublished} ctx={ctx} />
            <MoveButtons type="units" id={unit.id} first={first} last={last} ctx={ctx} />
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Pencil aria-hidden="true" className="size-4" /> Edit
            </Button>
            <DeleteControl
              what="unit"
              remove={(force) => admin.remove("units", unit.id, force)}
              onDeleted={() => {
                ctx.say("success", "Unit deleted.");
                ctx.reload();
              }}
              onError={(text) => ctx.say("error", text)}
            />
          </div>
        </div>
      )}

      <ol className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {unit.lessons.length === 0 && (
          <li className="px-3 py-2 text-sm text-slate-500">No lessons yet.</li>
        )}
        {unit.lessons.map((lesson, index) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            first={index === 0}
            last={index === unit.lessons.length - 1}
            ctx={ctx}
          />
        ))}
      </ol>

      {addingLesson ? (
        <div className="mt-3 rounded-xl border-2 border-dashed border-slate-200 bg-white p-3">
          <TitleForm
            submitLabel="Create and add exercises"
            descriptionLabel="Intro text (shown before the lesson starts)"
            onCancel={() => setAddingLesson(false)}
            onError={(text) => ctx.say("error", text)}
            extra={
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
            }
            onSubmit={async ({ title, description }) => {
              const { lesson } = await admin.createLesson({
                unitId: unit.id,
                title,
                introText: description,
                kind,
              });
              router.push(`/admin/lessons/${encodeURIComponent(lesson.id)}`);
            }}
          />
        </div>
      ) : (
        <Button size="sm" variant="ghost" className="mt-2" onClick={() => setAddingLesson(true)}>
          <Plus aria-hidden="true" className="size-4" /> Add lesson
        </Button>
      )}
    </li>
  );
}

// One lesson line inside a unit, with links to the lesson editor.
function LessonRow({
  lesson,
  first,
  last,
  ctx,
}: {
  lesson: TreeLesson;
  first: boolean;
  last: boolean;
  ctx: TreeContext;
}) {
  return (
    <li className="flex flex-wrap items-center gap-2 px-3 py-2">
      <div className="min-w-0 flex-1">
        <Link
          href={`/admin/lessons/${encodeURIComponent(lesson.id)}`}
          className="font-bold text-ink hover:text-brand-700 hover:underline"
        >
          {lesson.title}
        </Link>
        <p className="text-xs text-slate-500">
          {lesson.kind.toLowerCase()} · {lesson.exercises} exercise(s) · {lesson.vocabulary} word(s)
          · {lesson.learnersStarted} learner(s) started
        </p>
      </div>
      <StatusBadge published={lesson.isPublished} />
      <PublishButton type="lessons" id={lesson.id} published={lesson.isPublished} ctx={ctx} />
      <MoveButtons type="lessons" id={lesson.id} first={first} last={last} ctx={ctx} />
      <Link
        href={`/admin/lessons/${encodeURIComponent(lesson.id)}`}
        className={buttonStyles({ size: "sm", variant: "ghost" })}
      >
        <Pencil aria-hidden="true" className="size-4" /> Edit
      </Link>
      <DeleteControl
        what="lesson"
        remove={(force) => admin.remove("lessons", lesson.id, force)}
        onDeleted={() => {
          ctx.say("success", "Lesson deleted.");
          ctx.reload();
        }}
        onError={(text) => ctx.say("error", text)}
      />
    </li>
  );
}

/** Title + description (+ an optional extra field), used for create and edit. */
function TitleForm({
  initial = { title: "", description: "" },
  extra,
  submitLabel,
  onSubmit,
  onCancel,
  onError,
  descriptionLabel = "Description",
}: {
  initial?: { title: string; description: string };
  extra?: ReactNode;
  submitLabel: string;
  onSubmit: (values: { title: string; description: string }) => Promise<void>;
  onCancel: () => void;
  onError: (text: string) => void;
  descriptionLabel?: string;
}) {
  const [values, setValues] = useState(initial);
  return (
    <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
      <Field label="Title">
        {(id) => (
          <Input
            id={id}
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        )}
      </Field>
      <Field label={descriptionLabel}>
        {(id) => (
          <Textarea
            id={id}
            rows={2}
            className="font-sans"
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
          />
        )}
      </Field>
      {extra}
      <div className="flex gap-2">
        <ActionButton size="sm" onFail={onError} action={() => onSubmit(values)}>
          {submitLabel}
        </ActionButton>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Toggles a course, unit or lesson between published and draft.
function PublishButton({
  type,
  id,
  published,
  ctx,
}: {
  type: "courses" | "units" | "lessons";
  id: string;
  published: boolean;
  ctx: TreeContext;
}) {
  return (
    <ActionButton
      size="sm"
      variant={published ? "ghost" : "success"}
      onFail={(text) => ctx.say("error", text)}
      action={async () => {
        await admin.publish(type, id, !published);
        ctx.reload();
      }}
    >
      {published ? "Unpublish" : "Publish"}
    </ActionButton>
  );
}

// Up / down arrows that change the order of units or lessons.
function MoveButtons({
  type,
  id,
  first,
  last,
  ctx,
}: {
  type: "units" | "lessons";
  id: string;
  first: boolean;
  last: boolean;
  ctx: TreeContext;
}) {
  const move = (direction: "up" | "down") => async () => {
    await admin.move(type, id, direction);
    ctx.reload();
  };
  return (
    <span className="inline-flex">
      <ActionButton
        size="sm"
        variant="ghost"
        aria-label="Move up"
        title="Move up"
        disabled={first}
        action={move("up")}
        onFail={(text) => ctx.say("error", text)}
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
        onFail={(text) => ctx.say("error", text)}
      >
        <ArrowDown aria-hidden="true" className="size-4" />
      </ActionButton>
    </span>
  );
}
