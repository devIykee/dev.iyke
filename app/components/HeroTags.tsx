import Link from "next/link";
import type { HeroTag } from "@/lib/types";

/**
 * Hero "tag cloud" — a few clickable focus-area pills scattered around the hero.
 * Styled to read as a native part of the site's design language: the same
 * rounded-full pill shape as the Hire Me / Resume buttons, a hairline accent
 * border over a near-transparent fill, and small accent text — not a loud
 * colour block. Each pill is slightly rotated for energy and links to its
 * showcase page at /tags/<slug>.
 *
 * Two layouts share one tag list:
 *  - mobile: a centered, wrapped row in normal flow (below the hero actions);
 *  - sm+: absolutely-positioned scatter near the hero's corners/edges.
 */

// Scatter presets (sm+). Kept clear of the centered content and the fixed
// top-right chrome cluster. Cycles if there are more tags than presets.
const SCATTER = [
  "left-[5%] top-[20%] -rotate-6",
  "left-[9%] bottom-[16%] rotate-3",
  "right-[6%] top-[32%] rotate-6",
  "right-[8%] bottom-[19%] -rotate-3",
  "left-[16%] top-[8%] rotate-2",
  "right-[15%] bottom-[8%] -rotate-2",
];

const PILL_CLASS =
  "inline-flex items-center gap-1 rounded-full border border-accent/60 bg-accent/5 px-3.5 py-1.5 text-xs font-medium text-accent backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base";

function Pill({ tag }: { tag: HeroTag }) {
  return (
    <Link href={`/tags/${tag.slug}`} className={PILL_CLASS}>
      <span className="text-accent/50" aria-hidden="true">
        #
      </span>
      {tag.label}
    </Link>
  );
}

export default function HeroTags({ tags }: { tags: HeroTag[] }) {
  if (!tags.length) return null;

  return (
    <>
      {/* Mobile: wrapped row in normal flow */}
      <div className="hero-in mt-8 flex flex-wrap justify-center gap-2 sm:hidden">
        {tags.map((tag) => (
          <Pill key={tag.id} tag={tag} />
        ))}
      </div>

      {/* sm+: scattered, rotated pills around the hero edges */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] hidden sm:block"
        aria-hidden="false"
      >
        {tags.map((tag, i) => (
          <div
            key={tag.id}
            className={`hero-in pointer-events-auto absolute ${SCATTER[i % SCATTER.length]}`}
            style={{ animationDelay: `${360 + i * 90}ms` }}
          >
            <Pill tag={tag} />
          </div>
        ))}
      </div>
    </>
  );
}
