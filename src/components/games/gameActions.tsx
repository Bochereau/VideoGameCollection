import type { Game, GamePriority, GameStatus } from '@/types'
import {
  CONDITION_LABELS,
  EDITION_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '@/types'

export function gameCopyMeta(game: Game) {
  const format = game.format === 'digital' ? 'digital' : 'physical'
  const condition =
    format === 'physical' && game.condition && game.condition in CONDITION_LABELS
      ? game.condition
      : 'none'
  const edition =
    game.edition && game.edition in EDITION_LABELS ? game.edition : 'standard'
  return { format, condition, edition }
}

const STATUS_STYLES: Record<GameStatus, string> = {
  todo: 'bg-ink-muted/15 text-ink-muted',
  playing: 'bg-sky-500/20 text-sky-400',
  finished: 'bg-emerald-500 text-bg shadow-sm shadow-emerald-500/25',
  abandoned: 'bg-rose-500/20 text-rose-400',
}

export function StatusSelect({
  status,
  onChange,
  compact = false,
}: {
  status: GameStatus
  onChange: (status: GameStatus) => void
  compact?: boolean
}) {
  return (
    <label className={compact ? 'inline-block' : 'block w-full'}>
      <span className="sr-only">Statut</span>
      <select
        className={`field cursor-pointer appearance-none border-0 font-medium transition ${
          compact
            ? '!w-auto !min-w-[6.5rem] !rounded-full !px-2.5 !py-1 !pr-7 !text-[0.65rem]'
            : 'w-full !rounded-full !px-2.5 !py-1.5 !pr-8 !text-[0.7rem]'
        } ${STATUS_STYLES[status]}`}
        value={status}
        onChange={(e) => onChange(e.target.value as GameStatus)}
        aria-label="Statut du jeu"
      >
        {(Object.keys(STATUS_LABELS) as GameStatus[]).map((id) => (
          <option key={id} value={id} className="bg-surface text-ink">
            {STATUS_LABELS[id]}
          </option>
        ))}
      </select>
    </label>
  )
}

export function AddToCollectionButton({
  onClick,
  compact = false,
}: {
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full bg-accent/20 font-medium text-accent transition hover:bg-accent hover:text-bg ${
        compact
          ? 'px-2.5 py-1 text-[0.65rem] whitespace-nowrap'
          : 'w-full px-2.5 py-1.5 text-[0.7rem]'
      }`}
    >
      Ajouter à ma collection
    </button>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FavoriteButton({
  favorite,
  onClick,
  className = '',
  labelOn = 'Retirer des coups de cœur',
  labelOff = 'Coup de cœur',
  title = 'Coup de cœur',
}: {
  favorite: boolean
  onClick: () => void
  className?: string
  labelOn?: string
  labelOff?: string
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-pressed={favorite}
      aria-label={favorite ? labelOn : labelOff}
      title={title}
      className={`inline-flex size-8 items-center justify-center rounded-full transition ${
        favorite
          ? 'bg-bg/75 text-[#f07178] shadow-sm backdrop-blur-sm hover:text-[#ff8a90]'
          : 'bg-bg/75 text-ink-muted backdrop-blur-sm hover:text-[#f07178]'
      } ${className}`}
    >
      <HeartIcon filled={favorite} />
    </button>
  )
}

export function PriorityButton({
  priority,
  onChange,
  className = '',
}: {
  priority: GamePriority | null
  onChange: (priority: GamePriority) => void
  className?: string
}) {
  const value: GamePriority = priority ?? 3
  // Cycle high → low: 5 → 4 → 3 → 2 → 1 → 5
  const cycleDown = (value === 1 ? 5 : value - 1) as GamePriority

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onChange(cycleDown)
      }}
      aria-label={`Priorité : ${PRIORITY_LABELS[value]}. Cliquer pour changer.`}
      title={`Priorité : ${PRIORITY_LABELS[value]}`}
      className={`inline-flex size-8 items-center justify-center rounded-full bg-bg/75 backdrop-blur-sm transition hover:opacity-90 ${PRIORITY_COLORS[value]} ${className}`}
    >
      <BookmarkIcon filled />
    </button>
  )
}
