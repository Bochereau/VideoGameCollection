import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SharedGameCard } from '@/components/games/SharedGameCard'
import { SegmentHeading, groupGamesByPriority, groupGamesByYear } from '@/components/games/priorityGroups'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loading } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { wishlistShareApi } from '@/lib/api'
import { applyColorTheme, readColorTheme, writeColorTheme } from '@/lib/colorTheme'
import { readGameColumns } from '@/lib/columnsPerRow'
import type { Game, PublicWishlistGame, SortKey } from '@/types'
import type { ColorTheme } from '@/types/theme'

function toGame(game: PublicWishlistGame): Game {
  return {
    ...game,
    status: 'todo',
    wishlist: true,
    favorite: false,
    condition: 'none',
  }
}

function sortGames(list: Game[], sort: SortKey): Game[] {
  const copy = [...list]
  if (sort === 'year') {
    copy.sort((a, b) => {
      if (a.release == null && b.release == null) {
        return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
      }
      if (a.release == null) return 1
      if (b.release == null) return -1
      if (b.release !== a.release) return b.release - a.release
      return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
    })
  } else if (sort === 'name') {
    copy.sort((a, b) =>
      a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }),
    )
  } else {
    copy.sort((a, b) => {
      const pa = a.priority ?? 0
      const pb = b.priority ?? 0
      if (pb !== pa) return pb - pa
      return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
    })
  }
  return copy
}

export function SharedWishlistPage() {
  const { token = '' } = useParams()
  const [games, setGames] = useState<Game[]>([])
  const [ownerName, setOwnerName] = useState('')
  const [loading, setLoading] = useState(Boolean(token))
  const [missing, setMissing] = useState(!token)
  const [error, setError] = useState<string | null>(null)
  const [hardware, setHardware] = useState('all')
  const [sort, setSort] = useState<SortKey>('priority')
  const [theme, setTheme] = useState<ColorTheme>(readColorTheme)
  const [reloadKey, setReloadKey] = useState(0)
  const columnsPerRow = readGameColumns()

  useEffect(() => {
    applyColorTheme(theme)
  }, [theme])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setMissing(false)
      setError(null)
      try {
        const data = await wishlistShareApi.public(token)
        if (cancelled) return
        setOwnerName(data.ownerName.trim())
        setGames(data.games.map(toGame))
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : ''
        if (
          message === 'Lien introuvable' ||
          message.includes('404')
        ) {
          setMissing(true)
        } else if (message === 'Failed to fetch') {
          setError('Impossible de joindre le serveur.')
        } else {
          setError(message || 'Erreur de chargement')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (!token) return
    void load()
    return () => {
      cancelled = true
    }
  }, [token, reloadKey])

  const title = ownerName
    ? `Liste d’envies de ${ownerName}`
    : 'Liste d’envies'

  useEffect(() => {
    const previous = document.title
    document.title = missing ? 'Lien introuvable — VGC' : `${title} — VGC`
    return () => {
      document.title = previous
    }
  }, [missing, title])

  const consoles = useMemo(() => {
    const names = new Set(games.map((game) => game.hardware).filter(Boolean))
    return [...names].sort((a, b) =>
      a.localeCompare(b, 'fr', { sensitivity: 'base' }),
    )
  }, [games])

  const visible = useMemo(() => {
    const filtered =
      hardware === 'all'
        ? games
        : games.filter((game) => game.hardware === hardware)
    return sortGames(filtered, sort)
  }, [games, hardware, sort])

  const segments =
    sort === 'priority'
      ? groupGamesByPriority(visible)
      : sort === 'year'
        ? groupGamesByYear(visible)
        : null

  function toggleTheme() {
    const next: ColorTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    writeColorTheme(next)
    applyColorTheme(next)
  }

  let cardIndex = 0

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="font-display shrink-0 text-2xl tracking-wide text-amber">
            VGC
          </Link>
          <p className="truncate text-sm text-ink-muted">Liste partagée</p>
          <Button
            variant="ghost"
            className="ml-auto !px-2"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Thème clair' : 'Thème nuit'}
          >
            {theme === 'dark' ? 'Clair' : 'Nuit'}
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <Loading />
        ) : missing ? (
          <EmptyState
            title="Lien introuvable"
            description="Ce partage n’existe pas, ou il a été désactivé."
          />
        ) : error ? (
          <EmptyState
            title="Impossible de charger la liste"
            description={error}
            action={
              <Button onClick={() => setReloadKey((value) => value + 1)}>
                Réessayer
              </Button>
            }
          />
        ) : (
          <>
            <div className="animate-fade-up flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <h1 className="font-display text-4xl tracking-wide text-ink sm:text-5xl">
                {title}
              </h1>
              <p className="rounded-lg border border-line bg-bg px-2.5 py-1 text-sm text-ink shadow-sm">
                <span className="font-medium tabular-nums">{visible.length}</span>
                {visible.length === 1 ? ' jeu' : ' jeux'}
              </p>
            </div>

            {games.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="Liste d’envies vide"
                  description="Aucun jeu n’est dans cette liste pour le moment."
                />
              </div>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <label>
                    <span className="sr-only">Console</span>
                    <select
                      className="field !w-auto !py-1.5 !pr-8 text-sm"
                      value={hardware}
                      onChange={(event) => setHardware(event.target.value)}
                    >
                      <option value="all">Console : toutes</option>
                      {consoles.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">Tri</span>
                    <select
                      className="field !w-auto !py-1.5 !pr-8 text-sm"
                      value={sort}
                      onChange={(event) => setSort(event.target.value as SortKey)}
                    >
                      <option value="priority">Tri : Priorité</option>
                      <option value="name">Tri : A→Z</option>
                      <option value="year">Tri : Année</option>
                    </select>
                  </label>
                </div>

                <div className="mt-6">
                  {visible.length === 0 ? (
                    <EmptyState
                      title="Aucun jeu"
                      description="Aucun jeu ne correspond à cette console."
                    />
                  ) : segments ? (
                    <div className="space-y-6">
                      {segments.map((segment) => (
                        <section key={segment.key} className="space-y-3">
                          <SegmentHeading
                            label={segment.label}
                            count={segment.games.length}
                            accentClass={segment.accentClass}
                            dotClass={segment.dotClass}
                          />
                          <div
                            className="game-card-grid"
                            style={{ '--game-cols': columnsPerRow } as CSSProperties}
                          >
                            {segment.games.map((game) => {
                              const index = cardIndex++
                              return (
                                <SharedGameCard
                                  key={game.id}
                                  game={game}
                                  index={index}
                                />
                              )
                            })}
                          </div>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="game-card-grid"
                      style={{ '--game-cols': columnsPerRow } as CSSProperties}
                    >
                      {visible.map((game, index) => (
                        <SharedGameCard key={game.id} game={game} index={index} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
