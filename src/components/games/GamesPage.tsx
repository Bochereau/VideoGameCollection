import { useAuth } from '@clerk/clerk-react'
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import type { AppOutletContext } from '@/components/layout/AppLayout'
import { GameFormModal } from '@/components/games/GameFormModal'
import { ShareWishlistModal } from '@/components/games/ShareWishlistModal'
import { GameGrid } from '@/components/games/GameGrid'
import { StatusFilters } from '@/components/games/StatusFilters'
import { AddToCollectionModal } from '@/components/games/AddToCollectionModal'
import { Loading } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { gamesApi, consolesApi, wishlistClaimApi } from '@/lib/api'
import { consoleColorMap } from '@/lib/consoleColor'
import { filterGames, sortGames } from '@/lib/gameFilters'
import { useStableCallback } from '@/lib/useStableCallback'
import type {
  ConditionFilter,
  EditionFilter,
  FavoriteFilter,
  FormatFilter,
  GenreFilter,
  Game,
  GameInput,
  GamePriority,
  GameStatus,
  GroupBy,
  SortKey,
  StatusFilter,
} from '@/types'
import {
  CONDITION_LABELS,
  EDITION_LABELS,
  genreLabel,
  STATUS_LABELS,
  UNCLASSIFIED_GENRE,
} from '@/types'

type Props = {
  wishlist: boolean
  title: string
  emptyTitle: string
  emptyDescription: string
  addLabel: string
}

