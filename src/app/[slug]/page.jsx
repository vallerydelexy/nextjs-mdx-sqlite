import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import Link from "next/link";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPosts() {
  const posts = await prisma.post.findMany();
  return posts;
}

async function getPost(slug) {
  const post = await prisma.post.findUnique({
    where: { slug }
  });
  return post;
}

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Blog({
  params,
}) {
  const slug = (await params).slug;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <header>
        <nav>
          <Link href="/">👈 Go back home</Link>
        </nav>
      </header>
      <main>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        {post.description && (
          <p>{post.description}</p>
        )}
        <article className="prose">
          <CustomMDX source={post.content} />
        </article>
      </main>
    </>
  );
}
