"use client";

// The chat itself: messages, typing indicator, error with retry, suggestions and the question box.
// Used on the /tutor page and in the lesson's "Ask the tutor" panel.
import { RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChatComposer } from "./chat-composer";
import { MessageBubble, TypingBubble } from "./message-bubble";
import { SuggestedQuestions } from "./suggested-questions";
import type { useTutorChat } from "./use-tutor-chat";

type Chat = ReturnType<typeof useTutorChat>;

export function TutorChat({
  chat,
  languageName,
  suggestions,
  emptyState,
  className,
}: {
  chat: Chat;
  languageName: string;
  suggestions: string[];
  emptyState?: React.ReactNode;
  className?: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.messages.length, chat.isSending, chat.error]);

  const isEmpty = chat.messages.length === 0 && !chat.isSending;

  return (
    <div className={className ?? "flex min-h-0 flex-1 flex-col"}>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-1 py-2" aria-live="polite">
        {chat.isLoadingConversation && (
          <p className="py-8 text-center text-slate-500">Opening conversation…</p>
        )}
        {isEmpty && !chat.isLoadingConversation && emptyState}
        {chat.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {chat.isSending && <TypingBubble />}
        {chat.error && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800"
          >
            <p className="flex items-center gap-2 font-bold">
              <TriangleAlert aria-hidden="true" className="size-5" />
              {chat.error.message}
            </p>
            {chat.error.question && chat.error.code !== "RATE_LIMITED" && (
              <Button
                size="sm"
                variant="secondary"
                className="mt-3"
                onClick={() => void chat.send(chat.error!.question)}
              >
                <RotateCcw aria-hidden="true" className="size-4" /> Try again
              </Button>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-3">
        {chat.messages.length < 2 && (
          <SuggestedQuestions
            questions={suggestions}
            onPick={(q) => void chat.send(q)}
            disabled={chat.isSending}
          />
        )}
        <ChatComposer
          onSend={(q) => void chat.send(q)}
          disabled={chat.isSending}
          placeholder={`Ask about ${languageName} words, grammar or pronunciation…`}
        />
        <p className="text-xs text-slate-400">
          Answers come only from Vachan&apos;s notes — if they don&apos;t cover something, the tutor
          says so.
        </p>
      </div>
    </div>
  );
}
