// One function per backend endpoint. Components call these instead of fetch().
import { apiBlob, apiFetch } from "./client";
import type {
  AttemptAnswerDto,
  AttemptMode,
  AttemptResultDto,
  CourseDetailDto,
  CourseSummaryDto,
  LanguageDto,
  LessonDto,
  ProfileUpdate,
  PlacementResultDto,
  PlacementStartDto,
  ProgressSummaryDto,
  RecommendationDto,
  ReviewDto,
  ReviewSessionDto,
  AchievementDto,
  StartLessonDto,
  StatsDto,
  TutorAskBody,
  TutorContextDto,
  TutorConversationDto,
  TutorMessageDto,
  UserDto,
  ConversationDto,
  ConversationSessionDto,
  ListeningAnswerDto,
  ListeningQuestionDto,
  ScenarioId,
  ScenarioListDto,
  SpeakingEvaluationDto,
  SpeechPhraseDto,
  SpeechStatusDto,
  TranscriptionDto,
  TutorLevel,
} from "./types";

type AuthResponse = { user: UserDto; token: string };

// ── Auth ──
export const registerAccount = (body: { name: string; email: string; password: string }) =>
  apiFetch<AuthResponse>("/auth/register", { method: "POST", body });

export const logIn = (body: { email: string; password: string }) =>
  apiFetch<AuthResponse>("/auth/login", { method: "POST", body });

export const logOut = () => apiFetch<{ message: string }>("/auth/logout", { method: "POST" });

// ── Current user ──
export const getMe = () => apiFetch<{ user: UserDto }>("/me");

export const updateMe = (body: ProfileUpdate) =>
  apiFetch<{ user: UserDto }>("/me", { method: "PATCH", body });

// ── Content ──
export const getLanguages = () => apiFetch<{ languages: LanguageDto[] }>("/languages");

export const getCourses = (languageCode?: string) =>
  apiFetch<{ courses: CourseSummaryDto[] }>(
    languageCode ? `/courses?languageCode=${encodeURIComponent(languageCode)}` : "/courses",
  );

export const getCourse = (courseId: string) =>
  apiFetch<{ course: CourseDetailDto }>(`/courses/${encodeURIComponent(courseId)}`);

export const getLesson = (lessonId: string) =>
  apiFetch<{ lesson: LessonDto }>(`/lessons/${encodeURIComponent(lessonId)}`);

/** Starts or resumes a lesson. `restart` starts the run over from the first exercise. */
export const startLesson = (lessonId: string, restart = false) =>
  apiFetch<StartLessonDto>(`/lessons/${encodeURIComponent(lessonId)}/start`, {
    method: "POST",
    body: { restart },
  });

export const submitAttempt = (
  exerciseId: string,
  answer: AttemptAnswerDto,
  mode: AttemptMode = "lesson",
) =>
  apiFetch<AttemptResultDto>(`/exercises/${encodeURIComponent(exerciseId)}/attempt`, {
    method: "POST",
    body: { answer, mode },
  });

// ── Progress ──
export const getProgress = () => apiFetch<{ progress: ProgressSummaryDto }>("/progress");

// ── Review ──
export const getReview = (languageCode: string) =>
  apiFetch<{ review: ReviewDto }>(`/review?languageCode=${encodeURIComponent(languageCode)}`);

export const getReviewSession = (languageCode: string) =>
  apiFetch<{ session: ReviewSessionDto }>(
    `/review/session?languageCode=${encodeURIComponent(languageCode)}`,
  );

// ── Gamification ──
export const getStats = () => apiFetch<{ stats: StatsDto }>("/stats");

export const getAchievements = () =>
  apiFetch<{ unlockedCount: number; total: number; achievements: AchievementDto[] }>(
    "/achievements",
  );

export const getRecommendations = (languageCode: string) =>
  apiFetch<{ languageCode: string; recommendations: RecommendationDto[]; rules: string[] }>(
    `/recommendations?languageCode=${encodeURIComponent(languageCode)}`,
  );

// ── Placement test ──
export const startPlacement = (languageCode: string) =>
  apiFetch<PlacementStartDto>("/placement/start", { method: "POST", body: { languageCode } });

export const answerPlacement = (testId: string, questionId: string, answer: AttemptAnswerDto) =>
  apiFetch<{ testId: string; answered: number; total: number; completed: boolean }>(
    "/placement/answer",
    { method: "POST", body: { testId, questionId, answer } },
  );

export const getPlacementResult = (testId: string) =>
  apiFetch<{ result: PlacementResultDto }>(
    `/placement/result?testId=${encodeURIComponent(testId)}`,
  );

export const decidePlacement = (testId: string, choice: "recommended" | "beginning") =>
  apiFetch<{
    testId: string;
    status: string;
    chosenUnit: number;
    startLessonId: string | null;
    lessonsUnlocked: number;
  }>("/placement/decide", { method: "POST", body: { testId, choice } });

