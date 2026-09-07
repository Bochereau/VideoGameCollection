import { useAuth } from '@clerk/clerk-react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { CatalogGame, Game, GameInput } from '@/types'
import { catalogApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'

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
  cover: null,
  rawgId: null,
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
  const [platforms, setPlatforms] = useState<string[]>([])

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
        cover: initial.cover ?? null,
        rawgId: initial.rawgId ?? null,
      })
      setQuery(initial.name)
      setPlatforms(initial.hardware ? [initial.hardware] : [])
    } else {
      setForm({ ...empty, wishlist: defaultWishlist })
      setQuery('')
      setPlatforms([])
    }
    setResults([])
    setError(null)
  }, [open, initial, defaultWishlist])

  useEffect(() => {
    if (!open || initial) return
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }

    const timer = window.setTimeout(() => {
      void (async () => {
        setSearching(true)
        try {
          const token = await getToken()
          if (!token) return
          const list = await catalogApi.searchGames(token, q)
          setResults(list)
        } catch {
          setResults([])
        } finally {
          setSearching(false)
        }
      })()
    }, 350)

    return () => window.clearTimeout(timer)
  }, [query, open, initial, getToken])

  if (!open) return null

  async function pickCatalogGame(item: CatalogGame) {
    setBusy(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Non authentifié')
      const details = await catalogApi.gameDetails(token, item.rawgId)
      const platformList =
        details.platforms.length > 0 ? details.platforms : item.platforms
      setPlatforms(platformList)
      setForm((f) => ({
        ...f,
        name: details.name,
        hardware: platformList[0] || f.hardware,
        developer: details.developer || '',
        editor: details.editor || '',
        release: details.release,
        cover: details.cover,
        rawgId: details.rawgId,
      }))
      setQuery(details.name)
      setResults([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur catalogue')
    } finally {
      setBusy(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.hardware.trim()) {
      setError('Nom et console sont requis.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        hardware: form.hardware.trim(),
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

  const hardwareOptions = Array.from(
    new Set([...consoleNames, ...platforms].filter(Boolean)),
  )

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
        <h2 className="font-display text-xl font-semibold text-ink">
          {initial ? 'Modifier le jeu' : 'Ajouter un jeu'}
        </h2>

        {!initial ? (
          <div className="mt-5 space-y-2">
            <Field label="Recherche catalogue">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setForm((f) => ({ ...f, name: e.target.value }))
                }}
                className="field"
                placeholder="Ex. Streets of Rage 2"
                autoFocus
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
                        <span className="block truncate text-sm font-semibold">
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
          {form.cover ? (
            <div className="flex gap-4 rounded-xl border border-line bg-bg/60 p-3">
              <img
                src={form.cover}
                alt=""
                className="h-28 w-20 rounded-lg object-cover"
              />
              <div className="text-xs text-ink-muted">
                <p className="text-sm font-semibold text-ink">{form.name}</p>
                <p className="mt-1">Jaquette importée depuis RAWG</p>
              </div>
            </div>
          ) : null}

          {initial ? (
            <Field label="Nom">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="field"
              />
            </Field>
          ) : null}

          <Field label="Console">
            <input
              required
              list="console-options"
              value={form.hardware}
              onChange={(e) => setForm((f) => ({ ...f, hardware: e.target.value }))}
              className="field"
              placeholder="Megadrive"
            />
            <datalist id="console-options">
              {hardwareOptions.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </Field>

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
            <label className="flex items-center gap-2 text-ink-muted">
              <input
                type="checkbox"
                checked={Boolean(form.wishlist)}
                onChange={(e) => setForm((f) => ({ ...f, wishlist: e.target.checked }))}
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
