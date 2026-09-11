import type { Game } from '@/types'
import { CONDITION_LABELS, EDITION_LABELS } from '@/types'

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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function FinishedButton({
  finished,
  onClick,
  compact = false,
}: {
  finished: boolean
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={finished}
      className={`group/done inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition ${
        compact ? 'px-2.5 py-1 text-[0.65rem]' : 'w-full px-2.5 py-1.5 text-[0.7rem]'
      } ${
        finished
          ? 'bg-emerald-500 text-bg shadow-sm shadow-emerald-500/25'
          : 'bg-ink-muted/15 text-ink-muted hover:bg-ink-muted/25 hover:text-ink'
      }`}
    >
      {finished ? (
        <CheckIcon />
      ) : (
        <span className="relative size-3">
          <CrossIcon className="absolute inset-0 transition group-hover/done:opacity-0" />
          <CheckIcon className="absolute inset-0 opacity-0 transition group-hover/done:opacity-100" />
        </span>
      )}
      <span>
        Terminé
        {!finished ? (
          <span className="hidden group-hover/done:inline" aria-hidden>
            {' '}
            ?
          </span>
        ) : null}
      </span>
    </button>
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
