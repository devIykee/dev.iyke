import Image from "next/image";
import type { Persona } from "@/lib/types";
import { PERSONAS } from "@/lib/personas";
import ThemeToggle from "./ThemeToggle";

// Only the profile shape differs per persona now; all colors come from the
// semantic theme tokens (base/ink/accent…), so the six combos are automatic.
const PROFILE_SHAPE: Record<Persona, string> = {
  // Developer: rounded square (8px) to match the Bento tile aesthetic.
  developer: "rounded-lg",
  // Motion / Writer: perfect circles to contrast the rigid grid.
  motion: "rounded-full",
  writer: "rounded-full",
};

// The tagline keeps the persona's content font; the constant H1 is chrome.
const TAGLINE_FONT: Record<Persona, string> = {
  developer: "font-mono text-mono-base",
  motion: "font-sans text-base",
  writer: "font-serif italic text-lg",
};

/**
 * Shared hero header: H1 "Hello, I'm Iyke" (General Sans chrome) + per-persona
 * H2 tagline on the LEFT; profile photo on the RIGHT of the same row. The theme
 * toggle sits with the Hire Me / Resume buttons. pt clears the fixed hamburger.
 */
export default function PersonaHeader({ persona }: { persona: Persona }) {
  const config = PERSONAS[persona];

  return (
    <header className="flex min-h-screen w-full flex-col justify-center border-b border-border bg-base px-4 py-20 md:px-margin">
      <div className="mx-auto flex w-full max-w-bento flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        {/* LEFT: heading, tagline, actions */}
        <div className="order-2 sm:order-1">
          <h1 className="m-0 font-chrome text-h1 font-black text-ink">
            Hello, I&apos;m Iyke
          </h1>
          <h2 className={`m-0 mt-2 font-normal text-muted ${TAGLINE_FONT[persona]}`}>
            {config.tagline}
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <button className="border border-accent bg-accent px-6 py-2 font-chrome text-label uppercase text-accent-ink transition-opacity hover:opacity-90">
              Hire Me
            </button>
            <button className="border border-accent px-6 py-2 font-chrome text-label uppercase text-accent transition-colors hover:bg-accent hover:text-accent-ink">
              Resume
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* RIGHT: profile photo */}
        <div
          className={`order-1 relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border border-border bg-elevated sm:order-2 md:h-28 md:w-28 ${PROFILE_SHAPE[persona]}`}
        >
          <Image
            src="/iyke-profile.jpg"
            alt="Portrait of Iyke"
            fill
            sizes="112px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
}
