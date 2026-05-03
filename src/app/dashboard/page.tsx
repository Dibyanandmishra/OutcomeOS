import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { EngagementPanel } from "@/components/dashboard/EngagementPanel";
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

  const [totalModules, completedModules, totalDoubts, impactLogs, leaderboardRows] =
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
      prisma.impactLog.groupBy({
        by: ["userId"],
        _sum: { hoursSaved: true },
        orderBy: {
          _sum: {
            hoursSaved: "desc",
          },
        },
        take: 5,
      }),
    ]);

  const totalHoursSaved =
    Math.round((impactLogs._sum.hoursSaved || 0) * 10) / 10;
  const leaderboardUsers = await prisma.user.findMany({
    where: {
      id: {
        in: leaderboardRows.map((row) => row.userId),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  const leaderboard = leaderboardRows.map((row) => {
    const user = leaderboardUsers.find((u) => u.id === row.userId);

    return {
      userId: row.userId,
      name: user?.name || user?.email || "Learner",
      hoursSaved: Math.round((row._sum.hoursSaved || 0) * 10) / 10,
      isCurrentUser: row.userId === userId,
    };
  });
  const badges = [
    {
      title: "First Step",
      description: "Complete your first module.",
      unlocked: completedModules >= 1,
    },
    {
      title: "Course Climber",
      description: "Complete three modules.",
      unlocked: completedModules >= 3,
    },
    {
      title: "Doubt Crusher",
      description: "Resolve five AI doubts.",
      unlocked: totalDoubts >= 5,
    },
    {
      title: "Impact Maker",
      description: "Log at least five hours saved.",
      unlocked: totalHoursSaved >= 5,
    },
  ];

  return (
    <DashboardPageShell
      title={`Welcome back, ${session.user.name || "Learner"}`}
      description="Here's an overview of your learning journey."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Modules Completed"
          value={`${completedModules}/${totalModules}`}
        />
        <StatCard label="Doubts Resolved" value={totalDoubts} />
        <StatCard label="Hours Saved" value={totalHoursSaved} suffix="h" />
      </div>

      <EngagementPanel leaderboard={leaderboard} badges={badges} />
    </DashboardPageShell>
  );
}
