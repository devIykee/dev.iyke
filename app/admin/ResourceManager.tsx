"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type FieldType = "text" | "textarea" | "url" | "date" | "markdown";

export interface FieldConfig {
  name: string; // key sent to the API
  label: string;
  type: FieldType;
  required?: boolean;
  readFrom?: string; // key to prefill from when editing (defaults to `name`)
}

export interface ResourceConfig {
  key: string;
  endpoint: string;
  singular: string;
  primaryField: string; // shown as row title
  secondaryField?: string; // shown as row subtitle
  fields: FieldConfig[];
}

type Row = Record<string, unknown> & { id: string };

function emptyForm(fields: FieldConfig[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.name, ""]));
}

/**
 * Generic add/edit/delete manager. Renders the existing rows and a single form
 * that toggles between "create" and "edit <id>" modes. All requests hit the
 * resource's admin endpoint, which enforces the session server-side.
 */
export default function ResourceManager({
  config,
  initialItems,
}: {
  config: ResourceConfig;
  // Concrete row interfaces (DevProject, etc.) have an id but no index
  // signature; we read arbitrary fields internally so cast to the loose Row.
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

  const inputClass =
    "w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Existing items */}
      <section>
        <h2 className="m-0 mb-4 text-xs uppercase tracking-widest text-neutral-500">
          {items.length} {config.singular.toLowerCase()}
          {items.length === 1 ? "" : "s"}
        </h2>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {items.map((row) => (
            <li
              key={row.id}
              className={`flex items-start justify-between gap-3 border p-3 ${
                editingId === row.id ? "border-neutral-400" : "border-neutral-800"
              }`}
            >
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
            <li className="border border-dashed border-neutral-800 p-4 text-xs text-neutral-600">
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
            className="border border-neutral-100 bg-neutral-100 px-4 py-2 text-sm font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {busy ? "Saving…" : editingId ? "Update" : "Create"}
          </button>
        </form>
      </section>
    </div>
  );
}
