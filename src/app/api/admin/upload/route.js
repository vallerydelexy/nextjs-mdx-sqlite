import { getAdminSession } from "@/lib/admin-auth";
import { commitFiles, isDryRun } from "@/lib/github";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(request) {
  if (!(await getAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDryRun) {
    return Response.json(
      { error: "Image uploads are disabled in dry-run mode." },
      { status: 400 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
    return Response.json({ error: "Missing file." }, { status: 400 });
  }

  if (file.size > 4 * 1024 * 1024) {
    return Response.json({ error: "Image must be under 4 MB." }, { status: 400 });
  }

  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return Response.json(
      { error: "Use a JPEG, PNG, WebP, GIF, or AVIF image." },
      { status: 400 }
    );
  }

  const folder = slugify(String(form.get("slug") || "uploads")) || "uploads";
  const baseName =
    slugify(String(file.name || "").replace(/\.[^.]+$/, "")) || "image";
  const path = `public/images/${folder}/${Date.now()}-${baseName}.${extension}`;

  try {
    await commitFiles({
      message: `content: upload ${path}`,
      upserts: [
        {
          path,
          content: Buffer.from(await file.arrayBuffer()),
        },
      ],
    });

    return Response.json({
      url: `/${path.replace(/^public\//, "")}`,
    });
  } catch (error) {
    console.error("Image upload failed", error);
    return Response.json({ error: "Could not upload the image." }, { status: 500 });
  }
}
