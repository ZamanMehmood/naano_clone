# Phase 1 (continued) — App shell

Date: 2026-09-08

## What was done

Built the persistent app shell all authenticated-style pages live inside
(`src/app/(app)/layout.tsx`), matching priority item 1 in the brief:

- **Sidebar** (`components/shell/sidebar.tsx`, desktop ≥1024px) — logo, workspace
  switcher, search trigger, nav links (Marketplace/Campaigns/Analytics/Payouts/
  Settings, active-state via `usePathname`), user menu pinned to the bottom.
- **Mobile topbar + drawer** (`mobile-topbar.tsx`, <1024px) — hamburger opens a
  `Sheet` containing the same nav content, so there's exactly one nav
  implementation (`nav-links.tsx`) shared between desktop and mobile rather than
  two copies to keep in sync.
- **Demo banner** — dismissible, "Demo workspace — data is sample data." Persists
  dismissal via `localStorage`, implemented with `useSyncExternalStore` (not
  `useEffect` + `setState`, which the project's ESLint rule
  `react-hooks/set-state-in-effect` flags as a cascading-render anti-pattern for
  exactly this "hydrate from an external store" case).
- **Workspace switcher** — dropdown with two demo workspaces; switching is
  real (updates displayed name/avatar) but doesn't affect any data, which is
  honest for a single-workspace demo dataset.
- **User menu** — static demo user, links to Settings, the marketing site, and
  Sign out (→ `/sign-in`).
- **⌘K command palette** — searches creators by name/headline and jumps to their
  profile, plus jumps to any nav page. Open state lives in a small Zustand store
  (`store/command-palette-store.ts`) shared between the sidebar's search button,
  the mobile topbar's, and the global keyboard listener, rather than three
  separate pieces of local state.
- **Routing structure**: `(app)` route group for the product surfaces, `(auth)`
  for `/sign-in` and `/sign-up`, `(marketing)` for `/marketing`. Root `/` redirects
  straight to `/marketplace` — per the brief's "no auth wall, land directly in the
  demo workspace" constraint, the product itself is what's at the root of the
  deployed link, not a marketing page. Stub pages exist for every route the nav
  points at (`/campaigns`, `/campaigns/[id]`, `/campaigns/new`, `/analytics`,
  `/payouts`, `/creators/[slug]`) so nothing 404s while those are built out in the
  next phases, and for `/marketing`, `/sign-in`, `/sign-up` ahead of their own
  phases later in the priority order.
- Brand tokens (indigo, from Phase 0) now actually used — nav active state,
  banner, logo mark.
- `prefers-reduced-motion` handled globally in `globals.css`.
- `next.config.ts`: `devIndicators: false` (see bug note below — dev-only, doesn't
  affect the deployed build).

## Bugs found and fixed while verifying (see "Verified" for how)

1. **`--font-sans: var(--font-sans)` was circular.** shadcn's `init` wrote a
   self-referential CSS variable instead of pointing at the actual Geist font
   variable (`--font-geist-sans`) `create-next-app` set up on `<html>`. Net effect:
   every element silently fell back to the browser's serif default — visible
   immediately in a screenshot, invisible in `npm run build` (it's a runtime
   rendering issue, not a type or lint error). Fixed by pointing `--font-sans`
   (and `--font-heading`) at `var(--font-geist-sans)`.
2. **`asChild` doesn't exist in this shadcn preset.** This project's shadcn
   `base-nova` preset is Base UI–backed (not Radix), which uses a `render` prop
   instead of Radix's `asChild` convention. `npm run build`'s type-check caught
   every instance (`user-menu.tsx`, `workspace-switcher.tsx`) — rewrote them to
   `<Trigger render={<button />}>{children}</Trigger>`, matching the pattern
   already used correctly in the generated `sheet.tsx`.
3. **Command palette crashed on open**: `CommandDialog` (from this project's
   `command.tsx`) doesn't wrap its children in the `<Command>` root the way
   older shadcn versions did — it's just `Dialog` + `DialogContent`. `CommandInput`
   needs `<Command>`'s cmdk store context, so using `CommandInput`/`CommandList`
   directly inside `CommandDialog` threw `Cannot read properties of undefined
   (reading 'subscribe')` at runtime. Fixed by wrapping the palette's contents in
   an explicit `<Command>`.
4. **A real "the avatar renders as a solid dark circle" scare that turned out not
   to be a bug**: the very first shell screenshot showed the sidebar's user-menu
   avatar as a near-black circle with a glyph that looked like an "N", while an
   identical `AvatarInitials` instance two inches above (the workspace switcher)
   rendered correctly. Spent real time on this — checked computed styles, painted
   pixels, DOM structure, even swapped `oklch()` for `hsl()` background colors —
   before running `document.elementsFromPoint()` at that exact coordinate and
   finding a `NEXTJS-PORTAL` element sitting on top of it. It's Next.js 16's dev
   mode indicator (the small "N" badge `next dev` renders bottom-left), which
   only exists in `next dev` and never appears in `next build`/`next start` or the
   deployed site — it was purely a local-dev screenshot artifact, not a product
   bug. Set `devIndicators: false` in `next.config.ts` so it doesn't confuse
   screenshot-based verification for the rest of this build.

## Verified

No project skill existed yet for running this app, so used the generic
browser-driven pattern: started `next dev`, drove it with a small Playwright
script (no `chromium-cli` available in this environment) rather than eyeballing
`localhost` blind. Checked:

- Full-page screenshots at 1440/1024/768/375/320px — no horizontal overflow, no
  console errors at any width.
- Mobile drawer opens via the hamburger, shows the same nav, closes on
  navigation.
- ⌘K / Ctrl+K opens the command palette from anywhere; typing "fintech" filters
  creators by headline text and shows their (correctly light/dark, not black)
  avatars; selecting one would navigate to their profile stub.
- Demo banner dismiss persists across a full page reload (`localStorage`).
- `npm run lint`, `npm run build`, `npm test` all clean.

## Next

Phase 2 (priority item 2, the core surface): the marketplace — filter rail,
debounced search, sort, URL-as-state via `nuqs`, creator cards, empty/skeleton
states, pagination.
