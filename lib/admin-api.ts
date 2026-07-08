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
