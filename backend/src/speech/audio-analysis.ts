// Measures a recording WITHOUT any AI: how long it is, when there was sound, pauses,
// loudness, distortion. Used to reject empty/broken audio before it reaches the paid
// speech-to-text API, and for the timing-based fluency feedback.
//
// Method (a simple energy-based voice activity detector):
//   1. cut the audio into 20 ms frames and measure each frame's loudness (RMS, in dBFS)
//   2. background noise = the quietest 10 % of frames
//   3. a frame is "sound" if it is clearly louder than the background
//   4. join sounds separated by tiny gaps (inside a word), drop tiny clicks
//   5. the gaps that remain between sounds are pauses
// It cannot tell speech from other sounds (music, a door) — it only measures sound vs silence.
import { SPEECH_CONFIG } from "../config/speech.ts";

export type AudioAnalysis = {
  durationMs: number;
  /** Total time with sound. */
  speechMs: number;
  /** When the first / last sound starts / ends (null when there is no sound). */
  speechStartMs: number | null;
  speechEndMs: number | null;
  /** Number of separate sound stretches. */
  segments: number;
  /** Silences ≥ pauseMs between two sounds. */
  pauses: number[];
  longestPauseMs: number;
  peakDb: number;
  /** Average loudness of the sound frames. */
  speechDb: number | null;
  noiseFloorDb: number;
  /** Speech loudness minus background noise. */
  snrDb: number | null;
  /** Share of samples at (almost) full volume. */
  clippingRatio: number;
};

export type AudioIssue = {
  code: "TOO_SHORT" | "TOO_LONG" | "SILENT" | "NO_SPEECH" | "CLIPPED" | "TOO_QUIET" | "NOISY";
  /** error = don't transcribe; warning = transcribe but tell the learner */
  severity: "error" | "warning";
  message: string;
};

const toDb = (value: number) => (value <= 1e-9 ? -120 : 20 * Math.log10(value));
const round = (value: number, digits = 1) => Math.round(value * 10 ** digits) / 10 ** digits;

export function analyzeAudio(samples: Float32Array, sampleRate: number): AudioAnalysis {
  const config = SPEECH_CONFIG.analysis;
  const durationMs = Math.round((samples.length / sampleRate) * 1000);
  const frameSize = Math.max(1, Math.round((sampleRate * config.frameMs) / 1000));
  const frameCount = Math.floor(samples.length / frameSize);

  let peak = 0;
  let clipped = 0;
  const frameDb: number[] = [];
  for (let f = 0; f < frameCount; f++) {
    let sum = 0;
    for (let i = f * frameSize; i < (f + 1) * frameSize; i++) {
      const s = samples[i]!;
      const abs = Math.abs(s);
      if (abs > peak) peak = abs;
      if (abs >= 0.99) clipped++;
      sum += s * s;
    }
    frameDb.push(toDb(Math.sqrt(sum / frameSize)));
  }

  const sorted = [...frameDb].sort((a, b) => a - b);
  const noiseFloorDb = sorted.length ? sorted[Math.floor(sorted.length * 0.1)]! : -120;
  const threshold = Math.max(config.minSpeechDb, noiseFloorDb + config.speechAboveNoiseDb);

  // Sound / silence per frame → stretches of sound.
  let raw: Array<[number, number]> = [];
  let start = -1;
  frameDb.forEach((db, f) => {
    if (db > threshold && start < 0) start = f;
    if (db <= threshold && start >= 0) {
      raw.push([start, f]);
      start = -1;
    }
  });
  if (start >= 0) raw.push([start, frameCount]);

  // Join stretches separated by tiny gaps, then drop clicks.
  const bridgeFrames = Math.round(config.bridgeGapMs / config.frameMs);
  const merged: Array<[number, number]> = [];
  for (const segment of raw) {
    const last = merged.at(-1);
    if (last && segment[0] - last[1] <= bridgeFrames) last[1] = segment[1];
    else merged.push([...segment]);
  }
  raw = merged.filter(([a, b]) => (b - a) * config.frameMs >= config.minSegmentMs);

  const ms = (frames: number) => frames * config.frameMs;
  const speechFrames = raw.flatMap(([a, b]) => frameDb.slice(a, b));
  const speechDb = speechFrames.length
    ? toDb(
        Math.sqrt(speechFrames.reduce((sum, db) => sum + 10 ** (db / 10), 0) / speechFrames.length),
      )
    : null;
  const gaps = raw.slice(1).map(([a], i) => ms(a - raw[i]![1]));
  const pauses = gaps.filter((gap) => gap >= config.pauseMs);

  return {
    durationMs,
    speechMs: ms(raw.reduce((sum, [a, b]) => sum + (b - a), 0)),
    speechStartMs: raw.length ? ms(raw[0]![0]) : null,
    speechEndMs: raw.length ? ms(raw.at(-1)![1]) : null,
    segments: raw.length,
    pauses,
    longestPauseMs: pauses.length ? Math.max(...pauses) : 0,
    peakDb: round(toDb(peak)),
    speechDb: speechDb === null ? null : round(speechDb),
    noiseFloorDb: round(noiseFloorDb),
    snrDb: speechDb === null ? null : round(speechDb - noiseFloorDb),
    clippingRatio: samples.length ? round(clipped / samples.length, 4) : 0,
  };
}

/** Problems worth telling the learner about. Errors stop the request before speech-to-text. */
export function audioIssues(analysis: AudioAnalysis): AudioIssue[] {
  const config = SPEECH_CONFIG.analysis;
  const issues: AudioIssue[] = [];
  if (analysis.durationMs < SPEECH_CONFIG.minDurationMs) {
    issues.push({
      code: "TOO_SHORT",
      severity: "error",
      message: "The recording is too short. Hold the button a little longer and say the phrase.",
    });
  } else if (analysis.durationMs > SPEECH_CONFIG.maxDurationMs) {
    issues.push({
      code: "TOO_LONG",
      severity: "error",
      message: `The recording is longer than ${SPEECH_CONFIG.maxDurationMs / 1000} seconds. Record just the phrase.`,
    });
  } else if (analysis.peakDb < config.silentPeakDb) {
    issues.push({
      code: "SILENT",
      severity: "error",
      message:
        "The recording is silent. Check that the right microphone is selected and not muted.",
    });
  } else if (analysis.speechMs < config.minSpeechMs) {
    issues.push({
      code: "NO_SPEECH",
      severity: "error",
      message: "We couldn't hear any speech. Speak a little louder or closer to the microphone.",
    });
  }
  if (issues.length) return issues;

  if (analysis.clippingRatio > config.clippingRatio) {
    issues.push({
      code: "CLIPPED",
      severity: "warning",
      message: "The recording is distorted (too loud). Move a little away from the microphone.",
    });
  }
  if (analysis.speechDb !== null && analysis.speechDb < config.quietSpeechDb) {
    issues.push({
      code: "TOO_QUIET",
      severity: "warning",
      message: "Your voice is quiet in the recording. Speak up or move closer to the microphone.",
    });
  }
  if (analysis.snrDb !== null && analysis.snrDb < config.noisySnrDb) {
    issues.push({
      code: "NOISY",
      severity: "warning",
      message: "There is a lot of background noise. A quieter place gives better results.",
    });
  }
  return issues;
}
