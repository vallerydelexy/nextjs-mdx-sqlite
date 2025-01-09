import { readdirSync, readFileSync, statSync } from "fs";
import { join, extname, basename } from "path";

const postsDir = join(process.cwd(), "posts");

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  export function slugify(string) {
    if(string){
      return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    }
  }

  export function getSlugFromReqeustUrl (request){
    return /[^/]+$/.exec(request.nextUrl.pathname)[0]
  }

  export function tanggal (date){
    return new Date(date).toLocaleDateString("id-ID", {year: 'numeric', month: 'long', day: 'numeric'})
  }
  
  export function parseFrontmatter(fileContent) {
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

export function getMDXFiles(dir) {
  return readdirSync(dir).filter((file) => {
    const ext = extname(file).toLowerCase();
    return ext === ".md" || ext === ".mdx";
  });
}

export function readMDXFile(filePath) {
  const rawContent = readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

export function getMDXData(dir) {
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
  return getMDXData(postsDir);
}


export function generateExcerpt(content) {
  return content.split(" ").slice(0, 20).join(" ");
}

export async function getPostBySlug(slug) {
  const dir = postsDir;
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

  return null;
}