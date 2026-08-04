-- ===========================================================================
-- Iyke.dev — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- ===========================================================================

-- Extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.dev_projects (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text not null default '',
  screenshot_url text,
  link           text,
  -- Free-form tag slugs (migration 004). A project appears on /tags/<slug>
  -- automatically when this array contains that slug.
  tags           text[] not null default '{}',
  created_at     timestamptz not null default now()
);

create table if not exists public.motion_projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null default '',
  youtube_id    text not null,
  thumbnail_url text,
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now()
);

create table if not exists public.writer_posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  date        date not null default current_date,
  excerpt     text not null default '',
  body        text not null default '',
  status      text not null default 'published' check (status in ('draft', 'published')),
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- If the table predates draft/publish, add the column (migration 002).
alter table public.writer_posts add column if not exists status text not null default 'published';

-- Tag arrays for auto-discovery on /tags/<slug> (migration 004).
alter table public.dev_projects    add column if not exists tags text[] not null default '{}';
alter table public.motion_projects add column if not exists tags text[] not null default '{}';
alter table public.writer_posts    add column if not exists tags text[] not null default '{}';
create index if not exists dev_projects_tags_idx    on public.dev_projects    using gin (tags);
create index if not exists motion_projects_tags_idx on public.motion_projects using gin (tags);
create index if not exists writer_posts_tags_idx    on public.writer_posts    using gin (tags);

create table if not exists public.collaborations (
  id         uuid primary key default gen_random_uuid(),
  org        text not null,
  role       text not null default '',
  logo_url   text,
  link_url   text,
  sort_order integer not null default 0
);

-- If the table already existed from an earlier version, add the new columns.
alter table public.collaborations add column if not exists logo_url   text;
alter table public.collaborations add column if not exists link_url   text;
alter table public.collaborations add column if not exists sort_order integer not null default 0;

create table if not exists public.toolkit_items (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  icon_key   text not null default 'code',
  sort_order integer not null default 0
);

-- Hero tag pills + per-tag showcase pages (migration 003). sort_order (not
-- "order", a reserved keyword) mirrors the rest of the schema.
create table if not exists public.hero_tags (
  id         uuid primary key default gen_random_uuid(),
  persona    text not null check (persona in ('developer', 'motion', 'writer')),
  label      text not null,
  slug       text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (persona, slug)
);

create table if not exists public.tag_showcases (
  id          uuid primary key default gen_random_uuid(),
  tag_slug    text not null unique,
  intro_blurb text not null default '',
  -- Optional manual pin list: these ids render first, in this order. Items that
  -- carry the slug in their own `tags` array are appended automatically.
  project_ids text[] not null default '{}',
  -- Optional role-specific résumé surfaced on this showcase only (migration 004).
  resume_url  text,
  created_at  timestamptz not null default now()
);

alter table public.tag_showcases add column if not exists resume_url text;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public pages read with the anon key -> allow SELECT to everyone.
-- All writes go through server-side admin routes using the service-role key,
-- which BYPASSES RLS, so we deliberately grant no anon insert/update/delete.
-- ---------------------------------------------------------------------------
alter table public.dev_projects     enable row level security;
alter table public.motion_projects  enable row level security;
alter table public.writer_posts     enable row level security;
alter table public.collaborations   enable row level security;
alter table public.toolkit_items    enable row level security;
alter table public.hero_tags        enable row level security;
alter table public.tag_showcases    enable row level security;

