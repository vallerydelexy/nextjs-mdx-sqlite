import Link from "next/link";
import Image from "next/image";
import BlogPagination from "@/components/BlogPagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Blog Posts",
    description: "Read our latest blog posts",
  };
}

export default async function Blog({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam || "1"), 10) || 1);
  const pageSize = 9;
  const allPosts = await getAllPosts();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const posts = allPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 mt-12">
        {posts.map((post) => {
          const excerpt = post.content.trim().split(/\s+/).slice(0, 20).join(" ");

          return (
            <div key={post.slug}>
              <Card className="overflow-hidden">
                <Link href={`/${post.slug}`}>
                  {post.cover && (
                    <Image
                      src={post.cover}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.description || excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          );
        })}
      </div>

      <BlogPagination page={currentPage} totalPages={totalPages} />
    </main>
  );
}
