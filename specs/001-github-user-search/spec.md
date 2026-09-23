# Feature Specification: GitHub User Search

**Feature Branch**: `001-github-user-search`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: "@my-sdd-docs/specs.md" — the Frontend Mentor "GitHub user search app"
challenge: search GitHub users by username, show their public profile, handle missing data and
unknown users, switch between light and dark themes, and match the provided design on mobile,
tablet, and desktop.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See a profile on first load (Priority: P1)

A visitor opens the app and immediately sees a complete profile card for the GitHub user
"octocat": avatar, display name, `@username`, join date, bio, repository/follower/following
counts, and the location, website, Twitter, and company details.

**Why this priority**: It is the app's core output. Without a correctly rendered profile card,
nothing else (search, theming) has value, and it is the first thing every visitor sees.

**Independent Test**: Load the app with no interaction and confirm the octocat profile appears with
every field in its designed position.

**Acceptance Scenarios**:

1. **Given** the app has just been opened, **When** the page finishes loading, **Then** the
   octocat profile is displayed without the user typing anything.
2. **Given** a profile is displayed, **When** the user views it, **Then** it shows the avatar,
   display name, `@username`, "Joined D Mon YYYY" date, bio, repository count, follower count,
   following count, location, website, Twitter handle, and company.
3. **Given** the displayed profile has a company of `@github`, **When** the user activates the
   company link, **Then** they are taken to `https://github.com/github`.

---

### User Story 2 - Search for a GitHub user (Priority: P1)

A visitor types a GitHub username into the search bar and submits it (button or Enter key). The
profile card updates to show that user. If no user has that username, an inline "No results"
message appears inside the search bar and the profile card is replaced by a "No results found!"
card, as shown in the design.

**Why this priority**: Searching is the app's main interaction and the reason it exists.

**Independent Test**: Search for a known username and confirm the card switches to that user;
search for a nonexistent username and confirm the inline "No results" message appears.

**Acceptance Scenarios**:

1. **Given** any profile is shown, **When** the user enters an existing username and submits,
   **Then** the card shows that user's profile.
2. **Given** any profile is shown, **When** the user submits a username that does not exist,
   **Then** the inline "No results" message is shown in the search bar and the profile card is
   replaced by a "No results found!" card explaining that no GitHub user matched the search.
3. **Given** the "No results" message is shown, **When** the user changes the search text or
   successfully searches again, **Then** the message disappears.
4. **Given** the search field is empty or contains only spaces, **When** the user submits, **Then**
   no search is performed and the current profile stays unchanged.

---

### User Story 3 - Understand profiles with missing information (Priority: P2)

A visitor searches for a user whose profile is incomplete. Every missing field is shown with a
clear placeholder instead of an empty gap, so the card layout never breaks.

**Why this priority**: Many real GitHub profiles lack a name, bio, or links; without placeholders
the card would look broken for a large share of searches.

**Independent Test**: Display profiles with each field missing, one at a time, and confirm each
placeholder rule below.

**Acceptance Scenarios**:

1. **Given** a user has no display name, **When** their profile is shown, **Then** the name slot
   shows their username without `@`, and the line below shows it again with `@`.
2. **Given** a user has an empty bio, **When** their profile is shown, **Then** the bio reads
   "This profile has no bio" with reduced opacity.
3. **Given** a user has no location, website, Twitter, or company, **When** their profile is shown,
   **Then** each missing item reads "Not Available" with reduced opacity, its icon is also dimmed,
   and it is not a link.

---

### User Story 4 - Switch between light and dark themes (Priority: P2)

On first visit the app uses the theme matching the visitor's device preference. A toggle in the
header ("DARK" with a moon icon in light mode, "LIGHT" with a sun icon in dark mode) switches
the theme instantly.

**Why this priority**: It is a required challenge feature, but the app is fully usable without it.

**Independent Test**: Open the app with the device set to dark, then to light, and confirm the
initial theme matches; press the toggle and confirm the whole interface switches.

**Acceptance Scenarios**:

1. **Given** the device prefers a dark color scheme, **When** the app opens, **Then** it displays
   in the dark theme (and in the light theme when the device prefers light).
2. **Given** the app is in either theme, **When** the user activates the toggle, **Then** every
   part of the interface switches to the other theme and the toggle label and icon update.

---

### User Story 5 - Use the app on any device and with assistive technology (Priority: P3)

The layout adapts to mobile, tablet, and desktop screens as shown in the design. Every
interactive element shows a hover state, and the page is navigable and understandable with a
keyboard and a screen reader.

**Why this priority**: It is essential for quality and scoring but is layered on top of the
working features above.

**Independent Test**: View the app at 375px, 768px, and 1440px widths and compare against the
design; hover every interactive element; navigate with keyboard only and a screen reader.

**Acceptance Scenarios**:

1. **Given** a screen 375px, 768px, or 1440px wide, **When** the app is displayed, **Then** the
   layout matches the mobile, tablet, or desktop design respectively, with no horizontal
   scrolling.
2. **Given** any interactive element (search button, theme toggle, profile links), **When** the
   user hovers over it, **Then** a visible hover state appears.
3. **Given** a screen reader user lists the links on the page, **When** they read them out of
   context, **Then** each link's purpose is distinguishable.

---

### Edge Cases

- **Service unreachable or request limit reached**: the same error layout is used as for
  "No results", but with friendly wording for that failure (for example, "Something went wrong"
  / "Please try again in a few minutes.") and the inline label "Try again later" in place of
  "No results"; no technical error text or error codes are shown.
- **Company without a leading `@`**: the text is shown as-is and still links to the matching
  GitHub page.
