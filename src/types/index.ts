export type GameFormat = 'physical' | 'digital'
export type GameCondition = 'complete' | 'box' | 'manual' | 'loose' | 'none'
export type GameEdition = 'standard' | 'special' | 'collector'

export interface Game {
  id: string
  name: string
  hardware: string
  developer: string
  editor: string
  release: number | null
  finished: boolean
  wishlist: boolean
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
  finished?: boolean
  wishlist?: boolean
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

export type FinishedFilter = 'all' | 'finished' | 'todo'
export type FormatFilter = 'all' | GameFormat
export type ConditionFilter = 'all' | GameCondition
export type EditionFilter = 'all' | GameEdition

export type GamesQuery = {
  wishlist?: boolean
  hardware?: string
  finished?: boolean
  q?: string
  format?: GameFormat
  condition?: GameCondition
  edition?: GameEdition
}

export const CONDITION_LABELS: Record<GameCondition, string> = {
  complete: 'Complet',
  box: 'Boîte',
  manual: 'Livret',
  loose: 'Loose',
  none: 'Aucun',
}

export const EDITION_LABELS: Record<GameEdition, string> = {
  standard: 'Standard',
  special: 'Spéciale',
  collector: 'Collector',
}
