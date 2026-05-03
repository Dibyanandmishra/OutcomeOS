"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div className={cn(
        "flex items-center justify-between w-full max-w-6xl px-6 py-3",
        "glass-dark rounded-full border border-white/10"
      )}>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
            <Brain className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Outcome<span className="text-blue-500">OS</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</Link>
          <Link href="#impact" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Impact</Link>
          <Link href="#about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-sm text-zinc-300 hover:text-white">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="rounded-full bg-white text-black hover:bg-zinc-200 transition-all px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
