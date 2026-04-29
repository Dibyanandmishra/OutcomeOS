"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Status } from "@prisma/client";

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

  const handleStatusChange = async (moduleId: string, newStatus: Status) => {
    try {
      setLoadingId(moduleId);
      // Optimistic update
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
    } catch (error) {
      console.error(error);
      // Revert optimistic update on error
      setModules(initialModules);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {modules.map((module) => (
        <div
          key={module.id}
          className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-white truncate">
              {module.orderIndex}. {module.title}
            </h3>
            <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
              {module.description}
            </p>
          </div>
          <div className="flex items-center shrink-0">
            <select
              disabled={loadingId === module.id}
              value={module.progressStatus}
              onChange={(e) => handleStatusChange(module.id, e.target.value as Status)}
              className={`text-sm font-medium px-3 py-2 rounded-md outline-none cursor-pointer transition-colors ${
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
