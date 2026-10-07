// /admin/vocabulary — manage the words of each language.
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { VocabularyView } from "@/components/admin/vocabulary-view";

export const metadata: Metadata = { title: "Admin · Vocabulary" };

export default function Page() {
  return (
    <AdminShell title="Vocabulary" description="Words, letters and phrases that lessons teach.">
      <VocabularyView />
    </AdminShell>
  );
}
