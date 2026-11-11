import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            Posts
          </h1>
          <p className="mt-1 max-w-xl text-sm text-stone-500 dark:text-stone-400">
            Saving commits directly to the repository. Vercel rebuilds the public
            site.
          </p>
        </div>
        <Link href="/admin/new" className="admin-primary-button">
          <Plus className="size-4" aria-hidden="true" />
          New post
        </Link>
      </div>

      {isDryRun && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 backdrop-blur-xl dark:text-amber-300">
          Dry run is enabled. Saves will not be committed.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 backdrop-blur-xl dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-stone-900/10 bg-white/35 backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
        <div className="divide-y divide-stone-900/10 dark:divide-white/10">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-white/45 dark:hover:bg-white/[0.04] sm:px-5"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/${post.slug}`}
                  className="block truncate text-[15px] font-medium text-stone-900 transition-colors hover:text-amber-600 dark:text-stone-100 dark:hover:text-amber-400"
                >
                  {post.title || post.slug}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-stone-500 dark:text-stone-400">
                  <span className="font-mono text-xs">/{post.slug}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.date || "No date"}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/${post.slug}`}
                  target="_blank"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm text-stone-500 transition-colors hover:bg-white/50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
                >
                  View
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </Link>
                <DeleteButton slug={post.slug} />
              </div>
            </div>
          ))}

          {!error && posts.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                No posts yet
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">
                Create the first post to publish it to the blog.
              </p>
              <Link href="/admin/new" className="admin-primary-button mt-5">
                <Plus className="size-4" aria-hidden="true" />
                New post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
