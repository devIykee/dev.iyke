-- ===========================================================================
-- Migration 003 — Hero tag cloud + per-tag showcase pages
-- Run in Supabase SQL Editor. Safe to re-run (idempotent).
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- hero_tags — the clickable "tag pills" scattered around each persona's hero.
-- NOTE: the field is named sort_order (not "order") because ORDER is a reserved
-- SQL keyword; the rest of the codebase already uses sort_order for ordering.
-- ---------------------------------------------------------------------------
create table if not exists public.hero_tags (
  id         uuid primary key default gen_random_uuid(),
  persona    text not null check (persona in ('developer', 'motion', 'writer')),
  label      text not null,          -- short display label shown on the pill
  slug       text not null,          -- URL slug -> /tags/<slug>
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  -- A persona can only list a given slug once; two personas MAY share a slug
  -- (e.g. Solana appears for both Developer and Writer) and then share one
  -- showcase page.
  unique (persona, slug)
);

-- ---------------------------------------------------------------------------
-- tag_showcases — one curated showcase per tag slug: a short intro blurb plus
-- an ordered list of existing project/post ids to feature on /tags/<slug>.
-- ---------------------------------------------------------------------------
create table if not exists public.tag_showcases (
  id          uuid primary key default gen_random_uuid(),
  tag_slug    text not null unique,
  intro_blurb text not null default '',
  -- Ids reference the persona's existing content table (dev_projects,
  -- motion_projects, or writer_posts) — a lightweight many-to-many by array.
  project_ids text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security — public read only; all writes go through the service-role
-- admin routes (which bypass RLS), matching every other table in this project.
-- ---------------------------------------------------------------------------
alter table public.hero_tags     enable row level security;
alter table public.tag_showcases enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'hero_tags public read') then
    create policy "hero_tags public read" on public.hero_tags for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'tag_showcases public read') then
    create policy "tag_showcases public read" on public.tag_showcases for select using (true);
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- Seed the tag pills (safe to delete once managed via /admin > Tags).
-- Labels are tight synonyms of the real focus areas, styled to fit the site.
-- ---------------------------------------------------------------------------
insert into public.hero_tags (persona, label, slug, sort_order) values
  ('developer', 'SecRes',     'security-research', 0),
  ('developer', 'Solana',     'solana',            1),
  ('developer', 'Java',       'java',              2),
  ('developer', 'Full-Stack', 'full-stack',        3),
  ('motion',    'Motion',     'motion-design',     0),
  ('motion',    'TikTok',     'tiktok',            1),
  ('motion',    'YouTube',    'youtube',           2),
  ('motion',    'UI Anim',    'ui-animation',      3),
  ('writer',    'Tech Writing', 'technical-writing', 0),
  ('writer',    'Case Studies', 'case-studies',      1),
  ('writer',    'Solana',       'solana',            2)
on conflict (persona, slug) do nothing;

-- Placeholder showcases. Real blurbs / project links are filled in via /admin.
-- The Security Research showcase carries a real intro (see the security-research
-- research workspace); its featured findings are linked from the admin Tags tab.
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
