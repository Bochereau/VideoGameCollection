import type { CSSProperties } from 'react'
import type { ConsoleItem } from '@/types'

/** Palette proposée dans le sélecteur de couleur des consoles */
export const CONSOLE_COLOR_PRESETS = [
  '#e60012', // rouge Nintendo
  '#f97316',
  '#f3c623',
  '#84cc16',
  '#107c10', // vert Xbox
  '#14b8a6',
  '#38bdf8',
  '#003791', // bleu PlayStation
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#94a3b8',
]

export function consoleColorMap(consoles: ConsoleItem[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const c of consoles) {
    if (c.color) map[c.name] = c.color
  }
  return map
}

/** Texte noir ou blanc selon la luminance perçue du fond */
export function readableTextColor(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#0b1020' : '#ffffff'
}

/** Style du badge console (jaquette) ; undefined = style par défaut */
export function consoleBadgeStyle(color?: string | null): CSSProperties | undefined {
  if (!color) return undefined
  return { backgroundColor: color, color: readableTextColor(color) }
}
