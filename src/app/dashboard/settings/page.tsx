import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      batchNumber: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardPageShell
      title="Settings"
      description="Manage your account preferences and profile settings."
    >
      <SettingsForm user={user} />
    </DashboardPageShell>
  );
}
