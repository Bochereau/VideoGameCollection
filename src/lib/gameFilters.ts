import type {
  ConditionFilter,
  EditionFilter,
  FavoriteFilter,
  FormatFilter,
  Game,
  GenreFilter,
  SortKey,
  StatusFilter,
} from '@/types'
import { UNCLASSIFIED_GENRE } from '@/types'

/**
 * Un seul comparateur réutilisé : `localeCompare(…, 'fr', options)` reconstruit
 * ses règles de tri à chaque appel, ce qui coûte cher sur des milliers de jeux.
 */
const nameCollator = new Intl.Collator('fr', { sensitivity: 'base' })

export function compareNames(a: Game, b: Game): number {
  return nameCollator.compare(a.name, b.name)
}

export function sortGames(list: Game[], sort: SortKey): Game[] {
  const copy = [...list]
  if (sort === 'rating') {
    // Meilleure note d'abord, jeux non notés en fin de liste
    copy.sort((a, b) => {
      const ra = a.rating
      const rb = b.rating
      if (ra != null && rb != null && rb !== ra) return rb - ra
      if (ra == null && rb != null) return 1
      if (rb == null && ra != null) return -1
      return compareNames(a, b)
    })
  } else if (sort === 'priority') {
    copy.sort((a, b) => {
      const pa = a.priority ?? 0
      const pb = b.priority ?? 0
      if (pb !== pa) return pb - pa
      return compareNames(a, b)
    })
  } else if (sort === 'year') {
    copy.sort((a, b) => {
      const ya = a.release
      const yb = b.release
      if (ya == null && yb == null) return compareNames(a, b)
      if (ya == null) return 1
      if (yb == null) return -1
      if (yb !== ya) return yb - ya
      return compareNames(a, b)
    })
  } else {
    copy.sort(compareNames)
  }
  return copy
}

const FORMATS = new Set<string>(['physical', 'digital'])
const CONDITIONS = new Set<string>(['complete', 'box', 'manual', 'loose', 'none'])
const EDITIONS = new Set<string>(['standard', 'steelbook', 'special', 'deluxe', 'collector'])

export type GameFilters = {
  wishlist: boolean
  hardware?: string
  q: string
  status: StatusFilter
  favorite: FavoriteFilter
  format: FormatFilter
  condition: ConditionFilter
  edition: EditionFilter
  genre: GenreFilter
}

/**
 * Filtrage en mémoire : la page charge toute la collection une fois, puis
 * chaque changement de filtre est instantané (plus d'aller-retour serveur).
 * Reprend les règles de GET /api/games sur les jeux déjà normalisés par
 * serializeGame (statut, état, édition hérités déjà résolus).
 */
export function filterGames(games: Game[], f: GameFilters): Game[] {
  const term = f.q.trim().toLocaleLowerCase('fr')
  const genres =
    f.genre !== 'all'
      ? new Set(
          f.genre
            .split(',')
            .map((g) => g.trim())
            .filter(Boolean),
        )
      : null
  const wantsUnclassified = genres?.has(UNCLASSIFIED_GENRE) ?? false
  // Valeurs d'URL inconnues ignorées, comme le faisait l'API
  const format = FORMATS.has(f.format) ? f.format : null
  const condition =
    !f.wishlist && f.format !== 'digital' && CONDITIONS.has(f.condition)
      ? f.condition
      : null
  const edition = EDITIONS.has(f.edition) ? f.edition : null

  return games.filter((game) => {
    // Un jeu déplacé collection ↔ liste d'envies disparaît de la page courante
    if (game.wishlist !== f.wishlist) return false
    if (f.hardware && game.hardware !== f.hardware) return false
    if (!f.wishlist && f.status !== 'all' && game.status !== f.status) {
      return false
    }
    if (!f.wishlist && f.favorite === 'yes' && !game.favorite) return false
    if (format && game.format !== format) return false
    if (condition && game.condition !== condition) return false
    if (edition && game.edition !== edition) return false
    if (genres && genres.size > 0) {
      const match =
        (wantsUnclassified && game.genres.length === 0) ||
        game.genres.some((g) => genres.has(g))
      if (!match) return false
    }
    if (term) {
      const haystack = [game.name, game.developer, game.editor, game.hardware]
      if (
        !haystack.some((value) =>
          (value ?? '').toLocaleLowerCase('fr').includes(term),
        )
      ) {
        return false
      }
    }
    return true
  })
}
