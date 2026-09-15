import { useAuth } from '@clerk/clerk-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import type { AppOutletContext } from '@/components/layout/AppLayout'
import { GameFormModal } from '@/components/games/GameFormModal'
import { GameGrid } from '@/components/games/GameGrid'
import { StatusFilters } from '@/components/games/StatusFilters'
import { Loading } from '@/components/ui/Loading'
import { gamesApi, consolesApi } from '@/lib/api'
import type {
  ConditionFilter,
  EditionFilter,
  FavoriteFilter,
  FormatFilter,
  Game,
  GameInput,
  GamePriority,
  GameStatus,
  SortKey,
  StatusFilter,
} from '@/types'
import { CONDITION_LABELS, EDITION_LABELS, STATUS_LABELS } from '@/types'

type Props = {
  wishlist: boolean
  title: string
  subtitle: string
  emptyTitle: string
  emptyDescription: string
  addLabel: string
}

function sortGames(list: Game[], sort: SortKey): Game[] {
  const copy = [...list]
  if (sort === 'priority') {
    copy.sort((a, b) => {
      const pa = a.priority ?? 0
      const pb = b.priority ?? 0
      if (pb !== pa) return pb - pa
      return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
    })
  } else {
    copy.sort((a, b) =>
      a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }),
    )
  }
  return copy
}

