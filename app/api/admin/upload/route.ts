import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";

const BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];

/**
 * Admin image upload → Supabase Storage. Session-guarded; uses the service-role
 * client. Returns the public URL to store in a project/collaboration field.
 */
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 5MB." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  // Timestamp + sanitized name; unique enough without needing Math.random.
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 40);
  const path = `${Date.now()}-${safe || "upload"}.${ext}`.replace(/\.+/g, ".");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await guard.client.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = guard.client.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
