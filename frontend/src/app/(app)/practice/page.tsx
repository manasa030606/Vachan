import type { Metadata } from "next";
import { PracticeView } from "@/components/practice/practice-view";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  return <PracticeView />;
}
