import { NextResponse } from "next/server";
import { requireAdmin, readJson } from "@/lib/admin-api";
import { revalidatePath } from "next/cache";

const TABLE = "tag_showcases";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { data, error } = await guard.client.from(TABLE).select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// PUT — upsert a showcase by tag_slug (blurb + featured project ids). One row
// per slug; conflicting inserts update in place.
export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{
    tag_slug?: string;
    intro_blurb?: string;
    project_ids?: string[];
  }>(req);
  if (!body?.tag_slug?.trim()) {
    return NextResponse.json({ error: "tag_slug is required." }, { status: 400 });
  }
  const project_ids = Array.isArray(body.project_ids)
    ? body.project_ids.filter((id) => typeof id === "string" && id.length > 0)
    : [];
  const { data, error } = await guard.client
    .from(TABLE)
    .upsert(
      {
        tag_slug: body.tag_slug.trim(),
        intro_blurb: body.intro_blurb?.trim() ?? "",
        project_ids,
      },
      { onConflict: "tag_slug" }
    )
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath(`/tags/${body.tag_slug.trim()}`);
  return NextResponse.json({ data });
}
