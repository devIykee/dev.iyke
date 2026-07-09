-- ===========================================================================
-- Migration 001 — Toolkit CRUD + Collaboration logos/links
-- Run once in the Supabase SQL Editor against an existing database created from
-- the first version of schema.sql. Idempotent: safe to run more than once.
-- (schema.sql already includes all of this for fresh installs.)
-- ===========================================================================

-- 1. Collaborations: logo, optional link, and manual ordering.
alter table public.collaborations add column if not exists logo_url   text;
alter table public.collaborations add column if not exists link_url   text;
alter table public.collaborations add column if not exists sort_order integer not null default 0;

-- Backfill sort_order from current alphabetical order so existing rows are stable.
with ranked as (
  select id, row_number() over (order by org) - 1 as rn
  from public.collaborations
)
update public.collaborations c
set sort_order = ranked.rn
from ranked
where ranked.id = c.id
  and c.sort_order = 0;

-- 2. Toolkit items table.
create table if not exists public.toolkit_items (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  icon_key   text not null default 'code',
  sort_order integer not null default 0
);

alter table public.toolkit_items enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'toolkit_items public read') then
    create policy "toolkit_items public read" on public.toolkit_items for select using (true);
  end if;
end$$;

-- Seed the toolkit with the icons from the Developer reference (only if empty).
insert into public.toolkit_items (name, icon_key, sort_order)
select * from (values
  ('TypeScript', 'code_blocks', 0),
  ('Next.js', 'api', 1),
  ('React', 'data_object', 2),
  ('GitHub', 'terminal', 3),
  ('PostgreSQL', 'database', 4),
  ('Docker', 'dns', 5)
) as v(name, icon_key, sort_order)
where not exists (select 1 from public.toolkit_items);
