import { NextResponse } from "next/server";
import {
  isValidPasscode,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(req: Request) {
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
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Session secret misconfigured." },
      { status: 503 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...sessionCookieOptions, value: token });
  return res;
}
