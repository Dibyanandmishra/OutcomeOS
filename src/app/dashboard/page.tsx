import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";

export const metadata = {
  title: "Dashboard - OutcomeOS",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [totalModules, completedModules, totalDoubts, impactLogs] =
    await Promise.all([
      prisma.module.count(),
      prisma.progress.count({
        where: { userId, status: "COMPLETED" },
      }),
      prisma.doubt.count({
        where: { userId },
      }),
      prisma.impactLog.aggregate({
        where: { userId },
        _sum: { hoursSaved: true },
        _count: true,
      }),
    ]);

  const totalHoursSaved =
    Math.round((impactLogs._sum.hoursSaved || 0) * 10) / 10;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Welcome back, {session.user.name || "Learner"}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Here&apos;s an overview of your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Modules Completed"
          value={`${completedModules}/${totalModules}`}
        />
        <StatCard label="Doubts Resolved" value={totalDoubts} />
        <StatCard label="Hours Saved" value={totalHoursSaved} suffix="h" />
      </div>
    </div>
  );
}
