-- ===========================================================================
-- Migration 002 — Blog draft/published status
-- Run once in the Supabase SQL Editor. Idempotent.
-- Adds a status column to writer_posts so posts can be saved as drafts and only
-- 'published' posts render on the public /writer routes.
-- ===========================================================================

alter table public.writer_posts
  add column if not exists status text not null default 'published';

-- Optional: constrain to the two known values.
do $$
begin
  if not exists (
    select 1 from information_schema.constraint_column_usage
    where table_name = 'writer_posts' and constraint_name = 'writer_posts_status_check'
  ) then
    alter table public.writer_posts
      add constraint writer_posts_status_check check (status in ('draft', 'published'));
  end if;
end$$;
