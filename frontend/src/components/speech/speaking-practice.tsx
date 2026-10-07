"use client";

// Speaking exercise: the learner sees a phrase, records themselves, the server turns the audio
// into text and compares it with the expected phrase, and we show feedback
// on content, pronunciation and fluency.
import { ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api/client";
import { evaluateSpeaking, getSpeakingPhrases } from "@/lib/api/endpoints";
import type { SpeakingEvaluationDto, SpeechStatusDto } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { MicButton } from "./mic-button";
import { PhraseAudio } from "./phrase-audio";
import { SpeakingFeedback } from "./speaking-feedback";
import { UploadAudio } from "./upload-audio";
import { useRecorder, type Recording } from "./use-recorder";

/** Errors where it makes sense to send the same recording again (the audio was not the problem). */
const RETRYABLE = new Set([
  "NETWORK_ERROR",
  "TIMEOUT",
  "LLM_TIMEOUT",
  "LLM_UNAVAILABLE",
  "LLM_FAILED",
  "LLM_RATE_LIMITED",
  "RATE_LIMITED",
  "INTERNAL_SERVER_ERROR",
]);

type Props = { language: string; status: SpeechStatusDto };

/** The Speak tab: pick a phrase, record it and get feedback. */
export function SpeakingPractice({ language, status }: Props) {
  const phrases = useApi(() => getSpeakingPhrases(language), `speak-phrases:${language}`);
  const recorder = useRecorder({ maxDurationMs: Math.min(15_000, status.limits.maxDurationMs) });
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SpeakingEvaluationDto | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  // The last recording sent, so it can be re-sent after a network or server error.
  const [last, setLast] = useState<{
    recording: Recording;
    source: "recorded" | "uploaded";
  } | null>(null);
  // Best score per phrase in this visit (phrase id to score).
  const [scores, setScores] = useState<Record<string, number>>({});

  const list = useMemo(() => phrases.data?.phrases ?? [], [phrases.data]);
  const phrase = list[Math.min(index, list.length - 1)];

  const submit = async (recording: Recording, source: "recorded" | "uploaded") => {
    if (!phrase) return;
    setLast({ recording, source });
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const evaluation = await evaluateSpeaking(recording.blob, {
        language,
        vocabularyItemId: phrase.id,
        source,
      });
      setResult(evaluation);
      setScores((current) => ({
        ...current,
        [phrase.id]: Math.max(current[phrase.id] ?? 0, evaluation.content.score),
      }));
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause
          : new ApiError(0, "UNKNOWN_ERROR", "Something went wrong"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goTo = (next: number) => {
    setIndex(next);
    setResult(null);
    setError(null);
    recorder.reset();
  };

  if (phrases.isLoading) {
    return (
      <p className="py-10 text-center text-slate-500" aria-busy="true">
        Loading phrases…
      </p>
    );
  }
  if (phrases.error || !phrase) {
    return (
      <Card role="alert" className="text-center">
        <p className="font-bold text-rose-700">
          {phrases.error?.message ?? "There are no phrases to practise for this language yet."}
        </p>
        {phrases.error && (
          <Button variant="secondary" className="mt-3" onClick={phrases.reload}>
            Try again
          </Button>
        )}
      </Card>
    );
  }

  // Prefer this visit's best score; otherwise use the best score saved on the server.
  const best = (id: string, fromServer: number | null) => scores[id] ?? fromServer;

  return (
    <div className="space-y-4">
      {/* Phrase picker */}
      <div>
        <h2 className="mb-2 text-sm font-bold tracking-wide text-slate-500 uppercase">
          Choose a word or phrase
        </h2>
        <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" aria-label="Phrases to practise">
          {list.map((item, itemIndex) => {
            const score = best(item.id, item.bestScore);
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  aria-current={itemIndex === index ? "true" : undefined}
                  onClick={() => goTo(itemIndex)}
                  className={cn(
                    "rounded-2xl border-2 px-3 py-2 text-left transition",
                    itemIndex === index
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 bg-white hover:border-brand-200",
                  )}
                >
                  <span className="block font-display text-lg leading-tight font-bold text-ink">
                    {item.script}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {item.meaning}
                    {score !== null && (
                      <span className="font-bold text-emerald-700"> · best {score}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The expected phrase */}
      <Card className="space-y-4 text-center">
        <p className="text-sm font-bold tracking-wide text-brand-700 uppercase">
          Say this {phrase.kind === "PHRASE" ? "sentence" : "word"}
        </p>
        <div>
          <p className="font-display text-5xl leading-tight font-bold [overflow-wrap:anywhere] text-brand-800">
            {phrase.script}
          </p>
          <p className="mt-1 text-lg text-slate-500">{phrase.romanization}</p>
          <p className="text-lg font-extrabold text-ink">“{phrase.meaning}”</p>
        </div>
        <PhraseAudio
          className="flex flex-col items-center"
          source={{ vocabularyItemId: phrase.id, text: phrase.script, language }}
          label={`${phrase.script} (${phrase.meaning})`}
        />

        <div className="border-t border-slate-100 pt-4">
          {submitting ? (
            <p
              className="flex items-center justify-center gap-2 py-6 font-bold text-brand-700"
              aria-live="polite"
            >
              <Loader2 aria-hidden="true" className="size-5 animate-spin" />
              Listening to your recording… (speech-to-text)
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <MicButton
                recorder={recorder}
                idleLabel="Record yourself"
                onRecording={(recording) => void submit(recording, "recorded")}
              />
              <UploadAudio
                maxDurationMs={status.limits.maxDurationMs}
                disabled={recorder.isRecording}
                onRecording={(recording) => void submit(recording, "uploaded")}
              />
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-left">
            <p className="font-bold text-rose-700">{error.message}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {last && RETRYABLE.has(error.code) && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => void submit(last.recording, last.source)}
                >
                  <RotateCcw aria-hidden="true" className="size-4" /> Send the same recording again
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => setError(null)}>
                Record again
              </Button>
            </div>
          </div>
        )}
      </Card>

      {result && (
        <>
          <SpeakingFeedback result={result} />
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" onClick={() => setResult(null)}>
              <RotateCcw aria-hidden="true" className="size-4" /> Try again
            </Button>
            <Button onClick={() => goTo((index + 1) % list.length)}>
              Next phrase <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
