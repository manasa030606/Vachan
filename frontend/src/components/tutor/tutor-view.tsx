"use client";

// /tutor — the AI tutor page: learner context, earlier chats, and the chat.
// Optional URL parameters: ?lessonId=te-u1-l1 (lesson context) · ?q=… (ask this straight away)
import { GraduationCap, History, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import {
  deleteTutorConversation,
  getTutorContext,
  getTutorConversations,
} from "@/lib/api/endpoints";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { ConversationList } from "./conversation-list";
import { TutorChat } from "./tutor-chat";
import { useTutorChat } from "./use-tutor-chat";

const LEVEL_LABEL = {
  beginner: "Beginner",
  elementary: "Elementary",
  intermediate: "Intermediate",
} as const;

export function TutorView() {
  const params = useSearchParams();
  const lessonId = params.get("lessonId") ?? undefined;
  const initialQuestion = params.get("q");
  const { languageCode } = useLearnerPreferences();
  const [showHistory, setShowHistory] = useState(false);

  const context = useApi(
    () => getTutorContext({ language: languageCode, lessonId }),
    `tutor-context:${languageCode}:${lessonId ?? ""}`,
  );
  const history = useApi(
    async () => (await getTutorConversations(languageCode)).conversations,
    `tutor-history:${languageCode}`,
  );
  const reloadHistory = history.reload;

  const chat = useTutorChat({
    language: languageCode,
    lessonId,
    onConversationChange: useCallback(() => reloadHistory(), [reloadHistory]),
  });
  const { reset } = chat;

  // A new language = a new chat.
  useEffect(() => reset(), [languageCode, reset]);

  // ?q=… asks once, as soon as the tutor is ready.
  const askedInitial = useRef(false);
  useEffect(() => {
    if (initialQuestion && context.data?.status.available && !askedInitial.current) {
      askedInitial.current = true;
      void chat.send(initialQuestion);
    }
  }, [initialQuestion, context.data, chat]);

  const info = context.data;
  const languageName = info?.context.language.name ?? "your language";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Ask the tutor</h1>
          <p className="mt-1 text-slate-600">
            Questions about {languageName} words, grammar, sentences and pronunciation.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="lg:hidden"
          onClick={() => setShowHistory((v) => !v)}
          aria-expanded={showHistory}
        >
          <History aria-hidden="true" className="size-4" /> Chats
        </Button>
      </div>

      {info && (
        <div className="flex flex-wrap items-center gap-2 text-sm" aria-label="Tutor context">
          <span className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-700">
            {info.context.language.name}
          </span>
          <span
            className="flex items-center gap-1 rounded-full bg-marigold-50 px-3 py-1 font-bold text-marigold-700"
            title={`Level from: ${info.context.levelSource}`}
          >
            <GraduationCap aria-hidden="true" className="size-4" />{" "}
            {LEVEL_LABEL[info.context.level]}
          </span>
          {info.context.unit && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              {info.context.unit}
            </span>
          )}
          {info.context.lesson && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              Lesson: {info.context.lesson.title}
            </span>
          )}
        </div>
      )}

      {context.error && (
        <Card role="alert" className="text-center">
          <p className="font-bold text-rose-700">{context.error.message}</p>
          <Button variant="secondary" className="mt-4" onClick={context.reload}>
            Try again
          </Button>
        </Card>
      )}

      {info && !info.status.available && (
        <Card role="alert" className="flex gap-3 border-marigold-200 bg-marigold-50">
          <Info aria-hidden="true" className="size-6 shrink-0 text-marigold-700" />
          <div>
            <p className="font-bold text-ink">The tutor isn&apos;t available on this server yet.</p>
            <p className="mt-1 text-sm text-slate-600">{info.status.reason}</p>
          </div>
        </Card>
      )}

      {info?.status.isTestDouble && (
        <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
          Test mode: answers come from an offline stand-in (LLM_PROVIDER=mock), not a real AI.
        </p>
      )}

      {info?.status.available && (
        <div className="grid gap-4 lg:grid-cols-[15rem_1fr]">
          <aside className={showHistory ? "block" : "hidden lg:block"}>
            <ConversationList
              conversations={history.data ?? []}
              activeId={chat.conversationId}
              onOpen={(id) => {
                void chat.open(id);
                setShowHistory(false);
              }}
              onNew={() => {
                chat.reset();
                setShowHistory(false);
              }}
              onDelete={async (id) => {
                await deleteTutorConversation(id).catch(() => undefined);
                if (id === chat.conversationId) chat.reset();
                history.reload();
              }}
            />
          </aside>

          <Card className="flex h-[calc(100dvh-17rem)] min-h-[28rem] flex-col p-3 sm:p-4">
            <TutorChat
              chat={chat}
              languageName={languageName}
              suggestions={info.suggestions}
              emptyState={
                <div className="flex flex-col items-center px-4 py-10 text-center">
                  <LogoMark className="size-14" />
                  <p className="mt-3 text-lg font-bold text-ink">
                    Namaste! Ask me anything about {languageName}.
                  </p>
                  <p className="mt-1 max-w-md text-sm text-slate-500">
                    I explain at your level and only use Vachan&apos;s notes — you can open the
                    sources under every answer.
                  </p>
                </div>
              }
            />
          </Card>
        </div>
      )}

      {context.isLoading && (
        <div className="flex justify-center py-16" aria-busy="true">
          <LogoMark className="size-12 animate-pulse" />
          <span className="sr-only">Loading the tutor…</span>
        </div>
      )}
    </div>
  );
}
