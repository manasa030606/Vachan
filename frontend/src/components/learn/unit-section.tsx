// A unit banner followed by its lessons arranged on a gentle winding path.
import { NotebookText } from "lucide-react";
import type { Unit } from "@/types/learning";
import { cn } from "@/lib/cn";
import { LessonNode, UNIT_COLORS } from "./lesson-node";

/** Horizontal offsets (px) for each lesson, so the path winds left and right. */
const PATH_OFFSETS = [0, 52, 76, 52, 0, -52, -76, -52];

export function UnitSection({ unit }: { unit: Unit }) {
  const colors = UNIT_COLORS[unit.color];
  // Even-numbered units wind the other way, so units do not all look the same.
  const direction = unit.number % 2 === 0 ? -1 : 1;
  const completedCount = unit.lessons.filter((lesson) => lesson.status === "completed").length;

  return (
    <section aria-labelledby={`${unit.id}-title`}>
      <header
        className={cn(
          "relative overflow-hidden rounded-card p-5 text-white shadow-lg",
          colors.banner,
        )}
      >
        {/* Decorative kolam dots */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(rgba(255,255,255,0.25)_1.5px,transparent_1.5px)] bg-[size:18px_18px]"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-wide uppercase opacity-90">
              Unit {unit.number} · {unit.stage}
            </p>
            <h2 id={`${unit.id}-title`} className="mt-0.5 text-2xl font-extrabold">
              {unit.title}
            </h2>
            <p className="mt-1 opacity-95">{unit.description}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-sm font-bold">
            <NotebookText aria-hidden="true" className="size-4" />
            {completedCount}/{unit.lessons.length}
            <span className="sr-only">lessons completed</span>
          </span>
        </div>
      </header>

      <ol className="flex flex-col gap-6 py-10">
        {unit.lessons.map((lesson, index) => (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            lessonNumber={index + 1}
            color={unit.color}
            offsetX={PATH_OFFSETS[index % PATH_OFFSETS.length] * direction}
          />
        ))}
      </ol>
    </section>
  );
}
