// Subset of the GitHub "get a user" response that the app reads.
export interface GitHubUserResponse {
  login: string
  name: string | null
  avatar_url: string
  created_at: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  location: string | null
  // GitHub returns an empty string (not null) when no website is set.
  blog: string
  twitter_username: string | null
  company: string | null
}

// One entry of the links section. text is null when the value is missing ("Not Available").
export interface ProfileLink {
  text: string | null
  href: string | null
}

// Display-ready profile: components render it as-is, with no fallback logic of their own.
export interface UserProfile {
  login: string
  displayName: string
  handle: string
  avatarUrl: string
  joinedLabel: string
  joinedIso: string
  bio: string | null
  repos: number
  followers: number
  following: number
  location: ProfileLink
  website: ProfileLink
  twitter: ProfileLink
  company: ProfileLink
}

// Outcome of one search. Expected failures are values, never thrown errors.
export type SearchResult =
  | { status: 'ok'; profile: UserProfile }
  | { status: 'not-found' }
  | { status: 'rate-limited' }
  | { status: 'error' }

export type Theme = 'light' | 'dark'

export type SearchView = 'loading' | 'profile' | 'not-found' | 'rate-limited' | 'error'
