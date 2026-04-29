"use client";

import { useState, useEffect, useCallback } from "react";
import { ImpactForm } from "@/components/dashboard/ImpactForm";
import { ImpactList } from "@/components/dashboard/ImpactList";

type Module = { id: string; title: string };
type ImpactEntry = {
  id: string;
  description: string;
  hoursSaved: number;
  createdAt: string;
  module: { title: string };
};
type Stats = { totalEntries: number; totalHours: number };

export function ImpactDashboard({ modules }: { modules: Module[] }) {
  const [logs, setLogs] = useState<ImpactEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ totalEntries: 0, totalHours: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/impact");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLogs(data.logs);
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col gap-1">
          <span className="text-sm text-zinc-400">Total Hours Saved</span>
          <span className="text-3xl font-bold text-white">{stats.totalHours}h</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col gap-1">
          <span className="text-sm text-zinc-400">Entries Logged</span>
          <span className="text-3xl font-bold text-white">{stats.totalEntries}</span>
        </div>
      </div>

      {/* Form */}
      <ImpactForm modules={modules} onCreated={fetchLogs} />

      {/* List */}
      <div>
        <h2 className="text-base font-medium text-white mb-4">Your Impact Log</h2>
        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : (
          <ImpactList logs={logs} />
        )}
      </div>
    </div>
  );
}