export function GamesPage({
  wishlist,
  title,
  emptyTitle,
  emptyDescription,
  addLabel,
}: Props) {
  const { getToken } = useAuth()
  const {
    refreshConsoles,
    consoles,
    openConsoleManager,
    viewMode,
    columnsPerRow,
    collectionVersion,
    refreshReservations,
  } = useOutletContext<AppOutletContext>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [games, setGames] = useState<Game[]>([])
  const [consoleNames, setConsoleNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Game | null>(null)
  const [addingGame, setAddingGame] = useState<Game | null>(null)
  const [addingBusy, setAddingBusy] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const q = searchParams.get('q') ?? ''
  const hardware = searchParams.get('hardware') ?? undefined
  const rawStatus = searchParams.get('status')
  const statusFilter: StatusFilter =
    rawStatus === 'todo' ||
    rawStatus === 'playing' ||
    rawStatus === 'paused' ||
    rawStatus === 'finished' ||
    rawStatus === 'abandoned'
      ? rawStatus
      : 'all'
  const formatFilter = (searchParams.get('format') as FormatFilter) || 'all'
  const conditionFilter =
    (searchParams.get('condition') as ConditionFilter) || 'all'
  const editionFilter = (searchParams.get('edition') as EditionFilter) || 'all'
  const genreFilter: GenreFilter = searchParams.get('genre') || 'all'
  const favoriteParam = searchParams.get('favorite')
  const favoriteFilter: FavoriteFilter =
    favoriteParam === 'yes' || favoriteParam === 'true' ? 'yes' : 'all'
  const sortParam = searchParams.get('sort')
  const showPrioritySort = wishlist || statusFilter === 'todo'
  const sortKey: SortKey =
    sortParam === 'year'
      ? 'year'
      : sortParam === 'rating' && !wishlist
        ? 'rating'
      : sortParam === 'priority' && showPrioritySort
        ? 'priority'
        : sortParam === 'name'
          ? 'name'
          : wishlist && showPrioritySort
            ? 'priority'
            : 'name'

  const groupBy: GroupBy =
    sortKey === 'priority'
      ? 'priority'
      : sortKey === 'year'
        ? 'year'
        : sortKey === 'rating'
          ? 'rating'
          : 'none'

  const filters = useMemo(
    () => ({
      wishlist,
      hardware,
      q,
      status: statusFilter,
      favorite: favoriteFilter,
      format: formatFilter,
      condition: conditionFilter,
      edition: editionFilter,
      genre: genreFilter,
    }),
    [
      wishlist,
      hardware,
      q,
      statusFilter,
      favoriteFilter,
      formatFilter,
      conditionFilter,
      editionFilter,
      genreFilter,
    ],
  )

  // Ignore les réponses d'un chargement dépassé par un plus récent
  const requestRef = useRef(0)

  /**
   * Charge toute la collection (ou la liste d'envies) ; les filtres sont
   * appliqués en mémoire. Seul le premier chargement affiche le spinner :
   * les rechargements suivants remplacent la liste sans démonter la grille.
   */
  const load = useCallback(async () => {
    const requestId = ++requestRef.current
    setError(null)
    try {
      const token = await getToken()
      if (!token) return
      const [list, consoles] = await Promise.all([
        gamesApi.list(token, { wishlist }),
        consolesApi.list(token),
      ])
      if (requestId !== requestRef.current) return
      setGames(list)
      setConsoleNames(consoles.map((c) => c.name))
    } catch (err) {
      if (requestId !== requestRef.current) return
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }, [getToken, wishlist, collectionVersion])

  useEffect(() => {
    void load()
  }, [load])

  const displayedGames = useMemo(
    () => sortGames(filterGames(games, filters), sortKey),
    [games, filters, sortKey],
  )
  // La grille suit avec un léger différé : la saisie et les filtres restent
  // réactifs. Liste et regroupement sont différés ensemble pour rester cohérents.
  const gridView = useMemo(
    () => ({ games: displayedGames, groupBy }),
    [displayedGames, groupBy],
  )
  const deferredGrid = useDeferredValue(gridView)

  // Recalcule les couleurs seulement si elles changent vraiment : un simple
  // rafraîchissement des consoles (compteurs) ne doit pas redessiner les cartes
  const consoleColorsKey = consoles
    .map((c) => `${c.name}\u0000${c.color ?? ''}\u0000${c.textColor ?? ''}`)
    .join('\u0001')
  const consoleColors = useMemo(
    () => consoleColorMap(consoles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [consoleColorsKey],
  )
  const listScroll = viewMode === 'list' && !loading && displayedGames.length > 0

  function patchParams(mutate: (next: URLSearchParams) => void) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      mutate(next)
      return next
    })
  }

  function setStatus(value: StatusFilter) {
    patchParams((next) => {
      if (value === 'all') next.delete('status')
      else next.set('status', value)
      // Priority sort only applies to wishlist / todo — fall back otherwise
      if (value !== 'todo' && !wishlist && next.get('sort') === 'priority') {
        next.delete('sort')
      }
    })
  }

  function setSort(value: SortKey) {
    patchParams((next) => {
      // Wishlist defaults to priority when sort is absent — keep name explicit
      if (value === 'name' && !wishlist) next.delete('sort')
      else next.set('sort', value)
    })
  }

  function setFormat(value: FormatFilter) {
    patchParams((next) => {
      if (value === 'all') next.delete('format')
      else next.set('format', value)
      if (value === 'digital') next.delete('condition')
    })
  }

  function setCondition(value: ConditionFilter) {
    patchParams((next) => {
      if (value === 'all') next.delete('condition')
      else next.set('condition', value)
    })
  }

  function setEdition(value: EditionFilter) {
    patchParams((next) => {
      if (value === 'all') next.delete('edition')
      else next.set('edition', value)
    })
  }

  function setGenre(value: GenreFilter) {
    patchParams((next) => {
      if (value === 'all') next.delete('genre')
      else next.set('genre', value)
    })
  }

  function setHardware(name: string | null) {
    patchParams((next) => {
      if (name) next.set('hardware', name)
      else next.delete('hardware')
    })
  }

  function resetFilters() {
    patchParams((next) => {
      next.delete('status')
      next.delete('format')
      next.delete('condition')
      next.delete('edition')
      next.delete('genre')
      next.delete('favorite')
      next.delete('sort')
      next.delete('hardware')
    })
  }

  function setFavorite(value: FavoriteFilter) {
    patchParams((next) => {
      if (value === 'all') next.delete('favorite')
      else next.set('favorite', 'yes')
    })
  }

  async function withToken<T>(fn: (token: string) => Promise<T>) {
    const token = await getToken()
    if (!token) throw new Error('Non authentifié')
    return fn(token)
  }

  async function handleSubmit(data: GameInput) {
    const asWishlist = wishlist ? true : Boolean(data.wishlist)
    const status = data.status ?? 'todo'
    const payload: GameInput = {
      ...data,
      wishlist: asWishlist,
      status: asWishlist ? data.status ?? 'todo' : status,
      favorite:
        !asWishlist && status === 'finished' ? Boolean(data.favorite) : false,
      priority:
        asWishlist || status === 'todo' ? (data.priority ?? 3) : null,
    }
    const saved = await withToken(async (token) => {
      if (editing) return gamesApi.update(token, editing.id, payload)
      return gamesApi.create(token, payload)
    })
    if (editing) {
      setGames((prev) =>
        prev.map((game) =>
          game.id === saved.id
            ? { ...saved, reserved: saved.reserved ?? game.reserved }
            : game,
        ),
      )
    } else {
      await load()
    }
    await refreshConsoles()
  }

  /** Applique un changement local à un seul jeu (les autres gardent leur identité) */
  function patchGame(id: string, patch: Partial<Game>) {
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  }

  // Gestionnaires stables : les cartes mémoïsées ne se redessinent que si
  // leur propre jeu change
  const updateStatus = useStableCallback(
    async (game: Game, status: GameStatus) => {
      const patch = {
        status,
        favorite: status === 'finished' ? game.favorite : false,
        priority:
          status === 'todo' ? (game.priority ?? 3) : null,
      } satisfies Partial<Game>
      // Mise à jour immédiate ; le filtre en mémoire masque le jeu s'il ne
      // correspond plus (ex. filtre « En cours »)
      patchGame(game.id, patch)
      try {
        await withToken((token) => gamesApi.update(token, game.id, patch))
      } catch (err) {
        patchGame(game.id, {
          status: game.status,
          favorite: game.favorite,
          priority: game.priority,
        })
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de mettre à jour l’état',
        )
      }
    },
  )

  const updatePriority = useStableCallback(
    async (game: Game, priority: GamePriority) => {
      patchGame(game.id, { priority })
      try {
        await withToken((token) =>
          gamesApi.update(token, game.id, { priority }),
        )
      } catch (err) {
        patchGame(game.id, { priority: game.priority })
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de mettre à jour la priorité',
        )
      }
    },
  )

  const updateRating = useStableCallback(
    async (game: Game, rating: number | null) => {
      patchGame(game.id, { rating })
      try {
        await withToken((token) => gamesApi.update(token, game.id, { rating }))
      } catch (err) {
        patchGame(game.id, { rating: game.rating })
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de mettre à jour la note',
        )
      }
    },
  )

  const toggleFavorite = useStableCallback(async (game: Game) => {
    if (game.status !== 'finished') return
    const next = !game.favorite
    // Avec le filtre « Coups de cœur », le jeu disparaît via le filtre en mémoire
    patchGame(game.id, { favorite: next })
    try {
      await withToken((token) =>
        gamesApi.update(token, game.id, { favorite: next }),
      )
    } catch (err) {
      patchGame(game.id, { favorite: Boolean(game.favorite) })
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de mettre à jour le coup de cœur',
      )
    }
  })

  const addToCollection = useStableCallback((game: Game) => {
    setAddingGame(game)
  })

  const releaseReservation = useStableCallback(async (game: Game) => {
    if (!window.confirm(`Libérer « ${game.name} » ? Le jeu redevient disponible.`)) {
      return
    }
    setError(null)
    try {
      await withToken((token) => wishlistClaimApi.release(token, game.id))
      patchGame(game.id, { reserved: false })
      await refreshReservations()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Impossible de libérer la réservation',
      )
    }
  })

  async function confirmAddToCollection(priority: GamePriority) {
    if (!addingGame) return
    setAddingBusy(true)
    setError(null)
    try {
      await withToken((token) =>
        gamesApi.update(token, addingGame.id, {
          wishlist: false,
          status: 'todo',
          priority,
          favorite: false,
        }),
      )
      // Le jeu quitte la liste d'envies : on le retire sans tout recharger
      const movedId = addingGame.id
      setGames((prev) => prev.filter((g) => g.id !== movedId))
      setAddingGame(null)
      await refreshConsoles()
      await refreshReservations()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible d’ajouter à la collection',
      )
    } finally {
      setAddingBusy(false)
    }
  }

  const removeGame = useStableCallback(async (game: Game) => {
    if (!window.confirm(`Supprimer « ${game.name} » ?`)) return
    try {
      await withToken((token) => gamesApi.remove(token, game.id))
      setGames((prev) => prev.filter((g) => g.id !== game.id))
      await refreshConsoles()
      if (game.reserved) await refreshReservations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible')
    }
  })

  const openCreate = useStableCallback(() => {
    setEditing(null)
    setModalOpen(true)
  })

  const openEdit = useStableCallback((game: Game) => {
    setEditing(game)
    setModalOpen(true)
  })

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="min-w-0 shrink-0 space-y-3 px-4 pt-4 pb-3 sm:space-y-6 sm:px-6 sm:pt-6 sm:pb-4 lg:px-8">
        <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display text-4xl tracking-wide text-ink sm:text-5xl">
              {title}
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-ink-muted">
            {!loading ? (
              <p className="rounded-lg border border-line bg-bg px-2.5 py-1 text-sm text-ink shadow-sm">
                <span className="font-medium text-ink tabular-nums">
                  {displayedGames.length}
                </span>
                {displayedGames.length === 1 ? ' jeu' : ' jeux'}
                {hardware ? (
                  <>
                    {' '}
                    · <span className="text-ink">{hardware}</span>
                  </>
                ) : null}
                {!wishlist && statusFilter !== 'all'
                  ? ` · ${STATUS_LABELS[statusFilter]}`
                  : null}
                {favoriteFilter === 'yes' ? ' · Coups de cœur' : null}
                {formatFilter === 'physical' ? ' · Physique' : null}
                {formatFilter === 'digital' ? ' · Numérique' : null}
                {!wishlist && conditionFilter !== 'all'
                  ? ` · ${CONDITION_LABELS[conditionFilter]}`
                  : null}
                {editionFilter !== 'all'
                  ? ` · ${EDITION_LABELS[editionFilter]}`
                  : null}
                {genreFilter !== 'all'
                  ? ` · ${genreFilter === UNCLASSIFIED_GENRE ? 'Non classé' : genreLabel(genreFilter)}`
                  : null}
                {sortKey === 'priority' ? ' · Priorité' : null}
                {sortKey === 'year' ? ' · Année' : null}
                {sortKey === 'rating' ? ' · Note' : null}
              </p>
            ) : null}
            </div>
          </div>
          {wishlist ? (
            <Button variant="secondary" onClick={() => setShareOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M9.5 14.5 14.5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  d="M10.2 7.2 12 5.4a3.6 3.6 0 0 1 5.1 5.1L15.3 12.3"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  d="M13.8 16.8 12 18.6a3.6 3.6 0 0 1-5.1-5.1L8.7 11.7"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
              Partager
            </Button>
          ) : null}
        </div>

        <StatusFilters
          wishlist={wishlist}
          status={statusFilter}
          onStatusChange={setStatus}
          format={formatFilter}
          onFormatChange={setFormat}
          condition={conditionFilter}
          onConditionChange={setCondition}
          edition={editionFilter}
          onEditionChange={setEdition}
          genre={genreFilter}
          onGenreChange={setGenre}
          favorite={favoriteFilter}
          onFavoriteChange={setFavorite}
          showPrioritySort={showPrioritySort}
          sort={sortKey}
          onSortChange={setSort}
          onAdd={openCreate}
          onReset={resetFilters}
          addLabel={addLabel}
          consoles={consoles}
          hardware={hardware ?? null}
          onHardwareChange={setHardware}
          onManageConsoles={openConsoleManager}
        />

        {error ? (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>

      {/* Vue liste : le tableau défile lui-même pour garder son en-tête visible */}
      <div
        className={`min-h-0 flex-1 ${
          listScroll ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'
        }`}
      >
        <div
          className={`px-4 pb-6 sm:px-6 lg:px-8 ${
            listScroll ? 'flex min-h-0 flex-1 flex-col' : ''
          }`}
        >
          {loading ? (
            <Loading />
          ) : (
            <GameGrid
              games={deferredGrid.games}
              viewMode={viewMode}
              columnsPerRow={columnsPerRow}
              wishlist={wishlist}
              groupBy={deferredGrid.groupBy}
              consoleColors={consoleColors}
              emptyTitle={emptyTitle}
              emptyDescription={emptyDescription}
              onAdd={openCreate}
              onEdit={openEdit}
              onStatusChange={updateStatus}
              onPriorityChange={updatePriority}
              onRatingChange={updateRating}
              onToggleFavorite={toggleFavorite}
              onAddToCollection={addToCollection}
              onReleaseReservation={releaseReservation}
              onDelete={removeGame}
            />
          )}
        </div>
      </div>

      <GameFormModal
        open={modalOpen}
        initial={editing}
        defaultWishlist={wishlist}
        consoleNames={consoleNames}
        defaultHardware={hardware}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
      />

      {wishlist ? (
        <ShareWishlistModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      ) : null}

      <AddToCollectionModal
        open={addingGame != null}
        game={addingGame}
        busy={addingBusy}
        onClose={() => {
          if (addingBusy) return
          setAddingGame(null)
        }}
        onConfirm={confirmAddToCollection}
      />
    </div>
  )
}
