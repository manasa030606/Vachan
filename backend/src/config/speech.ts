// Every number and default the speech features (Phase 7) use, in one place.

export const SPEECH_CONFIG = {
  // ── Uploads ──────────────────────────────────────────────────
  /** Largest audio upload. 16 kHz mono 16-bit WAV = 32 KB per second → 2 MB ≈ 60 s. */
  maxUploadBytes: 2 * 1024 * 1024,
  /** Longest / shortest recording the server accepts. */
  maxDurationMs: 30_000,
  minDurationMs: 300,

  // ── Audio analysis (audio-analysis.ts) ───────────────────────
  analysis: {
    /** The audio is cut into 20 ms frames; each frame is "sound" or "silence". */
    frameMs: 20,
    /** A frame counts as sound when it is this many dB above the background noise … */
    speechAboveNoiseDb: 10,
    /** … and never quieter than this (dBFS). */
    minSpeechDb: -50,
    /** Silence shorter than this inside a word is ignored (stops between syllables). */
    bridgeGapMs: 160,
    /** Sound shorter than this is a click or a bump, not speech. */
    minSegmentMs: 60,
    /** A silence at least this long between sounds is reported as a pause. */
    pauseMs: 400,
    /** Less sound than this in the whole recording = "we couldn't hear you". */
    minSpeechMs: 200,
    /** Peak below this = microphone muted / nothing recorded. */
    silentPeakDb: -50,
    /** More than this share of samples at full volume = distorted ("too loud"). */
    clippingRatio: 0.01,
    /** Speech this quiet (average dBFS) gets a "speak closer to the microphone" warning. */
    quietSpeechDb: -38,
    /** Speech less than this many dB above the background noise gets a "noisy room" warning. */
    noisySnrDb: 10,
  },

  // ── Content match (text-compare.ts) ──────────────────────────
  match: {
    /** Character similarity (0–100) needed for each verdict. */
    verdicts: { match: 90, close: 70, partial: 40 },
    /** A word at least this similar is "almost right". */
    closeWord: 0.6,
  },

  // ── Fluency (fluency.ts) — timing only ───────────────────────
  fluency: {
    /** Waiting longer than this before speaking is mentioned. */
    slowStartMs: 2000,
    /** Letters (aksharas) per second: slower / faster than this is mentioned. */
    slowRate: 1.5,
    fastRate: 7,
  },

  // ── Text-to-speech cache (tts.service.ts) ────────────────────
  tts: {
    /** Longest text that can be turned into audio (a phrase or a short sentence). */
    maxTextLength: 200,
  },

  // ── Listening practice ───────────────────────────────────────
  listening: {
    questionsPerRound: 6,
    optionsPerQuestion: 4,
  },
} as const;

/** BCP-47 locale for each course language (used for TTS voices and the browser fallback). */
export const SPEECH_LOCALES: Record<string, string> = {
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  ml: "ml-IN",
  kn: "kn-IN",
  bn: "bn-IN",
};
