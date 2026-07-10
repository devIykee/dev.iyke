import { NextResponse } from "next/server";
import {
  isValidPasscode,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import {
  checkRateLimit,
  registerFailure,
  clearRateLimit,
  clientIp,
} from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = clientIp(req);

  // Rate-limit gate: lock out repeated failures before doing any work.
  const gate = checkRateLimit(ip);
  if (!gate.allowed) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${Math.ceil(
          (gate.retryAfterSec ?? 0) / 60
        )} minute(s).`,
      },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec ?? 900) } }
    );
  }

  let passcode = "";
  try {
    const body = await req.json();
    passcode = typeof body?.passcode === "string" ? body.passcode : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSCODE || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: "Admin is not configured. Set ADMIN_PASSCODE and ADMIN_SESSION_SECRET." },
      { status: 503 }
    );
  }

  if (!isValidPasscode(passcode)) {
    const after = registerFailure(ip);
    const msg = after.allowed
      ? `Incorrect passcode. ${after.remaining} attempt(s) remaining.`
      : "Too many attempts. Locked out for 15 minutes.";
    return NextResponse.json({ error: msg }, { status: after.allowed ? 401 : 429 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Session secret misconfigured." },
      { status: 503 }
    );
  }

  clearRateLimit(ip); // success resets the counter
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...sessionCookieOptions, value: token });
  return res;
}
