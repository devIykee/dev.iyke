-- 005_featured_projects.sql
-- The homepage shows a small, curated Featured Projects row instead of every
-- project, so recruiters see the strongest work first. `featured` marks which
-- engineering projects appear there.
--
-- Security research is separated by tag, not by this flag: anything tagged
-- 'security-research' is excluded from the engineering portfolio entirely and
-- lives on /security-research.
--
-- Idempotent: safe to re-run.

alter table public.dev_projects
  add column if not exists featured boolean not null default false;

-- Seed the current feature set. Security work is never featured here.
update public.dev_projects
set featured = (title ilike 'skimflow%' or title ilike 'covenant%')
where not (tags @> array['security-research']);
