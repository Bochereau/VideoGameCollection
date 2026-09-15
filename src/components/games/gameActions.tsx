import { useEffect, useId, useRef, useState } from 'react'
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

const STATUS_ORDER: GameStatus[] = ['todo', 'playing', 'finished', 'abandoned']
const PRIORITY_ORDER: GamePriority[] = [5, 4, 3, 2, 1]

function StatusIcon({ status, size = 12 }: { status: GameStatus; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    'aria-hidden': true as const,
  }
  if (status === 'finished') {
    return (
      <svg {...common}>
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
  if (status === 'playing') {
    return (
      <svg {...common}>
        <path d="M8 5v14l12-7L8 5z" fill="currentColor" />
      </svg>
    )
  }
  if (status === 'abandoned') {
    return (
      <svg {...common}>
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  // todo — cercle en attente
  return (
    <svg {...common}>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
    </svg>
  )
}

function useMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return { open, setOpen, rootRef }
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
  const { open, setOpen, rootRef } = useMenu()
  const menuId = useId()

  return (
    <div ref={rootRef} className={`relative ${compact ? 'inline-block' : 'block w-full'}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Statut : ${STATUS_LABELS[status]}`}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition ${
          compact
            ? 'px-2.5 py-1 text-[0.65rem]'
            : 'w-full px-2.5 py-1.5 text-[0.7rem]'
        } ${STATUS_STYLES[status]}`}
      >
        <StatusIcon status={status} size={compact ? 11 : 12} />
        <span>{STATUS_LABELS[status]}</span>
      </button>

      {open ? (
        <ul
          id={menuId}
          role="listbox"
          aria-label="Choisir un statut"
          className={`absolute z-30 min-w-full overflow-hidden rounded-lg border border-line bg-surface-elevated py-1 shadow-lg shadow-black/40 ${
            compact
              ? 'top-full right-0 mt-1'
              : 'bottom-full left-0 mb-1'
          }`}
        >
          {STATUS_ORDER.map((id) => (
            <li key={id} role="option" aria-selected={id === status}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition hover:bg-accent-soft ${
                  id === status ? 'text-accent' : 'text-ink'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(id)
                  setOpen(false)
                }}
              >
                <StatusIcon status={id} size={12} />
                {STATUS_LABELS[id]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
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

function BookmarkIcon({
  filled,
  size = 16,
}: {
  filled: boolean
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
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
  const { open, setOpen, rootRef } = useMenu()
  const menuId = useId()
  const value: GamePriority = priority ?? 3

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Priorité : ${PRIORITY_LABELS[value]}`}
        title={`Priorité : ${PRIORITY_LABELS[value]}`}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className={`inline-flex size-8 items-center justify-center rounded-full bg-bg/75 backdrop-blur-sm transition hover:opacity-90 ${PRIORITY_COLORS[value]}`}
      >
        <BookmarkIcon filled />
      </button>

      {open ? (
        <ul
          id={menuId}
          role="listbox"
          aria-label="Choisir une priorité"
          className="absolute top-full right-0 z-30 mt-1 min-w-[10rem] overflow-hidden rounded-lg border border-line bg-surface-elevated py-1 shadow-lg shadow-black/40"
        >
          {PRIORITY_ORDER.map((id) => (
            <li key={id} role="option" aria-selected={id === value}>
              <button
                type="button"
                className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-xs transition hover:bg-accent-soft ${
                  id === value ? 'font-semibold text-ink' : 'text-ink-muted'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(id)
                  setOpen(false)
                }}
              >
                <span className={PRIORITY_COLORS[id]}>
                  <BookmarkIcon filled size={14} />
                </span>
                {PRIORITY_LABELS[id]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
