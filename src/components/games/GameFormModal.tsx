import { useAuth } from '@clerk/clerk-react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { CatalogCover, CatalogGame, Game, GameInput } from '@/types'
import { CONDITION_LABELS, EDITION_LABELS } from '@/types'
import { catalogApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'

const OTHER = '__other__'

type Props = {
  open: boolean
  initial?: Game | null
  defaultWishlist?: boolean
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
  finished: false,
  wishlist: false,
  favorite: false,
  cover: null,
  rawgId: null,
  format: 'physical',
  condition: 'none',
  edition: 'standard',
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
  const [coverSource, setCoverSource] = useState<'rawg' | 'libretro' | null>(null)

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        name: initial.name,
        hardware: initial.hardware,
        developer: initial.developer,
        editor: initial.editor,
        release: initial.release,
        finished: initial.finished,
        wishlist: initial.wishlist,
        favorite: initial.favorite,
        cover: initial.cover ?? null,
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
      setForm({ ...empty, wishlist: defaultWishlist })
      setQuery('')
      setConsoleChoice(consoleNames[0] ?? OTHER)
      setCustomHardware('')
    }
    setResults([])
    setCatalogLocked(false)
    setCoverResults([])
    setCoverPickerOpen(false)
    setCoverSource(initial?.cover ? 'rawg' : null)
    setError(null)
  }, [open, initial, defaultWishlist, consoleNames])

  useEffect(() => {
    if (!open || initial || catalogLocked) return
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearching(false)
      return
    }

    let cancelled = false
    setSearching(true)
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const token = await getToken()
          if (!token || cancelled) return
          const list = await catalogApi.searchGames(token, q)
          if (cancelled) return
          setResults(list)
        } catch {
          if (!cancelled) setResults([])
        } finally {
          if (!cancelled) setSearching(false)
        }
      })()
    }, 500)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, open, initial, catalogLocked, getToken])

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
      const details = await catalogApi.gameDetails(token, item.rawgId)
      // Keep casing from the search hit (RAWG details can alter Roman numerals)
      const title = item.name
      const platformList =
        details.platforms.length > 0 ? details.platforms : item.platforms
      const matched = matchSavedConsole(platformList, consoleNames)

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
          rawgId: details.rawgId,
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
          rawgId: details.rawgId,
        }))
      }

      setCoverSource(details.cover ? 'rawg' : null)
      setQuery(title)
      setResults([])
      setCatalogLocked(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur catalogue')
    } finally {
      setBusy(false)
    }
  }

  async function searchLibretroCovers() {
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
      const data = await catalogApi.searchCovers(token, name, hardware || undefined)
      setCoverResults(data.results)
      if (!data.results.length) {
        setError('Aucune jaquette Libretro trouvée pour ce titre.')
      }
    } catch (err) {
      setCoverResults([])
      setError(err instanceof Error ? err.message : 'Erreur Libretro Thumbnails')
    } finally {
      setCoverSearching(false)
    }
  }

  function applyLibretroCover(item: CatalogCover) {
    setForm((f) => ({ ...f, cover: item.mediaUrl }))
    setCoverSource('libretro')
    setCoverPickerOpen(false)
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const hardware =
      consoleChoice === OTHER ? customHardware.trim() : consoleChoice.trim()
    if (!form.name.trim() || !hardware) {
      setError('Nom et console sont requis.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
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

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-bg/70 backdrop-blur-[2px]"
        aria-label="Fermer"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-line bg-surface-elevated p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:rounded-2xl sm:p-6"
      >
        <h2 className="font-display text-2xl tracking-wide text-ink">
          {initial ? 'Modifier le jeu' : 'Ajouter un jeu'}
        </h2>

        {!initial ? (
          <div className="mt-5 space-y-2">
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
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            {searching ? (
              <p className="text-xs text-ink-muted">Recherche en cours…</p>
            ) : null}
            {results.length > 0 ? (
              <ul className="max-h-52 divide-y divide-line overflow-y-auto rounded-xl border border-line bg-bg/80">
                {results.map((item) => (
                  <li key={item.rawgId}>
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

        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-line bg-bg/60 p-3">
            <div className="flex gap-4">
              {form.cover ? (
                <img
                  src={form.cover}
                  alt=""
                  className="h-28 w-20 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg bg-surface text-[10px] text-ink-muted">
                  N/A
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink normal-case">
                  {form.name || 'Jaquette'}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {coverSource === 'libretro'
                    ? 'Jaquette Libretro Thumbnails'
                    : coverSource === 'rawg' || form.cover
                      ? 'Jaquette RAWG'
                      : 'Aucune jaquette'}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3 !text-xs"
                  disabled={busy || coverSearching || !(form.name.trim() || query.trim())}
                  onClick={() => void searchLibretroCovers()}
                >
                  {coverSearching
                    ? 'Recherche Libretro…'
                    : 'Choisir une jaquette Libretro'}
                </Button>
              </div>
            </div>

            {coverPickerOpen ? (
              <div className="mt-3 border-t border-line pt-3">
                {coverSearching ? (
                  <p className="text-xs text-ink-muted">Chargement des jaquettes…</p>
                ) : coverResults.length > 0 ? (
                  <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {coverResults.map((item) => (
                      <li key={`${item.system}-${item.mediaUrl}`}>
                        <button
                          type="button"
                          onClick={() => applyLibretroCover(item)}
                          disabled={busy}
                          className="group w-full overflow-hidden rounded-lg border border-line bg-surface text-left transition hover:border-accent/50"
                        >
                          <img
                            src={item.thumb}
                            alt=""
                            className="aspect-[3/4] w-full object-cover object-top"
                          />
                          <span className="block truncate px-1.5 py-1 text-[0.65rem] text-ink-muted group-hover:text-ink">
                            {item.region}
                            {item.system
                              ? ` · ${item.system.replace(/^(Sony|Sega|Nintendo|Microsoft|SNK|NEC) - /i, '')}`
                              : ''}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-ink-muted">Aucun résultat.</p>
                )}
              </div>
            ) : null}
          </div>

          {initial ? (
            <Field label="Nom">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="field normal-case"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
          ) : form.name ? (
            <Field label="Nom">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="field normal-case"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
          ) : null}

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
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Développeur">
              <input
                value={form.developer ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, developer: e.target.value }))}
                className="field"
              />
            </Field>
            <Field label="Éditeur">
              <input
                value={form.editor ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, editor: e.target.value }))}
                className="field"
              />
            </Field>
          </div>

          <Field label="Année de sortie">
            <input
              type="number"
              min={1970}
              max={2100}
              value={form.release ?? ''}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  release: e.target.value === '' ? null : Number(e.target.value),
                }))
              }
              className="field"
            />
          </Field>

          <fieldset className="space-y-2">
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
                      condition: opt.id === 'physical' ? f.condition ?? 'none' : 'none',
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

          <div className="grid gap-3 sm:grid-cols-2">
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

          <div className="flex flex-wrap gap-4 pt-1 text-sm">
            <label className="flex items-center gap-2 text-ink-muted">
              <input
                type="checkbox"
                checked={Boolean(form.finished)}
                onChange={(e) => setForm((f) => ({ ...f, finished: e.target.checked }))}
                className="accent-accent"
              />
              Terminé
            </label>
            {!defaultWishlist ? (
              <label className="flex items-center gap-2 text-ink-muted">
                <input
                  type="checkbox"
                  checked={Boolean(form.favorite) && !form.wishlist}
                  disabled={Boolean(form.wishlist)}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, favorite: e.target.checked }))
                  }
                  className="accent-rose-400"
                />
                Coup de cœur
              </label>
            ) : null}
            <label className="flex items-center gap-2 text-ink-muted">
              <input
                type="checkbox"
                checked={Boolean(form.wishlist)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    wishlist: e.target.checked,
                    favorite: e.target.checked ? false : f.favorite,
                  }))
                }
                className="accent-accent"
              />
              Liste d&apos;envies
            </label>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}
