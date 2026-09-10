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

      <FilterSelect
        label="Statut"
        value={status}
        onChange={(v) => onStatusChange(v as FinishedFilter)}
        options={[
          { id: 'all', label: 'Statut : tous' },
          { id: 'finished', label: 'Statut : terminés' },
          { id: 'todo', label: 'Statut : à faire' },
        ]}
      />

      <FilterSelect
        label="Format"
        value={format}
        onChange={(v) => onFormatChange(v as FormatFilter)}
        options={[
          { id: 'all', label: 'Format : tous' },
          { id: 'physical', label: 'Format : physique' },
          { id: 'digital', label: 'Format : numérique' },
        ]}
      />

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
