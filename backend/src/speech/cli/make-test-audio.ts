// npx tsx src/speech/cli/make-test-audio.ts   (from backend/)
// Re-creates the small test recordings in postman/audio/ used by Postman and the API tests:
//   speech-sample.wav  2.2 s, two voice-like sounds (passes the audio checks; NOT real speech —
//                      with STT_PROVIDER=mock it "transcribes" to the language's word for hello)
//   silence.wav        1.5 s of digital silence      → 422 AUDIO_SILENT
//   too-short.wav      0.2 s                          → 422 AUDIO_TOO_SHORT
//   not-audio.txt      a text file                    → 415 UNSUPPORTED_AUDIO_FORMAT
// For a real transcription test, record yourself in the app, or save the WAV from
// GET /api/speech/tts in Postman (Send and Download) and upload that.
import { writeFileSync } from "node:fs";
import { encodeWav } from "../wav.ts";

const RATE = 16_000;
const dir = new URL("../../../../postman/audio/", import.meta.url);

function voiced(seconds: number, bursts: Array<[number, number]>) {
  const samples = new Float32Array(Math.round(RATE * seconds));
  let seed = 7;
  const noise = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648 - 0.5;
  for (let i = 0; i < samples.length; i++) {
    const t = i / RATE;
    const on = bursts.some(([a, b]) => t >= a && t < b);
    // A vowel-like sound: 140 Hz with harmonics and a slow loudness swell, plus room noise.
    const swell = 0.5 - 0.5 * Math.cos(2 * Math.PI * ((t * 4) % 1));
    const voice =
      0.18 * Math.sin(2 * Math.PI * 140 * t) +
      0.09 * Math.sin(2 * Math.PI * 280 * t) +
      0.05 * Math.sin(2 * Math.PI * 700 * t);
    samples[i] = (on ? voice * (0.4 + 0.6 * swell) : 0) + noise() * 0.003;
  }
  return encodeWav(samples, RATE);
}

writeFileSync(
  new URL("speech-sample.wav", dir),
  voiced(2.2, [
    [0.3, 0.9],
    [1.05, 1.9],
  ]),
);
writeFileSync(new URL("silence.wav", dir), encodeWav(new Float32Array(RATE * 1.5), RATE));
writeFileSync(new URL("too-short.wav", dir), voiced(0.2, [[0, 0.2]]));
writeFileSync(new URL("not-audio.txt", dir), "This is not a recording.\n");
console.log("Wrote postman/audio/{speech-sample,silence,too-short}.wav and not-audio.txt");
