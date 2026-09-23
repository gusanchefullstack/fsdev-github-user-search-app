# Research: GitHub User Search

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-09-23

The Technical Context had no open `NEEDS CLARIFICATION` items: the stack is fixed by the
constitution and `my-sdd-docs/specs.md`. This document records the decisions made for each
dependency, integration, and design question.

## R1. Toolchain and versions

- **Decision**: Vite 8 (`react-ts` template), React 19, TypeScript (current major), Vitest 5,
  Node 26 / npm 12 (the versions installed locally on 2026-09-23).
- **Rationale**: Vite and Vitest are mandated by `specs.md`; React + TypeScript by the constitution.
  The Vite template's defaults (tsconfig, ESLint) are kept as-is to avoid custom tooling.
- **Alternatives considered**: Create React App (deprecated), Next.js (server features not needed;
  violates "plain structure").
- **Note**: the repo root already has files (`index.html`, `assets/`, docs), so scaffolding is
  done in a temporary folder and the generated files are merged in, keeping the existing
  `index.html` at the root as Vite's entry.

## R2. Testing stack

- **Decision**: Vitest + jsdom + `@testing-library/react` + `@testing-library/user-event` +
  `@testing-library/jest-dom`. The network is mocked by stubbing `fetch` with `vi.fn()`.
- **Rationale**: Testing Library tests behavior the way users see it (roles, accessible names),
  which also covers the accessibility requirements (FR-017, FR-018). Stubbing `fetch` is enough
  for one endpoint; no extra mocking library is needed.
- **Alternatives considered**: MSW (more setup than one endpoint justifies), Playwright/E2E
  (viewport checks are done manually per `specs.md`).

## R3. GitHub API integration

- **Decision**: One `GET https://api.github.com/users/{username}` call per search using native
  `fetch`, header `Accept: application/vnd.github+json`, username URL-encoded. The result is
  converted into a discriminated union (`ok` / `not-found` / `rate-limited` / `error`) so the UI
  never sees an exception. See [contracts/github-users-api.md](./contracts/github-users-api.md).
- **Rationale**: Unauthenticated access is the only option for a static frontend (a token in the
  browser would be exposed). The union type enforces FR-012 (no raw errors) at compile time.
- **Status mapping**: `200` → ok; `404` → not-found; `403` with `x-ratelimit-remaining: 0`, or
  `429` → rate-limited; any other status, network failure, abort-unrelated exception, or an
  unparseable body → error.
- **Alternatives considered**: axios (unneeded dependency), GitHub search API
  `/search/users` (returns partial users, not the profile needed).

## R4. Out-of-order results (FR-019)

- **Decision**: Each new search aborts the previous in-flight request with an `AbortController`;
  aborted requests are ignored, not treated as errors.
- **Rationale**: Built into `fetch`, no extra state; guarantees the last search wins.
- **Alternatives considered**: request-id counter (works but leaves stale requests running).

## R5. Mapping raw data to what the card shows

- **Decision**: A pure function `toUserProfile(raw)` produces a display-ready `UserProfile`
  (see [data-model.md](./data-model.md)). All placeholder rules live there:
  - name: `name` trimmed, else `login`;
  - bio: trimmed, else `null` → "This profile has no bio";
  - location / blog / twitter / company: trimmed, empty string → `null` → "Not Available";
  - blog URL: prefixed with `https://` when it has no `http(s)://` scheme;
  - twitter URL: `https://x.com/{handle}` (leading `@` removed);
  - company URL: leading `@` removed → `https://github.com/{company}`;
  - joined date: built from `getUTCDate()`, `getUTCMonth()`, `getUTCFullYear()` of `created_at`
    plus a fixed `['Jan', …, 'Dec']` array → "Joined 25 Jan 2011".
- **Rationale**: Pure functions are trivial to unit test for every edge case in the spec, and
  components stay presentational. UTC parts avoid off-by-one days across time zones.
- **Alternatives considered**: `Intl.DateTimeFormat('en-GB', { month: 'short', … })`, rejected
  because it renders September as "Sept", which doesn't match the design's 3-letter months.

## R6. Theming (FR-013, FR-014)

- **Decision**: All colors are CSS custom properties in `src/styles/variables.css`. Light values on
  `:root`, dark values under `:root[data-theme="dark"]`. `App` holds `theme` state, initialized
  from `window.matchMedia('(prefers-color-scheme: dark)')`, and writes it to
  `document.documentElement.dataset.theme`. Not persisted (spec Assumptions).
- **Rationale**: One attribute switch recolors the whole page instantly (SC-006) and keeps colors
  parameterized in one file (constitution II).
