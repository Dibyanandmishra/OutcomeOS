import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { ChatBox } from "@/components/dashboard/ChatBox";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doubts - OutcomeOS",
};

export default async function DoubtsPage() {
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
      title="AI Doubt Resolution"
      description="Ask questions about the course and get instant AI-powered answers."
    >
      <ChatBox modules={modules} />
    </DashboardPageShell>
  );
}
