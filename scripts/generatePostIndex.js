import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
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

function generateExcerpt(content) {
  return content.split(" ").slice(0, 20).join(" ");
}

function getMDXData(dir) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(join(dir.toString(), file));
    const slug = basename(file, extname(file));
    const trimmedContent = generateExcerpt(content);
    const createdAt = statSync(join(dir, file)).birthtime;
    const updatedAt = statSync(join(dir, file)).mtime;
    return {
      title: metadata.title,
      description: metadata.description ?? '',
      cover: metadata.cover ?? '',
      slug,
      content: trimmedContent,
      createdAt,
      updatedAt
    };
  });
}

async function main() {
    const posts = getMDXData(join(process.cwd(), "posts"));
    writeFileSync("src/app/blog/posts.json", JSON.stringify(posts));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
