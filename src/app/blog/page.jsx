import Link from "next/link";
import { getPosts } from "@/lib/utils";
import BlogPagination from "@/components/BlogPagination";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Blog({ searchParams }) {
  const page = parseInt((await searchParams).page || 1);
  const pageSize = 1;
  const { posts, totalPosts } = await getPosts(page, pageSize);

  const totalPages = Math.ceil(totalPosts / pageSize);

  return (
    <main className="">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Blog posts
      </h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="flex flex-col gap-6">
            <Link href={`/${post.slug}`} className="w-full mb-6">
              <Card className="flex">
                {post.cover && <div className="w-1/6"><img className="rounded object-cover" src={post.cover} alt={post.title} /></div>}
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
              </Card>
              
            </Link>
          </li>
        ))}
      </ul>
      <BlogPagination page={page} totalPages={totalPages} />
    </main>
  );
}
