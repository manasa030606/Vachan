"use client";

// /admin/audit — who changed what in the dashboard (latest 100 changes).
import { Card } from "@/components/ui/card";
import { admin } from "@/lib/api/admin";
import { Notice } from "./admin-ui";
import { useLoad } from "./use-load";

export function AuditView() {
  const { data, error } = useLoad(() => admin.auditLog(), "audit");
  if (error) return <Notice>{error}</Notice>;
  if (!data) return <p className="text-slate-500">Loading…</p>;
  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">
                When
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Admin
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Action
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                What
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.entries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No changes yet.
                </td>
              </tr>
            )}
            {data.entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-2 whitespace-nowrap text-slate-600">
                  {new Date(entry.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">{entry.admin}</td>
                <td className="px-4 py-2 font-bold text-ink">{entry.action}</td>
                <td className="px-4 py-2">
                  {entry.summary && <span className="block text-ink">{entry.summary}</span>}
                  <span className="block text-xs break-all text-slate-500">
                    {entry.entityType} · {entry.entityId}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
