import { vi } from 'vitest'
import type { GitHubUserResponse } from '../types/github.ts'

// The octocat example from contracts/github-users-api.md
export const octocat: GitHubUserResponse = {
  login: 'octocat',
  name: 'The Octocat',
  avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
  company: '@github',
  blog: 'https://github.blog',
  location: 'San Francisco',
  bio: null,
  twitter_username: null,
  public_repos: 8,
  followers: 3938,
  following: 9,
  created_at: '2011-01-25T18:44:36Z',
}

// A user who filled in nothing optional
export const emptyUser: GitHubUserResponse = {
  login: 'emptyuser',
  name: null,
  avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
  company: null,
  blog: '',
  location: null,
  bio: null,
  twitter_username: null,
  public_repos: 0,
  followers: 0,
  following: 0,
  created_at: '2020-09-03T23:30:00Z',
}

export function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

// Stubs global fetch; each call gets the next response (the last one repeats).
export function stubFetch(...responses: Array<Response | Error>) {
  const fetchMock = vi.fn()
  responses.forEach((response, index) => {
    const impl = () =>
      response instanceof Error ? Promise.reject(response) : Promise.resolve(response.clone())
    if (index === responses.length - 1) fetchMock.mockImplementation(impl)
    else fetchMock.mockImplementationOnce(impl)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
