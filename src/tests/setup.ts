import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Tests can call this to pretend the device prefers a dark (or light) color scheme.
export function mockColorScheme(prefersDark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: prefersDark && query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// jsdom has no matchMedia; default every test to a light-scheme device.
mockColorScheme(false)

afterEach(() => {
  cleanup()
  mockColorScheme(false)
  vi.unstubAllGlobals()
  document.documentElement.removeAttribute('data-theme')
})
