"use client";

import { Trash2 } from "lucide-react";
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
      <button type="submit" className="admin-danger-button px-3 text-xs">
        <Trash2 className="size-3.5" aria-hidden="true" />
        Delete
      </button>
    </form>
  );
}
