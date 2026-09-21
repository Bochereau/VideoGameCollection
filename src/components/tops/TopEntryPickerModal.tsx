import { useAuth } from '@clerk/clerk-react'
import { useEffect, useMemo, useState } from 'react'
import type {
  CatalogCover,
  CatalogGame,
  ConditionFilter,
  ConsoleItem,
  EditionFilter,
  FavoriteFilter,
  FormatFilter,
  Game,
  GameStatus,
  StatusFilter,
  TopEntry,
} from '@/types'
import { CONDITION_LABELS, EDITION_LABELS, STATUS_LABELS } from '@/types'
import { catalogApi, consolesApi, gamesApi } from '@/lib/api'
import { cardCoverUrl } from '@/lib/coverUrl'
import { FavoriteButton } from '@/components/games/gameActions'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'

type Tab = 'collection' | 'catalog'

type Props = {
  open: boolean
  rank: number
  excludeGameIds?: Set<string>
  onClose: () => void
  onSelect: (entry: Omit<TopEntry, 'rank'> & { rank?: number }) => void
}

function FilterSelect({
  label,
  value,
  onChange,
  disabled,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  options: { id: string; label: string }[]
}) {
  return (
    <label className={`flex min-w-[7.5rem] items-center gap-2 ${disabled ? 'opacity-40' : ''}`}>
      <span className="sr-only">{label}</span>
      <select
        className="field !w-auto !py-1.5 !pr-8 text-sm"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function gameToEntry(game: Game): Omit<TopEntry, 'rank'> {
  return {
    gameId: game.id,
    name: game.name,
    cover: game.cover ?? null,
    release: game.release,
    igdbId: game.igdbId ?? null,
    rawgId: game.rawgId ?? null,
  }
}

function catalogToEntry(item: CatalogGame): Omit<TopEntry, 'rank'> {
  return {
    gameId: null,
    name: item.name,
    cover: item.cover ?? null,
    release: item.release,
    igdbId: item.igdbId,
  }
}

export function TopEntryPickerModal({
  open,
  rank,
  excludeGameIds,
  onClose,
  onSelect,
}: Props) {
  const { getToken } = useAuth()
  const [tab, setTab] = useState<Tab>('collection')
  const [consoles, setConsoles] = useState<ConsoleItem[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loadingGames, setLoadingGames] = useState(false)
  const [q, setQ] = useState('')
  const [hardware, setHardware] = useState<string>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [format, setFormat] = useState<FormatFilter>('all')
  const [condition, setCondition] = useState<ConditionFilter>('all')
  const [edition, setEdition] = useState<EditionFilter>('all')
  const [favorite, setFavorite] = useState<FavoriteFilter>('all')

  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogResults, setCatalogResults] = useState<CatalogGame[]>([])
  const [catalogSearching, setCatalogSearching] = useState(false)
  const [catalogBusy, setCatalogBusy] = useState(false)
  const [pickedCatalog, setPickedCatalog] = useState<CatalogGame | null>(null)
  const [coverResults, setCoverResults] = useState<CatalogCover[]>([])
  const [coverSearching, setCoverSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setTab('collection')
    setQ('')
    setHardware('all')
    setStatus('all')
    setFormat('all')
    setCondition('all')
    setEdition('all')
    setFavorite('all')
    setCatalogQuery('')
    setCatalogResults([])
    setPickedCatalog(null)
    setCoverResults([])
    setCoverSearching(false)
    setError(null)
  }, [open, rank])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    void (async () => {
      try {
        const token = await getToken()
        if (!token || cancelled) return
        const list = await consolesApi.list(token, { wishlist: false })
        if (!cancelled) setConsoles(list)
      } catch {
        if (!cancelled) setConsoles([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, getToken])

  const gamesQuery = useMemo(() => {
    return {
      wishlist: false as const,
      hardware: hardware === 'all' ? undefined : hardware,
      status: status === 'all' ? undefined : (status as GameStatus),
      favorite: favorite === 'yes' ? true : undefined,
      q: q.trim() || undefined,
      format: format === 'all' ? undefined : format,
      condition:
        format === 'digital' || condition === 'all' ? undefined : condition,
      edition: edition === 'all' ? undefined : edition,
    }
  }, [hardware, status, favorite, q, format, condition, edition])

  useEffect(() => {
    if (!open || tab !== 'collection') return
    let cancelled = false
    setLoadingGames(true)
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const token = await getToken()
          if (!token || cancelled) return
          const list = await gamesApi.list(token, gamesQuery)
          if (!cancelled) setGames(list)
        } catch (err) {
          if (!cancelled) {
            setGames([])
            setError(err instanceof Error ? err.message : 'Erreur de chargement')
          }
        } finally {
          if (!cancelled) setLoadingGames(false)
        }
      })()
    }, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [open, tab, gamesQuery, getToken])

  useEffect(() => {
    if (!open || tab !== 'catalog') return
    const query = catalogQuery.trim()
    if (query.length < 2) {
      setCatalogResults([])
      setCatalogSearching(false)
      return
    }

    let cancelled = false
    setCatalogSearching(true)
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const token = await getToken()
          if (!token || cancelled) return
          const list = await catalogApi.searchGames(
            token,
            query,
            hardware === 'all' ? undefined : hardware,
          )
          if (!cancelled) setCatalogResults(list)
        } catch {
          if (!cancelled) setCatalogResults([])
        } finally {
          if (!cancelled) setCatalogSearching(false)
        }
      })()
    }, 800)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [catalogQuery, open, tab, hardware, getToken])

  if (!open) return null

  const visibleGames = games.filter(
    (g) => !excludeGameIds?.has(g.id),
  )

  async function pickCatalog(item: CatalogGame) {
    setCatalogBusy(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Non authentifié')
      const details = await catalogApi.gameDetails(token, item.igdbId)
      const merged: CatalogGame = {
        ...item,
        ...details,
        name: item.name,
        cover: details.cover ?? item.cover,
        release: details.release ?? item.release,
        platforms:
          details.platforms?.length > 0 ? details.platforms : item.platforms,
      }
      setPickedCatalog(merged)

      setCoverSearching(true)
      const coverHardware =
        (hardware !== 'all' ? hardware : merged.platforms?.[0]) || undefined
      const data = await catalogApi.searchCovers(
        token,
        merged.name,
        coverHardware,
        merged.igdbId,
      )
      const covers = data.results ?? []
      if (merged.cover && !covers.some((c) => c.mediaUrl === merged.cover)) {
        covers.unshift({
          id: merged.igdbId,
          name: merged.name,
          system: coverHardware || '',
          region: 'Officielle',
          mediaUrl: merged.cover,
          thumb: merged.cover,
          alternatives: [],
          source: 'igdb',
        })
      }
      setCoverResults(covers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur catalogue')
    } finally {
      setCatalogBusy(false)
      setCoverSearching(false)
    }
  }

  function confirmCatalogCover(coverUrl: string | null) {
    if (!pickedCatalog) return
    onSelect(catalogToEntry({ ...pickedCatalog, cover: coverUrl }))
    onClose()
  }

  function backToCatalogSearch() {
    setPickedCatalog(null)
    setCoverResults([])
    setCoverSearching(false)
  }

  function coverCaption(item: CatalogCover) {
    const system = item.system
      ? ` · ${item.system.replace(/^(Sony|Sega|Nintendo|Microsoft|SNK|NEC) - /i, '')}`
      : ''
    if (item.source === 'libretro') return `${item.region}${system}`
    if (item.region && item.region !== 'Officielle') {
      return `${item.region} · ${item.name}${system}`
    }
    return `${item.name}${system}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div className="animate-fade-up relative z-10 flex h-[min(90dvh,40rem)] w-full max-w-2xl flex-col rounded-t-2xl border border-line bg-surface shadow-xl sm:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-xl tracking-wide text-ink">
              Place #{rank}
            </h2>
            <p className="mt-0.5 text-sm text-ink-muted">
              Choisissez un jeu de la collection ou via le catalogue.
            </p>
          </div>
          <button
            type="button"
            className="text-ink-muted hover:text-ink"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="flex shrink-0 gap-1 border-b border-line px-5 pt-3">
          {(
            [
              ['collection', 'Collection'],
              ['catalog', 'Catalogue'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id)
                setPickedCatalog(null)
                setCoverResults([])
              }}
              className={`rounded-t-lg px-3 py-2 text-sm font-medium transition ${
                tab === id
                  ? 'bg-accent-soft text-accent'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-4">
          {error ? <p className="mb-3 shrink-0 text-sm text-danger">{error}</p> : null}

          {tab === 'collection' ? (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <label className="relative min-w-[10rem] flex-1">
                  <span className="sr-only">Rechercher</span>
                  <input
                    className="field w-full !py-1.5"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher…"
                    autoFocus
                  />
                </label>
                <FilterSelect
                  label="Console"
                  value={hardware}
                  onChange={setHardware}
                  options={[
                    { id: 'all', label: 'Console : toutes' },
                    ...consoles.map((c) => ({ id: c.name, label: c.name })),
                  ]}
                />
                <FilterSelect
                  label="Statut"
                  value={status}
                  onChange={(v) => setStatus(v as StatusFilter)}
                  options={[
                    { id: 'all', label: 'Statut : tous' },
                    ...Object.entries(STATUS_LABELS).map(([id, label]) => ({
                      id,
                      label: `Statut : ${label.toLowerCase()}`,
                    })),
                  ]}
                />
                <FilterSelect
                  label="Format"
                  value={format}
                  onChange={(v) => setFormat(v as FormatFilter)}
                  options={[
                    { id: 'all', label: 'Format : tous' },
                    { id: 'physical', label: 'Physique' },
                    { id: 'digital', label: 'Numérique' },
                  ]}
                />
                <FilterSelect
                  label="État"
                  value={condition}
                  disabled={format === 'digital'}
                  onChange={(v) => setCondition(v as ConditionFilter)}
                  options={[
                    { id: 'all', label: 'État : tous' },
                    ...Object.entries(CONDITION_LABELS).map(([id, label]) => ({
                      id,
                      label,
                    })),
                  ]}
                />
                <FilterSelect
                  label="Édition"
                  value={edition}
                  onChange={(v) => setEdition(v as EditionFilter)}
                  options={[
                    { id: 'all', label: 'Édition : toutes' },
                    ...Object.entries(EDITION_LABELS).map(([id, label]) => ({
                      id,
                      label,
                    })),
                  ]}
                />
                <FavoriteButton
                  favorite={favorite === 'yes'}
                  onClick={() =>
                    setFavorite(favorite === 'yes' ? 'all' : 'yes')
                  }
                  labelOn="Tous les jeux"
                  labelOff="Coups de cœur"
                  title="Filtrer les coups de cœur"
                  className="!bg-surface/80 border border-line"
                />
              </div>

              <div className="relative min-h-0 flex-1 overflow-y-auto rounded-xl border border-line">
                {loadingGames ? (
                  <div className="flex h-full min-h-[12rem] items-center justify-center">
                    <Loading label="Chargement des jeux…" />
                  </div>
                ) : visibleGames.length === 0 ? (
                  <p className="py-8 text-center text-sm text-ink-muted">
                    Aucun jeu ne correspond aux filtres.
                  </p>
                ) : (
                  <ul className="divide-y divide-line">
                    {visibleGames.map((game) => (
                      <li key={game.id}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-accent-soft/60"
                          onClick={() => {
                            onSelect(gameToEntry(game))
                            onClose()
                          }}
                        >
                          <div className="h-12 w-9 shrink-0 overflow-hidden rounded bg-bg">
                            {game.cover ? (
                              <img
                                src={cardCoverUrl(game.cover) ?? game.cover}
                                alt=""
                                className="h-full w-full object-cover object-top"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">
                              {game.name}
                            </p>
                            <p className="truncate text-xs text-ink-muted">
                              {game.release ?? 'Année inconnue'}
                              {game.hardware ? ` · ${game.hardware}` : ''}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              {pickedCatalog ? (
                <>
                  <div className="flex shrink-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {pickedCatalog.name}
                      </p>
                      <p className="text-xs text-ink-muted">
                        Choisissez une jaquette
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="!text-xs"
                      onClick={backToCatalogSearch}
                    >
                      Retour
                    </Button>
                  </div>
                  <div className="relative min-h-0 flex-1 overflow-y-auto rounded-xl border border-line p-3">
                    {coverSearching || catalogBusy ? (
                      <div className="flex h-full min-h-[12rem] items-center justify-center">
                        <Loading label="Chargement des jaquettes…" />
                      </div>
                    ) : coverResults.length > 0 ? (
                      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {coverResults.map((item) => (
                          <li
                            key={`${item.source ?? 'igdb'}-${item.system}-${item.mediaUrl}`}
                          >
                            <button
                              type="button"
                              onClick={() => confirmCatalogCover(item.mediaUrl)}
                              className="group w-full overflow-hidden rounded-lg border border-line bg-bg text-left transition hover:border-accent/50"
                            >
                              <img
                                src={cardCoverUrl(item.thumb) ?? item.thumb}
                                alt=""
                                className="aspect-[3/4] w-full object-cover object-top"
                              />
                              <span className="block truncate px-1.5 py-1 text-[0.65rem] text-ink-muted group-hover:text-ink">
                                {coverCaption(item)}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 px-4 text-center">
                        <p className="text-sm text-ink-muted">
                          Aucune jaquette trouvée. Vous pouvez garder celle du
                          catalogue.
                        </p>
                        <Button
                          type="button"
                          onClick={() =>
                            confirmCatalogCover(pickedCatalog.cover ?? null)
                          }
                        >
                          Utiliser la jaquette proposée
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
              <label className="block shrink-0 space-y-1.5">
                <span className="text-xs font-medium text-ink-muted">
                  Recherche catalogue
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    autoFocus
                    className="field min-w-[10rem] flex-1"
                    value={catalogQuery}
                    onChange={(e) => setCatalogQuery(e.target.value)}
                    placeholder="Nom du jeu…"
                  />
                  <FilterSelect
                    label="Console"
                    value={hardware}
                    onChange={setHardware}
                    options={[
                      { id: 'all', label: 'Console : toutes' },
                      ...consoles.map((c) => ({ id: c.name, label: c.name })),
                    ]}
                  />
                </div>
              </label>
              <div className="relative min-h-0 flex-1 overflow-y-auto rounded-xl border border-line">
                {catalogSearching ? (
                  <div className="flex h-full min-h-[12rem] items-center justify-center">
                    <Loading label="Recherche…" />
                  </div>
                ) : catalogResults.length === 0 ? (
                  <p className="py-8 text-center text-sm text-ink-muted">
                    {catalogQuery.trim().length < 2
                      ? 'Tapez au moins 2 caractères.'
                      : 'Aucun résultat.'}
                  </p>
                ) : (
                  <ul className="divide-y divide-line">
                    {catalogResults.map((item) => (
                      <li key={item.igdbId}>
                        <button
                          type="button"
                          disabled={catalogBusy}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-accent-soft/60 disabled:opacity-50"
                          onClick={() => void pickCatalog(item)}
                        >
                          <div className="h-12 w-9 shrink-0 overflow-hidden rounded bg-bg">
                            {item.cover ? (
                              <img
                                src={cardCoverUrl(item.cover) ?? item.cover}
                                alt=""
                                className="h-full w-full object-cover object-top"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">
                              {item.name}
                            </p>
                            <p className="truncate text-xs text-ink-muted">
                              {item.release ?? 'Année inconnue'}
                              {item.platforms?.length
                                ? ` · ${item.platforms.slice(0, 2).join(', ')}`
                                : ''}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-end border-t border-line px-5 py-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  )
}
