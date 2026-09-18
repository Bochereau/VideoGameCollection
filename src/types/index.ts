export type GameFormat = 'physical' | 'digital'
export type GameCondition = 'complete' | 'box' | 'manual' | 'loose' | 'none'
export type GameEdition =
  | 'standard'
  | 'steelbook'
  | 'special'
  | 'deluxe'
  | 'collector'

export type GameStatus =
  | 'todo'
  | 'playing'
  | 'paused'
  | 'finished'
  | 'abandoned'
export type GamePriority = 1 | 2 | 3 | 4 | 5

export interface Game {
  id: string
  name: string
  hardware: string
  developer: string
  editor: string
  release: number | null
  status: GameStatus
  priority: GamePriority | null
  wishlist: boolean
  favorite: boolean
  cover?: string | null
  rawgId?: number | null
  format: GameFormat
  condition: GameCondition
  edition: GameEdition
  createdAt?: string
  updatedAt?: string
}

export interface ConsoleItem {
  id: string
  name: string
  count: number
  createdAt?: string
}

export type GameInput = {
  name: string
  hardware: string
  developer?: string
  editor?: string
  release?: number | null
  status?: GameStatus
  priority?: GamePriority | null
  wishlist?: boolean
  favorite?: boolean
  cover?: string | null
  rawgId?: number | null
  format?: GameFormat
  condition?: GameCondition
  edition?: GameEdition
}

export type CatalogGame = {
  rawgId: number
  name: string
  release: number | null
  cover: string | null
  platforms: string[]
  rating?: number | null
  developer?: string
  editor?: string
}

export type CatalogCover = {
  id: number
  name: string
  system: string
  region: string
  mediaUrl: string
  thumb: string
  alternatives: { region: string; mediaUrl: string }[]
}

export type CatalogPlatform = {
  rawgId: number
  name: string
  gamesCount: number
}

export type StatusFilter = 'all' | GameStatus
export type FavoriteFilter = 'all' | 'yes'
export type FormatFilter = 'all' | GameFormat
export type ConditionFilter = 'all' | GameCondition
export type EditionFilter = 'all' | GameEdition
export type SortKey = 'name' | 'year' | 'priority'
export type GroupBy = 'none' | 'priority' | 'year'

export type GamesQuery = {
  wishlist?: boolean
  hardware?: string
  status?: GameStatus
  favorite?: boolean
  q?: string
  format?: GameFormat
  condition?: GameCondition
  edition?: GameEdition
}

export type TopEntry = {
  rank: number
  gameId?: string | null
  name: string
  cover?: string | null
  release?: number | null
  rawgId?: number | null
}

export type Top = {
  id: string
  name: string
  size: number
  filledCount: number
  entries: TopEntry[]
  createdAt?: string
  updatedAt?: string
}

export type TopSummary = {
  id: string
  name: string
  size: number
  filledCount: number
  createdAt?: string
  updatedAt?: string
}

export type TopInput = {
  name: string
  size: number
}

export type TopUpdate = {
  name?: string
  size?: number
  entries?: TopEntry[]
}

export const DEFAULT_TOP_SIZE = 10
export const MAX_TOP_SIZE = 100

export const STATUS_LABELS: Record<GameStatus, string> = {
  todo: 'À faire',
  playing: 'En cours',
  paused: 'En pause',
  finished: 'Terminé',
  abandoned: 'Abandonné',
}

export const PRIORITY_LABELS: Record<GamePriority, string> = {
  5: 'Très haute',
  4: 'Haute',
  3: 'Moyenne',
  2: 'Basse',
  1: 'Très basse',
}

/** Tailwind-ish color classes for priority bookmark */
export const PRIORITY_COLORS: Record<GamePriority, string> = {
  5: 'text-red-500',
  4: 'text-orange-500',
  3: 'text-amber-400',
  2: 'text-sky-500',
  1: 'text-ink-muted',
}

export const DEFAULT_PRIORITY: GamePriority = 3

export const CONDITION_LABELS: Record<GameCondition, string> = {
  complete: 'Complet',
  box: 'Boîte',
  manual: 'Livret',
  loose: 'Loose',
  none: 'Aucun',
}

export const EDITION_LABELS: Record<GameEdition, string> = {
  standard: 'Standard',
  steelbook: 'Steelbook',
  special: 'Spéciale',
  deluxe: 'Deluxe',
  collector: 'Collector',
}
