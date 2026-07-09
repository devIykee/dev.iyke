# Iyke.dev — Multi-Persona Portfolio

A single site with three distinct visual personas — **Motion**, **Developer**, and
**Writer** — each with its own color, typography, and layout, plus a passcode-gated
admin dashboard for managing content. Built with the Next.js App Router, TypeScript,
Tailwind CSS, and Supabase (Postgres).

The design system is defined in [`design/DESIGN.md`](design/DESIGN.md); the approved
Developer reference is [`design/code.html`](design/code.html).

## Routes

| Route              | Persona    | Base            | Accent          | Font              | Layout                       |
| ------------------ | ---------- | --------------- | --------------- | ----------------- | ---------------------------- |
| `/`                | Developer  | near-black      | Terminal green  | JetBrains Mono    | 12-column Bento              |
| `/motion`          | Motion     | off-white       | Electric Blue   | Inter             | 2–3 column grid              |
| `/writer`          | Writer     | warm cream      | Deep Burgundy   | Playfair Display  | single 720px reading rail    |
| `/writer/[slug]`   | Writer     | —               | —               | —                 | rendered Markdown article    |
| `/admin`           | —          | (private)       | —               | —                 | passcode-gated CRUD dashboard |

Every public persona shares: a top-right **hamburger → 300px right-hand drawer**
(persona switcher, active one marked) and a **bottom-center floating pill navbar**
(backdrop-blur, no shadow) linking to in-page sections. The H1 "Hello, I'm Iyke"
is constant; the H2 tagline changes per persona.

## Content model — Supabase (Postgres)

All content lives in Postgres tables. Public pages read **server-side** with
the anon key; `/admin` writes go through API routes using the **service-role key**.
This persists correctly on Vercel (unlike local-file writes, which do not survive
serverless deploys).

Tables: `dev_projects`, `motion_projects`, `writer_posts`, `collaborations`,
`toolkit_items` — see [`supabase/schema.sql`](supabase/schema.sql).

- `collaborations` carries `logo_url`, an optional `link_url` (when set, the org
  name becomes a clickable link — typically to a Writer blog post), and
  `sort_order` for manual ordering.
- `toolkit_items` (`name`, `icon_key`, `sort_order`) drives the Developer Toolkit
  grid; `icon_key` is a Material Symbols name from the curated list in
  [`lib/icons.ts`](lib/icons.ts).

> If Supabase env vars are absent — or a table hasn't been created yet — pages
> fall back to seed placeholder content (see `lib/seed.ts`) so the site still
> builds and renders.

> **Upgrading an existing database:** if your DB predates the Toolkit /
> Collaboration-logo features, run
> [`supabase/migrations/001_toolkit_and_collaborations.sql`](supabase/migrations/001_toolkit_and_collaborations.sql)
> once in the SQL editor. It adds `toolkit_items` and the new `collaborations`
> columns (idempotent). Fresh installs get everything from `schema.sql`.

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment

Copy the example and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable                        | Where used         | Notes                                        |
| ------------------------------- | ------------------ | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | client + server    | Supabase project URL                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public reads       | anon/public key (RLS-restricted)             |
| `SUPABASE_SERVICE_ROLE_KEY`     | `/api/admin/*` only| **server-only**, bypasses RLS — never expose |
| `ADMIN_PASSCODE`                | `/admin` login     | the passcode you type into the gate          |
| `ADMIN_SESSION_SECRET`          | session JWT        | long random string (`openssl rand -base64 48`) |

### 3. Database

In the Supabase dashboard → **SQL Editor**, paste and run
[`supabase/schema.sql`](supabase/schema.sql). It creates the four tables, enables
Row-Level Security with public-read policies, and seeds a few starter rows.

### 4. Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Admin dashboard

- **No link exists anywhere in the public UI** — reach it by typing `/admin`.
- Enter `ADMIN_PASSCODE`; on success a **signed, HttpOnly session cookie** (JWT via
  `jose`) is set, so you stay logged in across visits. "Log out" clears it.
- Three tabs — **Developer**, **Motion**, **Writer/Blog** — each add / edit / delete
  its content type. The Motion form accepts a full YouTube URL *or* a bare video ID
  (the ID is parsed out server-side). The Writer form has a Markdown body textarea and
  auto-generates a slug from the title.
- Two more tabs — **Toolkit** and **Collaborations** — support add / edit / delete
  plus **reorder** (up/down arrows persist `sort_order`). Toolkit uses an icon picker
  (Material Symbols) with a live preview; Collaborations takes a logo URL and an
  optional link URL.
- Every write is guarded **server-side** (`lib/auth.ts` + `middleware.ts`); hiding the
  UI is never the only defense.

## Deployment (Vercel)

Add the five environment variables in **Project → Settings → Environment Variables**,
then deploy. Because all content is stored in Supabase (not the filesystem), admin
edits persist normally on Vercel's serverless runtime. `@vercel/analytics` and
`@vercel/speed-insights` are already wired into the root layout.

## Project structure

```
app/
  (developer)/page.tsx   Developer persona (migrated from design/code.html)
  motion/page.tsx        Motion persona
  writer/page.tsx        Writer index + writer/[slug]/page.tsx article
  admin/                 Passcode gate + dashboard (client) + resource manager
  api/admin/             login, logout, dev-projects, motion-projects, writer-posts
  components/            PersonaHeader, PersonaChrome (drawer + pill nav), Footer, ScreenshotFrame
lib/
  personas.ts themes.ts  Per-persona config + token class maps
  supabase.ts data.ts    Clients + server-only read layer (with seed fallback)
  auth.ts admin-api.ts    Session JWT + write-route guard
  types.ts seed.ts youtube.ts slug.ts
supabase/schema.sql       Run once in the Supabase SQL editor
design/                   DESIGN.md (source of truth), code.html, screen.png
```

## Design fidelity

Strict Minimalism per `DESIGN.md`: no gradients, glows, or shadows — flat color
blocking and 1px line work only. Placeholders are flat-fill rectangles/circles with a
small centered label, never generated illustrations.
