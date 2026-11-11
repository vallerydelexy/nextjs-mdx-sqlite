"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { commitFiles, getFile } from "@/lib/github";
import { serializePost } from "@/lib/frontmatter";
import { slugify } from "@/lib/slug";

const RESERVED = new Set([
  "admin",
  "login",
  "api",
  "blog",
  "images",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

export async function savePost(prevState, formData) {
  if (!(await getAdminSession())) {
    return { error: "Unauthorized" };
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const content = String(formData.get("content") || "");
  const cover = String(formData.get("cover") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const originalSlug = String(formData.get("originalSlug") || "").trim();
  const slug = slugify(formData.get("slug") || title);

  if (!title) return { error: "Title is required." };
  if (!content.trim()) return { error: "Content is required." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Date must be YYYY-MM-DD." };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Invalid slug." };
  }
  if (RESERVED.has(slug)) {
    return { error: "That slug is reserved by an app route." };
  }
  if (content.length > 500_000) {
    return { error: "Post is too large." };
  }
  if (tags.length > 10) {
    return { error: "Use at most 10 tags." };
  }

  try {
    const existing = await getFile(`posts/${slug}.md`);
    if (existing && slug !== originalSlug) {
      return { error: "A post with that slug already exists." };
    }

    const updated = new Date().toISOString().slice(0, 10);
    const raw = serializePost(
      { title, description, date, updated, cover, tags },
      content
    );

    const commit = await commitFiles({
      message: `${originalSlug ? "content: update" : "content: create"} ${slug}`,
      upserts: [{ path: `posts/${slug}.md`, content: Buffer.from(raw, "utf8") }],
      deletes:
        originalSlug && originalSlug !== slug
          ? [`posts/${originalSlug}.md`]
          : [],
    });

    revalidatePath("/admin");
    revalidatePath("/blog");
    revalidatePath(`/${slug}`);
    if (originalSlug && originalSlug !== slug) {
      revalidatePath(`/${originalSlug}`);
    }

    return {
      ok: true,
      slug,
      commitUrl: commit.html_url,
      dryRun: Boolean(commit.dryRun),
    };
  } catch (error) {
    console.error("savePost failed", error);
    return { error: "Could not save the post. Check the GitHub token and try again." };
  }
}

export async function deletePost(formData) {
  if (!(await getAdminSession())) {
    return { error: "Unauthorized" };
  }

  const slug = slugify(formData.get("slug"));
  if (!slug || RESERVED.has(slug)) {
    return { error: "Invalid slug." };
  }

  try {
    await commitFiles({
      message: `content: delete ${slug}`,
      deletes: [`posts/${slug}.md`],
    });
  } catch (error) {
    console.error("deletePost failed", error);
    return { error: "Could not delete the post." };
  }

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/${slug}`);
  redirect("/admin");
}
