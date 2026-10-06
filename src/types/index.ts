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
  igdbId?: number | null
  rawgId?: number | null
  genres: string[]
  format: GameFormat
  condition: GameCondition
  edition: GameEdition
  reserved?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ConsoleItem {
  id: string
  name: string
  count: number
  logo?: string | null
  igdbId?: number | null
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
  igdbId?: number | null
  rawgId?: number | null
  genres?: string[]
  format?: GameFormat
  condition?: GameCondition
  edition?: GameEdition
}

export type CatalogGame = {
  igdbId: number
  name: string
  release: number | null
  cover: string | null
  platforms: string[]
  rating?: number | null
  developer?: string
  editor?: string
  genres?: string[]
}

export type CatalogCoverSource = 'igdb' | 'libretro'

export type CatalogCover = {
  id: number
  name: string
  system: string
  region: string
  mediaUrl: string
  thumb: string
  alternatives: { region: string; mediaUrl: string }[]
  source?: CatalogCoverSource
}

export type CatalogPlatform = {
  igdbId: number
  name: string
  logo?: string | null
  gamesCount: number
}

export type StatusFilter = 'all' | GameStatus
export type FavoriteFilter = 'all' | 'yes'
export type FormatFilter = 'all' | GameFormat
export type ConditionFilter = 'all' | GameCondition
export type EditionFilter = 'all' | GameEdition
/** 'all', UNCLASSIFIED_GENRE ou un nom de genre IGDB */
export type GenreFilter = string
export type SortKey = 'name' | 'year' | 'priority'
export type GroupBy = 'none' | 'priority' | 'year'

export type GamesQuery = {
  wishlist?: boolean
  hardware?: string
  status?: GameStatus
  favorite?: boolean
  q?: string
  nameExact?: string
  format?: GameFormat
  condition?: GameCondition
  edition?: GameEdition
  genre?: string
}

export type WishlistShareLink = {
  token: string | null
  ownerName?: string
  createdAt?: string
  updatedAt?: string
}

export type PublicWishlistGame = {
  id: string
  name: string
  hardware: string
  developer: string
  editor: string
  release: number | null
  priority: GamePriority | null
  cover?: string | null
  format: GameFormat
  edition: GameEdition
  reserved?: boolean
}

export type PublicWishlist = {
  ownerName: string
  games: PublicWishlistGame[]
  logos?: Record<string, string>
}

export type TopEntry = {
  rank: number
  gameId?: string | null
  name: string
  cover?: string | null
  release?: number | null
  igdbId?: number | null
  rawgId?: number | null
}

export type TopColumnsPerRow = 5 | 10 | 15 | 20

export const TOP_COLUMNS_CHOICES: TopColumnsPerRow[] = [5, 10, 15, 20]

export function defaultColumnsPerRow(size: number): TopColumnsPerRow {
  if (size >= 80) return 20
  if (size >= 30) return 15
  if (size >= 15) return 10
  return 5
}

export type Top = {
  id: string
  name: string
  size: number
  columnsPerRow: TopColumnsPerRow
  filledCount: number
  entries: TopEntry[]
  createdAt?: string
  updatedAt?: string
}

export type TopSummary = {
  id: string
  name: string
  size: number
  columnsPerRow: TopColumnsPerRow
  filledCount: number
  createdAt?: string
  updatedAt?: string
}

export type TopInput = {
  name: string
  size: number
  columnsPerRow?: TopColumnsPerRow
}

