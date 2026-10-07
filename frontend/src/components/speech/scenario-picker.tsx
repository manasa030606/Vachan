"use client";

// Scenario selection for role-play practice, plus a list of recent sessions.
import {
  Bus,
  Handshake,
  History,
  Loader2,
  MessagesSquare,
  ShoppingBag,
  Signpost,
  Trash2,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConversationSessionDto, ScenarioId, ScenarioListDto } from "@/lib/api/types";

export const SCENARIO_ICONS: Record<ScenarioId, LucideIcon> = {
  introductions: Handshake,
  restaurant: UtensilsCrossed,
  shopping: ShoppingBag,
  travel: Bus,
  directions: Signpost,
  everyday: MessagesSquare,
};

// Display names for the partner's language level.
const LEVEL = { beginner: "Beginner", elementary: "Elementary", intermediate: "Intermediate" };

type Props = {
  data: ScenarioListDto;
  sessions: ConversationSessionDto[];
  starting: ScenarioId | null;
  onStart: (scenario: ScenarioId) => void;
  onOpen: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
};

/** Grid of role-play scenarios to start, and recent role-plays to reopen or delete. */
export function ScenarioPicker({ data, sessions, starting, onStart, onOpen, onDelete }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        Pick a situation. Your partner speaks {data.language.name} at{" "}
        <strong>{LEVEL[data.level]}</strong> level and uses words from your course. Reply by typing
        or with the microphone — about {data.maxLearnerTurns} replies, then you get a summary.
      </p>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.scenarios.map((scenario) => {
          const Icon = SCENARIO_ICONS[scenario.id];
          return (
            <li
              key={scenario.id}
              className="flex flex-col rounded-card border-2 border-slate-200 bg-white p-4 transition hover:border-brand-200"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="text-lg font-extrabold text-ink">{scenario.title}</h3>
              </div>
              <p className="mt-2 text-sm text-slate-600">{scenario.description}</p>
              <p className="mt-2 text-sm">
                <span className="font-bold text-ink">Goal:</span>{" "}
                <span className="text-slate-600">{scenario.goal}</span>
              </p>
              {scenario.keyWords.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Useful words">
                  {scenario.keyWords.map((word) => (
                    <li
                      key={word.script}
                      title={`${word.romanization} — ${word.meaning}`}
                      className="rounded-full bg-slate-100 px-2 py-0.5 font-display text-sm text-slate-700"
                    >
                      {word.script}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto pt-3">
                <Button
                  fullWidth
                  disabled={!data.status.available || starting !== null}
                  onClick={() => onStart(scenario.id)}
                >
                  {starting === scenario.id ? (
                    <>
                      <Loader2 aria-hidden="true" className="size-4 animate-spin" /> Starting…
                    </>
                  ) : (
                    "Start"
                  )}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      {sessions.length > 0 && (
        <section aria-labelledby="recent-roleplays">
          <h3
            id="recent-roleplays"
            className="mb-2 flex items-center gap-2 font-extrabold text-ink"
          >
            <History aria-hidden="true" className="size-5" /> Recent role-plays
          </h3>
          <ul className="divide-y divide-slate-100 rounded-card border border-slate-200 bg-white">
            {sessions.slice(0, 8).map((session) => (
              <li key={session.id} className="flex items-center gap-2 px-4 py-2">
                <button
                  type="button"
                  onClick={() => onOpen(session.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="font-bold text-ink">{session.scenarioTitle}</span>{" "}
                  <span className="text-sm text-slate-500">
                    · {new Date(session.startedAt).toLocaleDateString()} · {session.learnerTurns}{" "}
                    {session.learnerTurns === 1 ? "reply" : "replies"} ·{" "}
                    {session.status === "ended" ? "finished" : "in progress — continue"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(session.id)}
                  aria-label={`Delete ${session.scenarioTitle} role-play`}
                  className="rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
