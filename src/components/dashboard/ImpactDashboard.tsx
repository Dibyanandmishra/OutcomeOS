"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImpactForm } from "@/components/dashboard/ImpactForm";
import { ImpactList } from "@/components/dashboard/ImpactList";
import { ImpactVisualizations } from "@/components/dashboard/ImpactVisualizations";
import { ImpactListSkeleton } from "@/components/dashboard/DashboardSkeletons";
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
type ImpactData = { logs: ImpactEntry[]; stats: Stats };

async function fetchImpactData(): Promise<ImpactData> {
  const res = await fetch("/api/impact");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function ImpactDashboard({ modules }: { modules: Module[] }) {
  const [logs, setLogs] = useState<ImpactEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ totalEntries: 0, totalHours: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadLogs() {
      try {
        const data = await fetchImpactData();
        if (!isMounted) return;

        setLogs(data.logs);
        setStats(data.stats);
      } catch {
        if (!isMounted) return;

        setFetchError("Could not load your impact data. Please refresh the page.");
        toast.error("Could not load impact data", {
          description: "Refresh the page to try again.",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshLogs = async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      const data = await fetchImpactData();
      setLogs(data.logs);
      setStats(data.stats);
    } catch {
      setFetchError("Could not load your impact data. Please refresh the page.");
      toast.error("Could not load impact data", {
        description: "Refresh the page to try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Total Hours Saved" value={stats.totalHours} suffix="h" />
        <StatCard label="Entries Logged" value={stats.totalEntries} />
      </div>

      {/* Form */}
      <ImpactForm modules={modules} onCreated={refreshLogs} />

      {!isLoading && !fetchError && <ImpactVisualizations logs={logs} />}

      {/* List */}
      <div>
        <h2 className="text-base font-medium text-white mb-4">Your Impact Log</h2>
        {isLoading ? (
          <ImpactListSkeleton />
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
