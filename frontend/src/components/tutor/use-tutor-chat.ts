"use client";

// State of one tutor chat: messages, sending, errors, retry and opening an old conversation.
// The question is shown straight away; the server's copy replaces it when the answer arrives.
import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { askTutor, getTutorConversation } from "@/lib/api/endpoints";
import type { TutorConversationDto, TutorMessageDto } from "@/lib/api/types";

export type ChatOptions = {
  language?: string;
  lessonId?: string;
  /** Sent with the first question only ("Why is my answer wrong?" for this exercise). */
  exerciseId?: string;
  onConversationChange?: (conversation: TutorConversationDto) => void;
};

export type ChatError = { message: string; code: string; question: string };

/** A temporary copy of the learner's question, shown until the server replies. */
const localMessage = (content: string): TutorMessageDto => ({
  id: `local-${Date.now()}`,
  role: "user",
  content,
  status: null,
  references: [],
  examples: [],
  context: null,
  model: null,
  latencyMs: null,
  createdAt: new Date().toISOString(),
});

/** Hook that holds one tutor conversation and talks to the tutor API. */
export function useTutorChat(options: ChatOptions) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TutorMessageDto[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [exerciseUsed, setExerciseUsed] = useState(false);
  const { language, lessonId, exerciseId, onConversationChange } = options;

  const send = useCallback(
    async (rawQuestion: string) => {
      const question = rawQuestion.trim();
      if (!question || isSending) return;
      setError(null);
      setIsSending(true);
      const pending = localMessage(question);
      setMessages((current) => [...current, pending]);
      try {
        // A new chat sends the language/lesson; later questions only need the conversation id.
        const result = await askTutor({
          question,
          ...(conversationId ? { conversationId } : { language, lessonId }),
          ...(exerciseId && !exerciseUsed ? { exerciseId, lessonId } : {}),
        });
        if (exerciseId) setExerciseUsed(true);
        setConversationId(result.conversation.id);
        setMessages((current) => [
          ...current.filter((message) => message.id !== pending.id),
          ...result.messages,
        ]);
        onConversationChange?.(result.conversation);
      } catch (caught) {
        setMessages((current) => current.filter((message) => message.id !== pending.id));
        const apiError =
          caught instanceof ApiError
            ? caught
            : new ApiError(0, "UNKNOWN_ERROR", "Something went wrong");
        setError({ message: apiError.message, code: apiError.code, question });
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, exerciseId, exerciseUsed, isSending, language, lessonId, onConversationChange],
  );

  const open = useCallback(async (id: string) => {
    setIsLoadingConversation(true);
    setError(null);
    try {
      const { conversation } = await getTutorConversation(id);
      setConversationId(conversation.id);
      setMessages(conversation.messages);
    } catch (caught) {
      setError({
        message: caught instanceof ApiError ? caught.message : "Couldn't open this conversation",
        code: caught instanceof ApiError ? caught.code : "UNKNOWN_ERROR",
        question: "",
      });
    } finally {
      setIsLoadingConversation(false);
    }
  }, []);

  const reset = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setError(null);
  }, []);

  return {
    conversationId,
    messages,
    isSending,
    isLoadingConversation,
    error,
    send,
    open,
    reset,
    dismissError: () => setError(null),
  };
}
