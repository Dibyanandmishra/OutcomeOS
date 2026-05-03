import { Skeleton } from "@/components/ui/Skeleton";

export function StatCardSkeleton() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col gap-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80 mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    </div>
  );
}

export function ProgressBarSkeleton() {
  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-14" />
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
      <Skeleton className="h-4 w-44" />
    </div>
  );
}

export function ModuleListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-full max-w-xl mt-3" />
          </div>
          <Skeleton className="h-10 w-32 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function ModulesPageSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-72 mt-3" />
      </div>

      <ProgressBarSkeleton />
      <ModuleListSkeleton />
    </div>
  );
}

export function ImpactListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3"
        >
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-3 w-48 mt-3" />
          </div>
          <Skeleton className="h-8 w-24 shrink-0" />
        </div>
      ))}
    </div>
  );
}
