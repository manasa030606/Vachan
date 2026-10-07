// ROLE-PLAY CONVERSATION (Phase 7):
//
//   start:  scenario + learner (language, level) ─► course vocabulary for the scenario
//           ─► RAG notes for the scenario ─► prompt ─► LLM ─► partner's first line
//   reply:  learner line (typed, or spoken → transcript) ─► safety check ─► RAG notes for the
//           scenario + the line ─► prompt with the conversation so far ─► LLM ─► checks
//           ─► partner's answer + feedback on the learner's line + reply suggestions
//   end:    statistics (counted, no AI) + AI review (grounded in the conversation and notes)
//
// Each line is saved (ConversationSession / ConversationTurn) with the notes it was based on.
import {
  CONVERSATION_CONFIG,
  SCENARIOS,
  type Scenario,
  type ScenarioId,
} from "../../config/conversation.ts";
import { ragEnabled } from "../../config/env.ts";
import type { ConversationScenario, Prisma } from "../../generated/prisma/client.ts";
import { HttpError, notFound } from "../../lib/http-error.ts";
import { prisma } from "../../lib/prisma.ts";
import { RAG_CONFIG, type KnowledgeLevelName } from "../../rag/config.ts";
import { searchKnowledge } from "../../rag/retrieval.service.ts";
import type { LanguageCode } from "../../rag/types.ts";
import { resolveLearnerContext, type LearnerSpeechContext } from "../../speech/learner-context.ts";
import { normalizeText } from "../../speech/text-compare.ts";
import { llmErrorToHttp } from "../llm/http-errors.ts";
import { getLlmProvider, getLlmStatus } from "../llm/index.ts";
import { LlmError, type LlmProvider } from "../llm/types.ts";
import { detectInjection, sanitizeQuestion } from "../tutor/safety.ts";
import {
  buildPartnerSystemPrompt,
  buildPartnerUserPrompt,
  buildSummarySystemPrompt,
  buildSummaryUserPrompt,
  type HistoryLine,
  type NoteChunk,
  type VocabularyLine,
} from "./prompt.ts";
import {
  parsePartnerReply,
  parseSummary,
  UnreadableReplyError,
  wordCoverage,
  type PartnerReply,
  type SessionSummaryAi,
} from "./reply-parser.ts";

const toHttp = (error: unknown) =>
  error instanceof LlmError
    ? llmErrorToHttp(error, "conversation", "CONVERSATION_NOT_CONFIGURED")
    : error;

const toEnum = (id: ScenarioId) => id.toUpperCase() as ConversationScenario;
const toScenarioId = (value: ConversationScenario) => value.toLowerCase() as ScenarioId;
const toLevelEnum = (level: KnowledgeLevelName) =>
  level.toUpperCase() as "BEGINNER" | "ELEMENTARY" | "INTERMEDIATE";

// ── Availability & scenarios ────────────────────────────────────

export function getConversationAvailability() {
  const llm = getLlmStatus();
  return {
    available: llm.configured,
    reason: llm.configured
      ? null
      : `Conversation practice needs ${llm.keyVariable} in backend/.env (see docs/SPEECH.md).`,
    /** false on servers with RAG off: the partner then uses only the course vocabulary */
    notesAvailable: ragEnabled,
    provider: llm.provider,
    model: llm.model,
    isTestDouble: llm.isTestDouble,
  };
}

async function loadVocabulary(languageCode: string, scenario: Scenario): Promise<VocabularyLine[]> {
  const items = await prisma.vocabularyItem.findMany({
    where: {
      language: { code: languageCode },
      kind: { in: ["WORD", "PHRASE"] },
      topic: { in: scenario.vocabularyTopics },
    },
    select: { id: true, script: true, romanization: true, meaning: true },
  });
  return items
    .sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }))
    .slice(0, CONVERSATION_CONFIG.vocabularyItems)
    .map(({ script, romanization, meaning }) => ({ script, romanization, meaning }));
}

export async function listScenarios(userId: string, language?: LanguageCode) {
  const context = await resolveLearnerContext(userId, { language });
  const scenarios = await Promise.all(
    Object.values(SCENARIOS).map(async (scenario) => ({
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      partnerRole: scenario.partnerRole,
      goal: scenario.goal,
      keyWords: (await loadVocabulary(context.languageCode, scenario)).slice(0, 5),
    })),
  );
  return {
    language: { code: context.languageCode, name: context.languageName },
    level: context.level,
    levelSource: context.levelSource,
    maxLearnerTurns: CONVERSATION_CONFIG.maxLearnerTurns,
    scenarios,
    status: getConversationAvailability(),
  };
}

