import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonScreen } from "@/components/lesson/lesson-screen";
import { LANGUAGES } from "@/data/languages";
import { findLesson } from "@/data/mock-course";

export const metadata: Metadata = { title: "Lesson" };

/** Valid ids: a lesson from a course path ("hi-u2-l2") or a practice session ("practice-…"). */
function isKnownLessonId(lessonId: string): boolean {
  if (lessonId.startsWith("practice-")) return true;
  return LANGUAGES.some((language) => findLesson(language.code, lessonId) !== null);
}

export default async function LessonPage({ params }: PageProps<"/lesson/[lessonId]">) {
  const { lessonId } = await params;
  if (!isKnownLessonId(lessonId)) notFound();

  return <LessonScreen lessonId={lessonId} />;
}