- **Website stored without `http://` or `https://`**: the link still opens the correct site.
- **Twitter handle present**: displayed exactly as stored on the profile and links to that
  Twitter/X profile.
- **Very long values** (bio, website URL, company): text wraps or truncates without breaking the
  card layout or causing horizontal scrolling.
- **Username with surrounding spaces**: spaces are trimmed before searching.
- **Rapid consecutive searches**: the card always ends up showing the result of the most recent
  search.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST display the profile of the GitHub user "octocat" on first load without
  any user input.
- **FR-002**: Users MUST be able to search for a GitHub user by username, submitting with either
  the search button or the Enter key.
- **FR-003**: The app MUST ignore searches that are empty or contain only whitespace, and MUST
  trim leading/trailing whitespace from the username before searching.
- **FR-004**: The profile card MUST show: avatar, display name, `@username`, join date formatted as
  "Joined D Mon YYYY", day without a leading zero (e.g., "Joined 25 Jan 2011", "Joined 3 Sep 2020"), bio, public repository count, follower
  count, following count, location, website, Twitter, and company.
- **FR-005**: When the searched user does not exist, the app MUST show the inline "No results"
  message in the search bar and replace the profile card with the "No results found!" card from
  the design (heading plus a short "double-check the username and try again" explanation).
- **FR-006**: The inline search-bar message ("No results" for an unknown user, "Try again later"
  for other failures) MUST disappear when the user edits the search text or a later search
  succeeds.
- **FR-007**: When a user has no display name, the app MUST show the username (without `@`) in
  the name slot and `@username` below it.
- **FR-008**: When a user's bio is empty, the app MUST show "This profile has no bio" with reduced
  opacity.
- **FR-009**: When location, website, Twitter, or company is empty, the app MUST show
  "Not Available" with reduced opacity for that item, and that item MUST NOT be a link.
- **FR-010**: Website, Twitter, and company MUST be links to their resources when present.
- **FR-011**: The company link MUST remove a leading `@` and point to `https://github.com/<company>`
  (e.g., `@github` → `https://github.com/github`).
- **FR-012**: Every technical failure (network error, service unavailable, request limit reached,
  unexpected response) MUST be shown as a friendly, human-readable message; raw errors, codes,
  or stack traces MUST NEVER be displayed.
- **FR-013**: The app MUST offer a toggle that switches between light and dark themes, labeled
  "DARK" with a moon icon in light mode and "LIGHT" with a sun icon in dark mode.
- **FR-014**: The initial theme MUST follow the device's color-scheme preference.
- **FR-015**: The layout MUST match the mobile, tablet, and desktop designs (verified at 375px,
  768px, and 1440px wide) with no horizontal scrolling.
- **FR-016**: Every interactive element MUST have a visible hover state and a visible keyboard
  focus state.
- **FR-017**: The page MUST have exactly one main content region and exactly one top-level
  heading, and use meaningful structural regions (header, main content, etc.).
- **FR-018**: Each link MUST have a distinct accessible name so its purpose is clear out of
  context; the search field MUST have an accessible label; images MUST have appropriate
  alternative text.
- **FR-019**: When a search result arrives out of order, the app MUST display only the most
  recent search's result.

### Key Entities *(include if feature involves data)*

- **User Profile**: a GitHub user's public profile as shown on the card: username (always
  present), display name (optional), avatar image, join date, bio (optional), public repository
  count, follower count, following count, location (optional), website (optional), Twitter
  handle (optional), company (optional).
- **Search State**: the current search text and the outcome of the last search: showing a
  profile, "No results", or a friendly error message.
- **Theme**: the active color scheme (light or dark), initialized from the device preference and
  changed by the toggle.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a typical broadband connection, the octocat profile is fully visible within
  2 seconds of opening the app.
- **SC-002**: A user can search for a username and see the result in under 5 seconds from
  starting to type, with a single submit action.
- **SC-003**: 100% of the placeholder rules (missing name, bio, location, website, Twitter,
  company) display correctly, verified by one test case per rule.
- **SC-004**: At 375px, 768px, and 1440px widths, the layout visually matches the corresponding
  design with no horizontal scrolling and no overlapping content.
- **SC-005**: 0 raw technical error messages are ever shown to users across the tested failure
  cases (user not found, network failure, request limit reached).
- **SC-006**: Switching themes updates the entire interface in under 0.5 seconds, with no element
  left in the previous theme.
- **SC-007**: An automated accessibility check reports no missing landmarks, duplicate top-level
  headings, duplicate main regions, or ambiguous link names.

## Assumptions

- The app uses GitHub's public, unauthenticated user profile data; this is subject to an hourly
  request limit, which is handled as a friendly error (see Edge Cases).
- The theme choice is not remembered between visits; each visit starts from the device
  preference, because persisting it is not required by the challenge.
- While a search is in progress, the previous profile stays visible until the new result
  arrives; the design shows no dedicated loading indicator, so none is added.
- The friendly error for non-"not found" failures reuses the design's error layout (inline
  label plus error card), since the design provides only that one error state.
- Twitter links point to the user's profile on Twitter/X; website links are opened as given,
  with a secure web prefix added when none is present.
- Links open external sites in a new tab.
- The visual source of truth is the Figma design (Design System and Desktop/Tablet/Mobile
  layouts) referenced in `my-sdd-docs/specs.md`, together with the icons in `assets/`.
- Out of scope for this feature spec (covered by the plan and project workflow in
  `my-sdd-docs/specs.md`): build tooling and folder structure, README and screenshots,
  deployment, Frontend Mentor submission, portfolio update, and quality-report fixes.
- The app is frontend-only; there is no backend or database.
