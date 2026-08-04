// Row shapes for the four Supabase tables. Kept in one place so the data
// layer, pages, and admin forms all agree on field names.

export interface DevProject {
  id: string;
  title: string;
  description: string;
  screenshot_url: string | null;
  link: string | null;
  // Tag slugs this project belongs to. Drives auto-discovery on /tags/<slug>.
  tags?: string[];
  created_at: string;
}

export interface MotionProject {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  thumbnail_url: string | null;
  tags?: string[];
  created_at: string;
}

export interface WriterPost {
  id: string;
  title: string;
  slug: string;
  date: string; // ISO date (YYYY-MM-DD)
  excerpt: string;
  body: string; // markdown
  status?: "draft" | "published"; // optional until migration 002 is applied
  tags?: string[];
  created_at: string;
}

export interface Collaboration {
  id: string;
  org: string;
  role: string;
  logo_url: string | null;
  // If set, the org name / row becomes a clickable link (often a Writer blog post).
  link_url: string | null;
  sort_order: number;
}

export interface ToolkitItem {
  id: string;
  name: string;
  // Material Symbols icon name, e.g. "code_blocks" — same set as the Developer page.
  icon_key: string;
  sort_order: number;
}

// A clickable "tag pill" scattered around a persona's hero. Links to its
// showcase page at /tags/<slug>.
export interface HeroTag {
  id: string;
  persona: Persona;
  label: string;
  slug: string;
  // sort_order (not "order" — reserved SQL keyword) matches the DB column.
  sort_order: number;
}

// The curated showcase behind each tag slug: a short intro blurb + an ordered
// list of existing project/post ids to feature on /tags/<slug>.
export interface TagShowcase {
  id: string;
  tag_slug: string;
  intro_blurb: string;
  // Manual pins: rendered first, in this order. Anything else carrying the slug
  // in its own `tags` array is appended automatically.
  project_ids: string[];
  // Optional role-specific résumé link shown on this showcase only.
  resume_url?: string | null;
  created_at: string;
}

// Persona identifiers used to parameterize shared layout.
export type Persona = "motion" | "developer" | "writer";
