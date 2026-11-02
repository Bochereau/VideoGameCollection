import type { CSSProperties } from 'react'
import type { ConsoleColors, ConsoleItem } from '@/types'

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

/** Couleurs de texte proposées (en plus de la palette) */
export const CONSOLE_TEXT_PRESETS = ['#ffffff', '#0b1020', ...CONSOLE_COLOR_PRESETS]

export function consoleColorMap(consoles: ConsoleItem[]): Record<string, ConsoleColors> {
  const map: Record<string, ConsoleColors> = {}
  for (const c of consoles) {
    if (c.color || c.textColor) map[c.name] = { color: c.color, textColor: c.textColor }
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

/** Style du badge console ; le texte suit le fond tant qu'il n'est pas personnalisé */
export function consoleBadgeStyle(colors?: ConsoleColors): CSSProperties | undefined {
  const bg = colors?.color
  const text = colors?.textColor || (bg ? readableTextColor(bg) : null)
  if (!bg && !text) return undefined
  return {
    ...(bg ? { backgroundColor: bg } : {}),
    ...(text ? { color: text } : {}),
  }
}

/** Classes par défaut pour ce qui n'est pas personnalisé */
export function consoleBadgeClass(colors?: ConsoleColors): string {
  const bg = colors?.color
  return [bg ? '' : 'bg-bg/80', bg || colors?.textColor ? '' : 'text-amber']
    .filter(Boolean)
    .join(' ')
}
