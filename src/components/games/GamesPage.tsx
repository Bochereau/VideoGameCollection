import { useAuth } from '@clerk/clerk-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { GameFormModal } from '@/components/games/GameFormModal'
import { GameGrid } from '@/components/games/GameGrid'
import { StatusFilters } from '@/components/games/StatusFilters'
import { Loading } from '@/components/ui/Loading'
import { gamesApi, consolesApi } from '@/lib/api'
import type { FinishedFilter, Game, GameInput } from '@/types'

type OutletCtx = { refreshConsoles: () => Promise<void> }

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
  const { refreshConsoles } = useOutletContext<OutletCtx>()
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

  const query = useMemo(() => {
    const base: {
      wishlist: boolean
      hardware?: string
      finished?: boolean
      q?: string
    } = { wishlist }
    if (hardware) base.hardware = hardware
    if (q) base.q = q
    if (finishedFilter === 'finished') base.finished = true
    if (finishedFilter === 'todo') base.finished = false
    return base
  }, [wishlist, hardware, q, finishedFilter])

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

  function setStatus(value: FinishedFilter) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === 'all') next.delete('status')
      else next.set('status', value)
      return next
    })
  }

  async function withToken<T>(fn: (token: string) => Promise<T>) {
    const token = await getToken()
    if (!token) throw new Error('Non authentifié')
    return fn(token)
  }

  async function handleSubmit(data: GameInput) {
    await withToken(async (token) => {
      if (editing) {
        await gamesApi.update(token, editing.id, data)
      } else {
        await gamesApi.create(token, { ...data, wishlist })
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
        <div className="animate-fade-up">
          <h1 className="font-display text-4xl tracking-wide text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-1 text-ink-muted">{subtitle}</p>
        </div>

        <StatusFilters
          value={finishedFilter}
          onChange={setStatus}
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
