import type { FinishedFilter } from '@/types'
import { Button } from '@/components/ui/Button'

type Props = {
  value: FinishedFilter
  onChange: (value: FinishedFilter) => void
  onAdd: () => void
  addLabel: string
}

const options: { id: FinishedFilter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'finished', label: 'Terminés' },
  { id: 'todo', label: 'À faire' },
]

export function StatusFilters({ value, onChange, onAdd, addLabel }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={onAdd}>{addLabel}</Button>
      <div className="flex flex-wrap gap-1 rounded-xl border border-line bg-surface/80 p-1 backdrop-blur-md">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              value === opt.id
                ? 'bg-accent text-bg shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
