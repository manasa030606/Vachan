// Speech — requires login. API keys never leave the server; recordings are not stored.
//   GET  /api/speech/status                 what is available (providers, limits) — no secrets
//   GET  /api/speech/tts                    WAV audio (?vocabularyItemId=… | ?question=<token> | ?language=&text=)
//   POST /api/speech/transcribe             multipart: audio (WAV) [+ language, source] → transcript
//   POST /api/speech/evaluate               multipart: audio + vocabularyItemId | expectedText → feedback
//   GET  /api/speech/phrases                course words/phrases to practise (?language=te)
//   GET  /api/speech/attempts               my recent speaking attempts
//   GET  /api/speech/listening              a listening round (?language=te&count=6)
//   POST /api/speech/listening/answer       { token, choiceId } → correct? + answer
import { Router, type RequestHandler } from "express";
import multer from "multer";
import { env } from "../config/env.ts";
import { SPEECH_CONFIG } from "../config/speech.ts";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { RateLimiter, rateLimitByUser } from "../middleware/rate-limit.ts";
import {
  attemptsQuerySchema,
  evaluateFieldsSchema,
  languageQuerySchema,
  listeningAnswerSchema,
  listeningQuerySchema,
  transcribeFieldsSchema,
  ttsQuerySchema,
} from "../schemas/speech.schemas.ts";
import {
  checkListeningAnswer,
  createListeningRound,
  questionItemId,
} from "../speech/listening.service.ts";
import {
  evaluateSpeaking,
  getSpeechStatus,
  listSpeakingPhrases,
  listSpeechAttempts,
  transcribeRecording,
} from "../speech/speech.service.ts";
import { getSpeechAudio } from "../speech/tts.service.ts";

export const speechRouter = Router();

/** One audio file in the field "audio", kept in memory (never written to disk), max 2 MB. */
export const audioUpload: RequestHandler = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: SPEECH_CONFIG.maxUploadBytes, files: 1, fields: 12, fieldSize: 4096 },
}).single("audio");

const speechLimiter = new RateLimiter([
  { name: "minute", limit: env.SPEECH_RATE_LIMIT_PER_MINUTE, windowMs: 60_000 },
  { name: "day", limit: env.SPEECH_RATE_LIMIT_PER_DAY, windowMs: 24 * 60 * 60_000 },
]);
// Cached audio is cheap; this only stops scripts from generating thousands of new clips.
const ttsLimiter = new RateLimiter([
  { name: "minute", limit: 60, windowMs: 60_000 },
  { name: "day", limit: 1000, windowMs: 24 * 60 * 60_000 },
]);

speechRouter.use(requireAuth);

speechRouter.get("/status", (_req, res) => {
  res.json({ status: getSpeechStatus() });
});

speechRouter.get(
  "/tts",
  // Validate first, so invalid requests don't count towards the rate limit.
  (req, _res, next) => {
    ttsQuerySchema.parse(req.query);
    next();
  },
  rateLimitByUser(ttsLimiter, "listening"),
  async (req, res) => {
    const { question, ...query } = ttsQuerySchema.parse(req.query);
    const audio = await getSpeechAudio(
      question ? { vocabularyItemId: questionItemId(question) } : query,
    );
    res.setHeader("Content-Type", audio.mimeType);
    res.setHeader("Cache-Control", "private, max-age=86400");
    res.setHeader("X-Audio-Source", audio.source);
    res.setHeader("X-Audio-Duration-Ms", String(audio.durationMs));
    res.send(audio.audio);
  },
);

speechRouter.post(
  "/transcribe",
  audioUpload,
  (req, _res, next) => {
    req.body = transcribeFieldsSchema.parse(req.body ?? {});
    next();
  },
  rateLimitByUser(speechLimiter, "speaking"),
  async (req, res) => {
    res.json(await transcribeRecording(getUserId(req), req.file, req.body));
  },
);

speechRouter.post(
  "/evaluate",
  audioUpload,
  (req, _res, next) => {
    req.body = evaluateFieldsSchema.parse(req.body ?? {});
    next();
  },
  rateLimitByUser(speechLimiter, "speaking"),
  async (req, res) => {
    res.json(await evaluateSpeaking(getUserId(req), req.file, req.body));
  },
);

speechRouter.get("/phrases", async (req, res) => {
  const { language } = languageQuerySchema.parse(req.query);
  res.json(await listSpeakingPhrases(getUserId(req), language));
});

speechRouter.get("/attempts", async (req, res) => {
  const { language, limit } = attemptsQuerySchema.parse(req.query);
  res.json({ attempts: await listSpeechAttempts(getUserId(req), language, limit) });
});

speechRouter.get("/listening", async (req, res) => {
  res.json(await createListeningRound(getUserId(req), listeningQuerySchema.parse(req.query)));
});

speechRouter.post("/listening/answer", async (req, res) => {
  res.json(await checkListeningAnswer(listeningAnswerSchema.parse(req.body ?? {})));
});
