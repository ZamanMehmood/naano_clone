# Phase 6 & 7 — Payouts and Analytics

Date: 2026-09-09

## What was done

**Payouts (`/payouts`, priority item 7)** — `lib/payouts.ts`: `derivePayouts`
computes payout rows *from* campaign/collaboration data rather than storing a
separate payouts seed file, so there's one source of truth. A payout only
exists once a creator's post is at least `scheduled` (nothing owed for
invited/accepted/drafting) — `scheduled → scheduled`, `live → processing`,
`paid → paid`. Summary cards (paid / processing / scheduled / total
outstanding) + a table; "invoice" is an honest stub button (toasts "Invoices
aren't wired up in this demo") rather than a dead link. 6 new Vitest cases.

**Analytics (`/analytics`, priority item 6)** — loaded the `dataviz` skill
before writing any chart code, per its own instruction. Followed its
procedure: form before color (line for pipeline-over-time = trend; single-hue
bar for performance-by-creator = magnitude comparison, not identity, so no
categorical rainbow; funnel as one hue with decreasing opacity per stage,
directly labeled since n=3 makes hover-only unacceptable), then swapped the
app's `--chart-1..5` tokens for the skill's pre-validated categorical palette
hex values (light+dark) instead of the arbitrary OKLCH guesses from Phase 0 —
"the color part is computable" applies to picking a palette, not just
checking one. `lib/analytics.ts` (10 new Vitest cases): `flattenPerformance`,
`filterByDateRange` (30d/90d/all), `pipelineOverTime` (weekly buckets),
`performanceByCreator` (top 8 by leads), `funnelTotals`, `summarize` (spend/
pipeline/cost-per-lead/ROI). A shared `ChartTooltip` follows the skill's
interaction rules: value leads (bold), series name follows (muted), a line-key
swatch instead of a filled box.

**A real, documented assumption**: there's no CRM, so "attributed pipeline"
needs a €/lead value that doesn't exist in the seed data. Chose €350/lead
specifically because the first number I tried (€2,400 — a plausible-looking
mid-market ACV figure) produced a 55× ROI multiple once multiplied through the
real lead counts — technically correct arithmetic, but exactly the kind of
number that reads as a bug to a reviewer doing the math the brief says they
will do. €350/lead keeps it in a believable "strong channel" 5–10× range.
Documented in-app (every pipeline figure shows "at €350/lead (assumed)") and
will be called out in the README.

## Bugs/gaps fixed while verifying

- Stat tiles (spend/pipeline/CPL/ROI) were rendering immediately while the
  chart cards below them still showed loading skeletons — inconsistent since
  they're the same synchronous data. Added matching skeletons to the stat row
  during the simulated 350ms load so the whole page's async state is coherent,
  not just the parts with visible charts.
- Verified with Playwright: 30-day / 90-day / all-time range switching
  actually changes every number consistently (spend, pipeline, ROI, funnel,
  table all re-derive from the same filtered row set — never disagree);
  hovering the pipeline line shows the tooltip with correct value/date; zero
  console errors and zero horizontal overflow at 375px on a full-page
  screenshot of the whole dashboard.

## Next

The campaign *builder* (`/campaigns/new`) is the one remaining stub from the
core priority list (item 4) — objective → creators → brief template →
tracking → review/launch, multi-step and resumable. After that: landing page
(8) and auth screens (9), both explicitly lower priority / timeboxed in the
brief.
