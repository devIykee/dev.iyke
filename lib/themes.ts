import type { Persona } from "./types";

/**
 * Per-persona class tokens for the shared chrome (dropdown nav + glass pill +
 * hamburger). Kept as explicit static class strings so Tailwind's JIT sees every
 * class at build time (no dynamic concatenation of color names).
 */
export interface ChromeTheme {
  // Hamburger button
  hamburger: string;
  // Glassmorphism dropdown panel (opens below the hamburger)
  dropdownBg: string; // frosted: semi-opaque bg + backdrop blur
  dropdownBorder: string;
  dropdownTitle: string;
  dropdownSubtitle: string;
  // Dropdown items
  dropdownItemIdle: string;
  dropdownItemActive: string;
  // Bottom glass pill navbar
  pill: string; // frosted bg + blur + border + subtle shadow/glow
  pillItemIdle: string;
  pillItemActive: string;
}

export const CHROME_THEMES: Record<Persona, ChromeTheme> = {
  developer: {
    hamburger:
      "text-white hover:text-terminal-green bg-[#0d0d0d]/60 backdrop-blur-md border border-white/10",
    dropdownBg: "bg-[#0d0d0d]/80 backdrop-blur-xl",
    dropdownBorder: "border border-terminal-green/25",
    dropdownTitle: "text-white",
    dropdownSubtitle: "text-outline",
    dropdownItemIdle:
      "text-neutral-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent",
    dropdownItemActive:
      "bg-terminal-green/10 text-terminal-green font-bold border-l-2 border-terminal-green",
    pill:
      "bg-[#1a1a1a]/60 backdrop-blur-xl border border-terminal-green/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] ring-1 ring-white/5",
    pillItemIdle: "text-[#999999] hover:text-white",
    pillItemActive: "bg-terminal-green/15 text-terminal-green",
  },
  motion: {
    hamburger:
      "text-motion-ink hover:text-motion-blue bg-white/50 backdrop-blur-md border border-black/5",
    dropdownBg: "bg-white/70 backdrop-blur-xl",
    dropdownBorder: "border border-motion-blue/20",
    dropdownTitle: "text-motion-ink",
    dropdownSubtitle: "text-motion-muted",
    dropdownItemIdle:
      "text-motion-muted hover:bg-black/5 hover:text-motion-ink border-l-2 border-transparent",
    dropdownItemActive:
      "bg-motion-blue/10 text-motion-blue font-bold border-l-2 border-motion-blue",
    pill:
      "bg-white/55 backdrop-blur-xl border border-motion-blue/25 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5",
    pillItemIdle: "text-motion-muted hover:text-motion-ink",
    pillItemActive: "bg-motion-blue/10 text-motion-blue",
  },
  writer: {
    hamburger:
      "text-writer-ink hover:text-writer-burgundy bg-writer-surface/50 backdrop-blur-md border border-black/5",
    dropdownBg: "bg-writer-surface/75 backdrop-blur-xl",
    dropdownBorder: "border border-writer-burgundy/20",
    dropdownTitle: "text-writer-ink",
    dropdownSubtitle: "text-writer-muted",
    dropdownItemIdle:
      "text-writer-muted hover:bg-black/5 hover:text-writer-ink border-l-2 border-transparent",
    dropdownItemActive:
      "bg-writer-burgundy/10 text-writer-burgundy font-bold border-l-2 border-writer-burgundy",
    pill:
      "bg-writer-surface/60 backdrop-blur-xl border border-writer-burgundy/25 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5",
    pillItemIdle: "text-writer-muted hover:text-writer-ink",
    pillItemActive: "bg-writer-burgundy/10 text-writer-burgundy",
  },
};
