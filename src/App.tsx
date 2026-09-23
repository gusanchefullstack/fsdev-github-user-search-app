import { useEffect, useRef, useState } from 'react'
import Header from './components/Header.tsx'
import MessageCard from './components/MessageCard.tsx'
import ProfileCard from './components/ProfileCard.tsx'
import SearchBar from './components/SearchBar.tsx'
import { fetchUser } from './lib/githubApi.ts'
import type { SearchResult, SearchView, Theme, UserProfile } from './types/github.ts'
import styles from './styles/App.module.css'

// Short red label shown inside the search bar after a failed search
const INLINE_MESSAGES: Partial<Record<SearchView, string>> = {
  'not-found': 'No results',
  'rate-limited': 'Try again later',
  error: 'Try again later',
}

// First visit follows the device's color-scheme preference (not saved between visits).
function preferredTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [theme, setTheme] = useState<Theme>(preferredTheme)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<SearchView>('loading')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showInlineMessage, setShowInlineMessage] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  // Puts a search result on screen: the profile card, or a message card plus the inline label.
  function showResult(result: SearchResult) {
    if (result.status === 'ok') setProfile(result.profile)
    setView(result.status === 'ok' ? 'profile' : result.status)
    setShowInlineMessage(result.status !== 'ok')
  }

  // Starts a search. A newer search aborts the older one, so only the latest result is shown.
  function search(username: string) {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    fetchUser(username, controller.signal).then((result) => {
      if (!controller.signal.aborted) showResult(result)
    })
  }

  // The whole palette switches through the data-theme attribute (see variables.css).
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Show octocat on first load.
  useEffect(() => {
    const controller = new AbortController()
    controllerRef.current = controller
    fetchUser('octocat', controller.signal).then((result) => {
      if (!controller.signal.aborted) showResult(result)
    })
    return () => controller.abort()
  }, [])

  function handleSubmit() {
    const username = query.trim()
    if (username === '') return
    search(username)
  }

  // Editing the text hides the inline message; the card stays until the next result.
  function handleChange(value: string) {
    setQuery(value)
    setShowInlineMessage(false)
  }

  return (
    <div className={styles.page}>
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
      <main className={styles.main}>
        <SearchBar
          value={query}
          onChange={handleChange}
          onSubmit={handleSubmit}
          message={showInlineMessage ? (INLINE_MESSAGES[view] ?? null) : null}
        />
        <article>
          {view === 'profile' && profile && <ProfileCard profile={profile} />}
          {(view === 'not-found' || view === 'rate-limited' || view === 'error') && (
            <MessageCard view={view} />
          )}
        </article>
      </main>
    </div>
  )
}

export default App
