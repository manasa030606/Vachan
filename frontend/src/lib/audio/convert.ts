// Browser-only: turns an audio FILE the learner chose (mp3, m4a, ogg, webm, wav …) into the
// 16 kHz mono WAV the backend accepts. The browser's own decoder does the work, so any format the
// browser can play works — nothing is uploaded until it's converted.
import { encodeWav, resample, TARGET_SAMPLE_RATE } from "./wav";

export class AudioFileError extends Error {}

export async function fileToUploadWav(file: File, maxDurationMs: number) {
  if (
    !file.type.startsWith("audio/") &&
    !/\.(wav|mp3|m4a|aac|ogg|oga|webm|flac)$/i.test(file.name)
  ) {
    throw new AudioFileError("Please choose an audio file (for example .wav, .mp3 or .m4a).");
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new AudioFileError(
      "That file is very large. Choose a short recording (under 30 seconds).",
    );
  }
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) throw new AudioFileError("This browser can't read audio files.");
  const context = new AudioContextClass();
  try {
    let decoded: AudioBuffer;
    try {
      decoded = await context.decodeAudioData(await file.arrayBuffer());
    } catch {
      throw new AudioFileError("This audio file can't be read. Try a .wav or .mp3 file.");
    }
    if (decoded.duration * 1000 > maxDurationMs) {
      throw new AudioFileError(
        `The recording is longer than ${Math.round(maxDurationMs / 1000)} seconds. Choose a shorter one.`,
      );
    }
    // Mix all channels down to mono.
    const mono = new Float32Array(decoded.length);
    for (let c = 0; c < decoded.numberOfChannels; c++) {
      const channel = decoded.getChannelData(c);
      for (let i = 0; i < mono.length; i++) mono[i]! += channel[i]! / decoded.numberOfChannels;
    }
    const samples = resample(mono, decoded.sampleRate, TARGET_SAMPLE_RATE);
    return {
      blob: new Blob([encodeWav(samples, TARGET_SAMPLE_RATE)], { type: "audio/wav" }),
      durationMs: Math.round(decoded.duration * 1000),
    };
  } finally {
    void context.close();
  }
}
