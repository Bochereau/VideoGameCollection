import type { TopColumnsPerRow } from '@/types'
import { TOP_COLUMNS_CHOICES } from '@/types'

type Props = {
  value: TopColumnsPerRow
  onChange: (value: TopColumnsPerRow) => void
}

export function ColumnsPerRowToggle({ value, onChange }: Props) {
  return (
    <div
      className="flex shrink-0 items-center gap-1.5"
      role="group"
      aria-label="Jeux par ligne"
    >
      <span className="hidden text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase sm:inline">
        Par ligne
      </span>
      <div className="flex gap-1 rounded-xl border border-line bg-surface/80 p-1 backdrop-blur-md">
        {TOP_COLUMNS_CHOICES.map((count) => {
          const selected = value === count
          return (
            <button
              key={count}
              type="button"
              onClick={() => onChange(count)}
              aria-pressed={selected}
              title={`${count} jeux par ligne`}
              className={`min-w-8 rounded-lg px-2 py-1.5 text-sm font-medium tabular-nums transition ${
                selected
                  ? 'bg-accent text-bg shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {count}
            </button>
          )
        })}
      </div>
    </div>
  )
}
