import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { ChatBox } from "@/components/dashboard/ChatBox";

export const metadata = {
  title: "Doubts - OutcomeOS",
};

export default function DoubtsPage() {
  return (
    <DashboardPageShell
      title="AI Doubt Resolution"
      description="Ask questions about the course and get instant AI-powered answers."
    >
      <ChatBox />
    </DashboardPageShell>
  );
}
