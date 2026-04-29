"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Modules", href: "/dashboard/modules" },
  { name: "Doubts", href: "/dashboard/doubts" },
  { name: "Impact", href: "/dashboard/impact" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <span className="text-lg font-bold text-white tracking-tight">OutcomeOS</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
    </div>
  );
}
