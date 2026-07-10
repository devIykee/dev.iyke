"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  DevProject,
  MotionProject,
  WriterPost,
  Collaboration,
  ToolkitItem,
  Persona,
} from "@/lib/types";
import { TOOLKIT_ICON_KEYS, TOOLKIT_ICON_LABELS } from "@/lib/icons";
import ResourceManager, { type ResourceConfig } from "./ResourceManager";
import HeroManager from "./HeroManager";

type Tab =
  | "developer"
  | "motion"
  | "writer"
  | "toolkit"
  | "collaborations"
  | "hero";

const DEV_CONFIG: ResourceConfig = {
  key: "developer",
  endpoint: "/api/admin/dev-projects",
  singular: "Project",
  primaryField: "title",
  secondaryField: "description",
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "screenshot_url", label: "Screenshot", type: "image" },
    { name: "link", label: "Project link", type: "url" },
  ],
};

const MOTION_CONFIG: ResourceConfig = {
  key: "motion",
  endpoint: "/api/admin/motion-projects",
  singular: "Motion project",
  primaryField: "title",
  secondaryField: "description",
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    {
      name: "youtube",
      label: "YouTube URL or video ID",
      type: "text",
      required: true,
      // The row stores youtube_id; prefill the editable field from it.
      readFrom: "youtube_id",
    },
    { name: "thumbnail_url", label: "Thumbnail (optional)", type: "image" },
  ],
};

const WRITER_CONFIG: ResourceConfig = {
  key: "writer",
  endpoint: "/api/admin/writer-posts",
  singular: "Post",
  primaryField: "title",
  secondaryField: "excerpt",
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug (optional — auto from title)", type: "text" },
    { name: "date", label: "Date", type: "date" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "published", label: "Published (live on /writer)" },
        { value: "draft", label: "Draft (hidden from public)" },
      ],
    },
    { name: "excerpt", label: "Excerpt", type: "textarea" },
    { name: "body", label: "Body (Markdown)", type: "markdown" },
  ],
};

const TOOLKIT_CONFIG: ResourceConfig = {
  key: "toolkit",
  endpoint: "/api/admin/toolkit-items",
  singular: "Toolkit item",
  primaryField: "name",
  reorderable: true,
  iconField: "icon_key",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "icon_key",
      label: "Icon",
      type: "select",
      options: TOOLKIT_ICON_KEYS.map((k) => ({ value: k, label: TOOLKIT_ICON_LABELS[k] })),
    },
  ],
};

const COLLAB_CONFIG: ResourceConfig = {
  key: "collaborations",
  endpoint: "/api/admin/collaborations",
  singular: "Collaboration",
  primaryField: "org",
  secondaryField: "role",
  reorderable: true,
  logoField: "logo_url",
  fields: [
    { name: "org", label: "Organization", type: "text", required: true },
    { name: "role", label: "Role / Contribution", type: "text" },
    { name: "logo_url", label: "Logo", type: "image" },
    {
      name: "link_url",
      label: "Link URL (optional — e.g. a blog post; makes the org clickable)",
      type: "url",
    },
  ],
};

export default function AdminDashboard({
  supabaseReady,
  initialDev,
  initialMotion,
  initialWriter,
  initialToolkit,
  initialCollaborations,
  initialHeroes,
}: {
  supabaseReady: boolean;
  initialDev: DevProject[];
  initialMotion: MotionProject[];
  initialWriter: WriterPost[];
  initialToolkit: ToolkitItem[];
  initialCollaborations: Collaboration[];
  initialHeroes: Record<Persona, string>;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("developer");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "developer", label: "Developer" },
    { id: "motion", label: "Motion" },
    { id: "writer", label: "Writer / Blog" },
    { id: "toolkit", label: "Toolkit" },
    { id: "collaborations", label: "Collaborations" },
    { id: "hero", label: "Hero Photos" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 font-chrome text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <div>
          <h1 className="m-0 text-lg font-bold tracking-widest">CONTENT ADMIN</h1>
          <p className="m-0 mt-0.5 text-xs text-neutral-500">
            Iyke.dev — manage all three personas
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-neutral-700 px-4 py-2 text-xs uppercase tracking-wider text-neutral-300 transition-colors hover:border-neutral-400 hover:text-white"
        >
          Log out
        </button>
      </header>

      {!supabaseReady && (
        <p className="m-6 border border-yellow-700 bg-yellow-950/40 p-4 text-xs text-yellow-300">
          Supabase is not fully configured. Reads and writes need{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code>. Until then, saving will return a
          503 and the public site shows seed placeholder content.
        </p>
      )}

      <nav className="flex gap-1 border-b border-neutral-800 px-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm uppercase tracking-wider transition-colors ${
              tab === t.id
                ? "border-neutral-100 text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {tab === "developer" && (
          <ResourceManager config={DEV_CONFIG} initialItems={initialDev} />
        )}
        {tab === "motion" && (
          <ResourceManager config={MOTION_CONFIG} initialItems={initialMotion} />
        )}
        {tab === "writer" && (
          <ResourceManager config={WRITER_CONFIG} initialItems={initialWriter} />
        )}
        {tab === "toolkit" && (
          <ResourceManager config={TOOLKIT_CONFIG} initialItems={initialToolkit} />
        )}
        {tab === "collaborations" && (
          <ResourceManager
            config={COLLAB_CONFIG}
            initialItems={initialCollaborations}
          />
        )}
        {tab === "hero" && <HeroManager initial={initialHeroes} />}
      </main>
    </div>
  );
}
