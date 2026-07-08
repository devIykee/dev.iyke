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
  created_at     timestamptz not null default now()
);

create table if not exists public.motion_projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null default '',
  youtube_id    text not null,
  thumbnail_url text,
  created_at    timestamptz not null default now()
);

create table if not exists public.writer_posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  date        date not null default current_date,
  excerpt     text not null default '',
  body        text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.collaborations (
  id   uuid primary key default gen_random_uuid(),
  org  text not null,
  role text not null default ''
);

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

insert into public.collaborations (org, role) values
  ('Vercel', 'Core Infrastructure Contributor'),
  ('Stripe', 'Payment Gateway Integration Consultant'),
  ('Linear', 'Frontend Performance Optimization'),
  ('Open Source', 'Maintainer of several high-traffic npm packages')
on conflict do nothing;
