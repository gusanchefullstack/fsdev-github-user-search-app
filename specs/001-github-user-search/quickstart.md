# Quickstart & Validation: GitHub User Search

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

How to run the app and prove each user story works. Behavior details are in
[contracts/ui-contract.md](./contracts/ui-contract.md) and [data-model.md](./data-model.md).

## Prerequisites

- Node 26+ and npm 12+ (`node -v`, `npm -v`)
- Internet access (the app calls `api.github.com`, limited to 60 requests/hour without a token)
- For design comparison: Figma Desktop with the file from `figma-design/` open

## Setup and run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest, all tests once (vitest run)
npm run build      # type-check + production build into dist/
npm run preview    # serve the built app
```

Run a single test file or test: `npx vitest run src/tests/toUserProfile.test.ts` or
`npx vitest run -t "company"`.

## Automated validation (Vitest)

`npm test` must pass with tests that cover at least:

| Area | Cases | Spec |
|------|-------|------|
| `toUserProfile` | full octocat profile; missing name; empty/whitespace bio; each of location, blog, twitter, company missing; company `@github` → `https://github.com/github`; company without `@`; blog without scheme; joined date "Joined 25 Jan 2011" (and a September date shows "Sep") | FR-004, FR-007–FR-011 |
| `fetchUser` | 200 → ok; 404 → not-found; 403 + `x-ratelimit-remaining: 0` → rate-limited; 429 → rate-limited; 500 → error; `fetch` rejects → error; bad JSON → error | FR-005, FR-012 |
| `App` (fetch stubbed) | octocat on first load; search updates card; Enter key submits; empty/whitespace submit makes no request; not-found shows "No results" + "No results found!"; editing text hides the inline message; network error shows friendly copy and no raw text; the latest of two searches wins | FR-001–FR-006, FR-012, FR-019 |
| Theme | initial theme follows a mocked `matchMedia`; toggle flips `data-theme` and the button label | FR-013, FR-014 |
| Accessibility | exactly one `main` and one `h1`; the search input has a label; website, Twitter, and company links have distinct accessible names | FR-017, FR-018 |

## Manual validation scenarios

Run `npm run dev` and use browser DevTools device mode.

1. **First load (US1)**: open the app → the octocat card matches the Desktop Light frame; the
   company link goes to `https://github.com/github`.
2. **Search (US2)**: search `torvalds` → card updates. Search `thisuserdoesnotexist123456` →
   red "No results" in the search bar and the "No results found!" card (frame `5:1522`). Type
   one character → the inline message disappears.
3. **Missing data (US3)**: search a user with no name/bio/links (find one with an empty profile)
   → username twice, "This profile has no bio" and "Not Available" dimmed, and none of those are
   links.
4. **Theme (US4)**: set DevTools "Emulate prefers-color-scheme: dark" and reload → dark theme.
   Click the toggle → light theme, label "DARK" with a moon.
5. **Responsive (US5)**: compare at exactly 375px, 768px, and 1440px wide with the Mobile,
   Tablet, and Desktop frames, in both themes; there is no horizontal scrollbar.
6. **Hover/focus (US5)**: hover and Tab through the search button, toggle, and links → states
   match the Hover/Focus frames.
7. **Network failure**: DevTools Network → Offline, then search → "Something went wrong" card,
   and no technical text is shown.
8. **Accessibility**: run Lighthouse or axe → no landmark, heading, link-name, or label issues.
9. **Timing (SC-001, SC-002)**: cache disabled, throttling off or "Fast 4G" → the octocat card is
   fully visible in under 2s (Performance panel/Lighthouse), and typing a username and pressing
   Enter shows the result in under 5s.

## Expected outcome

All automated tests pass, `npm run build` completes without type errors, and scenarios 1–9
behave as described. This covers success criteria SC-001 to SC-007.
