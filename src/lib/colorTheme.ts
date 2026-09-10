import type { ColorTheme } from '@/types/theme'

const COLOR_THEME_KEY = 'vgc-color-theme'

export function readColorTheme(): ColorTheme {
  try {
    const stored = localStorage.getItem(COLOR_THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return 'dark'
}

export function writeColorTheme(value: ColorTheme) {
  try {
    localStorage.setItem(COLOR_THEME_KEY, value)
  } catch {
    /* ignore */
  }
}

export function applyColorTheme(value: ColorTheme) {
  document.documentElement.dataset.theme = value
}
