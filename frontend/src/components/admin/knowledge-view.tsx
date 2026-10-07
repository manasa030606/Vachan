"use client";

// /admin/knowledge — the RAG knowledge base the AI Tutor and role-plays search.
//   FILE   notes from backend/knowledge-base/*.md (text edited in git; publish/unpublish here)
//   COURSE generated from the course vocabulary
//   ADMIN  notes written here
// Safe workflow: write (draft) → preview the chunks → publish (= index) → edit → re-index.
// Old chunks stay searchable until the new ones are saved; unpublishing removes them at once.
import { AlertTriangle, ArrowLeft, Eye, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  admin,
  KNOWLEDGE_LEVELS,
  KNOWLEDGE_SKILLS,
  KNOWLEDGE_TYPES,
  type KnowledgeChunkPreview,
  type KnowledgeDoc,
  type KnowledgeInput,
} from "@/lib/api/admin";
import { cn } from "@/lib/cn";
import {
  ActionButton,
  ConfirmDelete,
  Field,
  Input,
  Notice,
  Select,
  StatusBadge,
  Textarea,
} from "./admin-ui";
import { useLoad } from "./use-load";

type Say = (tone: "error" | "success" | "info", text: string) => void;

const NEW_NOTE: KnowledgeInput = {
  title: "",
  source: "Vachan team",
  level: "beginner",
  topic: "",
  contentType: "phrase",
  skill: "conversation",
  body: "## First section heading\n\nWrite the explanation here. Each “## ” heading becomes one searchable chunk.\n",
};

