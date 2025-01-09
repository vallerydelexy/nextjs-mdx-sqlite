import { PrismaClient } from "@prisma/client";
import { getPostsLocally } from "@/utils/helper";

const prisma = new PrismaClient();



async function main() {
  const posts = getPostsLocally();

  for (const post of posts) {
    const { metadata, slug, content } = post;

    await prisma.post.upsert({
      where: { slug },
      update: {},
      create: {
        title: metadata.title || slug,
        description: metadata.description || "",
        slug,
        cover: metadata.cover || "",
        content,
      },
    });

    console.log(`Seeded post: ${slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
