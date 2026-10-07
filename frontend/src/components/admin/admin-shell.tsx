"use client";

// Frame for every /admin page: only renders for ADMIN accounts (the server checks too — this is
// just so learners see a clear message instead of failing requests), plus the admin tabs.
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { useSession } from "@/components/session/session-provider";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/admin", label: "Analytics" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/vocabulary", label: "Vocabulary" },
  { href: "/admin/knowledge", label: "Knowledge base" },
  { href: "/admin/audit", label: "Audit log" },
];

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { user } = useSession();
  const pathname = usePathname();

  if (user && user.role !== "ADMIN") {
    return (
      <Card role="alert" className="flex gap-3">
        <ShieldAlert aria-hidden="true" className="size-6 shrink-0 text-rose-600" />
        <div>
          <p className="font-bold text-ink">Admins only</p>
          <p className="text-sm text-slate-600">
            This area is for Vachan content admins. An admin is created on the server with
            <code className="mx-1 rounded bg-slate-100 px-1">npm run admin:grant</code>.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold tracking-wide text-brand-700 uppercase">Admin</p>
        <h1 className="text-3xl font-extrabold text-ink">{title}</h1>
        {description && <p className="mt-1 text-slate-600">{description}</p>}
      </div>
      <nav aria-label="Admin sections" className="-mx-1 overflow-x-auto px-1">
        <ul className="flex gap-2">
          {TABS.map((tab) => {
            const active =
              tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
            return (
              <li key={tab.href} className="shrink-0">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-full px-4 py-2 text-sm font-extrabold transition",
                    active
                      ? "bg-brand-600 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-brand-50",
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {children}
    </div>
  );
}
