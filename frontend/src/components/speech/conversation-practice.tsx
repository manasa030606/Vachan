"use client";

// Conversation tab: scenario selection ↔ one role-play (start → reply → … → end → summary).
import { Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api/client";
import {
  deleteConversationSession,
  getConversationSession,
  getConversationSessions,
  getScenarios,
  startConversation,
} from "@/lib/api/endpoints";
import type { ConversationDto, ScenarioId } from "@/lib/api/types";
import { ConversationView } from "./conversation-view";
import { ScenarioPicker } from "./scenario-picker";

export function ConversationPractice({
  language,
  showRomanization,
}: {
  language: string;
  showRomanization: boolean;
}) {
  const scenarios = useApi(() => getScenarios(language), `scenarios:${language}`);
  const sessions = useApi(
    async () => (await getConversationSessions(language)).sessions,
    `roleplays:${language}`,
  );
  const [conversation, setConversation] = useState<ConversationDto | null>(null);
  const [starting, setStarting] = useState<ScenarioId | null>(null);
  const [error, setError] = useState<{ message: string; retry?: () => void } | null>(null);

  const start = async (scenario: ScenarioId) => {
    setStarting(scenario);
    setError(null);
    try {
      setConversation(await startConversation({ scenario, language }));
      sessions.reload();
    } catch (cause) {
      setError({
        message: cause instanceof ApiError ? cause.message : "Couldn't start the role-play.",
        retry: () => void start(scenario),
      });
      setConversation(null);
    } finally {
      setStarting(null);
    }
  };

  const open = async (id: string) => {
    setError(null);
    try {
      setConversation(await getConversationSession(id));
    } catch (cause) {
      setError({ message: cause instanceof ApiError ? cause.message : "Couldn't open it." });
    }
  };

  if (scenarios.isLoading) {
    return (
      <p className="py-10 text-center text-slate-500" aria-busy="true">
        Loading situations…
      </p>
    );
  }
  if (scenarios.error || !scenarios.data) {
    return (
      <Card role="alert" className="text-center">
        <p className="font-bold text-rose-700">{scenarios.error?.message ?? "Couldn't load."}</p>
        <Button variant="secondary" className="mt-3" onClick={scenarios.reload}>
          Try again
        </Button>
      </Card>
    );
  }

  const status = scenarios.data.status;
  return (
    <div className="space-y-4">
      {!status.available && (
        <Card role="alert" className="flex gap-3 border-marigold-200 bg-marigold-50">
          <Info aria-hidden="true" className="size-6 shrink-0 text-marigold-700" />
          <p className="text-sm text-slate-700">{status.reason}</p>
        </Card>
      )}
      {status.available && !status.notesAvailable && (
        <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
          Knowledge-base notes are off on this server, so your partner uses only your course words.
        </p>
      )}
      {status.isTestDouble && (
        <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
          Test mode: the partner is an offline stand-in (LLM_PROVIDER=mock), not a real AI.
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3"
        >
          <p className="font-bold text-rose-700">{error.message}</p>
          {error.retry && (
            <Button size="sm" variant="secondary" onClick={error.retry}>
              Retry
            </Button>
          )}
        </div>
      )}

      {conversation ? (
        <ConversationView
          conversation={conversation}
          showRomanization={showRomanization}
          onChange={(next) => {
            setConversation(next);
            if (next.session.status === "ended") sessions.reload();
          }}
          onExit={() => {
            setConversation(null);
            sessions.reload();
          }}
          onRestart={(scenario) => void start(scenario)}
        />
      ) : (
        <ScenarioPicker
          data={scenarios.data}
          sessions={sessions.data ?? []}
          starting={starting}
          onStart={(scenario) => void start(scenario)}
          onOpen={(id) => void open(id)}
          onDelete={async (id) => {
            await deleteConversationSession(id).catch(() => undefined);
            sessions.reload();
          }}
        />
      )}
    </div>
  );
}
