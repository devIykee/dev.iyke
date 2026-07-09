import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin, readJson } from "@/lib/admin-api";
import { revalidatePath } from "next/cache";

const TABLE = "toolkit_items";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { data, error } = await guard.client
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// Next sort_order = max + 1, so new items append to the end.
async function nextOrder(client: SupabaseClient) {
  const { data } = await client
    .from(TABLE)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{ name?: string; icon_key?: string }>(req);
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  const sort_order = await nextOrder(guard.client);
  const { data, error } = await guard.client
    .from(TABLE)
    .insert({
      name: body.name.trim(),
      icon_key: body.icon_key?.trim() || "code",
      sort_order,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{ id?: string; name?: string; icon_key?: string }>(req);
  if (!body?.id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  const { data, error } = await guard.client
    .from(TABLE)
    .update({
      name: body.name?.trim(),
      icon_key: body.icon_key?.trim() || "code",
    })
    .eq("id", body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ data });
}

// PATCH — reorder. Body: { order: string[] } (ids in desired order).
export async function PATCH(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{ order?: string[] }>(req);
  if (!Array.isArray(body?.order)) {
    return NextResponse.json({ error: "order[] is required." }, { status: 400 });
  }
  // Persist each id's new index as its sort_order.
  const results = await Promise.all(
    body.order.map((id, index) =>
      guard.client.from(TABLE).update({ sort_order: index }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 500 });
  }
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
  const { error } = await guard.client.from(TABLE).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
