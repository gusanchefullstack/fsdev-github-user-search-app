import type { FormEvent } from 'react'
import styles from '../styles/SearchBar.module.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  message: string | null
}

function SearchBar({ value, onChange, onSubmit, message }: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className={styles.form} role="search" onSubmit={handleSubmit}>
      <span className={styles.icon} aria-hidden="true" />
      <label className="visuallyHidden" htmlFor="username">
        Search GitHub username
      </label>
      <input
        className={styles.input}
        id="username"
        type="text"
        placeholder="Search GitHub username…"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {/* Announced to screen readers when a search fails */}
      <p className={styles.message} aria-live="polite">
        {message}
      </p>
      <button className={styles.button} type="submit">
        Search
      </button>
    </form>
  )
}

export default SearchBar
