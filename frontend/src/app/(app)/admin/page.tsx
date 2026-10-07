import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AnalyticsView } from "@/components/admin/analytics-view";

export const metadata: Metadata = { title: "Admin · Analytics" };

export default function Page() {
  return (
    <AdminShell title="Analytics" description="How learners use Vachan — aggregate numbers only.">
      <AnalyticsView />
    </AdminShell>
  );
}
