"use client";

import { deletePost } from "@/app/admin/actions";

export default function DeleteButton({ slug }) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        if (!confirm(`Delete /${slug}? This creates a commit removing the file.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="text-sm text-red-500 transition-opacity hover:opacity-80"
      >
        Delete
      </button>
    </form>
  );
}
