import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import type { Persona } from "@/lib/types";

const BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const PERSONAS: Persona[] = ["developer", "motion", "writer"];

/**
 * Per-persona hero photo upload. Session-guarded. Stores at a STABLE path
 * (hero/<persona>) with upsert so replacing the photo needs no DB column — the
 * public site derives the URL from the same path. Returns the public URL.
 */
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const form = await req.formData().catch(() => null);
  const persona = String(form?.get("persona") ?? "") as Persona;
  const file = form?.get("file");

  if (!PERSONAS.includes(persona)) {
    return NextResponse.json({ error: "Invalid persona." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 5MB." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  const path = `hero/${persona}`; // canonical, extensionless → deterministic URL
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await guard.client.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Revalidate the persona page so the new hero shows immediately.
  const { data } = guard.client.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json(
    { url: `${data.publicUrl}?v=${Date.now() % 100000}` },
    { status: 201 }
  );
}
