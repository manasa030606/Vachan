"use client";

// LISTENING COMPREHENSION: hear a word/phrase (play, replay, slower), choose its meaning or how
// it is written. The answer is checked by the server, then shown with its script and romanization.
import { ArrowRight, CheckCircle2, Headphones, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api/client";
import { checkListeningAnswer, getListeningRound } from "@/lib/api/endpoints";
import type { ListeningAnswerDto } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { PhraseAudio } from "./phrase-audio";

export function ListeningPractice({ language }: { language: string }) {
  const [round, setRound] = useState(0);
  const data = useApi(() => getListeningRound(language), `listening:${language}:${round}`);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [answer, setAnswer] = useState<ListeningAnswerDto | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const questions = data.data?.questions ?? [];
  const question = questions[index];
  const finished = questions.length > 0 && index >= questions.length;

  const restart = () => {
    setRound((r) => r + 1);
    setIndex(0);
    setChoice(null);
    setAnswer(null);
    setCorrectCount(0);
  };

  const check = async () => {
    if (!question || !choice) return;
    setChecking(true);
    setError(null);
    try {
      const result = await checkListeningAnswer(question.token, choice);
      setAnswer(result);
      if (result.correct) setCorrectCount((c) => c + 1);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Couldn't check the answer.");
    } finally {
      setChecking(false);
    }
  };

  const next = () => {
    setIndex((i) => i + 1);
    setChoice(null);
    setAnswer(null);
  };

  if (data.isLoading) {
    return (
      <p className="py-10 text-center text-slate-500" aria-busy="true">
        Preparing a listening round…
      </p>
    );
  }
  if (data.error) {
    return (
      <Card role="alert" className="text-center">
        <p className="font-bold text-rose-700">{data.error.message}</p>
        <Button variant="secondary" className="mt-3" onClick={data.reload}>
          Try again
        </Button>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card className="space-y-3 text-center">
        <Headphones aria-hidden="true" className="mx-auto size-10 text-brand-600" />
        <p className="text-2xl font-extrabold text-ink">
          {correctCount} of {questions.length} correct
        </p>
        <p className="text-slate-600">
          {correctCount === questions.length
            ? "Excellent listening!"
            : "Replay the ones you missed at 0.75× — slow listening trains your ear."}
        </p>
        <Button onClick={restart}>
          <RotateCcw aria-hidden="true" className="size-4" /> New round
        </Button>
      </Card>
    );
  }
  if (!question) return null;

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between text-sm font-bold text-slate-500">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>{correctCount} correct</span>
      </div>
      <div className="text-center">
        <p className="text-xl font-extrabold text-ink">{question.instruction}</p>
        <PhraseAudio
          key={question.token}
          className="mt-3 flex flex-col items-center"
          source={{ question: question.token }}
          label={`question ${index + 1}`}
        />
      </div>

      <div role="radiogroup" aria-label="Answers" className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => {
          const isChosen = choice === option.id;
          const isRight = answer?.correctChoiceId === option.id;
          const isWrongChoice = answer && isChosen && !isRight;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isChosen}
              disabled={Boolean(answer)}
              onClick={() => setChoice(option.id)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left font-bold transition",
                question.type === "script" ? "font-display text-2xl" : "text-lg",
                answer
                  ? isRight
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : isWrongChoice
                      ? "border-rose-300 bg-rose-50 text-rose-800"
                      : "border-slate-200 text-slate-400"
                  : isChosen
                    ? "border-brand-500 bg-brand-50 text-brand-800"
                    : "border-slate-200 bg-white text-ink hover:border-brand-200",
              )}
            >
              {option.label}
              {answer && isRight && (
                <CheckCircle2 aria-label="correct answer" className="size-5 shrink-0" />
              )}
              {isWrongChoice && <XCircle aria-label="your answer" className="size-5 shrink-0" />}
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="font-bold text-rose-700">
          {error}
        </p>
      )}

      {answer ? (
        <div
          role="status"
          className={cn(
            "rounded-2xl px-4 py-3",
            answer.correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800",
          )}
        >
          <p className="font-extrabold">{answer.correct ? "Correct!" : "Not quite."}</p>
          <p className="mt-1">
            You heard <span className="font-display text-xl font-bold">{answer.answer.script}</span>{" "}
            ({answer.answer.romanization}) — “{answer.answer.meaning}”.
          </p>
          <div className="mt-3 flex justify-end">
            <Button onClick={next}>
              {index + 1 < questions.length ? "Next" : "See result"}{" "}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button onClick={() => void check()} disabled={!choice || checking}>
            {checking ? "Checking…" : "Check"}
          </Button>
        </div>
      )}
    </Card>
  );
}
