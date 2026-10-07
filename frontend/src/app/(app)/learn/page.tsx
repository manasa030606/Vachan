// /learn — the learning path of units and lessons (home page after login).
import type { Metadata } from "next";
import { LearnView } from "@/components/learn/learn-view";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return <LearnView />;
}
