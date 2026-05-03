"use client";

import { signOut } from "next-auth/react";
import type { User } from "next-auth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User as UserIcon, LogOut, ChevronDown, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function TopNav({ user }: { user?: User }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-16 glass-dark border-b border-white/10 flex items-center justify-between px-8 relative z-50">
      <div className="flex items-center gap-4">
        {/* Placeholder for potential search bar or contextual title */}
      </div>

      <div className="flex items-center gap-6">
        <button className="text-zinc-500 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#030405]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-all outline-none border border-transparent hover:border-white/5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-none mb-1">
                {user?.name || "User Account"}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider leading-none">
                {user?.role?.toLowerCase() || "learner"}
              </p>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-zinc-500 transition-transform duration-200",
              isMenuOpen && "rotate-180 text-white"
            )} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMenuOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 glass-dark border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <Link 
                      href="/dashboard/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      View Profile
                    </Link>
                  </div>

                  <div className="p-2 border-t border-white/5">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
