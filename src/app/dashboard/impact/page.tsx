import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Impact Tracker
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Log the real-world impact of what you learned using AI tools.
        </p>
      </div>

      <ImpactDashboard modules={modules} />
    </div>
  );
}
