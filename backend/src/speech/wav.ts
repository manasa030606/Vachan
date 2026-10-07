// WAV (RIFF) reading and writing — no library needed.
//
// Why WAV? The browser records the learner and converts the recording to a small 16 kHz mono
// 16-bit WAV before uploading. WAV is uncompressed, so the server can measure the audio itself
// (silence, pauses, loudness — see audio-analysis.ts) without ffmpeg, and every speech-to-text
// provider accepts it.

export class AudioFormatError extends Error {
  constructor(
    readonly code: "NOT_WAV" | "UNSUPPORTED_WAV" | "CORRUPT_WAV",
    message: string,
  ) {
    super(message);
    this.name = "AudioFormatError";
  }
}

export type DecodedWav = {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  /** 1 = integer PCM, 3 = 32-bit float */
  format: 1 | 3;
  /** Mono samples in the range -1…1 (channels are averaged). */
  samples: Float32Array;
  durationMs: number;
};

const WAVE_FORMAT_PCM = 1;
const WAVE_FORMAT_FLOAT = 3;
const WAVE_FORMAT_EXTENSIBLE = 0xfffe;

/** Reads a WAV file. Supports 8/16/24/32-bit PCM and 32-bit float, any channel count. */
export function parseWav(buffer: Buffer): DecodedWav {
  if (
    buffer.length < 12 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WAVE"
  ) {
    throw new AudioFormatError("NOT_WAV", "The file is not a WAV recording");
  }

  let offset = 12;
  let fmt: { format: number; channels: number; sampleRate: number; bits: number } | null = null;
  let data: Buffer | null = null;

  // A WAV file is a list of chunks: "fmt " (the format), "data" (the samples), and others we skip.
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    // Some recorders write a too-large size for the last chunk (streaming) — clamp it.
    const end = Math.min(start + size, buffer.length);
    if (id === "fmt ") {
      if (end - start < 16) throw new AudioFormatError("CORRUPT_WAV", "Broken WAV header");
      let format = buffer.readUInt16LE(start);
      if (format === WAVE_FORMAT_EXTENSIBLE && end - start >= 26) {
        format = buffer.readUInt16LE(start + 24); // first 2 bytes of the sub-format GUID
      }
      fmt = {
        format,
        channels: buffer.readUInt16LE(start + 2),
        sampleRate: buffer.readUInt32LE(start + 4),
        bits: buffer.readUInt16LE(start + 14),
      };
    } else if (id === "data") {
      data = buffer.subarray(start, end);
    }
    offset = start + size + (size % 2); // chunks are padded to an even length
  }

  if (!fmt || !data) throw new AudioFormatError("CORRUPT_WAV", "The WAV file has no audio data");
  if (fmt.channels < 1 || fmt.channels > 8 || fmt.sampleRate < 4000 || fmt.sampleRate > 192_000) {
    throw new AudioFormatError("UNSUPPORTED_WAV", "Unusual WAV format (channels or sample rate)");
  }
  const isPcm = fmt.format === WAVE_FORMAT_PCM && [8, 16, 24, 32].includes(fmt.bits);
  const isFloat = fmt.format === WAVE_FORMAT_FLOAT && fmt.bits === 32;
  if (!isPcm && !isFloat) {
    throw new AudioFormatError(
      "UNSUPPORTED_WAV",
      "Only uncompressed WAV (PCM or 32-bit float) is supported",
    );
  }

  const bytesPerSample = fmt.bits / 8;
  const frameSize = bytesPerSample * fmt.channels;
  const frames = Math.floor(data.length / frameSize);
  const samples = new Float32Array(frames);
  const view = new DataView(data.buffer, data.byteOffset, data.length);
  for (let i = 0; i < frames; i++) {
    let sum = 0;
    for (let c = 0; c < fmt.channels; c++) {
      sum += readSample(view, i * frameSize + c * bytesPerSample, fmt.bits, isFloat);
    }
    samples[i] = sum / fmt.channels;
  }

  return {
    sampleRate: fmt.sampleRate,
    channels: fmt.channels,
    bitsPerSample: fmt.bits,
    format: isFloat ? 3 : 1,
    samples,
    durationMs: Math.round((frames / fmt.sampleRate) * 1000),
  };
}

function readSample(view: DataView, at: number, bits: number, isFloat: boolean) {
  if (isFloat) return view.getFloat32(at, true);
  switch (bits) {
    case 8:
      return (view.getUint8(at) - 128) / 128; // 8-bit WAV is unsigned
    case 16:
      return view.getInt16(at, true) / 32768;
    case 24: {
      const value = view.getUint8(at) | (view.getUint8(at + 1) << 8) | (view.getInt8(at + 2) << 16);
      return value / 8_388_608;
    }
    default:
      return view.getInt32(at, true) / 2_147_483_648;
  }
}

/** Writes 16-bit PCM samples as a WAV file. */
export function pcm16ToWav(pcm: Buffer, sampleRate: number, channels = 1): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8, "ascii");
  header.write("fmt ", 12, "ascii");
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(WAVE_FORMAT_PCM, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * 2, 28); // bytes per second
  header.writeUInt16LE(channels * 2, 32); // bytes per frame
  header.writeUInt16LE(16, 34); // bits per sample
  header.write("data", 36, "ascii");
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/** Float samples (-1…1) → 16-bit mono WAV. */
export function encodeWav(samples: Float32Array | number[], sampleRate: number): Buffer {
  const pcm = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    pcm.writeInt16LE(Math.round(s < 0 ? s * 32768 : s * 32767), i * 2);
  }
  return pcm16ToWav(pcm, sampleRate);
}

/**
 * Changes the sample rate (e.g. 48 kHz → 16 kHz). Each output sample is the average of the input
 * samples it covers (a simple low-pass filter), which is enough for speech recognition.
 */
export function resample(samples: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return samples;
  const ratio = fromRate / toRate;
  const output = new Float32Array(Math.floor(samples.length / ratio));
  for (let i = 0; i < output.length; i++) {
    const start = i * ratio;
    const end = Math.min(samples.length, start + Math.max(1, ratio));
    let sum = 0;
    let count = 0;
    for (let j = Math.floor(start); j < end; j++) {
      sum += samples[j]!;
      count++;
    }
    output[i] = count ? sum / count : 0;
  }
  return output;
}
