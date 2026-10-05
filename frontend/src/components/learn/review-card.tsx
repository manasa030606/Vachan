import { RotateCcw } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Shortcut to the Practice screen. */
export function ReviewCard({ mistakeCount }: { mistakeCount: number }) {
  return (
    <Card className="bg-gradient-to-br from-white to-brand-50">
      <h2 className="text-lg font-bold">Review mistakes</h2>
      <p className="mt-1 text-sm text-slate-600">
        You have {mistakeCount} recent mistakes to review. A quick review makes words stick.
      </p>
      <ButtonLink href="/practice" variant="secondary" size="sm" className="mt-4">
        <RotateCcw aria-hidden="true" className="size-4" />
        Review now
      </ButtonLink>
    </Card>
  );
}
