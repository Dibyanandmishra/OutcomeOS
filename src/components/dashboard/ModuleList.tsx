"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Status } from "@prisma/client";
import { EmptyState } from "@/components/dashboard/EmptyState";

type ModuleWithProgress = {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  progressStatus: Status;
};

const statusColors: Record<Status, string> = {
  NOT_STARTED: "bg-zinc-800 text-zinc-300",
  IN_PROGRESS: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
  COMPLETED: "bg-green-500/10 text-green-500 border border-green-500/20",
};

const statusLabels: Record<Status, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export function ModuleList({ initialModules }: { initialModules: ModuleWithProgress[] }) {
  const router = useRouter();
  const [modules, setModules] = useState(initialModules);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  if (modules.length === 0) {
    return (
      <EmptyState
        title="Start your learning journey"
        description="No modules available yet. Check back soon for new content."
      />
    );
  }

  const handleStatusChange = async (moduleId: string, newStatus: Status) => {
    const previousModules = [...modules];
    setErrorId(null);

    try {
      setLoadingId(moduleId);
      setModules((current) =>
        current.map((m) =>
          m.id === moduleId ? { ...m, progressStatus: newStatus } : m
        )
      );

      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      router.refresh();
    } catch {
      setModules(previousModules);
      setErrorId(moduleId);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {modules.map((module) => (
        <div
          key={module.id}
          className={`p-5 bg-zinc-950 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            errorId === module.id ? "border-red-500/30" : "border-zinc-800"
          }`}
        >
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">
              {module.orderIndex}. {module.title}
            </h3>
            <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
              {module.description}
            </p>
            {errorId === module.id && (
              <p className="text-xs text-red-400 mt-1">
                Failed to update. Please try again.
              </p>
            )}
          </div>
          <div className="flex items-center shrink-0">
            <label htmlFor={`status-${module.id}`} className="sr-only">
              Status for {module.title}
            </label>
            <select
              id={`status-${module.id}`}
              disabled={loadingId === module.id}
              value={module.progressStatus}
              onChange={(e) => handleStatusChange(module.id, e.target.value as Status)}
              className={`text-sm font-medium px-3 py-2 rounded-md outline-none cursor-pointer transition-colors focus:ring-2 focus:ring-zinc-500 ${
                statusColors[module.progressStatus]
              } ${loadingId === module.id ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value} className="bg-zinc-900 text-white">
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
