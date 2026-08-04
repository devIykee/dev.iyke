-- 004_content_tags.sql
-- Makes tag showcases self-populating.
--
-- Until now /tags/<slug> could only show items that were manually listed in
-- tag_showcases.project_ids. That array shipped empty, so every showcase page
-- (including Security Research) rendered the "no projects linked yet" state.
--
-- Content rows now carry their own `tags` array, so a project appears under a
-- showcase simply by being tagged with that slug — no curation step required.
-- project_ids is kept and still works: it pins items to the top in a chosen
-- order, and auto-discovered items follow.
--
-- Also adds tag_showcases.resume_url so a showcase can surface a role-specific
-- résumé (used by Security Research) without hardcoding the slug in the UI.
--
-- Idempotent: safe to re-run.

alter table public.dev_projects
  add column if not exists tags text[] not null default '{}';

alter table public.motion_projects
  add column if not exists tags text[] not null default '{}';

alter table public.writer_posts
  add column if not exists tags text[] not null default '{}';

alter table public.tag_showcases
  add column if not exists resume_url text;

-- GIN indexes so the `tags @> {slug}` containment lookups stay cheap.
create index if not exists dev_projects_tags_idx    on public.dev_projects    using gin (tags);
create index if not exists motion_projects_tags_idx on public.motion_projects using gin (tags);
create index if not exists writer_posts_tags_idx    on public.writer_posts    using gin (tags);
