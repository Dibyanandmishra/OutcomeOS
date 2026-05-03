"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ImpactEntry = {
  id: string;
  hoursSaved: number;
  createdAt: string;
};

type ChartPoint = {
  date: string;
  label: string;
  hours: number;
};

type HeatmapDay = {
  date: string;
  count: number;
};

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function buildChartData(logs: ImpactEntry[]): ChartPoint[] {
  const totalsByDate = new Map<string, number>();

  for (const log of logs) {
    const dateKey = getDateKey(new Date(log.createdAt));
    totalsByDate.set(dateKey, (totalsByDate.get(dateKey) || 0) + log.hoursSaved);
  }

  return Array.from(totalsByDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, hours]) => ({
      date,
      label: formatDateLabel(date),
      hours: Math.round(hours * 10) / 10,
    }));
}

function buildHeatmapData(logs: ImpactEntry[]): HeatmapDay[] {
  const countsByDate = new Map<string, number>();

  for (const log of logs) {
    const dateKey = getDateKey(new Date(log.createdAt));
    countsByDate.set(dateKey, (countsByDate.get(dateKey) || 0) + 1);
  }

  const today = new Date();
  const days: HeatmapDay[] = [];

  for (let offset = 55; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const dateKey = getDateKey(date);

    days.push({
      date: dateKey,
      count: countsByDate.get(dateKey) || 0,
    });
  }

  return days;
}

function getHeatmapColor(count: number) {
  if (count >= 4) return "bg-emerald-300";
  if (count >= 3) return "bg-emerald-400/80";
  if (count >= 2) return "bg-emerald-500/55";
  if (count >= 1) return "bg-emerald-500/30";
  return "bg-white/5";
}

export function ImpactVisualizations({ logs }: { logs: ImpactEntry[] }) {
  const chartData = buildChartData(logs);
  const heatmapData = buildHeatmapData(logs);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
      <section className="premium-surface rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-base font-medium text-white">Hours Saved</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Daily impact from your logged AI wins.
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="h-72 flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
            <p className="text-sm text-zinc-500">
              Log impact entries to unlock your chart.
            </p>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    background: "#090b10",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#e4e4e7" }}
                />
                <Bar dataKey="hours" name="Hours saved" fill="#67e8f9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="premium-surface rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-base font-medium text-white">Activity Heatmap</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Impact logs over the last eight weeks.
          </p>
        </div>

        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1">
          {heatmapData.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} impact log${day.count === 1 ? "" : "s"}`}
              className={`h-3 w-3 rounded-sm border border-white/5 ${getHeatmapColor(day.count)}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-5 text-xs text-zinc-500">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((count) => (
              <span
                key={count}
                className={`h-3 w-3 rounded-sm border border-white/5 ${getHeatmapColor(count)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </section>
    </div>
  );
}
