import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../App.tsx'
import { emptyUser, jsonResponse, octocat, stubFetch } from './fixtures.ts'
import { mockColorScheme } from './setup.ts'

describe('App – first load (US1)', () => {
  it('shows the octocat profile without any input', async () => {
    const fetchMock = stubFetch(jsonResponse(octocat))
    render(<App />)

    expect(await screen.findByRole('heading', { level: 2, name: 'The Octocat' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.github.com/users/octocat')

    expect(screen.getByText('@octocat')).toBeInTheDocument()
    expect(screen.getByText('Joined 25 Jan 2011')).toBeInTheDocument()
    expect(screen.getByText('This profile has no bio')).toBeInTheDocument()

    expect(screen.getByText('Repos').nextElementSibling).toHaveTextContent('8')
    expect(screen.getByText('Followers').nextElementSibling).toHaveTextContent('3938')
    expect(screen.getByText('Following').nextElementSibling).toHaveTextContent('9')

    expect(screen.getByText('San Francisco')).toBeInTheDocument()
    expect(screen.getByText('Not Available')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Website: https://github.blog' })).toHaveAttribute(
      'href',
      'https://github.blog',
    )
    expect(screen.getByRole('link', { name: 'Company: @github' })).toHaveAttribute(
      'href',
      'https://github.com/github',
    )
  })
})

describe('App – search (US2)', () => {
  const torvalds = { ...octocat, login: 'torvalds', name: 'Linus Torvalds' }

  async function renderLoaded() {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('heading', { level: 2, name: 'The Octocat' })
    return user
  }

  it('searches with the button and shows the new profile', async () => {
    const fetchMock = stubFetch(jsonResponse(octocat), jsonResponse(torvalds))
    const user = await renderLoaded()
    await user.type(screen.getByRole('textbox', { name: 'Search GitHub username' }), 'torvalds')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(await screen.findByRole('heading', { level: 2, name: 'Linus Torvalds' })).toBeInTheDocument()
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.github.com/users/torvalds')
  })

  it('submits with the Enter key and trims spaces', async () => {
    const fetchMock = stubFetch(jsonResponse(octocat), jsonResponse(torvalds))
    const user = await renderLoaded()
    await user.type(screen.getByRole('textbox', { name: 'Search GitHub username' }), '  torvalds  {Enter}')
    expect(await screen.findByRole('heading', { level: 2, name: 'Linus Torvalds' })).toBeInTheDocument()
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.github.com/users/torvalds')
  })

  it('ignores an empty or whitespace-only search', async () => {
    const fetchMock = stubFetch(jsonResponse(octocat))
    const user = await renderLoaded()
    await user.click(screen.getByRole('button', { name: 'Search' }))
    await user.type(screen.getByRole('textbox', { name: 'Search GitHub username' }), '   {Enter}')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('heading', { level: 2, name: 'The Octocat' })).toBeInTheDocument()
  })

  it('shows the not-found state and hides the inline message on edit', async () => {
    stubFetch(jsonResponse(octocat), jsonResponse({ message: 'Not Found' }, 404))
    const user = await renderLoaded()
    const input = screen.getByRole('textbox', { name: 'Search GitHub username' })
    await user.type(input, 'nobody{Enter}')

    expect(await screen.findByText('No results')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'No results found!' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'We couldn’t find any GitHub users matching your search. Please double-check the username and try again.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'The Octocat' })).not.toBeInTheDocument()

    await user.type(input, 'x')
    expect(screen.queryByText('No results')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'No results found!' })).toBeInTheDocument()
  })

  it('shows friendly copy when the rate limit is reached', async () => {
    stubFetch(jsonResponse(octocat), jsonResponse({}, 429))
    const user = await renderLoaded()
    await user.type(screen.getByRole('textbox', { name: 'Search GitHub username' }), 'torvalds{Enter}')
    expect(await screen.findByText('Try again later')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Search limit reached' })).toBeInTheDocument()
  })

  it('shows friendly copy and no raw error on a network failure', async () => {
    stubFetch(jsonResponse(octocat), new TypeError('Failed to fetch'))
    const user = await renderLoaded()
    await user.type(screen.getByRole('textbox', { name: 'Search GitHub username' }), 'torvalds{Enter}')
    expect(await screen.findByText('Try again later')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Something went wrong' })).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/TypeError|Failed to fetch|Error:|\b(4|5)\d\d\b/)
  })

  it('shows only the latest search when an older one resolves last', async () => {
    let resolveSlow: (response: Response) => void = () => {}
    const slow = new Promise<Response>((resolve) => {
      resolveSlow = resolve
    })
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(octocat))
      .mockImplementationOnce((_url: string, init: RequestInit) => {
        // Behave like real fetch: reject when aborted.
        return new Promise((resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
          slow.then(resolve)
        })
      })
      .mockResolvedValueOnce(jsonResponse(torvalds))
    vi.stubGlobal('fetch', fetchMock)

    const user = await renderLoaded()
    const input = screen.getByRole('textbox', { name: 'Search GitHub username' })
    await user.type(input, 'slowuser{Enter}')
    await user.clear(input)
    await user.type(input, 'torvalds{Enter}')
    expect(await screen.findByRole('heading', { level: 2, name: 'Linus Torvalds' })).toBeInTheDocument()

    resolveSlow(jsonResponse({ ...octocat, login: 'slowuser', name: 'Slow User' }))
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(screen.queryByRole('heading', { level: 2, name: 'Slow User' })).not.toBeInTheDocument()
    expect(screen.queryByText('Try again later')).not.toBeInTheDocument()
  })
})

describe('App – missing information (US3)', () => {
  it('shows placeholders and no links for an empty profile', async () => {
    stubFetch(jsonResponse(emptyUser))
    render(<App />)

    expect(await screen.findByRole('heading', { level: 2, name: 'emptyuser' })).toBeInTheDocument()
    expect(screen.getByText('@emptyuser')).toBeInTheDocument()
    expect(screen.getByText('This profile has no bio')).toBeInTheDocument()
    expect(screen.getAllByText('Not Available')).toHaveLength(4)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})

describe('App – theme (US4)', () => {
  it('starts in the light theme by default', () => {
    stubFetch(jsonResponse(octocat))
    render(<App />)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toHaveTextContent('DARK')
  })

  it('follows a dark device preference and toggles back to light', async () => {
    mockColorScheme(true)
    stubFetch(jsonResponse(octocat))
    const user = userEvent.setup()
    render(<App />)

    expect(document.documentElement.dataset.theme).toBe('dark')
    const toggle = screen.getByRole('button', { name: 'Switch to light theme' })
    expect(toggle).toHaveTextContent('LIGHT')

    await user.click(toggle)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toHaveTextContent('DARK')
  })
})

describe('App – accessibility structure (US5)', () => {
  it('has one main, one h1, a labelled search box, and distinct link names', async () => {
    stubFetch(jsonResponse({ ...octocat, twitter_username: 'octo' }))
    render(<App />)
    await screen.findByRole('heading', { level: 2, name: 'The Octocat' })

    expect(screen.getAllByRole('main')).toHaveLength(1)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent('devfinder')
    expect(screen.getByRole('textbox', { name: 'Search GitHub username' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Avatar of The Octocat' })).toBeInTheDocument()

    const names = screen.getAllByRole('link').map((link) => link.textContent?.trim())
    expect(names).toEqual(['Twitter: octo', 'Website: https://github.blog', 'Company: @github'])
    expect(new Set(names).size).toBe(names.length)
  })
})
