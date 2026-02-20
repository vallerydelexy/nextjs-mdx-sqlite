// src/app/[slug]/page.jsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostsLocally } from "@/utils/helper";
import Grain from "@/components/Grain";
import { mdxOptions } from "@/config/mdxOptions";
import TableOfContents from "@/components/TableOfContent";
import { mdxComponents } from "@/components/MdxComponents";

export default async function Blog({ params }) {
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const date =
    post.createdAt === post.updatedAt
      ? new Date(post.createdAt).toDateString()
      : (`updated ${new Date(post.updatedAt).toDateString()}` ?? "");

  const isContactPage = slug === "contact";

  return (
    <article className="relative max-w-7xl mx-auto py-[4em]">
      <Grain />
      {/* If it's the contact page, render a simpler centered layout */}
      {isContactPage ? (
        <div className="prose dark:prose-invert mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
          {post.description && (
            <p className="text-center block">{post.description}</p>
          )}
          <div className="max-w-2xl mx-auto px-4 md:px-0 mt-6">
            <MDXRemote
              source={post.content}
              options={mdxOptions}
              components={mdxComponents}
            />
          </div>
        </div>
      ) : (
        // Otherwise, render the standard blog post layout with a sidebar
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          <aside className="hidden md:block">
            <TableOfContents content={post.content} />
          </aside>
          <div className="prose dark:prose-invert">
            <h1 className="text-3xl font-bold mb-4 text-center">
              {post.title}
            </h1>
            <span className="block text-sm text-center">{date}</span>
            {post.description && (
              <p className="text-center block">{post.description}</p>
            )}

            {post.cover && (
              <div className="max-w-[36em] mx-auto shadow-lg my-6">
                <img
                  className="rounded object-cover"
                  src={post.cover}
                  alt={post.title}
                />
              </div>
            )}

            <div className="max-w-2xl mx-auto px-4 md:px-0">
              <MDXRemote
                source={post.content}
                options={mdxOptions}
                components={mdxComponents}
              />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// Generate static pages for all posts, including the contact page
export async function generateStaticParams() {
  const posts = getPostsLocally();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
