"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MDXRemote } from "next-mdx-remote";
import { savePost } from "@/app/admin/actions";
import { mdxComponents } from "@/components/MdxComponents";
import { slugify } from "@/lib/slug";

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function toDateInput(value) {
  return typeof value === "string" ? value.slice(0, 10) : "";
}

function normalizeCover(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith("/") ? value : `/${value}`;
}

export default function PostEditor({ initialPost }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(savePost, {});
  const lastSaved = useRef("");

  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost?.slug));
  const [description, setDescription] = useState(initialPost?.description || "");
  const [date, setDate] = useState(toDateInput(initialPost?.date) || today());
  const [cover, setCover] = useState(initialPost?.cover || "");
  const [tags, setTags] = useState(
    Array.isArray(initialPost?.tags)
      ? initialPost.tags.join(", ")
      : initialPost?.tags || ""
  );
  const [content, setContent] = useState(initialPost?.content || "");
  const [originalSlug, setOriginalSlug] = useState(initialPost?.slug || "");

  const [compiledSource, setCompiledSource] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const uploadMode = useRef("content");

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!state?.ok || lastSaved.current === state.slug) return;
    lastSaved.current = state.slug;
    setOriginalSlug(state.slug);

    if (state.slug !== initialPost?.slug) {
      router.replace(`/admin/${state.slug}`);
    } else {
      router.refresh();
    }
  }, [state, initialPost, router]);

  function handleTitleChange(value) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSlugChange(value) {
    setSlug(slugify(value));
    setSlugTouched(true);
  }

  function handleContentChange(value) {
    setContent(value);
    if (showPreview) setShowPreview(false);
  }

  function insertAtCursor(text) {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((value) => value + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = content.slice(0, start) + text + content.slice(end);
    setContent(next);
    if (showPreview) setShowPreview(false);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    });
  }

  function wrapSelection(before, after = before, placeholder = "") {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((value) => value + before + placeholder + after);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(next);
    if (showPreview) setShowPreview(false);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    });
  }

  function startUpload(mode) {
    uploadMode.current = mode;
    fileInputRef.current?.click();
  }

  async function prepareImage(file) {
    if (file.type === "image/gif") return file;
    if (file.size <= 1024 * 1024) return file;

    try {
      const bitmap = await createImageBitmap(file);
      const maxWidth = 1600;
      const scale = Math.min(1, maxWidth / bitmap.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.82)
      );
      if (!blob) return file;

      const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
      return new File([blob], name, { type: "image/webp" });
    } catch {
      return file;
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError("");

    if (file.size > 4 * 1024 * 1024) {
      setUploadError("Image must be under 4 MB.");
      return;
    }

    setUploading(true);
    try {
      const prepared = await prepareImage(file);
      if (prepared.size > 4 * 1024 * 1024) {
        throw new Error("Image is still over 4 MB after compression.");
      }

      const body = new FormData();
      body.set("file", prepared);
      body.set("slug", originalSlug || slug || "uploads");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      if (uploadMode.current === "cover") {
        setCover(data.url);
      } else {
        const alt = prepared.name.replace(/\.[^.]+$/, "");
        insertAtCursor(`![${alt}](${data.url})`);
      }
    } catch (cause) {
      setUploadError(cause.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handlePreview() {
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    setPreviewError("");
    setPreviewLoading(true);

    try {
      const response = await fetch("/api/admin/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Preview failed.");
      }

      setCompiledSource(data.compiledSource);
      setShowPreview(true);
    } catch (cause) {
      setPreviewError(cause.message || "Preview failed.");
    } finally {
      setPreviewLoading(false);
    }
  }

  const coverPreview = normalizeCover(cover);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="originalSlug" value={originalSlug} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            className="w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            className="w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="post-slug"
          />
          <p className="mt-1 text-xs text-muted-foreground">/{slug || "post-slug"}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="Short description used for cards and metadata"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="cover">
            Cover
          </label>
          <div className="flex gap-2">
            <input
              id="cover"
              name="cover"
              value={cover}
              onChange={(event) => setCover(event.target.value)}
              className="w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="/images/post/cover.webp"
            />
            <button
              type="button"
              onClick={() => startUpload("cover")}
              disabled={uploading}
              className="shrink-0 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Cover preview"
              className="mt-2 h-24 w-full rounded-md border object-cover"
            />
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="react, nextjs, go"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <label className="mr-auto block text-sm font-medium" htmlFor="content">
            Content
          </label>
          <button type="button" onClick={() => wrapSelection("**", "**", "bold")} className="rounded border px-2 py-1 text-xs hover:bg-muted">
            Bold
          </button>
          <button type="button" onClick={() => wrapSelection("*", "*", "italic")} className="rounded border px-2 py-1 text-xs hover:bg-muted">
            Italic
          </button>
          <button type="button" onClick={() => insertAtCursor("## ")} className="rounded border px-2 py-1 text-xs hover:bg-muted">
            H2
          </button>
          <button type="button" onClick={() => wrapSelection("[", "](https://)", "link text")} className="rounded border px-2 py-1 text-xs hover:bg-muted">
            Link
          </button>
          <button type="button" onClick={() => wrapSelection("`", "`", "code")} className="rounded border px-2 py-1 text-xs hover:bg-muted">
            Code
          </button>
          <button type="button" onClick={() => insertAtCursor("\n```\n\n```\n")} className="rounded border px-2 py-1 text-xs hover:bg-muted">
            Code block
          </button>
          <button type="button" onClick={() => startUpload("content")} disabled={uploading} className="rounded border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50">
            {uploading ? "Uploading..." : "Image"}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={handleFileChange}
          className="hidden"
        />

        <textarea
          id="content"
          name="content"
          ref={textareaRef}
          value={content}
          onChange={(event) => handleContentChange(event.target.value)}
          rows={24}
          className="w-full rounded-md border bg-transparent p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="Write in Markdown or MDX..."
        />

        {uploadError && (
          <p className="mt-2 text-sm text-red-500">{uploadError}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : initialPost
              ? "Save changes"
              : "Create post"}
        </button>

        <button
          type="button"
          onClick={handlePreview}
          disabled={previewLoading || !content}
          className="rounded-md border px-4 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50"
        >
          {previewLoading ? "Rendering..." : showPreview ? "Hide preview" : "Preview"}
        </button>

        <a
          href="/admin"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </a>

        {originalSlug && (
          <a
            href={`/${originalSlug}`}
            target="_blank"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View post
          </a>
        )}
      </div>

      {state?.error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {state.error}
        </p>
      )}

      {state?.ok && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-600">
          {state.dryRun ? (
            "Dry run: no commit was made."
          ) : (
            <>
              Committed.{" "}
              {state.commitUrl && (
                <a
                  href={state.commitUrl}
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  View commit
                </a>
              )}{" "}
              Vercel is rebuilding the public site.
            </>
          )}
        </div>
      )}

      {previewError && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {previewError}
        </p>
      )}

      {showPreview && compiledSource && (
        <div className="rounded-md border p-6">
          <div className="prose dark:prose-invert max-w-none">
            <MDXRemote compiledSource={compiledSource} components={mdxComponents} />
          </div>
        </div>
      )}
    </form>
  );
}
