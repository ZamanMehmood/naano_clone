# Build brief: rebuild naano.com (24h assessment)

## Context

Timed assessment, clock already running. I am rebuilding **https://naano.com** — a B2B
LinkedIn creator marketplace. Companies discover and book vetted LinkedIn creators for
sponsored posts at a fixed per-post price, then track the clicks, leads and pipeline
attributed to each post.

I am judged on exactly three things, in this order:

1. **Speed** — how much working product exists at the end.
2. **Product judgement** — what I chose to build first, and what I deliberately left out.
3. **UX and UI** — whether the thing is actually good to use.

Pixel-perfect fidelity is **not** a criterion. The brief says "better than the original if
you want." Optimise for a working product with good taste, not for tracing a landing page.

I have screenshots of the real product's authenticated flows in `docs/reference/`. **Read
them before planning.** They are the source of truth for what the product does.

---

## The single most important constraint

The deployed link must open fully for a reviewer who is not signed in as me.

So: **no auth wall.** A visitor lands directly in a seeded demo workspace with a dismissible
bar reading "Demo workspace — data is sample data." Build the sign-in and sign-up screens as
real, well-designed routes that exist and are reachable, but never gate anything behind them.

This is a deliberate product decision and it must be stated in the README.

---

## Priority order — build in this sequence, and never break it

If time runs short, cut from the bottom. Do not start something lower before something
higher is genuinely usable.

1. App shell + demo workspace + deployed
2. Creator marketplace (browse, filter, search, sort)
3. Creator profile + add to campaign
4. Campaign builder (brief creation)
5. Campaign management (collaboration statuses)
6. Attribution dashboard
7. Payouts view
8. Marketing landing page
9. Auth screens (non-functional, just well made)

Items 1–4 are the assignment. 5–6 are what make it look complete. 7–9 are nice to have.

---

## Rule zero: deploy first

Before writing any feature: scaffold the app, push to GitHub (public), connect to Vercel,
confirm the live URL loads. Then build. Redeploy continuously. I will not be caught at the
deadline with a working localhost and a dead link.

Also confirm the `.agent-logs/` capture is writing, and commit it incrementally as we go —
never in one lump at the end.

---

## Stack (fixed)

- Next.js latest stable, App Router, TypeScript strict, no `any`
- Tailwind, with tokens in CSS variables — no hex values scattered in components
- shadcn/ui for primitives (dialog, select, accordion, tabs, popover)
- Recharts for the dashboard
- nuqs for URL state
- Zustand or React context for the campaign draft
- Seed data in typed files under `src/data/`. No database.
- **No paid APIs, no API keys of any kind.** If a feature seems to need one, redesign it.

---

## Seed data

Write this first, before UI. Everything downstream depends on its shape.

**~60 creators**: name, slug, headline, niche tags (AI, SaaS, Sales, GTM, Marketing, Fintech,
HR, Ops), follower count (1K–500K), country, language(s), avg impressions, avg engagement
rate, avg clicks per post, price per post in EUR, audience-fit score, verified flag, 2–3
sample post excerpts with their metrics.

**~6 campaigns** across states: draft, live, completed. Each references creators, has a brief,
a budget, and per-post performance rows.

Avatars: deterministic SVG generated from the name seed (initials on a tinted background) in
a local component. No external avatar service, no hotlinked images from naano.com.

Make the numbers internally consistent — clicks should be plausible against impressions, leads
plausible against clicks. A reviewer who does the arithmetic and finds it coherent notices.

---

## 1. App shell

Sidebar navigation: Marketplace · Campaigns · Analytics · Payouts · Settings. Workspace
switcher at top, demo banner, user menu at bottom. Responsive — sidebar collapses to a
drawer under 1024px. Command palette (⌘K) for creator search if time allows.

---

## 2. Marketplace — the core surface

- **Filter rail**: niche multi-select, follower range, price range, country, language,
  verified-only, minimum fit score.
- **Search**: debounced, matches name / headline / tags.
- **Sort**: audience fit, price asc/desc, followers, avg impressions, est. cost per click.
- **URL as state.** Every filter, sort and page serialises to query params, so a filtered view
  is shareable and survives reload. Call this out in the README.
- **Creator cards**: avatar, name, headline, niche chips, followers, avg impressions, price per
  post, fit score, verified tick, quick-add button.
- Real **empty state** ("No creators match these filters" + one-click reset), **skeleton**
  loading state, and pagination or infinite scroll.
