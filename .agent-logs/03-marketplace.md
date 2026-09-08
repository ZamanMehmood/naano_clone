# Phase 2 — Creator marketplace

Date: 2026-09-08

## Why now, out of the planned phase-by-phase order

The brief's own "how to work" section says to stop and summarize after each phase
and wait before continuing. After Phase 1 (shell) I did that. The user's next
message was "there is no data add some data so that it shows then i will deploy"
— they want to see the marketplace actually rendering before connecting Vercel.
Marketplace (browse/filter/search/sort) is priority item 2, the very next thing
in the brief's own priority order, so building it now isn't a scope change — it's
what "add some data so it shows" concretely means given the priority list.

## What was done

- `lib/estimators.ts` — `costPerClick`, `summarizeCreatorSelection` (spend/
  impressions/clicks/qualified-clicks totals), used here for the "est. cost per
  click" sort and reused by the campaign builder later.
- `lib/filters.ts` — pure `filterCreators` / `sortCreators` / `isDefaultFilters`
  over the 60 seeded creators. 12 Vitest cases cover each filter dimension
  individually and combined (AND semantics), all 6 sort keys, and that sorting
  doesn't mutate its input. 28 tests total now pass (`npm test`).
- `components/marketplace/`: `filter-rail.tsx` (niche multi-select, country/
  language single-select, follower/price range sliders, min fit-score slider,
  verified-only), `marketplace-toolbar.tsx` (debounced search, sort select,
  live result count), `creator-card.tsx`, `creator-grid-skeleton.tsx`,
  `empty-state.tsx` (with one-click reset), `pagination.tsx`, and
  `marketplace-view.tsx` tying it together — desktop rail + a mobile filter
  `Sheet` sharing the exact same `FilterRail`, so there's one filter
  implementation, not two.
- **URL as state**: `use-marketplace-filters.ts` wraps `nuqs`'s `useQueryStates`
  — every filter, the sort key, and the page number serialize to query params
  (`?niches=AI&verified=true&sort=fit&page=2`), `history: "replace"` so typing in
  search doesn't spam browser history. Verified a filtered view survives a full
  page reload.
- **Shortlist**: `store/shortlist-store.ts`, a Zustand store persisted to
  `localStorage`. The card's "Add" button pushes into it and shows an "Added"
  state + a toast; this is the same store the campaign builder's creator step
  will read from later, so a shortlist built in the marketplace carries over.

## Bugs found and fixed while verifying

1. **`useSearchParams() should be wrapped in a Suspense boundary`** — `nuqs`
   reads the URL via that hook; `next build`'s static-export pass failed until
   `/marketplace/page.tsx` wrapped `<MarketplaceView />` in `<Suspense>`. Caught
   by `npm run build`, not a screenshot.
2. **`react-hooks/set-state-in-effect` again**, same class of bug as the demo
   banner: the search box synced its local input state from the URL query via
   `useEffect(() => setInputValue(query), [query])`. Fixed using React's
   documented "adjust state during render" pattern (compare against a
   `syncedQuery` state var and call `setState` directly in the render body when
   it's stale) instead of an effect — the debounce timer effect right below it is
   fine as-is since it's a real subscription (a timer callback), which is exactly
   what the rule allows.
3. **Base UI's `Select` doesn't auto-derive the trigger's display text from the
   matching `SelectItem`'s children the way Radix does** — it shows the raw
   `value` unless you pass `<SelectValue>` a render-prop. This shipped a real,
   visible bug: the country/language filters showed the literal string
   `__any__` and the sort dropdown showed `fit` instead of "Audience fit" — only
   caught by actually looking at a screenshot, not by build or lint. Fixed all
   three by giving `<SelectValue>` a `{(value) => label}` child.
4. **Horizontal overflow at 320px** (59px) in the mobile toolbar row (Filters
   button + search input + result count + sort select). Root cause: flex
   children default to `min-width: auto`, so a child's intrinsic content width
   (the search input, the fixed-width sort trigger) forced the row wider than
   the viewport instead of shrinking. Fixed with `min-w-0` on the flex children
   that needed to shrink, `flex-wrap` on the result-count/sort row, and a
   narrower sort trigger below `sm:`. Confirmed
   `document.documentElement.scrollWidth - clientWidth === 0` at both 320px and
   375px after the fix — this class of bug doesn't show up in a screenshot at a
   glance, only by actually measuring.

## Verified

Playwright against the dev server again: niche + verified-only filter combo
correctly narrows 60 → 3 creators and survives reload via the URL; search for
"fintech" narrows to 6; empty-filter state shows the reset CTA; quick-add shows
the "Added" state + toast; mobile filter sheet opens with the same filter rail
(fixed a duplicate "Filters" heading in the sheet along the way); loading
skeleton renders before data; pagination renders 5 pages for 60 creators at 12/
page; zero horizontal overflow and zero console errors at 320/375/1440px.

## Next

Phase 3: creator profile (`/creators/[slug]`) with the "Add to campaign" action,
then Phase 4: the campaign builder.
