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
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          AI Doubt Resolution
        </h1>
        <p className="text-sm text-zinc-400">
          Ask questions about the course and get instant AI-powered answers.
        </p>
      </div>
      <ChatBox modules={modules} />
    </div>
  );
}
