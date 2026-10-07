// One lesson on the learning path, drawn as a kolam-style diamond tile.
// Completed lessons show a check, locked ones a grey lock. The lesson to do next
// ("current" if started, "available" if not) is bigger and has a Continue/Start bubble.
import Link from "next/link";
import {
  BookOpenText,
  Check,
  Lock,
  MessagesSquare,
  PenLine,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { LessonIcon, LessonSummary, UnitColor } from "@/types/learning";
import { cn } from "@/lib/cn";

const ICONS: Record<LessonIcon, LucideIcon> = {
  script: PenLine,
  words: BookOpenText,
  chat: MessagesSquare,
  star: Star,
  trophy: Trophy,
};

/** Tile colours per unit (full class names so Tailwind can find them). */
export const UNIT_COLORS: Record<
  UnitColor,
  { tile: string; ring: string; banner: string; text: string }
> = {
  brand: {
    tile: "bg-brand-500",
    ring: "ring-brand-200",
    banner: "bg-brand-600",
    text: "text-brand-700",
  },
  teal: {
    tile: "bg-teal-500",
    ring: "ring-teal-200",
    banner: "bg-teal-600",
    text: "text-teal-700",
  },
  rose: {
    tile: "bg-rose-500",
    ring: "ring-rose-200",
    banner: "bg-rose-600",
    text: "text-rose-700",
  },
};

/** Read out by screen readers after the lesson title. */
const STATUS_TEXT: Record<LessonSummary["status"], string> = {
  completed: "completed, practise again",
  current: "in progress, continue",
  available: "unlocked, start now",
  locked: "locked",
};

type LessonNodeProps = {
  lesson: LessonSummary;
  lessonNumber: number;
  color: UnitColor;
  /** Horizontal shift in px, creates the winding path. */
  offsetX: number;
};

/** A single lesson tile; locked lessons are not links. */
export function LessonNode({ lesson, lessonNumber, color, offsetX }: LessonNodeProps) {
  const colors = UNIT_COLORS[color];
  // "Open" lessons (started or ready to start) are highlighted on the path.
  const isCurrent = lesson.status === "current" || lesson.status === "available";
  const isLocked = lesson.status === "locked";
  let Icon = ICONS[lesson.icon];
  if (lesson.status === "completed") Icon = Check;
  else if (isLocked) Icon = Lock;
  const statusText = STATUS_TEXT[lesson.status];
  const bubble = lesson.status === "current" ? "Continue" : "Start";
  const placedOutText = lesson.placedOut ? " (unlocked by the placement test)" : "";

  // The same tile is wrapped in a Link, or in a plain span when the lesson is locked.
  const tile = (
    <span className="relative flex flex-col items-center">
      {isCurrent && (
        <span className="absolute -top-12 z-10 animate-float rounded-xl border-2 border-slate-200 bg-white px-3 py-1 text-sm font-extrabold tracking-wide text-brand-700 uppercase shadow-md motion-reduce:animate-none">
          {bubble}
          <span className="absolute -bottom-2 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-slate-200 bg-white" />
        </span>
      )}
      <span
        className={cn(
          "flex rotate-45 items-center justify-center rounded-[1.4rem] shadow-md transition",
          isCurrent ? "size-20 ring-8" : "size-16",
          isLocked ? "bg-slate-200 shadow-none" : colors.tile,
          lesson.placedOut && "opacity-60",
          isCurrent && colors.ring,
          !isLocked && "group-hover:scale-105 group-active:scale-95",
        )}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            "-rotate-45",
            isCurrent ? "size-9" : "size-7",
            isLocked ? "text-slate-400" : "text-white",
          )}
          strokeWidth={2.6}
        />
      </span>
      <span
        className={cn(
          "mt-4 max-w-32 text-center text-sm leading-tight font-bold",
          isLocked ? "text-slate-400" : "text-slate-700",
        )}
      >
        {lesson.title}
        {lesson.placedOut && (
          <span className="mt-0.5 block text-xs font-bold text-slate-400">Placement</span>
        )}
      </span>
    </span>
  );

  const label = `Lesson ${lessonNumber}: ${lesson.title} — ${statusText}${placedOutText}`;

  return (
    <li className={cn("flex justify-center", isCurrent && "mt-10")}>
      <div style={{ transform: `translateX(${offsetX}px)` }}>
        {isLocked ? (
          <span
            role="img"
            aria-label={label}
            title="Complete earlier lessons to unlock"
            className="block cursor-not-allowed p-2"
          >
            {tile}
          </span>
        ) : (
          <Link href={`/lesson/${lesson.id}`} aria-label={label} className="group rounded-3xl p-2">
            {tile}
          </Link>
        )}
      </div>
    </li>
  );
}
