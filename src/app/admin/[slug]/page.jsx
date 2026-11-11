import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import DeleteButton from "@/components/admin/DeleteButton";
import { getFile } from "@/lib/github";
import { parsePost } from "@/lib/frontmatter";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
  const { slug } = await params;

  let file;
  try {
    file = await getFile(`posts/${slug}.md`);
  } catch (error) {
    console.error("Failed to load post from GitHub", error);
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 backdrop-blur-xl dark:text-red-300">
        Could not load this post from GitHub. Check the repository variables.
      </p>
    );
  }

  if (!file) notFound();

  const { data, content } = parsePost(file.content);

  return (
    <div>
      <PostEditor initialPost={{ ...data, slug, content }} />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-stone-900/10 pt-5 dark:border-white/10">
        <div>
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
            Delete post
          </p>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            This commits a removal to the repository.
          </p>
        </div>
        <DeleteButton slug={slug} />
      </div>
    </div>
  );
}
