import type { GamesViewMode } from '@/types/view'

const VIEW_MODE_KEY = 'vgc-games-view'

export function readViewMode(): GamesViewMode {
  try {
    const stored = localStorage.getItem(VIEW_MODE_KEY)
    if (stored === 'list' || stored === 'cards') return stored
  } catch {
    /* ignore */
  }
  return 'cards'
}

export function writeViewMode(value: GamesViewMode) {
  try {
    localStorage.setItem(VIEW_MODE_KEY, value)
  } catch {
    /* ignore */
  }
}
