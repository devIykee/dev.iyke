-- 007_collaboration_category.sql
-- Collaborations now carry a category (Client, Security Research, Hackathon,
-- Open Source, Community, Partner) so the section reads as grouped work rather
-- than an undifferentiated list.
--
-- Idempotent: safe to re-run.

alter table public.collaborations
  add column if not exists category text;
