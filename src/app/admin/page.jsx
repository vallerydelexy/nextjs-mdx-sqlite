import Link from "next/link";
import { isDryRun, listPosts } from "@/lib/github";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let posts = [];
  let error = "";

  try {
    posts = await listPosts();
  } catch (cause) {
    console.error("Failed to load posts", cause);
    error = "Could not load posts from GitHub. Check the repository variables.";
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Saving commits directly to the repository. Vercel rebuilds the site.
          </p>
        </div>
        <Link
          href="/admin/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90"
        >
          New post
        </Link>
      </div>

      {isDryRun && (
        <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-600">
          Dry run is enabled. Saves will not be committed.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="mt-6 divide-y rounded-md border">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="flex flex-wrap items-center justify-between gap-4 p-4"
          >
            <div>
              <Link
                href={`/admin/${post.slug}`}
                className="font-medium transition-colors hover:underline"
              >
                {post.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                /{post.slug} · {post.date}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/${post.slug}`}
                target="_blank"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View
              </Link>
              <DeleteButton slug={post.slug} />
            </div>
          </div>
        ))}

        {!error && posts.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
