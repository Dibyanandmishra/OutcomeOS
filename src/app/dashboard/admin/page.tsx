import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { AdminModuleManager } from "@/components/dashboard/AdminModuleManager";

export const metadata = {
  title: "Admin - OutcomeOS",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const modules = await prisma.module.findMany({
    orderBy: { orderIndex: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      orderIndex: true,
    },
  });

  return (
    <DashboardPageShell
      title="Admin Module Manager"
      description="Create and edit the learning modules learners see in their progress tracker."
    >
      <AdminModuleManager initialModules={modules} />
    </DashboardPageShell>
  );
}
