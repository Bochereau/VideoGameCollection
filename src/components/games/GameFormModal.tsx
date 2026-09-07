import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Game, GameInput } from '@/types'
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
}

export function GameFormModal({
  open,
  initial,
  defaultWishlist = false,
  consoleNames,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<GameInput>(empty)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      })
    } else {
      setForm({ ...empty, wishlist: defaultWishlist })
    }
    setError(null)
  }, [open, initial, defaultWishlist])

  if (!open) return null

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

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Fermer"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
      >
        <h2 className="font-display text-xl font-semibold text-ink">
          {initial ? 'Modifier le jeu' : 'Ajouter un jeu'}
        </h2>

        <div className="mt-5 space-y-3">
          <Field label="Nom">
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="field"
              placeholder="Streets of Rage 2"
            />
          </Field>

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
              {consoleNames.map((n) => (
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

      <style>{`
        .field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-line);
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .field:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-accent) 20%, transparent);
        }
      `}</style>
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
