import { statSync, writeFileSync } from "fs";
import { join, extname, basename } from "path";
import { getMDXFiles, readMDXFile, generateExcerpt } from "../src/utils/helper.js";


function generatePostIndex(dir) {
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
    const posts = generatePostIndex(join(process.cwd(), "posts"));
    writeFileSync("src/app/blog/posts.json", JSON.stringify(posts));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