// ── AI tutor (Phase 6) ──
export const getTutorContext = (params: { language?: string; lessonId?: string }) => {
  const query = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();
  return apiFetch<TutorContextDto>(`/ai/tutor/context${query ? `?${query}` : ""}`);
};

export const askTutor = (body: TutorAskBody) =>
  apiFetch<{ conversation: TutorConversationDto; messages: TutorMessageDto[] }>("/ai/tutor", {
    method: "POST",
    body,
  });

export const getTutorConversations = (language?: string) =>
  apiFetch<{ conversations: TutorConversationDto[] }>(
    `/ai/conversations${language ? `?language=${encodeURIComponent(language)}` : ""}`,
  );

export const getTutorConversation = (id: string) =>
  apiFetch<{ conversation: TutorConversationDto & { messages: TutorMessageDto[] } }>(
    `/ai/conversations/${encodeURIComponent(id)}`,
  );

export const deleteTutorConversation = (id: string) =>
  apiFetch<{ message: string }>(`/ai/conversations/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

// ── Speech & conversation (Phase 7) ──
const SPEECH_TIMEOUT_MS = 70_000; // speech-to-text + AI notes (with retries on a busy free tier)
const AI_TIMEOUT_MS = 90_000;

const query = (params: Record<string, string | number | undefined>) => {
  const text = new URLSearchParams(
    Object.entries(params)
      .filter(
        (entry): entry is [string, string | number] => entry[1] !== undefined && entry[1] !== "",
      )
      .map(([key, value]) => [key, String(value)]),
  ).toString();
  return text ? `?${text}` : "";
};

export const getSpeechStatus = () => apiFetch<{ status: SpeechStatusDto }>("/speech/status");

/** WAV audio of a course phrase, a listening question, or a short text. */
export const getSpeechAudio = (
  source: { vocabularyItemId: string } | { question: string } | { text: string; language: string },
) => apiBlob(`/speech/tts${query(source)}`, { timeoutMs: SPEECH_TIMEOUT_MS });

export const getSpeakingPhrases = (language?: string) =>
  apiFetch<{
    language: { code: string; name: string };
    level: TutorLevel;
    phrases: SpeechPhraseDto[];
  }>(`/speech/phrases${query({ language })}`);

/** The recording goes in the multipart field "audio" (WAV). */
function audioForm(audio: Blob, fields: Record<string, string | undefined>) {
  const form = new FormData();
  form.append("audio", audio, "recording.wav");
  for (const [key, value] of Object.entries(fields)) if (value) form.append(key, value);
  return form;
}

export const transcribeAudio = (
  audio: Blob,
  fields: { language?: string; source: "recorded" | "uploaded" },
) =>
  apiFetch<TranscriptionDto>("/speech/transcribe", {
    method: "POST",
    body: audioForm(audio, fields),
    timeoutMs: SPEECH_TIMEOUT_MS,
  });

export const evaluateSpeaking = (
  audio: Blob,
  fields: { language?: string; vocabularyItemId: string; source: "recorded" | "uploaded" },
) =>
  apiFetch<SpeakingEvaluationDto>("/speech/evaluate", {
    method: "POST",
    body: audioForm(audio, fields),
    timeoutMs: SPEECH_TIMEOUT_MS,
  });

export const getListeningRound = (language?: string, count?: number) =>
  apiFetch<{ language: { code: string; name: string }; questions: ListeningQuestionDto[] }>(
    `/speech/listening${query({ language, count })}`,
  );

export const checkListeningAnswer = (token: string, choiceId: string) =>
  apiFetch<ListeningAnswerDto>("/speech/listening/answer", {
    method: "POST",
    body: { token, choiceId },
  });

export const getScenarios = (language?: string) =>
  apiFetch<ScenarioListDto>(`/ai/conversation/scenarios${query({ language })}`);

export const startConversation = (body: { scenario: ScenarioId; language?: string }) =>
  apiFetch<ConversationDto>("/ai/conversation", { method: "POST", body, timeoutMs: AI_TIMEOUT_MS });

export const getConversationSessions = (language?: string) =>
  apiFetch<{ sessions: ConversationSessionDto[] }>(`/ai/conversation${query({ language })}`);

export const getConversationSession = (id: string) =>
  apiFetch<ConversationDto>(`/ai/conversation/${encodeURIComponent(id)}`);

export const replyToConversation = (
  id: string,
  body: {
    text: string;
    inputMode: "text" | "voice";
    audio?: { durationMs?: number; bytes?: number; sttModel?: string };
  },
) =>
  apiFetch<ConversationDto>(`/ai/conversation/${encodeURIComponent(id)}/reply`, {
    method: "POST",
    body,
    timeoutMs: AI_TIMEOUT_MS,
  });

export const endConversation = (id: string) =>
  apiFetch<ConversationDto>(`/ai/conversation/${encodeURIComponent(id)}/end`, {
    method: "POST",
    timeoutMs: AI_TIMEOUT_MS,
  });

export const deleteConversationSession = (id: string) =>
  apiFetch<{ message: string }>(`/ai/conversation/${encodeURIComponent(id)}`, { method: "DELETE" });
