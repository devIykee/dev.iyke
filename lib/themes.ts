/**
 * Shared chrome styling now uses semantic theme tokens (accent/base/ink/border…)
 * that resolve per persona × mode via CSS variables, so a single style set works
 * for every persona. Kept as named exports for the chrome components to consume.
 */

// Top-right hamburger/toggle: frosted, readable surface, subtle glass lift.
export const HAMBURGER =
  "text-ink hover:text-accent bg-surface/80 backdrop-blur-md border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06)]";

// Glassmorphism dropdown panel (opens below the hamburger). High-opacity frosted
// surface so the persona list stays clearly readable over any hero content.
export const DROPDOWN = {
  panel:
    "bg-surface/95 backdrop-blur-md border border-border shadow-[0_6px_20px_rgba(0,0,0,0.12)]",
  title: "text-ink",
  subtitle: "text-muted",
  itemIdle:
    "text-muted hover:bg-ink/5 hover:text-ink border-l-2 border-transparent",
  itemActive:
    "bg-accent/15 text-accent font-semibold border-l-2 border-accent",
};

// Floating glass pill navbar — semi-opaque frosted surface (not see-through),
// backdrop blur, hairline border, and a LIGHT elevation shadow (glass, not a
// heavy block) that reads in both light and dark mode.
export const PILL = {
  glass:
    "bg-surface/80 backdrop-blur-md border border-border shadow-[0_2px_10px_rgba(0,0,0,0.08)]",
  // Inactive labels: brighter than muted so the pill feels lively.
  itemIdle: "text-ink/70 font-medium hover:text-ink",
  itemActive: "bg-accent/15 text-accent font-semibold",
};
