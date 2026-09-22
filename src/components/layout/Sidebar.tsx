import { useAuth } from '@clerk/clerk-react'
import { useEffect, useState, type FormEvent } from 'react'
import type { CatalogPlatform, ConsoleItem } from '@/types'
import { catalogApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'

type Props = {
  consoles: ConsoleItem[]
  selectedHardware: string | null
  onSelectHardware: (name: string | null) => void
  onAddConsole: (name: string, igdbId?: number) => Promise<void>
  onRenameConsole: (id: string, name: string) => Promise<void>
  onDeleteConsole: (id: string) => Promise<void>
  open: boolean
  onClose: () => void
  wishlistMode?: boolean
}

export function Sidebar({
  consoles,
  selectedHardware,
  onSelectHardware,
  onAddConsole,
  onRenameConsole,
  onDeleteConsole,
  open,
  onClose,
  wishlistMode = false,
}: Props) {
  const { getToken } = useAuth()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [suggestions, setSuggestions] = useState<CatalogPlatform[]>([])
  const [pickedId, setPickedId] = useState<number | null>(null)
  const [pickedName, setPickedName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [renameError, setRenameError] = useState<string | null>(null)

  useEffect(() => {
    if (!adding) return
    const q = name.trim()
    if (q.length < 2) {
      setSuggestions([])
      return
    }

    let cancelled = false
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const token = await getToken()
          if (!token || cancelled) return
          const list = await catalogApi.platforms(token, q)
          if (cancelled) return
          setSuggestions(list.slice(0, 8))
        } catch {
          if (!cancelled) setSuggestions([])
        }
      })()
    }, 450)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [name, adding, getToken])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try {
      const trimmed = name.trim()
      await onAddConsole(
        trimmed,
        pickedId != null && pickedName === trimmed ? pickedId : undefined,
      )
      setName('')
      setPickedId(null)
      setPickedName('')
      setAdding(false)
      setSuggestions([])
    } finally {
      setBusy(false)
    }
  }

  const totalCount = consoles.reduce((sum, c) => sum + c.count, 0)

  function panel(solid: boolean) {
    return (
    <aside
      data-chrome
      {...(solid ? { 'data-solid': '' } : {})}
      className="flex h-full min-h-0 w-64 shrink-0 flex-col border-r border-line bg-bg/75 backdrop-blur-xl"
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-4">
        <h2 className="font-display text-sm tracking-wide text-amber uppercase">
          {wishlistMode ? 'Envies' : 'Consoles'}
        </h2>
        <button
          type="button"
          className="text-ink-muted lg:hidden"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              onSelectHardware(null)
              onClose()
            }}
            className={`flex min-w-0 flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
              selectedHardware === null
                ? 'bg-accent-soft font-medium text-accent'
                : 'text-ink-muted hover:bg-ink/5 hover:text-ink'
            }`}
          >
            <span>Toutes</span>
            <span className="ml-2 tabular-nums text-xs opacity-70">{totalCount}</span>
          </button>
          <span className="w-[3.4rem] shrink-0" aria-hidden />
        </div>

        {consoles.map((c) => (
          <div key={c.id} className="group flex items-center gap-1">
            {editingId === c.id ? (
              <form
                className="flex min-w-0 flex-1 items-center gap-1"
                onSubmit={(e) => {
                  e.preventDefault()
                  const next = editName.trim()
                  if (!next || next === c.name) {
                    setEditingId(null)
                    setRenameError(null)
                    return
                  }
                  setBusy(true)
                  setRenameError(null)
                  void onRenameConsole(c.id, next)
                    .then(() => setEditingId(null))
                    .catch((err: unknown) => {
                      setRenameError(
                        err instanceof Error ? err.message : 'Renommage impossible',
                      )
                    })
                    .finally(() => setBusy(false))
                }}
              >
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="field min-w-0 !px-2 !py-1 text-sm"
                  aria-label={`Renommer ${c.name}`}
                />
                <button
                  type="submit"
                  disabled={busy || !editName.trim()}
                  className="shrink-0 rounded px-1.5 py-1 text-xs font-medium text-accent hover:bg-accent-soft"
                >
                  OK
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onSelectHardware(c.name)
                  onClose()
                }}
                className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                  selectedHardware === c.name
                    ? 'bg-accent-soft font-medium text-accent'
                    : 'text-ink-muted hover:bg-ink/5 hover:text-ink'
                }`}
              >
                <span className="truncate">{c.name}</span>
                <span className="shrink-0 tabular-nums text-xs opacity-70">{c.count}</span>
              </button>
            )}
            {editingId === c.id ? null : (
              <button
                type="button"
                className="rounded p-1.5 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:bg-ink/10 hover:text-ink"
                aria-label={`Renommer ${c.name}`}
                onClick={() => {
                  setEditingId(c.id)
                  setEditName(c.name)
                  setRenameError(null)
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.5 6.5l3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="rounded p-1.5 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:bg-danger/15 hover:text-danger"
              aria-label={`Supprimer ${c.name}`}
              onClick={() => onDeleteConsole(c.id)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 7h14M10 11v6M14 11v6M9 7V5h6v2M7 7l1 12h8l1-12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ))}
        {renameError ? (
          <p className="px-2 pt-1 text-xs text-danger">{renameError}</p>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-line p-3">
        {adding ? (
          <form onSubmit={submit} className="space-y-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => {
                const value = e.target.value
                setName(value)
                if (pickedName && value.trim() !== pickedName) {
                  setPickedId(null)
                  setPickedName('')
                }
              }}
              placeholder="Nom de la console"
              className="field"
              list="platform-suggestions"
            />
            <datalist id="platform-suggestions">
              {suggestions.map((p) => (
                <option key={p.igdbId} value={p.name} />
              ))}
            </datalist>
            {suggestions.length > 0 ? (
              <ul className="max-h-28 overflow-y-auto rounded-lg border border-line bg-bg text-xs">
                {suggestions.map((p) => (
                  <li key={p.igdbId}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-2 py-1.5 text-left hover:bg-accent-soft"
                      onClick={() => {
                        setName(p.name)
                        setPickedId(p.igdbId)
                        setPickedName(p.name)
                      }}
                    >
                      <span className="truncate">{p.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={busy || !name.trim()} className="flex-1">
                Ajouter
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setAdding(false)
                  setName('')
                  setPickedId(null)
                  setPickedName('')
                  setSuggestions([])
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="secondary" className="w-full" onClick={() => setAdding(true)}>
            + Ajouter une console
          </Button>
        )}
      </div>
    </aside>
    )
  }

  return (
    <>
      <div className="hidden h-full min-h-0 w-64 shrink-0 lg:flex lg:flex-col">
        {panel(false)}
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Fermer le panneau"
            onClick={onClose}
          />
          <div className="animate-fade-in relative z-10 h-full shadow-xl">{panel(true)}</div>
        </div>
      ) : null}
    </>
  )
}
