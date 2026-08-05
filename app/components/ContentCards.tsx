import AppImage from "./AppImage";
import BrandIcon from "@/lib/BrandIcon";
import ScreenshotFrame from "./ScreenshotFrame";
import type {
  Collaboration,
  ToolkitItem,
  DevProject,
  MotionProject,
} from "@/lib/types";

/**
 * Developer project card — the canonical card used in the Projects section, the
 * /projects archive, and tag showcase pages, so they stay pixel-identical.
 */
export function DevProjectCard({ p }: { p: DevProject }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border transition-transform duration-200 hover:-translate-y-1">
      <ScreenshotFrame
        src={p.screenshot_url}
        label="IMG_PLACEHOLDER"
        alt={`${p.title} project screenshot`}
        className="h-48 border-b border-border bg-elevated"
        labelClassName="text-muted font-mono tracking-widest"
      />
      <div className="flex flex-1 flex-col bg-base p-4">
        <h4 className="mb-2 text-lg font-bold text-ink transition-colors group-hover:text-accent">
          {p.title}
        </h4>
        <p className="mb-6 line-clamp-2 flex-1 text-sm text-muted">
          {p.description}
        </p>
        <a
          href={p.link ?? "#"}
          target={p.link && p.link !== "#" ? "_blank" : undefined}
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Explore
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </a>
      </div>
    </article>
  );
}

/**
 * Motion case-study card — the embed-based card used in the Case Studies grid,
 * the /motion/work archive, and tag showcase pages.
 */
export function MotionCaseStudyCard({ p }: { p: MotionProject }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-transform duration-200 hover:-translate-y-1">
      <div className="aspect-video w-full bg-base">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${p.youtube_id}`}
          title={p.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h4 className="mb-2 text-lg font-extrabold text-ink">{p.title}</h4>
        <p className="line-clamp-3 text-sm text-muted">{p.description}</p>
      </div>
    </article>
  );
}

/**
 * Toolkit chip — a fixed-width cell for the horizontal auto-scroll strip. Uses a
 * real brand logo (currentColor-tinted so it follows the theme).
 */
export function ToolkitChip({ item }: { item: ToolkitItem }) {
  return (
    <div className="flex w-44 shrink-0 items-center gap-3 rounded-xl border border-border-soft bg-surface px-4 py-3 text-ink transition-colors duration-200 hover:border-accent hover:text-accent">
      <BrandIcon brand={item.icon_key} className="shrink-0" size={22} />
      <span className="truncate text-sm">{item.name}</span>
    </div>
  );
}

/**
 * Monogram used when an org has no logo file. Up to two initials, taken from
 * the first two words, so "Superteam Earn" reads SE and "Ledger" reads L.
 * Deliberately not a fetched third-party logo: no external requests and no
 * questions about trademark use.
 */
function monogram(org: string): string {
  const words = org
    // Split on spaces and on camelCase humps, so FlowVault reads FV and
    // CredChain reads CC rather than both collapsing to their first two letters.
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Collaboration row: mark and org on the left, what the work was in the middle,
 * category on the right. Collapses to a stack on small screens so the role text
 * keeps a readable measure.
 */
export function CollaborationRow({ c }: { c: Collaboration }) {
  const mark = c.logo_url ? (
    <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-md border border-border bg-surface">
      <AppImage
        src={c.logo_url}
        alt={`${c.org} logo`}
        fill
        sizes="32px"
        className="object-contain"
      />
    </span>
  ) : (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-[10px] font-bold tracking-tight text-accent"
    >
      {monogram(c.org)}
    </span>
  );

  const org = c.link_url ? (
    <a
      href={c.link_url}
      className="inline-flex items-center gap-1 font-bold text-ink transition-colors hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {c.org}
      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
        arrow_outward
      </span>
    </a>
  ) : (
    <span className="font-bold text-ink">{c.org}</span>
  );

  return (
    <div className="grid grid-cols-1 items-center gap-x-4 gap-y-1.5 border-b border-border-soft py-4 transition-colors duration-200 hover:bg-surface sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto]">
      <span className="flex min-w-0 items-center gap-3">
        {mark}
        <span className="min-w-0 truncate">{org}</span>
      </span>
      <span className="pl-11 text-sm leading-snug text-muted sm:pl-0">
        {c.role}
      </span>
      {c.category && (
        <span className="ml-11 w-fit whitespace-nowrap rounded-full border border-border px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted sm:ml-0 sm:justify-self-end">
          {c.category}
        </span>
      )}
    </div>
  );
}

/** Graceful empty state for content-managed sections. */
export function EmptyRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-8 text-sm text-muted">
      {label}
    </div>
  );
}
