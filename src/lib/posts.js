import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { cache } from "react";
import { parsePost } from "./frontmatter";

const postsDir = join(process.cwd(), "posts");

export function publicPath(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

export const getAllPosts = cache(() => {
  return readdirSync(postsDir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const slug = basename(file).replace(/\.mdx?$/, "");
      const { data, content } = parsePost(readFileSync(join(postsDir, file), "utf8"));

      if (!data.title) throw new Error(`Missing title in posts/${file}`);
      if (!data.date) throw new Error(`Missing date in posts/${file}`);

      return {
        ...data,
        slug,
        content,
        cover: publicPath(data.cover),
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

export const getPost = cache((slug) => {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
});

export function getAllSlugs() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}
