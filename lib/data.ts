import "server-only";
import { getAnonClient } from "./supabase";
import {
  seedDevProjects,
  seedMotionProjects,
  seedWriterPosts,
  seedCollaborations,
  seedToolkitItems,
  seedHeroTags,
  seedTagShowcases,
} from "./seed";
import type {
  DevProject,
  MotionProject,
  WriterPost,
  Collaboration,
  ToolkitItem,
  HeroTag,
  TagShowcase,
  Persona,
} from "./types";

/**
 * Public read layer. Every function is server-only and uses the anon client.
 * When Supabase is not configured (or a query errors), we fall back to seed
 * data so pages always render. Errors are logged, not thrown, to keep the
 * public site resilient.
 */

export async function getDevProjects(): Promise<DevProject[]> {
  const supabase = getAnonClient();
  if (!supabase) return seedDevProjects;
  const { data, error } = await supabase
    .from("dev_projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[data] dev_projects:", error.message);
    return seedDevProjects;
  }
  return data as DevProject[];
}

/**
 * The tag that marks a project as security research. Anything carrying it is
 * kept off the engineering portfolio and lives on /security-research instead,
 * so the two identities stay cleanly separated.
 */
export const SECURITY_TAG = "security-research";

export function isSecurityProject(p: DevProject): boolean {
  return Boolean(p.tags?.includes(SECURITY_TAG));
}

/** Engineering portfolio only. Security research is excluded. */
export async function getEngineeringProjects(): Promise<DevProject[]> {
  return (await getDevProjects()).filter((p) => !isSecurityProject(p));
}

/** Security research only, for the dedicated /security-research page. */
export async function getSecurityProjects(): Promise<DevProject[]> {
  return (await getDevProjects()).filter(isSecurityProject);
}

/**
 * Featured engineering projects for the homepage, newest first and capped.
 * Falls back to the most recent engineering projects if nothing is flagged, so
 * the section is never empty.
 */
export async function getFeaturedProjects(limit: number): Promise<DevProject[]> {
  const all = await getEngineeringProjects();
  const flagged = all.filter((p) => p.featured);
  return (flagged.length ? flagged : all).slice(0, limit);
}

export async function getCollaborations(): Promise<Collaboration[]> {
  const supabase = getAnonClient();
  if (!supabase) return seedCollaborations;
  const { data, error } = await supabase
    .from("collaborations")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("org", { ascending: true });
  if (error) {
    console.error("[data] collaborations:", error.message);
    return seedCollaborations;
  }
  return data as Collaboration[];
}

export async function getToolkitItems(): Promise<ToolkitItem[]> {
  const supabase = getAnonClient();
  if (!supabase) return seedToolkitItems;
  const { data, error } = await supabase
    .from("toolkit_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[data] toolkit_items:", error.message);
    return seedToolkitItems;
  }
  return data as ToolkitItem[];
}

export async function getMotionProjects(): Promise<MotionProject[]> {
  const supabase = getAnonClient();
  if (!supabase) return seedMotionProjects;
  const { data, error } = await supabase
    .from("motion_projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[data] motion_projects:", error.message);
    return seedMotionProjects;
  }
  return data as MotionProject[];
}

export async function getWriterPosts(): Promise<WriterPost[]> {
  const supabase = getAnonClient();
  if (!supabase) return seedWriterPosts;
  const { data, error } = await supabase
    .from("writer_posts")
    .select("*")
    .order("date", { ascending: false });
  if (error) {
    console.error("[data] writer_posts:", error.message);
    return seedWriterPosts;
  }
  // Only show published posts. Rows created before migration 002 have no status
  // column (undefined) → treated as published, so nothing disappears.
  return (data as WriterPost[]).filter((p) => p.status !== "draft");
}

export async function getHeroTags(persona: Persona): Promise<HeroTag[]> {
  const supabase = getAnonClient();
  if (!supabase) return seedHeroTags.filter((t) => t.persona === persona);
  const { data, error } = await supabase
    .from("hero_tags")
    .select("*")
    .eq("persona", persona)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[data] hero_tags:", error.message);
    return seedHeroTags.filter((t) => t.persona === persona);
  }
  return data as HeroTag[];
}

// All hero tags matching a slug (a slug may appear for more than one persona,
// e.g. Solana). Used to resolve the showcase page's persona + label.
export async function getHeroTagsBySlug(slug: string): Promise<HeroTag[]> {
  const supabase = getAnonClient();
  if (!supabase) return seedHeroTags.filter((t) => t.slug === slug);
  const { data, error } = await supabase
    .from("hero_tags")
    .select("*")
    .eq("slug", slug)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[data] hero_tags by slug:", error.message);
    return seedHeroTags.filter((t) => t.slug === slug);
  }
  return data as HeroTag[];
}

export async function getTagShowcase(slug: string): Promise<TagShowcase | null> {
  const supabase = getAnonClient();
  if (!supabase) return seedTagShowcases.find((s) => s.tag_slug === slug) ?? null;
  const { data, error } = await supabase
    .from("tag_showcases")
    .select("*")
    .eq("tag_slug", slug)
    .maybeSingle();
  if (error) {
    console.error("[data] tag_showcase:", error.message);
    return seedTagShowcases.find((s) => s.tag_slug === slug) ?? null;
  }
  return (data as TagShowcase) ?? null;
}

// All distinct tag slugs (for static params on the showcase route).
export async function getAllTagSlugs(): Promise<string[]> {
  const supabase = getAnonClient();
  if (!supabase) return [...new Set(seedHeroTags.map((t) => t.slug))];
  const { data, error } = await supabase.from("hero_tags").select("slug");
  if (error) {
    console.error("[data] hero_tags slugs:", error.message);
    return [...new Set(seedHeroTags.map((t) => t.slug))];
  }
  return [...new Set((data as { slug: string }[]).map((r) => r.slug))];
}

export async function getWriterPostBySlug(
  slug: string
): Promise<WriterPost | null> {
  const supabase = getAnonClient();
  if (!supabase) return seedWriterPosts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase
    .from("writer_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    console.error("[data] writer_post by slug:", error.message);
    return null;
  }
  const post = data as WriterPost;
  // Don't expose drafts on the public post route.
  if (post.status === "draft") return null;
  return post;
}
