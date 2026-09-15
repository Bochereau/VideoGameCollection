import type { Game, GamePriority } from '@/types'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '@/types'

export type PriorityGroup = {
  key: string
  priority: GamePriority
  games: Game[]
}

export type YearGroup = {
  key: string
  year: number | null
  games: Game[]
}

export type GameSegment =
  | { kind: 'priority'; key: string; label: string; accentClass: string; dotClass: string; games: Game[] }
  | { kind: 'year'; key: string; label: string; accentClass: string; dotClass: string; games: Game[] }

const PRIORITY_DOT: Record<GamePriority, string> = {
  5: 'bg-red-500',
  4: 'bg-orange-500',
  3: 'bg-amber-400',
  2: 'bg-sky-500',
  1: 'bg-ink-muted',
}

export function groupGamesByPriority(games: Game[]): GameSegment[] {
  const map = new Map<GamePriority, Game[]>()
  for (const game of games) {
    const p = (game.priority ?? 3) as GamePriority
    const list = map.get(p)
    if (list) list.push(game)
    else map.set(p, [game])
  }
  return ([5, 4, 3, 2, 1] as GamePriority[])
    .filter((p) => map.has(p))
    .map((priority) => ({
      kind: 'priority' as const,
      key: `p-${priority}`,
      label: PRIORITY_LABELS[priority],
      accentClass: PRIORITY_COLORS[priority],
      dotClass: PRIORITY_DOT[priority],
      games: map.get(priority)!,
    }))
}

/** Newest → oldest ; games without year last */
export function groupGamesByYear(games: Game[]): GameSegment[] {
  const map = new Map<number | 'none', Game[]>()
  for (const game of games) {
    const key =
      game.release != null && Number.isFinite(game.release)
        ? game.release
        : 'none'
    const list = map.get(key)
    if (list) list.push(game)
    else map.set(key, [game])
  }

  const years = [...map.keys()]
    .filter((k): k is number => k !== 'none')
    .sort((a, b) => b - a)

  const segments: GameSegment[] = years.map((year) => ({
    kind: 'year' as const,
    key: `y-${year}`,
    label: String(year),
    accentClass: 'text-amber',
    dotClass: 'bg-amber',
    games: map.get(year)!,
  }))

  if (map.has('none')) {
    segments.push({
      kind: 'year',
      key: 'y-none',
      label: 'Sans année',
      accentClass: 'text-ink-muted',
      dotClass: 'bg-ink-muted',
      games: map.get('none')!,
    })
  }

  return segments
}

export function SegmentHeading({
  label,
  count,
  accentClass,
  dotClass,
}: {
  label: string
  count: number
  accentClass: string
  dotClass: string
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-bg px-2.5 py-1 shadow-sm">
        <span
          className={`inline-flex size-2.5 shrink-0 rounded-full ${dotClass}`}
          aria-hidden
        />
        <h2 className={`text-sm font-semibold tracking-wide ${accentClass}`}>
          {label}
        </h2>
        <span className="text-xs font-medium text-ink tabular-nums">
          {count} {count === 1 ? 'jeu' : 'jeux'}
        </span>
      </div>
      <div className="h-px flex-1 bg-line" />
    </div>
  )
}

/** @deprecated use SegmentHeading */
export function PriorityHeading({
  priority,
  count,
}: {
  priority: GamePriority
  count: number
}) {
  return (
    <SegmentHeading
      label={PRIORITY_LABELS[priority]}
      count={count}
      accentClass={PRIORITY_COLORS[priority]}
      dotClass={PRIORITY_DOT[priority]}
    />
  )
}
