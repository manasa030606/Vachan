import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ResultTileProps = {
  icon: ReactNode;
  label: string;
  value: string;
  note?: string;
  tone: "marigold" | "emerald" | "rose";
};

const tones = {
  marigold: "border-marigold-300 bg-marigold-50",
  emerald: "border-emerald-300 bg-emerald-50",
  rose: "border-rose-300 bg-rose-50",
};

/** A small stat box on the lesson-complete screen. */
export function ResultTile({ icon, label, value, note, tone }: ResultTileProps) {
  return (
    <div className={cn("flex flex-col items-center rounded-2xl border-2 p-3 sm:p-4", tones[tone])}>
      {icon}
      <p className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{value}</p>
      <p className="text-xs font-bold tracking-wide text-slate-600 uppercase sm:text-sm">{label}</p>
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
    </div>
  );
}
