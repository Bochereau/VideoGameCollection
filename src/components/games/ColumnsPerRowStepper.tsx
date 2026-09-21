import { useEffect, useState } from 'react'
import {
  MAX_GAME_COLUMNS,
  MIN_GAME_COLUMNS,
  clampGameColumns,
} from '@/lib/columnsPerRow'

type Props = {
  value: number
  onChange: (value: number) => void
  showLabel?: boolean
}

export function ColumnsPerRowStepper({
  value,
  onChange,
  showLabel = true,
}: Props) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  function commit(raw: string) {
    const parsed = Number.parseInt(raw, 10)
    if (!Number.isFinite(parsed)) {
      setDraft(String(value))
      return
    }
    const next = clampGameColumns(parsed)
    setDraft(String(next))
    if (next !== value) onChange(next)
  }

  function step(delta: number) {
    onChange(clampGameColumns(value + delta))
  }

  return (
    <div
      className="flex w-full shrink-0 items-center gap-1.5"
      title="Nombre de cartes par ligne"
    >
      {showLabel ? (
        <span className="hidden text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase sm:inline">
          Par ligne
        </span>
      ) : null}
      <div className="flex w-full items-center justify-between gap-0.5 rounded-xl border border-line bg-bg/50 p-1">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={value <= MIN_GAME_COLUMNS}
          aria-label="Moins de cartes par ligne"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-muted transition hover:text-ink disabled:opacity-30"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 2))}
          onBlur={() => commit(draft)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commit(draft)
              ;(e.target as HTMLInputElement).blur()
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              step(1)
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              step(-1)
            }
          }}
          aria-label="Cartes par ligne"
          className="w-10 flex-1 bg-transparent text-center text-sm font-medium tabular-nums text-ink outline-none"
        />
        <button
          type="button"
          onClick={() => step(1)}
          disabled={value >= MAX_GAME_COLUMNS}
          aria-label="Plus de cartes par ligne"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-muted transition hover:text-ink disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  )
}
