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
}

// Persona identifiers used to parameterize shared layout.
export type Persona = "motion" | "developer" | "writer";
