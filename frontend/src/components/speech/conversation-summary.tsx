// End-of-session summary: counted statistics (no AI) + the AI's short review.
import {
  CheckCircle2,
  Flag,
  MessageSquareText,
  Mic,
  PartyPopper,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConversationSessionDto } from "@/lib/api/types";
import { PhraseAudio } from "./phrase-audio";

type Props = {
  session: ConversationSessionDto;
  onAgain: () => void;
  onChooseAnother: () => void;
};

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Mic;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
      <Icon aria-hidden="true" className="mx-auto size-5 text-brand-600" />
      <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
      <p className="text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}

export function ConversationSummary({ session, onAgain, onChooseAnother }: Props) {
  const summary = session.summary;
  if (!summary) return null;
  const { stats, review } = summary;

  return (
    <section
      aria-labelledby="summary-title"
      className="space-y-4 rounded-card border-2 border-brand-100 bg-white p-5"
    >
      <div className="flex items-center gap-3">
        <PartyPopper aria-hidden="true" className="size-8 text-marigold-500" />
        <div>
          <h3 id="summary-title" className="text-2xl font-extrabold text-ink">
            Session summary
          </h3>
          <p className="text-sm text-slate-500">
            {session.scenarioTitle} · {session.language.name} ·{" "}
            {Math.max(1, Math.round(stats.durationSeconds / 60))} min
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat icon={MessageSquareText} value={stats.replies} label="replies" />
        <Stat icon={Mic} value={stats.voiceReplies} label="spoken replies" />
        <Stat
          icon={CheckCircle2}
          value={`${stats.understoodReplies}/${stats.replies}`}
          label="understood"
        />
        <Stat icon={Sparkles} value={stats.corrections} label="corrections" />
      </div>

      <p className="flex items-center gap-2 font-bold">
        {stats.goalReached ? (
          <>
            <Target aria-hidden="true" className="size-5 text-emerald-600" />
            <span className="text-emerald-700">Goal reached: {session.goal}</span>
          </>
        ) : (
          <>
            <Flag aria-hidden="true" className="size-5 text-slate-500" />
            <span className="text-slate-600">Goal: {session.goal}</span>
          </>
        )}
      </p>

      {stats.vocabularyUsed.length > 0 && (
        <div>
          <h4 className="font-extrabold text-ink">Course words you used</h4>
          <ul className="mt-1 flex flex-wrap gap-2">
            {stats.vocabularyUsed.map((word) => (
              <li
                key={word.script}
                className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800"
              >
                <span className="font-display font-bold">{word.script}</span> · {word.meaning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {review ? (
        <div className="grid gap-4 md:grid-cols-2">
          {review.strengths.length > 0 && (
            <div>
              <h4 className="font-extrabold text-ink">What went well</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                {review.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {review.practise.length > 0 && (
            <div>
              <h4 className="font-extrabold text-ink">Practise next</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                {review.practise.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {review.usefulPhrases.length > 0 && (
            <div className="md:col-span-2">
              <h4 className="font-extrabold text-ink">Useful phrases from this conversation</h4>
              <ul className="mt-2 space-y-2">
                {review.usefulPhrases.map((phrase) => (
                  <li
                    key={phrase.text}
                    className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2"
                  >
                    <span className="font-display text-xl font-bold text-brand-800">
                      {phrase.text}
                    </span>
                    {phrase.romanization && (
                      <span className="text-slate-500">{phrase.romanization}</span>
                    )}
                    {phrase.meaning && <span className="text-slate-700">— {phrase.meaning}</span>}
                    <PhraseAudio
                      compact
                      source={{ text: phrase.text, language: session.language.code }}
                      label={phrase.text}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.encouragement && (
            <p className="font-bold text-brand-700 md:col-span-2">{review.encouragement}</p>
          )}
          <p className="text-xs text-slate-500 md:col-span-2">
            The review is written by AI from this conversation and Vachan&apos;s notes; the numbers
            above are counted directly.
          </p>
        </div>
      ) : (
        summary.reviewNote && <p className="text-slate-600">{summary.reviewNote}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button onClick={onAgain}>Practise this again</Button>
        <Button variant="secondary" onClick={onChooseAnother}>
          Choose another situation
        </Button>
      </div>
    </section>
  );
}
