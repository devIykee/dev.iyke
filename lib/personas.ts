import type { Persona } from "./types";

export interface NavSection {
  label: string;
  href: string; // in-page anchor
  /** Hidden from the pill navbar on mobile (still shown on desktop). */
  desktopOnly?: boolean;
}

export interface PersonaConfig {
  id: Persona;
  /** Label shown in the drawer switcher. */
  name: string;
  /** Route path. */
  path: string;
  /** H2 suffix line under the constant "Hello, I'm Iyke" H1. */
  tagline: string;
  /** Bottom pill navbar section links (exact established copy). */
  sections: NavSection[];
  /** Material Symbols icon name for the drawer entry. */
  icon: string;
}

// Exact copy locked from the approved reference — do not invent new labels.
export const PERSONAS: Record<Persona, PersonaConfig> = {
  motion: {
    id: "motion",
    name: "Motion",
    path: "/motion",
    tagline: "...I design motion that guides attention.",
    icon: "movie_filter",
    sections: [
      { label: "Reel", href: "#reel" },
      { label: "Case Studies", href: "#case-studies" },
      { label: "Behind the Scenes", href: "#behind-the-scenes", desktopOnly: true },
      { label: "Contact", href: "#contact" },
    ],
  },
  developer: {
    id: "developer",
    name: "Developer",
    path: "/",
    tagline: "...I ship production Solana programs in Rust, and I build the full-stack apps around them.",
    icon: "code",
    sections: [
      { label: "Projects", href: "#projects" },
      { label: "Toolkit", href: "#toolkit", desktopOnly: true },
      { label: "Collaborations", href: "#collaborations" },
      { label: "Contact", href: "#contact" },
    ],
  },
  writer: {
    id: "writer",
    name: "Writer",
    path: "/writer",
    tagline: "...I write to explain, not to impress.",
    icon: "edit_note",
    sections: [
      { label: "Articles", href: "#articles" },
      { label: "Case Studies", href: "#case-studies" },
      { label: "Publications", href: "#publications", desktopOnly: true },
      { label: "Contact", href: "#contact" },
    ],
  },
};

export const PERSONA_ORDER: Persona[] = ["motion", "developer", "writer"];
