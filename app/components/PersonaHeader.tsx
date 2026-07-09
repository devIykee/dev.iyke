import Image from "next/image";
import type { Persona } from "@/lib/types";
import { PERSONAS } from "@/lib/personas";

interface HeaderTheme {
  wrapper: string;
  border: string;
  h1: string;
  h2: string;
  profileShape: string;
  profileFrame: string;
  hireBtn: string;
  resumeBtn: string;
  showProfileImage: boolean;
  profileLabel?: string;
}

const HEADER_THEMES: Record<Persona, HeaderTheme> = {
  developer: {
    wrapper: "bg-dev-bg",
    border: "border-grid-border",
    h1: "text-white",
    h2: "text-dev-muted font-mono text-mono-base",
    // Developer: rounded square (8px) to match the Bento tile aesthetic.
    profileShape: "rounded-lg",
    profileFrame: "bg-dev-bg-elevated border border-grid-border text-outline",
    hireBtn:
      "bg-terminal-green text-dev-bg border border-terminal-green hover:bg-white",
    resumeBtn:
      "border border-terminal-green text-terminal-green hover:bg-dev-bg-elevated",
    showProfileImage: true,
    profileLabel: "IMG_PROFILE",
  },
  motion: {
    wrapper: "bg-motion-bg",
    border: "border-motion-border",
    h1: "text-motion-ink",
    h2: "text-motion-muted font-sans text-base",
    // Motion: perfect circle to contrast the rigid grid.
    profileShape: "rounded-full",
    profileFrame: "bg-motion-surface border border-motion-border text-motion-muted",
    hireBtn: "bg-motion-blue text-white border border-motion-blue hover:opacity-90",
    resumeBtn: "border border-motion-blue text-motion-blue hover:bg-white",
    showProfileImage: true,
  },
  writer: {
    wrapper: "bg-writer-bg",
    border: "border-writer-rule",
    h1: "text-writer-ink font-serif",
    h2: "text-writer-muted font-serif italic text-lg",
    profileShape: "rounded-full",
    profileFrame: "bg-writer-surface border border-writer-rule text-writer-muted",
    hireBtn:
      "bg-writer-burgundy text-writer-surface border border-writer-burgundy hover:opacity-90",
    resumeBtn:
      "border border-writer-burgundy text-writer-burgundy hover:bg-writer-surface",
    showProfileImage: true,
  },
};

/**
 * Shared hero header: H1 "Hello, I'm Iyke" + per-persona H2 tagline and the
 * Hire Me / Resume buttons on the LEFT; the profile photo on the RIGHT of the
 * same row, vertically centered. The main content section sits full-width below.
 * pt clears the fixed top-left hamburger from PersonaChrome.
 */
export default function PersonaHeader({ persona }: { persona: Persona }) {
  const config = PERSONAS[persona];
  const t = HEADER_THEMES[persona];

  return (
    <header
      className={`w-full border-b ${t.wrapper} ${t.border} px-4 pb-8 pt-20 md:px-margin`}
    >
      <div className="mx-auto flex max-w-bento flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        {/* LEFT: heading, tagline, actions */}
        <div className="order-2 sm:order-1">
          <h1 className={`m-0 text-h1 font-black ${t.h1}`}>Hello, I&apos;m Iyke</h1>
          <h2 className={`m-0 mt-2 font-normal ${t.h2}`}>{config.tagline}</h2>

          <div className="mt-6 flex gap-3">
            <button
              className={`font-label text-label uppercase ${t.hireBtn} px-6 py-2 transition-colors`}
            >
              Hire Me
            </button>
            <button
              className={`font-label text-label uppercase ${t.resumeBtn} px-6 py-2 transition-colors`}
            >
              Resume
            </button>
          </div>
        </div>

        {/* RIGHT: profile photo */}
        <div
          className={`order-1 relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden sm:order-2 md:h-28 md:w-28 ${t.profileShape} ${t.profileFrame}`}
        >
          {t.showProfileImage ? (
            <Image
              src="/iyke-profile.jpg"
              alt="Portrait of Iyke"
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          ) : (
            <span className="font-mono text-[9px] tracking-widest">
              {t.profileLabel}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
