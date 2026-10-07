// /admin/knowledge — manage the notes the AI tutor searches.
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { KnowledgeView } from "@/components/admin/knowledge-view";

export const metadata: Metadata = { title: "Admin · Knowledge base" };

export default function Page() {
  return (
    <AdminShell
      title="Knowledge base"
      description="The notes the AI Tutor and role-plays search (RAG)."
    >
      <KnowledgeView />
    </AdminShell>
  );
}
