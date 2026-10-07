import { cn } from "@/lib/cn";

type ProgressBarProps = {
  /** Current value, e.g. 15 */
  value: number;
  /** Maximum value, e.g. 20 */
  max: number;
  /** Accessible name read by screen readers, e.g. "Daily goal progress" */
  label: string;
  /** Tailwind background class for the filled part. */
  colorClassName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const heights = { sm: "h-2", md: "h-3", lg: "h-4" };

/** Accessible progress bar; the fill is clamped between 0% and 100%. */
export function ProgressBar({
  value,
  max,
  label,
  colorClassName = "bg-brand-500",
  size = "md",
  className,
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("w-full overflow-hidden rounded-full bg-slate-200", heights[size], className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          colorClassName,
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
