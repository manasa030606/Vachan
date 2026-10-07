import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AuditView } from "@/components/admin/audit-view";

export const metadata: Metadata = { title: "Admin · Audit log" };

export default function Page() {
  return (
    <AdminShell title="Audit log" description="The latest 100 changes made in the dashboard.">
      <AuditView />
    </AdminShell>
  );
}
