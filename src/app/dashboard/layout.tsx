import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-black/80 text-white font-sans">
      <Sidebar role={session.user.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav user={session.user} />
        <main className="flex-1 overflow-y-auto bg-transparent">
          <div className="w-full max-w-6xl mx-auto px-6 py-8 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
