"use client";

// Loads a lesson from the backend (GET /api/lessons/:id) and shows the player.
import { Lock, SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { getLesson } from "@/lib/api/endpoints";
import { toLesson } from "@/lib/api/mappers";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { LessonPlayer } from "./lesson-player";

export function LessonScreen({ lessonId }: { lessonId: string }) {
  const { showRomanization } = useLearnerPreferences();
  const { data, error, isLoading, reload } = useApi(
    async () => toLesson((await getLesson(lessonId)).lesson),
    `lesson:${lessonId}`,
  );

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center" aria-busy="true">
        <LogoMark className="size-12 animate-pulse" />
        <span className="sr-only">Loading lesson…</span>
      </div>
    );
  }

  if (error?.code === "LESSON_LOCKED") {
    return (
      <Message
        icon={<Lock aria-hidden="true" className="size-9 text-slate-500" />}
        title="This lesson is locked"
      >
        Complete the earlier lessons in your path to unlock it.
      </Message>
    );
  }

  if (error?.status === 404) {
    return (
      <Message
        icon={<SearchX aria-hidden="true" className="size-9 text-slate-500" />}
        title="Lesson not found"
      >
        This lesson doesn&apos;t exist. Pick a lesson from your learning path.
      </Message>
    );
  }

  if (error || !data) {
    return (
      <Message icon={<LogoMark className="size-10" />} title="Couldn't load this lesson">
        {error?.message ?? "Something went wrong."}
        <Button variant="secondary" className="mt-6" onClick={reload}>
          Try again
        </Button>
      </Message>
    );
  }

  return <LessonPlayer key={data.id} lesson={data} showRomanization={showRomanization} />;
}

function Message({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-slate-200">
        {icon}
      </div>
      <h1 className="mt-6 text-3xl font-extrabold">{title}</h1>
      <div className="mt-2 flex flex-col items-center text-slate-600">{children}</div>
      <ButtonLink href="/learn" size="lg" className="mt-8">
        Back to Learn
      </ButtonLink>
    </div>
  );
}
