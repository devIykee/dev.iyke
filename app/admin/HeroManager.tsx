"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Persona } from "@/lib/types";

const PERSONAS: { id: Persona; label: string }[] = [
  { id: "developer", label: "Developer" },
  { id: "motion", label: "Motion" },
  { id: "writer", label: "Writer" },
];

/**
 * Per-persona hero photo manager. Each persona gets its own upload → Supabase
 * Storage (path hero/<persona>), with a live preview. Replacing re-uploads to
 * the same path so the public page picks it up on the next render.
 */
export default function HeroManager({
  initial,
}: {
  initial: Record<Persona, string>;
}) {
  const router = useRouter();
  const [images, setImages] = useState<Record<Persona, string>>(initial);
  const [busy, setBusy] = useState<Persona | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(persona: Persona, file: File) {
    setError(null);
    setBusy(persona);
    try {
      const fd = new FormData();
      fd.append("persona", persona);
      fd.append("file", file);
      const res = await fetch("/api/admin/hero", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setImages((prev) => ({ ...prev, [persona]: data.url }));
      router.refresh();
    } catch {
      setError("Network error during upload.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <h2 className="m-0 mb-1 text-xs uppercase tracking-widest text-neutral-500">
        Hero photos
      </h2>
      <p className="m-0 mb-6 text-xs text-neutral-500">
        Each persona shows its own hero image. Upload to replace — changes appear
        on the public page on the next load.
      </p>

      {error && <p className="mb-4 text-xs text-red-400">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-3">
        {PERSONAS.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-xl border border-neutral-800 p-4"
          >
            <span className="text-xs uppercase tracking-wider text-neutral-400">
              {p.label}
            </span>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-neutral-700 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[p.id]}
                alt={`${p.label} hero`}
                className="h-full w-full object-cover"
              />
            </div>
            <label className="cursor-pointer rounded-lg border border-neutral-700 px-3 py-2 text-center text-xs uppercase tracking-wider text-neutral-300 transition-colors hover:border-neutral-400 hover:text-white">
              {busy === p.id ? "Uploading…" : "Replace photo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                disabled={busy !== null}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(p.id, f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
