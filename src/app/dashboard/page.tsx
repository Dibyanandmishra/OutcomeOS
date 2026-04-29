export const metadata = {
  title: "Dashboard - OutcomeOS",
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">
        Welcome to OutcomeOS Dashboard
      </h1>
      <p className="text-sm text-zinc-400">
        Select a module from the sidebar to get started.
      </p>

      {/* Placeholder content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col gap-2">
          <h2 className="text-sm font-medium text-white">Active Modules</h2>
          <p className="text-2xl font-semibold text-white">0</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col gap-2">
          <h2 className="text-sm font-medium text-white">Pending Doubts</h2>
          <p className="text-2xl font-semibold text-white">0</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col gap-2">
          <h2 className="text-sm font-medium text-white">Total Impact</h2>
          <p className="text-2xl font-semibold text-white">0%</p>
        </div>
      </div>
    </div>
  );
}
