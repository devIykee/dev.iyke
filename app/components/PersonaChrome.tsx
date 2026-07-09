"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Persona } from "@/lib/types";
import { PERSONAS, PERSONA_ORDER } from "@/lib/personas";
import { HAMBURGER, DROPDOWN, PILL } from "@/lib/themes";

/**
 * Shared navigation chrome for all three public personas:
 *  - a top-LEFT hamburger that opens a glassmorphism dropdown directly below it
 *    (persona switcher, active one marked)
 *  - a bottom-center floating glass pill navbar of in-page section links
 *
 * All colors come from semantic theme tokens (accent/base/ink…) so the chrome
 * follows the active persona × mode automatically. Labels use General Sans
 * (font-chrome) so nav never borrows the persona content font.
 */
export default function PersonaChrome({ persona }: { persona: Persona }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const config = PERSONAS[persona];

  // Close on Escape or outside click.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <>
      {/* Top-left hamburger + dropdown, anchored together */}
      <div ref={menuRef} className="fixed left-4 top-4 z-50 font-chrome md:left-margin">
        <button
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center justify-center rounded-lg p-2 transition-colors ${HAMBURGER}`}
        >
          <span className="material-symbols-outlined">
            {open ? "close" : "menu"}
          </span>
        </button>

        {/* Glassmorphism dropdown — opens directly below the icon */}
        <div
          className={`absolute left-0 top-full mt-2 w-64 origin-top-left overflow-hidden rounded-xl ${DROPDOWN.panel} transition-all duration-200 ${
            open
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none -translate-y-1 scale-95 opacity-0"
          }`}
        >
          <div className="px-4 pb-2 pt-4">
            <p className={`m-0 text-sm font-semibold ${DROPDOWN.title}`}>
              Persona Switcher
            </p>
            <p
              className={`m-0 mt-0.5 text-[11px] uppercase tracking-wider ${DROPDOWN.subtitle}`}
            >
              Select your view
            </p>
          </div>
          <nav className="p-2">
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {PERSONA_ORDER.map((key) => {
                const p = PERSONAS[key];
                const active = key === persona;
                return (
                  <li key={key}>
                    <Link
                      href={p.path}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
                        active ? DROPDOWN.itemActive : DROPDOWN.itemIdle
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={
                          active ? { fontVariationSettings: "'FILL' 1" } : undefined
                        }
                      >
                        {p.icon}
                      </span>
                      <span className="text-label uppercase">{p.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom-center floating glass pill navbar — frosted, rounded, subtle glow */}
      <nav
        className={`fixed bottom-6 left-1/2 z-30 flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full px-2 py-2 font-chrome ${PILL.bar}`}
      >
        {config.sections.map((s, i) => (
          <a
            key={s.href}
            href={s.href}
            className={`shrink-0 rounded-full px-4 py-2 transition-colors ${
              i === 0 ? PILL.itemActive : PILL.itemIdle
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">{s.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
