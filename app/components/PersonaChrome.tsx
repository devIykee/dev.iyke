"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { Persona } from "@/lib/types";
import { PERSONAS, PERSONA_ORDER } from "@/lib/personas";
import { HAMBURGER, DROPDOWN, PILL } from "@/lib/themes";
import ThemeToggle from "./ThemeToggle";

/**
 * Shared navigation chrome for all three public personas:
 *  - a top-RIGHT control cluster: theme toggle (left) + hamburger (right). The
 *    hamburger opens a glassmorphism dropdown persona switcher below it.
 *  - a top-center floating pill navbar of in-page section links that:
 *      · tracks the active section via scroll-spy (and click)
 *      · hides on scroll-down, reveals on scroll-up
 *      · blends into the hero background while at the very top, then turns to
 *        glass once scrolled past the hero
 *      · springs slightly on hover
 *
 * Colors come from semantic theme tokens so the chrome follows persona × mode.
 * Labels use the single app font (font-chrome maps to it).
 */
export default function PersonaChrome({ persona }: { persona: Persona }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false); // hidden after idle (past hero)
  const [atTop, setAtTop] = useState(true); // blend-into-hero at very top
  const [active, setActive] = useState(0); // scroll-spy index
  const menuRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Scroll handler: reveal the nav on ANY scroll activity once past the hero,
  // then hide it again after a short idle pause. At the very top it blends into
  // the hero (and always stays visible). This is direction-agnostic — any scroll
  // reliably brings it up.
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const past = y > window.innerHeight * 0.85; // scrolled past the ~100vh hero
      setAtTop(!past);

      if (!past) {
        // Over the hero: always shown (blended), cancel any pending hide.
        if (idleTimer.current) clearTimeout(idleTimer.current);
        setHidden(false);
        return;
      }

      // Past the hero: show on any scroll, then hide after the user stops.
      setHidden(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setHidden(true), 1600);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
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
        <ThemeToggle className={`rounded-lg ${HAMBURGER}`} />

        <div className="relative">
          <button
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((v) => !v)}
            className={`flex items-center justify-center rounded-lg p-2 text-ink transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${HAMBURGER}`}
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

      {/* Top-center floating pill navbar.
          Outer wrapper owns centering + hide/reveal (ease-out, no bounce);
          inner nav owns the hover spring — so the transforms never clobber. */}
      <div
        onMouseEnter={() => {
          if (idleTimer.current) clearTimeout(idleTimer.current);
          setHidden(false);
        }}
        className={`fixed left-1/2 top-3 z-40 -translate-x-1/2 transition-[opacity,transform] duration-300 ease-out ${
          hidden
            ? "pointer-events-none -translate-y-[150%] opacity-0"
            : "opacity-100"
        }`}
      >
        <nav
          aria-label="Section navigation"
          className={`nav-bounce flex w-fit max-w-[calc(100vw-11rem)] items-center gap-1 overflow-x-auto rounded-full px-2 py-2 font-chrome no-scrollbar transition-[background-color,box-shadow,border-color] duration-300 sm:max-w-[calc(100vw-16rem)] ${
            atTop ? PILL.blend : PILL.glass
          }`}
        >
          {config.sections.map((s, i) => (
            <a
              key={s.href}
              href={s.href}
              onClick={() => onNavClick(i)}
              aria-current={i === active ? "true" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                i === active ? PILL.itemActive : PILL.itemIdle
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider">{s.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
