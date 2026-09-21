import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import {
  DEFAULT_TOP_EXPORT_OPTIONS,
  TOP_EXPORT_COLUMN_CHOICES,
  hasAnyExportLayer,
  readExportOptions,
  writeExportOptions,
  type TopExportColumns,
  type TopExportLayers,
  type TopExportOptions,
} from '@/lib/exportTopImage'

type Props = {
  open: boolean
  busy?: boolean
  columnsPerRow?: TopExportColumns
  onClose: () => void
  onExport: (options: TopExportOptions) => Promise<void>
}

const LAYER_OPTIONS: { key: keyof TopExportLayers; label: string }[] = [
  { key: 'rank', label: 'Numéro' },
  { key: 'name', label: 'Nom' },
  { key: 'cover', label: 'Jaquette' },
  { key: 'release', label: 'Date de sortie' },
]

export function ExportTopModal({
  open,
  busy = false,
  columnsPerRow,
  onClose,
  onExport,
}: Props) {
  const [options, setOptions] = useState<TopExportOptions>(DEFAULT_TOP_EXPORT_OPTIONS)
  const [error, setError] = useState<string | null>(null)
  const allRef = useRef<HTMLInputElement>(null)

  const allOn =
    options.rank && options.name && options.cover && options.release
  const someOn = hasAnyExportLayer(options)

  useEffect(() => {
    if (!open) return
    const stored = readExportOptions()
    setOptions({
      ...stored,
      columns: columnsPerRow ?? stored.columns,
    })
    setError(null)
  }, [open, columnsPerRow])

  useEffect(() => {
    if (allRef.current) {
      allRef.current.indeterminate = someOn && !allOn
    }
  }, [allOn, someOn, open])

  if (!open) return null

  function toggle(key: keyof TopExportLayers, checked: boolean) {
    setOptions((prev) => ({ ...prev, [key]: checked }))
  }

  function toggleAll(checked: boolean) {
    setOptions((prev) => ({
      ...prev,
      rank: checked,
      name: checked,
      cover: checked,
      release: checked,
    }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!hasAnyExportLayer(options)) {
      setError('Cochez au moins un élément.')
      return
    }
    setError(null)
    writeExportOptions(options)
    try {
      await onExport(options)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export impossible')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label="Fermer"
        onClick={onClose}
        disabled={busy}
      />
      <form
        onSubmit={(e) => void submit(e)}
        className="animate-fade-up relative z-10 w-full max-w-md rounded-t-2xl border border-line bg-surface p-5 shadow-xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl tracking-wide text-ink">
              Exporter l’image
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Choisissez ce qui apparaît sur chaque carte.
            </p>
          </div>
          <button
            type="button"
            className="text-ink-muted hover:text-ink"
            onClick={onClose}
            disabled={busy}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <fieldset className="space-y-2" disabled={busy}>
          <legend className="sr-only">Éléments à exporter</legend>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-bg/50 px-3 py-2.5 text-sm font-medium text-ink">
            <input
              ref={allRef}
              type="checkbox"
              checked={allOn}
              onChange={(e) => toggleAll(e.target.checked)}
              className="accent-accent"
            />
            Tout exporter
          </label>
          <ul className="space-y-1 pl-1">
            {LAYER_OPTIONS.map((option) => (
              <li key={option.key}>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-accent-soft/40">
                  <input
                    type="checkbox"
                    checked={options[option.key]}
                    onChange={(e) => toggle(option.key, e.target.checked)}
                    className="accent-accent"
                  />
                  {option.label}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="mt-4" disabled={busy}>
          <legend className="mb-2 text-xs font-medium text-ink-muted">
            Jeux par ligne
          </legend>
          <div className="grid grid-cols-4 gap-2">
            {TOP_EXPORT_COLUMN_CHOICES.map((count) => {
              const selected = options.columns === count
              return (
                <label
                  key={count}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-sm font-medium transition ${
                    selected
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-line text-ink hover:border-accent/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="export-columns"
                    value={count}
                    checked={selected}
                    onChange={() =>
                      setOptions((prev) => ({ ...prev, columns: count }))
                    }
                    className="sr-only"
                  />
                  {count}
                </label>
              )
            })}
          </div>
        </fieldset>

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
            Annuler
          </Button>
          <Button type="submit" disabled={busy || !someOn}>
            {busy ? 'Export…' : 'Exporter'}
          </Button>
        </div>
      </form>
    </div>
  )
}
