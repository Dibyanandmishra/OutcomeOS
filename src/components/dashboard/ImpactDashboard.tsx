"use client";

import { useState, useEffect, useCallback } from "react";
import { ImpactForm } from "@/components/dashboard/ImpactForm";
import { ImpactList } from "@/components/dashboard/ImpactList";
import { StatCard } from "@/components/dashboard/StatCard";

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
  const [fetchError, setFetchError] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      setFetchError("");
      const res = await fetch("/api/impact");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLogs(data.logs);
      setStats(data.stats);
    } catch {
      setFetchError("Could not load your impact data. Please refresh the page.");
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
        <StatCard label="Total Hours Saved" value={stats.totalHours} suffix="h" />
        <StatCard label="Entries Logged" value={stats.totalEntries} />
      </div>

      {/* Form */}
      <ImpactForm modules={modules} onCreated={fetchLogs} />

      {/* List */}
      <div>
        <h2 className="text-base font-medium text-white mb-4">Your Impact Log</h2>
        {isLoading ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-sm text-zinc-500">Loading your impact data...</p>
          </div>
        ) : fetchError ? (
          <div className="bg-zinc-950 border border-red-500/20 rounded-xl p-8 text-center">
            <p className="text-sm text-red-400">{fetchError}</p>
          </div>
        ) : (
          <ImpactList logs={logs} />
        )}
      </div>
    </div>
  );
}
