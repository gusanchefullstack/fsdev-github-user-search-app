import type { Theme } from '../types/github.ts'
import styles from '../styles/Header.module.css'
import ThemeToggle from './ThemeToggle.tsx'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>devfinder</h1>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  )
}

export default Header
