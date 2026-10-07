// FLUENCY feedback from TIMING ONLY (audio-analysis.ts): how long the learner waited before
// speaking, pauses in the middle, and speaking speed. It does not judge rhythm, intonation or
// how natural the speech sounds — the UI says so.
import { SPEECH_CONFIG } from "../config/speech.ts";
import type { AudioAnalysis } from "./audio-analysis.ts";
import { graphemes, normalizeText } from "./text-compare.ts";

export type FluencyFeedback = {
  rating: "smooth" | "some-pauses" | "hesitant";
  totalMs: number;
  speakingMs: number;
  startDelayMs: number | null;
  pauses: number;
  longestPauseMs: number;
  /** Letters (aksharas) per second of sound, from the expected phrase; null if not measurable. */
  lettersPerSecond: number | null;
  notes: string[];
  method: string;
};

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

export function fluencyFeedback(analysis: AudioAnalysis, expectedText: string): FluencyFeedback {
  const config = SPEECH_CONFIG.fluency;
  const letters = graphemes(normalizeText(expectedText).replace(/ /g, "")).length;
  const lettersPerSecond =
    analysis.speechMs >= 300 && letters > 0
      ? Math.round((letters / (analysis.speechMs / 1000)) * 10) / 10
      : null;

  const notes: string[] = [];
  const pauses = analysis.pauses.length;
  if (analysis.speechStartMs !== null && analysis.speechStartMs > config.slowStartMs) {
    notes.push(
      `You started speaking after ${seconds(analysis.speechStartMs)}. Try to begin soon after pressing record.`,
    );
  }
  if (pauses === 0) notes.push("No long pauses — you said it in one go.");
  else if (pauses === 1)
    notes.push(
      `One pause of ${seconds(analysis.longestPauseMs)}. Practise until you can say it without stopping.`,
    );
  else
    notes.push(
      `${pauses} pauses (the longest ${seconds(analysis.longestPauseMs)}). Say it slowly a few times, then join the words.`,
    );
  if (lettersPerSecond !== null && lettersPerSecond < config.slowRate) {
    notes.push("Quite slow — that's fine while learning; speed up as it gets easier.");
  } else if (lettersPerSecond !== null && lettersPerSecond > config.fastRate) {
    notes.push("Very fast — slow down a little so every sound is clear.");
  }

  const rating =
    pauses === 0 &&
    (analysis.speechStartMs ?? 0) <= config.slowStartMs &&
    (lettersPerSecond === null || lettersPerSecond >= config.slowRate)
      ? "smooth"
      : pauses <= 1
        ? "some-pauses"
        : "hesitant";

  return {
    rating,
    totalMs: analysis.durationMs,
    speakingMs: analysis.speechMs,
    startDelayMs: analysis.speechStartMs,
    pauses,
    longestPauseMs: analysis.longestPauseMs,
    lettersPerSecond,
    notes,
    method:
      "Measured from the timing of sound and silence in your recording. It does not judge rhythm, intonation or accent.",
  };
}