export type TopUpdate = {
  name?: string
  size?: number
  columnsPerRow?: TopColumnsPerRow
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

/** Valeur de filtre pour les jeux sans genre */
export const UNCLASSIFIED_GENRE = '__none__'

export type GenreGroup =
  | 'Action'
  | 'Aventure'
  | 'RPG'
  | 'Stratégie'
  | 'Simulation'
  | 'Sport & course'
  | 'Convivial'
  | 'Autres'

/**
 * Liste commune des genres, partagée par tous les utilisateurs.
 * `id` est la valeur stockée en base : ne jamais le renommer (changer `label` à la place).
 */
export const GENRES: { id: string; label: string; group: GenreGroup }[] = [
  // Action
  { id: 'action', label: 'Action', group: 'Action' },
  { id: 'action-adventure', label: 'Action-Aventure', group: 'Action' },
  { id: 'platformer', label: 'Plateforme', group: 'Action' },
  { id: 'metroidvania', label: 'Metroidvania', group: 'Action' },
  { id: 'beat-em-up', label: "Beat'em up", group: 'Action' },
  { id: 'hack-and-slash', label: "Hack'n slash", group: 'Action' },
  { id: 'fighting', label: 'Combat', group: 'Action' },
  { id: 'fps', label: 'FPS', group: 'Action' },
  { id: 'tps', label: 'Tir à la 3e personne', group: 'Action' },
  { id: 'shoot-em-up', label: "Shoot'em up", group: 'Action' },
  { id: 'run-and-gun', label: 'Run and gun', group: 'Action' },
  { id: 'stealth', label: 'Infiltration', group: 'Action' },
  { id: 'immersive-sim', label: 'Immersive sim', group: 'Action' },
  { id: 'survival-horror', label: 'Survival horror', group: 'Action' },
  { id: 'souls-like', label: 'Souls-like', group: 'Action' },
  { id: 'roguelike', label: 'Rogue-like / lite', group: 'Action' },
  { id: 'battle-royale', label: 'Battle royale', group: 'Action' },
  // Aventure
  { id: 'adventure', label: 'Aventure', group: 'Aventure' },
  { id: 'point-and-click', label: 'Point-and-click', group: 'Aventure' },
  { id: 'visual-novel', label: 'Visual novel', group: 'Aventure' },
  { id: 'narrative', label: 'Narratif', group: 'Aventure' },
  { id: 'knowledgevania', label: 'Knowledgevania', group: 'Aventure' },
  { id: 'walking-sim', label: 'Exploration narrative', group: 'Aventure' },
  { id: 'puzzle', label: 'Réflexion', group: 'Aventure' },
  { id: 'horror', label: 'Horreur', group: 'Aventure' },
  // RPG
  { id: 'rpg', label: 'Jeux de rôle (RPG)', group: 'RPG' },
  { id: 'action-rpg', label: 'Action-RPG', group: 'RPG' },
  { id: 'jrpg', label: 'J-RPG', group: 'RPG' },
  { id: 'tactical-rpg', label: 'Tactical RPG', group: 'RPG' },
  { id: 'dungeon-crawler', label: 'Dungeon crawler', group: 'RPG' },
  { id: 'mmorpg', label: 'MMORPG', group: 'RPG' },
  // Stratégie
  { id: 'strategy', label: 'Stratégie', group: 'Stratégie' },
  { id: 'rts', label: 'Stratégie temps réel', group: 'Stratégie' },
  { id: 'turn-based-strategy', label: 'Stratégie tour par tour', group: 'Stratégie' },
  { id: 'tactical', label: 'Tactique', group: 'Stratégie' },
  { id: '4x', label: '4X / Grande stratégie', group: 'Stratégie' },
  { id: 'tower-defense', label: 'Tower defense', group: 'Stratégie' },
  { id: 'moba', label: 'MOBA', group: 'Stratégie' },
  // Simulation
  { id: 'simulation', label: 'Simulation', group: 'Simulation' },
  { id: 'life-sim', label: 'Simulation de vie', group: 'Simulation' },
  { id: 'management', label: 'Gestion', group: 'Simulation' },
  { id: 'city-builder', label: 'Construction / bâtisseur', group: 'Simulation' },
  { id: 'vehicle-sim', label: 'Simulation de véhicule', group: 'Simulation' },
  { id: 'sandbox', label: 'Bac à sable', group: 'Simulation' },
  { id: 'survival', label: 'Survie', group: 'Simulation' },
  // Sport & course
  { id: 'sport', label: 'Sport', group: 'Sport & course' },
  { id: 'racing', label: 'Course', group: 'Sport & course' },
  { id: 'kart-racing', label: 'Course arcade / kart', group: 'Sport & course' },
  { id: 'extreme-sport', label: 'Sports extrêmes', group: 'Sport & course' },
  // Convivial
  { id: 'duo', label: 'Duo', group: 'Convivial' },
  { id: 'quiz', label: 'Quiz', group: 'Convivial' },
  { id: 'party-game', label: 'Party game', group: 'Convivial' },
  { id: 'board-card', label: 'Cartes / société', group: 'Convivial' },
  // Autres
  { id: 'rhythm', label: 'Musical / Rythme', group: 'Autres' },
  { id: 'arcade', label: 'Arcade', group: 'Autres' },
  { id: 'pinball', label: 'Flipper', group: 'Autres' },
  { id: 'fitness', label: 'Fitness / Santé', group: 'Autres' },
  { id: 'educational', label: 'Éducatif', group: 'Autres' },
  { id: 'compilation', label: 'Compilation', group: 'Autres' },
]

export const GENRE_LABELS: Record<string, string> = Object.fromEntries(
  GENRES.map((g) => [g.id, g.label]),
)

export const GENRE_OPTIONS = GENRES.map((g) => g.id)

export function genreLabel(id: string): string {
  return GENRE_LABELS[id] ?? id
}
