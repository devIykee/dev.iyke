import type { Persona, HeroTag } from "@/lib/types";
import { PERSONAS } from "@/lib/personas";
import AppImage from "./AppImage";
import HeroTags from "./HeroTags";

// Only the profile shape differs per persona; all colors come from the semantic
// theme tokens (base/ink/accent…), so the six combos are automatic.
const PROFILE_SHAPE: Record<Persona, string> = {
  // Developer: soft rounded square to match the Bento tile aesthetic.
  developer: "rounded-3xl",
  // Motion / Writer: perfect circles to contrast the rigid grid.
  motion: "rounded-full",
  writer: "rounded-full",
};

/**
 * Shared hero header, sized to fill the viewport (100vh). H1 "Hello, I'm Iyke" +
 * per-persona H2 tagline and the Hire Me / Resume buttons sit beside a large
 * profile photo as one cohesive, centered unit. A subtle persona-tinted texture
 * (grid/dots/rules + faint grain) gives the flat background depth — no gradients
 * or glow. The theme toggle and hamburger live in the fixed top-right cluster.
 * Content staggers in on load (.hero-in).
 */
export default function PersonaHeader({
  persona,
  imageSrc = "/iyke-profile.jpg",
  tags = [],
}: {
  persona: Persona;
  imageSrc?: string;
  tags?: HeroTag[];
}) {
  const config = PERSONAS[persona];

  return (
    <header className="grain relative flex min-h-screen w-full flex-col justify-center overflow-hidden border-b border-border bg-base px-6 py-24 md:px-margin">
      {/* Flat linework texture layer */}
      <div className="hero-texture pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:text-left lg:gap-16">
        {/* LEFT: heading, tagline, actions (centered on mobile) */}
        <div className="order-2 max-w-xl sm:order-1 lg:max-w-2xl">
          <h1
            className="hero-in m-0 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl md:text-7xl"
            style={{ animationDelay: "60ms" }}
          >
            Hello, I&apos;m Iyke
          </h1>
          <h2
            className="hero-in m-0 mt-5 max-w-xl text-lg font-normal leading-relaxed text-muted sm:text-xl md:text-2xl"
            style={{ animationDelay: "160ms" }}
          >
            {config.tagline}
          </h2>

          <div
            className="hero-in mt-9 flex flex-wrap items-center justify-center gap-4 sm:justify-start"
            style={{ animationDelay: "260ms" }}
          >
            <a
              href="mailto:eokorie1911@gmail.com"
              className="rounded-full border border-accent bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            >
              Hire Me
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-accent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            >
              Resume
            </a>
          </div>
        </div>

        {/* RIGHT: large profile photo */}
        <div
          className={`hero-in order-1 relative flex aspect-square w-44 shrink-0 items-center justify-center overflow-hidden border border-border bg-elevated sm:order-2 sm:w-56 md:w-64 lg:w-80 ${PROFILE_SHAPE[persona]}`}
          style={{ animationDelay: "120ms" }}
        >
          <AppImage
            src={imageSrc}
            alt="Portrait of Iyke, multi-disciplinary designer and engineer"
            fill
            sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 320px"
            className="object-cover"
            priority
            unoptimized={imageSrc.startsWith("http")}
          />
        </div>
      </div>

      {/* Focus-area tag cloud — scattered pills (sm+) / wrapped row (mobile). */}
      <HeroTags tags={tags} />
    </header>
  );
}
