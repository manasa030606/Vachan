import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MOCK_PROGRESS } from "@/data/mock-user";
import { cn } from "@/lib/cn";

/** Hearts = lives. A wrong answer costs one heart. */
export function HeartsCard() {
  const { hearts, maxHearts } = MOCK_PROGRESS;

  return (
    <Card>
      <h2 className="text-lg font-bold">Hearts</h2>
      <div className="mt-3 flex gap-1.5" aria-label={`${hearts} of ${maxHearts} hearts`} role="img">
        {Array.from({ length: maxHearts }, (_, index) => (
          <Heart
            key={index}
            aria-hidden="true"
            className={cn(
              "size-7",
              index < hearts ? "fill-rose-500 text-rose-500" : "fill-slate-200 text-slate-300",
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-500">
        A wrong answer costs one heart. Practise to earn them back.
      </p>
    </Card>
  );
}
