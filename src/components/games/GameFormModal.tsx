import { useAuth } from '@clerk/clerk-react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type {
  CatalogCover,
  CatalogGame,
  Game,
  GameInput,
  GamePriority,
  GameStatus,
} from '@/types'
import {
  CONDITION_LABELS,
  DEFAULT_PRIORITY,
  EDITION_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '@/types'
import { catalogApi, gamesApi } from '@/lib/api'
import { useVisualFrame, visualFrameStyle } from '@/lib/useVisualFrame'
import { Button } from '@/components/ui/Button'

const OTHER = '__other__'

type Props = {
  open: boolean
  initial?: Game | null
  defaultWishlist?: boolean
  defaultHardware?: string | null
  consoleNames: string[]
  onClose: () => void
  onSubmit: (data: GameInput) => Promise<void>
}

const empty: GameInput = {
  name: '',
  hardware: '',
  developer: '',
  editor: '',
  release: null,
  status: 'todo',
  priority: DEFAULT_PRIORITY,
  wishlist: false,
  favorite: false,
  cover: null,
  igdbId: null,
  rawgId: null,
  format: 'physical',
  condition: 'none',
  edition: 'standard',
}

function detectCoverSource(
  url: string | null | undefined,
): 'igdb' | 'libretro' | 'rawg' | null {
  if (!url) return null
  if (url.includes('images.igdb.com')) return 'igdb'
  if (url.includes('thumbnails.libretro.com')) return 'libretro'
  if (url.includes('media.rawg.io')) return 'rawg'
  return null
}

function coverSourceLabel(source: 'igdb' | 'libretro' | 'rawg' | null, hasCover: boolean) {
  if (source === 'libretro') return 'Jaquette Libretro Thumbnails'
  if (source === 'rawg') return 'Jaquette RAWG'
  if (source === 'igdb') return 'Jaquette IGDB'
  if (hasCover) return 'Jaquette'
  return 'Aucune jaquette'
}

function matchSavedConsole(platforms: string[], saved: string[]): string | null {
  for (const platform of platforms) {
    const exact = saved.find(
      (s) => s.localeCompare(platform, undefined, { sensitivity: 'accent' }) === 0,
    )
    if (exact) return exact
  }
  for (const platform of platforms) {
    const p = platform.toLowerCase()
    const soft = saved.find((s) => {
      const n = s.toLowerCase()
      return n.includes(p) || p.includes(n)
    })
    if (soft) return soft
  }
  return null
}

export function GameFormModal({
  open,
  initial,
  defaultWishlist = false,
  defaultHardware = null,
  consoleNames,
  onClose,
  onSubmit,
}: Props) {
  const { getToken } = useAuth()
  const [form, setForm] = useState<GameInput>(empty)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CatalogGame[]>([])
  const [searching, setSearching] = useState(false)
  const [catalogLocked, setCatalogLocked] = useState(false)
  const [consoleChoice, setConsoleChoice] = useState('')
  const [customHardware, setCustomHardware] = useState('')
  const [coverResults, setCoverResults] = useState<CatalogCover[]>([])
  const [coverSearching, setCoverSearching] = useState(false)
  const [coverPickerOpen, setCoverPickerOpen] = useState(false)
  const [coverSource, setCoverSource] = useState<'igdb' | 'libretro' | 'rawg' | null>(
    null,
  )
  const [duplicates, setDuplicates] = useState<Game[]>([])
  const [duplicateAck, setDuplicateAck] = useState('')
  const frame = useVisualFrame(open)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        name: initial.name,
        hardware: initial.hardware,
        developer: initial.developer,
        editor: initial.editor,
        release: initial.release,
        status: initial.status ?? 'todo',
        priority: initial.priority ?? DEFAULT_PRIORITY,
        wishlist: initial.wishlist,
        favorite: initial.favorite,
        cover: initial.cover ?? null,
        igdbId: initial.igdbId ?? null,
        rawgId: initial.rawgId ?? null,
        format: initial.format ?? 'physical',
        condition: initial.condition ?? 'none',
        edition: initial.edition ?? 'standard',
      })
      setQuery(initial.name)
      if (consoleNames.includes(initial.hardware)) {
        setConsoleChoice(initial.hardware)
        setCustomHardware('')
      } else {
        setConsoleChoice(OTHER)
        setCustomHardware(initial.hardware)
      }
    } else {
      const preset =
        defaultHardware && consoleNames.includes(defaultHardware)
          ? defaultHardware
          : (consoleNames[0] ?? OTHER)
      setQuery('')
      setConsoleChoice(preset)
      setCustomHardware(preset === OTHER ? defaultHardware || '' : '')
      setForm({
        ...empty,
        wishlist: defaultWishlist,
        hardware: preset === OTHER ? defaultHardware || '' : preset,
      })
    }
    setResults([])
    setCatalogLocked(false)
    setCoverResults([])
    setCoverPickerOpen(false)
    setCoverSource(detectCoverSource(initial?.cover))
    setError(null)
    setDuplicates([])
    setDuplicateAck('')
  }, [open, initial, defaultWishlist, defaultHardware, consoleNames])

  useEffect(() => {
    setDuplicates([])
    setDuplicateAck('')
  }, [form.name, consoleChoice, customHardware])

  useEffect(() => {
    if (!open || initial || catalogLocked) return
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearching(false)
      return
    }

    const hardware =
      (consoleChoice === OTHER ? customHardware : consoleChoice).trim()

    let cancelled = false
    setSearching(true)
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const token = await getToken()
          if (!token || cancelled) return
          const list = await catalogApi.searchGames(token, q, hardware || undefined)
          if (cancelled) return
          setResults(list)
        } catch {
          if (!cancelled) setResults([])
        } finally {
          if (!cancelled) setSearching(false)
        }
      })()
    }, 800)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, open, initial, catalogLocked, consoleChoice, customHardware, getToken])

  if (!open) return null

  function applyHardwareChoice(choice: string, custom: string) {
    const hardware = choice === OTHER ? custom.trim() : choice
    setForm((f) => ({ ...f, hardware }))
  }

  async function pickCatalogGame(item: CatalogGame) {
    setBusy(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Non authentifié')
      const details = await catalogApi.gameDetails(token, item.igdbId)
      // Keep casing from the search hit (details can alter Roman numerals)
      const title = item.name
      const platformList =
        details.platforms.length > 0 ? details.platforms : item.platforms
      const currentHardware =
        (consoleChoice === OTHER ? customHardware : consoleChoice).trim()
      const matched =
        (currentHardware && matchSavedConsole(platformList, [currentHardware])) ||
        matchSavedConsole(platformList, consoleNames)

      if (matched) {
        setConsoleChoice(matched)
        setCustomHardware('')
        setForm((f) => ({
          ...f,
          name: title,
          hardware: matched,
          developer: details.developer || '',
          editor: details.editor || '',
          release: details.release,
          cover: details.cover,
          igdbId: details.igdbId,
        }))
      } else {
        const fallback = platformList[0] || ''
        setConsoleChoice(OTHER)
        setCustomHardware(fallback)
        setForm((f) => ({
          ...f,
          name: title,
          hardware: fallback,
          developer: details.developer || '',
          editor: details.editor || '',
          release: details.release,
          cover: details.cover,
          igdbId: details.igdbId,
        }))
      }

      setCoverSource(details.cover ? 'igdb' : null)
      setQuery(title)
      setResults([])
      setCatalogLocked(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur catalogue')
    } finally {
      setBusy(false)
    }
  }

  async function searchAlternateCovers() {
    const name = form.name.trim() || query.trim()
    if (name.length < 2) {
      setError('Indique un nom de jeu pour chercher une jaquette.')
      return
    }
    const hardware =
      (consoleChoice === OTHER ? customHardware : consoleChoice).trim() ||
      (form.hardware || '').trim()

    setCoverSearching(true)
    setCoverPickerOpen(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Non authentifié')
      const data = await catalogApi.searchCovers(
        token,
        name,
        hardware || undefined,
        form.igdbId,
      )
      setCoverResults(data.results)
      if (!data.results.length) {
        setError('Aucune jaquette trouvée pour ce titre.')
      }
    } catch (err) {
      setCoverResults([])
      setError(err instanceof Error ? err.message : 'Erreur jaquettes')
    } finally {
      setCoverSearching(false)
    }
  }

  function applyCover(item: CatalogCover) {
    setForm((f) => ({ ...f, cover: item.mediaUrl }))
    setCoverSource(item.source === 'libretro' ? 'libretro' : 'igdb')
    setCoverPickerOpen(false)
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const hardware =
      consoleChoice === OTHER ? customHardware.trim() : consoleChoice.trim()
    const name = form.name.trim()
    if (!name || !hardware) {
      setError('Nom et console sont requis.')
      return
    }
    const ackKey = `${name.toLocaleLowerCase('fr')}\n${hardware.toLocaleLowerCase('fr')}`
    setBusy(true)
    setError(null)
    try {
      const unchanged =
        initial != null &&
        initial.name.localeCompare(name, 'fr', { sensitivity: 'base' }) === 0 &&
        initial.hardware === hardware
      if (!unchanged && duplicateAck !== ackKey) {
        const token = await getToken()
        if (!token) throw new Error('Non authentifié')
        const matches = await gamesApi.list(token, { nameExact: name })
        const others = matches.filter(
          (game) =>
            game.id !== initial?.id &&
            game.name.localeCompare(name, 'fr', { sensitivity: 'base' }) === 0,
        )
        if (others.length > 0) {
          setDuplicates(others)
          setDuplicateAck(ackKey)
          return
        }
      }
      await onSubmit({
        ...form,
        name,
        hardware,
        developer: form.developer?.trim() ?? '',
        editor: form.editor?.trim() ?? '',
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setBusy(false)
    }
  }

  const focusSearch = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  return createPortal(
    <div
      className="animate-fade-in fixed z-50 flex w-full min-w-0 flex-col overflow-hidden sm:items-center sm:justify-center sm:p-4"
      style={visualFrameStyle(frame)}
    >
      <button
        type="button"
        className="absolute inset-0 bg-bg/70 backdrop-blur-[2px]"
        aria-label="Fermer"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex h-auto max-h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden border-line bg-surface-elevated shadow-2xl shadow-black/40 backdrop-blur-xl sm:max-w-6xl sm:flex-initial sm:rounded-2xl sm:border"
      >
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-line bg-surface-elevated px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:px-6 sm:py-4">
          <h2 className="min-w-0 font-display text-2xl tracking-wide text-ink">
            {coverPickerOpen
              ? 'Choisir une jaquette'
              : initial
                ? 'Modifier le jeu'
                : 'Ajouter un jeu'}
          </h2>
          <Button
            type="button"
            variant="ghost"
            className="!px-2 shrink-0"
            onClick={coverPickerOpen ? () => setCoverPickerOpen(false) : onClose}
            aria-label={coverPickerOpen ? 'Retour au formulaire' : 'Fermer'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </div>

        {coverPickerOpen ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
              {form.cover ? (
                <img
                  src={form.cover}
                  alt=""
                  className="h-14 w-10 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded bg-surface text-[10px] text-ink-muted">
                  N/A
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink normal-case">
                  {form.name || 'Jaquette sélectionnée'}
                </p>
                <p className="truncate text-xs text-ink-muted">
                  {coverSourceLabel(coverSource, Boolean(form.cover))}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="!text-xs"
                  disabled={busy || coverSearching || !(form.name.trim() || query.trim())}
                  onClick={() => void searchAlternateCovers()}
                >
                  {coverSearching ? 'Recherche…' : 'Actualiser'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="!text-xs"
                  onClick={() => setCoverPickerOpen(false)}
                >
                  Retour
                </Button>
              </div>
            </div>

            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
              {coverSearching && coverResults.length === 0 ? (
                <p className="text-sm text-ink-muted">Chargement des jaquettes…</p>
              ) : coverResults.length > 0 ? (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {coverResults.map((item) => (
                    <li
                      key={`${item.source ?? 'igdb'}-${item.system}-${item.mediaUrl}`}
                    >
                      <button
                        type="button"
                        onClick={() => applyCover(item)}
                        disabled={busy}
                        className={`group w-full overflow-hidden rounded-lg border bg-surface text-left transition hover:border-accent/50 ${
                          form.cover === item.mediaUrl
                            ? 'border-accent ring-1 ring-accent/40'
                            : 'border-line'
                        }`}
                      >
                        <img
                          src={item.thumb}
                          alt=""
                          className="aspect-[3/4] w-full object-cover object-top"
                        />
                        <span className="block truncate px-2 py-1.5 text-[0.7rem] text-ink-muted group-hover:text-ink">
                          {item.source === 'libretro'
                            ? item.region
                            : item.region && item.region !== 'Officielle'
                              ? `${item.region} · ${item.name}`
                              : item.name}
                          {item.system
                            ? ` · ${item.system.replace(/^(Sony|Sega|Nintendo|Microsoft|SNK|NEC) - /i, '')}`
                            : ''}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">Aucun résultat.</p>
              )}
              {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
            </div>
          </div>
        ) : (
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
            {!initial ? (
              <div className="mb-5 space-y-2">
                <Field label="Recherche catalogue">
                  <input
                    value={query}
                    onChange={(e) => {
                      setCatalogLocked(false)
                      setQuery(e.target.value)
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }}
                    className="field"
                    placeholder="Ex. Streets of Rage 2"
                    autoFocus={focusSearch}
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </Field>
                {searching ? (
                  <p className="text-xs text-ink-muted">Recherche en cours…</p>
                ) : null}
                {results.length > 0 ? (
                  <ul className="max-h-44 divide-y divide-line overflow-y-auto rounded-xl border border-line bg-bg/80 sm:max-h-52">
                    {results.map((item) => (
                      <li key={item.igdbId}>
                        <button
                          type="button"
                          onClick={() => void pickCatalogGame(item)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-accent-soft"
                        >
                          {item.cover ? (
                            <img
                              src={item.cover}
                              alt=""
                              className="h-12 w-9 shrink-0 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded bg-surface text-[10px] text-ink-muted">
                              N/A
                            </div>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold normal-case">
                              {item.name}
                            </span>
                            <span className="block truncate text-xs text-ink-muted">
                              {[item.release, item.platforms.slice(0, 2).join(', ')]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <div className="grid min-w-0 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-6 xl:grid-cols-[16rem_minmax(0,1fr)]">
              <div className="rounded-xl border border-line bg-bg/60 p-3">
                <div className="flex gap-4 lg:flex-col lg:gap-3">
                  {form.cover ? (
                    <img
                      src={form.cover}
                      alt=""
                      className="h-28 w-20 shrink-0 rounded-lg object-cover lg:mx-auto lg:h-auto lg:w-full lg:max-w-[13rem]"
                    />
                  ) : (
                    <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg bg-surface text-[10px] text-ink-muted lg:mx-auto lg:aspect-[3/4] lg:h-auto lg:w-full lg:max-w-[13rem]">
                      N/A
                    </div>
                  )}
                  <div className="min-w-0 flex-1 lg:text-center">
                    <p className="text-sm font-semibold text-ink normal-case">
                      {form.name || 'Jaquette'}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {coverSourceLabel(coverSource, Boolean(form.cover))}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-3 !text-xs lg:w-full"
                      disabled={
                        busy ||
                        coverSearching ||
                        !(form.name.trim() || query.trim())
                      }
                      onClick={() => void searchAlternateCovers()}
                    >
                      {coverSearching
                        ? 'Recherche des jaquettes…'
                        : 'Choisir une jaquette'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="min-w-0 space-y-2.5">
                {initial || form.name ? (
                  <Field label="Nom">
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="field normal-case"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </Field>
                ) : null}

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Field label="Console">
                    <select
                      className="field"
                      value={consoleChoice}
                      onChange={(e) => {
                        const value = e.target.value
                        setConsoleChoice(value)
                        applyHardwareChoice(value, customHardware)
                      }}
                      required={consoleChoice !== OTHER}
                    >
                      <option value="" disabled>
                        Choisir une console…
                      </option>
                      {consoleNames.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                      <option value={OTHER}>Autre…</option>
                    </select>
                  </Field>

                  {consoleChoice === OTHER ? (
                    <Field label="Nom de la console">
                      <input
                        required
                        value={customHardware}
                        onChange={(e) => {
                          setCustomHardware(e.target.value)
                          applyHardwareChoice(OTHER, e.target.value)
                        }}
                        className="field"
                        placeholder="Ex. Neo Geo CD"
                      />
                    </Field>
                  ) : (
                    <Field label="Année de sortie">
                      <input
                        type="number"
                        min={1970}
                        max={2100}
                        value={form.release ?? ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            release:
                              e.target.value === ''
                                ? null
                                : Number(e.target.value),
                          }))
                        }
                        className="field"
                      />
                    </Field>
                  )}
                </div>

                {consoleChoice === OTHER ? (
                  <Field label="Année de sortie">
                    <input
                      type="number"
                      min={1970}
                      max={2100}
                      value={form.release ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          release:
                            e.target.value === ''
                              ? null
                              : Number(e.target.value),
                        }))
                      }
                      className="field"
                    />
                  </Field>
                ) : null}

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Field label="Développeur">
                    <input
                      value={form.developer ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, developer: e.target.value }))
                      }
                      className="field"
                    />
                  </Field>
                  <Field label="Éditeur">
                    <input
                      value={form.editor ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, editor: e.target.value }))
                      }
                      className="field"
                    />
                  </Field>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  <fieldset className="space-y-1.5 sm:col-span-2 xl:col-span-1">
                    <legend className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                      Format
                    </legend>
                    <div className="flex flex-wrap gap-1 rounded-xl border border-line bg-bg/60 p-1">
                      {(
                        [
                          { id: 'physical', label: 'Physique' },
                          { id: 'digital', label: 'Numérique' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              format: opt.id,
                              condition:
                                opt.id === 'physical'
                                  ? f.condition ?? 'none'
                                  : 'none',
                            }))
                          }
                          className={`rounded-lg px-3 py-1.5 text-sm transition ${
                            (form.format ?? 'physical') === opt.id
                              ? 'bg-accent text-bg shadow-sm'
                              : 'text-ink-muted hover:text-ink'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {(form.format ?? 'physical') === 'physical' ? (
                    <Field label="État">
                      <select
                        className="field"
                        value={form.condition ?? 'none'}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            condition: e.target.value as GameInput['condition'],
                          }))
                        }
                      >
                        {Object.entries(CONDITION_LABELS).map(([id, label]) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ) : null}

                  <Field label="Édition">
                    <select
                      className="field"
                      value={form.edition ?? 'standard'}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          edition: e.target.value as GameInput['edition'],
                        }))
                      }
                    >
                      {Object.entries(EDITION_LABELS).map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {!defaultWishlist && !form.wishlist ? (
                    <Field label="Statut">
                      <select
                        className="field"
                        value={form.status ?? 'todo'}
                        onChange={(e) => {
                          const status = e.target.value as GameStatus
                          setForm((f) => ({
                            ...f,
                            status,
                            favorite:
                              status === 'finished' ? f.favorite : false,
                            priority:
                              status === 'todo'
                                ? (f.priority ?? DEFAULT_PRIORITY)
                                : null,
                          }))
                        }}
                      >
                        {(Object.keys(STATUS_LABELS) as GameStatus[]).map(
                          (id) => (
                            <option key={id} value={id}>
                              {STATUS_LABELS[id]}
                            </option>
                          ),
                        )}
                      </select>
                    </Field>
                  ) : null}

                  {form.wishlist || form.status === 'todo' ? (
                    <Field label="Priorité">
                      <select
                        className="field"
                        value={form.priority ?? DEFAULT_PRIORITY}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            priority: Number(e.target.value) as GamePriority,
                          }))
                        }
                      >
                        {([5, 4, 3, 2, 1] as GamePriority[]).map((id) => (
                          <option key={id} value={id}>
                            {PRIORITY_LABELS[id]}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ) : null}

                  <div className="flex flex-col justify-end gap-2 pb-1 text-sm">
                    {!defaultWishlist &&
                    !form.wishlist &&
                    form.status === 'finished' ? (
                      <label className="flex items-center gap-2 text-ink-muted">
                        <input
                          type="checkbox"
                          checked={Boolean(form.favorite)}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              favorite: e.target.checked,
                            }))
                          }
                          className="accent-rose-400"
                        />
                        Coup de cœur
                      </label>
                    ) : null}

                    {!defaultWishlist ? (
                      <label className="flex items-center gap-2 text-ink-muted">
                        <input
                          type="checkbox"
                          checked={Boolean(form.wishlist)}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              wishlist: e.target.checked,
                              favorite: false,
                              priority: e.target.checked
                                ? (f.priority ?? DEFAULT_PRIORITY)
                                : f.status === 'todo'
                                  ? (f.priority ?? DEFAULT_PRIORITY)
                                  : null,
                            }))
                          }
                          className="accent-accent"
                        />
                        Liste d&apos;envies
                      </label>
                    ) : null}
                  </div>
                </div>

                {duplicates.length > 0 ? (
                  <div className="rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-sm text-ink">
                    <p>Ce jeu est déjà enregistré.</p>
                    <ul className="mt-1 space-y-0.5 text-ink-muted">
                      {duplicates.map((game) => (
                        <li key={game.id}>
                          {game.wishlist ? 'Envies' : 'Collection'} ·{' '}
                          {game.hardware}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {error ? <p className="text-sm text-danger">{error}</p> : null}
              </div>
            </div>
          </div>
        )}

        <div className="sticky bottom-0 z-10 flex shrink-0 flex-wrap justify-end gap-2 border-t border-line bg-surface-elevated/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-6">
          {coverPickerOpen ? (
            <Button
              type="button"
              onClick={() => setCoverPickerOpen(false)}
            >
              Valider la jaquette
            </Button>
          ) : (
            <>
              <Button type="button" variant="ghost" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={busy}>
                {busy
                  ? 'Enregistrement…'
                  : duplicates.length > 0
                    ? 'Enregistrer quand même'
                    : 'Enregistrer'}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>,
    document.body,
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block min-w-0 space-y-1">
      <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}
