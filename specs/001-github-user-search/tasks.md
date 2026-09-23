---

description: "Task list for the GitHub User Search feature"
---

# Tasks: GitHub User Search

**Input**: Design documents from `/specs/001-github-user-search/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included. `my-sdd-docs/specs.md` requires Vitest tests for key and edge cases, and
[quickstart.md](./quickstart.md) lists the required cases. Write each story's tests first and
confirm they fail before implementing.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested
on its own.

**Design source**: Figma Desktop MCP. Design System `1:69`; layouts `1:704`. Frame ids:
Desktop Light `1:705` / Dark `5:244`, Tablet Light `5:688` / Dark `5:949`, Mobile Light `5:841` /
Dark `5:1036`, Hover `5:1235` / `5:1632`, Focus `5:1338` / `6:505`, Error `5:1522` / `6:622`.
Before any UI task, read the relevant frame with `get_design_context` (load the
figma-design-to-code guidance first) and use its exact spacing, sizes, and colors.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Paths are relative to the repository root (single Vite project; see plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository, tooling, and assets

- [X] T001 Create the public GitHub repo `fsdev-github-user-search-app` with `gh repo create` and add it as `origin` for the local repo (constitution: repo creation is the first step). **Ask the user for confirmation before running it**, because it is an outward-facing action
- [X] T002 Scaffold Vite `react-ts` in the scratchpad (`npm create vite@latest <tmp> -- --template react-ts`), then copy every config and type-declaration file the template generates (`package.json`, all `tsconfig*.json`, `vite.config.ts`, the ESLint config, and any `src/*.d.ts`) into the repo root, whatever their exact names in this Vite version. Use the TypeScript version the template installs. Do NOT overwrite the root `index.html`, and do not copy the template's demo files (`src/App.css`, `src/index.css`, `src/assets/react.svg`, `public/vite.svg`). Set `"name": "fsdev-github-user-search-app"` in `package.json` and run `npm install`
- [X] T003 Install dev dependencies `vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`. Add a `test` block to `vite.config.ts` (`environment: 'jsdom'`, `setupFiles: ['./src/tests/setup.ts']`) and set the `package.json` scripts `"test": "vitest run"` and `"test:watch": "vitest"`
- [X] T004 [P] Move `assets/icon-*.svg` to `src/assets/` and `assets/favicon-32x32.png` to `public/favicon-32x32.png` with `git mv`/`mv`, then delete the empty `assets/` folder
- [X] T005 [P] Rewrite `index.html`: keep `lang="en"`, the meta tags, and the title "Frontend Mentor | GitHub user search app"; favicon `href="/favicon-32x32.png"`; add Google Fonts `preconnect` links and the Space Mono 400/700 stylesheet; replace the placeholder body text with `<div id="root"></div>` and `<script type="module" src="/src/main.tsx"></script>`
- [X] T006 [P] Create `src/tests/setup.ts`: import `@testing-library/jest-dom/vitest`, call `cleanup()` in `afterEach`, and stub `window.matchMedia` so it returns `matches: false` (light) by default and can be overridden per test

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, design tokens, global styles, and the app shell that every story renders into

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 [P] Create `src/types/github.ts` with the types exactly as in data-model.md:
  - `GitHubUserResponse`: `login`, `name: string | null`, `avatar_url`, `created_at`, `bio: string | null`, `public_repos`, `followers`, `following`, `location: string | null`, `blog: string` ("Empty string `""` when unset (not `null`)"), `twitter_username: string | null`, `company: string | null`.
  - `ProfileLink { text: string | null; href: string | null }`.
  - `UserProfile`: `login`, `displayName`, `handle`, `avatarUrl`, `joinedLabel`, `joinedIso` (the raw `created_at`, used for `<time dateTime>`), `bio: string | null`, `repos`, `followers`, `following`, and `location`, `website`, `twitter`, `company` as `ProfileLink`.
  - `SearchResult`: `{ status: 'ok'; profile: UserProfile } | { status: 'not-found' } | { status: 'rate-limited' } | { status: 'error' }`.
  - `Theme = 'light' | 'dark'`.
  - `SearchView = 'loading' | 'profile' | 'not-found' | 'rate-limited' | 'error'`.
- [X] T008 [P] Create `src/styles/variables.css`:
  - The raw tokens from research.md R9 (neutral/blue/red colors, spacing 8/12/20/24/80/128, radii 10/16).
  - Font family `'Space Mono', monospace` and text presets 1–8 as size/weight/line-height/letter-spacing variables (preset 3 is 13px on mobile).
  - Semantic tokens for the light theme on `:root`: page background, card background, heading text, body text, muted text, accent, accent hover, error red, card shadow, and "Not Available" opacity.
  - The same semantic tokens overridden under `:root[data-theme="dark"]`.
  - Read the exact semantic values from frames `1:705` (light) and `5:244` (dark).
  - A comment documenting the breakpoints `768px` (tablet) and `1024px` (desktop).
- [X] T009 [P] Create `src/styles/global.css`: box-sizing reset, zero margins, `body` using the page background, text color, and font variables with `min-height: 100vh`, `img { display: block; max-width: 100% }`, and a `.visuallyHidden` utility class (clip pattern)
- [X] T010 Replace the template `src/main.tsx`: import `./styles/variables.css` and `./styles/global.css`, then render `<App />` in `<StrictMode>` into `#root`
- [X] T011 Create `src/components/Header.tsx` + `src/styles/Header.module.css`: `<header>` containing `<h1>` "devfinder" (the only `h1` on the page), styled with text preset 1, laid out per the Header frame (logo left; a right-side slot left empty for now)
- [X] T012 Create `src/App.tsx` + `src/styles/App.module.css`: render `<Header />` and a single `<main>`. The page container is fluid and mobile-first (no fixed widths): `width: 100%` with 16px side padding; at ≥768px, 32px side padding; at ≥1024px, `max-width: 730px` centered with `margin-inline: auto`. This gives 343px at 375 and 704px at 768, and never scrolls horizontally at 320px or wider. Take the vertical offsets from frames `5:841`, `5:688`, and `1:705`

**Checkpoint**: `npm run dev` shows "devfinder" on the correct background; `npm test` runs (0 tests)

---

## Phase 3: User Story 1 - See a profile on first load (Priority: P1) 🎯 MVP

**Goal**: The octocat profile card renders on load, matching the design at all three breakpoints

**Independent Test**: Load the app with no interaction. The octocat card shows every field in its designed position, and the company link points to `https://github.com/github`

### Tests for User Story 1 ⚠️ (write first, confirm they fail)

- [X] T013 [P] [US1] Create `src/tests/toUserProfile.test.ts` using the octocat example from `contracts/github-users-api.md`. Assert:
  - `displayName` "The Octocat", `handle` "@octocat", `joinedLabel` "Joined 25 Jan 2011".
  - `bio` `null`; `repos` 8, `followers` 3938, `following` 9.
  - `location` `{ text: 'San Francisco', href: null }`.
  - `website` `{ text: 'https://github.blog', href: 'https://github.blog' }`.
  - `twitter` `{ text: null, href: null }`.
  - `company` `{ text: '@github', href: 'https://github.com/github' }`.
  - Also: `created_at` `2020-09-03T23:30:00Z` gives "Joined 3 Sep 2020" (UTC, three-letter "Sep", not "Sept").
- [X] T014 [P] [US1] Create `src/tests/githubApi.test.ts` with `fetch` stubbed via `vi.fn()`. A 200 JSON octocat response returns `{ status: 'ok', profile }`. The request URL is `https://api.github.com/users/octocat` with header `Accept: application/vnd.github+json`, and a username such as `a b` is URL-encoded
- [X] T015 [P] [US1] Create `src/tests/App.test.tsx` with `fetch` stubbed to return octocat. On render, `fetch` is called once for `octocat`, and the page shows:
  - heading (h2) "The Octocat", "@octocat", "Joined 25 Jan 2011", "This profile has no bio";
  - "Repos" 8, "Followers" 3938, "Following" 9;
  - "San Francisco", "Not Available" for Twitter;
  - link "Website: https://github.blog", and link "Company: @github" with href `https://github.com/github`.

### Implementation for User Story 1

- [X] T016 [US1] Implement `toUserProfile(raw: GitHubUserResponse): UserProfile` in `src/lib/toUserProfile.ts` following data-model.md and research.md R5:
  - "A value made only of whitespace counts as empty".
  - `displayName` = "trimmed `name`, else `login`"; `handle` = `"@" + login`.
  - `joinedLabel` built from `getUTCDate()`/`getUTCMonth()`/`getUTCFullYear()` and a fixed `['Jan', …, 'Dec']` array.
  - `joinedIso` = `created_at` unchanged.
  - `bio` "trimmed; `null` when empty".
  - `location` "text only, never a link (`href: null`)".
  - `website` href: `blog` with "`https://` added if no scheme".
  - `twitter` href `https://x.com/{handle without @}`.
  - `company` href `https://github.com/{company without leading @}`, with the name part passed through `encodeURIComponent`.
  - For every `ProfileLink`, "`href` … `null` whenever `text` is `null`".
  - Add short plain comments on each rule.
- [X] T017 [US1] Implement `fetchUser(username: string, signal?: AbortSignal): Promise<SearchResult>` in `src/lib/githubApi.ts`:
  - `GET https://api.github.com/users/${encodeURIComponent(username)}` with `Accept: application/vnd.github+json`.
  - A 200 with a parsed body containing `login` returns `{ status: 'ok', profile: toUserProfile(body) }`.
  - Every other outcome (any status, rejected fetch, bad JSON) returns `{ status: 'error' }`.
  - Never throws. US2 refines this mapping.
- [X] T018 [P] [US1] Create `src/components/ProfileStats.tsx` + `src/styles/ProfileStats.module.css`: a `<dl>` with `Repos`/`Followers`/`Following` (`<dt>` label, `<dd>` number) inside the inset panel from the design. Stats sit in a row at ≥768px and are stacked on mobile (frame `5:859`). Numbers are shown as returned
- [X] T019 [P] [US1] Create `src/components/ProfileLinks.tsx` + `src/styles/ProfileLinks.module.css`: a `<ul>` of 4 items in the order location, Twitter, website, company (desktop/tablet 2×2 grid per frame `1:869`, single column on mobile per `5:869`). Each item:
  - A decorative icon `<span aria-hidden="true">` drawn with CSS `mask-image: url('../assets/icon-*.svg')` and `background-color: currentColor`.
  - A `.visuallyHidden` type label ("Location:", "Twitter:", "Website:", "Company:") followed by a space. When `href` is set, the label goes **inside** the `<a>` so the link's accessible name is e.g. "Company: @github". Otherwise it sits right before the text ("Twitter: Not Available").
  - When `href` is set: `<a href target="_blank" rel="noopener noreferrer">` containing the hidden label and then `text`.
  - When `text` is `null`: plain "Not Available", and the whole item (icon + text) gets the dimmed class using the opacity variable.
- [X] T020 [US1] Create `src/components/ProfileCard.tsx` + `src/styles/ProfileCard.module.css`:
  - `<img alt="Avatar of {displayName}">`, `<h2>` displayName, `<p>` handle (accent color, not a link), `<p>` "Joined …" wrapping a `<time dateTime={joinedIso}>`.
  - Bio `<p>` or "This profile has no bio" with the dimmed class.
  - Then `<ProfileStats>` and `<ProfileLinks>`.
  - Layout per frames: mobile `5:849` (70px avatar beside name/handle/joined; bio/stats/links full width below), tablet `5:696`, desktop `1:856` (117px avatar in its own column).
- [X] T021 [US1] Update `src/App.tsx`: state `view: SearchView` (initial `'loading'`) and `profile: UserProfile | null`. On mount, call `fetchUser('octocat', controller.signal)` and abort it on unmount. On `ok`, set `view: 'profile'`. Render `<article>` containing `<ProfileCard>` when `view === 'profile'`; render the card area empty while `'loading'` (no spinner, per spec Assumptions)

**Checkpoint**: `npm test` passes T013–T015, and `npm run dev` shows the octocat card matching `1:705` at 1440px, `5:688` at 768px, and `5:841` at 375px

---

## Phase 4: User Story 2 - Search for a GitHub user (Priority: P1)

**Goal**: Users search any username; unknown users and failures show the design's error state with friendly copy

**Independent Test**: Search a known username and the card switches. Search a nonexistent one and the inline "No results" label plus the "No results found!" card appear. Typing hides the inline label

### Tests for User Story 2 ⚠️ (write first, confirm they fail)

- [X] T022 [P] [US2] Extend `src/tests/githubApi.test.ts`:
  - 404 → `not-found`; 403 with header `x-ratelimit-remaining: 0` → `rate-limited`; 403 without it → `error`; 429 → `rate-limited`; 500 → `error`.
  - `fetch` rejecting with `TypeError` → `error`; 200 with invalid JSON → `error`; 200 JSON without `login` → `error`.
  - The `signal` passed in is forwarded to `fetch`.
- [X] T023 [P] [US2] Extend `src/tests/App.test.tsx` using `userEvent`:
  - Typing `torvalds` and clicking "Search" fetches `/users/torvalds` and shows that profile; pressing Enter also submits.
  - Submitting `"   "` makes no extra fetch; `"  torvalds  "` is trimmed.
  - A 404 shows the inline "No results" and the h2 "No results found!" with its body text, and the profile card is gone.
  - Typing one character hides "No results" while the card stays.
  - Rate-limited shows "Try again later" + "Search limit reached".
  - A network error shows "Try again later" + "Something went wrong", and no text containing "Error", "TypeError", or a status code.
  - With two searches where the first resolves last, only the second result is shown.

### Implementation for User Story 2

- [X] T024 [US2] Complete the status mapping in `src/lib/githubApi.ts` per `contracts/github-users-api.md`:
  - `404` → `not-found`; `403` && `x-ratelimit-remaining === '0'`, or `429` → `rate-limited`; any other non-200 → `error`.
  - Wrap `fetch` and `json()` in try/catch → `error`.
  - Never expose status codes or error text.
- [X] T025 [P] [US2] Create `src/components/SearchBar.tsx` + `src/styles/SearchBar.module.css`:
  - `<form role="search">` with the search icon (mask, `aria-hidden`), a `<label className="visuallyHidden">` "Search GitHub username", and `<input type="text">` with placeholder "Search GitHub username…".
  - An inline message `<p aria-live="polite">` in red, shown only when a `message` prop is set.
  - A `<button type="submit">` "Search".
  - Props: `value`, `onChange`, `onSubmit`, `message: string | null`.
  - Submit calls `preventDefault`. Layout per frame `5:937` (mobile: 99×48 button) and the desktop/tablet search bar (69px tall, radius 15/16).
- [X] T026 [P] [US2] Create `src/components/MessageCard.tsx` + `src/styles/MessageCard.module.css`: takes `view: 'not-found' | 'rate-limited' | 'error'` and renders an `<h2>` heading and a `<p>` body with the exact copy from `contracts/ui-contract.md`, centered, per frame `5:1522` (`6:622` dark)
- [X] T027 [US2] Update `src/App.tsx` to implement the search transitions in data-model.md:
  - Add `query` and `showInlineMessage` state.
  - On submit: trim; if empty do nothing; otherwise abort the previous `AbortController`, create a new one, and await `fetchUser`. If `signal.aborted`, ignore the result. Otherwise set `view`, set `profile` on `ok`, and set `showInlineMessage = status !== 'ok'`.
  - On change: update `query` and set `showInlineMessage = false` (the card view is unchanged).
  - Inline label: "No results" for `not-found`, "Try again later" for `rate-limited`/`error`.
  - Render `<SearchBar>` above the `<article>`, which holds `ProfileCard` or `MessageCard` (never both).
  - Apply the same view mapping to the initial octocat load.

**Checkpoint**: T022–T023 pass; searching real usernames in the dev server works; the error state matches `5:1522`

---

## Phase 5: User Story 3 - Understand profiles with missing information (Priority: P2)

**Goal**: Every missing field shows its placeholder and the card never breaks

**Independent Test**: A profile with no name, bio, location, website, Twitter, or company shows the username twice, "This profile has no bio", and four dimmed "Not Available" items with no links

### Tests for User Story 3 ⚠️ (write first, confirm they fail)

- [X] T028 [P] [US3] Extend `src/tests/toUserProfile.test.ts`:
  - `name: null` and `name: '   '` → `displayName` = login.
  - `bio: ''` and `'  '` → `null`.
  - `location: null`, `blog: ''`, `twitter_username: null`, `company: null` → each `{ text: null, href: null }`.
  - `blog: 'example.com'` → href `https://example.com`; `blog: 'http://example.com'` unchanged.
  - `twitter_username: 'gusanchedev'` → text `gusanchedev`, href `https://x.com/gusanchedev`.
  - `company: 'Acme'` (no `@`) → text `Acme`, href `https://github.com/Acme`.
- [X] T029 [P] [US3] Extend `src/tests/App.test.tsx`: with `fetch` returning a user whose optional fields are all empty, the h2 and the handle show `login`/`@login`, "This profile has no bio" is shown, `getAllByText('Not Available')` has length 4, and there are no website/Twitter/company links

### Implementation for User Story 3

- [X] T030 [US3] Fix any rule in `src/lib/toUserProfile.ts` that T028 exposes. Verify the dimmed style in `src/styles/ProfileCard.module.css` (bio placeholder) and `src/styles/ProfileLinks.module.css` (text + icon) matches the "Not Available" opacity in frame `1:705`
- [X] T031 [US3] Prevent layout breaks from long values: add `overflow-wrap: anywhere` / `min-width: 0` to the text and grid items in `src/styles/ProfileLinks.module.css` and `src/styles/ProfileCard.module.css`, and check that a 120-character URL in the website field causes no horizontal scroll at 375px

**Checkpoint**: T028–T029 pass; an empty-profile user renders cleanly at all widths

---

## Phase 6: User Story 4 - Switch between light and dark themes (Priority: P2)

**Goal**: The initial theme follows the device preference; the header toggle switches themes instantly

**Independent Test**: With the device set to dark, the app opens dark. Clicking the toggle switches every element to light, and the label changes to "DARK" with a moon

### Tests for User Story 4 ⚠️ (write first, confirm they fail)

- [X] T032 [P] [US4] Extend `src/tests/App.test.tsx`:
  - With `matchMedia` returning `matches: true` for `(prefers-color-scheme: dark)`: `document.documentElement.dataset.theme === 'dark'` and there is a button named "Switch to light theme" with visible text "LIGHT".
  - Clicking it gives `data-theme` `light` and a button "Switch to dark theme" with text "DARK".
  - With the default stub, the app starts light.

### Implementation for User Story 4

- [X] T033 [P] [US4] Create `src/components/ThemeToggle.tsx` + `src/styles/ThemeToggle.module.css`:
  - Props `theme` and `onToggle`.
  - A `<button type="button" aria-label="Switch to {dark|light} theme">`: in light theme it shows text "DARK" + the moon icon, in dark theme "LIGHT" + the sun icon. Icons use the mask technique with `aria-hidden`.
  - Text preset 8 (13px bold, 2.5px letter-spacing).
  - Hover color per frames `5:1235` (light) and `5:1632` (dark).
- [X] T034 [US4] Update `src/App.tsx` and `src/components/Header.tsx`: add `theme` state initialized with `window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'` and a `useEffect` that sets `document.documentElement.dataset.theme = theme`. Pass `theme` and `onToggle` to `Header`, which renders `<ThemeToggle>` on the right. The theme is not persisted
- [X] T035 [US4] Compare the dark theme against frames `5:244`, `5:949`, and `5:1036`, and correct the dark semantic tokens in `src/styles/variables.css` (page background, card, text, and shadow values)

**Checkpoint**: T032 passes; toggling recolors the whole page with no element left in the old theme

---

## Phase 7: User Story 5 - Use the app on any device and with assistive technology (Priority: P3)

**Goal**: Pixel-accurate responsive layouts, hover/focus states on every interactive element, and a clean accessibility structure

**Independent Test**: At 375, 768, and 1440px in both themes, the layout matches the frames with no horizontal scroll. Every control has hover and focus-visible states, and the a11y structure tests pass

### Tests for User Story 5 ⚠️ (write first, confirm they fail)

- [X] T036 [P] [US5] Extend `src/tests/App.test.tsx`:
  - Exactly one `main` role and exactly one level-1 heading ("devfinder").
  - The textbox is named "Search GitHub username".
  - The link names within the profile are all distinct ("Website: …", "Twitter: …", "Company: …").
  - The avatar `img` has alt "Avatar of The Octocat".

### Implementation for User Story 5

- [X] T037 [US5] Add hover styles matching frames `5:1235` and `5:1632`: the search button (blue/500 → blue/300), the theme toggle (text and icon color), and profile links (underline). Put them in `src/styles/SearchBar.module.css`, `src/styles/ThemeToggle.module.css`, and `src/styles/ProfileLinks.module.css`, with `cursor: pointer`
- [X] T038 [US5] Add `:focus-visible` outlines matching frames `5:1338` and `6:505` (blue outline with offset) for the search input wrapper (use `:focus-within` on the form), the search button, the theme toggle, and links, in the same module files plus `src/styles/global.css` for the base rule
- [X] T039 [US5] Run `npm run dev` and use the Chrome DevTools MCP to open the app at exactly 375×900, 768×1024, and 1440×900 in both themes. Compare with frames `5:841`/`5:1036`, `5:688`/`5:949`, and `1:705`/`5:244`, and fix spacing, font sizes, and alignment differences in the `src/styles/*.module.css` files. Also confirm there is no horizontal scroll at 320px

**Checkpoint**: T036 passes; visual parity at all three widths in both themes

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Build health, documentation in code, and end-to-end validation

- [X] T040 Run `npm run lint`, `npm test`, and `npm run build`, and fix every error and type issue in `src/`
- [X] T041 [P] Add short plain-style comments to key code elements (`src/lib/githubApi.ts`, `src/lib/toUserProfile.ts`, the state logic in `src/App.tsx`, and the theme tokens in `src/styles/variables.css`), per the `specs.md` Documentation section
- [X] T042 Run every automated and manual scenario in `specs/001-github-user-search/quickstart.md` (1–9, including offline and Lighthouse/axe), and fix any failure before marking the feature done. Also check the timing criteria: with DevTools throttling off (or "Fast 4G") and the cache disabled, the octocat card is fully visible in under 2s (SC-001, from the Performance panel or Lighthouse), and a search from typing to result takes under 5s (SC-002)
  - **Note (2026-09-23)**: Lighthouse accessibility scored 95–96. The only failures are color-contrast items that use the exact Figma colors, so they were left unchanged (constitution I). The user accepted keeping the design colors on 2026-09-23:
    - Light theme: Search button (white on `#0079ff`, 4.05:1); `@handle` (`#0079ff`, 4.05:1); dimmed "This profile has no bio" (3.28:1); dimmed "Not Available" (2.97:1); inline "No results" (`#f74646`, 3.54:1); error-card body (`#697c9a`, 4.24:1).
    - Dark theme: only the Search button.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 first (needs user confirmation); T002 → T003; T004–T006 after T002
- **Foundational (Phase 2)**: after Setup; T007–T009 in parallel, then T010 → T011 → T012
- **US1 (Phase 3)**: after Foundational. This is the MVP
- **US2 (Phase 4)**: after US1 (reuses `fetchUser`, `ProfileCard`, and `App` state)
- **US3 (Phase 5)**: after US1 (tests the mapping and card); independent of US2
- **US4 (Phase 6)**: after Foundational (needs `Header`, `App`, `variables.css`); independent of US1–US3
- **US5 (Phase 7)**: after US1, US2, and US4 (styles their controls)
- **Polish (Phase 8)**: after all stories

### Within Each User Story

- Tests are written first and must fail
- `lib/` logic before components; components before the `App.tsx` wiring
- `App.tsx` tasks are sequential across stories (same file): T021 → T027 → T034

### Parallel Opportunities

- Setup: T004, T005, T006
- Foundational: T007, T008, T009
- US1: tests T013–T015 together; then T018 and T019 together
- US2: tests T022 and T023; then T025 and T026
- US3: T028 and T029
- US4 can run alongside US2/US3 (only its `App.tsx`/`Header.tsx` edit must wait its turn)

---

## Parallel Example: User Story 1

```bash
# Tests first, together:
Task: "Create src/tests/toUserProfile.test.ts (octocat mapping, UTC 'Sep' date)"
Task: "Create src/tests/githubApi.test.ts (200 → ok, URL + Accept header)"
Task: "Create src/tests/App.test.tsx (octocat card on first load)"

# After T016–T017, presentational components together:
Task: "Create ProfileStats.tsx + ProfileStats.module.css"
Task: "Create ProfileLinks.tsx + ProfileLinks.module.css"
```

## Parallel Example: User Story 2

```bash
Task: "Create SearchBar.tsx + SearchBar.module.css"
Task: "Create MessageCard.tsx + MessageCard.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup (confirm T001 with the user) → Phase 2 Foundational
2. Phase 3 US1: the octocat card at all breakpoints
3. **STOP and VALIDATE**: `npm test` plus a visual check at 375, 768, and 1440px

### Incremental Delivery

1. + US2 (search and error state), the core challenge loop
2. + US3 (placeholder hardening)
3. + US4 (themes)
4. + US5 (hover/focus/a11y/pixel pass)
5. Polish → the feature is complete

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- Per the constitution: build only what is listed here. If a task seems to need behavior that isn't in spec.md, stop and ask for a spec update
- Never commit `*.fig` files (already in `.gitignore`)
- Out of scope for this task list (the post-implementation workflow in `my-sdd-docs/specs.md`, run after the user confirms the project is done): screenshots in `/screenshots`, README from `README-template.md` + the `create-readme` skill, Vercel deploy, Frontend Mentor submission, README/repo URL updates, portfolio update (ask first), and quality-report fixes
