import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  if (await getAdminSession()) redirect("/admin");

  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with the authorized Google account to manage posts.
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          Access denied. Use the authorized Google account.
        </p>
      )}

      <form
        className="mt-6"
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/admin" });
        }}
      >
        <button
          type="submit"
          className="w-full rounded-md bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-90"
        >
          Continue with Google
        </button>
      </form>
    </main>
  );
}
