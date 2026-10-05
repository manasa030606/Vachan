import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";

type HeartsCounterProps = {
  hearts: number;
  className?: string;
};

/** Shows the number of hearts (lives) left. */
export function HeartsCounter({ hearts, className }: HeartsCounterProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 font-extrabold text-rose-600", className)}
      aria-label={`${hearts} ${hearts === 1 ? "heart" : "hearts"} left`}
    >
      <Heart aria-hidden="true" className="size-6 fill-rose-500 text-rose-500" />
      <span aria-hidden="true">{hearts}</span>
    </span>
  );
}
