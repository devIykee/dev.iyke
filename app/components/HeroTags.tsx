import Link from "next/link";
import type { HeroTag } from "@/lib/types";

/**
 * Hero focus-area labels — technical annotations, not UI chrome. Rectangular
 * (5px radius), solid accent fill with near-black label text, a hairline drop
 * shadow, and a unique slight rotation each so they read as physically applied
 * stickers / PCB silkscreen labels.
 *
 * Placement: a wrapped row directly beneath the Hire Me / Resume buttons,
 * following the CTA cluster's alignment (centered on mobile, left from sm up).
 *
 * Colour note: fill/text use the accent + accent-ink tokens rather than a
 * hardcoded #050505, so contrast stays correct across all six persona × mode
 * combos (accent-ink IS the near-black #0d0d0d on the dark developer terminal).
 */

// Per-label resting rotation + relaxed hover rotation, so no two sit identically.
const ROTATIONS = [
  { rot: "rotate-[-4deg]", hover: "hover:rotate-[-2deg]" },
  { rot: "rotate-[3deg]", hover: "hover:rotate-[1.5deg]" },
  { rot: "rotate-[-2deg]", hover: "hover:rotate-[-1deg]" },
  { rot: "rotate-[5deg]", hover: "hover:rotate-[2.5deg]" },
  { rot: "rotate-[2deg]", hover: "hover:rotate-[1deg]" },
  { rot: "rotate-[-3deg]", hover: "hover:rotate-[-1.5deg]" },
];

// Rectangular label: solid fill, no border/gradient/blur, compact height with
// generous horizontal padding. Restrained hover — small lift, slightly deeper
// shadow, rotation eases off. No scaling or glow.
const LABEL_BASE =
  "inline-block rounded-[5px] bg-accent px-3 py-1 text-[13px] font-semibold leading-tight tracking-tight text-accent-ink shadow-[0_1px_2px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base";

export default function HeroTags({ tags }: { tags: HeroTag[] }) {
  if (!tags.length) return null;

  return (
    <div
      className="hero-in mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start"
      style={{ animationDelay: "340ms" }}
    >
      {tags.map((tag, i) => {
        const { rot, hover } = ROTATIONS[i % ROTATIONS.length];
        return (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            // Alternating padding keeps label widths from looking uniform.
            className={`${LABEL_BASE} ${rot} ${hover} ${i % 2 === 1 ? "px-3.5" : ""}`}
          >
            #{tag.label}
          </Link>
        );
      })}
    </div>
  );
}
