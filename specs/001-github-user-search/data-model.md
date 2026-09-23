# Data Model: GitHub User Search

**Feature**: [spec.md](./spec.md) | **Date**: 2026-09-23

All types live in `src/types/`. There is no storage; all state is in memory.

## GitHubUserResponse (external, raw)

The subset of `GET /users/{username}` fields the app reads. Everything else is ignored.
Full contract: [contracts/github-users-api.md](./contracts/github-users-api.md).

| Field | Type | Notes |
|-------|------|-------|
| `login` | `string` | Always present |
| `name` | `string \| null` | |
| `avatar_url` | `string` | |
| `created_at` | `string` | ISO 8601 timestamp |
| `bio` | `string \| null` | |
| `public_repos` | `number` | |
| `followers` | `number` | |
| `following` | `number` | |
| `location` | `string \| null` | |
| `blog` | `string` | Empty string `""` when unset (not `null`) |
| `twitter_username` | `string \| null` | |
| `company` | `string \| null` | Often starts with `@` |

## UserProfile (display model)

Produced only by `toUserProfile(raw: GitHubUserResponse): UserProfile`. Components render it
as-is and contain no fallback logic.

| Field | Type | Rule (spec ref) |
|-------|------|-----------------|
| `login` | `string` | from `login` |
| `displayName` | `string` | trimmed `name`, else `login` (FR-007) |
| `handle` | `string` | `"@" + login` (FR-007) |
| `avatarUrl` | `string` | from `avatar_url` |
| `joinedIso` | `string` | `created_at` unchanged; used for `<time dateTime>` |
| `joinedLabel` | `string` | `"Joined 25 Jan 2011"`, UTC, English month abbreviations (FR-004) |
| `bio` | `string \| null` | trimmed; `null` when empty → "This profile has no bio" (FR-008) |
| `repos` | `number` | `public_repos` |
| `followers` | `number` | |
| `following` | `number` | |
| `location` | `ProfileLink` | text only, never a link (`href: null`) |
| `website` | `ProfileLink` | href: `blog`, `https://` added if no scheme (FR-010) |
| `twitter` | `ProfileLink` | text: handle as stored; href: `https://x.com/{handle without @}` |
| `company` | `ProfileLink` | text as stored; href: `https://github.com/{company without leading @}`, name URL-encoded (FR-011) |

### ProfileLink

| Field | Type | Rule |
|-------|------|------|
| `text` | `string \| null` | trimmed value; `null` when missing/empty → "Not Available" (FR-009) |
| `href` | `string \| null` | `null` whenever `text` is `null`, and always for location |

**Validation rules**

- A value made only of whitespace counts as empty.
- When `text` is `null`, the item renders dimmed and is not a link (FR-009).
- Numbers are shown as returned (the design shows plain integers, e.g., `3938`).

## SearchResult (API outcome)

Returned by `fetchUser(username, signal)`; it never throws for expected failures.

```text
{ status: 'ok', profile: UserProfile }
{ status: 'not-found' }
{ status: 'rate-limited' }
{ status: 'error' }
```

An aborted request (a newer search started) is dropped by the caller and never reaches the UI
(FR-019).

## SearchState (UI state in `App`)

| Field | Type | Meaning |
|-------|------|---------|
| `view` | `'loading' \| 'profile' \| 'not-found' \| 'rate-limited' \| 'error'` | What the card area shows |
| `profile` | `UserProfile \| null` | Last successfully loaded profile |
| `showInlineMessage` | `boolean` | Whether the inline search-bar message is visible (FR-006) |

### State transitions

```text
            app start (search "octocat")
                     │
                  loading ──ok──────────────► profile
                     │                          │
                     ├─404────────► not-found   │
                     ├─rate limit─► rate-limited│
                     └─other──────► error       │
                                                │
profile / not-found / rate-limited / error
   ── submit non-empty trimmed text ──► keep current view until result, then:
        ok → profile (inline message hidden)
        404 → not-found (inline message shown)
        rate limit → rate-limited (inline message shown)
        other → error (inline message shown)
   ── submit empty/whitespace ──► no change (FR-003)
   ── edit search text ──► inline message hidden; card view unchanged (FR-006)
```

`loading` exists only before the very first result; the card area renders empty in that state
(no loading indicator, per spec Assumptions). Later searches keep the current view until the new
result arrives.

## Theme

| Field | Type | Rule |
|-------|------|------|
| `theme` | `'light' \| 'dark'` | Initial value from `prefers-color-scheme` (FR-014); toggled by the header button (FR-013); written to `<html data-theme>`; not persisted |
