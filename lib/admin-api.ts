import "server-only";
import { NextResponse } from "next/server";
import { isAuthenticated } from "./auth";
import { getServiceClient } from "./supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Guards an admin write route: verifies the session cookie server-side and
 * returns a service-role Supabase client. On failure returns a ready NextResponse
 * so callers can `if ('error' in guard) return guard.error`.
 */
export async function requireAdmin(): Promise<
  { client: SupabaseClient } | { error: NextResponse }
> {
  if (!(await isAuthenticated())) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }
  const client = getServiceClient();
  if (!client) {
    return {
      error: NextResponse.json(
        {
          error:
            "Supabase service role not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 503 }
      ),
    };
  }
  return { client };
}

/** Parse a JSON body, returning null on failure. */
export async function readJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Normalizes the admin form's comma-separated tag string into the text[] the
 * content tables store. Slugified (lowercase, dashes) so what's typed always
 * matches the /tags/<slug> route and hero_tags.slug it needs to line up with.
 */
export function parseTags(input: unknown): string[] {
  if (Array.isArray(input)) input = input.join(",");
  if (typeof input !== "string") return [];
  return [
    ...new Set(
      input
        .split(",")
        .map((t) =>
          t
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        )
        .filter(Boolean)
    ),
  ];
}
