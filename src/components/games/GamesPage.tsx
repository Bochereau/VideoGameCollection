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
  FinishedFilter,
  FormatFilter,
  Game,
  GameInput,
} from '@/types'
import { CONDITION_LABELS, EDITION_LABELS } from '@/types'

type Props = {
  wishlist: boolean
  title: string
  subtitle: string
  emptyTitle: string
  emptyDescription: string
  addLabel: string
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
  const finishedFilter = (searchParams.get('status') as FinishedFilter) || 'all'
  const formatFilter = (searchParams.get('format') as FormatFilter) || 'all'
  const conditionFilter =
    (searchParams.get('condition') as ConditionFilter) || 'all'
  const editionFilter = (searchParams.get('edition') as EditionFilter) || 'all'

  const query = useMemo(() => {
    const base: {
      wishlist: boolean
      hardware?: string
      finished?: boolean
      q?: string
      format?: 'physical' | 'digital'
      condition?: 'complete' | 'box' | 'manual' | 'loose' | 'none'
      edition?: 'standard' | 'special' | 'collector' | 'steelbook' | 'deluxe'
    } = { wishlist }
    if (hardware) base.hardware = hardware
    if (q) base.q = q
    if (finishedFilter === 'finished') base.finished = true
    if (finishedFilter === 'todo') base.finished = false
    if (formatFilter === 'physical' || formatFilter === 'digital') {
      base.format = formatFilter
    }
    if (
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
    finishedFilter,
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

  function patchParams(mutate: (next: URLSearchParams) => void) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      mutate(next)
      return next
    })
  }

  function setStatus(value: FinishedFilter) {
    patchParams((next) => {
      if (value === 'all') next.delete('status')
      else next.set('status', value)
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

  async function withToken<T>(fn: (token: string) => Promise<T>) {
    const token = await getToken()
    if (!token) throw new Error('Non authentifié')
    return fn(token)
  }

  async function handleSubmit(data: GameInput) {
    // Wishlist page always creates envies; collection page respects the form checkbox
    const asWishlist = wishlist ? true : Boolean(data.wishlist)
    await withToken(async (token) => {
      if (editing) {
        await gamesApi.update(token, editing.id, {
          ...data,
          wishlist: Boolean(data.wishlist),
        })
      } else {
        await gamesApi.create(token, { ...data, wishlist: asWishlist })
      }
    })
    await load()
    await refreshConsoles()
  }

  async function toggleFinished(game: Game) {
    await withToken((token) =>
      gamesApi.update(token, game.id, { finished: !game.finished }),
    )
    await load()
  }

  async function addToCollection(game: Game) {
    try {
      await withToken((token) =>
        gamesApi.update(token, game.id, { wishlist: false }),
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
                  {games.length}
                </span>
                {games.length === 1 ? ' jeu' : ' jeux'}
                {hardware ? (
                  <>
                    {' '}
                    · <span className="text-ink">{hardware}</span>
                  </>
                ) : null}
                {finishedFilter === 'finished' ? ' · Terminés' : null}
                {finishedFilter === 'todo' ? ' · À faire' : null}
                {formatFilter === 'physical' ? ' · Physique' : null}
                {formatFilter === 'digital' ? ' · Numérique' : null}
                {conditionFilter !== 'all'
                  ? ` · ${CONDITION_LABELS[conditionFilter]}`
                  : null}
                {editionFilter !== 'all'
                  ? ` · ${EDITION_LABELS[editionFilter]}`
                  : null}
              </p>
            ) : null}
          </div>
        </div>

        <StatusFilters
          status={finishedFilter}
          onStatusChange={setStatus}
          format={formatFilter}
          onFormatChange={setFormat}
          condition={conditionFilter}
          onConditionChange={setCondition}
          edition={editionFilter}
          onEditionChange={setEdition}
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
              games={games}
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
              onToggleFinished={toggleFinished}
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
