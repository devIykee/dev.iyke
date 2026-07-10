import "server-only";
import { getServiceClient } from "./supabase";
import type { Persona } from "./types";

const BUCKET = "media";
const FALLBACK = "/iyke-profile.jpg";

/**
 * Resolves the hero photo URL for a persona. Admin uploads land at the canonical
 * Storage path hero/<persona>; if none exists yet we fall back to the bundled
 * profile image. Uses the service client to reliably list objects (public
 * listing can be restricted). Returns a plain URL string.
 */
export async function getHeroImage(persona: Persona): Promise<string> {
  const client = getServiceClient();
  if (!client) return FALLBACK;
  try {
    const { data, error } = await client.storage
      .from(BUCKET)
      .list("hero", { search: persona });
    if (error || !data?.some((f) => f.name === persona)) return FALLBACK;
    const { data: pub } = client.storage
      .from(BUCKET)
      .getPublicUrl(`hero/${persona}`);
    // Version by updated time so replacements bust the CDN/browser cache.
    const meta = data.find((f) => f.name === persona);
    const v = meta?.updated_at ? Date.parse(meta.updated_at) : 0;
    return `${pub.publicUrl}?v=${v}`;
  } catch {
    return FALLBACK;
  }
}

export async function getAllHeroImages(): Promise<Record<Persona, string>> {
  const [developer, motion, writer] = await Promise.all([
    getHeroImage("developer"),
    getHeroImage("motion"),
    getHeroImage("writer"),
  ]);
  return { developer, motion, writer };
}
