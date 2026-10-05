import type { Metadata } from "next";
import { PlacementFlow } from "@/components/placement/placement-flow";
import { RequireAuth } from "@/components/session/require-auth";

export const metadata: Metadata = { title: "Placement test" };

export default function PlacementPage() {
  return (
    <RequireAuth>
      <PlacementFlow />
    </RequireAuth>
  );
}
