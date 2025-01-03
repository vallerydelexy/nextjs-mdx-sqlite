import { PrismaClient } from '@prisma/client';
import { serialize } from 'next-mdx-remote/serialize';
import { notFound } from 'next/navigation';
import MDXContent from './page';

const prisma = new PrismaClient();

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug }
  });
  
  if (!post) {
    notFound();
  }
  
  const mdxSource = await serialize(post.content);
  return {
    ...post,
    content: mdxSource
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="prose">
        <MDXContent source={post.content} />
      </div>
    </div>
  );
}