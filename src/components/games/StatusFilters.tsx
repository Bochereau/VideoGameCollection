import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type {
  ConditionFilter,
  ConsoleItem,
  EditionFilter,
  FavoriteFilter,
  FormatFilter,
  SortKey,
  StatusFilter,
} from '@/types'
import { CONDITION_LABELS, EDITION_LABELS, STATUS_LABELS } from '@/types'
import { useVisualFrame, visualFrameStyle } from '@/lib/useVisualFrame'
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
  showPrioritySort: boolean
  sort: SortKey
  onSortChange: (value: SortKey) => void
  onAdd: () => void
  onReset: () => void
  addLabel: string
  consoles: ConsoleItem[]
  hardware: string | null
  onHardwareChange: (name: string | null) => void
  onManageConsoles: () => void
}

function FilterSelect({
  label,
  value,
  onChange,
  disabled,
  options,
  stacked = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  options: { id: string; label: string }[]
  stacked?: boolean
}) {
  return (
    <label
      className={
        stacked
          ? `block min-w-0 space-y-1 ${disabled ? 'opacity-40' : ''}`
          : `flex shrink-0 items-center gap-2 sm:min-w-[8.5rem] ${disabled ? 'opacity-40' : ''}`
      }
    >
      <span
        className={
          stacked
            ? 'text-xs font-medium tracking-wide text-ink-muted uppercase'
            : 'sr-only'
        }
      >
        {label}
      </span>
      <select
        className={stacked ? 'field' : 'field !w-auto !py-1.5 !pr-8 text-sm'}
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

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function activeFilterCount({
  wishlist,
  status,
  format,
  condition,
  edition,
  favorite,
  sort,
  hardware,
}: Pick<
  Props,
  | 'wishlist'
  | 'status'
  | 'format'
  | 'condition'
  | 'edition'
  | 'favorite'
  | 'sort'
  | 'hardware'
>) {
  let count = 0
  if (hardware) count += 1
  if (!wishlist && status !== 'all') count += 1
  if (format !== 'all') count += 1
  if (!wishlist && format !== 'digital' && condition !== 'all') count += 1
  if (edition !== 'all') count += 1
  if (!wishlist && favorite === 'yes') count += 1
  const defaultSort: SortKey = wishlist ? 'priority' : 'name'
  if (sort !== defaultSort) count += 1
  return count
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
  showPrioritySort,
  sort,
  onSortChange,
  onAdd,
  onReset,
  addLabel,
  consoles,
  hardware,
  onHardwareChange,
  onManageConsoles,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const favoritesOnly = favorite === 'yes'
  const count = activeFilterCount({
    wishlist,
    status,
    format,
    condition,
    edition,
    favorite,
    sort,
    hardware,
  })

  const sortOptions = [
    { id: 'name', label: 'A→Z' },
    { id: 'year', label: 'Année' },
    ...(showPrioritySort ? [{ id: 'priority', label: 'Priorité' }] : []),
  ]
  const sortOptionsInline = sortOptions.map((opt) => ({
    ...opt,
    label: `Tri : ${opt.label}`,
  }))

  const statusOptions = [
    { id: 'all', label: 'Tous' },
    ...Object.entries(STATUS_LABELS).map(([id, label]) => ({
      id,
      label,
    })),
  ]
  const formatOptions = [
    { id: 'all', label: 'Tous' },
    { id: 'physical', label: 'Physique' },
    { id: 'digital', label: 'Numérique' },
  ]
  const conditionOptions = [
    { id: 'all', label: 'Tous' },
    ...Object.entries(CONDITION_LABELS).map(([id, label]) => ({ id, label })),
  ]
  const editionOptions = [
    { id: 'all', label: 'Toutes' },
    ...Object.entries(EDITION_LABELS).map(([id, label]) => ({ id, label })),
  ]

  return (
    <>
      <div className="flex items-center gap-2 lg:hidden">
        <Button onClick={onAdd} className="shrink-0">
          {addLabel}
        </Button>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line bg-surface/80 px-3 py-2 text-sm font-medium text-ink transition hover:border-accent/50"
        >
          <FilterIcon />
          Filtres
          {count > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold text-bg tabular-nums">
              {count}
            </span>
          ) : null}
        </button>
      </div>

      <div className="hidden w-full min-w-0 items-center gap-2 lg:flex lg:flex-wrap lg:gap-3">
        <Button onClick={onAdd} className="shrink-0">
          {addLabel}
        </Button>

        {!wishlist ? (
          <FilterSelect
            label="Statut"
            value={status}
            onChange={(v) => onStatusChange(v as StatusFilter)}
            options={statusOptions.map((opt) => ({
              ...opt,
              label: opt.id === 'all' ? 'Statut : tous' : `Statut : ${opt.label.toLowerCase()}`,
            }))}
          />
        ) : null}

        <FilterSelect
          label="Tri"
          value={sort}
          onChange={(v) => onSortChange(v as SortKey)}
          options={sortOptionsInline}
        />

        <FilterSelect
          label="Format"
          value={format}
          onChange={(v) => onFormatChange(v as FormatFilter)}
          options={formatOptions.map((opt) => ({
            ...opt,
            label: `Format : ${opt.label.toLowerCase()}`,
          }))}
        />

        {!wishlist ? (
          <FilterSelect
            label="État"
            value={condition}
            disabled={format === 'digital'}
            onChange={(v) => onConditionChange(v as ConditionFilter)}
            options={conditionOptions.map((opt) => ({
              ...opt,
              label: opt.id === 'all' ? 'État : tous' : `État : ${opt.label}`,
            }))}
          />
        ) : null}

        <FilterSelect
          label="Édition"
          value={edition}
          onChange={(v) => onEditionChange(v as EditionFilter)}
          options={editionOptions.map((opt) => ({
            ...opt,
            label: opt.id === 'all' ? 'Édition : toutes' : `Édition : ${opt.label}`,
          }))}
        />

        {!wishlist ? (
          <FavoriteButton
            favorite={favoritesOnly}
            onClick={() => onFavoriteChange(favoritesOnly ? 'all' : 'yes')}
            labelOn="Afficher tous les jeux"
            labelOff="Afficher les coups de cœur"
            title="Filtrer les coups de cœur"
            className="shrink-0 border border-line !bg-surface/80 backdrop-blur-md sm:ml-auto"
          />
        ) : null}
      </div>

      {sheetOpen ? (
        <FilterSheet
          wishlist={wishlist}
          status={status}
          onStatusChange={onStatusChange}
          format={format}
          onFormatChange={onFormatChange}
          condition={condition}
          onConditionChange={onConditionChange}
          edition={edition}
          onEditionChange={onEditionChange}
          favorite={favorite}
          onFavoriteChange={onFavoriteChange}
          sort={sort}
          onSortChange={onSortChange}
          sortOptions={sortOptions}
          statusOptions={statusOptions}
          formatOptions={formatOptions}
          conditionOptions={conditionOptions}
          editionOptions={editionOptions}
          consoles={consoles}
          hardware={hardware}
          onHardwareChange={onHardwareChange}
          onManageConsoles={() => {
            setSheetOpen(false)
            onManageConsoles()
          }}
          onReset={onReset}
          onClose={() => setSheetOpen(false)}
        />
      ) : null}
    </>
  )
}

function FilterSheet({
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
  sort,
  onSortChange,
  sortOptions,
  statusOptions,
  formatOptions,
  conditionOptions,
  editionOptions,
  consoles,
  hardware,
  onHardwareChange,
  onManageConsoles,
  onReset,
  onClose,
}: {
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
  sort: SortKey
  onSortChange: (value: SortKey) => void
  sortOptions: { id: string; label: string }[]
  statusOptions: { id: string; label: string }[]
  formatOptions: { id: string; label: string }[]
  conditionOptions: { id: string; label: string }[]
  editionOptions: { id: string; label: string }[]
  consoles: ConsoleItem[]
  hardware: string | null
  onHardwareChange: (name: string | null) => void
  onManageConsoles: () => void
  onReset: () => void
  onClose: () => void
}) {
  const frame = useVisualFrame(true)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div
      className="animate-fade-in fixed z-50 flex min-h-0 flex-col"
      style={visualFrameStyle(frame)}
    >
      <button
        type="button"
        className="absolute inset-0 bg-bg/70 backdrop-blur-[2px]"
        aria-label="Fermer les filtres"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        className="relative z-10 flex h-full max-h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-bg shadow-2xl shadow-black/40"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
          <h2 id="filters-title" className="font-display text-2xl tracking-wide text-ink">
            Filtres
          </h2>
          <Button type="button" variant="ghost" className="!px-2 shrink-0" onClick={onClose} aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
          <div className="space-y-1">
            <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">
              Console
            </span>
            <div className="flex min-w-0 items-center gap-2">
              <select
                className="field min-w-0 flex-1"
                aria-label="Console"
                value={hardware ?? ''}
                onChange={(e) => onHardwareChange(e.target.value || null)}
              >
                <option value="">
                  Toutes ({consoles.reduce((sum, item) => sum + item.count, 0)})
                </option>
                {consoles.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name} ({item.count})
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="secondary"
                className="shrink-0"
                onClick={onManageConsoles}
              >
                Gérer
              </Button>
            </div>
          </div>
          {!wishlist ? (
            <FilterSelect
              stacked
              label="Statut"
              value={status}
              onChange={(v) => onStatusChange(v as StatusFilter)}
              options={statusOptions}
            />
          ) : null}
          <FilterSelect
            stacked
            label="Tri"
            value={sort}
            onChange={(v) => onSortChange(v as SortKey)}
            options={sortOptions}
          />
          <FilterSelect
            stacked
            label="Format"
            value={format}
            onChange={(v) => onFormatChange(v as FormatFilter)}
            options={formatOptions}
          />
          {!wishlist ? (
            <FilterSelect
              stacked
              label="État"
              value={condition}
              disabled={format === 'digital'}
              onChange={(v) => onConditionChange(v as ConditionFilter)}
              options={conditionOptions}
            />
          ) : null}
          <FilterSelect
            stacked
            label="Édition"
            value={edition}
            onChange={(v) => onEditionChange(v as EditionFilter)}
            options={editionOptions}
          />
          {!wishlist ? (
            <button
              type="button"
              aria-pressed={favorite === 'yes'}
              onClick={() => onFavoriteChange(favorite === 'yes' ? 'all' : 'yes')}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition ${
                favorite === 'yes'
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line text-ink'
              }`}
            >
              <span className="font-medium">Coups de cœur</span>
              <span className="text-xs text-ink-muted">
                {favorite === 'yes' ? 'Activé' : 'Tous les jeux'}
              </span>
            </button>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-line bg-bg px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Button type="button" variant="ghost" onClick={onReset}>
            Réinitialiser
          </Button>
          <Button type="button" onClick={onClose}>
            Voir les jeux
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
