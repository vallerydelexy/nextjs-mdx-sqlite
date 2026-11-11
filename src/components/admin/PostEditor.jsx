"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Save,
} from "lucide-react";
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
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="originalSlug" value={originalSlug} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
            Blog post
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            {initialPost ? "Edit post" : "New post"}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-stone-500 dark:text-stone-400">
            Saving commits to the repository and triggers a Vercel rebuild.
          </p>
        </div>

        {originalSlug && (
          <a
            href={`/${originalSlug}`}
            target="_blank"
            rel="noreferrer"
            className="admin-ghost-button px-3 text-xs"
          >
            View post
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        )}
      </div>

      <section className="border-t border-stone-900/10 pt-6 dark:border-white/10">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Post details
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Title, URL, date, and the summary shown on cards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              className="admin-field"
              placeholder="Post title"
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300"
              htmlFor="slug"
            >
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => handleSlugChange(event.target.value)}
              className="admin-field"
              placeholder="post-slug"
            />
            <p className="mt-1.5 font-mono text-xs text-stone-500 dark:text-stone-400">
              /{slug || "post-slug"}
            </p>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300"
              htmlFor="date"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="admin-field"
            />
          </div>

          <div className="md:col-span-2">
            <label
              className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="admin-field min-h-[6rem] resize-y"
              placeholder="Short description used for cards and metadata"
            />
          </div>

          <div className="md:col-span-2">
            <label
              className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300"
              htmlFor="tags"
            >
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="admin-field"
              placeholder="react, nextjs, go"
            />
            <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
              Comma separated. Optional.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-900/10 pt-6 dark:border-white/10">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Cover
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Used on the blog card and the post header.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row">
          <input
            id="cover"
            name="cover"
            value={cover}
            onChange={(event) => setCover(event.target.value)}
            className="admin-field"
            placeholder="/images/post/cover.webp"
          />
          <button
            type="button"
            onClick={() => startUpload("cover")}
            disabled={uploading}
            className="admin-ghost-button shrink-0"
          >
            <ImagePlus className="size-4" aria-hidden="true" />
            {uploading ? "Uploading..." : "Upload cover"}
          </button>
        </div>

        {uploadError && uploadMode.current === "cover" && (
          <p
            role="alert"
            className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 backdrop-blur-xl dark:text-red-300"
          >
            {uploadError}
          </p>
        )}

        {coverPreview && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-stone-900/10 bg-white/40 p-2 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
            <img
              src={coverPreview}
              alt="Cover preview"
              className="h-40 w-full rounded-xl object-cover"
            />
          </div>
        )}
      </section>

      <section className="border-t border-stone-900/10 pt-6 dark:border-white/10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Content
            </h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Markdown or MDX. The toolbar inserts syntax at the cursor.
            </p>
          </div>
          <span className="liquid-glass-pill rounded-full px-3 py-1 text-xs font-medium text-stone-600 dark:text-stone-300">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>

        <div className="admin-editor-shell">
          <div className="admin-editor-toolbar">
            <button
              type="button"
              onClick={() => wrapSelection("**", "**", "bold")}
              className="admin-tool"
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("*", "*", "italic")}
              className="admin-tool"
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("## ")}
              className="admin-tool"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("[", "](https://)", "link text")}
              className="admin-tool"
            >
              Link
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("`", "`", "code")}
              className="admin-tool"
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("\n```\n\n```\n")}
              className="admin-tool"
            >
              Code block
            </button>
            <button
              type="button"
              onClick={() => startUpload("content")}
              disabled={uploading}
              className="admin-tool"
            >
              <ImagePlus className="size-3.5" aria-hidden="true" />
              {uploading ? "Uploading..." : "Image"}
            </button>
            <span className="ml-auto px-1 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
              MDX
            </span>
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
            className="admin-field-mono block min-h-[28rem] w-full resize-y border-0 bg-transparent p-4 text-stone-900 outline-none placeholder:text-stone-500 dark:text-stone-100 dark:placeholder:text-stone-400"
            placeholder="Write in Markdown or MDX..."
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-900/10 px-4 py-2.5 text-xs text-stone-500 dark:border-white/10 dark:text-stone-400">
            <span>
              {wordCount} words · {content.length} characters
            </span>
            <span>Markdown / MDX</span>
          </div>
        </div>

        {uploadError && uploadMode.current === "content" && (
          <p
            role="alert"
            className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 backdrop-blur-xl dark:text-red-300"
          >
            {uploadError}
          </p>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-900/10 pt-6 dark:border-white/10">
        <button type="submit" disabled={isPending} className="admin-primary-button">
          <Save className="size-4" aria-hidden="true" />
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
          aria-expanded={showPreview}
          aria-controls="post-preview"
          className="admin-ghost-button"
        >
          {showPreview ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
          {previewLoading
            ? "Rendering..."
            : showPreview
              ? "Hide preview"
              : "Preview"}
        </button>

        <a
          href="/admin"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Cancel
        </a>

        <span className="ml-auto text-xs text-stone-500 dark:text-stone-400">
          Commits to <span className="font-mono">main</span>
        </span>
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 backdrop-blur-xl dark:text-red-300"
        >
          {state.error}
        </p>
      )}

      {state?.ok && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 backdrop-blur-xl dark:text-emerald-300"
        >
          {state.dryRun ? (
            "Dry run: no commit was made."
          ) : (
            <>
              Committed.{" "}
              {state.commitUrl && (
                <a
                  href={state.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
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
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 backdrop-blur-xl dark:text-red-300"
        >
          {previewError}
        </p>
      )}

      {showPreview && compiledSource && (
        <section
          id="post-preview"
          className="rounded-2xl border border-stone-900/10 bg-white/60 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#050917]/75"
        >
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-stone-900/10 pb-3 dark:border-white/10">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Preview
            </h2>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="text-xs text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              Hide
            </button>
          </div>
          <div className="prose prose-stone max-h-[70vh] max-w-none overflow-y-auto pr-1 dark:prose-invert">
            <MDXRemote
              compiledSource={compiledSource}
              components={mdxComponents}
            />
          </div>
        </section>
      )}
    </form>
  );
}
