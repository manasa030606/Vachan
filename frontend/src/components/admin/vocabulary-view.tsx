"use client";

// /admin/vocabulary — the words, letters and phrases of a language. Lessons pick from this list.
// Changes mark the "course vocabulary" knowledge document as needing a re-index (AI Tutor search).
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { admin, type AdminVocabulary } from "@/lib/api/admin";
import { ActionButton, ConfirmDelete, Field, Input, Notice, Select } from "./admin-ui";
import { useLoad } from "./use-load";

/** The editable fields of a vocabulary item. */
type Word = Omit<AdminVocabulary, "id" | "lessons">;
const EMPTY_WORD: Word = { kind: "WORD", script: "", romanization: "", meaning: "", topic: "" };
const KINDS = ["LETTER", "WORD", "PHRASE"] as const;

export function VocabularyView() {
  const languages = useLoad(() => admin.languages(), "languages");
  const [picked, setPicked] = useState<string | null>(null);
  // `search` is what is typed in the box; `query` is only updated when the form is submitted.
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null); // id or "new"
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const code = picked ?? languages.data?.languages[0]?.code ?? "";
  const words = useLoad(
    () => (code ? admin.vocabulary(code, query || undefined) : Promise.resolve({ vocabulary: [] })),
    `${code}|${query}`,
  );
  const say = (tone: "error" | "success", text: string) => setMessage({ tone, text });

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-end gap-3">
        <div className="w-48">
          <Field label="Language">
            {(id) => (
              <Select
                id={id}
                value={code}
                onChange={(e) => setPicked(e.target.value)}
                options={(languages.data?.languages ?? []).map((l) => ({
                  value: l.code,
                  label: l.name,
                }))}
              />
            )}
          </Field>
        </div>
        <form
          className="flex flex-1 items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(search.trim());
          }}
        >
          <div className="min-w-48 flex-1">
            <Field label="Search">
              {(id) => (
                <Input
                  id={id}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Script, romanization or meaning"
                />
              )}
            </Field>
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <Button onClick={() => setEditing("new")}>
          <Plus aria-hidden="true" className="size-4" /> Add word
        </Button>
      </Card>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      {words.error && <Notice>{words.error}</Notice>}

      {editing === "new" && (
        <Card>
          <WordForm
            initial={EMPTY_WORD}
            submitLabel="Add word"
            onCancel={() => setEditing(null)}
            onSave={async (word) => {
              await admin.createVocabulary(code, word);
              setEditing(null);
              say("success", "Word added. Re-index the knowledge base so the AI Tutor knows it.");
              words.reload();
            }}
          />
        </Card>
      )}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold">
                  Script
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Romanization
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Meaning
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Kind · topic
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Lessons
                </th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {words.data?.vocabulary.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    No words found.
                  </td>
                </tr>
              )}
              {words.data?.vocabulary.map((word) =>
                editing === word.id ? (
                  <tr key={word.id}>
                    <td colSpan={6} className="p-4">
                      <WordForm
                        initial={word}
                        submitLabel="Save word"
                        onCancel={() => setEditing(null)}
                        onSave={async (values) => {
                          await admin.updateVocabulary(word.id, values);
                          setEditing(null);
                          say("success", "Word saved.");
                          words.reload();
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={word.id}>
                    <td className="px-4 py-2 text-lg font-bold text-ink">{word.script}</td>
                    <td className="px-4 py-2">{word.romanization}</td>
                    <td className="px-4 py-2">{word.meaning}</td>
                    <td className="px-4 py-2 text-slate-500">
                      {word.kind.toLowerCase()} · {word.topic}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">{word.lessons ?? 0}</td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditing(word.id)}
                        aria-label={`Edit ${word.meaning}`}
                      >
                        <Pencil aria-hidden="true" className="size-4" />
                      </Button>
                      <ConfirmDelete
                        question={
                          word.lessons ? `Used in ${word.lessons} lesson(s). Delete?` : "Delete?"
                        }
                        onConfirm={async () => {
                          try {
                            await admin.deleteVocabulary(word.id);
                            say("success", "Word deleted.");
                            words.reload();
                          } catch (error) {
                            say(
                              "error",
                              error instanceof Error ? error.message : "Could not delete",
                            );
                          }
                        }}
                      />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Add / edit form for one word (shown above the table or inside a table row).
function WordForm({
  initial,
  submitLabel,
  onSave,
  onCancel,
}: {
  initial: Word;
  submitLabel: string;
  onSave: (word: Word) => Promise<void>;
  onCancel: () => void;
}) {
  const [word, setWord] = useState<Word>({
    kind: initial.kind,
    script: initial.script,
    romanization: initial.romanization,
    meaning: initial.meaning,
    topic: initial.topic,
  });
  const [error, setError] = useState<string | null>(null);
  const set = (key: keyof Word) => (e: { target: { value: string } }) =>
    setWord({ ...word, [key]: e.target.value });
  return (
    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-3 sm:grid-cols-5">
        <Field label="Kind">
          {(id) => <Select id={id} value={word.kind} onChange={set("kind")} options={KINDS} />}
        </Field>
        <Field label="Script">
          {(id) => <Input id={id} value={word.script} onChange={set("script")} />}
        </Field>
        <Field label="Romanization">
          {(id) => <Input id={id} value={word.romanization} onChange={set("romanization")} />}
        </Field>
        <Field label="Meaning">
          {(id) => <Input id={id} value={word.meaning} onChange={set("meaning")} />}
        </Field>
        <Field label="Topic">
          {(id) => (
            <Input id={id} value={word.topic} onChange={set("topic")} placeholder="greetings" />
          )}
        </Field>
      </div>
      {error && <Notice>{error}</Notice>}
      <div className="flex gap-2">
        <ActionButton size="sm" onFail={setError} action={() => onSave(word)}>
          {submitLabel}
        </ActionButton>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
