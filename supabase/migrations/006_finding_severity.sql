-- 006_finding_severity.sql
-- Severity used to live in the project title, e.g. "... (High)". The security
-- page groups findings under severity headings, so the suffix was repeated on
-- every card. Move it to its own column and keep titles readable.
--
-- Idempotent: safe to re-run.

alter table public.dev_projects
  add column if not exists severity text;

-- Backfill from the old title convention for any row that predates the column.
update public.dev_projects
set severity = case
  when title ilike '%(high)%'                          then 'High'
  when title ilike '%medium%'                          then 'Medium'
  when title ilike '%trust%' or title ilike '%central%' then 'Trust'
  else 'Tooling'
end
where severity is null
  and tags @> array['security-research'];
