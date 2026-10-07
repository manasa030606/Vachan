// Feedback for one speaking attempt, in three SEPARATE parts (they measure different things):
//   1. Content match   — the transcript compared with the expected phrase (text, no AI)
//   2. Pronunciation   — AI listening notes, experimental (or "not supported here")
//   3. Fluency         — timing of sound and silence in the recording (no AI)
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Clock,
  Ear,
  FileText,
  Info,
  MinusCircle,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { SpeakingEvaluationDto, WordResultDto } from "@/lib/api/types";
import { cn } from "@/lib/cn";

const VERDICT = {
  match: {
    label: "Matches the phrase",
    icon: CheckCircle2,
    tone: "text-emerald-700 bg-emerald-50",
  },
  close: {
    label: "Almost — small differences",
    icon: CircleDot,
    tone: "text-brand-700 bg-brand-50",
  },
  partial: {
    label: "Partly matches",
    icon: AlertTriangle,
    tone: "text-marigold-700 bg-marigold-50",
  },
  different: {
    label: "Different from the phrase",
    icon: XCircle,
    tone: "text-rose-700 bg-rose-50",
  },
  "nothing-heard": {
    label: "No words recognised",
    icon: MinusCircle,
    tone: "text-slate-700 bg-slate-100",
  },
} as const;

const WORD = {
  correct: {
    label: "right",
    icon: CheckCircle2,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  close: { label: "almost", icon: CircleDot, tone: "border-brand-200 bg-brand-50 text-brand-800" },
  wrong: { label: "different", icon: XCircle, tone: "border-rose-200 bg-rose-50 text-rose-800" },
  missing: {
    label: "not heard",
    icon: MinusCircle,
    tone: "border-slate-200 bg-slate-50 text-slate-600",
  },
} as const;

const FLUENCY = {
  smooth: "Smooth",
  "some-pauses": "Some pauses",
  hesitant: "Hesitant",
} as const;

const s = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

function WordChip({ word }: { word: WordResultDto }) {
  const style = WORD[word.status];
  const Icon = style.icon;
  return (
    <li className={cn("rounded-2xl border-2 px-3 py-2", style.tone)}>
      <p className="font-display text-xl font-bold">{word.expected}</p>
      <p className="flex items-center gap-1 text-xs font-bold">
        <Icon aria-hidden="true" className="size-3.5" />
        {style.label}
        {word.heard && word.status !== "correct" && (
          <span className="font-normal">
            {" "}
            — heard <span className="font-display">{word.heard}</span>
          </span>
        )}
      </p>
    </li>
  );
}

function Section({
  step,
  title,
  badge,
  icon: Icon,
  children,
}: {
  step: number;
  title: string;
  badge: string;
  icon: typeof Ear;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`feedback-${step}`}
      className="rounded-card border border-slate-200/80 bg-white p-4 shadow-sm"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3
          id={`feedback-${step}`}
          className="flex items-center gap-2 text-lg font-extrabold text-ink"
        >
          <Icon aria-hidden="true" className="size-5 text-brand-600" />
          <span>
            {step}. {title}
          </span>
        </h3>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
          {badge}
        </span>
      </div>
      {children}
    </section>
  );
}

export function SpeakingFeedback({ result }: { result: SpeakingEvaluationDto }) {
  const verdict = VERDICT[result.content.verdict];
  const VerdictIcon = verdict.icon;
  const { pronunciation, fluency } = result;

  return (
    <div className="space-y-4">
      <div className="rounded-card border-2 border-brand-100 bg-brand-50/50 p-4">
        <p className="flex items-center gap-1.5 text-sm font-bold text-brand-700">
          <FileText aria-hidden="true" className="size-4" /> Speech-to-text heard
        </p>
        <p className="mt-1 font-display text-3xl font-bold [overflow-wrap:anywhere] text-ink">
          {result.transcript || "—"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {result.content.comparedWith === "romanization"
            ? "The transcript came back in Latin letters, so it was compared with the romanization. "
            : ""}
          Model: {result.model} · recording {s(result.audio.durationMs)}
        </p>
      </div>

      {result.warnings.length > 0 && (
        <ul className="space-y-1">
          {result.warnings.map((warning) => (
            <li
              key={warning.code}
              className="flex items-start gap-2 rounded-2xl bg-marigold-50 px-3 py-2 text-sm font-bold text-marigold-700"
            >
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              {warning.message}
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Section step={1} title="Content match" badge="Text check" icon={FileText}>
          <p
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 font-extrabold",
              verdict.tone,
            )}
          >
            <VerdictIcon aria-hidden="true" className="size-5" />
            {verdict.label}
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink">
            {result.content.score}
            <span className="text-base font-bold text-slate-500"> / 100 letter match</span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Word by word">
            {result.content.words.map((word, index) => (
              <WordChip key={`${word.expected}-${index}`} word={word} />
            ))}
          </ul>
          {result.content.extraWords.length > 0 && (
            <p className="mt-2 text-sm text-slate-600">
              Extra words heard:{" "}
              <span className="font-display font-bold">{result.content.extraWords.join(" ")}</span>
            </p>
          )}
          <p className="mt-3 flex gap-1.5 text-xs text-slate-500">
            <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            {result.content.method}
          </p>
        </Section>

        <Section
          step={2}
          title="Pronunciation"
          badge={pronunciation.supported ? "AI · experimental" : "Not available"}
          icon={Sparkles}
        >
          {pronunciation.supported ? (
            <>
              {pronunciation.notes.length > 0 ? (
                <ul className="space-y-2">
                  {pronunciation.notes.map((note, index) => (
                    <li key={index} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                      {note.word && (
                        <span className="font-display text-lg font-bold">{note.word}: </span>
                      )}
                      {note.tip}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">No specific sounds to point out.</p>
              )}
              {pronunciation.overall && (
                <p className="mt-2 font-bold text-ink">{pronunciation.overall}</p>
              )}
              {!pronunciation.confident && (
                <p className="mt-2 text-sm font-bold text-marigold-700">
                  The AI wasn&apos;t sure about this recording — take these notes lightly.
                </p>
              )}
              <p className="mt-3 flex gap-1.5 text-xs text-slate-500">
                <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                {pronunciation.disclaimer}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600">{pronunciation.reason}</p>
              <p className="mt-2 text-sm text-slate-600">
                Tip: play the phrase at 0.75× and copy it sound by sound. A high content match does
                not mean perfect pronunciation.
              </p>
            </>
          )}
        </Section>

        <Section step={3} title="Fluency" badge="Timing only" icon={Clock}>
          <p className="text-xl font-extrabold text-ink">{FLUENCY[fluency.rating]}</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
            <dt className="text-slate-500">Speaking time</dt>
            <dd className="font-bold">{s(fluency.speakingMs)}</dd>
            <dt className="text-slate-500">Pauses</dt>
            <dd className="font-bold">
              {fluency.pauses}
              {fluency.pauses > 0 && ` (longest ${s(fluency.longestPauseMs)})`}
            </dd>
            {fluency.startDelayMs !== null && (
              <>
                <dt className="text-slate-500">Started after</dt>
                <dd className="font-bold">{s(fluency.startDelayMs)}</dd>
              </>
            )}
            {fluency.lettersPerSecond !== null && (
              <>
                <dt className="text-slate-500">Speed</dt>
                <dd className="font-bold">{fluency.lettersPerSecond} letters/s</dd>
              </>
            )}
          </dl>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {fluency.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p className="mt-3 flex gap-1.5 text-xs text-slate-500">
            <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            {fluency.method}
          </p>
        </Section>
      </div>
    </div>
  );
}
