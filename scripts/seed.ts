const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const postsDir = path.join(process.cwd(), 'src', 'app', 'posts');
  const postFiles = fs.readdirSync(postsDir);

  for (const file of postFiles) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const slug = file.replace(/\.mdx$/, '');

    await prisma.post.upsert({
      where: { slug },
      update: {},
      create: {
        title: slug,
        slug,
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