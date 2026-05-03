import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Status } from "@prisma/client";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { ModuleProgressClient } from "@/components/dashboard/ModuleProgressClient";

export const metadata = {
  title: "Modules - OutcomeOS",
};

export default async function ModulesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const modules = await prisma.module.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      progress: {
        where: { userId },
      },
    },
  });

  const modulesWithProgress = modules.map((m) => {
    const p = m.progress[0];
    return {
      id: m.id,
      title: m.title,
      description: m.description,
      orderIndex: m.orderIndex,
      progressStatus: p?.status || Status.NOT_STARTED,
    };
  });

  return (
    <DashboardPageShell
      title="Module Progress Tracker"
      description="Track your progress across all learning modules."
    >
      <ModuleProgressClient initialModules={modulesWithProgress} />
    </DashboardPageShell>
  );
}
