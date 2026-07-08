import type {
  DevProject,
  MotionProject,
  WriterPost,
  Collaboration,
} from "./types";

/**
 * Placeholder content used only when Supabase env vars are absent, so the
 * site renders end-to-end before the database is wired. Copy mirrors the
 * approved design/code.html reference for the Developer persona.
 */

export const seedDevProjects: DevProject[] = [
  {
    id: "seed-dev-1",
    title: "System.Core",
    description:
      "High-performance rust-based microservice architecture for real-time data streaming.",
    screenshot_url: null,
    link: "#",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "seed-dev-2",
    title: "Nexus API",
    description:
      "GraphQL aggregation layer handling 10k+ requests/sec with edge caching.",
    screenshot_url: null,
    link: "#",
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "seed-dev-3",
    title: "Log_Parser",
    description:
      "CLI utility written in Go for distributed log analysis and anomaly detection.",
    screenshot_url: null,
    link: "#",
    created_at: "2026-01-03T00:00:00Z",
  },
];

export const seedCollaborations: Collaboration[] = [
  { id: "seed-col-1", org: "Vercel", role: "Core Infrastructure Contributor" },
  { id: "seed-col-2", org: "Stripe", role: "Payment Gateway Integration Consultant" },
  { id: "seed-col-3", org: "Linear", role: "Frontend Performance Optimization" },
  {
    id: "seed-col-4",
    org: "Open Source",
    role: "Maintainer of several high-traffic npm packages",
  },
];

export const seedMotionProjects: MotionProject[] = [
  {
    id: "seed-motion-1",
    title: "Kinetic Type Reel",
    description:
      "A montage of kinetic typography sequences built for a product launch campaign.",
    youtube_id: "dQw4w9WgXcQ",
    thumbnail_url: null,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "seed-motion-2",
    title: "UI Choreography",
    description:
      "Micro-interaction studies exploring easing, staggering, and spatial continuity.",
    youtube_id: "dQw4w9WgXcQ",
    thumbnail_url: null,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "seed-motion-3",
    title: "Brand Ident",
    description:
      "A five-second animated identity system with a modular logo build sequence.",
    youtube_id: "dQw4w9WgXcQ",
    thumbnail_url: null,
    created_at: "2026-01-03T00:00:00Z",
  },
];

export const seedWriterPosts: WriterPost[] = [
  {
    id: "seed-writer-1",
    title: "On writing that converts and connects",
    slug: "writing-that-converts",
    date: "2026-06-01",
    excerpt:
      "The best copy disappears. It leaves only the reader and the decision in front of them.",
    body: `Good writing is not decoration laid over an idea. It is the shape the idea takes when it finally becomes clear.

## The reader is already busy

Every sentence competes with the impulse to leave. Respect that. Say the true thing first, then earn the second sentence with the first.

## Rhythm is meaning

Short sentences land. Longer ones, the kind that unspool a thought across several clauses before arriving, create the space a reader needs to feel rather than merely register. Alternate them.

> Write to be understood, not to be admired.

That is the whole craft, most days.`,
    created_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "seed-writer-2",
    title: "Notes on the long-form rhythm",
    slug: "long-form-rhythm",
    date: "2026-05-12",
    excerpt:
      "A narrow column, a quiet palette, and one idea per paragraph. The rest is patience.",
    body: `A single column is a promise: I will not make you scan. Follow me down the page.

## One idea per paragraph

When a paragraph carries two ideas, the second one hides. Break it. Give each its own air.

## Endings

Stop when the argument is complete, not when the space runs out.`,
    created_at: "2026-05-12T00:00:00Z",
  },
];