- **Alternatives considered**: separate theme stylesheets; CSS-in-JS (violates CSS Modules rule).

## R7. Icons

- **Decision**: Move the starter `assets/` icons to `src/assets/` and render them via CSS
  `mask-image` with `background-color: currentColor`, so each icon follows text color (theme,
  hover, "Not Available" dimming). `favicon-32x32.png` moves to `public/`.
- **Rationale**: Uses the provided, already-optimized SVGs unchanged (constitution I), with no
  SVG loader plugin. Icons are decorative (`aria-hidden`), so text carries the meaning.
- **Alternatives considered**: `vite-plugin-svgr` (extra dependency), copying SVG markup into TSX
  (duplicates assets), `<img>` tags (cannot recolor on theme/hover).

## R8. Fonts

- **Decision**: Space Mono 400 and 700 from Google Fonts, linked with `preconnect` in `index.html`;
  the family name is a variable in `variables.css`.
- **Rationale**: The only typeface in the design system; two weights keep the payload small.
- **Alternatives considered**: `@fontsource/space-mono` (fine, but an extra dependency for a
  static link).

## R9. Design tokens (from Figma Design System, node `1:69`)

Pulled with the Figma Desktop MCP (`get_variable_defs`) on 2026-09-23:

| Token | Value |
|-------|-------|
| `colors/neutral/0` | `#ffffff` |
| `colors/neutral/100` | `#f2f2f7` |
| `colors/neutral/200` | `#90a4d4` |
| `colors/neutral/300` | `#697c9a` |
| `colors/neutral/500` | `#4b6a9b` |
| `colors/neutral/700` | `#2b3442` |
| `colors/neutral/800` | `#1e2a47` |
| `colors/neutral/900` | `#141d2f` |
| `colors/blue/300` | `#60abff` |
| `colors/blue/500` | `#0079ff` |
| `colors/red/500` | `#f74646` |
| Spacing | 8, 12, 20, 24, 80, 128 |
| Radius | 10, 16 |

Text presets (all Space Mono): 1 = 26/700/120%; 3 = 18/400/140% (13 on mobile);
4 = 16/400/150%; 5 = 16/700/150%; 6 = 15/400/150%; 7 = 13/400/150%;
8 = 13/700/140%, letter-spacing 2.5px. Exact per-element usage, shadows, and page background
are read from the layout frames during implementation.

## R10. Layout frames and breakpoints (node `1:704`)

- **Frames**: Desktop 1440 (container 730px wide, centered), Tablet 768 (container 704px, 32px
  side margin), Mobile 375 (container 343px, 16px side margin); each in Light and Dark, plus
  Desktop Hover, Focus, and Error states in both themes.
- **Decision**: Mobile-first CSS with `@media (min-width: 768px)` for tablet and
  `@media (min-width: 1024px)` for desktop. Breakpoint values are documented next to the tokens
  in `variables.css` (custom properties cannot be used inside media queries).
- **Mobile differences**: 70px avatar beside name/username/joined; bio, stats (stacked) and links
  (single column) full width below. Tablet/desktop: 117px avatar, stats in a row, links in a
  2×2 grid.
- **Focus state** (frame `5:1338`): a blue outline around the search bar, search button, theme
  toggle, and focused link, which satisfies FR-016's focus requirement.

## R11. Error state (frames `5:1522`, `6:622`)

- **Finding**: The design shows the red inline "No results" label in the search bar **and**
  replaces the profile card with a centered card: heading "No results found!" and text "We
  couldn't find any GitHub users matching your search. Please double-check the username and try
  again."
- **Action**: The first draft of the spec said the previous profile stays visible; it was
  corrected (FR-005, US2, Edge Cases) before planning, per constitution principles I and V.
- **Decision for other failures**: rate limit and network errors reuse the same layout with their
  own friendly copy (see [contracts/ui-contract.md](./contracts/ui-contract.md)).

## R12. Accessibility structure (FR-017, FR-018)

- **Decision**: `<header>` with the "devfinder" logo as the single `<h1>` and the theme toggle
  `<button>`; `<main>` with a `<form role="search">` (visually hidden `<label>` on the input) and
  an `<article>` profile card whose name is an `<h2>`; stats as a `<dl>`; links as a `<ul>`.
  Each link gets a unique accessible name (e.g., "Website: https://github.blog"). The inline
  search message is in an `aria-live="polite"` region. The toggle's accessible name says what it
  does ("Switch to dark theme").
- **Rationale**: Meets the semantic-HTML and link-purpose rules in `specs.md` without extra ARIA.
