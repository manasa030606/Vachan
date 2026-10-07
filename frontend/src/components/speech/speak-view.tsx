"use client";

// /speak — Phase 7: Listen (listening comprehension), Speak (speaking exercise) and
// Conversation (role-play) for the learner's current language. ?tab=listen|speak|conversation
import { Headphones, Info, MessagesSquare, Mic } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { getSpeechStatus } from "@/lib/api/endpoints";
import { cn } from "@/lib/cn";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { ConversationPractice } from "./conversation-practice";
import { ListeningPractice } from "./listening-practice";
import { SpeakingPractice } from "./speaking-practice";

const TABS = [
  {
    id: "listen",
    label: "Listen",
    icon: Headphones,
    hint: "Hear words and phrases, then choose what you heard.",
  },
  {
    id: "speak",
    label: "Speak",
    icon: Mic,
    hint: "Say a phrase and get feedback on what was recognised.",
  },
  {
    id: "conversation",
    label: "Conversation",
    icon: MessagesSquare,
    hint: "Role-play real situations with an AI partner.",
  },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function SpeakView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { languageCode, showRomanization } = useLearnerPreferences();
  const requested = params.get("tab");
  const tab: TabId = TABS.some((t) => t.id === requested) ? (requested as TabId) : "listen";
  const status = useApi(async () => (await getSpeechStatus()).status, "speech-status");

  const select = (id: TabId) => router.replace(`${pathname}?tab=${id}`, { scroll: false });
  const info = status.data;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold text-ink">Listen &amp; speak</h1>
        <p className="mt-1 text-slate-600">{TABS.find((t) => t.id === tab)?.hint}</p>
      </div>

      <div
        role="tablist"
        aria-label="Practice type"
        className="flex gap-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => select(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 font-extrabold transition",
              tab === id ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-brand-50",
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
            {label}
          </button>
        ))}
      </div>

      {status.error && (
        <Card role="alert" className="text-center">
          <p className="font-bold text-rose-700">{status.error.message}</p>
          <Button variant="secondary" className="mt-3" onClick={status.reload}>
            Try again
          </Button>
        </Card>
      )}

      {info && (info.speechToText.isTestDouble || info.textToSpeech.isTestDouble) && (
        <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
          Test mode: audio is beeps and speech-to-text returns a fixed text (mock providers), not
          real speech processing.
        </p>
      )}
      {info && !info.speechToText.available && tab !== "listen" && (
        <Card role="alert" className="flex gap-3 border-marigold-200 bg-marigold-50">
          <Info aria-hidden="true" className="size-6 shrink-0 text-marigold-700" />
          <p className="text-sm text-slate-700">
            Speech-to-text isn&apos;t set up on this server yet (missing API key — see
            docs/SPEECH.md). You can still type in conversations.
          </p>
        </Card>
      )}
      {info && !info.textToSpeech.serverAudio && (
        <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
          Audio comes from your browser&apos;s voice on this server (if your device has one for this
          language).
        </p>
      )}

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "listen" && <ListeningPractice key={languageCode} language={languageCode} />}
        {tab === "speak" && info && (
          <SpeakingPractice key={languageCode} language={languageCode} status={info} />
        )}
        {tab === "conversation" && (
          <ConversationPractice
            key={languageCode}
            language={languageCode}
            showRomanization={showRomanization}
          />
        )}
        {tab === "speak" && status.isLoading && (
          <p className="py-10 text-center text-slate-500" aria-busy="true">
            Loading…
          </p>
        )}
      </div>
    </div>
  );
}
