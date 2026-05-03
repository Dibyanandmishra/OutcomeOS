"use client";

import Link from "next/link";
import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold text-white">OutcomeOS</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} OutcomeOS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
