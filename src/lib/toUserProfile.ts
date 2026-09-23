import type { GitHubUserResponse, ProfileLink, UserProfile } from '../types/github.ts'

// Fixed English abbreviations: Intl's en-GB gives "Sept", which doesn't match the design.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const NO_LINK: ProfileLink = { text: null, href: null }

// A value made only of whitespace counts as empty.
function clean(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? ''
  return trimmed === '' ? null : trimmed
}

// "Joined 25 Jan 2011", read in UTC so the day never shifts with the viewer's time zone.
function formatJoined(iso: string): string {
  const date = new Date(iso)
  return `Joined ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

// Websites are often saved without a scheme ("example.com"); add https:// so the link works.
function websiteLink(blog: string): ProfileLink {
  const text = clean(blog)
  if (!text) return NO_LINK
  const href = /^https?:\/\//i.test(text) ? text : `https://${text}`
  return { text, href }
}

function twitterLink(handle: string | null): ProfileLink {
  const text = clean(handle)
  if (!text) return NO_LINK
  return { text, href: `https://x.com/${text.replace(/^@/, '')}` }
}

// "@github" links to https://github.com/github (leading @ removed).
function companyLink(company: string | null): ProfileLink {
  const text = clean(company)
  if (!text) return NO_LINK
  return { text, href: `https://github.com/${encodeURIComponent(text.replace(/^@/, ''))}` }
}

// Converts the raw API response into exactly what the profile card shows.
export function toUserProfile(raw: GitHubUserResponse): UserProfile {
  return {
    login: raw.login,
    // No name: show the username in the name slot (the handle below still has the @).
    displayName: clean(raw.name) ?? raw.login,
    handle: `@${raw.login}`,
    avatarUrl: raw.avatar_url,
    joinedLabel: formatJoined(raw.created_at),
    joinedIso: raw.created_at,
    bio: clean(raw.bio),
    repos: raw.public_repos,
    followers: raw.followers,
    following: raw.following,
    // Location is plain text, never a link.
    location: { text: clean(raw.location), href: null },
    website: websiteLink(raw.blog),
    twitter: twitterLink(raw.twitter_username),
    company: companyLink(raw.company),
  }
}
