// Phase 8: records every admin change (who, what, when). Never stores learner data.
import { prisma } from "./prisma.ts";

export async function audit(
  adminId: string,
  action: string,
  entity: { type: string; id: string; summary?: string | null },
) {
  await prisma.adminAuditLog.create({
    data: {
      userId: adminId,
      action,
      entityType: entity.type,
      entityId: entity.id,
      summary: entity.summary?.slice(0, 200) ?? null,
    },
  });
}
