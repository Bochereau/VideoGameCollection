import type { DragEvent } from 'react'
import type { TopEntry } from '@/types'
import { cardCoverUrl } from '@/lib/coverUrl'
import { Button } from '@/components/ui/Button'

type TopSlotItem = TopEntry | null

type SlotProps = {
  rank: number
  entry: TopSlotItem
  draggingRank: number | null
  dropTargetRank: number | null
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
  draggingRank,
  dropTargetRank,
  onPick,
  onClear,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: SlotProps) {
  const isDragging = draggingRank === rank
  const isDropTarget = dropTargetRank === rank && draggingRank !== rank

  return (
    <article
      draggable={Boolean(entry)}
      onDragStart={(e) => {
        if (!entry) {
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
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-surface-elevated shadow-md shadow-black/25 backdrop-blur-md transition ${
        isDragging ? 'opacity-40' : ''
      } ${
        isDropTarget
          ? 'border-accent ring-2 ring-accent/40'
          : 'border-line hover:border-accent/40'
      }`}
    >
      <button
        type="button"
        onClick={() => onPick(rank)}
        className="relative block h-36 w-full overflow-hidden bg-bg text-left sm:h-40"
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
            <span className="font-display text-3xl tracking-wide text-accent/35">
              #{rank}
            </span>
            {!entry ? (
              <span className="text-xs text-ink-muted">Ajouter un jeu</span>
            ) : null}
          </div>
        )}

        <span className="absolute top-2 left-2 z-10 rounded-md bg-bg/85 px-1.5 py-0.5 text-xs font-semibold text-amber backdrop-blur-sm">
          #{rank}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-h-[2.75rem]">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-ink">
            {entry?.name ?? 'Place libre'}
          </h3>
          {entry?.release ? (
            <p className="mt-0.5 text-xs text-ink-muted">{entry.release}</p>
          ) : null}
        </div>

        <div className="mt-auto flex gap-1.5">
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
      </div>
    </article>
  )
}

type GridProps = {
  size: number
  entries: TopEntry[]
  draggingRank: number | null
  dropTargetRank: number | null
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
  onPick,
  onClear,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: GridProps) {
  const byRank = new Map(entries.map((e) => [e.rank, e]))

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: size }, (_, i) => {
        const rank = i + 1
        return (
          <TopSlot
            key={rank}
            rank={rank}
            entry={byRank.get(rank) ?? null}
            draggingRank={draggingRank}
            dropTargetRank={dropTargetRank}
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
