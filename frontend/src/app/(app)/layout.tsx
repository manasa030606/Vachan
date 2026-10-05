// Layout for the signed-in part of the app (Learn, Practice, Profile):
// sidebar on tablet/desktop, top stats bar, bottom tab bar on mobile.
import type { ReactNode } from "react";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { TopStatsBar } from "@/components/navigation/top-stats-bar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopStatsBar />
        {/* Bottom padding leaves room for the mobile tab bar. */}
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-28 md:pb-12">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
