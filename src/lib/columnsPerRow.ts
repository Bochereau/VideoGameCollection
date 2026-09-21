const STORAGE_KEY = 'vgc-games-columns'
export const MIN_GAME_COLUMNS = 2
export const MAX_GAME_COLUMNS = 16
export const DEFAULT_GAME_COLUMNS = 8

export function clampGameColumns(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_GAME_COLUMNS
  return Math.min(MAX_GAME_COLUMNS, Math.max(MIN_GAME_COLUMNS, Math.round(value)))
}

export function readGameColumns(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_GAME_COLUMNS
    return clampGameColumns(Number(stored))
  } catch {
    return DEFAULT_GAME_COLUMNS
  }
}

export function writeGameColumns(value: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(clampGameColumns(value)))
  } catch {
    /* ignore */
  }
}
