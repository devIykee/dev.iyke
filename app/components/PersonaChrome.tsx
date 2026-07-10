"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { Persona } from "@/lib/types";
import { PERSONAS, PERSONA_ORDER } from "@/lib/personas";
import { HAMBURGER, DROPDOWN, PILL } from "@/lib/themes";
import ThemeToggle from "./ThemeToggle";

/**
 * Shared navigation chrome for all three public personas:
 *  - a top-RIGHT control cluster: theme toggle + hamburger. The hamburger opens
 *    a glassmorphism dropdown persona switcher below it.
 *  - a floating pill navbar of in-page section links (bottom-center on mobile,
 *    top-center on desktop) that tracks the active section via scroll-spy and
 *    hides on scroll-down / reveals on scroll-up.
 *
 * IMPORTANT: this component must be rendered OUTSIDE any ancestor that has a CSS
 * transform (e.g. an entrance animation) or overflow clipping — a transformed
 * ancestor becomes the containing block for position:fixed children and, with
 * overflow-hidden, clips them off-screen. The persona pages render it as a
 * sibling of the animated content for exactly this reason.
 *
 * Colors come from semantic theme tokens so the chrome follows persona × mode.
 */
export default function PersonaChrome({ persona }: { persona: Persona }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false); // hide-on-scroll-down
  const [active, setActive] = useState(0); // scroll-spy index
  const menuRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const config = PERSONAS[persona];
  const sectionIds = config.sections.map((s) => s.href.replace(/^#/, ""));

  // Close dropdown on Escape or outside click.
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

  // Standard "smart navbar": always visible near the top; once scrolled down a
  // bit, hide on scroll-DOWN and reveal on scroll-UP. Always keeps a readable
  // frosted background (no transparent state) so it's visible on every viewport.
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;

      if (y < 80) {
        setHidden(false); // near the top → always shown
      } else if (y > lastY.current + 6) {
        setHidden(true); // scrolling down → hide
      } else if (y < lastY.current - 6) {
        setHidden(false); // scrolling up → reveal
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: mark the section currently in view as active.
  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the most-visible intersecting section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = sectionIds.indexOf(visible.target.id);
          if (idx >= 0) setActive(idx);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona]);

  const onNavClick = useCallback((i: number) => setActive(i), []);

  return (
    <>
      {/* Top-right control cluster: toggle (left) + hamburger (right) */}
      <div
        ref={menuRef}
        className="fixed right-4 top-4 z-50 flex items-center gap-2 font-chrome md:right-margin"
      >
        <ThemeToggle
          className={`h-11 w-11 rounded-xl sm:h-10 sm:w-10 ${HAMBURGER}`}
        />

        <div className="relative">
          <button
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((v) => !v)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-10 sm:w-10 ${HAMBURGER}`}
          >
            <span className="material-symbols-outlined">
              {open ? "close" : "menu"}
            </span>
          </button>

          {/* Glassmorphism dropdown — opens below the hamburger, right-aligned */}
          <div
            role="menu"
            className={`absolute right-0 top-full mt-2 w-64 origin-top-right overflow-hidden rounded-xl ${DROPDOWN.panel} transition-all duration-200 ${
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
                  const isActive = key === persona;
                  return (
                    <li key={key} role="none">
                      <Link
                        role="menuitem"
                        href={p.path}
                        onClick={() => setOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          isActive ? DROPDOWN.itemActive : DROPDOWN.itemIdle
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={
                            isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
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
      </div>

      {/* Section pill: bottom-center on mobile (clears the top-right hamburger),
          top-center on desktop. Hide slides toward its own edge (down on mobile,
          up on desktop) so it never crosses the viewport. */}
      <div
        className={`fixed left-1/2 z-40 -translate-x-1/2 transition-[opacity,transform] duration-300 ease-out bottom-5 top-auto sm:bottom-auto sm:top-3 ${
          hidden
            ? "pointer-events-none translate-y-[150%] opacity-0 sm:-translate-y-[150%]"
            : "opacity-100"
        }`}
      >
        <nav
          aria-label="Section navigation"
          className={`nav-bounce flex w-fit max-w-[calc(100vw-2rem)] items-center gap-1 overflow-x-auto rounded-full px-2 py-1.5 font-chrome no-scrollbar transition-[box-shadow] duration-300 sm:max-w-[calc(100vw-16rem)] ${PILL.glass}`}
        >
          {config.sections.map((s, i) => (
            <a
              key={s.href}
              href={s.href}
              onClick={() => onNavClick(i)}
              aria-current={i === active ? "true" : undefined}
              className={`flex shrink-0 items-center rounded-full px-3.5 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:px-4 ${
                i === active ? PILL.itemActive : PILL.itemIdle
              }`}
            >
              <span className="text-[11px] uppercase tracking-wider sm:text-[10px]">
                {s.label}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
