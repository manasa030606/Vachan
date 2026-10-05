import { RotateCcw } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Shortcut to the mistake review (counts come from GET /api/review). */
export function ReviewCard({ mistakeCount }: { mistakeCount: number | null }) {
  return (
    <Card className="bg-gradient-to-br from-white to-brand-50">
      <h2 className="text-lg font-bold">Review mistakes</h2>
      <p className="mt-1 text-sm text-slate-600">
        {mistakeCount === null
          ? "Loading your mistakes…"
          : mistakeCount === 0
            ? "No open mistakes. Mistakes you make in lessons will show up here."
            : `You have ${mistakeCount} ${mistakeCount === 1 ? "mistake" : "mistakes"} to review. A quick review makes words stick.`}
      </p>
      {mistakeCount !== null && mistakeCount > 0 && (
        <ButtonLink href="/review" variant="secondary" size="sm" className="mt-4">
          <RotateCcw aria-hidden="true" className="size-4" />
          Review now
        </ButtonLink>
      )}
    </Card>
  );
}