// ── RAG notes ───────────────────────────────────────────────────

type Notes = {
  chunks: NoteChunk[];
  references: Array<{
    n: number;
    id: string;
    heading: string;
    reference: string;
    similarity: number;
  }>;
  info: { ragUsed: boolean; retrievalQuery: string | null; bestSimilarity: number | null };
};

async function retrieveNotes(
  context: LearnerSpeechContext,
  scenario: Scenario,
  learnerText: string | null,
): Promise<Notes> {
  if (!ragEnabled) {
    return {
      chunks: [],
      references: [],
      info: { ragUsed: false, retrievalQuery: null, bestSimilarity: null },
    };
  }
  const query = learnerText
    ? `${scenario.retrievalQuery}. ${learnerText}`
    : scenario.retrievalQuery;
  try {
    const result = await searchKnowledge({
      query,
      language: context.languageCode,
      level: context.level,
      topic: scenario.topic,
      limit: CONVERSATION_CONFIG.contextChunks,
    });
    // Only notes that are really about the situation (same threshold as the tutor).
    const relevant = result.results.filter(
      (r) => r.relevance.similarity >= RAG_CONFIG.retrieval.minSimilarity,
    );
    return {
      chunks: relevant.map((r, i) => ({ n: i + 1, heading: r.heading, content: r.content })),
      references: relevant.map((r, i) => ({
        n: i + 1,
        id: r.id,
        heading: r.heading,
        reference: r.reference,
        similarity: r.relevance.similarity,
      })),
      info: {
        ragUsed: true,
        retrievalQuery: query,
        bestSimilarity: result.retrieval.bestSimilarity,
      },
    };
  } catch (error) {
    // Search problems (model not loaded, index empty) must not break the conversation:
    // the partner continues with the course vocabulary only.
    console.warn(`[conversation] notes unavailable: ${(error as Error).message}`);
    return {
      chunks: [],
      references: [],
      info: { ragUsed: false, retrievalQuery: query, bestSimilarity: null },
    };
  }
}

// ── LLM call with checks ────────────────────────────────────────

function provider(): LlmProvider {
  try {
    return getLlmProvider();
  } catch (error) {
    throw toHttp(error);
  }
}

async function askPartner(input: {
  llm: LlmProvider;
  system: string;
  user: string;
  noteCount: number;
  expectFeedback: boolean;
}): Promise<{ parsed: PartnerReply; model: string }> {
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await input.llm.generate({
        system: input.system,
        turns: [{ role: "user", text: input.user }],
        json: true,
        temperature: CONVERSATION_CONFIG.temperature,
        maxOutputTokens: CONVERSATION_CONFIG.maxOutputTokens,
        purpose: "conversation",
      });
      return {
        parsed: parsePartnerReply(result.text, input.noteCount, {
          expectFeedback: input.expectFeedback,
        }),
        model: result.model,
      };
    } catch (error) {
      if (error instanceof LlmError) throw toHttp(error);
      if (!(error instanceof UnreadableReplyError)) throw error;
      console.warn(`[conversation] unreadable reply (attempt ${attempt}): ${error.message}`);
      lastError = error;
    }
  }
  throw new HttpError(
    502,
    "AI_REPLY_UNREADABLE",
    "The conversation partner gave an unusable answer. Please try again.",
    { reason: (lastError as Error)?.message },
  );
}

// ── DTOs ────────────────────────────────────────────────────────

type SessionRow = Prisma.ConversationSessionGetPayload<{ include: { language: true } }>;
type TurnRow = Prisma.ConversationTurnGetPayload<object>;

export function toSessionDto(session: SessionRow) {
  const scenario = SCENARIOS[toScenarioId(session.scenario)];
  return {
    id: session.id,
    scenario: scenario.id,
    scenarioTitle: scenario.title,
    partnerRole: scenario.partnerRole,
    goal: scenario.goal,
    language: { code: session.language.code, name: session.language.name },
    level: session.level.toLowerCase() as KnowledgeLevelName,
    status: session.status === "ENDED" ? ("ended" as const) : ("active" as const),
    learnerTurns: session.learnerTurns,
    maxLearnerTurns: CONVERSATION_CONFIG.maxLearnerTurns,
    summary: session.summary ?? null,
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? null,
  };
}

