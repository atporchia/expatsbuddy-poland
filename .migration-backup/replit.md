# ExpatsBuddy Poland — rules for AI agents working on this repo

This is a **production site with live users** deployed on **Vercel** (not
Replit Deployments). The current task scope for agents is **visual redesign
only**. Read these rules before writing any code. If a requested change would
violate them, stop and ask instead of proceeding.

## Hard constraints — never do these

1. **Do not change the stack.** This is Next.js 16 (App Router) + TypeScript +
   Tailwind CSS v4 + MDX/JSON content files. Do NOT migrate to Vite, Remix,
   plain React SPA, Pages Router, styled-components, CSS modules, Bootstrap,
   Chakra, MUI, shadcn scaffolding, or anything else. Styling is Tailwind
   utility classes only.
2. **Do not rewrite files wholesale.** Make targeted edits to existing
   components. Never regenerate a file from scratch when editing works.
3. **Do not touch these directories/files at all:**
   - `/content/**` — the editorial content (legally sensitive; human-reviewed)
   - `/lib/**` — content loaders, types, triage rules, freshness logic
   - `/scripts/**` — build-time validation (the build fails without it)
   - `/app/api/**` — feedback + search endpoints (wired to Supabase/Resend)
   - `supabase/**`, `.env*`, `next.config.ts`, `.github/**`
4. **Do not change URLs/routes.** The route structure
   (`/[locale]`, `/categories/[slug]`, `/paths/[slug]`, `/glossary/[slug]`,
   `/start`) is load-bearing for SEO and the sitemap. No renames, no new
   routes, no locale changes.
5. **Do not add dependencies** without explicit approval in chat. No UI kits,
   no icon packs, no animation libraries. Inline SVG is fine.
6. **Do not add features.** No document upload, no AI chat/answers, no auth,
   no payments, no cookies/trackers. This product is deliberately
   informational-only for legal-risk reasons.
7. **Do not remove or reword compliance UI.** These must remain on every page
   where they currently appear, with their text unchanged:
   - the disclaimer boxes (`DisclaimerBox`)
   - the "What this page does not do" section
   - official source cards: the "Official source" label, institution,
     language, source type, "last checked" date, and `target="_blank"`
   - the feedback widget and its privacy warning
   - the "Last reviewed" date on explainer pages
8. **Do not configure Replit hosting/databases.** No Replit Postgres, no
   Replit Auth, no Replit object storage, no changes to deployment settings.
   Adding a `.replit` run config for the dev server is acceptable.

## What you MAY change (the actual task)

- Tailwind classes, layout, spacing, typography, and colors in
  `/components/**` and in the page/layout files under `/app/[locale]/**`
- `app/globals.css` design tokens
- Visual structure of cards, header, footer, hero, and navigation — as long
  as all existing content and compliance elements stay present and the
  existing props/data flow are unchanged

## Requirements for any change

- Keep accessibility: semantic HTML, visible focus states, WCAG AA contrast,
  keyboard navigability, mobile-first responsive layout.
- `npm run build` must pass — it runs content validation and fails the build
  on violations. Never edit or skip the validation to make a build pass.
- `npm run lint` must pass.
- Work in a branch (e.g. `redesign/ui`), commit in small steps, and never
  push to `main` — the owner reviews and merges. Production deploys from
  `main` via Vercel automatically.

## Definition of done for the redesign

Same pages, same words, same links, same data — better looking. If a diff
touches anything under `/content`, `/lib`, `/scripts`, `/app/api`, or
`package.json` dependencies, the task was done wrong.
