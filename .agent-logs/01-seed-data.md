# Phase 1 — Seed data

Date: 2026-09-08

## What was done

Built the typed seed data everything downstream depends on, under `src/data/`:

- `types.ts` — domain types: `Creator`, `Campaign`, `CampaignCreator` (per-creator
  collaboration status/feedback/tracking), `PostPerformance`, `Payout`, plus the
  shared enums (`Niche`, `CollaborationStatus`, `CampaignObjective`, ...).
- `rng.ts` — a seeded mulberry32 PRNG (`createRng(hashSeed(...))`). Everything below
  is generated deterministically from string seeds like `"naano-creator-12"`, so the
  data is stable across builds/server/client renders instead of using raw
  `Math.random()`.
- `name-bank.ts` / `campaign-bank.ts` — curated word banks (names, countries,
  niche-specific headline/bio/post-hook templates, campaign briefs, feedback lines)
  that the generators sample from, so output reads like real people/campaigns
  instead of `Creator #14`.
- `creators.ts` — generates 60 creators. Deliberately generated rather than
  hand-typed: with this many interlocking numbers (followers → impressions →
  engagement rate → CTR → clicks → price → fit score), a formula-driven generator
  *guarantees* the internal consistency the brief asks for, where hand-typing 60 of
  these invites arithmetic that doesn't hold up. Followers are tiered
  (micro/mid/large/mega, weighted) rather than uniform 1K–500K, because a flat
  distribution doesn't look like a real marketplace.
- `campaigns.ts` — generates 6 campaigns (2 draft, 2 live, 2 completed) from
  `campaign-bank.ts` seeds, picking creators from matching niches, assigning
  collaboration statuses appropriate to the campaign's status (draft campaigns only
  have invited/accepted rows; performance rows only exist for creators who are
  actually `live` or `paid`), and generating UTM tracking links per creator.

## Verified

- Wrote `src/data/__tests__/seed-data.test.ts` (Vitest) asserting: 60 unique
  creators, followers/price/fit-score within documented ranges, clicks never exceed
  impressions (creator-level and per-sample-post), audience breakdown percentages
  sum to exactly 100, all 6 campaigns reference real creator ids, campaign leads
  never exceed clicks and clicks never exceed impressions, and performance rows
  only exist for creators whose collaboration status is `live`/`paid`. All 8 tests
  pass (`npm test`).
- Also spot-checked manually before writing the tests: followers span
  ~1,025–493,953, price spans €125–€5,245, all plausible against each other.
- `npm run build` still clean.

## Also added

- `src/components/common/avatar-initials.tsx` — the deterministic avatar component
  the brief asks for: initials on a tinted background, hue derived from a hash of
  the creator's name (via `oklch()`, not a hardcoded hex/named palette), no external
  avatar service or hotlinked image.
- Vitest wired up (`vitest.config.ts`, `npm test`) — needed `vite` as an explicit
  devDependency (vitest doesn't pull it in transitively in the current package
  graph) and `--legacy-peer-deps` on that one install to work around a peer
  resolution quirk between `@types/node` versions; not a real incompatibility.

## Next

Phase 1 continued: app shell (sidebar nav, workspace switcher, demo banner, user
menu, responsive drawer, command palette).
