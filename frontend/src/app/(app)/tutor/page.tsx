// /tutor — chat with the AI tutor about the current language or lesson.
import type { Metadata } from "next";
import { Suspense } from "react";
import { TutorView } from "@/components/tutor/tutor-view";

export const metadata: Metadata = { title: "Tutor" };

export default function TutorPage() {
  // useSearchParams (?lessonId, ?q) needs a Suspense boundary.
  return (
    <Suspense>
      <TutorView />
    </Suspense>
  );
}
