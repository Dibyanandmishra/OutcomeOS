import { EmptyState } from "@/components/dashboard/EmptyState";

type ImpactEntry = {
  id: string;
  description: string;
  hoursSaved: number;
  createdAt: string;
  module: { title: string };
};

export function ImpactList({ logs }: { logs: ImpactEntry[] }) {
  if (logs.length === 0) {
    return (
      <EmptyState
        title="Log your first impact"
        description="Track how AI tools are saving you time at work. Use the form above to get started."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white">{log.description}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-zinc-500">{log.module.title}</span>
              <span className="text-xs text-zinc-700">·</span>
              <span className="text-xs text-zinc-500">
                {new Date(log.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="shrink-0 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium px-3 py-1.5 rounded-md">
            {log.hoursSaved}h saved
          </div>
        </div>
      ))}
    </div>
  );
}
