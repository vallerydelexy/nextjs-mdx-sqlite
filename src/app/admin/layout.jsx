import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/admin" className="font-semibold">
            Admin
          </Link>
          <Link
            href="/admin/new"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            New post
          </Link>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View blog
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
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
              className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {children}
    </div>
  );
}
