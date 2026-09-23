# Contract: User Interface

**Feature**: [spec.md](../spec.md) | **Design**: Figma layouts node `1:704`

What the page exposes to users and assistive technology. Tests query by these roles, names,
and texts.

## Page structure (FR-017)

| Region | Element | Content |
|--------|---------|---------|
| Header | `<header>` | `<h1>` "devfinder" (the only `h1`); theme toggle `<button>` |
| Main | `<main>` (only one) | search form, then the card area |
| Search | `<form role="search">` | `<label>` (visually hidden) "Search GitHub username"; `<input type="text">` (not `search`, to avoid the browser's native clear button, which isn't in the design) placeholder "Search GitHub username…"; inline message (`aria-live="polite"`); `<button type="submit">` "Search" |
| Card area | `<article>` | profile card **or** message card (never both) |

## Theme toggle (FR-013, FR-014)

| Current theme | Visible label | Icon | Accessible name |
|---------------|---------------|------|-----------------|
| light | `DARK` | moon | "Switch to dark theme" |
| dark | `LIGHT` | sun | "Switch to light theme" |

Activating it flips `<html data-theme>` between `light` and `dark`.

## Profile card (FR-004, FR-007–FR-011)

| Part | Element | Content |
|------|---------|---------|
| Avatar | `<img>` | `alt` = "Avatar of {displayName}" |
| Name | `<h2>` | `displayName` |
| Handle | `<p>` (blue text, not a link; the spec only requires website, Twitter, and company links) | `@login` |
| Joined | `<p>` (with `<time dateTime>`) | "Joined 25 Jan 2011" |
| Bio | `<p>` | bio, or "This profile has no bio" (dimmed) |
| Stats | `<dl>` | `Repos` / `Followers` / `Following` with numbers |
| Links | `<ul>` of 4 items | location, website, Twitter, company |

### Link items

| Item | Present | Missing |
|------|---------|---------|
| Location | text, not a link | "Not Available", dimmed |
| Website | link to normalized URL, accessible name "Website: {text}" | "Not Available", dimmed, not a link |
| Twitter | link to `https://x.com/{handle}`, accessible name "Twitter: {text}" | same as above |
| Company | link to `https://github.com/{company without @}`, accessible name "Company: {text}" | same as above |

- External links open in a new tab with `rel="noopener noreferrer"`.
- Each item has a visually hidden type label, so no two links share an accessible name (FR-018).
- Icons are decorative (`aria-hidden="true"`).

## Message card and inline message (FR-005, FR-006, FR-012)

| View | Inline message (red) | Card heading (`<h2>`) | Card text |
|------|----------------------|-----------------------|-----------|
| `not-found` | "No results" | "No results found!" | "We couldn't find any GitHub users matching your search. Please double-check the username and try again." |
| `rate-limited` | "Try again later" | "Search limit reached" | "GitHub limits how many searches can be made each hour. Please wait a few minutes and try again." |
| `error` | "Try again later" | "Something went wrong" | "We couldn't reach GitHub right now. Please check your connection and try again." |

- The inline message hides as soon as the search text changes (FR-006); the card stays until
  the next search result.
- No status codes, error names, or stack traces are ever rendered.

## Interaction states (FR-016)

Every interactive element (search input, search button, theme toggle, website,
Twitter, and company links) has a hover style and a visible `:focus-visible` outline matching the
design's Hover and Focus frames (`5:1235`, `5:1338`, `5:1632`, `6:505`).

## Responsive layouts (FR-015)

| Width | Frame | Key traits |
|-------|-------|------------|
| 375px | Mobile Light/Dark | fluid, 16px side padding; 70px avatar beside name; stats stacked; links one column |
| 768px | Tablet Light/Dark | fluid, 32px side padding; 117px avatar; stats in a row; links 2×2 |
| 1440px | Desktop Light/Dark | 730px centered container; avatar in its own column |

No horizontal scrolling at any width ≥ 320px; long text wraps (`overflow-wrap: anywhere`).