- Saved-list / shortlist toggle if time allows.

## 3. Creator profile — `/creators/[slug]`

Full profile: bio, audience breakdown (roles, seniority, geography), sample posts with real
metrics, price, availability, languages, estimated reach and estimated CPC for my campaign.
Primary action: `Add to campaign`.

## 4. Campaign builder

Multi-step, resumable, with a persistent draft:

1. **Objective** — awareness / leads / product launch, target audience, key messages.
2. **Creators** — the shortlist carried over from the marketplace, editable here, with live
   totals: creators selected, total spend, estimated impressions, estimated clicks,
   estimated cost per qualified click.
3. **Brief** — generate creator guidelines from the objective + audience.
   **There is no LLM available.** Build a deterministic template engine that composes a
   genuinely good brief from the structured inputs. Label the button honestly
   (`Generate brief`, not "AI"), and note the substitution in the README — a fake streaming
   "AI" animation over a hardcoded string is worse than an honest template.
4. **Tracking** — generate per-creator tracking links with UTM params, copyable.
5. **Review & launch** — summary, then launch moves the campaign to live.

The derived arithmetic across steps must be correct and clearly displayed. This is where
engineering judgment is most visible.

## 5. Campaign management — `/campaigns/[id]`

Per-creator collaboration rows with status pills: invited → accepted → draft submitted →
scheduled → live → paid. Draft post preview, feedback thread (client-side), scheduled date.
Board or table view — pick one and do it well.

## 6. Analytics

Attributed pipeline over time (line), performance by creator (bar), funnel from impressions →
clicks → leads, and a per-post table. Date-range filter. Summary cards: total spend,
attributed pipeline, cost per lead, ROI multiple.

Charts must have empty and loading states, and must be readable on mobile.

## 7. Payouts

Table of creator payouts: creator, campaign, amount, status (scheduled / processing / paid),
invoice link. Summary of total scheduled vs paid. Read-only is fine.

## 8. Landing page — timeboxed, 90 minutes maximum

Hero ("The B2B LinkedIn Creator Marketplace"), logo marquee, how-it-works five steps, results
counters (5M+ impressions, 30K+ leads, 2,000+ creators, 5K+ posts), pricing (Self-serve €0/mo,
Managed custom quote), FAQ accordion, final CTA. Nav and footer.

Author the cloud/gradient backdrops as CSS or inline SVG. Client logos as simple SVG wordmarks
you write. **Do not hotlink any asset from naano.com.**

Stop at 90 minutes even if unfinished. The product matters more.

---

## Quality floor

- Responsive from 320px. Test 320 / 375 / 768 / 1024 / 1440.
- Semantic HTML, one `h1` per page, proper landmarks.
- Visible keyboard focus. Nav, filters, modals, accordion, builder all keyboard operable.
  Modals trap focus and restore it.
- Every async surface has loading, empty, and error states. Empty states invite an action.
- `prefers-reduced-motion` respected everywhere.
- WCAG AA contrast.
- No layout shift — reserve dimensions for media.
- Clean `npm run build`, no console errors, no unused dependencies.

## Code organisation

```
src/
  app/                    routes
  components/ui/          primitives
  components/marketplace/
  components/campaigns/
  components/analytics/
  components/marketing/
  data/                   typed seed data
  lib/                    filter logic, estimators, formatters — pure functions
```

Filtering, estimation and aggregation live in `lib/` as pure functions with Vitest unit tests.
A handful of meaningful tests, not a coverage number.

---

## Deliverables

**README** covering: what I built and in what order; **what I deliberately left out and why**;
the no-auth-wall decision; the template-brief substitution; URL-as-state; what I'd do with
another two days. Be specific and honest — the omissions section is being read closely.

Also `docs/reference/` (screenshots of the real flows) and `docs/design-notes.md`.

Git history: a commit per meaningful unit, messages describing intent. `.agent-logs/`
committed incrementally throughout.

---

## Explicitly out of scope — state these in the README

Real auth, a database, payments, the creator-side experience (this is a two-sided marketplace
and I am building the company side only — a deliberate scoping decision), i18n beyond the
language switcher UI, blog and legal pages (stubbed so nothing 404s).

---

## How to work

- Phase by phase, in the priority order above. Stop and summarise after each.
- Ask before any decision that changes scope. Do not guess and proceed.
- Deploy after every phase.
- Finish one surface properly before starting the next.
- If time gets tight, tell me what you propose to cut. Cut from the bottom of the priority
  list, never from the top.
