// Checks an uploaded recording BEFORE anything is sent to speech-to-text:
//   missing file → 400 · not WAV → 415 · broken WAV → 400 · too short / too long / silent /
//   no speech → 422 (with a message the learner can act on). Warnings (quiet, noisy,
//   distorted) are returned and shown, but the audio is still transcribed.
// The checked audio is converted to 16 kHz mono 16-bit WAV — small, and what every provider
// accepts.
import { SPEECH_CONFIG } from "../config/speech.ts";
import { HttpError } from "../lib/http-error.ts";
import {
  analyzeAudio,
  audioIssues,
  type AudioAnalysis,
  type AudioIssue,
} from "./audio-analysis.ts";
import { AudioFormatError, encodeWav, parseWav, resample } from "./wav.ts";

export type UploadedFile = { buffer: Buffer; mimetype: string; originalname: string; size: number };

export type CheckedAudio = {
  /** 16 kHz mono 16-bit WAV, ready for speech-to-text */
  wav: Buffer;
  analysis: AudioAnalysis;
  warnings: AudioIssue[];
  meta: {
    mimeType: string;
    bytes: number;
    durationMs: number;
    sampleRate: number;
    channels: number;
  };
};

const WAV_TYPES = ["audio/wav", "audio/x-wav", "audio/wave", "audio/vnd.wave"];
const ISSUE_CODES: Record<AudioIssue["code"], string> = {
  TOO_SHORT: "AUDIO_TOO_SHORT",
  TOO_LONG: "AUDIO_TOO_LONG",
  SILENT: "AUDIO_SILENT",
  NO_SPEECH: "NO_SPEECH_DETECTED",
  CLIPPED: "AUDIO_CLIPPED",
  TOO_QUIET: "AUDIO_TOO_QUIET",
  NOISY: "AUDIO_NOISY",
};

export function checkAudio(file: UploadedFile | undefined): CheckedAudio {
  if (!file || file.size === 0) {
    throw new HttpError(
      400,
      "NO_AUDIO",
      'No recording received. Send the audio as a file in the form field "audio".',
    );
  }
  const looksLikeWav =
    WAV_TYPES.includes(file.mimetype.toLowerCase()) ||
    (file.mimetype === "application/octet-stream" && /\.wav$/i.test(file.originalname));
  if (!looksLikeWav) {
    throw new HttpError(
      415,
      "UNSUPPORTED_AUDIO_FORMAT",
      `Send a WAV file (got ${file.mimetype}). The Vachan app converts recordings and uploads to WAV automatically.`,
    );
  }

  let decoded;
  try {
    decoded = parseWav(file.buffer);
  } catch (error) {
    if (error instanceof AudioFormatError) {
      throw new HttpError(400, "BAD_AUDIO", `The audio file can't be read: ${error.message}.`);
    }
    throw error;
  }

  const analysis = analyzeAudio(decoded.samples, decoded.sampleRate);
  const issues = audioIssues(analysis);
  const blocking = issues.find((issue) => issue.severity === "error");
  if (blocking) {
    throw new HttpError(422, ISSUE_CODES[blocking.code], blocking.message, {
      durationMs: analysis.durationMs,
      speechMs: analysis.speechMs,
      peakDb: analysis.peakDb,
    });
  }

  const mono16k = resample(decoded.samples, decoded.sampleRate, 16_000);
  return {
    wav: encodeWav(mono16k, 16_000),
    analysis,
    warnings: issues,
    meta: {
      mimeType: file.mimetype,
      bytes: file.size,
      durationMs: decoded.durationMs,
      sampleRate: decoded.sampleRate,
      channels: decoded.channels,
    },
  };
}

export const SPEECH_LIMITS = {
  maxUploadBytes: SPEECH_CONFIG.maxUploadBytes,
  maxDurationMs: SPEECH_CONFIG.maxDurationMs,
  minDurationMs: SPEECH_CONFIG.minDurationMs,
  format: "WAV (PCM 8/16/24/32-bit or 32-bit float), any sample rate, mono or stereo",
};

export const warningCodes = (warnings: AudioIssue[]) =>
  warnings.map((w) => ({ code: ISSUE_CODES[w.code], message: w.message }));
