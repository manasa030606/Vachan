// Every number and default the AI tutor (Phase 6) uses, in one place.

export const TUTOR_CONFIG = {
  providers: {
    gemini: {
      label: "Google Gemini",
      defaultModel: "gemini-3.5-flash",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      keyVariable: "GEMINI_API_KEY",
      keyUrl: "https://aistudio.google.com/apikey",
    },
    groq: {
      label: "Groq",
      defaultModel: "llama-3.3-70b-versatile",
      baseUrl: "https://api.groq.com/openai/v1",
      keyVariable: "GROQ_API_KEY",
      keyUrl: "https://console.groq.com/keys",
    },
    mock: {
      label: "Offline test double (no AI)",
      defaultModel: "mock-extractive",
      baseUrl: "",
      keyVariable: null,
      keyUrl: null,
    },
  },

  /** Longest question a learner can send (characters). */
  maxQuestionLength: 500,
  /** How many retrieved notes go into the prompt. */
  contextChunks: 5,
  /** How many earlier messages of the chat go into the prompt (for follow-up questions). */
  historyMessages: 6,
  /** Earlier messages are shortened to this many characters in the prompt. */
  historyMessageChars: 400,
  /** Low temperature = consistent, less creative answers (we want facts from the notes). */
  temperature: 0.2,
  maxOutputTokens: 2048, // newer Gemini models "think" first; thinking tokens count towards this limit

  /** Word budget per learner level — the prompt asks for answers of about this length. */
  levelStyle: {
    beginner: {
      words: 120,
      style:
        "Use very short, simple sentences. Avoid grammar terms; if you must use one, explain it in plain words. One idea at a time.",
    },
    elementary: {
      words: 170,
      style:
        "Use simple sentences. You may use basic grammar terms (verb, subject, ending) with a short explanation.",
    },
    intermediate: {
      words: 240,
      style: "You may use grammar terms (tense, case ending, agreement) and compare forms.",
    },
  },
} as const;

export type ProviderName = keyof typeof TUTOR_CONFIG.providers;
