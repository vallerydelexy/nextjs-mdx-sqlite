import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {getPostBySlug} from "@/utils/helper";
import Grain from "@/components/Grain";
import { mdxOptions } from "@/config/mdxOptions";
import posts from "../blog/posts.json";

export default async function Blog({ params }) {
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);
  const date = post.createdAt === post.updatedAt ? new Date(post.createdAt).toDateString() : `updated ${new Date(post.updatedAt).toDateString()}` ?? '';

  if (!post) {
    notFound();
  }
  return (
    <article className="prose dark:prose-invert max-w-7xl mx-auto py-[4em]">
      <Grain />
      <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
      <span className="block text-sm text-center">{date}</span>
      {post.description && <p className="text-center block">{post.description}</p>}
      <div className="max-w-[36em] mx-auto shadow-lg">
        <img
          className="rounded object-cover"
          src={post.cover}
          alt={post.title}
        />
      </div>
      
      <div className="prose dark:prose-invert max-w-2xl mx-auto px-4 md:px-0">
        <MDXRemote source={post.content} options={mdxOptions} />
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
