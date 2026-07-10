import { BRAND_ICON_PATHS } from "./brand-paths";

/**
 * Brand logos for the Toolkit, sourced from Simple Icons (CC0). Stored as
 * single-path SVGs tinted with currentColor so they follow the persona/theme
 * color and match the flat, minimalist aesthetic.
 *
 * `key` is what's saved in toolkit_items.icon_key. "pern" is a composite (PERN
 * has no single logo) rendered as its four constituent marks.
 */
export const BRAND_KEYS = [
  "rust",
  "solana",
  "nextjs",
  "typescript",
  "pern",
  "postgresql",
  "express",
  "react",
  "node",
  "docker",
] as const;

export type BrandKey = (typeof BRAND_KEYS)[number];

export const BRAND_LABELS: Record<BrandKey, string> = {
  rust: "Rust",
  solana: "Solana",
  nextjs: "Next.js",
  typescript: "TypeScript",
  pern: "PERN (Postgres · Express · React · Node)",
  postgresql: "PostgreSQL",
  express: "Express",
  react: "React",
  node: "Node.js",
  docker: "Docker",
};

// Which single-path brands compose the PERN mark.
const PERN_PARTS = ["postgresql", "express", "react", "node"];

/**
 * Renders the brand logo for a given key. Falls back to a neutral code glyph
 * (Material Symbols) if the key isn't a known brand, so arbitrary admin entries
 * still render something sensible.
 */
export default function BrandIcon({
  brand,
  className = "",
  size = 20,
}: {
  brand: string;
  className?: string;
  size?: number;
}) {
  if (brand === "pern") {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`} aria-hidden="true">
        {PERN_PARTS.map((p) => (
          <svg
            key={p}
            role="img"
            viewBox="0 0 24 24"
            width={size * 0.78}
            height={size * 0.78}
            fill="currentColor"
          >
            <path d={BRAND_ICON_PATHS[p]} />
          </svg>
        ))}
      </span>
    );
  }

  const path = BRAND_ICON_PATHS[brand];
  if (!path) {
    // Unknown key → neutral glyph so nothing breaks.
    return (
      <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
        code
      </span>
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
