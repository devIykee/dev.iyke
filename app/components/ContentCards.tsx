import AppImage from "./AppImage";
import BrandIcon from "@/lib/BrandIcon";
import type { Collaboration, ToolkitItem } from "@/lib/types";

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
 * Collaboration row — a table-like row: logo + org (clickable if link_url) on
 * the left, role on the right. Hairline divider between rows.
 */
export function CollaborationRow({ c }: { c: Collaboration }) {
  const logo = c.logo_url ? (
    <span className="relative block h-7 w-7 shrink-0 overflow-hidden rounded-sm border border-border bg-surface">
      <AppImage
        src={c.logo_url}
        alt={`${c.org} logo`}
        fill
        sizes="28px"
        className="object-contain"
      />
    </span>
  ) : (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-border bg-surface text-[11px] font-bold text-muted">
      {c.org.charAt(0).toUpperCase()}
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
    <div className="grid grid-cols-[1fr_1fr] items-center gap-4 border-b border-border-soft py-4 transition-colors duration-200 hover:bg-surface">
      <span className="flex items-center gap-3">
        {logo}
        {org}
      </span>
      <span className="text-sm text-muted">{c.role}</span>
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
