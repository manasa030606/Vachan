// Unit tests for the speech features' pure parts (no database, no network, no AI).
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyzeAudio, audioIssues } from "./audio-analysis.ts";
import { fluencyFeedback } from "./fluency.ts";
import { parsePronunciationNotes } from "./pronunciation.ts";
import { openQuestion, sealQuestion } from "./question-token.ts";
import { parseTranscription, transcriptionPrompt } from "./stt.ts";
import { compareTranscript, foldRomanization, normalizeText, similarity } from "./text-compare.ts";
import { pickTtsModel } from "./tts.ts";
import { encodeWav, parseWav, pcm16ToWav, resample } from "./wav.ts";

const RATE = 16_000;
/** Sound in the given [start, end) seconds, silence elsewhere. */
function signal(seconds: number, bursts: Array<[number, number]>, amplitude = 0.3) {
  const samples = new Float32Array(Math.round(RATE * seconds));
  for (let i = 0; i < samples.length; i++) {
    const t = i / RATE;
    const on = bursts.some(([a, b]) => t >= a && t < b);
    samples[i] = on ? amplitude * Math.sin(2 * Math.PI * 200 * t) : 0;
  }
  return samples;
}

describe("WAV", () => {
  it("round-trips 16-bit mono", () => {
    const decoded = parseWav(encodeWav(signal(0.5, [[0, 0.5]]), RATE));
    assert.equal(decoded.sampleRate, RATE);
    assert.equal(decoded.channels, 1);
    assert.equal(decoded.durationMs, 500);
  });

  it("reads 24-bit stereo and mixes it to mono", () => {
    const frames = 4;
    const data = Buffer.alloc(frames * 6);
    for (let i = 0; i < frames; i++) {
      data.writeIntLE(4_194_304, i * 6, 3); // left  = 0.5
      data.writeIntLE(0, i * 6 + 3, 3); // right = 0
    }
    const header = Buffer.alloc(44);
    header.write("RIFF", 0, "ascii");
    header.writeUInt32LE(36 + data.length, 4);
    header.write("WAVEfmt ", 8, "ascii");
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(2, 22);
    header.writeUInt32LE(48_000, 24);
    header.writeUInt32LE(48_000 * 6, 28);
    header.writeUInt16LE(6, 32);
    header.writeUInt16LE(24, 34);
    header.write("data", 36, "ascii");
    header.writeUInt32LE(data.length, 40);
    const decoded = parseWav(Buffer.concat([header, data]));
    assert.equal(decoded.channels, 2);
    assert.ok(Math.abs(decoded.samples[0]! - 0.25) < 1e-6);
  });

  it("rejects files that are not WAV", () => {
    assert.throws(() => parseWav(Buffer.from("hello world, not audio")), /not a WAV/);
  });

  it("wraps Gemini's raw PCM and resamples 24 kHz → 16 kHz", () => {
    const wav = pcm16ToWav(Buffer.alloc(48_000), 24_000); // 1 s of 16-bit silence
    assert.equal(parseWav(wav).durationMs, 1000);
    assert.equal(resample(new Float32Array(24_000), 24_000, 16_000).length, 16_000);
  });
});

describe("audio analysis (no AI)", () => {
  it("finds speech, pauses and timing", () => {
    const analysis = analyzeAudio(
      signal(3, [
        [0.5, 1.2],
        [1.8, 2.5],
      ]),
      RATE,
    );
    assert.equal(analysis.durationMs, 3000);
    assert.equal(analysis.speechStartMs, 500);
    assert.equal(analysis.segments, 2);
    assert.deepEqual(analysis.pauses, [600]);
    assert.ok(Math.abs(analysis.speechMs - 1400) <= 40);
    assert.deepEqual(audioIssues(analysis), []);
  });

  it("joins tiny gaps inside a word", () => {
    const analysis = analyzeAudio(
      signal(1.5, [
        [0.2, 0.6],
        [0.7, 1.1],
      ]),
      RATE,
    );
    assert.equal(analysis.segments, 1);
    assert.deepEqual(analysis.pauses, []);
  });

  it("rejects silent, too short and speechless recordings", () => {
    const code = (samples: Float32Array) => audioIssues(analyzeAudio(samples, RATE))[0]?.code;
    assert.equal(code(new Float32Array(RATE)), "SILENT");
    assert.equal(code(signal(0.2, [[0, 0.2]])), "TOO_SHORT");
    assert.equal(code(signal(2, [[1, 1.04]])), "NO_SPEECH"); // a click, not speech
  });

  it("warns about distorted (clipped) audio", () => {
    const issues = audioIssues(analyzeAudio(signal(1, [[0.1, 0.9]], 1.5), RATE));
    assert.ok(issues.some((issue) => issue.code === "CLIPPED" && issue.severity === "warning"));
  });
});

