// One function per backend endpoint. Components call these instead of fetch().
import { apiFetch } from "./client";
import type {
  AttemptAnswerDto,
  AttemptResultDto,
  CourseDetailDto,
  CourseSummaryDto,
  LanguageDto,
  LessonDto,
  ProfileUpdate,
  ProgressSummaryDto,
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

export const submitAttempt = (exerciseId: string, answer: AttemptAnswerDto) =>
  apiFetch<AttemptResultDto>(`/exercises/${encodeURIComponent(exerciseId)}/attempt`, {
    method: "POST",
    body: { answer },
  });

// ── Progress ──
export const getProgress = () => apiFetch<{ progress: ProgressSummaryDto }>("/progress");
