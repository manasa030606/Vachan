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
  ProgressSummaryDto,
  ReviewDto,
  ReviewSessionDto,
  StartLessonDto,
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
