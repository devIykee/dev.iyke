// Row shapes for the four Supabase tables. Kept in one place so the data
// layer, pages, and admin forms all agree on field names.

export interface DevProject {
  id: string;
  title: string;
  description: string;
  screenshot_url: string | null;
  link: string | null;
  created_at: string;
}

export interface MotionProject {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  thumbnail_url: string | null;
  created_at: string;
}

export interface WriterPost {
  id: string;
  title: string;
  slug: string;
  date: string; // ISO date (YYYY-MM-DD)
  excerpt: string;
  body: string; // markdown
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

// Persona identifiers used to parameterize shared layout.
export type Persona = "motion" | "developer" | "writer";
