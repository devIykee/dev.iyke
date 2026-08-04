import { NextResponse } from "next/server";
import { requireAdmin, readJson, parseTags } from "@/lib/admin-api";
import { revalidatePath } from "next/cache";

const TABLE = "dev_projects";

// GET — list (admin view). Uses service client so it works even before RLS read
// policies exist.
export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { data, error } = await guard.client
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST — create
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{
    title?: string;
    description?: string;
    screenshot_url?: string;
    link?: string;
    tags?: string;
    featured?: string | boolean;
  }>(req);
  if (!body?.title?.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const { data, error } = await guard.client
    .from(TABLE)
    .insert({
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      screenshot_url: body.screenshot_url?.trim() || null,
      link: body.link?.trim() || null,
      tags: parseTags(body.tags),
      featured: body.featured === true || body.featured === "true",
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/security-research");
  return NextResponse.json({ data }, { status: 201 });
}

// PUT — update
export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{
    id?: string;
    title?: string;
    description?: string;
    screenshot_url?: string;
    link?: string;
    tags?: string;
    featured?: string | boolean;
  }>(req);
  if (!body?.id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  const { data, error } = await guard.client
    .from(TABLE)
    .update({
      title: body.title?.trim(),
      description: body.description?.trim() ?? "",
      screenshot_url: body.screenshot_url?.trim() || null,
      link: body.link?.trim() || null,
      tags: parseTags(body.tags),
      featured: body.featured === true || body.featured === "true",
    })
    .eq("id", body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/security-research");
  return NextResponse.json({ data });
}

// DELETE — remove (id in query string)
export async function DELETE(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
  const { error } = await guard.client.from(TABLE).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/security-research");
  return NextResponse.json({ ok: true });
}
