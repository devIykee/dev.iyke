import type { Persona } from "@/lib/types";
import { PERSONAS } from "@/lib/personas";
import AppImage from "./AppImage";

// Only the profile shape differs per persona now; all colors come from the
// semantic theme tokens (base/ink/accent…), so the six combos are automatic.
const PROFILE_SHAPE: Record<Persona, string> = {
  // Developer: rounded square (8px) to match the Bento tile aesthetic.
  developer: "rounded-2xl",
  // Motion / Writer: perfect circles to contrast the rigid grid.
  motion: "rounded-full",
  writer: "rounded-full",
};

// The tagline keeps the persona's content font; the constant H1 is chrome.
const TAGLINE_FONT: Record<Persona, string> = {
  developer: "font-mono",
  motion: "font-sans",
  writer: "font-serif italic",
};

/**
 * Shared hero header, sized to fill the viewport (100vh): a large H1 "Hello, I'm
 * Iyke" (General Sans chrome) + per-persona H2 tagline and the Hire Me / Resume
 * buttons on the LEFT; a large profile photo on the RIGHT. The theme toggle and
 * hamburger live in the fixed top-right cluster (PersonaChrome), not here.
 */
export default function PersonaHeader({ persona }: { persona: Persona }) {
  const config = PERSONAS[persona];

  return (
    <header className="flex min-h-screen w-full flex-col justify-center border-b border-border bg-base px-6 py-24 md:px-margin">
      <div className="mx-auto flex w-full max-w-bento flex-col items-start justify-between gap-10 sm:flex-row sm:items-center sm:gap-12">
        {/* LEFT: heading, tagline, actions */}
        <div className="order-2 sm:order-1">
          <h1 className="m-0 font-chrome text-5xl font-black leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl lg:text-8xl">
            Hello, I&apos;m Iyke
          </h1>
          <h2
            className={`m-0 mt-5 max-w-2xl font-normal text-muted text-xl sm:text-2xl md:text-3xl ${TAGLINE_FONT[persona]}`}
          >
            {config.tagline}
          </h2>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button className="border border-accent bg-accent px-8 py-3 font-chrome text-sm font-semibold uppercase tracking-wide text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base">
              Hire Me
            </button>
            <button className="border border-accent px-8 py-3 font-chrome text-sm font-semibold uppercase tracking-wide text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base">
              Resume
            </button>
          </div>
        </div>

        {/* RIGHT: large profile photo */}
        <div
          className={`order-1 relative flex aspect-square w-40 shrink-0 items-center justify-center overflow-hidden border border-border bg-elevated sm:order-2 sm:w-52 md:w-64 lg:w-72 ${PROFILE_SHAPE[persona]}`}
        >
          <AppImage
            src="/iyke-profile.jpg"
            alt="Portrait of Iyke, multi-disciplinary designer and engineer"
            fill
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 256px, 288px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
}
