import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Two clients, two trust levels:
 *  - the anon client is read-only (RLS-restricted) and used by public pages.
 *  - the service-role client bypasses RLS and is ONLY constructed inside
 *    server-side admin API routes. It must never reach the browser bundle.
 *
 * Both are created lazily and return null when env vars are absent, so the
 * app builds and renders (against seed fallbacks) before Supabase is wired.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getAnonClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

export function getServiceClient(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** True when the public read path is configured. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}
