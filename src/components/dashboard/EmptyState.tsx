import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-12 text-center flex flex-col items-center gap-3">
      <h3 className="text-base font-medium text-white">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
