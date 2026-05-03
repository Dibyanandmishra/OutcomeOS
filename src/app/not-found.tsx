import Link from "next/link";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="relative w-full max-w-md text-center">
        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 shadow-2xl animate-bounce">
            <Sparkles className="w-10 h-10 text-cyan-400" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-7xl font-black text-white tracking-tighter">404</h1>
            <h2 className="text-xl font-bold text-zinc-300">Lost in the Outcome?</h2>
            <p className="text-sm text-zinc-500 max-w-[280px] mx-auto leading-relaxed">
              The page you are looking for has been moved or doesn&apos;t exist. Let&apos;s get you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              Go Dashboard
            </Link>
            <Link 
              href="/" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 glass text-white font-semibold rounded-xl hover:bg-white/10 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              Landing Page
            </Link>
          </div>
        </div>
        
        <div className="mt-16 text-[10px] text-zinc-700 uppercase tracking-[0.2em] font-bold">
          OutcomeOS Architecture • Error 404
        </div>
      </div>
    </div>
  );
}
