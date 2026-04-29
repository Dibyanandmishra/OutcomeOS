import { signOut } from "@/lib/auth";
import type { User } from "next-auth";

export function TopNav({ user }: { user?: User }) {
  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-end px-8">
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
            className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