export function toTurnDto(turn: TurnRow) {
  return {
    id: turn.id,
    speaker: turn.role === "ASSISTANT" ? ("partner" as const) : ("learner" as const),
    text: turn.text,
    romanization: turn.romanization,
    translation: turn.translation,
    inputMode: turn.inputMode ? (turn.inputMode.toLowerCase() as "text" | "voice") : null,
    feedback: turn.feedback ?? null,
    suggestions: turn.suggestions ?? [],
    references: turn.references ?? [],
    status: turn.status ? turn.status.toLowerCase() : null,
    createdAt: turn.createdAt.toISOString(),
  };
}

async function loadSession(userId: string, sessionId: string) {
  const session = await prisma.conversationSession.findFirst({
    where: { id: sessionId, userId },
    include: { language: true, turns: { orderBy: { createdAt: "asc" } } },
  });
  if (!session) throw notFound("CONVERSATION_NOT_FOUND", "Conversation not found");
  return session;
}

const historyOf = (turns: TurnRow[]): HistoryLine[] =>
  turns
    .slice(-CONVERSATION_CONFIG.historyTurns)
    .map((t) => ({ speaker: t.role === "ASSISTANT" ? "partner" : "learner", text: t.text }));

const partnerContext = (
  context: LearnerSpeechContext,
  notes: Notes,
  parsed: PartnerReply,
  grounding: string,
) => ({
  level: context.level,
  levelSource: context.levelSource,
  ...notes.info,
  wordCoverage: wordCoverage(parsed.reply.text, grounding),
  goalReached: parsed.goalReached,
  issues: parsed.issues,
});

const groundingText = (
  vocabulary: VocabularyLine[],
  notes: Notes,
  turns: Array<{ text: string }>,
) =>
  [
    ...vocabulary.map((v) => v.script),
    ...notes.chunks.map((c) => c.content),
    ...turns.map((t) => t.text),
  ].join("\n");

// ── Start ───────────────────────────────────────────────────────

export async function startConversation(
  userId: string,
  input: { scenario: ScenarioId; language?: LanguageCode; level?: KnowledgeLevelName },
) {
  const started = performance.now();
  const scenario = SCENARIOS[input.scenario];
  const context = await resolveLearnerContext(userId, {
    language: input.language,
    level: input.level,
  });
  const llm = provider();
  const [vocabulary, notes] = await Promise.all([
    loadVocabulary(context.languageCode, scenario),
    retrieveNotes(context, scenario, null),
  ]);

  const { parsed, model } = await askPartner({
    llm,
    system: buildPartnerSystemPrompt({ ...context, scenario }),
    user: buildPartnerUserPrompt({
      scenario,
      vocabulary,
      notes: notes.chunks,
      history: [],
      learnerReply: null,
      isLastTurn: false,
    }),
    noteCount: notes.chunks.length,
    expectFeedback: false,
  });

  const session = await prisma.conversationSession.create({
    data: {
      userId,
      languageCode: context.languageCode,
      scenario: toEnum(scenario.id),
      level: toLevelEnum(context.level),
      turns: {
        create: {
          role: "ASSISTANT",
          text: parsed.reply.text,
          romanization: parsed.reply.romanization,
          translation: parsed.reply.translation,
          suggestions: parsed.suggestions,
          references: notes.references.filter((r) => parsed.sourceIds.includes(r.n)),
          status: "ANSWERED",
          context: partnerContext(context, notes, parsed, groundingText(vocabulary, notes, [])),
          model,
          latencyMs: Math.round(performance.now() - started),
        },
      },
    },
    include: { language: true, turns: true },
  });
  console.info(
    `[conversation] start ${scenario.id} ${context.languageCode}/${context.level} notes=${notes.chunks.length} (${model})`,
  );
  return { session: toSessionDto(session), turns: session.turns.map(toTurnDto) };
}

// ── Reply ───────────────────────────────────────────────────────

