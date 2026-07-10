import "server-only";

/**
 * Tiny in-memory fixed-window rate limiter for the admin passcode gate. Keyed by
 * client IP. After `maxAttempts` failures within `windowMs`, the key is locked
 * out until the window expires; a success clears it.
 *
 * Note: in-memory means per-serverless-instance. It meaningfully slows brute
 * force on a single instance; for hard multi-instance guarantees use a shared
 * store (Upstash/Redis). Documented as such rather than silently partial.
 */
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

type Entry = { count: number; first: number; lockedUntil: number };
const store = new Map<string, Entry>();

export interface RateResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
}

export function checkRateLimit(key: string, now = Date.now()): RateResult {
  const e = store.get(key);
  if (!e) return { allowed: true, remaining: MAX_ATTEMPTS };

  if (e.lockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((e.lockedUntil - now) / 1000),
    };
  }
  // Window expired → reset.
  if (now - e.first > WINDOW_MS) {
    store.delete(key);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }
  return { allowed: true, remaining: Math.max(0, MAX_ATTEMPTS - e.count) };
}

/** Record a failed attempt; locks the key when the threshold is reached. */
export function registerFailure(key: string, now = Date.now()): RateResult {
  const e = store.get(key);
  if (!e || now - e.first > WINDOW_MS) {
    store.set(key, { count: 1, first: now, lockedUntil: 0 });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }
  e.count += 1;
  if (e.count >= MAX_ATTEMPTS) {
    e.lockedUntil = now + WINDOW_MS;
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil(WINDOW_MS / 1000),
    };
  }
  return { allowed: true, remaining: MAX_ATTEMPTS - e.count };
}

export function clearRateLimit(key: string): void {
  store.delete(key);
}

/** Best-effort client IP from proxy headers. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
