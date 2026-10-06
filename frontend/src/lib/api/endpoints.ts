// One function per backend endpoint. Components call these instead of fetch().
import { apiFetch } from "./client";
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