export async function replyToConversation(
  userId: string,
  sessionId: string,
  input: {
    text: string;
    inputMode: "text" | "voice";
    audio?: { durationMs?: number; bytes?: number; sttModel?: string };
  },
) {
  const started = performance.now();
  const session = await loadSession(userId, sessionId);
  if (session.status === "ENDED") {
    throw new HttpError(409, "CONVERSATION_ENDED", "This conversation has ended. Start a new one.");
  }
  if (session.learnerTurns >= CONVERSATION_CONFIG.maxLearnerTurns) {
    throw new HttpError(
      409,
      "TURN_LIMIT_REACHED",
      "This role-play is complete — end it to see your summary.",
    );
  }
  const text = sanitizeQuestion(input.text).slice(0, CONVERSATION_CONFIG.maxReplyLength);
  if (!text) throw new HttpError(400, "EMPTY_REPLY", "Type or say something first");

  const scenario = SCENARIOS[toScenarioId(session.scenario)];
  const context = await resolveLearnerContext(userId, {
    language: session.languageCode as LanguageCode,
    level: session.level.toLowerCase() as KnowledgeLevelName,
  });
  const learnerTurnData = {
    sessionId,
    role: "USER" as const,
    text,
    inputMode: input.inputMode === "voice" ? ("VOICE" as const) : ("TEXT" as const),
    audio: input.inputMode === "voice" && input.audio ? input.audio : undefined,
  };

  // 1. Prompt-injection attempt → no LLM call; the partner repeats the last line.
  const injection = detectInjection(text);
  if (injection) {
    console.warn(`[conversation] refused (${injection}) user=${userId}`);
    const last = [...session.turns].reverse().find((t) => t.role === "ASSISTANT");
    return saveExchange(session.id, learnerTurnData, {
      learnerFeedback: {
        understood: false,
        correction: null,
        note: "Let's stay in the role-play — answer your partner's question.",
      },
      partner: {
        text: last?.text ?? "…",
        romanization: last?.romanization ?? null,
        translation: last?.translation ?? null,
        suggestions: (last?.suggestions as Prisma.InputJsonValue | null) ?? [],
        references: [],
        status: "REFUSED",
        context: { refusedBecause: injection },
        model: null,
        latencyMs: Math.round(performance.now() - started),
      },
    });
  }

  // 2. Notes + vocabulary + conversation so far → partner's answer.
  const llm = provider();
  const [vocabulary, notes] = await Promise.all([
    loadVocabulary(context.languageCode, scenario),
    retrieveNotes(context, scenario, text),
  ]);
  const isLastTurn = session.learnerTurns + 1 >= CONVERSATION_CONFIG.maxLearnerTurns;
  const { parsed, model } = await askPartner({
    llm,
    system: buildPartnerSystemPrompt({ ...context, scenario }),
    user: buildPartnerUserPrompt({
      scenario,
      vocabulary,
      notes: notes.chunks,
      history: historyOf(session.turns),
      learnerReply: text,
      isLastTurn,
    }),
    noteCount: notes.chunks.length,
    expectFeedback: true,
  });

  console.info(
    `[conversation] reply ${scenario.id} ${context.languageCode} turn=${session.learnerTurns + 1} notes=${notes.chunks.length} (${model})`,
  );
  return saveExchange(session.id, learnerTurnData, {
    learnerFeedback: parsed.feedback ?? { understood: true, correction: null, note: "" },
    partner: {
      text: parsed.reply.text,
      romanization: parsed.reply.romanization,
      translation: parsed.reply.translation,
      suggestions: isLastTurn ? [] : parsed.suggestions,
      references: notes.references.filter((r) => parsed.sourceIds.includes(r.n)),
      status: "ANSWERED",
      context: partnerContext(
        context,
        notes,
        parsed,
        groundingText(vocabulary, notes, [...session.turns, { text }]),
      ),
      model,
      latencyMs: Math.round(performance.now() - started),
    },
  });
}

async function saveExchange(
  sessionId: string,
  learner: Prisma.ConversationTurnUncheckedCreateInput,
  result: {
    learnerFeedback: Prisma.InputJsonValue;
    partner: {
      text: string;
      romanization: string | null;
      translation: string | null;
      suggestions: Prisma.InputJsonValue;
      references: Prisma.InputJsonValue;
      status: "ANSWERED" | "REFUSED";
      context: Prisma.InputJsonValue;
      model: string | null;
      latencyMs: number;
    };
  },
) {
  const [learnerTurn, partnerTurn, session] = await prisma.$transaction(async (tx) => {
    const learnerRow = await tx.conversationTurn.create({
      data: { ...learner, feedback: result.learnerFeedback },
    });
    // 1 ms later, so the order by createdAt is always learner → partner.
    const partnerRow = await tx.conversationTurn.create({
      data: {
        sessionId,
        role: "ASSISTANT",
        ...result.partner,
        createdAt: new Date(learnerRow.createdAt.getTime() + 1),
      },
    });
    const updated = await tx.conversationSession.update({
      where: { id: sessionId },
      data: { learnerTurns: { increment: 1 } },
      include: { language: true },
    });
    return [learnerRow, partnerRow, updated] as const;
  });
  return {
    session: toSessionDto(session),
    turns: [toTurnDto(learnerTurn), toTurnDto(partnerTurn)],
  };
}

