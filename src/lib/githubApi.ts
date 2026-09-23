import type { GitHubUserResponse, SearchResult } from '../types/github.ts'
import { toUserProfile } from './toUserProfile.ts'

const USERS_URL = 'https://api.github.com/users/'

// Looks up one GitHub user. Never throws: every outcome is returned as a SearchResult,
// so the UI can only ever show friendly messages.
export async function fetchUser(username: string, signal?: AbortSignal): Promise<SearchResult> {
  try {
    const response = await fetch(`${USERS_URL}${encodeURIComponent(username)}`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    })

    if (response.ok) {
      const body = (await response.json()) as GitHubUserResponse
      if (typeof body?.login !== 'string') return { status: 'error' }
      return { status: 'ok', profile: toUserProfile(body) }
    }

    if (response.status === 404) return { status: 'not-found' }

    // Unauthenticated requests are limited per hour; GitHub answers 403 (quota 0) or 429.
    const quotaUsedUp = response.headers.get('x-ratelimit-remaining') === '0'
    if (response.status === 429 || (response.status === 403 && quotaUsedUp)) {
      return { status: 'rate-limited' }
    }

    return { status: 'error' }
  } catch {
    // Network failure, aborted request, or an unreadable body.
    return { status: 'error' }
  }
}
