import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPosts() {
  const posts = await prisma.post.findMany();
  return posts;
}

export default async function Home() {
  const posts = await getPosts();
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-2">
            <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}