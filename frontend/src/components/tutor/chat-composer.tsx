"use client";

// The question box: Enter sends, Shift+Enter adds a line, 500 characters max.
import { SendHorizontal } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

const MAX = 500;

export function ChatComposer({
  onSend,
  disabled,
  placeholder,
  initialValue = "",
}: {
  onSend: (question: string) => void;
  disabled: boolean;
  placeholder: string;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const canSend = value.trim().length >= 2 && !disabled;

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <label className="sr-only" htmlFor="tutor-question">
        Your question
      </label>
      <div className="relative flex-1">
        <textarea
          id="tutor-question"
          value={value}
          onChange={(event) => setValue(event.target.value.slice(0, MAX))}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={placeholder}
          disabled={disabled}
          className="block [field-sizing:content] max-h-40 min-h-12 w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 pr-14 text-base text-ink outline-none focus:border-brand-400 disabled:bg-slate-50"
        />
        <span
          className={cn(
            "pointer-events-none absolute right-3 bottom-2 text-xs",
            value.length > MAX - 50 ? "text-rose-600" : "text-slate-400",
          )}
        >
          {value.length}/{MAX}
        </span>
      </div>
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send question"
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:bg-brand-200 disabled:shadow-none"
      >
        <SendHorizontal aria-hidden="true" className="size-5" />
      </button>
    </form>
  );
}