export function GamesPage({
  wishlist,
  title,
  subtitle,
  emptyTitle,
  emptyDescription,
  addLabel,
}: Props) {
  const { getToken } = useAuth()
  const { refreshConsoles, viewMode } = useOutletContext<AppOutletContext>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [games, setGames] = useState<Game[]>([])
  const [consoleNames, setConsoleNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Game | null>(null)

  const q = searchParams.get('q') ?? ''
  const hardware = searchParams.get('hardware') ?? undefined
  const rawStatus = searchParams.get('status')
  const statusFilter: StatusFilter =
    rawStatus === 'todo' ||
    rawStatus === 'playing' ||
    rawStatus === 'finished' ||
    rawStatus === 'abandoned'
      ? rawStatus
      : 'all'
  const formatFilter = (searchParams.get('format') as FormatFilter) || 'all'
  const conditionFilter =
    (searchParams.get('condition') as ConditionFilter) || 'all'
  const editionFilter = (searchParams.get('edition') as EditionFilter) || 'all'
  const favoriteParam = searchParams.get('favorite')
  const favoriteFilter: FavoriteFilter =
    favoriteParam === 'yes' || favoriteParam === 'true' ? 'yes' : 'all'
  const sortParam = searchParams.get('sort')
  const sortKey: SortKey = sortParam === 'priority' ? 'priority' : 'name'

  const showSort = wishlist || statusFilter === 'todo'

  const query = useMemo(() => {
    const base: {
      wishlist: boolean
      hardware?: string
      status?: GameStatus
      favorite?: boolean
      q?: string
      format?: 'physical' | 'digital'
      condition?: 'complete' | 'box' | 'manual' | 'loose' | 'none'
      edition?: 'standard' | 'special' | 'collector' | 'steelbook' | 'deluxe'
    } = { wishlist }
    if (hardware) base.hardware = hardware
    if (q) base.q = q
    if (!wishlist && statusFilter !== 'all') base.status = statusFilter
    if (!wishlist && favoriteFilter === 'yes') base.favorite = true
    if (formatFilter === 'physical' || formatFilter === 'digital') {
      base.format = formatFilter
    }
    if (
      !wishlist &&
      conditionFilter !== 'all' &&
      formatFilter !== 'digital' &&
      (conditionFilter === 'complete' ||
        conditionFilter === 'box' ||
        conditionFilter === 'manual' ||
        conditionFilter === 'loose' ||
        conditionFilter === 'none')
    ) {
      base.condition = conditionFilter
    }
    if (
      editionFilter === 'standard' ||
      editionFilter === 'special' ||
      editionFilter === 'collector' ||
      editionFilter === 'steelbook' ||
      editionFilter === 'deluxe'
    ) {
      base.edition = editionFilter
    }
    return base
  }, [
    wishlist,
    hardware,
    q,
    statusFilter,
    favoriteFilter,
    formatFilter,
    conditionFilter,
    editionFilter,
  ])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) return
      const [list, consoles] = await Promise.all([
        gamesApi.list(token, query),
        consolesApi.list(token),
      ])
      setGames(list)
      setConsoleNames(consoles.map((c) => c.name))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [getToken, query])

  useEffect(() => {
    void load()
  }, [load])

  const displayedGames = useMemo(
    () => sortGames(games, showSort ? sortKey : 'name'),
    [games, showSort, sortKey],
  )

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
      if (value !== 'todo') next.delete('sort')
    })
  }

  function setSort(value: SortKey) {
    patchParams((next) => {
      if (value === 'name') next.delete('sort')
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
    await withToken(async (token) => {
      if (editing) {
        await gamesApi.update(token, editing.id, payload)
      } else {
        await gamesApi.create(token, payload)
      }
    })
    await load()
    await refreshConsoles()
  }

  async function updateStatus(game: Game, status: GameStatus) {
    await withToken((token) =>
      gamesApi.update(token, game.id, {
        status,
        favorite: status === 'finished' ? game.favorite : false,
        priority: status === 'todo' ? (game.priority ?? 3) : null,
      }),
    )
    await load()
  }

  async function updatePriority(game: Game, priority: GamePriority) {
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, priority } : g)),
    )
    try {
      await withToken((token) =>
        gamesApi.update(token, game.id, { priority }),
      )
    } catch (err) {
      setGames((prev) =>
        prev.map((g) =>
          g.id === game.id ? { ...g, priority: game.priority } : g,
        ),
      )
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de mettre à jour la priorité',
      )
    }
  }

  async function toggleFavorite(game: Game) {
    if (game.status !== 'finished') return
    const next = !game.favorite
    setGames((prev) => {
      const updated = prev.map((g) =>
        g.id === game.id ? { ...g, favorite: next } : g,
      )
      if (favoriteFilter === 'yes' && !next) {
        return updated.filter((g) => g.id !== game.id)
      }
      return updated
    })
    try {
      await withToken((token) =>
        gamesApi.update(token, game.id, { favorite: next }),
      )
    } catch (err) {
      setGames((prev) => {
        const restored = prev.some((g) => g.id === game.id)
          ? prev.map((g) =>
              g.id === game.id
                ? { ...g, favorite: Boolean(game.favorite) }
                : g,
            )
          : [...prev, game].sort((a, b) =>
              a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }),
            )
        return restored
      })
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de mettre à jour le coup de cœur',
      )
    }
  }

  async function addToCollection(game: Game) {
    try {
      await withToken((token) =>
        gamesApi.update(token, game.id, {
          wishlist: false,
          status: 'todo',
          priority: null,
          favorite: false,
        }),
      )
      await load()
      await refreshConsoles()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible d’ajouter à la collection',
      )
    }
  }

  async function removeGame(game: Game) {
    if (!window.confirm(`Supprimer « ${game.name} » ?`)) return
    try {
      await withToken((token) => gamesApi.remove(token, game.id))
      await load()
      await refreshConsoles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible')
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-6 px-4 pt-6 pb-4 sm:px-6 lg:px-8">
        <div className="animate-fade-up flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-4xl tracking-wide text-ink sm:text-5xl">
            {title}
          </h1>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-ink-muted">
            <p>{subtitle}</p>
            {!loading ? (
              <p className="rounded-lg border border-ink-muted/30 bg-ink-muted/10 px-2 py-1 text-sm text-ink">
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
                {showSort && sortKey === 'priority' ? ' · Priorité' : null}
              </p>
            ) : null}
          </div>
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
          favorite={favoriteFilter}
          onFavoriteChange={setFavorite}
          showSort={showSort}
          sort={sortKey}
          onSortChange={setSort}
          onAdd={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          addLabel={addLabel}
        />

        {error ? (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="px-4 pb-6 sm:px-6 lg:px-8">
          {loading ? (
            <Loading />
          ) : (
            <GameGrid
              games={displayedGames}
              viewMode={viewMode}
              wishlist={wishlist}
              emptyTitle={emptyTitle}
              emptyDescription={emptyDescription}
              onAdd={() => {
                setEditing(null)
                setModalOpen(true)
              }}
              onEdit={(game) => {
                setEditing(game)
                setModalOpen(true)
              }}
              onStatusChange={updateStatus}
              onPriorityChange={updatePriority}
              onToggleFavorite={toggleFavorite}
              onAddToCollection={addToCollection}
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
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
