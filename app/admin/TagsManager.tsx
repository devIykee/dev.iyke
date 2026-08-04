"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  HeroTag,
  TagShowcase,
  DevProject,
  MotionProject,
  WriterPost,
  Persona,
} from "@/lib/types";

const PERSONA_OPTIONS: { value: Persona; label: string }[] = [
  { value: "developer", label: "Developer" },
  { value: "motion", label: "Motion" },
  { value: "writer", label: "Writer" },
];

const inputClass =
  "w-full rounded-lg border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400";

type ShowcaseMap = Record<string, TagShowcase>;

/**
 * Admin "Tags" tab. Two panes:
 *  - Tag pills: CRUD + per-persona reorder for the hero tag cloud (hero_tags).
 *  - Showcase editor: pick a tag, write its intro blurb, and check which of that
 *    persona's existing items to feature on /tags/<slug> (tag_showcases).
 */
export default function TagsManager({
  initialTags,
  initialShowcases,
  devProjects,
  motionProjects,
  writerPosts,
}: {
  initialTags: HeroTag[];
  initialShowcases: TagShowcase[];
  devProjects: DevProject[];
  motionProjects: MotionProject[];
  writerPosts: WriterPost[];
}) {
  const router = useRouter();
  const [tags, setTags] = useState<HeroTag[]>(initialTags);
  const [showcases, setShowcases] = useState<ShowcaseMap>(
    Object.fromEntries(initialShowcases.map((s) => [s.tag_slug, s]))
  );

  // ---- Tag form state ----
  const [editingId, setEditingId] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona>("developer");
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [tagErr, setTagErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ---- Showcase editor state ----
  const distinctSlugs = useMemo(
    () => [...new Set(tags.map((t) => t.slug))],
    [tags]
  );
  const [selSlug, setSelSlug] = useState<string>(distinctSlugs[0] ?? "");
  const selShowcase = showcases[selSlug];
  const [blurb, setBlurb] = useState<string>(selShowcase?.intro_blurb ?? "");
  const [selIds, setSelIds] = useState<string[]>(selShowcase?.project_ids ?? []);
  const [resumeUrl, setResumeUrl] = useState<string>(selShowcase?.resume_url ?? "");
  const [showErr, setShowErr] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  // Persona backing the selected slug (first tag that carries it).
  const selPersona: Persona | undefined = useMemo(
    () => tags.find((t) => t.slug === selSlug)?.persona,
    [tags, selSlug]
  );

  const personaItems: { id: string; title: string }[] = useMemo(() => {
    if (selPersona === "motion") return motionProjects.map((p) => ({ id: p.id, title: p.title }));
    if (selPersona === "writer") return writerPosts.map((p) => ({ id: p.id, title: p.title }));
    return devProjects.map((p) => ({ id: p.id, title: p.title }));
  }, [selPersona, devProjects, motionProjects, writerPosts]);

  function selectSlug(next: string) {
    setSelSlug(next);
    const sc = showcases[next];
    setBlurb(sc?.intro_blurb ?? "");
    setSelIds(sc?.project_ids ?? []);
    setResumeUrl(sc?.resume_url ?? "");
    setShowErr(null);
    setSavedOk(false);
  }

  // ---- Tag CRUD ----
  async function refreshTags() {
    const res = await fetch("/api/admin/hero-tags", { cache: "no-store" });
    if (res.ok) {
      const { data } = await res.json();
      setTags((data as HeroTag[]) ?? []);
    }
    router.refresh();
  }

  function resetTagForm() {
    setEditingId(null);
    setLabel("");
    setSlug("");
    setTagErr(null);
  }

  function editTag(t: HeroTag) {
    setEditingId(t.id);
    setPersona(t.persona);
    setLabel(t.label);
    setSlug(t.slug);
    setTagErr(null);
  }

  async function submitTag(e: React.FormEvent) {
    e.preventDefault();
    setTagErr(null);
    if (!label.trim()) {
      setTagErr("Label is required.");
      return;
    }
    setBusy(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload: Record<string, string> = { persona, label, slug };
      if (editingId) payload.id = editingId;
      const res = await fetch("/api/admin/hero-tags", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setTagErr(d.error ?? "Save failed.");
        return;
      }
      resetTagForm();
      await refreshTags();
    } finally {
      setBusy(false);
    }
  }

  async function deleteTag(id: string) {
    if (!confirm("Delete this tag pill? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/hero-tags?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (editingId === id) resetTagForm();
        await refreshTags();
      }
    } finally {
      setBusy(false);
    }
  }

  // Reorder within a persona: swap with same-persona neighbour, PATCH full order.
  async function moveTag(tag: HeroTag, dir: -1 | 1) {
    const group = tags.filter((t) => t.persona === tag.persona);
    const gi = group.findIndex((t) => t.id === tag.id);
    const target = gi + dir;
    if (target < 0 || target >= group.length) return;
    [group[gi], group[target]] = [group[target], group[gi]];
    // Rebuild the full flat list preserving other personas' order.
    const rebuilt: HeroTag[] = [];
    let gp = 0;
    for (const t of tags) {
      if (t.persona === tag.persona) rebuilt.push(group[gp++]);
      else rebuilt.push(t);
    }
    setTags(rebuilt);
    setBusy(true);
    try {
      await fetch("/api/admin/hero-tags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: rebuilt.map((t) => t.id) }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  // ---- Showcase save ----
  async function saveShowcase(e: React.FormEvent) {
    e.preventDefault();
    setShowErr(null);
    setSavedOk(false);
    if (!selSlug) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/tag-showcases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tag_slug: selSlug,
          intro_blurb: blurb,
          project_ids: selIds,
          resume_url: resumeUrl,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setShowErr(d.error ?? "Save failed.");
        return;
      }
      const { data } = await res.json();
      setShowcases((m) => ({ ...m, [selSlug]: data as TagShowcase }));
      setSavedOk(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function toggleId(id: string) {
    setSelIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }

  const grouped = PERSONA_OPTIONS.map((po) => ({
    persona: po.value,
    label: po.label,
    items: tags.filter((t) => t.persona === po.value),
  }));

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* ---------------- Tag pills ---------------- */}
      <section>
        <h2 className="m-0 mb-4 text-xs uppercase tracking-widest text-neutral-500">
          Tag pills ({tags.length})
        </h2>

        <div className="flex flex-col gap-6">
          {grouped.map((g) => (
            <div key={g.persona}>
              <p className="m-0 mb-2 text-[11px] uppercase tracking-wider text-neutral-600">
                {g.label}
              </p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {g.items.map((t, i) => (
                  <li
                    key={t.id}
                    className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                      editingId === t.id ? "border-neutral-400" : "border-neutral-800"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex flex-col">
                        <button
                          aria-label="Move up"
                          onClick={() => moveTag(t, -1)}
                          disabled={busy || i === 0}
                          className="leading-none text-neutral-500 hover:text-white disabled:opacity-20"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            keyboard_arrow_up
                          </span>
                        </button>
                        <button
                          aria-label="Move down"
                          onClick={() => moveTag(t, 1)}
                          disabled={busy || i === g.items.length - 1}
                          className="leading-none text-neutral-500 hover:text-white disabled:opacity-20"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            keyboard_arrow_down
                          </span>
                        </button>
                      </div>
                      <div className="min-w-0">
                        <p className="m-0 truncate text-sm font-bold text-neutral-100">
                          #{t.label}
                        </p>
                        <p className="m-0 mt-0.5 truncate font-mono text-xs text-neutral-500">
                          /tags/{t.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => editTag(t)}
                        className="text-xs uppercase text-neutral-400 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTag(t.id)}
                        disabled={busy}
                        className="text-xs uppercase text-red-400 hover:text-red-300 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
                {g.items.length === 0 && (
                  <li className="rounded-lg border border-dashed border-neutral-800 p-3 text-xs text-neutral-600">
                    No tags for {g.label} yet.
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Tag form */}
        <form onSubmit={submitTag} className="mt-6 flex flex-col gap-4 border-t border-neutral-800 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="m-0 text-xs uppercase tracking-widest text-neutral-500">
              {editingId ? "Edit tag" : "New tag"}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={resetTagForm}
                className="text-xs uppercase text-neutral-400 hover:text-white"
              >
                + New instead
              </button>
            )}
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-400">Persona</span>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value as Persona)}
              className={inputClass}
            >
              {PERSONA_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-400">
              Label <span className="text-red-400">*</span>
            </span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="SecRes"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-400">
              Slug (optional — auto from label)
            </span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="security-research"
              className={`${inputClass} font-mono`}
            />
          </label>
          {tagErr && <p className="m-0 text-xs text-red-400">{tagErr}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg border border-neutral-100 bg-neutral-100 px-4 py-2 text-sm font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {busy ? "Saving…" : editingId ? "Update tag" : "Create tag"}
          </button>
        </form>
      </section>

      {/* ---------------- Showcase editor ---------------- */}
      <section>
        <h2 className="m-0 mb-4 text-xs uppercase tracking-widest text-neutral-500">
          Showcase page
        </h2>

        {distinctSlugs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-800 p-4 text-xs text-neutral-600">
            Create a tag first, then curate its showcase here.
          </p>
        ) : (
          <form onSubmit={saveShowcase} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-neutral-400">Tag</span>
              <select
                value={selSlug}
                onChange={(e) => selectSlug(e.target.value)}
                className={inputClass}
              >
                {distinctSlugs.map((s) => (
                  <option key={s} value={s}>
                    #{s}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-neutral-400">
                Intro blurb
              </span>
              <textarea
                rows={4}
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                placeholder="[Intro blurb goes here]"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-neutral-400">
                Résumé link (optional)
              </span>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="/resume/security-research"
                className={inputClass}
              />
              <span className="text-xs text-neutral-500">
                Shows a button on this tag only. Leave it empty to use the
                site-wide Resume button.
              </span>
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-neutral-400">
                Pinned {selPersona ?? "developer"} items ({selIds.length} selected)
              </span>
              <span className="text-xs text-neutral-500">
                Optional. Pinned items come first, in this order. Anything
                carrying the <code>{selSlug || "<slug>"}</code> tag shows up on
                its own, so pinning is only for controlling what leads.
              </span>
              <ul className="m-0 flex max-h-72 list-none flex-col gap-1 overflow-y-auto rounded-lg border border-neutral-800 p-2">
                {personaItems.length === 0 && (
                  <li className="p-2 text-xs text-neutral-600">
                    No items to link yet — add some in the persona tab first.
                  </li>
                )}
                {personaItems.map((it) => (
                  <li key={it.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-900">
                      <input
                        type="checkbox"
                        checked={selIds.includes(it.id)}
                        onChange={() => toggleId(it.id)}
                        className="accent-neutral-100"
                      />
                      <span className="truncate text-sm text-neutral-200">
                        {it.title}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {showErr && <p className="m-0 text-xs text-red-400">{showErr}</p>}
            {savedOk && (
              <p className="m-0 text-xs text-green-400">Showcase saved.</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg border border-neutral-100 bg-neutral-100 px-4 py-2 text-sm font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {busy ? "Saving…" : "Save showcase"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
