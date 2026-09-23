# Contract: GitHub Users API (consumed)

**Source**: https://docs.github.com/en/rest/users/users#get-a-user
**Used by**: `src/lib/githubApi.ts` → `fetchUser(username, signal): Promise<SearchResult>`

## Request

```http
GET https://api.github.com/users/{username}
Accept: application/vnd.github+json
```

- `{username}` is the trimmed search text, passed through `encodeURIComponent`.
- No authentication (60 requests/hour per IP).
- An `AbortSignal` is passed so a newer search cancels the older one.

## Responses → SearchResult

| Condition | SearchResult | UI (see [ui-contract.md](./ui-contract.md)) |
|-----------|--------------|------------------------------------------------|
| `200` with a JSON body containing `login` | `{ status: 'ok', profile: toUserProfile(body) }` | Profile card |
| `404` | `{ status: 'not-found' }` | "No results" + "No results found!" card |
| `403` and header `x-ratelimit-remaining: 0`, or `429` | `{ status: 'rate-limited' }` | Rate-limit copy |
| Any other status | `{ status: 'error' }` | Generic friendly copy |
| Network failure (`fetch` rejects, not aborted) | `{ status: 'error' }` | Generic friendly copy |
| `200` with an unparseable body or no `login` | `{ status: 'error' }` | Generic friendly copy |
| Request aborted | not surfaced (caller ignores) | Unchanged |

GitHub exposes `X-RateLimit-Remaining` to browsers via `Access-Control-Expose-Headers`
(verified 2026-09-23), so the 403 check works from the frontend.

`fetchUser` never lets an exception reach components, and never passes status codes or error
text to the UI (FR-012).

## Fields read (200 body)

`login`, `name`, `avatar_url`, `created_at`, `bio`, `public_repos`, `followers`,
`following`, `location`, `blog`, `twitter_username`, `company`. Types and display rules:
[data-model.md](../data-model.md).

## Example (trimmed) — `GET /users/octocat`

```json
{
  "login": "octocat",
  "name": "The Octocat",
  "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
  "company": "@github",
  "blog": "https://github.blog",
  "location": "San Francisco",
  "bio": null,
  "twitter_username": null,
  "public_repos": 8,
  "followers": 3938,
  "following": 9,
  "created_at": "2011-01-25T18:44:36Z"
}
```

Expected display: "The Octocat", "@octocat", "Joined 25 Jan 2011", "This profile has no bio",
8 / 3938 / 9, "San Francisco", Twitter "Not Available", website link `https://github.blog`,
company "@github" → `https://github.com/github`.
