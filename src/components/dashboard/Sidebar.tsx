"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", exact: true },
  { name: "Modules", href: "/dashboard/modules", exact: false },
  { name: "Doubts", href: "/dashboard/doubts", exact: false },
  { name: "Impact", href: "/dashboard/impact", exact: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Link
          href="/dashboard"
          className="text-lg font-bold text-white tracking-tight focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded"
        >
          OutcomeOS
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Dashboard navigation">
        {navigation.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
