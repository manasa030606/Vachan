// npm run admin:grant  -w backend -- someone@example.com     → make an existing account an admin
// npm run admin:revoke -w backend -- someone@example.com     → back to a normal learner
// npm run admin:list   -w backend                            → who is an admin
//
// There is deliberately NO API endpoint for this: only someone with database access (you, on
// the server or with the production DATABASE_URL) can create admins. The account must already
// exist — register it in the app first.
import { prisma } from "../lib/prisma.ts";

const [command = "list", rawEmail] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

async function main() {
  if (command === "list") {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true, createdAt: true },
    });
    console.log(admins.length ? admins.map((a) => `  ${a.email}`).join("\n") : "  (no admins yet)");
    return;
  }
  if (!email) {
    console.error(`Usage: npm run admin:${command} -w backend -- someone@example.com`);
    process.exitCode = 1;
    return;
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`❌ No account with ${email}. Register it in the app first.`);
    process.exitCode = 1;
    return;
  }
  const role = command === "grant" ? "ADMIN" : "LEARNER";
  await prisma.user.update({ where: { email }, data: { role } });
  console.log(
    role === "ADMIN"
      ? `✅ ${email} is now an admin. Reload the app, then open /admin.`
      : `✅ ${email} is a learner again (admin access removed immediately).`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("❌", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
