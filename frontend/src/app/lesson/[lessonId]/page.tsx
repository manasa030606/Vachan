import type { Metadata } from "next";
import { LessonScreen } from "@/components/lesson/lesson-screen";
import { RequireAuth } from "@/components/session/require-auth";

export const metadata: Metadata = { title: "Lesson" };

export default async function LessonPage({ params }: PageProps<"/lesson/[lessonId]">) {
  const { lessonId } = await params;
  return (
    <RequireAuth>
      <LessonScreen lessonId={lessonId} />
    </RequireAuth>
  );
}
