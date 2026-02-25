import Link from "next/link";
import Image from "next/image";
import BlogPagination from "@/components/BlogPagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import posts from "./posts.json";

export const revalidate = 3600; // Revalidate every hour

// Add dynamic metadata
export async function generateMetadata() {
  return {
    title: "Blog Posts",
    description: "Read our latest blog posts",
  };
}

export default async function Blog({ searchParams }) {
  const page = parseInt((await searchParams).page || 1);
  const pageSize = 9;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);

  return (
    <main>
      {/* <h1 className="text-3xl font-bold mb-4 text-center">Blog posts</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 mt-12">
        {posts.map((post) => (
          <div key={post.id}>
            <Card className="overflow-hidden">
              <Link href={`/${post.slug}`}>
                <Image
                  src={`/${post.cover}`}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-xl font-semibold line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.content.trim().split(" ").slice(0, 20).join(" ")}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {post.date}
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        ))}
      </div>

      <BlogPagination page={page} totalPages={totalPages} />
    </main>
  );
}