export function KnowledgeView() {
  const languages = useLoad(() => admin.languages(), "languages");
  const [filters, setFilters] = useState({ language: "", origin: "", status: "" });
  const list = useLoad(() => admin.knowledge(filters), JSON.stringify(filters));
  const [open, setOpen] = useState<string | null>(null); // document id or "new"
  const [message, setMessage] = useState<{
    tone: "error" | "success" | "info";
    text: string;
  } | null>(null);
  const say: Say = (tone, text) => setMessage({ tone, text });
  const close = () => {
    setOpen(null);
    list.reload();
  };

  if (open) {
    return (
      <div className="space-y-4">
        <Button size="sm" variant="ghost" onClick={close}>
          <ArrowLeft aria-hidden="true" className="size-4" /> All documents
        </Button>
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
        {open === "new" ? (
          <NewDocument
            languages={(languages.data?.languages ?? []).map((l) => ({
              value: l.code,
              label: l.name,
            }))}
            onCreated={(id) => {
              say(
                "success",
                "Saved as a draft. Check the chunk preview, then publish to make it searchable.",
              );
              setOpen(id);
            }}
            say={say}
          />
        ) : (
          <DocumentDetail
            id={open}
            say={say}
            onDeleted={close}
            searchEnabled={list.data?.searchEnabled ?? false}
          />
        )}
      </div>
    );
  }

  const data = list.data;
  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Field label="Language">
            {(id) => (
              <Select
                id={id}
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                options={[
                  { value: "", label: "All" },
                  ...(languages.data?.languages ?? []).map((l) => ({
                    value: l.code,
                    label: l.name,
                  })),
                ]}
              />
            )}
          </Field>
        </div>
        <div className="w-40">
          <Field label="Source">
            {(id) => (
              <Select
                id={id}
                value={filters.origin}
                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                options={[
                  { value: "", label: "All" },
                  { value: "ADMIN", label: "Dashboard notes" },
                  { value: "FILE", label: "Files (git)" },
                  { value: "COURSE", label: "Course vocabulary" },
                ]}
              />
            )}
          </Field>
        </div>
        <div className="w-36">
          <Field label="Status">
            {(id) => (
              <Select
                id={id}
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                options={[
                  { value: "", label: "All" },
                  { value: "PUBLISHED", label: "Published" },
                  { value: "DRAFT", label: "Draft" },
                ]}
              />
            )}
          </Field>
        </div>
        <div className="ml-auto flex gap-2">
          <ActionButton
            variant="secondary"
            disabled={!data?.searchEnabled || data.indexing}
            title={
              data?.searchEnabled ? "Embed everything that changed" : "Search is off on this server"
            }
            onFail={(t) => say("error", t)}
            action={async () => {
              say(
                "info",
                "Re-indexing… the first run loads the embedding model and can take a minute.",
              );
              const { report } = await admin.reindexAll();
              say(
                "success",
                `Done in ${report.seconds}s: ${report.embedded.length} re-embedded, ${report.skipped.length} unchanged, ${report.removed.length} removed, ${report.drafts.length} drafts skipped.`,
              );
              list.reload();
            }}
          >
            <RefreshCw aria-hidden="true" className="size-4" /> Re-index all
          </ActionButton>
          <Button onClick={() => setOpen("new")}>
            <Plus aria-hidden="true" className="size-4" /> New note
          </Button>
        </div>
      </Card>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      {list.error && <Notice>{list.error}</Notice>}
      {data && !data.searchEnabled && (
        <Notice tone="info">
          Search (RAG_ENABLED) is off on this server, so it can’t embed text. You can still write,
          publish and unpublish notes here; then run <code>npm run rag:index -w backend</code> with
          this server’s DATABASE_URL from your computer.
        </Notice>
      )}

      {data && (
        <Card className="p-0">
          <p className="border-b border-slate-200 px-4 py-3 text-sm text-slate-600">
            {data.totals.documents} document(s) shown · {data.totals.chunks} searchable chunks in
            total
            {data.indexing && " · indexing in progress…"}
          </p>
          <ul className="divide-y divide-slate-100">
            {data.documents.map((doc) => (
              <li key={doc.id}>
                <button
                  type="button"
                  onClick={() => setOpen(doc.id)}
                  className="flex w-full flex-wrap items-center gap-2 px-4 py-3 text-left hover:bg-slate-50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-ink">{doc.title}</span>
                    <span className="block truncate text-xs text-slate-500">
                      {doc.languageCode} · {originLabel(doc.origin)} · {doc.id}
                    </span>
                  </span>
                  <DocBadges doc={doc} />
                  <span className="w-20 text-right text-sm text-slate-600 tabular-nums">
                    {doc.chunkCount} chunks
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

const originLabel = (origin: KnowledgeDoc["origin"]) =>
  origin === "ADMIN" ? "dashboard note" : origin === "FILE" ? "file" : "course vocabulary";

function DocBadges({ doc }: { doc: KnowledgeDoc }) {
  return (
    <span className="flex flex-wrap items-center gap-1">
      <StatusBadge published={doc.status === "PUBLISHED"} />
      {doc.needsReindex && doc.status === "PUBLISHED" && (
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-extrabold text-amber-800">
          Needs re-index
        </span>
      )}
      {doc.lastIndexError && (
        <span
          className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-extrabold text-rose-700"
          title={doc.lastIndexError}
        >
          <AlertTriangle aria-hidden="true" className="size-3" /> Index error
        </span>
      )}
    </span>
  );
}

function MetadataFields({
  value,
  onChange,
}: {
  value: KnowledgeInput;
  onChange: (next: KnowledgeInput) => void;
}) {
  const set = (key: keyof KnowledgeInput) => (e: { target: { value: string } }) =>
    onChange({ ...value, [key]: e.target.value });
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title">
          {(id) => <Input id={id} value={value.title} onChange={set("title")} />}
        </Field>
        <Field label="Source" hint="Where the information comes from (book, teacher, website).">
          {(id) => <Input id={id} value={value.source} onChange={set("source")} />}
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Level">
          {(id) => (
            <Select
              id={id}
              value={value.level}
              onChange={set("level")}
              options={KNOWLEDGE_LEVELS.map((v) => ({ value: v, label: v }))}
            />
          )}
        </Field>
        <Field label="Topic" hint="lowercase-slug">
          {(id) => (
            <Input id={id} value={value.topic} onChange={set("topic")} placeholder="greetings" />
          )}
        </Field>
        <Field label="Type">
          {(id) => (
            <Select
              id={id}
              value={value.contentType}
              onChange={set("contentType")}
              options={KNOWLEDGE_TYPES.map((v) => ({ value: v, label: v }))}
            />
          )}
        </Field>
        <Field label="Skill">
          {(id) => (
            <Select
              id={id}
              value={value.skill}
              onChange={set("skill")}
              options={KNOWLEDGE_SKILLS.map((v) => ({ value: v, label: v }))}
            />
          )}
        </Field>
      </div>
      <Field
        label="Text (markdown)"
        hint="Start each section with “## Heading”. Every section becomes one chunk the tutor can cite."
      >
        {(id) => <Textarea id={id} rows={14} value={value.body} onChange={set("body")} />}
      </Field>
    </>
  );
}

function NewDocument({
  languages,
  onCreated,
  say,
}: {
  languages: Array<{ value: string; label: string }>;
  onCreated: (id: string) => void;
  say: Say;
}) {
  const [language, setLanguage] = useState(languages[0]?.value ?? "");
  const [value, setValue] = useState<KnowledgeInput>(NEW_NOTE);
  return (
    <Card className="space-y-4">
      <CardHeader
        title="New knowledge note"
        description="Saved as a draft — drafts are never searched by the AI Tutor."
      />
      <div className="w-48">
        <Field label="Language">
          {(id) => (
            <Select
              id={id}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={languages}
            />
          )}
        </Field>
      </div>
      <MetadataFields value={value} onChange={setValue} />
      <ActionButton
        onFail={(t) => say("error", t)}
        action={async () => {
          const { document } = await admin.createKnowledge(language, value);
          onCreated(document.id);
        }}
      >
        Save draft
      </ActionButton>
    </Card>
  );
}

function DocumentDetail({
  id,
  say,
  onDeleted,
  searchEnabled,
}: {
  id: string;
  say: Say;
  onDeleted: () => void;
  searchEnabled: boolean;
}) {
  const { data, error, reload } = useLoad(() => admin.knowledgeDoc(id), id);
  const [preview, setPreview] = useState<KnowledgeChunkPreview[] | null>(null);
  if (error && !data) return <Notice>{error}</Notice>;
  if (!data) return <p className="text-slate-500">Loading…</p>;
  const doc = data.document;
  const published = doc.status === "PUBLISHED";

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              {doc.languageCode} · {originLabel(doc.origin)}
            </p>
            <h2 className="text-xl font-extrabold text-ink">{doc.title}</h2>
            <p className="text-sm break-all text-slate-500">
              {doc.id} · source: {doc.source}
            </p>
          </div>
          <DocBadges doc={doc} />
        </div>
        {doc.lastIndexError && (
          <Notice>
            Last indexing failed: {doc.lastIndexError} (the previous chunks were kept).
          </Notice>
        )}
        <div className="flex flex-wrap gap-2">
          <ActionButton
            variant={published ? "secondary" : "success"}
            size="sm"
            onFail={(t) => say("error", t)}
            action={async () => {
              const result = await admin.publishKnowledge(doc.id, !published);
              say(
                result.message ? "info" : "success",
                result.message ??
                  (published
                    ? "Unpublished — the tutor no longer finds it."
                    : `Published and indexed: ${result.chunks} chunks are searchable.`),
              );
              reload();
            }}
          >
            {published ? "Unpublish" : "Publish"}
          </ActionButton>
          <ActionButton
            variant="secondary"
            size="sm"
            disabled={!published || !searchEnabled}
            title={
              !searchEnabled
                ? "Search is off on this server"
                : !published
                  ? "Publish first"
                  : undefined
            }
            onFail={(t) => say("error", t)}
            action={async () => {
              const result = await admin.reindexKnowledge(doc.id);
              say("success", `Re-indexed: ${result.chunks} chunks.`);
              reload();
            }}
          >
            <RefreshCw aria-hidden="true" className="size-4" /> Re-index
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="sm"
            onFail={(t) => say("error", t)}
            action={async () => setPreview((await admin.previewKnowledge(doc.id)).chunks)}
          >
            <Eye aria-hidden="true" className="size-4" /> Preview chunks
          </ActionButton>
          {doc.origin === "ADMIN" && (
            <ConfirmDelete
              question="Delete this note and its chunks?"
              onConfirm={async () => {
                await admin.deleteKnowledge(doc.id);
                onDeleted();
              }}
            />
          )}
        </div>
      </Card>

      {preview && (
        <ChunkList title="Preview — what indexing will produce (nothing saved)" chunks={preview} />
      )}

      {doc.origin === "ADMIN" ? (
        <EditNote
          key={doc.updatedAt}
          initial={{
            title: doc.title,
            source: doc.source,
            level: (doc.level ?? "beginner").toLowerCase(),
            topic: doc.topic ?? "",
            contentType: (doc.contentType ?? "explanation").toLowerCase().replace(/_/g, "-"),
            skill: (doc.skill ?? "vocabulary").toLowerCase(),
            body: doc.body ?? "",
          }}
          published={published}
          onSaved={(chunks) => {
            setPreview(chunks);
            say(
              "success",
              published ? "Saved. The old chunks stay searchable until you re-index." : "Saved.",
            );
            reload();
          }}
          id={doc.id}
          say={say}
        />
      ) : (
        <Notice tone="info">
          {doc.origin === "FILE"
            ? `This note's text lives in ${doc.reference}. Edit the file in git, then re-index.`
            : "Built from the course vocabulary — edit words in the Vocabulary section, then re-index."}
        </Notice>
      )}

      <ChunkList
        title={`Indexed chunks (${doc.chunks.length}) — what the tutor can find now`}
        chunks={doc.chunks}
      />
    </div>
  );
}

function EditNote({
  id,
  initial,
  published,
  onSaved,
  say,
}: {
  id: string;
  initial: KnowledgeInput;
  published: boolean;
  onSaved: (chunks: KnowledgeChunkPreview[]) => void;
  say: Say;
}) {
  const [value, setValue] = useState(initial);
  return (
    <Card className="space-y-4">
      <CardHeader
        title="Edit note"
        description={published ? "Saving does not change search until you re-index." : undefined}
      />
      <MetadataFields value={value} onChange={setValue} />
      <ActionButton
        onFail={(t) => say("error", t)}
        action={async () => {
          const { document } = await admin.updateKnowledge(id, value);
          onSaved(document.preview);
        }}
      >
        Save changes
      </ActionButton>
    </Card>
  );
}

function ChunkList({ title, chunks }: { title: string; chunks: KnowledgeChunkPreview[] }) {
  return (
    <Card>
      <CardHeader as="h3" title={title} />
      {chunks.length === 0 ? (
        <p className="text-sm text-slate-500">No chunks.</p>
      ) : (
        <ol className="space-y-2">
          {chunks.map((chunk) => (
            <li key={chunk.id} className={cn("rounded-xl border border-slate-200 p-3")}>
              <p className="font-bold text-ink">{chunk.heading}</p>
              <p className="text-xs text-slate-500">
                {[chunk.level, chunk.topic, chunk.contentType, chunk.skill]
                  .map((v) => v.toLowerCase())
                  .join(" · ")}{" "}
                · {chunk.characters ?? chunk.charCount} characters
              </p>
              <p className="mt-1 line-clamp-3 text-sm whitespace-pre-line text-slate-700">
                {chunk.excerpt ?? chunk.content}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
