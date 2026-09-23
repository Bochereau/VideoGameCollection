import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
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
  todo: 'bg-amber text-bg shadow-sm shadow-amber/25',
  playing: 'bg-sky-500 text-bg shadow-sm shadow-sky-500/25',
  paused: 'bg-orange-500 text-bg shadow-sm shadow-orange-500/25',
  finished: 'bg-emerald-500 text-bg shadow-sm shadow-emerald-500/25',
  abandoned: 'bg-red-500 text-bg shadow-sm shadow-red-500/25',
}

const STATUS_ORDER: GameStatus[] = [
  'todo',
  'playing',
  'paused',
  'finished',
  'abandoned',
]
const PRIORITY_ORDER: GamePriority[] = [5, 4, 3, 2, 1]

type MenuPos = { top: number; left: number; minWidth: number }

function StatusIcon({ status, size = 12 }: { status: GameStatus; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    'aria-hidden': true as const,
    className: 'block shrink-0',
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
  if (status === 'paused') {
    return (
      <svg {...common}>
        <path
          d="M8 5h3v14H8V5zm5 0h3v14h-3V5z"
          fill="currentColor"
        />
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
  // todo — timer / chronomètre
  return (
    <svg {...common}>
      <path
        d="M10 2h4M12 2v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="14"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 14V10.5M12 14l3 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function usePortalMenu(align: 'left' | 'right' = 'right') {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<MenuPos | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  function updatePos() {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const minWidth = Math.max(rect.width, 160)
    let left =
      align === 'right' ? rect.right - minWidth : rect.left
    left = Math.min(Math.max(8, left), window.innerWidth - minWidth - 8)
    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < 180 && rect.top > spaceBelow
    setPos({
      top: openUp ? rect.top - 4 : rect.bottom + 4,
      left,
      minWidth,
    })
  }

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    updatePos()
    function onScroll() {
      updatePos()
    }
    window.addEventListener('resize', updatePos)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      window.removeEventListener('resize', updatePos)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, align])

  useLayoutEffect(() => {
    if (!open || !pos || !menuRef.current || !triggerRef.current) return
    const menu = menuRef.current
    const trigger = triggerRef.current.getBoundingClientRect()
    const height = menu.getBoundingClientRect().height
    const spaceBelow = window.innerHeight - trigger.bottom
    if (spaceBelow < height + 8 && trigger.top > spaceBelow) {
      setPos((p) =>
        p ? { ...p, top: trigger.top - height - 4 } : p,
      )
    }
  }, [open, pos?.minWidth])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
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

  return { open, setOpen, rootRef, triggerRef, menuRef, pos }
}

function PortalMenu({
  id,
  label,
  pos,
  menuRef,
  children,
}: {
  id: string
  label: string
  pos: MenuPos
  menuRef: RefObject<HTMLUListElement | null>
  children: ReactNode
}) {
  return createPortal(
    <ul
      ref={menuRef}
      id={id}
      role="listbox"
      aria-label={label}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        minWidth: pos.minWidth,
      }}
      className="z-[100] overflow-hidden rounded-lg border border-line bg-bg py-1 shadow-lg shadow-black/50"
    >
      {children}
    </ul>,
    document.body,
  )
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
  const { open, setOpen, rootRef, triggerRef, menuRef, pos } = usePortalMenu(
    compact ? 'right' : 'left',
  )
  const menuId = useId()

  return (
    <div ref={rootRef} className={compact ? 'inline-block' : 'block w-full'}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Statut : ${STATUS_LABELS[status]}`}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium leading-none transition ${
          compact
            ? 'min-w-[6.75rem] px-2.5 py-1 text-[0.65rem]'
            : 'w-full px-2.5 py-1.5 text-[0.7rem]'
        } ${STATUS_STYLES[status]}`}
      >
        <StatusIcon status={status} size={compact ? 11 : 12} />
        <span className="leading-none">{STATUS_LABELS[status]}</span>
      </button>

      {open && pos ? (
        <PortalMenu
          id={menuId}
          label="Choisir un statut"
          pos={pos}
          menuRef={menuRef}
        >
          {STATUS_ORDER.map((id) => (
            <li key={id} role="option" aria-selected={id === status}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs leading-none transition hover:bg-surface ${
                  id === status
                    ? 'bg-surface font-medium text-accent'
                    : 'text-ink'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(id)
                  setOpen(false)
                }}
              >
                <StatusIcon status={id} size={12} />
                <span className="leading-none">{STATUS_LABELS[id]}</span>
              </button>
            </li>
          ))}
        </PortalMenu>
      ) : null}
    </div>
  )
}

export function ReservedNotice({
  onRelease,
  compact = false,
}: {
  onRelease: () => void
  compact?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-lg bg-amber/15 ${
        compact ? 'px-2 py-1' : 'px-2 py-1.5'
      }`}
    >
      <p className="text-[0.7rem] font-medium text-amber">Quelqu’un s’en occupe</p>
      <button
        type="button"
        onClick={onRelease}
        className="shrink-0 text-[0.65rem] font-medium text-ink-muted underline decoration-ink-muted/40 underline-offset-2 hover:text-ink"
      >
        Libérer
      </button>
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
  const { open, setOpen, rootRef, triggerRef, menuRef, pos } =
    usePortalMenu('right')
  const menuId = useId()
  const value: GamePriority = priority ?? 3

  return (
    <div ref={rootRef} className={className || 'relative inline-flex'}>
      <button
        ref={triggerRef}
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

      {open && pos ? (
        <PortalMenu
          id={menuId}
          label="Choisir une priorité"
          pos={pos}
          menuRef={menuRef}
        >
          {PRIORITY_ORDER.map((id) => (
            <li key={id} role="option" aria-selected={id === value}>
              <button
                type="button"
                className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-xs transition hover:bg-surface ${
                  id === value
                    ? 'bg-surface font-semibold text-ink'
                    : 'text-ink-muted'
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
        </PortalMenu>
      ) : null}
    </div>
  )
}
