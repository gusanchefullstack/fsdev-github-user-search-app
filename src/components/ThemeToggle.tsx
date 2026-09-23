import type { Theme } from '../types/github.ts'
import styles from '../styles/ThemeToggle.module.css'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

// Shows the theme you can switch to: "DARK" + moon in light mode, "LIGHT" + sun in dark mode.
function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const next = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      className={styles.toggle}
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={onToggle}
    >
      <span className={styles.label}>{next.toUpperCase()}</span>
      <span className={`${styles.icon} ${next === 'dark' ? styles.moon : styles.sun}`} aria-hidden="true" />
    </button>
  )
}

export default ThemeToggle
