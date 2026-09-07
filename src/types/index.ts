export interface Game {
  id: string
  name: string
  hardware: string
  developer: string
  editor: string
  release: number | null
  finished: boolean
  wishlist: boolean
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
}

export type FinishedFilter = 'all' | 'finished' | 'todo'

export type GamesQuery = {
  wishlist?: boolean
  hardware?: string
  finished?: boolean
  q?: string
}
