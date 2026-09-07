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

export type CatalogPlatform = {
  rawgId: number
  name: string
  gamesCount: number
}

export type FinishedFilter = 'all' | 'finished' | 'todo'

export type GamesQuery = {
  wishlist?: boolean
  hardware?: string
  finished?: boolean
  q?: string
}
