import "server-only";
import { getAnonClient } from "./supabase";
import {
  seedDevProjects,
  seedMotionProjects,
  seedWriterPosts,
  seedCollaborations,
} from "./seed";
import type {
  DevProject,
  MotionProject,
  WriterPost,
  Collaboration,
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

export async function getCollaborations(): Promise<Collaboration[]> {
  const supabase = getAnonClient();
  if (!supabase) return seedCollaborations;
  const { data, error } = await supabase
    .from("collaborations")
    .select("*")
    .order("org", { ascending: true });
  if (error) {
    console.error("[data] collaborations:", error.message);
    return seedCollaborations;
  }
  return data as Collaboration[];
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
  return data as WriterPost[];
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
  return data as WriterPost;
}
