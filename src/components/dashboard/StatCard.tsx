type StatCardProps = {
  label: string;
  value: string | number;
  suffix?: string;
};

export function StatCard({ label, value, suffix }: StatCardProps) {
  return (
    <div className="premium-surface premium-hover rounded-xl p-6 flex flex-col gap-1">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-3xl font-bold text-white">
        {value}
        {suffix && <span className="text-lg font-medium text-zinc-400 ml-0.5">{suffix}</span>}
      </span>
    </div>
  );
}
