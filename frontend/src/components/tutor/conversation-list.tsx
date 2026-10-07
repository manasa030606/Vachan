"use client";

// Earlier tutor chats for the current language (GET /api/ai/conversations).
import { MessagesSquare, Plus, Trash2 } from "lucide-react";
import type { TutorConversationDto } from "@/lib/api/types";
import { cn } from "@/lib/cn";

/** Sidebar list of earlier chats with "New chat" and delete buttons. */
export function ConversationList({
  conversations,
  activeId,
  onOpen,
  onNew,
  onDelete,
}: {
  conversations: TutorConversationDto[];
  activeId: string | null;
  onOpen: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <nav aria-label="Tutor conversations" className="space-y-2">
      <button
        type="button"
        onClick={onNew}
        className="flex w-full items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 px-3 py-2.5 font-bold text-brand-700 transition hover:bg-brand-50"
      >
        <Plus aria-hidden="true" className="size-5" /> New chat
      </button>
      {conversations.length === 0 && (
        <p className="px-1 text-sm text-slate-500">No earlier chats yet.</p>
      )}
      <ul className="space-y-1">
        {conversations.map((conversation) => (
          <li key={conversation.id} className="group flex items-center gap-1">
            <button
              type="button"
              onClick={() => onOpen(conversation.id)}
              aria-current={conversation.id === activeId ? "true" : undefined}
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-100",
                conversation.id === activeId && "bg-brand-50 font-bold text-brand-800",
              )}
            >
              <MessagesSquare aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">{conversation.title}</span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(conversation.id)}
              aria-label={`Delete "${conversation.title}"`}
              className="rounded-lg p-2 text-slate-400 opacity-60 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
