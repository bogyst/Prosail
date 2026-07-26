import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'
const KEY = 'prosail-theme'

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* brak localStorage — działaj dalej */
  }
  // Bez zapisanego wyboru: podążaj za ustawieniem systemu.
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

/** Ustawia motyw jak najwcześniej, żeby uniknąć „mignięcia” jasnym tłem. */
export function bootstrapTheme() {
  applyTheme(initialTheme())
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* ignoruj */
    }
  }, [theme])

  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <button
      onClick={() => setTheme(next)}
      className="btn-ghost px-2.5 py-1.5"
      aria-label={next === 'dark' ? 'Włącz tryb nocny' : 'Włącz tryb dzienny'}
      title={next === 'dark' ? 'Tryb nocny' : 'Tryb dzienny'}
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="hidden text-xs sm:inline">{theme === 'light' ? 'Noc' : 'Dzień'}</span>
    </button>
  )
}
