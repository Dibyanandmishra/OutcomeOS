"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Role } from "@prisma/client";

const navigation = [
  { name: "Dashboard", href: "/dashboard", exact: true },
  { name: "Modules", href: "/dashboard/modules", exact: false },
  { name: "Doubts", href: "/dashboard/doubts", exact: false },
  { name: "Impact", href: "/dashboard/impact", exact: false },
];

export function Sidebar({ role }: { role?: Role }) {
  const pathname = usePathname();
  const items =
    role === "ADMIN"
      ? [...navigation, { name: "Admin", href: "/dashboard/admin", exact: false }]
      : navigation;

  return (
    <aside className="w-64 glass-dark border-r border-white/10 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link
          href="/dashboard"
          className="text-lg font-bold text-white tracking-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
        >
          Outcome<span className="text-gradient">OS</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Dashboard navigation">
        {items.map((item) => {
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
                  ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
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
