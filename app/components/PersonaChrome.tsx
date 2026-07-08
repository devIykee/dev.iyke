"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Persona } from "@/lib/types";
import { PERSONAS, PERSONA_ORDER } from "@/lib/personas";
import { CHROME_THEMES } from "@/lib/themes";

/**
 * Shared navigation chrome for all three public personas:
 *  - a top-right hamburger that opens a 300px right-hand drawer (persona switcher)
 *  - a bottom-center floating pill navbar of in-page section links
 *
 * Parameterized entirely by `persona`; colors come from CHROME_THEMES so the
 * markup stays identical across personas (matching design/code.html structure).
 */
export default function PersonaChrome({ persona }: { persona: Persona }) {
  const [open, setOpen] = useState(false);
  const config = PERSONAS[persona];
  const theme = CHROME_THEMES[persona];

  // Lock body scroll while the drawer is open; close on Escape.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger — top-right per DESIGN.md nav spec */}
      <button
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className={`fixed top-4 right-margin z-40 p-2 transition-colors ${theme.hamburger}`}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          theme.overlay
        } ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      />

      {/* Right-hand drawer: 100% height, 300px width, slides in from the right */}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-[300px] flex-col border-l ${
          theme.drawerBg
        } ${theme.drawerBorder} transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`flex items-center justify-between border-b p-6 ${theme.drawerBorder}`}
        >
          <div>
            <h2 className={`m-0 text-h3 font-bold ${theme.drawerTitle}`}>
              Persona Switcher
            </h2>
            <p
              className={`mt-1 font-label text-label uppercase ${theme.drawerSubtitle}`}
            >
              Select your view
            </p>
          </div>
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className={`p-2 transition-colors ${theme.drawerClose}`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-2 px-2">
            {PERSONA_ORDER.map((key) => {
              const p = PERSONAS[key];
              const active = key === persona;
              return (
                <li key={key}>
                  <Link
                    href={p.path}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                      active ? theme.drawerItemActive : theme.drawerItemIdle
                    }`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {p.icon}
                    </span>
                    <span className="font-label text-label uppercase">
                      {p.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Bottom-center floating pill navbar — semi-opaque, blurred, no shadow */}
      <nav
        className={`fixed bottom-8 left-1/2 z-30 flex w-fit -translate-x-1/2 items-center gap-1 border px-3 py-2 ${theme.pillBg} ${theme.pillBorder}`}
      >
        {config.sections.map((s, i) => (
          <a
            key={s.href}
            href={s.href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 transition-colors sm:px-4 ${
              i === 0 ? theme.pillItemActive : theme.pillItemIdle
            }`}
          >
            <span className="font-label text-[10px] uppercase tracking-wider">
              {s.label}
            </span>
          </a>
        ))}
      </nav>
    </>
  );
}
