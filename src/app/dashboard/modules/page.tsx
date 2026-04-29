import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ModuleList } from "@/components/dashboard/ModuleList";
import { ProgressBar } from "@/components/dashboard/ProgressBar";

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
      progressStatus: p?.status || "NOT_STARTED",
    };
  });

  const totalModules = modulesWithProgress.length;
  const completedModules = modulesWithProgress.filter(
    (m) => m.progressStatus === "COMPLETED"
  ).length;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">
          Module Progress Tracker
        </h1>
        <p className="text-sm text-zinc-400">
          Track your progress across all learning modules.
        </p>
      </div>

      <ProgressBar total={totalModules} completed={completedModules} />

      <ModuleList initialModules={modulesWithProgress} />
    </div>
  );
}