do $$
begin
  -- dev_projects
  if not exists (select 1 from pg_policies where policyname = 'dev_projects public read') then
    create policy "dev_projects public read" on public.dev_projects for select using (true);
  end if;
  -- motion_projects
  if not exists (select 1 from pg_policies where policyname = 'motion_projects public read') then
    create policy "motion_projects public read" on public.motion_projects for select using (true);
  end if;
  -- writer_posts
  if not exists (select 1 from pg_policies where policyname = 'writer_posts public read') then
    create policy "writer_posts public read" on public.writer_posts for select using (true);
  end if;
  -- collaborations
  if not exists (select 1 from pg_policies where policyname = 'collaborations public read') then
    create policy "collaborations public read" on public.collaborations for select using (true);
  end if;
  -- toolkit_items
  if not exists (select 1 from pg_policies where policyname = 'toolkit_items public read') then
    create policy "toolkit_items public read" on public.toolkit_items for select using (true);
  end if;
  -- hero_tags
  if not exists (select 1 from pg_policies where policyname = 'hero_tags public read') then
    create policy "hero_tags public read" on public.hero_tags for select using (true);
  end if;
  -- tag_showcases
  if not exists (select 1 from pg_policies where policyname = 'tag_showcases public read') then
    create policy "tag_showcases public read" on public.tag_showcases for select using (true);
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- Optional: seed a few rows so the site has content immediately.
-- Safe to delete once you add your own via /admin.
-- ---------------------------------------------------------------------------
insert into public.dev_projects (title, description, link) values
  ('System.Core', 'High-performance rust-based microservice architecture for real-time data streaming.', '#'),
  ('Nexus API', 'GraphQL aggregation layer handling 10k+ requests/sec with edge caching.', '#'),
  ('Log_Parser', 'CLI utility written in Go for distributed log analysis and anomaly detection.', '#')
on conflict do nothing;

insert into public.collaborations (org, role, sort_order) values
  ('Vercel', 'Core Infrastructure Contributor', 0),
  ('Stripe', 'Payment Gateway Integration Consultant', 1),
  ('Linear', 'Frontend Performance Optimization', 2),
  ('Open Source', 'Maintainer of several high-traffic npm packages', 3)
on conflict do nothing;

insert into public.toolkit_items (name, icon_key, sort_order) values
  ('Rust', 'rust', 0),
  ('Solana', 'solana', 1),
  ('Next.js', 'nextjs', 2),
  ('TypeScript', 'typescript', 3),
  ('PERN Stack', 'pern', 4)
on conflict do nothing;

insert into public.hero_tags (persona, label, slug, sort_order) values
  ('developer', 'SecRes',       'security-research', 0),
  ('developer', 'Solana',       'solana',            1),
  ('developer', 'Java',         'java',              2),
  ('developer', 'Full-Stack',   'full-stack',        3),
  ('motion',    'Motion',       'motion-design',     0),
  ('motion',    'TikTok',       'tiktok',            1),
  ('motion',    'YouTube',      'youtube',           2),
  ('motion',    'UI Anim',      'ui-animation',      3),
  ('writer',    'Tech Writing', 'technical-writing', 0),
  ('writer',    'Case Studies', 'case-studies',      1),
  ('writer',    'Solana',       'solana',            2)
on conflict (persona, slug) do nothing;

insert into public.tag_showcases (tag_slug, intro_blurb) values
  ('security-research', 'Authorized Web3 / smart-contract security research — audits and bug-bounty work on launchpad and DeFi protocols. Fork / eth_call / local-Foundry methodology; high-severity findings responsibly disclosed. Selected writeups below.'),
  ('solana',            '[Intro blurb for #Solana goes here]'),
  ('java',              '[Intro blurb for #Java goes here]'),
  ('full-stack',        '[Intro blurb for #Full-Stack goes here]'),
  ('motion-design',     '[Intro blurb for #Motion goes here]'),
  ('tiktok',            '[Intro blurb for #TikTok goes here]'),
  ('youtube',           '[Intro blurb for #YouTube goes here]'),
  ('ui-animation',      '[Intro blurb for #UI-Animation goes here]'),
  ('technical-writing', '[Intro blurb for #Technical-Writing goes here]'),
  ('case-studies',      '[Intro blurb for #Case-Studies goes here]')
on conflict (tag_slug) do nothing;
