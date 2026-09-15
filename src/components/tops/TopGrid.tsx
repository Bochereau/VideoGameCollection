import type { DragEvent } from 'react'
import type { TopEntry } from '@/types'
import { cardCoverUrl } from '@/lib/coverUrl'
import { Button } from '@/components/ui/Button'

type TopSlotItem = TopEntry | null

type SlotProps = {
  rank: number
  entry: TopSlotItem
  isDropTarget: boolean
  isMovedCard: boolean
  previewing: boolean
  onPick: (rank: number) => void
  onClear: (rank: number) => void
  onDragStart: (rank: number) => void
  onDragOver: (rank: number, e: DragEvent) => void
  onDrop: (rank: number) => void
  onDragEnd: () => void
}

export function TopSlot({
  rank,
  entry,
  isDropTarget,
  isMovedCard,
  previewing,
  onPick,
  onClear,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: SlotProps) {
  return (
    <article
      draggable={Boolean(entry) && !previewing}
      onDragStart={(e) => {
        if (!entry || previewing) {
          e.preventDefault()
          return
        }
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', String(rank))
        onDragStart(rank)
      }}
      onDragOver={(e) => onDragOver(rank, e)}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(rank)
      }}
      onDragEnd={onDragEnd}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-surface-elevated shadow-md shadow-black/25 backdrop-blur-md transition duration-200 ${
        isMovedCard ? 'scale-[1.02] border-accent ring-2 ring-accent/50' : ''
      } ${
        isDropTarget && !isMovedCard
          ? 'border-accent/70 ring-1 ring-accent/30'
          : !isMovedCard
            ? 'border-line hover:border-accent/40'
            : ''
      } ${previewing && !isMovedCard ? 'opacity-90' : ''}`}
    >
      <div className="flex shrink-0 items-center justify-center border-b border-line bg-bg px-2 py-1.5">
        <span className="text-sm font-bold tracking-wide text-accent tabular-nums">
          #{rank}
        </span>
      </div>

      <div className="relative h-32 overflow-hidden bg-bg sm:h-36">
        <button
          type="button"
          onClick={() => onPick(rank)}
          className="absolute inset-0 block w-full text-left"
          aria-label={entry ? `Modifier la place ${rank}` : `Remplir la place ${rank}`}
        >
          {entry?.cover ? (
            <img
              src={cardCoverUrl(entry.cover) ?? entry.cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 px-3">
              <span className="text-xs text-ink-muted">
                {entry ? 'Sans jaquette' : 'Ajouter un jeu'}
              </span>
            </div>
          )}
        </button>

        {!previewing ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex gap-1.5 bg-gradient-to-t from-bg/90 via-bg/55 to-transparent p-2 pt-8 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 [&_button]:pointer-events-auto">
            <Button
              variant="secondary"
              className="flex-1 !px-2 !py-1 !text-xs"
              onClick={() => onPick(rank)}
            >
              {entry ? 'Remplacer' : 'Choisir'}
            </Button>
            {entry ? (
              <Button
                variant="danger"
                className="!bg-danger/80 !px-2 !py-1 !text-bg hover:!bg-danger"
                onClick={() => onClear(rank)}
                aria-label={`Retirer la place ${rank}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 7h14M10 11v6M14 11v6M9 7V5h6v2M7 7l1 12h8l1-12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-ink">
          {entry?.name ?? 'Place libre'}
        </h3>
        {entry?.release ? (
          <p className="mt-0.5 text-xs text-ink-muted">{entry.release}</p>
        ) : null}
      </div>
    </article>
  )
}

type GridProps = {
  size: number
  entries: TopEntry[]
  draggingRank: number | null
  dropTargetRank: number | null
  previewEntries: TopEntry[] | null
  onPick: (rank: number) => void
  onClear: (rank: number) => void
  onDragStart: (rank: number) => void
  onDragOver: (rank: number, e: DragEvent) => void
  onDrop: (rank: number) => void
  onDragEnd: () => void
}

export function TopGrid({
  size,
  entries,
  draggingRank,
  dropTargetRank,
  previewEntries,
  onPick,
  onClear,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: GridProps) {
  const previewing = previewEntries != null
  const display = previewEntries ?? entries
  const byRank = new Map(display.map((e) => [e.rank, e]))

  // Identity of the dragged game (stable across preview ranks)
  const draggedEntry =
    draggingRank != null
      ? entries.find((e) => e.rank === draggingRank) ?? null
      : null

  const dense = size > 15
  const gridClass = dense
    ? 'grid grid-cols-2 gap-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10'
    : 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

  return (
    <div className={gridClass}>
      {Array.from({ length: size }, (_, i) => {
        const rank = i + 1
        const entry = byRank.get(rank) ?? null
        const isMovedCard =
          previewing &&
          dropTargetRank === rank &&
          Boolean(
            draggedEntry &&
              entry &&
              ((draggedEntry.gameId && entry.gameId === draggedEntry.gameId) ||
                (draggedEntry.rawgId && entry.rawgId === draggedEntry.rawgId) ||
                (entry.name === draggedEntry.name &&
                  entry.release === draggedEntry.release &&
                  entry.cover === draggedEntry.cover)),
          )

        return (
          <TopSlot
            key={rank}
            rank={rank}
            entry={entry}
            isDropTarget={dropTargetRank === rank && draggingRank !== rank}
            isMovedCard={Boolean(isMovedCard)}
            previewing={previewing}
            onPick={onPick}
            onClear={onClear}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
          />
        )
      })}
    </div>
  )
}
