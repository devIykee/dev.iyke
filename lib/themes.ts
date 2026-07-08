import type { Persona } from "./types";

/**
 * Per-persona class tokens for the shared chrome (drawer + pill nav + hamburger).
 * Keeping these as explicit, static class strings lets Tailwind's JIT see every
 * class at build time (no dynamic concatenation of color names).
 */
export interface ChromeTheme {
  // Hamburger button
  hamburger: string;
  // Drawer shell
  drawerBg: string;
  drawerBorder: string;
  drawerTitle: string;
  drawerSubtitle: string;
  drawerClose: string;
  // Drawer items
  drawerItemIdle: string;
  drawerItemActive: string;
  // Bottom pill navbar
  pillBg: string;
  pillBorder: string;
  pillItemIdle: string;
  pillItemActive: string;
  // Overlay
  overlay: string;
}

export const CHROME_THEMES: Record<Persona, ChromeTheme> = {
  developer: {
    hamburger: "text-white hover:text-terminal-green",
    drawerBg: "bg-[#0a0a0a]",
    drawerBorder: "border-grid-border",
    drawerTitle: "text-white",
    drawerSubtitle: "text-outline",
    drawerClose: "text-outline hover:text-white",
    drawerItemIdle:
      "text-outline hover:bg-[#1a1a1a] hover:text-white border-l-2 border-transparent",
    drawerItemActive:
      "bg-[#1a1a1a] text-terminal-green font-bold border-l-2 border-terminal-green",
    pillBg: "bg-[#1a1a1a]/80 backdrop-blur-md",
    pillBorder: "border-terminal-green",
    pillItemIdle: "text-[#888888] hover:text-white",
    pillItemActive: "bg-[#222222] text-terminal-green border-b-2 border-terminal-green",
    overlay: "bg-black/60 backdrop-blur-sm",
  },
  motion: {
    hamburger: "text-motion-ink hover:text-motion-blue",
    drawerBg: "bg-white",
    drawerBorder: "border-motion-border",
    drawerTitle: "text-motion-ink",
    drawerSubtitle: "text-motion-muted",
    drawerClose: "text-motion-muted hover:text-motion-ink",
    drawerItemIdle:
      "text-motion-muted hover:bg-motion-bg hover:text-motion-ink border-l-2 border-transparent",
    drawerItemActive:
      "bg-motion-bg text-motion-blue font-bold border-l-2 border-motion-blue",
    pillBg: "bg-white/70 backdrop-blur-md",
    pillBorder: "border-motion-blue",
    pillItemIdle: "text-motion-muted hover:text-motion-ink",
    pillItemActive: "bg-motion-bg text-motion-blue border-b-2 border-motion-blue",
    overlay: "bg-motion-ink/30 backdrop-blur-sm",
  },
  writer: {
    hamburger: "text-writer-ink hover:text-writer-burgundy",
    drawerBg: "bg-writer-surface",
    drawerBorder: "border-writer-rule",
    drawerTitle: "text-writer-ink",
    drawerSubtitle: "text-writer-muted",
    drawerClose: "text-writer-muted hover:text-writer-ink",
    drawerItemIdle:
      "text-writer-muted hover:bg-writer-bg hover:text-writer-ink border-l-2 border-transparent",
    drawerItemActive:
      "bg-writer-bg text-writer-burgundy font-bold border-l-2 border-writer-burgundy",
    pillBg: "bg-writer-surface/75 backdrop-blur-md",
    pillBorder: "border-writer-burgundy",
    pillItemIdle: "text-writer-muted hover:text-writer-ink",
    pillItemActive: "bg-writer-bg text-writer-burgundy border-b-2 border-writer-burgundy",
    overlay: "bg-writer-ink/25 backdrop-blur-sm",
  },
};
