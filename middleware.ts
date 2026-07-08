import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge guard for admin sub-paths. The /admin index is intentionally left open
 * so it can render the passcode form; any deeper /admin/* path requires a valid
 * session cookie and otherwise redirects back to /admin. API routes under
 * /api/admin/* additionally re-check the session server-side (see lib/auth.ts),
 * so this middleware is defense-in-depth, not the sole gate.
 */
const SESSION_COOKIE = "iyke_admin_session";

async function hasValidSession(token: string | undefined): Promise<boolean> {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!token || !s || s.length < 16) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(s));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard admin sub-pages (e.g. /admin/settings). Leave /admin open.
  const isAdminSubPage =
    pathname.startsWith("/admin/") && pathname !== "/admin";
  if (!isAdminSubPage) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await hasValidSession(token)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
