import { serialize } from "next-mdx-remote/serialize";
import { getAdminSession } from "@/lib/admin-auth";
import { mdxOptions } from "@/config/mdxOptions";

export const runtime = "nodejs";

export async function POST(request) {
  if (!(await getAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let content = "";

  try {
    const body = await request.json();
    content = typeof body.content === "string" ? body.content : "";
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!content.trim()) {
    return Response.json({ error: "Nothing to preview." }, { status: 400 });
  }

  if (content.length > 500_000) {
    return Response.json(
      { error: "Content is too large to preview." },
      { status: 400 }
    );
  }

  try {
    const { compiledSource } = await serialize(content, {
      mdxOptions: mdxOptions.mdxOptions,
    });

    return Response.json(
      { compiledSource },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Preview failed", error);
    return Response.json(
      { error: "Could not render the preview." },
      { status: 400 }
    );
  }
}
