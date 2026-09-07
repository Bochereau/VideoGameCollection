import { useState, type FormEvent } from 'react'
import type { ConsoleItem } from '@/types'
import { Button } from '@/components/ui/Button'

type Props = {
  consoles: ConsoleItem[]
  selectedHardware: string | null
  onSelectHardware: (name: string | null) => void
  onAddConsole: (name: string) => Promise<void>
  onDeleteConsole: (id: string) => Promise<void>
  open: boolean
  onClose: () => void
}

export function Sidebar({
  consoles,
  selectedHardware,
  onSelectHardware,
  onAddConsole,
  onDeleteConsole,
  open,
  onClose,
}: Props) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try {
      await onAddConsole(name.trim())
      setName('')
      setAdding(false)
    } finally {
      setBusy(false)
    }
  }

  const content = (
    <aside className="flex h-full w-64 flex-col border-r border-line/80 bg-white/60 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink uppercase">
          Consoles
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

      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        <button
          type="button"
          onClick={() => {
            onSelectHardware(null)
            onClose()
          }}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
            selectedHardware === null
              ? 'bg-accent-soft font-medium text-accent-strong'
              : 'text-ink-muted hover:bg-slate-50 hover:text-ink'
          }`}
        >
          <span>Toutes</span>
        </button>

        {consoles.map((c) => (
          <div key={c.id} className="group flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onSelectHardware(c.name)
                onClose()
              }}
              className={`flex min-w-0 flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                selectedHardware === c.name
                  ? 'bg-accent-soft font-medium text-accent-strong'
                  : 'text-ink-muted hover:bg-slate-50 hover:text-ink'
              }`}
            >
              <span className="truncate">{c.name}</span>
              <span className="ml-2 tabular-nums text-xs opacity-70">{c.count}</span>
            </button>
            <button
              type="button"
              className="rounded p-1.5 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-danger"
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
      </div>

      <div className="border-t border-line p-3">
        {adding ? (
          <form onSubmit={submit} className="space-y-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de la console"
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
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

  return (
    <>
      <div className="hidden lg:block">{content}</div>
      {open ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px]"
            aria-label="Fermer le panneau"
            onClick={onClose}
          />
          <div className="animate-fade-in relative z-10 h-full shadow-xl">{content}</div>
        </div>
      ) : null}
    </>
  )
}
