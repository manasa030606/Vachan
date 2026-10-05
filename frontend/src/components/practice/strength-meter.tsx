import { cn } from "@/lib/cn";

/** Four small bars + a text label showing how well something is known (0–100). */
export function StrengthMeter({ strength }: { strength: number }) {
  const filledBars = Math.max(1, Math.ceil(strength / 25));
  const label = strength < 50 ? "Weak" : strength < 75 ? "Okay" : "Strong";
  const color =
    strength < 50 ? "bg-rose-500" : strength < 75 ? "bg-marigold-400" : "bg-emerald-500";

  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className={cn("w-1.5 rounded-full", bar <= filledBars ? color : "bg-slate-200")}
            style={{ height: `${6 + bar * 3}px` }}
          />
        ))}
      </span>
      <span className="text-xs font-bold text-slate-600">
        {label}
        <span className="sr-only"> ({strength}%)</span>
      </span>
    </span>
  );
}