// ── End & summary ───────────────────────────────────────────────

type Feedback = { understood?: boolean; correction?: { text: string } | null };

export async function endConversation(userId: string, sessionId: string) {
  const session = await loadSession(userId, sessionId);
  if (session.status === "ENDED") {
    return { session: toSessionDto(session), turns: session.turns.map(toTurnDto) };
  }
  const scenario = SCENARIOS[toScenarioId(session.scenario)];
  const learnerTurns = session.turns.filter((t) => t.role === "USER");
  const partnerTurns = session.turns.filter((t) => t.role === "ASSISTANT");
  const context = await resolveLearnerContext(userId, {
    language: session.languageCode as LanguageCode,
    level: session.level.toLowerCase() as KnowledgeLevelName,
  });
  const vocabulary = await loadVocabulary(context.languageCode, scenario);

  // Statistics — counted, no AI.
  const learnerText = normalizeText(learnerTurns.map((t) => t.text).join(" "));
  const feedback = learnerTurns.map((t) => (t.feedback ?? {}) as Feedback);
  const endedAt = new Date();
  const stats = {
    replies: learnerTurns.length,
    voiceReplies: learnerTurns.filter((t) => t.inputMode === "VOICE").length,
    typedReplies: learnerTurns.filter((t) => t.inputMode === "TEXT").length,
    understoodReplies: feedback.filter((f) => f.understood !== false).length,
    corrections: feedback.filter((f) => f.correction).length,
    vocabularyUsed: vocabulary
      .filter((v) => learnerText.includes(normalizeText(v.script)))
      .map((v) => ({ script: v.script, romanization: v.romanization, meaning: v.meaning })),
    goalReached: partnerTurns.some(
      (t) => (t.context as { goalReached?: boolean } | null)?.goalReached === true,
    ),
    durationSeconds: Math.round((endedAt.getTime() - session.startedAt.getTime()) / 1000),
  };

  // AI review — only when the learner said something; never blocks ending the session.
  let review: SessionSummaryAi | null = null;
  let reviewNote: string | null = null;
  if (learnerTurns.length === 0) {
    reviewNote = "You ended before replying — try answering your partner next time.";
  } else {
    try {
      const notes = await retrieveNotes(context, scenario, null);
      const history = historyOf(session.turns);
      const corrections = feedback.map((f) => f.correction?.text ?? "").join("\n");
      const result = await provider().generate({
        system: buildSummarySystemPrompt(context.languageName, context.level),
        turns: [
          {
            role: "user",
            text: buildSummaryUserPrompt({ scenario, history, vocabulary, notes: notes.chunks }),
          },
        ],
        json: true,
        temperature: 0.3,
        maxOutputTokens: CONVERSATION_CONFIG.maxOutputTokens,
        purpose: "conversation-summary",
      });
      review = parseSummary(
        result.text,
        [groundingText(vocabulary, notes, session.turns), corrections].join("\n"),
      );
    } catch (error) {
      console.warn(`[conversation] summary review failed: ${(error as Error).message}`);
      reviewNote = "The AI review is unavailable right now — your statistics are below.";
    }
  }

  const summary = { stats, review, reviewNote };
  const updated = await prisma.conversationSession.update({
    where: { id: session.id },
    data: { status: "ENDED", endedAt, summary },
    include: { language: true, turns: { orderBy: { createdAt: "asc" } } },
  });
  console.info(
    `[conversation] end ${scenario.id} replies=${stats.replies} review=${review ? "yes" : "no"}`,
  );
  return { session: toSessionDto(updated), turns: updated.turns.map(toTurnDto) };
}

// ── History ─────────────────────────────────────────────────────

export async function listConversationSessions(userId: string, language?: LanguageCode) {
  const sessions = await prisma.conversationSession.findMany({
    where: { userId, ...(language ? { languageCode: language } : {}) },
    orderBy: { startedAt: "desc" },
    take: 20,
    include: { language: true },
  });
  return sessions.map(toSessionDto);
}

export async function getConversationSession(userId: string, sessionId: string) {
  const session = await loadSession(userId, sessionId);
  return { session: toSessionDto(session), turns: session.turns.map(toTurnDto) };
}

export async function deleteConversationSession(userId: string, sessionId: string) {
  const { count } = await prisma.conversationSession.deleteMany({
    where: { id: sessionId, userId },
  });
  if (count === 0) throw notFound("CONVERSATION_NOT_FOUND", "Conversation not found");
}
