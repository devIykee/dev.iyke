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
 * Shared hero header: circular/rounded profile, constant H1 "Hello, I'm Iyke",
 * and the per-persona H2 tagline. Hire Me (filled) + Resume (outline) buttons
 * per DESIGN.md's button spec.
 */
export default function PersonaHeader({ persona }: { persona: Persona }) {
  const config = PERSONAS[persona];
  const t = HEADER_THEMES[persona];

  return (
    <header
      className={`sticky top-0 z-20 w-full border-b ${t.wrapper} ${t.border} px-4 py-4 md:px-margin`}
    >
      <div className="mx-auto flex max-w-bento items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Profile: real image if present, else a flat labelled placeholder frame */}
          <div
            className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden ${t.profileShape} ${t.profileFrame}`}
          >
            {t.showProfileImage ? (
              <Image
                src="/iyke-profile.jpg"
                alt="Portrait of Iyke"
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            ) : (
              <span className="font-mono text-[9px] tracking-widest">
                {t.profileLabel}
              </span>
            )}
          </div>

          <div>
            <h1 className={`m-0 text-h1 font-black ${t.h1}`}>Hello, I&apos;m Iyke</h1>
            <h2 className={`m-0 mt-1 font-normal ${t.h2}`}>{config.tagline}</h2>
          </div>
        </div>

        {/* Buttons hidden on small screens; hamburger sits top-right there */}
        <div className="mr-10 hidden gap-3 md:flex">
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
    </header>
  );
}
