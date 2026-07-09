"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Passcode gate. Posts to /api/admin/login which sets the HttpOnly session
 * cookie; on success we refresh so the server component re-renders the dashboard.
 */
export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed.");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 font-chrome text-neutral-100">
      <div className="w-full max-w-sm border border-neutral-800 p-8">
        <h1 className="m-0 text-lg font-bold tracking-widest">ADMIN ACCESS</h1>
        <p className="mt-1 text-xs text-neutral-500">
          Enter the passcode to manage content.
        </p>

        {!configured && (
          <p className="mt-4 border border-yellow-700 bg-yellow-950/40 p-3 text-xs text-yellow-300">
            Admin is not configured. Set <code>ADMIN_PASSCODE</code> and{" "}
            <code>ADMIN_SESSION_SECRET</code> in your environment.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
          />
          {error && <p className="m-0 text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !passcode}
            className="border border-neutral-100 bg-neutral-100 px-4 py-2 text-sm font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
