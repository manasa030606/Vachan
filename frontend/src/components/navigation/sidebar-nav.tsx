"use client";

// Desktop / tablet navigation.
//   md (tablet): narrow icon-only rail
//   lg (desktop): full sidebar with labels
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "./nav-items";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden shrink-0 border-r-2 border-slate-200/70 bg-white md:block md:w-24 lg:w-64">
      <div className="sticky top-0 flex h-dvh flex-col px-3 py-6 lg:px-5">
        <div className="mb-8 flex justify-center lg:justify-start lg:px-2">
          <span className="lg:hidden">
            <Logo href="/learn" markOnly />
          </span>
          <span className="hidden lg:block">
            <Logo href="/learn" />
          </span>
        </div>

        <nav aria-label="Main">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    title={item.label}
                    className={cn(
                      "flex items-center justify-center gap-4 rounded-2xl border-2 px-3 py-3 font-extrabold tracking-wide uppercase transition lg:justify-start",
                      isActive
                        ? "border-brand-200 bg-brand-50 text-brand-700"
                        : "border-transparent text-slate-500 hover:bg-slate-100",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-7 shrink-0" strokeWidth={2.2} />
                    <span className="sr-only lg:not-sr-only">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-auto hidden px-2 text-xs text-slate-400 lg:block">
          Phase 7 · Speaking &amp; conversation
        </p>
      </div>
    </aside>
  );
}
