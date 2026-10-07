// Role-play conversation scenarios and their settings, in one place.
// The scenario text is English and the same for every language; the AI partner speaks the
// learner's target language, using the course vocabulary and the knowledge-base notes.
import type { KnowledgeLevelName } from "../rag/config.ts";

export const SCENARIO_IDS = [
  "introductions",
  "restaurant",
  "shopping",
  "travel",
  "directions",
  "everyday",
] as const;
export type ScenarioId = (typeof SCENARIO_IDS)[number];

export type Scenario = {
  id: ScenarioId;
  title: string;
  description: string;
  /** Who the AI plays. */
  partnerRole: string;
  /** What the learner should try to do — shown in the UI and given to the AI. */
  goal: string;
  /** Searched in the knowledge base (with the learner's reply) for grounding notes. */
  retrievalQuery: string;
  /** Knowledge-base topic of the scenario's notes (knowledge-base/<lang>/conversation.md). */
  topic: string;
  /** Course vocabulary topics (VocabularyItem.topic) offered to the AI and the learner. */
  vocabularyTopics: string[];
};

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  introductions: {
    id: "introductions",
    title: "Introductions",
    description: "Meet someone new: say hello, give your name and ask theirs.",
    partnerRole: "a friendly new neighbour",
    goal: "Greet your partner, say your name, ask their name and where they are from.",
    retrievalQuery: "introductions hello my name is what is your name where are you from",
    topic: "introductions",
    vocabularyTopics: ["Greetings", "Introductions", "Phrases"],
  },
  restaurant: {
    id: "restaurant",
    title: "At a restaurant",
    description: "Order food and a drink, ask for water and the bill.",
    partnerRole: "a waiter at a small restaurant",
    goal: "Order something to eat or drink, ask for water, and ask for the bill.",
    retrievalQuery: "restaurant waiter I want food tea water please the bill",
    topic: "restaurant",
    vocabularyTopics: ["Food & drink", "Numbers", "Greetings"],
  },
  shopping: {
    id: "shopping",
    title: "Shopping",
    description: "Ask prices at a market stall, bargain a little and buy something.",
    partnerRole: "a shopkeeper at a market stall",
    goal: "Ask how much something costs, ask for a lower price, and buy one or two.",
    retrievalQuery: "shopping how much is this price too expensive I want two",
    topic: "shopping",
    vocabularyTopics: ["Numbers", "Food & drink", "Greetings"],
  },
  travel: {
    id: "travel",
    title: "Travel",
    description: "Buy a bus ticket and check when and where your bus leaves.",
    partnerRole: "a ticket clerk at a bus station",
    goal: "Ask for a ticket to a town, ask the time of the bus and the fare.",
    retrievalQuery: "travel bus stand ticket when is the bus does this bus go",
    topic: "travel",
    vocabularyTopics: ["Numbers", "Greetings"],
  },
  directions: {
    id: "directions",
    title: "Asking for directions",
    description: "Find your way: ask where a place is and follow left, right, straight.",
    partnerRole: "a helpful person on the street",
    goal: "Ask where a place is, understand left / right / straight, and say thank you.",
    retrievalQuery: "directions where is it left right go straight near far",
    topic: "directions",
    vocabularyTopics: ["Greetings"],
  },
  everyday: {
    id: "everyday",
    title: "Everyday conversation",
    description: "Chat with a friend: how are you, have you eaten, family and your day.",
    partnerRole: "a friend you meet in the evening",
    goal: "Ask how your friend is, answer their questions, and talk about family and food.",
    retrievalQuery: "everyday conversation how are you I am fine have you eaten family",
    topic: "everyday-conversation",
    vocabularyTopics: ["Greetings", "Family", "Food & drink", "Phrases"],
  },
};

export const CONVERSATION_CONFIG = {
  /** Learner replies per session; the partner wraps up on the last one. */
  maxLearnerTurns: 8,
  /** Longest learner reply (characters). */
  maxReplyLength: 300,
  /** Knowledge-base notes per prompt. */
  contextChunks: 4,
  /** Earlier lines of the conversation in the prompt. */
  historyTurns: 12,
  /** Course words offered to the AI per scenario. */
  vocabularyItems: 18,
  temperature: 0.5,
  maxOutputTokens: 2048,
  /** How long and simple the partner's lines are, per learner level. */
  levelStyle: {
    beginner:
      "Say ONE short sentence of 2–6 words, then at most one very simple question. Use mostly words from <vocabulary> and <notes>. Repeat useful words.",
    elementary:
      "Say one or two short sentences (at most 12 words in total). Use everyday words, mainly from <vocabulary> and <notes>.",
    intermediate:
      "Speak naturally in one to three sentences (at most 25 words). You may use polite forms and a few new words that fit the situation.",
  } satisfies Record<KnowledgeLevelName, string>,
} as const;
