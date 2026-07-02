# ExpatsBuddy Poland

**Polish bureaucracy, explained clearly and linked to official sources.**

A content-driven guided explainer for foreigners in Poland. It explains common
bureaucratic life situations — residence, job loss, sick leave,
hospitalization, insurance, official documents — in plain language, and links
every page to official Polish sources (gov.pl, ZUS, MOS, pacjent.gov.pl,
Public Employment Services, Financial Ombudsman).

ExpatsBuddy is **not** a legal, medical, immigration, tax, insurance, or
benefits advisor. It does not interpret personal documents, extract deadlines,
draft responses, calculate entitlements, or submit forms.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Content as MDX (explainer paths) and JSON (categories, glossary, sources, institutions) in `/content`
- Client-side search with MiniSearch
- Supabase Postgres for anonymous feedback
- Vercel hosting + Vercel Analytics

## Development

```bash
npm install
npm run dev            # local dev server
npm run validate-content   # PRD publication checklist + prohibited-phrase scan
npm run check-links    # verify all official-source URLs respond
npm run build          # validation + production build
```

## Content model

- `content/paths/*.mdx` — explainer pages: frontmatter (institutions, terms,
  documents, source IDs, risk level, review date, status) + a plain-language
  MDX body. Every path needs **at least 3 official sources** and a
  "what this page does not do" section — enforced by `validate-content`,
  which fails the build otherwise.
- `content/sources/sources.json` — the official-source database. Only approved
  official domains are allowed; each source records `lastCheckedAt`.
- `content/glossary/*.json` — plain-language definitions of Polish
  bureaucracy terms, linked to paths and sources.
- `content/categories/*.json` — the five life-situation categories with
  explicit scope ("helps with" / "does not help with").

All launch content is `status: draft` pending human review.

## Feedback storage (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/001_feedback.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` (server-side only; never exposed to the client).

Without these variables the feedback widget still works but does not store
submissions (the API acknowledges and logs instead).

## Deploying

Import the repo in [Vercel](https://vercel.com/new), add the environment
variables from `.env.example`, and deploy. All content pages are statically
generated; only `/api/feedback` runs server-side.
