import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin, readJson } from "@/lib/admin-api";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";

const TABLE = "hero_tags";
const PERSONAS = ["developer", "motion", "writer"] as const;
type PersonaValue = (typeof PERSONAS)[number];

function normalizePersona(p?: string): PersonaValue | null {
  return PERSONAS.includes(p as PersonaValue) ? (p as PersonaValue) : null;
}

// Revalidate the persona's home page (and the affected showcase page).
function revalidateFor(persona: PersonaValue, slug?: string) {
  const home = persona === "developer" ? "/" : `/${persona}`;
  revalidatePath(home);
  if (slug) revalidatePath(`/tags/${slug}`);
}

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { data, error } = await guard.client
    .from(TABLE)
    .select("*")
    .order("persona", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// Next sort_order within a persona = max + 1.
async function nextOrder(client: SupabaseClient, persona: PersonaValue) {
  const { data } = await client
    .from(TABLE)
    .select("sort_order")
    .eq("persona", persona)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{ persona?: string; label?: string; slug?: string }>(req);
  const persona = normalizePersona(body?.persona);
  if (!persona) {
    return NextResponse.json({ error: "Valid persona is required." }, { status: 400 });
  }
  if (!body?.label?.trim()) {
    return NextResponse.json({ error: "Label is required." }, { status: 400 });
  }
  const slug = (body.slug?.trim() ? slugify(body.slug) : slugify(body.label)) || "tag";
  const sort_order = await nextOrder(guard.client, persona);
  const { data, error } = await guard.client
    .from(TABLE)
    .insert({ persona, label: body.label.trim(), slug, sort_order })
    .select()
    .single();
  if (error) {
    const msg =
      error.code === "23505"
        ? `This persona already has a "${slug}" tag — choose a different slug.`
        : error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  revalidateFor(persona, slug);
  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{
    id?: string;
    persona?: string;
    label?: string;
    slug?: string;
  }>(req);
  if (!body?.id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  const persona = normalizePersona(body.persona);
  const slug = body.slug?.trim() ? slugify(body.slug) : undefined;
  const { data, error } = await guard.client
    .from(TABLE)
    .update({
      ...(persona ? { persona } : {}),
      label: body.label?.trim(),
      ...(slug ? { slug } : {}),
    })
    .eq("id", body.id)
    .select()
    .single();
  if (error) {
    const msg =
      error.code === "23505"
        ? `This persona already has that slug — choose a different one.`
        : error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  revalidateFor((data?.persona as PersonaValue) ?? "developer", data?.slug);
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
  revalidatePath("/motion");
  revalidatePath("/writer");
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
  revalidatePath("/motion");
  revalidatePath("/writer");
  return NextResponse.json({ ok: true });
}
