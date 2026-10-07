"use client";

// The role-play chat: partner lines (native script, romanization, English, Listen), learner
// replies with the partner's feedback, reply suggestions, and a composer that accepts typing or
// the microphone (recording → transcript the learner can check and edit → send).
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Flag,
  Loader2,
  Mic,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { endConversation, replyToConversation, transcribeAudio } from "@/lib/api/endpoints";
import type { ConversationDto, ConversationTurnDto, ScenarioId } from "@/lib/api/types";
import { ConversationSummary } from "./conversation-summary";
import { MicButton } from "./mic-button";
import { PhraseAudio } from "./phrase-audio";
import { SCENARIO_ICONS } from "./scenario-picker";
import { useRecorder, type Recording } from "./use-recorder";

type Props = {
  conversation: ConversationDto;
  showRomanization: boolean;
  onChange: (conversation: ConversationDto) => void;
  onExit: () => void;
  onRestart: (scenario: ScenarioId) => void;
};

type Voice = { durationMs: number; bytes: number; sttModel: string };

function PartnerBubble({
  turn,
  language,
  showRomanization,
  showEnglish,
}: {
  turn: ConversationTurnDto;
  language: string;
  showRomanization: boolean;
  showEnglish: boolean;
}) {
  return (
    <li className="flex max-w-[85%] flex-col items-start gap-1 self-start">
      <div className="rounded-3xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
        {turn.status === "refused" && (
          <p className="mb-1 flex items-center gap-1 text-xs font-bold text-marigold-700">
            <ShieldAlert aria-hidden="true" className="size-3.5" /> Back to the role-play — your
            partner repeats the question:
          </p>
        )}
        <p lang={language} className="font-display text-2xl leading-snug font-bold text-ink">
          {turn.text}
        </p>
        {showRomanization && turn.romanization && (
          <p className="text-slate-500">{turn.romanization}</p>
        )}
        {showEnglish && turn.translation && (
          <p className="text-slate-700 italic">“{turn.translation}”</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PhraseAudio compact source={{ text: turn.text, language }} label={turn.text} />
          {turn.references.length > 0 && (
            <details className="text-xs text-slate-500">
              <summary className="inline-flex cursor-pointer items-center gap-1 font-bold">
                <BookOpen aria-hidden="true" className="size-3.5" /> Based on{" "}
                {turn.references.length} {turn.references.length === 1 ? "note" : "notes"}
              </summary>
              <ul className="mt-1 list-disc pl-4">
                {turn.references.map((ref) => (
                  <li key={ref.id}>
                    {ref.heading} <span className="text-slate-400">({ref.reference})</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </li>
  );
}

function LearnerBubble({ turn, language }: { turn: ConversationTurnDto; language: string }) {
  const feedback = turn.feedback;
  return (
    <li className="flex max-w-[85%] flex-col items-end gap-1 self-end">
      <div className="rounded-3xl rounded-br-md bg-brand-600 px-4 py-3 text-white">
        <p lang={language} className="font-display text-xl leading-snug font-bold">
          {turn.text}
        </p>
        {turn.inputMode === "voice" && (
          <p className="mt-0.5 flex items-center justify-end gap-1 text-xs text-brand-100">
            <Mic aria-hidden="true" className="size-3" /> spoken
          </p>
        )}
      </div>
      {feedback && (
        <div className="w-full space-y-1 text-sm">
          {feedback.understood ? (
            <p className="flex items-center justify-end gap-1 font-bold text-emerald-700">
              <CheckCircle2 aria-hidden="true" className="size-4" /> Understood
            </p>
          ) : (
            <p className="text-right font-bold text-marigold-700">
              Your partner may not understand this.
            </p>
          )}
          {feedback.correction && (
            <div className="rounded-2xl border border-brand-200 bg-brand-50 px-3 py-2">
              <p className="flex items-center gap-1 text-xs font-bold text-brand-700">
                <Sparkles aria-hidden="true" className="size-3.5" /> Better (AI suggestion):
              </p>
              <p lang={language} className="font-display text-lg font-bold text-ink">
                {feedback.correction.text}
              </p>
              {feedback.correction.romanization && (
                <p className="text-slate-500">{feedback.correction.romanization}</p>
              )}
              {feedback.correction.explanation && (
                <p className="text-slate-700">{feedback.correction.explanation}</p>
              )}
            </div>
          )}
          {feedback.note && <p className="text-right text-slate-600">{feedback.note}</p>}
        </div>
      )}
    </li>
  );
}

export function ConversationView({
  conversation,
  showRomanization,
  onChange,
  onExit,
  onRestart,
}: Props) {
  const { session, turns } = conversation;
  const language = session.language.code;
  const [showEnglish, setShowEnglish] = useState(session.level !== "intermediate");
  const [text, setText] = useState("");
  const [voice, setVoice] = useState<Voice | null>(null);
  const [sending, setSending] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState<{ message: string; retry?: () => void } | null>(null);
  const recorder = useRecorder({ maxDurationMs: 15_000 });
  const listEnd = useRef<HTMLDivElement>(null);
  const Icon = SCENARIO_ICONS[session.scenario];

  const ended = session.status === "ended";
  const full = session.learnerTurns >= session.maxLearnerTurns;
  const lastPartner = [...turns].reverse().find((t) => t.speaker === "partner");

  useEffect(() => {
    listEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length, sending, ended]);

  const message = (cause: unknown) =>
    cause instanceof ApiError ? cause.message : "Something went wrong. Please try again.";

  const send = async (reply = text, spoken = voice) => {
    const trimmed = reply.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await replyToConversation(session.id, {
        text: trimmed,
        inputMode: spoken ? "voice" : "text",
        audio: spoken ?? undefined,
      });
      onChange({ session: result.session, turns: [...turns, ...result.turns] });
      setText("");
      setVoice(null);
    } catch (cause) {
      setError({ message: message(cause), retry: () => void send(trimmed, spoken) });
    } finally {
      setSending(false);
    }
  };

  const transcribe = async (recording: Recording) => {
    setTranscribing(true);
    setError(null);
    try {
      const result = await transcribeAudio(recording.blob, { language, source: "recorded" });
      setText(result.transcript);
      setVoice({
        durationMs: result.audio.durationMs,
        bytes: result.audio.bytes,
        sttModel: result.model,
      });
    } catch (cause) {
      setError({
        message: message(cause),
        retry:
          cause instanceof ApiError && cause.status !== 422 && cause.status !== 415
            ? () => void transcribe(recording)
            : undefined,
      });
    } finally {
      setTranscribing(false);
    }
  };

  const end = async () => {
    setEnding(true);
    setError(null);
    try {
      onChange(await endConversation(session.id));
    } catch (cause) {
      setError({ message: message(cause), retry: () => void end() });
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onExit}
            aria-label="Back to scenarios"
            className="mt-1 rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </button>
          <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-ink">{session.scenarioTitle}</h2>
            <p className="text-sm text-slate-600">
              Your partner: {session.partnerRole} · <strong>Goal:</strong> {session.goal}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
            {Math.min(session.learnerTurns, session.maxLearnerTurns)} / {session.maxLearnerTurns}{" "}
            replies
          </span>
          <button
            type="button"
            aria-pressed={showEnglish}
            onClick={() => setShowEnglish((v) => !v)}
            className="rounded-full px-3 py-1 text-sm font-bold text-brand-700 ring-2 ring-brand-100 ring-inset hover:bg-brand-50"
          >
            {showEnglish ? "Hide English" : "Show English"}
          </button>
          {!ended && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => void end()}
              disabled={ending || sending}
            >
              {ending ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Flag aria-hidden="true" className="size-4" />
              )}
              End role-play
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-card border border-slate-200 bg-paper p-3 sm:p-4">
        <ol aria-label="Conversation" aria-live="polite" className="flex flex-col gap-3">
          {turns.map((turn) =>
            turn.speaker === "partner" ? (
              <PartnerBubble
                key={turn.id}
                turn={turn}
                language={language}
                showRomanization={showRomanization}
                showEnglish={showEnglish}
              />
            ) : (
              <LearnerBubble key={turn.id} turn={turn} language={language} />
            ),
          )}
          {sending && (
            <li
              className="self-start rounded-3xl bg-white px-4 py-3 text-slate-500 shadow-sm"
              aria-label="Partner is answering"
            >
              <span className="inline-flex gap-1">
                <span className="size-2 animate-bounce rounded-full bg-slate-400" />
                <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
              </span>
            </li>
          )}
        </ol>
        <div ref={listEnd} />
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3"
        >
          <p className="font-bold text-rose-700">{error.message}</p>
          {error.retry && (
            <Button size="sm" variant="secondary" onClick={error.retry}>
              <RotateCcw aria-hidden="true" className="size-4" /> Retry
            </Button>
          )}
        </div>
      )}

      {ended ? (
        <ConversationSummary
          session={session}
          onAgain={() => onRestart(session.scenario)}
          onChooseAnother={onExit}
        />
      ) : full ? (
        <div className="rounded-card bg-emerald-50 p-4 text-center">
          <p className="font-bold text-emerald-800">Role-play complete — well done!</p>
          <Button className="mt-3" onClick={() => void end()} disabled={ending}>
            {ending ? "Preparing your summary…" : "See my summary"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3 rounded-card border border-slate-200 bg-white p-3">
          {lastPartner && lastPartner.suggestions.length > 0 && (
            <div>
              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                You could say
              </p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {lastPartner.suggestions.map((suggestion) => (
                  <li key={suggestion.text}>
                    <button
                      type="button"
                      onClick={() => {
                        setText(suggestion.text);
                        setVoice(null);
                      }}
                      className="rounded-2xl border-2 border-brand-100 px-3 py-1.5 text-left hover:border-brand-300 hover:bg-brand-50"
                    >
                      <span
                        lang={language}
                        className="block font-display text-lg font-bold text-ink"
                      >
                        {suggestion.text}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {suggestion.romanization} · {suggestion.meaning}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {voice && (
            <p
              className="rounded-2xl bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700"
              role="status"
            >
              This is what speech-to-text heard — check it, edit it if needed, then send.
            </p>
          )}
          <form
            className="flex items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <MicButton
              size="md"
              recorder={recorder}
              idleLabel="Reply by voice"
              disabled={sending || transcribing}
              onRecording={(recording) => void transcribe(recording)}
            />
            <label className="sr-only" htmlFor="roleplay-reply">
              Your reply in {session.language.name}
            </label>
            <textarea
              id="roleplay-reply"
              lang={language}
              rows={1}
              value={text}
              maxLength={300}
              disabled={sending || transcribing || recorder.isRecording}
              placeholder={transcribing ? "Transcribing…" : `Reply in ${session.language.name}…`}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send();
                }
              }}
              className="mb-6 min-h-12 flex-1 resize-none rounded-2xl border-2 border-slate-200 px-4 py-2.5 font-display text-lg focus:border-brand-400 focus:outline-none"
            />
            <Button
              type="submit"
              className="mb-6"
              disabled={!text.trim() || sending || transcribing}
              aria-label="Send reply"
            >
              {sending ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Send aria-hidden="true" className="size-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
