import type {
  ConditionFilter,
  EditionFilter,
  FinishedFilter,
  FormatFilter,
} from '@/types'
import { CONDITION_LABELS, EDITION_LABELS } from '@/types'
import { Button } from '@/components/ui/Button'

type Props = {
  status: FinishedFilter
  onStatusChange: (value: FinishedFilter) => void
  format: FormatFilter
  onFormatChange: (value: FormatFilter) => void
  condition: ConditionFilter
  onConditionChange: (value: ConditionFilter) => void
  edition: EditionFilter
  onEditionChange: (value: EditionFilter) => void
  onAdd: () => void
  addLabel: string
}

const statusOptions: { id: FinishedFilter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'finished', label: 'Terminés' },
  { id: 'todo', label: 'À faire' },
]

const formatOptions: { id: FormatFilter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'physical', label: 'Physique' },
  { id: 'digital', label: 'Numérique' },
]

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm transition ${
        active ? 'bg-accent text-bg shadow-sm' : 'text-ink-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  disabled,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  options: { id: string; label: string }[]
}) {
  return (
    <label
      className={`flex min-w-[8.5rem] items-center gap-2 ${disabled ? 'opacity-40' : ''}`}
    >
      <span className="sr-only">{label}</span>
      <select
        className="field !w-auto !py-1.5 !pr-8 text-sm"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function StatusFilters({
  status,
  onStatusChange,
  format,
  onFormatChange,
  condition,
  onConditionChange,
  edition,
  onEditionChange,
  onAdd,
  addLabel,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={onAdd}>{addLabel}</Button>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase">
          Statut
        </span>
        <div className="flex flex-wrap gap-1 rounded-xl border border-line bg-surface/80 p-1 backdrop-blur-md">
          {statusOptions.map((opt) => (
            <Chip
              key={opt.id}
              active={status === opt.id}
              onClick={() => onStatusChange(opt.id)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase">
          Format
        </span>
        <div className="flex flex-wrap gap-1 rounded-xl border border-line bg-surface/80 p-1 backdrop-blur-md">
          {formatOptions.map((opt) => (
            <Chip
              key={opt.id}
              active={format === opt.id}
              onClick={() => onFormatChange(opt.id)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      <FilterSelect
        label="État"
        value={condition}
        disabled={format === 'digital'}
        onChange={(v) => onConditionChange(v as ConditionFilter)}
        options={[
          { id: 'all', label: 'État : tous' },
          ...Object.entries(CONDITION_LABELS).map(([id, label]) => ({
            id,
            label: `État : ${label}`,
          })),
        ]}
      />

      <FilterSelect
        label="Édition"
        value={edition}
        onChange={(v) => onEditionChange(v as EditionFilter)}
        options={[
          { id: 'all', label: 'Édition : toutes' },
          ...Object.entries(EDITION_LABELS).map(([id, label]) => ({
            id,
            label: `Édition : ${label}`,
          })),
        ]}
      />
    </div>
  )
}
