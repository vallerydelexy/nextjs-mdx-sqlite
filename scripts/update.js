import { PrismaClient } from "@prisma/client";
import { readdirSync, readFileSync, statSync } from "fs";
import { join, extname, basename } from "path";

const prisma = new PrismaClient();

function parseFrontmatter(fileContent) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match[1];
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim()] = value;
  });

  return { metadata: metadata, content: content };
}

function getMDXFiles(dir) {
  return readdirSync(dir).filter((file) => {
    const ext = extname(file).toLowerCase();
    return ext === ".md" || ext === ".mdx";
  });
}

function readMDXFile(filePath) {
  const rawContent = readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(join(dir.toString(), file));
    const slug = basename(file, extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPostsLocally() {
  return getMDXData(join(process.cwd(), "posts"));
}

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
