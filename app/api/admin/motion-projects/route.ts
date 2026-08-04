import { NextResponse } from "next/server";
import { requireAdmin, readJson, parseTags } from "@/lib/admin-api";
import { parseYouTubeId } from "@/lib/youtube";
import { revalidatePath } from "next/cache";

const TABLE = "motion_projects";

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

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{
    title?: string;
    description?: string;
    youtube?: string; // ID or full URL — parsed server-side
    thumbnail_url?: string;
    tags?: string;
  }>(req);
  if (!body?.title?.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const youtube_id = parseYouTubeId(body.youtube ?? "");
  if (!youtube_id) {
    return NextResponse.json(
      { error: "A valid YouTube URL or 11-character video ID is required." },
      { status: 400 }
    );
  }
  const { data, error } = await guard.client
    .from(TABLE)
    .insert({
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      youtube_id,
      thumbnail_url: body.thumbnail_url?.trim() || null,
      tags: parseTags(body.tags),
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/motion");
  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{
    id?: string;
    title?: string;
    description?: string;
    youtube?: string;
    thumbnail_url?: string;
    tags?: string;
  }>(req);
  if (!body?.id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  const youtube_id = parseYouTubeId(body.youtube ?? "");
  if (!youtube_id) {
    return NextResponse.json(
      { error: "A valid YouTube URL or 11-character video ID is required." },
      { status: 400 }
    );
  }
  const { data, error } = await guard.client
    .from(TABLE)
    .update({
      title: body.title?.trim(),
      description: body.description?.trim() ?? "",
      youtube_id,
      thumbnail_url: body.thumbnail_url?.trim() || null,
      tags: parseTags(body.tags),
    })
    .eq("id", body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/motion");
  return NextResponse.json({ data });
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
  const { error } = await guard.client.from(TABLE).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/motion");
  return NextResponse.json({ ok: true });
}
