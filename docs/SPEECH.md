# Vachan — Speaking, listening & conversation (Phase 7)

Phase 7 adds audio to Vachan: **listening** (play / replay / slower, listening comprehension), **speech-to-text** (record or upload → transcript), a **speaking exercise** with honest, separated feedback, and **role-play conversations** in six everyday situations, grounded in the course vocabulary and the RAG knowledge base.

Everything runs on the free Gemini key the tutor already uses — no new account is needed.

```
LISTENING        phrase ─► GET /api/speech/tts ─► cached WAV (AudioClip) ─► Play · Replay · 1× / 0.75× / 0.5×
                                     └─ no server audio? ─► browser voice (speechSynthesis), if the device has one

SPEAKING         expected phrase (course word/phrase)
                   ─► microphone (AudioWorklet) ─► 16 kHz mono WAV ─► POST /api/speech/evaluate (multipart)
                   ─► audio checks (no AI): too short / silent / no speech / too long → 422 before any AI call
                   ├─► speech-to-text (Gemini; never told the expected phrase) ─► transcript
                   │      └─► 1. CONTENT MATCH   transcript vs phrase (edit distance, word by word) — no AI
                   ├─► 2. PRONUNCIATION  AI listening notes (Gemini, experimental) — or "not supported"
                   └─► 3. FLUENCY        timing of sound and silence (pauses, start delay, speed) — no AI
                   ─► feedback + SpeechAttempt row (the recording itself is NOT stored)

CONVERSATION     scenario + level + language
                   ─► course vocabulary (VocabularyItem topics) + RAG notes (knowledge-base/<lang>/conversation.md …)
                   ─► partner prompt ─► Gemini ─► JSON {reply, feedback, suggestions, sourceIds} ─► checks
                   ─► learner replies by typing, or by voice (transcribe → check/edit → send)
                   ─► … up to 8 replies ─► end ─► summary (counted stats + AI review grounded in the chat)
```

| Where                                                    | What                                                                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `backend/src/speech/wav.ts`                              | WAV read/write, resampling (no library)                                                                    |
| `backend/src/speech/audio-analysis.ts`                   | Energy-based voice activity detection: speech time, pauses, loudness, clipping, noise → audio issues       |
| `backend/src/speech/audio-input.ts`                      | Upload checks (missing / not WAV / broken / silent / too short / too long) → 16 kHz mono WAV               |
| `backend/src/speech/stt.ts`                              | Speech-to-text providers: `gemini`, `groq` (Whisper), `mock`                                               |
| `backend/src/speech/tts.ts` + `tts.service.ts`           | Text-to-speech providers (`gemini`, `mock`, or `browser`) + database cache                                 |
| `backend/src/speech/text-compare.ts`                     | Content match: normalisation, edit distance, word alignment, verdicts                                      |
| `backend/src/speech/fluency.ts`                          | Timing-based fluency feedback                                                                              |
| `backend/src/speech/pronunciation.ts`                    | AI pronunciation notes (Gemini only, experimental)                                                         |
| `backend/src/speech/listening.service.ts`                | Listening rounds; answers hidden in encrypted tokens (`question-token.ts`)                                 |
| `backend/src/speech/speech.service.ts`                   | Transcribe / evaluate / phrases / attempts / status                                                        |
| `backend/src/ai/conversation/`                           | Role-play: `conversation.service.ts`, `prompt.ts`, `reply-parser.ts` (checks)                              |
| `backend/src/config/speech.ts`, `config/conversation.ts` | All limits, thresholds, scenarios and level styles in one place                                            |
| `backend/knowledge-base/<lang>/conversation.md`          | New RAG notes: the 6 situations × 6 languages                                                              |
| `backend/src/routes/speech.routes.ts`, `ai.routes.ts`    | `/api/speech/*` and `/api/ai/conversation/*`                                                               |
| `backend/src/speech/cli/`                                | `speech:check`, `speech:eval`, `speech:prefetch`, `make-test-audio.ts`                                     |
| `frontend/src/components/speech/`                        | `/speak` page: Listen · Speak · Conversation tabs, recorder, mic button, audio player, feedback, role-play |
| `frontend/src/lib/audio/`                                | WAV encoding/resampling (unit-tested) and file conversion for uploads                                      |
| `postman/audio/`                                         | Sample WAVs for Postman and the API tests                                                                  |

