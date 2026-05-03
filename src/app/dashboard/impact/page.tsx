import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { ImpactDashboard } from "@/components/dashboard/ImpactDashboard";

export const metadata = {
  title: "Impact Tracker - OutcomeOS",
};

export default async function ImpactPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const modules = await prisma.module.findMany({
    orderBy: { orderIndex: "asc" },
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <DashboardPageShell
      title="Impact Tracker"
      description="Log the real-world impact of what you learned using AI tools."
    >
      <ImpactDashboard modules={modules} />
    </DashboardPageShell>
  );
}
