export function ProgressBar({ total, completed }: { total: number; completed: number }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full premium-surface rounded-xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <h2 className="text-lg font-medium text-white tracking-tight">Overall Progress</h2>
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </div>
      <div className="h-3 w-full bg-zinc-900/80 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-zinc-400">
        {completed} of {total} modules completed
      </p>
    </div>
  );
}
