"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrandIcon from "@/lib/BrandIcon";

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "date"
  | "markdown"
  | "select"
  | "image";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string; // key sent to the API
  label: string;
  type: FieldType;
  required?: boolean;
  readFrom?: string; // key to prefill from when editing (defaults to `name`)
  options?: SelectOption[]; // for type: "select"
}

export interface ResourceConfig {
  key: string;
  endpoint: string;
  singular: string;
  primaryField: string; // shown as row title
  secondaryField?: string; // shown as row subtitle
  fields: FieldConfig[];
  /** Enables up/down reorder (PATCH { order: string[] }). */
  reorderable?: boolean;
  /** Row row-icon preview: a Material Symbols key stored in this field. */
  iconField?: string;
  /** Row logo preview: an image URL stored in this field. */
  logoField?: string;
}

type Row = Record<string, unknown> & { id: string };

function emptyForm(fields: FieldConfig[]): Record<string, string> {
  return Object.fromEntries(
    fields.map((f) => [
      f.name,
      f.type === "select" ? f.options?.[0]?.value ?? "" : "",
    ])
  );
}

/**
 * Generic add/edit/delete/reorder manager. Renders existing rows (with optional
 * icon/logo preview and up/down controls) and a single form that toggles between
 * "create" and "edit <id>". All requests hit the resource's admin endpoint,
 * which enforces the session server-side.
 */
export default function ResourceManager({
  config,
  initialItems,
}: {
  config: ResourceConfig;
  // Concrete row interfaces have an id but no index signature; cast internally.
  initialItems: { id: string }[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>(initialItems as Row[]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>(emptyForm(config.fields));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch(config.endpoint, { cache: "no-store" });
    if (res.ok) {
      const { data } = await res.json();
      setItems((data as Row[]) ?? []);
    }
    router.refresh(); // revalidate public pages view
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm(config.fields));
    setError(null);
  }

  function startEdit(row: Row) {
    setEditingId(row.id);
    setError(null);
    const next: Record<string, string> = {};
    for (const f of config.fields) {
      const src = f.readFrom ?? f.name;
      const val = row[src];
      next[f.name] = val == null ? "" : String(val);
    }
    setForm(next);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const payload: Record<string, string> = { ...form };
      const method = editingId ? "PUT" : "POST";
      if (editingId) payload.id = editingId;
      const res = await fetch(config.endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Save failed.");
        return;
      }
      startCreate();
      await refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete this ${config.singular.toLowerCase()}? This cannot be undone.`))
      return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${config.endpoint}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Delete failed.");
        return;
      }
      if (editingId === id) startCreate();
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  // Reorder by swapping with the neighbour, then persist the full id order.
  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setItems(reordered); // optimistic
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(config.endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((r) => r.id) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Reorder failed.");
        await refresh(); // revert to server truth
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Existing items */}
      <section>
        <h2 className="m-0 mb-4 text-xs uppercase tracking-widest text-neutral-500">
          {items.length} {config.singular.toLowerCase()}
          {items.length === 1 ? "" : "s"}
        </h2>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {items.map((row, index) => (
            <li
              key={row.id}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                editingId === row.id ? "border-neutral-400" : "border-neutral-800"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                {config.reorderable && (
                  <div className="flex flex-col">
                    <button
                      aria-label="Move up"
                      onClick={() => move(index, -1)}
                      disabled={busy || index === 0}
                      className="leading-none text-neutral-500 hover:text-white disabled:opacity-20"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        keyboard_arrow_up
                      </span>
                    </button>
                    <button
                      aria-label="Move down"
                      onClick={() => move(index, 1)}
                      disabled={busy || index === items.length - 1}
                      className="leading-none text-neutral-500 hover:text-white disabled:opacity-20"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        keyboard_arrow_down
                      </span>
                    </button>
                  </div>
                )}

                {config.iconField && (
                  <BrandIcon
                    brand={String(row[config.iconField] ?? "")}
                    className="shrink-0 text-neutral-300"
                    size={20}
                  />
                )}
                {config.logoField &&
                  (row[config.logoField] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={String(row[config.logoField])}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded-sm border border-neutral-700 object-contain"
                    />
                  ) : (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-neutral-700 text-[10px] text-neutral-500">
                      {String(row[config.primaryField] ?? "?").charAt(0)}
                    </span>
                  ))}

                <div className="min-w-0">
                  <p className="m-0 truncate text-sm font-bold text-neutral-100">
                    {String(row[config.primaryField] ?? "(untitled)")}
                  </p>
                  {config.secondaryField && (
                    <p className="m-0 mt-0.5 truncate text-xs text-neutral-500">
                      {String(row[config.secondaryField] ?? "")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(row)}
                  className="text-xs uppercase text-neutral-400 hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(row.id)}
                  disabled={busy}
                  className="text-xs uppercase text-red-400 hover:text-red-300 disabled:opacity-40"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="rounded-lg border border-dashed border-neutral-800 p-4 text-xs text-neutral-600">
              Nothing yet. Add your first {config.singular.toLowerCase()} →
            </li>
          )}
        </ul>
      </section>

      {/* Form */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 text-xs uppercase tracking-widest text-neutral-500">
            {editingId ? `Edit ${config.singular}` : `New ${config.singular}`}
          </h2>
          {editingId && (
            <button
              onClick={startCreate}
              className="text-xs uppercase text-neutral-400 hover:text-white"
            >
              + New instead
            </button>
          )}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {config.fields.map((f) => (
            <label key={f.name} className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-neutral-400">
                {f.label}
                {f.required && <span className="text-red-400"> *</span>}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={form[f.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className={inputClass}
                />
              ) : f.type === "markdown" ? (
                <textarea
                  rows={10}
                  value={form[f.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className={`${inputClass} font-mono`}
                  placeholder="# Markdown supported"
                />
              ) : f.type === "select" ? (
                <div className="flex items-center gap-3">
                  {/* Live preview for icon selects */}
                  {config.iconField === f.name && (
                    <BrandIcon
                      brand={form[f.name] || ""}
                      className="shrink-0 text-neutral-200"
                      size={22}
                    />
                  )}
                  <select
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className={inputClass}
                  >
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : f.type === "image" ? (
                <ImageField
                  value={form[f.name] ?? ""}
                  onChange={(v) => setForm({ ...form, [f.name]: v })}
                  inputClass={inputClass}
                />
              ) : (
                <input
                  type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                  value={form[f.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className={inputClass}
                />
              )}
            </label>
          ))}

          {error && <p className="m-0 text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="rounded-lg border border-neutral-100 bg-neutral-100 px-4 py-2 text-sm font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {busy ? "Saving…" : editingId ? "Update" : "Create"}
          </button>
        </form>
      </section>
    </div>
  );
}

/**
 * URL input paired with a direct file upload (Supabase Storage). Either paste a
 * URL or upload a file — on success the returned public URL fills the field.
 * Shows a small live preview when a URL is present.
 */
function ImageField({
  value,
  onChange,
  inputClass,
}: {
  value: string;
  onChange: (v: string) => void;
  inputClass: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error ?? "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setErr("Network error during upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or upload →"
          className={inputClass}
        />
        <label className="shrink-0 cursor-pointer rounded-lg border border-neutral-700 px-3 py-2 text-xs uppercase text-neutral-300 transition-colors hover:border-neutral-400 hover:text-white">
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {err && <p className="m-0 text-xs text-red-400">{err}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="preview"
          className="h-16 w-16 rounded border border-neutral-700 object-contain"
        />
      )}
    </div>
  );
}
