"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Sun/moon theme toggle. Reads the current theme from the <html data-theme>
 * attribute (set pre-paint by the no-flash script in layout), flips it on click,
 * and persists the choice to localStorage. State is global — the attribute and
 * localStorage are shared across all persona pages.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) ?? "light";
    setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore storage failures (private mode, etc.) */
    }
    setTheme(next);
  }

  // Render a stable placeholder until mounted to avoid a hydration mismatch.
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex items-center justify-center border border-border p-2 text-ink transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {theme === null ? "contrast" : isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
