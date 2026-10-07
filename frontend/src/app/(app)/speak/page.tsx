import type { Metadata } from "next";
import { Suspense } from "react";
import { SpeakView } from "@/components/speech/speak-view";

export const metadata: Metadata = { title: "Listen & speak" };

export default function SpeakPage() {
  // useSearchParams (?tab=…) needs a Suspense boundary.
  return (
    <Suspense>
      <SpeakView />
    </Suspense>
  );
}
