import { NextResponse } from "next/server";
import { requireAdmin, readJson } from "@/lib/admin-api";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";

const TABLE = "writer_posts";

// Postgres/PostgREST signals for "the status column doesn't exist yet"
// (migration 002 not applied). We strip status and retry so the writer admin
// keeps working before the migration is run.
function isMissingStatusColumn(err: { code?: string; message?: string }): boolean {
  return (
    err.code === "42703" ||
    /column .*status.* does not exist/i.test(err.message ?? "") ||
    /'status' column/i.test(err.message ?? "")
  );
}

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { data, error } = await guard.client
    .from(TABLE)
    .select("*")
    .order("date", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{
    title?: string;
    slug?: string;
    date?: string;
    excerpt?: string;
    body?: string;
    status?: string;
  }>(req);
  if (!body?.title?.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const slug = (body.slug?.trim() ? slugify(body.slug) : slugify(body.title)) || "post";
  const status = body.status === "draft" ? "draft" : "published";
  const baseRow = {
    title: body.title.trim(),
    slug,
    date: body.date?.trim() || new Date().toISOString().slice(0, 10),
    excerpt: body.excerpt?.trim() ?? "",
    body: body.body ?? "",
  };

  let { data, error } = await guard.client
    .from(TABLE)
    .insert({ ...baseRow, status })
    .select()
    .single();
  // Retry without status if migration 002 hasn't been applied.
  if (error && isMissingStatusColumn(error)) {
    ({ data, error } = await guard.client
      .from(TABLE)
      .insert(baseRow)
      .select()
      .single());
  }
  if (error) {
    const msg =
      error.code === "23505"
        ? `Slug "${slug}" already exists — choose a different title or slug.`
        : error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  revalidatePath("/writer");
  revalidatePath(`/writer/${slug}`);
  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await readJson<{
    id?: string;
    title?: string;
    slug?: string;
    date?: string;
    excerpt?: string;
    body?: string;
    status?: string;
  }>(req);
  if (!body?.id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  const slug = body.slug?.trim() ? slugify(body.slug) : undefined;
  const status = body.status === "draft" ? "draft" : "published";
  const baseRow = {
    title: body.title?.trim(),
    ...(slug ? { slug } : {}),
    date: body.date?.trim(),
    excerpt: body.excerpt?.trim() ?? "",
    body: body.body ?? "",
  };

  let { data, error } = await guard.client
    .from(TABLE)
    .update({ ...baseRow, status })
    .eq("id", body.id)
    .select()
    .single();
  if (error && isMissingStatusColumn(error)) {
    ({ data, error } = await guard.client
      .from(TABLE)
      .update(baseRow)
      .eq("id", body.id)
      .select()
      .single());
  }
  if (error) {
    const msg =
      error.code === "23505"
        ? `Slug "${slug}" already exists — choose a different slug.`
        : error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  revalidatePath("/writer");
  if (data?.slug) revalidatePath(`/writer/${data.slug}`);
  return NextResponse.json({ data });
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
  const { error } = await guard.client.from(TABLE).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/writer");
  return NextResponse.json({ ok: true });
}
