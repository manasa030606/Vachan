import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { LessonEditor } from "@/components/admin/lesson-editor";

export const metadata: Metadata = { title: "Admin · Lesson" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminShell title="Edit lesson">
      <LessonEditor lessonId={decodeURIComponent(id)} />
    </AdminShell>
  );
}
