import { SOCIAL_ICON_PATHS } from "@/lib/social-paths";

export type SocialKey =
  | "x"
  | "linkedin"
  | "github"
  | "tiktok"
  | "telegram"
  | "instagram"
  | "youtube";

const URLS: Record<SocialKey, string> = {
  x: "https://x.com/Deviykee",
  linkedin: "https://www.linkedin.com/in/emmanuel-okorie-6770a5373/",
  github: "https://github.com/devIykee",
  tiktok: "https://www.tiktok.com/@iykexbt",
  telegram: "https://t.me/deviykee",
  instagram: "https://www.instagram.com/deviykee",
  youtube: "https://www.youtube.com/@devIykee",
};

const LABELS: Record<SocialKey, string> = {
  x: "X",
  linkedin: "LinkedIn",
  github: "GitHub",
  tiktok: "TikTok",
  telegram: "Telegram",
  instagram: "Instagram",
  youtube: "YouTube",
};

export const ALL_SOCIALS: SocialKey[] = [
  "x",
  "linkedin",
  "github",
  "tiktok",
  "telegram",
  "instagram",
  "youtube",
];

/**
 * Row of monochrome (currentColor) social icons — same flat treatment as the
 * Toolkit brand icons, tinted by the persona accent on hover. Each opens in a
 * new tab. Pass `items` to control which subset renders.
 */
export default function SocialLinks({
  items = ALL_SOCIALS,
  className = "",
  size = 20,
}: {
  items?: SocialKey[];
  className?: string;
  size?: number;
}) {
  return (
    <ul className={`m-0 flex list-none items-center gap-3 p-0 ${className}`}>
      {items.map((key) => (
        <li key={key}>
          <a
            href={URLS[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${LABELS[key]} (opens in a new tab)`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={SOCIAL_ICON_PATHS[key]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
