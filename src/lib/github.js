import "server-only";
import { parsePost } from "./frontmatter";

const API = "https://api.github.com";
const repo = process.env.GITHUB_REPO || "vallerydelexy/nextjs-mdx-sqlite";
const branch = process.env.GITHUB_BRANCH || "main";
const token = process.env.GITHUB_TOKEN;

export const isDryRun = process.env.GITHUB_DRY_RUN === "true";
const isPreview = process.env.VERCEL_ENV === "preview";

async function gh(path, init = {}) {
  if (!token) throw new Error("GITHUB_TOKEN is not set");

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(
      `GitHub ${init.method || "GET"} ${path} failed (${res.status}): ${detail}`
    );
  }

  return res.status === 204 ? null : res.json();
}

export async function getFile(path) {
  const data = await gh(`/repos/${repo}/contents/${path}?ref=${branch}`);
  if (!data || Array.isArray(data)) return null;

  return {
    content: Buffer.from(data.content, "base64").toString("utf8"),
    sha: data.sha,
  };
}

export async function listPosts() {
  const entries = await gh(`/repos/${repo}/contents/posts?ref=${branch}`);
  if (!Array.isArray(entries)) return [];

  const posts = await Promise.all(
    entries
      .filter((entry) => entry.type === "file" && /\.mdx?$/.test(entry.name))
      .map(async (entry) => {
        const file = await getFile(entry.path);
        if (!file) return null;

        const { data } = parsePost(file.content);
        return {
          ...data,
          slug: entry.name.replace(/\.mdx?$/, ""),
          cover: data.cover
            ? data.cover.startsWith("/")
              ? data.cover
              : `/${data.cover}`
            : "",
        };
      })
  );

  return posts
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

export async function commitFiles({ message, upserts = [], deletes = [] }) {
  if (isPreview) {
    throw new Error("Admin writes are disabled on preview deployments.");
  }

  if (isDryRun) {
    return { sha: "dry-run", html_url: null, dryRun: true };
  }

  const ref = await gh(`/repos/${repo}/git/ref/heads/${branch}`);
  if (!ref) throw new Error(`Branch ${branch} not found`);

  const parentSha = ref.object.sha;
  const parent = await gh(`/repos/${repo}/git/commits/${parentSha}`);

  const tree = [];

  for (const file of upserts) {
    const blob = await gh(`/repos/${repo}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({
        content: Buffer.from(file.content).toString("base64"),
        encoding: "base64",
      }),
    });

    tree.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  for (const path of deletes) {
    tree.push({ path, mode: "100644", type: "blob", sha: null });
  }

  const newTree = await gh(`/repos/${repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });

  const commit = await gh(`/repos/${repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [parentSha],
    }),
  });

  try {
    await gh(`/repos/${repo}/git/refs/heads/${branch}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });
  } catch (error) {
    if (String(error.message).includes("(422)")) {
      throw new Error(
        "The repository changed while saving. Please try again."
      );
    }
    throw error;
  }

  return commit;
}
