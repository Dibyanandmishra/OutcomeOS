"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Role } from "@prisma/client";
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  Zap, 
  Shield,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Modules", href: "/dashboard/modules", icon: BookOpen, exact: false },
  { name: "Doubts", href: "/dashboard/doubts", icon: MessageSquare, exact: false },
  { name: "Impact", href: "/dashboard/impact", icon: Zap, exact: false },
];

export function Sidebar({ role }: { role?: Role }) {
  const pathname = usePathname();
  const items =
    role === "ADMIN"
      ? [...navigation, { name: "Admin", href: "/dashboard/admin", icon: Shield, exact: false }]
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
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <div>
          <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
            Main Menu
          </h3>
          <nav className="space-y-1" aria-label="Dashboard navigation">
            {items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none",
                    isActive
                      ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-white/5"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
            Support
          </h3>
          <nav className="space-y-1">
            <Link
              href="/dashboard/settings"
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none",
                pathname.startsWith("/dashboard/settings")
                  ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-white/5"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <Settings className={cn(
                "w-4 h-4 transition-colors",
                pathname.startsWith("/dashboard/settings") ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              Settings
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 text-center">
            Pro Plan Active
          </p>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 w-3/4 rounded-full" />
          </div>
          <p className="text-[9px] text-zinc-500 mt-2 text-center">
            75% of monthly AI quota used
          </p>
        </div>
      </div>
    </aside>
  );
}
