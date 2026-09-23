import { useEffect, useState } from 'react'
import type { Game, GamePriority } from '@/types'
import {
  DEFAULT_PRIORITY,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from '@/types'
import { Button } from '@/components/ui/Button'

const PRIORITY_ORDER: GamePriority[] = [5, 4, 3, 2, 1]

const PRIORITY_DOT: Record<GamePriority, string> = {
  5: 'bg-red-500',
  4: 'bg-orange-500',
  3: 'bg-amber-400',
  2: 'bg-sky-500',
  1: 'bg-ink-muted',
}

type Props = {
  game: Game | null
  open: boolean
  busy?: boolean
  onClose: () => void
  onConfirm: (priority: GamePriority) => void
}

export function AddToCollectionModal({
  game,
  open,
  busy = false,
  onClose,
  onConfirm,
}: Props) {
  const [priority, setPriority] = useState<GamePriority>(DEFAULT_PRIORITY)

  useEffect(() => {
    if (!open || !game) return
    setPriority(game.priority ?? DEFAULT_PRIORITY)
  }, [open, game])

  if (!open || !game) return null

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-bg/70 backdrop-blur-[2px]"
        aria-label="Fermer"
        onClick={onClose}
        disabled={busy}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-collection-title"
        className="relative z-10 w-full max-w-md rounded-t-2xl border border-line bg-bg p-5 shadow-2xl shadow-black/40 sm:rounded-2xl sm:p-6"
      >
        <h2
          id="add-to-collection-title"
          className="font-display text-2xl tracking-wide text-ink"
        >
          Ajouter à la collection
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Quelle priorité pour{' '}
          <span className="font-medium text-ink">{game.name}</span> ?
        </p>
        {game.reserved ? (
          <p className="mt-3 rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-sm text-amber">
            Quelqu’un s’en occupe. Ajoute-le seulement si tu l’as déjà reçu.
          </p>
        ) : null}

        <ul className="mt-5 space-y-1.5" role="listbox" aria-label="Priorité">
          {PRIORITY_ORDER.map((id) => {
            const selected = id === priority
            return (
              <li key={id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setPriority(id)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                    selected
                      ? 'border-accent bg-accent-soft font-semibold text-ink'
                      : 'border-line bg-surface text-ink-muted hover:border-accent/40 hover:text-ink'
                  }`}
                >
                  <span
                    className={`inline-flex size-2.5 shrink-0 rounded-full ${PRIORITY_DOT[id]}`}
                    aria-hidden
                  />
                  <span className={selected ? PRIORITY_COLORS[id] : undefined}>
                    {PRIORITY_LABELS[id]}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
            Annuler
          </Button>
          <Button
            type="button"
            disabled={busy}
            onClick={() => onConfirm(priority)}
          >
            {busy ? 'Ajout…' : game.reserved ? 'Je l’ai déjà reçu' : 'Ajouter'}
          </Button>
        </div>
      </div>
    </div>
  )
}
