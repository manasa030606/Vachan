// Turns recorded or uploaded audio into the small WAV file the backend expects:
// 16 kHz, mono, 16-bit PCM (32 KB per second). Pure functions — no browser APIs — so they can be
// unit-tested in Node.

export const TARGET_SAMPLE_RATE = 16_000;

/** Joins the small sample blocks a recorder delivers into one array. */
export function concatSamples(chunks: Float32Array[]): Float32Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Float32Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/** Changes the sample rate by averaging the input samples each output sample covers. */
export function resample(samples: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return samples;
  const ratio = fromRate / toRate;
  const out = new Float32Array(Math.floor(samples.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const start = Math.min(samples.length - 1, Math.floor(i * ratio));
    // Upsampling (ratio < 1) covers less than one input sample: use the nearest one.
    const end = Math.max(start + 1, Math.min(samples.length, Math.floor((i + 1) * ratio)));
    let sum = 0;
    for (let j = start; j < end; j++) sum += samples[j]!;
    out[i] = sum / (end - start);
  }
  return out;
}

/** Float samples (-1…1) → 16-bit mono WAV bytes. */
export function encodeWav(samples: Float32Array, sampleRate: number): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const text = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  };
  text(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Uint8Array(buffer);
}

/** Recorder output → upload-ready WAV (16 kHz mono). */
export function toUploadWav(chunks: Float32Array[], sampleRate: number) {
  const samples = resample(concatSamples(chunks), sampleRate, TARGET_SAMPLE_RATE);
  return {
    bytes: encodeWav(samples, TARGET_SAMPLE_RATE),
    durationMs: Math.round((samples.length / TARGET_SAMPLE_RATE) * 1000),
  };
}

/** Loudness of a block of samples, 0…1 (for the recording level meter). */
export function level(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i]! * samples[i]!;
  const rms = Math.sqrt(sum / Math.max(1, samples.length));
  // Map roughly -60 dB … 0 dB to 0 … 1.
  const db = rms > 0 ? 20 * Math.log10(rms) : -100;
  return Math.max(0, Math.min(1, (db + 60) / 60));
}
