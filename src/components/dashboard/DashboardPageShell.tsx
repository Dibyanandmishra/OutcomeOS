export function DashboardPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">{description}</p>
      </div>

      {children}
    </div>
  );
}
