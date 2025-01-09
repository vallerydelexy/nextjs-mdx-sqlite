import { PrismaClient } from "@prisma/client";
import { getPostsLocally } from "@/utils/helper";

const prisma = new PrismaClient();


async function updatePosts() {
  const posts = getPostsLocally();

  for (const post of posts) {
    const { metadata, slug, content } = post;

    // Find the post by slug
    const existingPost = await prisma.post.findUnique({ where: { slug } });

    if (existingPost) {
      // Update the post if it exists
      await prisma.post.update({
        where: { slug },
        data: {
          title: metadata.title || existingPost.title,
          description: metadata.description || existingPost.description,
          cover: metadata.cover || existingPost.cover,
          content: content || existingPost.content,
        },
      });
      console.log(`Updated post: ${slug}`);
    } else {
      console.log(`Post not found: ${slug}`);
    }
  }
}

updatePosts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
