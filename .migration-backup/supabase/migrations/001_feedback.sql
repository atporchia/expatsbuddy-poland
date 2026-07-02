-- Feedback table for ExpatsBuddy Poland (PRD §9.6 / §13.3).
-- Anonymous feedback; no user accounts, no personal data collected.
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  page_type text not null check (page_type in ('category', 'path', 'glossary')),
  page_slug text not null,
  feedback_type text not null check (
    feedback_type in (
      'helpful',
      'confusing',
      'missing_information',
      'broken_link',
      'wrong_or_outdated',
      'other'
    )
  ),
  comment text,
  created_at timestamptz not null default now()
);

-- Only the service role (used by the API route) may write; no public access.
alter table public.feedback enable row level security;

-- Dashboard helper: pages with the most issues (everything except "helpful").
create or replace view public.feedback_issues_by_page as
select
  page_type,
  page_slug,
  count(*) filter (where feedback_type <> 'helpful') as issue_count,
  count(*) filter (where feedback_type = 'broken_link') as broken_link_count,
  count(*) as total_feedback
from public.feedback
group by page_type, page_slug
order by broken_link_count desc, issue_count desc;
