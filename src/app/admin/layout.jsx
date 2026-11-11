import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/auth";
import { getAdminSession } from "@/lib/admin-auth";
import { LiquidGlassCard } from "@/components/tower/FrostedCard";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-3 pb-16 pt-24 sm:px-4">
      <LiquidGlassCard
        interactive={false}
        glare={false}
        className="p-4 dark:from-[#050917]/80 dark:via-[#050917]/70 dark:to-[#050917]/85 sm:p-6 lg:p-8"
      >
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-900/10 pb-5 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/admin" className="group inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.85)]" />
              <span className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-50">
                Admin
              </span>
            </Link>
            <Link
              href="/admin/new"
              className="text-sm text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
            >
              New post
            </Link>
            <Link
              href="/blog"
              className="text-sm text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
            >
              View blog
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden max-w-[18rem] truncate text-sm text-stone-500 dark:text-stone-400 sm:inline">
              {session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="liquid-glass-pill inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-stone-700 transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 dark:text-stone-200 dark:hover:bg-white/10"
              >
                <LogOut className="size-3.5" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </header>

        {children}
      </LiquidGlassCard>
    </div>
  );
}
