import { useEffect, useState, type FormEvent } from 'react'
import { DEFAULT_TOP_SIZE, MAX_TOP_SIZE } from '@/types'
import { Button } from '@/components/ui/Button'

type Props = {
  open: boolean
  initial?: { name: string; size: number } | null
  title?: string
  submitLabel?: string
  onClose: () => void
  onSubmit: (data: { name: string; size: number }) => Promise<void>
}

export function CreateTopModal({
  open,
  initial = null,
  title = 'Nouveau top',
  submitLabel = 'Créer',
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState('')
  const [size, setSize] = useState(DEFAULT_TOP_SIZE)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? '')
    setSize(initial?.size ?? DEFAULT_TOP_SIZE)
    setError(null)
    setBusy(false)
  }, [open, initial])

  if (!open) return null

  async function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Le nom est requis')
      return
    }
    const clamped = Math.min(MAX_TOP_SIZE, Math.max(1, Math.round(size) || 1))
    setBusy(true)
    setError(null)
    try {
      await onSubmit({ name: trimmed, size: clamped })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label="Fermer"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className="animate-fade-up relative z-10 w-full max-w-md rounded-t-2xl border border-line bg-surface p-5 shadow-xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-xl tracking-wide text-ink">{title}</h2>
          <button
            type="button"
            className="text-ink-muted hover:text-ink"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-ink-muted">Nom du top</span>
            <input
              autoFocus
              className="field w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. Favoris PS3"
              maxLength={80}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-ink-muted">
              Nombre d’éléments (max {MAX_TOP_SIZE})
            </span>
            <input
              type="number"
              min={1}
              max={MAX_TOP_SIZE}
              className="field w-full"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </label>

          {error ? <p className="text-sm text-danger">{error}</p> : null}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={busy || !name.trim()}>
            {busy ? '…' : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  )
}
