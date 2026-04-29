import { ChatBox } from "@/components/dashboard/ChatBox";

export const metadata = {
  title: "Doubts - OutcomeOS",
};

export default function DoubtsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          AI Doubt Resolution
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Ask questions about the course and get instant AI-powered answers.
        </p>
      </div>

      <ChatBox />
    </div>
  );
}
