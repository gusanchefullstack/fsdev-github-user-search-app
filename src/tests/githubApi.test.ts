import { describe, expect, it } from 'vitest'
import { fetchUser } from '../lib/githubApi.ts'
import { jsonResponse, octocat, stubFetch } from './fixtures.ts'

describe('fetchUser – success', () => {
  it('returns the mapped profile for a 200 response', async () => {
    stubFetch(jsonResponse(octocat))
    const result = await fetchUser('octocat')
    expect(result.status).toBe('ok')
    if (result.status === 'ok') expect(result.profile.displayName).toBe('The Octocat')
  })

  it('calls the users endpoint with the GitHub JSON Accept header', async () => {
    const fetchMock = stubFetch(jsonResponse(octocat))
    await fetchUser('octocat')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.github.com/users/octocat')
    expect(init.headers).toEqual({ Accept: 'application/vnd.github+json' })
  })

  it('URL-encodes the username', async () => {
    const fetchMock = stubFetch(jsonResponse(octocat))
    await fetchUser('a b')
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.github.com/users/a%20b')
  })
})

describe('fetchUser – failures (US2)', () => {
  it('maps 404 to not-found', async () => {
    stubFetch(jsonResponse({ message: 'Not Found' }, 404))
    expect(await fetchUser('nobody')).toEqual({ status: 'not-found' })
  })

  it('maps 403 with no remaining quota to rate-limited', async () => {
    stubFetch(jsonResponse({ message: 'rate limit' }, 403, { 'x-ratelimit-remaining': '0' }))
    expect(await fetchUser('octocat')).toEqual({ status: 'rate-limited' })
  })

  it('maps 403 with quota left to error', async () => {
    stubFetch(jsonResponse({ message: 'Forbidden' }, 403, { 'x-ratelimit-remaining': '42' }))
    expect(await fetchUser('octocat')).toEqual({ status: 'error' })
  })

  it('maps 429 to rate-limited', async () => {
    stubFetch(jsonResponse({}, 429))
    expect(await fetchUser('octocat')).toEqual({ status: 'rate-limited' })
  })

  it('maps 500 to error', async () => {
    stubFetch(jsonResponse({}, 500))
    expect(await fetchUser('octocat')).toEqual({ status: 'error' })
  })

  it('maps a network failure to error', async () => {
    stubFetch(new TypeError('Failed to fetch'))
    expect(await fetchUser('octocat')).toEqual({ status: 'error' })
  })

  it('maps an unreadable body to error', async () => {
    stubFetch(new Response('not json', { status: 200 }))
    expect(await fetchUser('octocat')).toEqual({ status: 'error' })
  })

  it('maps a body without login to error', async () => {
    stubFetch(jsonResponse({ id: 1 }))
    expect(await fetchUser('octocat')).toEqual({ status: 'error' })
  })

  it('forwards the abort signal to fetch', async () => {
    const fetchMock = stubFetch(jsonResponse(octocat))
    const controller = new AbortController()
    await fetchUser('octocat', controller.signal)
    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal)
  })
})
