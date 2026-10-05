import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type StatPillProps = {
  icon: ReactNode;
  value: string | number;
  /** Full description for screen readers, e.g. "12 day streak". */
  label: string;
  className?: string;
};

/** Compact icon + number, used in the top bars (streak, XP, hearts). */
export function StatPill({ icon, value, label, className }: StatPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 font-extrabold",
        className,
      )}
      title={label}
    >
      {icon}
      <span aria-hidden="true">{value}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
