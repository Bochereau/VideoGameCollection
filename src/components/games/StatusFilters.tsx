import type {
  ConditionFilter,
  EditionFilter,
  FavoriteFilter,
  FormatFilter,
  SortKey,
  StatusFilter,
} from '@/types'
import { CONDITION_LABELS, EDITION_LABELS, STATUS_LABELS } from '@/types'
import { Button } from '@/components/ui/Button'
import { FavoriteButton } from '@/components/games/gameActions'

type Props = {
  wishlist: boolean
  status: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  format: FormatFilter
  onFormatChange: (value: FormatFilter) => void
  condition: ConditionFilter
  onConditionChange: (value: ConditionFilter) => void
  edition: EditionFilter
  onEditionChange: (value: EditionFilter) => void
  favorite: FavoriteFilter
  onFavoriteChange: (value: FavoriteFilter) => void
  showSort: boolean
  sort: SortKey
  onSortChange: (value: SortKey) => void
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
  wishlist,
  status,
  onStatusChange,
  format,
  onFormatChange,
  condition,
  onConditionChange,
  edition,
  onEditionChange,
  favorite,
  onFavoriteChange,
  showSort,
  sort,
  onSortChange,
  onAdd,
  addLabel,
}: Props) {
  const favoritesOnly = favorite === 'yes'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={onAdd}>{addLabel}</Button>

      {!wishlist ? (
        <FilterSelect
          label="Statut"
          value={status}
          onChange={(v) => onStatusChange(v as StatusFilter)}
          options={[
            { id: 'all', label: 'Statut : tous' },
            ...Object.entries(STATUS_LABELS).map(([id, label]) => ({
              id,
              label: `Statut : ${label.toLowerCase()}`,
            })),
          ]}
        />
      ) : null}

      {showSort ? (
        <FilterSelect
          label="Tri"
          value={sort}
          onChange={(v) => onSortChange(v as SortKey)}
          options={[
            { id: 'name', label: 'Tri : A→Z' },
            { id: 'priority', label: 'Tri : Priorité' },
          ]}
        />
      ) : null}

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

      {!wishlist ? (
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
      ) : null}

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

      {!wishlist ? (
        <FavoriteButton
          favorite={favoritesOnly}
          onClick={() => onFavoriteChange(favoritesOnly ? 'all' : 'yes')}
          labelOn="Afficher tous les jeux"
          labelOff="Afficher les coups de cœur"
          title="Filtrer les coups de cœur"
          className="ml-auto !bg-surface/80 !backdrop-blur-md border border-line"
        />
      ) : null}
    </div>
  )
}
