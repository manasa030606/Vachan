import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { concatSamples, encodeWav, level, resample, toUploadWav } from "./wav";

describe("audio → upload WAV", () => {
  it("joins recorder blocks", () => {
    const joined = concatSamples([new Float32Array([0.1, 0.2]), new Float32Array([0.3])]);
    assert.deepEqual(
      [...joined].map((v) => Math.round(v * 10)),
      [1, 2, 3],
    );
  });

  it("resamples 48 kHz → 16 kHz (3:1) by averaging", () => {
    const out = resample(new Float32Array([0.3, 0.3, 0.3, 0.6, 0.6, 0.6]), 48_000, 16_000);
    assert.equal(out.length, 2);
    assert.ok(Math.abs(out[0]! - 0.3) < 1e-6 && Math.abs(out[1]! - 0.6) < 1e-6);
  });

  it("resamples 8 kHz → 16 kHz without silence", () => {
    const out = resample(new Float32Array([0.5, 0.5]), 8_000, 16_000);
    assert.equal(out.length, 4);
    assert.ok(out.every((v) => v === 0.5));
  });

  it("writes a valid 16-bit mono WAV header", () => {
    const bytes = encodeWav(new Float32Array([0, 1, -1]), 16_000);
    const view = new DataView(bytes.buffer);
    const text = (o: number) => String.fromCharCode(...bytes.slice(o, o + 4));
    assert.equal(text(0), "RIFF");
    assert.equal(text(8), "WAVE");
    assert.equal(view.getUint16(22, true), 1); // mono
    assert.equal(view.getUint32(24, true), 16_000);
    assert.equal(view.getUint32(40, true), 6); // 3 samples × 2 bytes
    assert.equal(view.getInt16(46, true), 32767);
    assert.equal(view.getInt16(48, true), -32768);
  });

  it("makes upload WAVs at 16 kHz with the right duration", () => {
    const second = new Float32Array(48_000).fill(0.1);
    const wav = toUploadWav([second], 48_000);
    assert.equal(wav.durationMs, 1000);
    assert.equal(wav.bytes.length, 44 + 16_000 * 2);
  });

  it("level meter: silence 0, loud 1", () => {
    assert.equal(level(new Float32Array(100)), 0);
    assert.equal(level(new Float32Array(100).fill(1)), 1);
  });
});
