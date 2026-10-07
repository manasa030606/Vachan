// /admin/content — manage languages, courses, units and lessons.
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ContentView } from "@/components/admin/content-view";

export const metadata: Metadata = { title: "Admin · Content" };

export default function Page() {
  return (
    <AdminShell
      title="Content"
      description="Languages, courses, units and lessons. New items start unpublished."
    >
      <ContentView />
    </AdminShell>
  );
}
