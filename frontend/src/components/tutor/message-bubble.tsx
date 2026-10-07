// One chat message. Tutor answers also show their status, examples and sources.
import { SearchX, ShieldAlert } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import type { TutorMessageDto } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { ReferencesList } from "./references-list";
import { RichText } from "./rich-text";

/** Time of day for a message, e.g. "14:05". */
const time = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** A learner question (right side) or a tutor answer (left side). */
export function MessageBubble({ message }: { message: TutorMessageDto }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-3xl rounded-br-md bg-brand-600 px-4 py-3 text-white shadow-sm">
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
          <p className="mt-1 text-right text-xs text-brand-100">
            <time dateTime={message.createdAt}>{time(message.createdAt)}</time>
          </p>
        </div>
      </div>
    );
  }

  // "insufficient": the notes don't cover the question. "refused": the question was off-topic.
  const insufficient = message.status === "insufficient";
  const refused = message.status === "refused";
  return (
    <div className="flex items-start gap-3">
      <LogoMark className="mt-1 size-9 shrink-0" />
      <div className="max-w-[90%] min-w-0 flex-1">
        <div
          className={cn(
            "rounded-3xl rounded-tl-md border px-4 py-3 text-slate-700 shadow-sm",
            insufficient && "border-marigold-200 bg-marigold-50",
            refused && "border-slate-200 bg-slate-100",
            !insufficient && !refused && "border-slate-200 bg-white",
          )}
        >
          {(insufficient || refused) && (
            <p
              className={cn(
                "mb-2 flex items-center gap-1.5 text-sm font-bold",
                insufficient ? "text-marigold-700" : "text-slate-600",
              )}
            >
              {insufficient ? (
                <SearchX aria-hidden="true" className="size-4" />
              ) : (
                <ShieldAlert aria-hidden="true" className="size-4" />
              )}
              {insufficient ? "Not in my notes" : "I can only help with language learning"}
            </p>
          )}
          <RichText text={message.content} />

          {message.examples.length > 0 && (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2" aria-label="Examples">
              {message.examples.map((example) => (
                <li key={example.native} className="rounded-2xl bg-brand-50 px-3 py-2">
                  <p className="font-display text-xl font-bold text-brand-800">{example.native}</p>
                  {example.romanization && (
                    <p className="text-sm text-brand-700">{example.romanization}</p>
                  )}
                  {example.meaning && <p className="text-sm text-slate-600">{example.meaning}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ReferencesList references={message.references} answered={message.status === "answered"} />
        <p className="mt-1 text-xs text-slate-400">
          <time dateTime={message.createdAt}>{time(message.createdAt)}</time>
          {message.context?.level && ` · ${message.context.level} level`}
          {message.status === "answered" && " · based on Vachan's notes"}
        </p>
      </div>
    </div>
  );
}

/** Animated dots shown while the tutor is answering. */
export function TypingBubble() {
  return (
    <div className="flex items-start gap-3" role="status" aria-live="polite">
      <LogoMark className="mt-1 size-9 shrink-0" />
      <div className="rounded-3xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="flex gap-1" aria-hidden="true">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="size-2 animate-bounce rounded-full bg-brand-400"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
          <span className="text-sm">Looking in Vachan&apos;s notes…</span>
        </div>
      </div>
    </div>
  );
}
