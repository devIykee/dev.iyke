/**
 * Shared chrome styling now uses semantic theme tokens (accent/base/ink/border…)
 * that resolve per persona × mode via CSS variables, so a single style set works
 * for every persona. Kept as named exports for the chrome components to consume.
 */

// Top-left hamburger: frosted, readable surface tinted by the active accent.
export const HAMBURGER =
  "text-ink hover:text-accent bg-surface/90 backdrop-blur-xl border border-border shadow-[0_4px_16px_rgba(0,0,0,0.18)]";

// Glassmorphism dropdown panel (opens below the hamburger). High-opacity frosted
// surface so the persona list stays clearly readable over any hero content.
export const DROPDOWN = {
  panel:
    "bg-surface/95 backdrop-blur-xl border border-border shadow-[0_12px_40px_rgba(0,0,0,0.28)] ring-1 ring-accent/20",
  title: "text-ink",
  subtitle: "text-muted",
  itemIdle:
    "text-muted hover:bg-ink/5 hover:text-ink border-l-2 border-transparent",
  itemActive:
    "bg-accent/15 text-accent font-semibold border-l-2 border-accent",
};

// Bottom-center floating glass pill navbar — semi-opaque frosted surface (not
// see-through), backdrop blur, visible border + soft shadow to lift it.
export const PILL = {
  bar: "bg-surface/90 backdrop-blur-xl border border-border shadow-[0_10px_34px_rgba(0,0,0,0.24)] ring-1 ring-accent/20",
  itemIdle: "text-muted hover:text-ink",
  itemActive: "bg-accent/15 text-accent",
};
