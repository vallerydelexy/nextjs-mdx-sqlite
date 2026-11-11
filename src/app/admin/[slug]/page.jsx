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
      <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
        Could not load this post from GitHub. Check the repository variables.
      </p>
    );
  }

  if (!file) notFound();

  const { data, content } = parsePost(file.content);

  return (
    <div>
      <PostEditor initialPost={{ ...data, slug, content }} />
      <div className="mt-6 border-t pt-4">
        <DeleteButton slug={slug} />
      </div>
    </div>
  );
}