---

## 1. How to run the speech system (local)

```bash
cd ~/Desktop/Vachan
npm install                          # adds multer (audio uploads)
npm run db:migrate -w backend        # applies 20261009090000_phase7_speech_conversation
npm run rag:index -w backend         # embeds the 6 new conversation.md files (430 chunks)
npm run speech:check -w backend      # TTS → STT round trip with your key (no microphone needed)
npm run dev                          # backend :4000 + frontend :3000
```

Open <http://localhost:3000/speak> (or **Speak** in the menu), allow the microphone when the browser asks, and try the three tabs. Words in lesson introductions also have a **Listen** button.

`speech:check` prints, without showing the key:

```
   Speech-to-text  gemini · gemini-3.5-flash
   Text-to-speech  gemini · auto (newest flash TTS) · voice Kore
   1. TTS          ✅ gemini/<tts model> → 900 ms of audio, 42 KB
   2. STT          ✅ "నమస్కారం"
   3. Match        ✅ match (100/100)
   4. Notes        ✅ 2 note(s) — "…"
```

Optional: `npm run speech:prefetch -w backend -- --language te` generates and caches the audio for every Telugu course word and phrase, so a demo plays instantly.

## 2. Environment variables and API keys

**Required API key:** only `GEMINI_API_KEY` (free, <https://aistudio.google.com/apikey>) — the same one as the tutor. It stays in `backend/.env` on the server; the browser only ever talks to the Vachan backend.

| Variable                                          | Default                                | Meaning                                                                               |
| ------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`                                  | –                                      | Speech-to-text, text-to-speech, pronunciation notes and the role-play partner         |
| `STT_PROVIDER`                                    | = `LLM_PROVIDER`                       | `gemini` · `groq` (Whisper large v3, needs `GROQ_API_KEY`) · `mock` (test double)     |
| `STT_MODEL`                                       | the tutor's model (`gemini-3.5-flash`) | Any Gemini model that accepts audio                                                   |
| `TTS_PROVIDER`                                    | `gemini` if `LLM_PROVIDER=gemini`      | `gemini` · `browser` (no server audio — the learner's browser voice) · `mock` (beeps) |
| `TTS_MODEL`                                       | newest `…flash…tts` model of the key   | Picked from the key's model list (`speech:check -- --models`)                         |
| `TTS_VOICE`                                       | `Kore`                                 | A Gemini prebuilt voice                                                               |
| `SPEECH_TIMEOUT_MS`                               | `30000`                                | Per speech-to-text / text-to-speech call                                              |
| `PRONUNCIATION_NOTES`                             | `true`                                 | `false` = no second AI call; content + fluency feedback only                          |
| `SPEECH_RATE_LIMIT_PER_MINUTE` / `_PER_DAY`       | `10` / `150`                           | Transcribe + evaluate requests per learner                                            |
| `CONVERSATION_RATE_LIMIT_PER_MINUTE` / `_PER_DAY` | `8` / `150`                            | Role-play starts + replies per learner                                                |
| `RAG_ENABLED`                                     | on locally, off in production          | Off → the role-play partner uses only the course vocabulary (no notes)                |

Frontend: nothing new. Never put a key in `frontend/` or a `NEXT_PUBLIC_*` variable.

## 3. Browser permissions

- **Microphone**: the browser asks the first time you press the microphone. Choose **Allow**.
  - Blocked by mistake? Chrome/Edge: click the icon left of the address → _Microphone_ → _Allow_, reload. Safari: _Safari → Settings → Websites → Microphone_. Firefox: the microphone icon in the address bar.
  - macOS also needs _System Settings → Privacy & Security → Microphone_ → your browser ✅.
  - The app shows a clear message for each problem: blocked, no microphone, microphone busy, insecure page, unsupported browser.
- **Secure page**: browsers only allow the microphone on `https://` or `http://localhost`. The deployed Vercel site is https. Opening the dev server from another device as `http://192.168.x.x:3000` will **not** work — use localhost or the deployed site.
- **Audio playback** starts only after a click (browser autoplay rules) — every Play button is a click.
- No microphone? Every recorder has **“or upload a recording”** (wav, mp3, m4a, ogg, webm…). The browser converts the file to WAV before uploading.

## 4. Backend configuration (what the server accepts)

| Setting                | Value                                                                                       | Where              |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------------ |
| Upload format          | `multipart/form-data`, one file in the field **`audio`**, WAV (PCM 8/16/24/32-bit or float) | `speech.routes.ts` |
| Max upload             | 2 MB (≈ 60 s of 16 kHz WAV) → `413 AUDIO_TOO_LARGE`                                         | `config/speech.ts` |
| Duration               | 0.3 s – 30 s (the app stops recording at 15 s)                                              | `config/speech.ts` |
| Storage of recordings  | **none** — memory only (`multer.memoryStorage()`), discarded after the request              | privacy by design  |
| What is sent to Gemini | the recording converted to 16 kHz mono 16-bit WAV                                           | `audio-input.ts`   |
| TTS cache              | `AudioClip` table, key = sha256(provider/model/voice + language + text)                     | `tts.service.ts`   |

Why WAV and not the browser's own MediaRecorder format (WebM/Ogg/MP4)? WAV is uncompressed, so the server can **measure** the audio itself (silence, pauses, loudness) without ffmpeg, and it is the same in every browser and accepted by every speech-to-text provider. The recorder (`use-recorder.ts`) copies raw samples with an AudioWorklet and `lib/audio/wav.ts` writes a 16 kHz WAV (32 KB per second).

## 5. Speech-to-text

- **Gemini** (default) listens to the WAV with a strict prompt: write exactly what was said, including mistakes; never correct, translate or add words; write the language in its own script; JSON `{transcript, heard}`. The prompt **never contains the expected phrase**, so a mistake can't be "corrected" into the right answer.
- **Groq Whisper** (`STT_PROVIDER=groq`): a dedicated speech-to-text model; the language code is passed (hi, te, ta, ml, kn, bn). It can't give pronunciation notes.
- Before any provider call, the audio is checked (`audio-analysis.ts`): frames of 20 ms, background noise = quietest 10 %, sound = clearly louder than the noise; tiny gaps inside words are bridged, clicks dropped. Errors (no AI call, no quota used): `AUDIO_TOO_SHORT`, `AUDIO_TOO_LONG`, `AUDIO_SILENT`, `NO_SPEECH_DETECTED`. Warnings (still transcribed, shown to the learner): `AUDIO_CLIPPED`, `AUDIO_TOO_QUIET`, `AUDIO_NOISY`.
- An empty transcript from `/transcribe` → `422 NO_WORDS_HEARD`; in `/evaluate` it becomes the verdict _nothing-heard_.

## 6. Speaking evaluation — three separate parts

The API and the UI keep them apart on purpose, because they measure different things.

| Part                       | How                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | What it does **not** tell                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **1. Content match**       | Text only, no AI. Both texts normalised (NFC, no punctuation, no zero-width joiners). **Score** = 1 − edit distance / length, on code points, spaces ignored (0–100). **Words** aligned like a diff: right / almost (≥ 60 %) / different / not heard + extra words. **Verdict**: match ≥ 90, close ≥ 70, partial ≥ 40, else different; any wrong or missing word caps it at _partial_. Latin-letter transcripts are compared with the romanization (long vowels folded). | How native the pronunciation is — speech-to-text often writes the right word for an imperfect pronunciation. |
| **2. Pronunciation notes** | _Where supported_ (Gemini): a second call, in parallel, with the audio and the expected phrase. Up to 3 specific observations (vowel length, retroflex vs dental, aspiration…), an overall sentence, and the model's own "confident" flag. Words that aren't in the phrase are removed. Labelled **"AI · experimental — not a measured score"**. Whisper / mock / `PRONUNCIATION_NOTES=false` → _Not available_ with the reason.                                         | It is an AI impression, not phoneme-level scoring; it can be wrong.                                          |
| **3. Fluency**             | Timing only, no AI: speaking time, start delay (> 2 s mentioned), pauses ≥ 400 ms, speed in letters (aksharas) per second. Rating: smooth / some pauses / hesitant.                                                                                                                                                                                                                                                                                                      | Rhythm, intonation, accent, naturalness.                                                                     |

A high content match therefore means _"speech-to-text recognised the right words"_, never _"perfect pronunciation"_ — the UI says this under the score.

## 7. Listening

- **Play / Replay / speed** (`phrase-audio.tsx`): 1×, 0.75×, 0.5× (pitch kept). Every control has visible text.
- **Listening comprehension** (`GET /api/speech/listening`): 6 questions from the course words/phrases — _"What does it mean?"_ (English options) or _"Which one did you hear?"_ (native-script options, a light dictation). Options are labelled a–d; the question carries an **encrypted token** (AES-256-GCM, key derived from `JWT_SECRET`) used to fetch its audio and check the answer — so neither the text nor a readable id (`te-v16-hello`) reaches the browser before answering.
- **Browser voice fallback**: if the server can't make audio (`TTS_PROVIDER=browser`, quota used up, busy…), the player uses `speechSynthesis` when the device has a voice for the language (common for Hindi; varies for the others). Listening-quiz audio has no fallback (its text is secret).

## 8. Conversation (role-play) architecture

**Scenarios** (`config/conversation.ts`): introductions · restaurant · shopping · travel · directions · everyday conversation. Each has a partner role, a learner goal, a retrieval query, a knowledge-base topic and course-vocabulary topics.

**Inputs to every partner line**: learner **level** (self-assessment → beginner / elementary / intermediate), **target language** and script, **scenario** (role + goal), **vocabulary** (up to 18 course words/phrases of the scenario's topics, from the database), **RAG notes** (below), the conversation so far (last 12 lines) and the learner's new line.

**Level-appropriate language** (`levelStyle`): beginner = one sentence of 2–6 words + one simple question, mostly course words; elementary = ≤ 12 words; intermediate = natural, ≤ 25 words. Romanization and an English translation come with every line (English can be hidden).

**Learner feedback on each reply**: understood (yes/no), a correction in the target script when the AI is sure (labelled _AI suggestion_), one short tip, and 2 suggested next replies.

**Checks on the AI's reply** (`reply-parser.ts`): valid JSON; the reply must be in the target script; source numbers must point at notes that were in the prompt; suggestions and corrections in English are dropped; a leaked-rules marker rejects the reply; one retry, then `502 AI_REPLY_UNREADABLE`. The **word coverage** (share of the line's words found in the vocabulary / notes / chat) is stored per line for evaluation.

**Safety**: learner text is sanitised (NFC, control characters, 300 characters) and checked for prompt-injection patterns → the partner _refuses_ (repeats the last line, "let's stay in the role-play") **without an AI call**. Learner text sits in delimited `<reply>` blocks; fake delimiters are removed.

**End-of-session summary**: counted, no AI — replies, spoken replies, understood replies, corrections, course words used, goal reached, duration; plus an **AI review** (what went well, what to practise, useful phrases, encouragement). Useful phrases must appear in the conversation, the corrections or the notes, otherwise they are removed. If the review fails, the statistics are still shown.

## 9. RAG integration

- New knowledge-base files `backend/knowledge-base/{hi,te,ta,ml,kn,bn}/conversation.md`: one section per situation (useful sentences with script, romanization and meaning), topics `introductions`, `restaurant`, `shopping`, `travel`, `directions`, `everyday-conversation`. 72 documents → 430 chunks after `rag:index`. `rag:eval` still passes all thresholds.
- At the start of a role-play: `searchKnowledge({query: scenario.retrievalQuery, language, level, topic: scenario.topic, limit: 4})`. On every reply: the same + the learner's line (so "I want water" pulls the food & drink notes too).
- Only notes with similarity ≥ 0.81 (the tutor's threshold) go into the prompt as numbered `<notes>`; the partner cites them in `sourceIds`; cited notes are returned as `references` (shown as _Based on N notes_ under the line) and stored with the turn, together with the retrieval query and best similarity (`ConversationTurn.context`).
- With RAG off (Render free plan) or a search error, the partner continues with the course vocabulary only (`ragUsed: false`), and the UI says so.

## 10. API

All endpoints require login (`Authorization: Bearer <token>` or the website cookie).

| Method | Path                             | Body / query                                                                                                                        | Returns                                                                                                   |
| ------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| GET    | `/api/speech/status`             | –                                                                                                                                   | providers, limits, locales (no secrets)                                                                   |
| GET    | `/api/speech/tts`                | `?vocabularyItemId=te-v16-hello` · `?question=<token>` · `?language=te&text=…`                                                      | `audio/wav` bytes; headers `X-Audio-Source: cache\|generated`                                             |
| POST   | `/api/speech/transcribe`         | **multipart**: `audio` (file) · `language?` · `source?` (`recorded`\|`uploaded`)                                                    | `{ transcript, language, model, audio{…}, warnings[], latencyMs }`                                        |
| POST   | `/api/speech/evaluate`           | **multipart**: `audio` · `vocabularyItemId` **or** `expectedText` (+`romanization`, `meaning`) · `language?` · `level?` · `source?` | `{ attemptId, expected, transcript, content, pronunciation, fluency, warnings, audio, model, latencyMs }` |
| GET    | `/api/speech/phrases`            | `?language=te`                                                                                                                      | course words/phrases + my best score                                                                      |
| GET    | `/api/speech/attempts`           | `?language=te&limit=20`                                                                                                             | my recent attempts (no audio)                                                                             |
| GET    | `/api/speech/listening`          | `?language=te&count=6`                                                                                                              | `{ questions: [{ token, type, instruction, options[{id,label}] }] }`                                      |
| POST   | `/api/speech/listening/answer`   | `{ "token": "…", "choiceId": "b" }`                                                                                                 | `{ correct, correctChoiceId, answer{script,romanization,meaning} }`                                       |
| GET    | `/api/ai/conversation/scenarios` | `?language=te`                                                                                                                      | 6 scenarios + key words, level, availability                                                              |
| POST   | `/api/ai/conversation`           | `{ "scenario": "restaurant", "language"?: "te", "level"?: "beginner" }` → **201**                                                   | `{ session, turns: [partner's first line] }`                                                              |
| GET    | `/api/ai/conversation`           | `?language=te`                                                                                                                      | my role-plays                                                                                             |
| GET    | `/api/ai/conversation/:id`       | –                                                                                                                                   | `{ session, turns }`                                                                                      |
| POST   | `/api/ai/conversation/:id/reply` | `{ "text": "…", "inputMode": "text"\|"voice", "audio"?: { durationMs, bytes, sttModel } }`                                          | `{ session, turns: [my line + feedback, partner line] }`                                                  |
| POST   | `/api/ai/conversation/:id/end`   | –                                                                                                                                   | `{ session (status ended, summary), turns }`                                                              |
| DELETE | `/api/ai/conversation/:id`       | –                                                                                                                                   | `{ message }`                                                                                             |

**Exact multipart request** (what the app and Postman send):

```http
POST /api/speech/evaluate HTTP/1.1
Authorization: Bearer <token>
Content-Type: multipart/form-data; boundary=----vachan

------vachan
Content-Disposition: form-data; name="audio"; filename="recording.wav"
Content-Type: audio/wav

<binary WAV bytes>
------vachan
Content-Disposition: form-data; name="vocabularyItemId"

te-v16-hello
------vachan
Content-Disposition: form-data; name="language"

te
------vachan--
```

Same with curl (from the repo root):

```bash
TOKEN=…   # from POST /api/auth/login
curl -H "Authorization: Bearer $TOKEN" -F "audio=@postman/audio/speech-sample.wav;type=audio/wav" \
     -F language=te -F vocabularyItemId=te-v16-hello http://localhost:4000/api/speech/evaluate
curl -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/speech/tts?vocabularyItemId=te-v16-hello" -o hello.wav
```

Example `/evaluate` response (shortened):

```json
{
  "expected": {
    "vocabularyItemId": "te-v16-hello",
    "script": "నమస్కారం",
    "romanization": "namaskaaram",
    "meaning": "Hello"
  },
  "transcript": "నమస్కారం",
  "content": {
    "score": 100,
    "verdict": "match",
    "comparedWith": "script",
    "words": [
      { "expected": "నమస్కారం", "heard": "నమస్కారం", "status": "correct", "similarity": 1 }
    ],
    "extraWords": [],
    "method": "Compares the speech-to-text transcript … not how native your pronunciation sounds."
  },
  "pronunciation": {
    "supported": true,
    "notes": [{ "word": "నమస్కారం", "tip": "Hold the long aa in kaa (namaskaaram)." }],
    "overall": "Clear and easy to understand!",
    "confident": true,
    "disclaimer": "AI listening notes — experimental. …not a measured pronunciation score."
  },
  "fluency": {
    "rating": "smooth",
    "speakingMs": 1100,
    "pauses": 0,
    "startDelayMs": 400,
    "lettersPerSecond": 3.6,
    "notes": ["No long pauses — you said it in one go."]
  },
  "warnings": [],
  "audio": {
    "source": "recorded",
    "durationMs": 2200,
    "speechMs": 1100,
    "bytes": 70444,
    "sampleRate": 16000
  }
}
```

## 11. Postman testing

Folders **14. Speech — listening & speaking** (16 requests) and **15. Conversation role-play** (12 requests); Logout moved to 16. The full collection: **137 requests, 327 assertions** (run with the mock providers: 0 failures).

Multipart requests in Postman: **Body → form-data**, key `audio` with type **File**, plus text keys (`language`, `vocabularyItemId`, …). Postman sets the `Content-Type` with the boundary itself — don't add it manually.

**Limitations of testing audio in Postman:**

1. **No microphone.** Postman can only upload existing files. The provided files (`postman/audio/`) are a voice-_like_ test signal, silence, a too-short clip and a text file — perfect for the error cases and the mock provider, but they are **not real speech**: with real Gemini the sample may give an empty transcript (`422 NO_WORDS_HEARD`) or random words.
   → For a real transcription test: run _Play phrase: TTS for a course word_ with **Send and Download**, save `hello.wav`, and upload that file — or record yourself in the app.
2. **File paths.** A collection stores only the file's path. Set _Settings → General → Working directory_ to the repo's `postman/` folder (then `audio/speech-sample.wav` is found), or click each `audio` field and choose the file again. Newman: `newman run postman/Vachan.postman_collection.json -e postman/Vachan.local.postman_environment.json --working-dir postman`.
3. **Audio responses** (`/speech/tts`) show as binary in Postman; tests check the headers. Save them with _Send and Download_ to listen.
4. **Real-AI results vary** — content/pronunciation tests only check structure; quality is measured by `npm run speech:eval`.
5. **Rate limits**: 10 speech + 8 conversation requests per minute per learner — wait a minute after `429`.

## 12. Database

Migration **`20261009090000_phase7_speech_conversation`** (created by Prisma from `schema.prisma`; applied with `npm run db:migrate -w backend` locally and `npm run db:deploy -w backend` against Neon). Never create these tables by hand.

| New model / enum      | Purpose                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AudioClip`           | TTS cache: `cacheKey` (unique sha256), `languageCode`, `text`, `provider` (`gemini/<model>/<voice>`), `mimeType`, `sampleRate`, `durationMs`, `byteSize`, `data` (bytea WAV, usually 40–200 KB), `hits`, `createdAt`, `lastUsedAt`                                                                                                                                                |
| `SpeechAttempt`       | One speaking attempt: `expectedText`, `expectedRomanization`, `vocabularyItemId?`, `transcript`, `contentScore`, `contentVerdict`, `contentMatch` (words), `fluency`, `pronunciation`, `audioIssues`, **audio metadata** (`audioSource` RECORDED/UPLOADED, `audioMimeType`, `audioBytes`, `audioDurationMs`, `audioSampleRate`, `speechMs`), `sttModel`, `latencyMs`, `createdAt` |
| `ConversationSession` | One role-play: `scenario` (enum), `level` (KnowledgeLevel), `status` ACTIVE/ENDED, `learnerTurns`, `summary` (JSON), `startedAt`, `updatedAt`, `endedAt`                                                                                                                                                                                                                          |
| `ConversationTurn`    | One line: `role` (USER/ASSISTANT), `text`, `romanization`, `translation`, `inputMode` (TEXT/VOICE), `audio` (voice metadata), `feedback`, `suggestions`, `references` (notes used), `status` (ANSWERED/REFUSED), `context` (level, retrieval query, best similarity, word coverage), `model`, `latencyMs`, `createdAt`                                                            |
| enums                 | `AudioInputSource`, `ConversationScenario`, `ConversationStatus`, `ConversationInputMode`                                                                                                                                                                                                                                                                                         |

All learner data is deleted with the user (`onDelete: Cascade`). **Recordings are never stored** — only their metadata. Check the data:

```sql
SELECT "expectedText", transcript, "contentScore", "contentVerdict", "audioSource", "audioDurationMs", "sttModel"
FROM "SpeechAttempt" ORDER BY "createdAt" DESC LIMIT 5;

SELECT "languageCode", text, "durationMs", "byteSize", hits FROM "AudioClip" ORDER BY "createdAt" DESC LIMIT 5;

SELECT s.scenario, s.status, s."learnerTurns", t.role, t."inputMode", t.text, t.translation
FROM "ConversationSession" s JOIN "ConversationTurn" t ON t."sessionId" = s.id
ORDER BY s."startedAt" DESC, t."createdAt" LIMIT 20;
```

## 13. Error handling

| Situation                                        | Where it is caught                    | What the learner sees / API code                                                                           |
| ------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Microphone denied                                | `use-recorder.ts` (`NotAllowedError`) | How to allow it in the address bar; upload still works                                                     |
| No microphone / in use / http page / old browser | `use-recorder.ts`                     | Specific message (no-microphone, busy, insecure, unsupported)                                              |
| Recording < 0.4 s                                | browser                               | "That was too short…"                                                                                      |
| No audio file                                    | server                                | `400 NO_AUDIO`                                                                                             |
| Not WAV / broken WAV / file > 2 MB               | server                                | `415 UNSUPPORTED_AUDIO_FORMAT` · `400 BAD_AUDIO` · `413 AUDIO_TOO_LARGE`                                   |
| Bad audio: silent, no speech, too short/long     | server, before any AI call            | `422 AUDIO_SILENT` · `NO_SPEECH_DETECTED` · `AUDIO_TOO_SHORT` · `AUDIO_TOO_LONG` + how to fix              |
| Noisy / quiet / distorted                        | server (warning)                      | Shown above the feedback, result still given                                                               |
| Transcription failure                            | provider errors → HTTP                | `502 LLM_FAILED`, `422 NO_WORDS_HEARD`; _Send the same recording again_ button                             |
| AI failure                                       | `llmErrorToHttp`                      | `503 LLM_UNAVAILABLE` (busy, after 2 automatic retries), `429 LLM_RATE_LIMITED`, `502 AI_REPLY_UNREADABLE` |
| Timeout                                          | server 30 s per call; browser 70–90 s | `504 LLM_TIMEOUT` / client `TIMEOUT` — Retry button                                                        |
| Network failure                                  | `client.ts`                           | `NETWORK_ERROR` "Can't reach the Vachan server" — Retry button                                             |
| TTS unavailable                                  | `use-phrase-audio.ts`                 | Browser voice, else "Audio isn't available… read the romanization"                                         |
| Pronunciation notes fail                         | `speech.service.ts`                   | The exercise still succeeds; part 2 says "unavailable right now"                                           |
| Conversation ended / full                        | server                                | `409 CONVERSATION_ENDED` / `TURN_LIMIT_REACHED` → "See my summary"                                         |
| Prompt injection in a reply                      | server                                | Partner repeats its question, note "Let's stay in the role-play" (no AI call)                              |
| Too many requests                                | `rateLimitByUser`                     | `429 RATE_LIMITED` + `Retry-After`                                                                         |

**Retry**: speech providers retry busy/5xx answers twice (1.5 s, 4 s) and use `LLM_FALLBACK_MODEL` when set; the UI keeps the last recording or message so **Retry** resends it without recording again.

## 14. Verification

```bash
npm run check                          # lint, typecheck, unit tests (speech + conversation included), build
npm run test:speech -w backend         # 18 API tests: record→transcribe→evaluate→feedback, listening, role-play (mock providers)
npm run test:api -w backend && npm run test:rag -w backend && npm run test:tutor -w backend
newman run postman/Vachan.postman_collection.json -e postman/Vachan.local.postman_environment.json --working-dir postman
npm run speech:check -w backend        # real Gemini: TTS → STT round trip + pronunciation notes
npm run speech:eval -w backend         # real Gemini (≈ 30 calls: te + hi, 2 phrases each, 3 scenarios; -- --languages te,hi,ta --phrases 3 --scenarios 6 for more) → docs/SPEECH_EVALUATION.md
```

The UI flow was tested in Chromium with a WAV file as a **fake microphone** (`--use-fake-device-for-media-stream --use-file-for-fake-audio-capture=postman/audio/speech-sample.wav`) at 1440 px and 390 px: listening round (play, replay, 0.75×, answers, result) → speaking (record, recording indicator, transcript, three feedback parts) → role-play (start, typed reply, voice reply → transcript → send, end → summary, recent sessions).

## 15. Deployment notes

- **Render**: run `npm run db:deploy -w backend` against Neon (from your Mac, as in DEPLOYMENT.md Step 2). Speech works on the free plan (no big model in memory). RAG is off there by default, so the role-play partner uses course vocabulary only and the tutor stays unavailable — set `RAG_ENABLED=true` only on a server with ≥ 1 GB RAM.
- **Render environment**: `GEMINI_API_KEY` (secret) — optional `TTS_PROVIDER=browser` if the TTS quota is too small for a public demo.
- **Neon**: TTS clips are cached in `AudioClip` (~40–200 KB each; 500 clips ≈ 50 MB of the 0.5 GB free storage). Run `speech:prefetch` against Neon to pre-generate the demo language.
- **Vercel**: nothing new; the site is https, so the microphone works.

## 16. Limitations

- **No real pronunciation scoring.** The content match compares _text_; the AI notes are an experimental impression; fluency is _timing only_. There is no phoneme alignment, no native-speaker reference model and no tone/intonation analysis.
- Speech-to-text quality for Telugu, Tamil, Kannada, Malayalam and Bengali is lower than for Hindi/English, and it is weaker on accented learner speech than on the clear synthetic speech `speech:eval` uses.
- The voice-activity detector measures loudness: background voices or music count as "speech".
- Gemini TTS free-tier quota is small (cache + `speech:prefetch` help); browser voices for South Indian languages are often missing on desktops.
- The role-play partner can still make language mistakes; corrections are labelled "AI suggestion". Word coverage is a soft check — natural replies may add a few words that are not in the notes.
- Rate limits and conversation length are per process and in memory (reset on restart).
- Recordings are not stored, so attempts can't be replayed later (privacy choice).
- No XP/streak for speaking practice yet; no admin UI for scenarios (Phase 8).

## 17. Troubleshooting

| Problem                                                                  | Fix                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LLM_RATE_LIMITED` "… requests per day for gemini-3.5-flash (free tier)" | That model's free quota for today is used up (resets at midnight Pacific ≈ 12:30 pm India). Every model has its own quota: add `LLM_FALLBACK_MODEL=gemini-3.5-flash-lite` — speech-to-text, notes, tutor and role-play then switch to it automatically on 429/503. `PRONUNCIATION_NOTES=false` halves the calls per attempt |
| `speech:check` 1. TTS `LLM_MODEL_NOT_FOUND`                              | `npm run speech:check -w backend -- --models`, then set `TTS_MODEL=` to one of the listed TTS models                                                                                                                                                                                                                        |
| TTS `LLM_RATE_LIMITED`                                                   | Daily TTS quota used up — cached phrases still play; try tomorrow or `TTS_PROVIDER=browser`                                                                                                                                                                                                                                 |
| Timeouts / 503 "high demand"                                             | Free model busy — wait, or set `LLM_FALLBACK_MODEL` / `STT_MODEL` to another flash model                                                                                                                                                                                                                                    |
| Microphone button says _blocked_                                         | Allow the microphone for localhost (section 3) and macOS privacy settings                                                                                                                                                                                                                                                   |
| Always `422 NO_SPEECH_DETECTED`                                          | Wrong input device selected in the OS, or a very quiet microphone — check the level bars while recording                                                                                                                                                                                                                    |
| Transcript in Latin letters                                              | Some models romanize; the content match then compares with the romanization (shown under the transcript)                                                                                                                                                                                                                    |
| Role-play: "notes are off"                                               | `RAG_ENABLED=false` (production default) or the index is empty — `npm run rag:index -w backend`                                                                                                                                                                                                                             |
| Postman: `audio` file not found                                          | Set Postman's working directory to `postman/`, or reselect the file in the form-data row                                                                                                                                                                                                                                    |
