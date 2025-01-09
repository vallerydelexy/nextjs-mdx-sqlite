import { readdirSync, readFileSync, statSync } from "fs";
import { join, extname, basename } from "path";

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
    value = value.replace(/^['"](.*)['"]$/, "$1");
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

export default async function getPostsLocally(slug) {
  const dir = join(process.cwd(), "posts");
  const mdxFiles = getMDXFiles(dir);

  for (const file of mdxFiles) {
    const filePath = join(dir, file);
    const { metadata, content } = readMDXFile(filePath);
    const fileSlug = basename(file, extname(file));

    if (fileSlug === slug) {
      const createdAt = statSync(filePath).birthtime;
      const updatedAt = statSync(filePath).mtime;

      return {
        title: metadata.title,
        description: metadata.description ?? '',
        cover: metadata.cover ?? '',
        slug: fileSlug,
        content,
        createdAt,
        updatedAt
      };
    }
  }

  return null; // Return null if no post with the matching slug is found
}