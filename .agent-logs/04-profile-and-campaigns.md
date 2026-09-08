# Phase 3 & partial Phase 5 — Creator profile + campaigns showing real data

Date: 2026-09-09

## Why

User: "also in other pages like campaigns etc... add the dummy data for now when
i move it show their etc." — wanted every page reachable from nav to show the
real seeded data (not "Coming next" placeholders), and specifically wanted
interactive state changes (moving a collaboration status) to reflect
immediately. This lines up with priority items 3 (creator profile) and 5
(campaign management) — building them now, out of strict numeric order, is
still "the priority list" in spirit: it's what makes the app look and feel real
right now, which is what was asked for.

## What was done

**Creator profile (`/creators/[slug]`)** — `creator-profile-view.tsx`:
bio, audience breakdown (role/seniority/geography as bar lists), sample posts
with real metrics, sticky price/stats sidebar (est. reach, est. clicks, cost
per click via `lib/estimators`, engagement, fit score), "Add to campaign"
primary action wired to the same shortlist store the marketplace uses — adding
from either place is the same shortlist.

**Campaigns list (`/campaigns`)** — `campaign-list-view.tsx`: status tabs
(All/Draft/Live/Completed), a card per seeded campaign with objective, target
audience, creator count, committed spend vs. budget, "New campaign" CTA.

**Campaign management (`/campaigns/[id]`)** — chose **table**, not a
drag-drop board, over the brief's "pick one and do it well": a Kanban board
needs real DnD (not in the fixed stack) to be accessible and worth the time
budget; a table with a status *dropdown* is keyboard-operable by construction
and still satisfies "move a creator along the pipeline, see it reflected."
Summary cards (status/budget/committed spend/creator count), a Brief card
(objective/audience/key messages), a collaboration table, and a detail
`Sheet` per row with: status changer, tracking-link copy, draft preview,
and a feedback thread you can add to (client-side state, per the brief's "no
backend" scope). Changing a status updates the table row immediately and
fires a toast ("X moved to 'Live'") — verified this actually happens, not just
that the click handler exists.

**Shared**: `lib/campaign-status.ts` (status labels/tones/ordering,
`nextCollaborationStatus` for a possible future "advance" shortcut) with 4 new
Vitest cases (31 total now).

## Bugs found and fixed while verifying

1. **Base UI `Button` + `render={<Link/>}` logs a console warning**
   ("expected a native `<button>`... `nativeButton` prop is true") because an
   `<a>` isn't a native button. Fixed with `nativeButton={false}` on that one
   button (the "New campaign" CTA). Caught via a Playwright console-error
   check, not the build.
2. **Audience breakdown bars were invisible** — not a color/z-index issue, a
   layout one: the bar list used a 3-column grid (`sm:grid-cols-3`) inside the
   profile's already-narrow main column, so each column was only ~190px wide.
   A 128px fixed label + 40px percentage left the `flex-1` bar track with
   *zero* px of actual space — confirmed via `getBoundingClientRect()`
   (`width: 0`) after `getComputedStyle` looked completely correct, which is
   what made this one non-obvious: every color and class was right, the box
   was just 0px wide. Fixed by stacking the three breakdown groups full-width
   instead of side-by-side, narrowing the label/number columns, and adding
   `min-w-8` to the track so it can never re-collapse to zero even if reused
   somewhere tighter later.

## Verified

Playwright again: campaigns list renders all 6 seeded campaigns with correct
spend/budget math; opening a campaign shows its real brief + collaboration
rows; opening a row's sheet shows its actual draft preview and feedback
thread; changing status in the sheet updates the pill in the table underneath
and fires the toast; creator profile renders full bio/audience bars/sample
posts with real numbers, "Add to campaign" shows the "Added" state + a toast
with a working "View campaigns" action; zero console errors and zero
horizontal overflow at 375px on the profile page. `npm run lint` / `build` /
`test` all clean (31/31 tests).

## Next

The campaign *builder* (`/campaigns/new`, priority item 4 — objective →
creators → brief template → tracking → review/launch) is still a stub. That's
next, then Analytics and Payouts (currently still placeholder pages).
