import { signOut } from "@/lib/auth";
import type { User } from "next-auth";

export function TopNav({ user }: { user?: User }) {
  return (
    <header className="h-16 glass-dark border-b border-white/10 flex items-center justify-end px-8">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-zinc-300">
          {user?.name || user?.email || "User"}
        </span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
