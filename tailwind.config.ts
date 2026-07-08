import type { Config } from "tailwindcss";

/**
 * Tokens are the single source of truth mirrored from design/DESIGN.md.
 * Where DESIGN.md names an accent but gives no hex (Motion "Electric Blue",
 * Writer "Deep Burgundy"), the value is extrapolated conservatively in the
 * same Strict Minimalism spirit — flat, saturated, no gradients.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ---- Shared Material palette (from DESIGN.md frontmatter) ----
        surface: "#fdf7ff",
        "surface-dim": "#ded8e0",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8f2fa",
        "surface-container": "#f2ecf4",
        "surface-container-high": "#ece6ee",
        "surface-container-highest": "#e6e0e9",
        "on-surface": "#1d1b20",
        "on-surface-variant": "#494551",
        outline: "#7a7582",
        "outline-variant": "#cbc4d2",

        // ---- Developer persona (from code.html) ----
        "dev-bg": "#0d0d0d",
        "dev-bg-elevated": "#1a1a1a",
        "dev-bg-deep": "#050505",
        "terminal-green": "#00ff00",
        "grid-border": "#333333",
        "dev-muted": "#888888",

        // ---- Motion persona (off-white + Electric Blue) ----
        "motion-bg": "#f7f7f5",
        "motion-surface": "#ffffff",
        "motion-blue": "#0047ff",
        "motion-ink": "#111111",
        "motion-muted": "#6b6b6b",
        "motion-border": "#e4e4e0",

        // ---- Writer persona (warm cream + Deep Burgundy) ----
        "writer-bg": "#faf5ea",
        "writer-surface": "#fffdf7",
        "writer-burgundy": "#7b2130",
        "writer-ink": "#241f1c",
        "writer-muted": "#6f665c",
        "writer-rule": "#ded4c2",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        label: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["32px", { lineHeight: "40px", fontWeight: "900" }],
        h2: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        h3: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        label: ["12px", { letterSpacing: "0.05em", fontWeight: "600" }],
        "mono-base": ["14px", { lineHeight: "20px", fontWeight: "400" }],
      },
      spacing: {
        margin: "32px",
        gutter: "24px",
        unit: "4px",
      },
      borderRadius: {
        none: "0",
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      maxWidth: {
        reading: "720px",
        bento: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
