# Implementation Plan: GitHub User Search

**Branch**: `001-github-user-search` (spec folder; git is still on `main`) | **Date**: 2026-09-23 |
**Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-github-user-search/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A single-page, frontend-only React + TypeScript app (Vite) that shows the GitHub profile of
`octocat` on load, lets users search any username, and renders the result in a profile card
matching the Figma design at 375, 768, and 1440px in light and dark themes. One unauthenticated
call to `GET /users/{username}` feeds a pure mapping function (`toUserProfile`) that applies
every placeholder and link rule. Failures become a typed result (`not-found`, `rate-limited`,
`error`) shown with friendly copy in the design's error layout. Colors, fonts, and typography are
CSS custom properties in one variables file, and a `data-theme` attribute switches themes.

## Technical Context

**Language/Version**: TypeScript (current major) on React 19; Node 26 / npm 12 for tooling

**Primary Dependencies**: react, react-dom; dev: vite 8 (`@vitejs/plugin-react`), vitest 5,
jsdom, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom
(see [research.md](./research.md) R1–R2)

**Storage**: N/A (in-memory state only; theme not persisted)

**Testing**: Vitest + Testing Library (jsdom), `fetch` stubbed with `vi.fn()`; manual viewport
checks at 375, 768, and 1440px

**Target Platform**: Modern evergreen browsers (desktop and mobile); static hosting on Vercel

**Project Type**: Single-page web app, frontend only

**Performance Goals**: Octocat profile visible within 2s on broadband (SC-001); theme switch under
0.5s (SC-006); one network request per search

**Constraints**: GitHub unauthenticated rate limit (60 requests/hour/IP); no raw errors in the UI;
match Figma pixel values; no horizontal scroll at 320px or wider

**Scale/Scope**: 1 screen, about 7 components, 1 external endpoint

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution v1.0.0 (`.specify/memory/constitution.md`).

| # | Gate | Pre-research | Post-design | Evidence |
|---|------|:---:|:---:|----------|
| I | Design fidelity: Figma is the source of truth; `assets/` icons first | PASS | PASS | Tokens and frames pulled from Figma nodes `1:69` and `1:704` (research R9–R11); spec's error state corrected to match frame `5:1522`; starter SVGs reused (R7) |
| II | React + TypeScript; CSS Modules; fonts, colors, and typography in a separate variables file | PASS | PASS | `src/styles/variables.css` + `*.module.css` per component (R6, R8); no backend or DB |
| III | Plain structure, function components, camelCase/PascalCase | PASS | PASS | Flat `components/`, no router, no state library, no data-fetching library; logic in 2 small `lib/` modules |
| IV | Friendly error handling; no raw errors or stack traces | PASS | PASS | `fetchUser` returns a `SearchResult` union and never throws to the UI; fixed copy per state ([ui-contract](./contracts/ui-contract.md)) |
| V | Zero shadow code; spec is the source of truth | PASS | PASS | Only spec features. Deliberately excluded: theme persistence, loading spinner, profile link on `@handle`, search history. The spec was updated before planning when the design contradicted it |
| — | Data only from spec'd API; separate frontend/backend repos | PASS | PASS | Only `api.github.com/users/{username}`; frontend-only single repo |
| — | Versioning: git initialized; `fsdev-` GitHub repo created first; Figma files gitignored | PASS* | PASS* | git initialized; `.gitignore` excludes `*.fig`. *Creating the GitHub repo `fsdev-github-user-search-app` is still pending and MUST be the first task in `tasks.md` |

No violations, so Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-github-user-search/
├── plan.md              # This file
├── research.md          # Phase 0: decisions, Figma tokens, frames
├── data-model.md        # Phase 1: types, mapping rules, state transitions
├── quickstart.md        # Phase 1: run and validation guide
├── contracts/
│   ├── github-users-api.md   # consumed endpoint → SearchResult mapping
│   └── ui-contract.md        # roles, accessible names, copy, states, layouts
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks, not created here)
```

### Source Code (repository root)

```text
index.html                     # Vite entry (kept at root); loads /src/main.tsx, Space Mono font
public/
└── favicon-32x32.png          # moved from assets/
src/
├── main.tsx                   # React root; imports global styles
├── App.tsx                    # theme + search state; octocat on mount; aborts stale requests
├── assets/                    # starter SVG icons (moved from assets/)
├── components/
│   ├── Header.tsx             # h1 "devfinder" + ThemeToggle
│   ├── ThemeToggle.tsx
│   ├── SearchBar.tsx          # form role="search", inline message
│   ├── ProfileCard.tsx        # avatar, name, handle, joined, bio, stats, links
│   ├── ProfileStats.tsx       # <dl> repos/followers/following
│   ├── ProfileLinks.tsx       # location, website, Twitter, company items
│   └── MessageCard.tsx        # not-found / rate-limited / error card
├── lib/
│   ├── githubApi.ts           # fetchUser(username, signal): Promise<SearchResult>
│   └── toUserProfile.ts       # raw → UserProfile (all fallback and link rules)
├── types/
│   └── github.ts              # GitHubUserResponse, UserProfile, ProfileLink, SearchResult, Theme
├── styles/
│   ├── variables.css          # colors (light/dark), fonts, type presets, spacing, radii, shadows
│   ├── global.css             # reset, body, visually-hidden utility
│   ├── App.module.css
│   ├── Header.module.css
│   ├── ThemeToggle.module.css
│   ├── SearchBar.module.css
│   ├── ProfileCard.module.css
│   ├── ProfileStats.module.css
│   ├── ProfileLinks.module.css
│   └── MessageCard.module.css
└── tests/
    ├── setup.ts               # jest-dom matchers, matchMedia stub
    ├── toUserProfile.test.ts
    ├── githubApi.test.ts
    └── App.test.tsx           # integration: search flows, theme, a11y structure
```

**Structure Decision**: A single Vite project at the repo root, per `specs.md` (all source under
`src/`, CSS and TS in their own subfolders, components in `src/components/`). CSS Modules sit in
`src/styles/` next to `variables.css` to satisfy "CSS styles … inside corresponding subfolders".
Tests live in `src/tests/`. There is no backend, so there is no second repo.

## Implementation Notes (for `/speckit-tasks`)

1. Create the GitHub repo `fsdev-github-user-search-app` (constitution: first step).
2. Scaffold Vite `react-ts` in a temporary folder and merge it in, keeping the root `index.html`
   (R1). Move icons to `src/assets/` and the favicon to `public/` (R7).
3. Write `variables.css` from the R9 tokens; read per-element values from the Figma frames with
   the Figma Desktop MCP.
4. Build and test `toUserProfile` and `fetchUser` first (pure, test-first), then the components.
5. Match the Hover, Focus, and Error frames; verify at 375, 768, and 1440px ([quickstart](./quickstart.md)).
6. Post-implementation workflow (screenshots, README, Vercel, submission, portfolio, report
   fixes) follows `my-sdd-docs/specs.md` and is outside this feature's code scope.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations.
