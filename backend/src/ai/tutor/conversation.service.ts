// Tutor chat history (stored per learner; nobody else can read it).
import { notFound } from "../../lib/http-error.ts";
import { prisma } from "../../lib/prisma.ts";
import { toConversationDto, toMessageDto } from "./tutor.service.ts";

export async function listConversations(userId: string, language?: string) {
  const rows = await prisma.aIConversation.findMany({
    where: { userId, ...(language ? { languageCode: language } : {}) },
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: { _count: { select: { messages: true } } },
  });
  return rows.map((row) => ({ ...toConversationDto(row), messageCount: row._count.messages }));
}

export async function getConversation(userId: string, conversationId: string) {
  const conversation = await prisma.aIConversation.findFirst({
    where: { id: conversationId, userId }, // another learner's id → 404, not 403 (don't reveal it exists)
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!conversation) throw notFound("CONVERSATION_NOT_FOUND", "Conversation not found");
  return {
    ...toConversationDto(conversation),
    messages: conversation.messages.map(toMessageDto),
  };
}

export async function deleteConversation(userId: string, conversationId: string) {
  const { count } = await prisma.aIConversation.deleteMany({
    where: { id: conversationId, userId },
  });
  if (count === 0) throw notFound("CONVERSATION_NOT_FOUND", "Conversation not found");
}
