import type { Metadata } from "next";
import { ReviewScreen } from "@/components/review/review-screen";
import { RequireAuth } from "@/components/session/require-auth";

export const metadata: Metadata = { title: "Review mistakes" };

export default function ReviewPage() {
  return (
    <RequireAuth>
      <ReviewScreen />
    </RequireAuth>
  );
}
