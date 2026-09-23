import { describe, expect, it } from 'vitest'
import { toUserProfile } from '../lib/toUserProfile.ts'
import { octocat } from './fixtures.ts'

describe('toUserProfile – octocat', () => {
  const profile = toUserProfile(octocat)

  it('maps name, handle, and joined date', () => {
    expect(profile.displayName).toBe('The Octocat')
    expect(profile.handle).toBe('@octocat')
    expect(profile.joinedLabel).toBe('Joined 25 Jan 2011')
    expect(profile.joinedIso).toBe('2011-01-25T18:44:36Z')
  })

  it('maps bio and stats', () => {
    expect(profile.bio).toBeNull()
    expect(profile.repos).toBe(8)
    expect(profile.followers).toBe(3938)
    expect(profile.following).toBe(9)
  })

  it('maps the links section', () => {
    expect(profile.location).toEqual({ text: 'San Francisco', href: null })
    expect(profile.website).toEqual({ text: 'https://github.blog', href: 'https://github.blog' })
    expect(profile.twitter).toEqual({ text: null, href: null })
    expect(profile.company).toEqual({ text: '@github', href: 'https://github.com/github' })
  })

  it('formats the join date in UTC with three-letter months', () => {
    const late = toUserProfile({ ...octocat, created_at: '2020-09-03T23:30:00Z' })
    expect(late.joinedLabel).toBe('Joined 3 Sep 2020')
  })
})

describe('toUserProfile – missing information (US3)', () => {
  it('falls back to the login when the name is missing or blank', () => {
    expect(toUserProfile({ ...octocat, name: null }).displayName).toBe('octocat')
    expect(toUserProfile({ ...octocat, name: '   ' }).displayName).toBe('octocat')
  })

  it('treats an empty or blank bio as missing', () => {
    expect(toUserProfile({ ...octocat, bio: '' }).bio).toBeNull()
    expect(toUserProfile({ ...octocat, bio: '  ' }).bio).toBeNull()
  })

  it('marks each missing link as unavailable', () => {
    const profile = toUserProfile({
      ...octocat,
      location: null,
      blog: '',
      twitter_username: null,
      company: null,
    })
    expect(profile.location).toEqual({ text: null, href: null })
    expect(profile.website).toEqual({ text: null, href: null })
    expect(profile.twitter).toEqual({ text: null, href: null })
    expect(profile.company).toEqual({ text: null, href: null })
  })

  it('adds https:// to a website without a scheme and keeps an existing one', () => {
    expect(toUserProfile({ ...octocat, blog: 'example.com' }).website.href).toBe('https://example.com')
    expect(toUserProfile({ ...octocat, blog: 'http://example.com' }).website.href).toBe(
      'http://example.com',
    )
  })

  it('links a Twitter handle to its X profile', () => {
    expect(toUserProfile({ ...octocat, twitter_username: 'gusanchedev' }).twitter).toEqual({
      text: 'gusanchedev',
      href: 'https://x.com/gusanchedev',
    })
  })

  it('links a company without a leading @ to its GitHub page', () => {
    expect(toUserProfile({ ...octocat, company: 'Acme' }).company).toEqual({
      text: 'Acme',
      href: 'https://github.com/Acme',
    })
  })
})