describe("content match (text, no AI)", () => {
  const myName = { script: "నా పేరు ఆశ", romanization: "naa peru Asha" };

  it("normalizes punctuation, case and zero-width joiners", () => {
    assert.equal(normalizeText("  నా‌ పేరు, ఆశ! "), "నా పేరు ఆశ");
    assert.equal(foldRomanization("Namaskaaram"), "namaskaram");
  });

  it("an exact transcript is a match", () => {
    const result = compareTranscript(myName, "నా పేరు ఆశ.");
    assert.equal(result.score, 100);
    assert.equal(result.verdict, "match");
    assert.ok(result.words.every((w) => w.status === "correct"));
  });

  it("a missing vowel sign is 'close', word by word", () => {
    const result = compareTranscript(myName, "నా పేరు ఆశా");
    assert.equal(result.verdict, "close");
    assert.equal(result.words[2]!.status, "close");
    assert.ok(similarity("ఆశ", "ఆశా") > 0.6);
  });

  it("a wrong word caps the verdict at 'partial'", () => {
    const result = compareTranscript(
      { script: "मुझे पानी चाहिए", romanization: "" },
      "मुझे चाय चाहिए",
    );
    assert.equal(result.verdict, "partial");
    assert.ok(result.words.some((w) => w.status === "missing" || w.status === "wrong"));
  });

  it("compares a Latin-letter transcript with the romanization", () => {
    const result = compareTranscript(myName, "na peru asha");
    assert.equal(result.comparedWith, "romanization");
    assert.equal(result.verdict, "match");
  });

  it("an empty transcript means nothing was heard", () => {
    assert.equal(compareTranscript(myName, "").verdict, "nothing-heard");
  });
});

describe("fluency (timing only)", () => {
  it("one pause → some pauses, with notes and the method stated", () => {
    const feedback = fluencyFeedback(
      analyzeAudio(
        signal(3, [
          [0.5, 1.2],
          [1.8, 2.5],
        ]),
        RATE,
      ),
      "నా పేరు ఆశ",
    );
    assert.equal(feedback.rating, "some-pauses");
    assert.equal(feedback.pauses, 1);
    assert.match(feedback.method, /does not judge/);
  });

  it("no pauses → smooth; a late start is mentioned", () => {
    assert.equal(
      fluencyFeedback(analyzeAudio(signal(2, [[0.3, 1.5]]), RATE), "నమస్కారం").rating,
      "smooth",
    );
    const late = fluencyFeedback(analyzeAudio(signal(4, [[2.6, 3.6]]), RATE), "నమస్కారం");
    assert.ok(late.notes.some((n) => /started speaking after/.test(n)));
  });
});

describe("speech-to-text and pronunciation replies", () => {
  it("the transcription prompt never asks to correct, and the expected phrase isn't in it", () => {
    const prompt = transcriptionPrompt("Telugu", "Telugu script");
    assert.match(prompt, /Do not correct/);
    assert.match(prompt, /Telugu script/);
  });

  it("reads the transcription JSON; no-speech → empty", () => {
    assert.equal(
      parseTranscription('```json\n{"transcript":" నా  పేరు ","heard":"speech"}\n```'),
      "నా పేరు",
    );
    assert.equal(parseTranscription('{"transcript":"um","heard":"no-speech"}'), "");
    assert.throws(() => parseTranscription("I heard hello"));
  });

  it("pronunciation notes: max 3, words must be in the phrase", () => {
    const parsed = parsePronunciationNotes(
      JSON.stringify({
        notes: [
          { word: "ఆశ", tip: "Short a at the end." },
          { word: "invented", tip: "x" },
          { word: null, tip: "y" },
          { word: null, tip: "z" },
        ],
        overall: "Good try!",
        confident: true,
      }),
      "నా పేరు ఆశ",
    );
    assert.equal(parsed.notes.length, 3);
    assert.equal(parsed.notes[0]!.word, "ఆశ");
    assert.equal(parsed.notes[1]!.word, null);
    assert.equal(parsed.confident, true);
  });
});

describe("text-to-speech model choice", () => {
  it("picks the newest stable flash TTS model", () => {
    assert.equal(
      pickTtsModel([
        "models/gemini-2.5-flash-preview-tts",
        "models/gemini-3.5-flash",
        "models/gemini-3.0-flash-tts",
        "models/gemini-3.0-flash-preview-tts",
        "models/gemini-2.5-pro-preview-tts",
      ]),
      "gemini-3.0-flash-tts",
    );
    assert.equal(pickTtsModel(["models/gemini-3.5-flash"]), null);
  });
});

describe("listening question tokens", () => {
  it("hide the answer and can't be forged or reused after expiry", () => {
    const token = sealQuestion("te-v16-hello", "c", 1_000);
    assert.ok(!token.includes("hello"));
    assert.deepEqual(openQuestion(token, 2_000), {
      itemId: "te-v16-hello",
      correct: "c",
      expiresAt: 1_000 + 24 * 60 * 60_000,
    });
    const forged = token.slice(0, -4) + (token.endsWith("AAAA") ? "BBBB" : "AAAA");
    assert.throws(() => openQuestion(forged, 2_000), /expired/);
    assert.throws(() => openQuestion(token, 1_000 + 25 * 60 * 60_000), /expired/);
  });
});

describe("free-quota errors", () => {
  it("turns Gemini's 429 details into a readable line with the window", async () => {
    const { describeQuota } = await import("../ai/llm/types.ts");
    const quota = describeQuota({
      error: {
        details: [
          {
            "@type": "type.googleapis.com/google.rpc.QuotaFailure",
            violations: [
              {
                quotaId: "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
                quotaValue: "20",
                quotaDimensions: { model: "gemini-3.5-flash" },
              },
            ],
          },
          { "@type": "type.googleapis.com/google.rpc.RetryInfo", retryDelay: "42.5s" },
        ],
      },
    });
    assert.deepEqual(quota, {
      text: "20 requests per day for gemini-3.5-flash (free tier) — retry in 43 s",
      window: "day",
    });
    assert.equal(describeQuota({ error: { message: "x" } }), null);
  });
});
