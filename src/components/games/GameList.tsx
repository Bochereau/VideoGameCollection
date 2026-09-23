import { Fragment } from 'react'
import type { Game, GamePriority, GameStatus, GroupBy } from '@/types'
import { CONDITION_LABELS, EDITION_LABELS } from '@/types'
import { Button } from '@/components/ui/Button'
import {
  AddToCollectionButton,
  FavoriteButton,
  PriorityButton,
  ReservedNotice,
  StatusSelect,
  gameCopyMeta,
} from '@/components/games/gameActions'
import {
  groupGamesByPriority,
  groupGamesByYear,
  SegmentHeading,
} from '@/components/games/priorityGroups'
import { cardCoverUrl } from '@/lib/coverUrl'

type Props = {
  games: Game[]
  wishlist: boolean
  groupBy?: GroupBy
  onEdit: (game: Game) => void
  onStatusChange: (game: Game, status: GameStatus) => void
  onPriorityChange: (game: Game, priority: GamePriority) => void
  onToggleFavorite: (game: Game) => void
  onAddToCollection: (game: Game) => void
  onReleaseReservation: (game: Game) => void
  onDelete: (game: Game) => void
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 7h14M10 11v6M14 11v6M9 7V5h6v2M7 7l1 12h8l1-12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function GameRow({
  game,
  index,
  wishlist,
  onEdit,
  onStatusChange,
  onPriorityChange,
  onToggleFavorite,
  onAddToCollection,
  onReleaseReservation,
  onDelete,
}: {
  game: Game
  index: number
  wishlist: boolean
  onEdit: (game: Game) => void
  onStatusChange: (game: Game, status: GameStatus) => void
  onPriorityChange: (game: Game, priority: GamePriority) => void
  onToggleFavorite: (game: Game) => void
  onAddToCollection: (game: Game) => void
  onReleaseReservation: (game: Game) => void
  onDelete: (game: Game) => void
}) {
  const { format, condition, edition } = gameCopyMeta(game)
  const showPriority = wishlist || game.status === 'todo'
  const showFavorite = !wishlist && game.status === 'finished'

  return (
    <tr
      className="animate-fade-up border-b border-line/60 last:border-b-0 transition hover:bg-accent-soft/40"
      style={{ animationDelay: `${Math.min(index, 20) * 20}ms` }}
    >
      <td className="w-12 px-3 py-2">
        <div className="aspect-[3/4] w-10 overflow-hidden rounded bg-bg">
          {game.cover ? (
            <img
              src={cardCoverUrl(game.cover) ?? game.cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-[0.55rem] tracking-wide text-accent/30">
                VGC
              </span>
            </div>
          )}
        </div>
      </td>
      <td className="px-3 py-2.5 font-semibold text-ink">
        <div>{game.name}</div>
        {wishlist && game.reserved ? (
          <div className="mt-1 max-w-56">
            <ReservedNotice
              compact
              onRelease={() => onReleaseReservation(game)}
            />
          </div>
        ) : null}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-amber">
        {game.hardware}
      </td>
      <td className="hidden max-w-[10rem] truncate px-3 py-2.5 text-ink-muted md:table-cell">
        {game.developer || '—'}
      </td>
      <td className="px-3 py-2.5 tabular-nums text-ink-muted">
        {game.release || '—'}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-ink-muted">
        {format === 'digital' ? 'Numérique' : 'Physique'}
      </td>
      {!wishlist ? (
        <td className="hidden px-3 py-2.5 whitespace-nowrap text-accent lg:table-cell">
          {format === 'physical' ? CONDITION_LABELS[condition] : '—'}
        </td>
      ) : null}
      <td className="hidden px-3 py-2.5 whitespace-nowrap text-amber lg:table-cell">
        {EDITION_LABELS[edition]}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1.5">
          <div className="flex w-8 shrink-0 items-center justify-center">
            {showPriority ? (
              <PriorityButton
                priority={game.priority}
                onChange={(p) => onPriorityChange(game, p)}
              />
            ) : showFavorite ? (
              <FavoriteButton
                favorite={game.favorite}
                onClick={() => onToggleFavorite(game)}
              />
            ) : null}
          </div>
          {wishlist ? (
            <AddToCollectionButton
              compact
              onClick={() => onAddToCollection(game)}
            />
          ) : (
            <StatusSelect
              compact
              status={game.status}
              onChange={(status) => onStatusChange(game, status)}
            />
          )}
          <Button
            variant="secondary"
            className="!px-2 !py-1 !text-xs"
            onClick={() => onEdit(game)}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            className="!bg-danger/80 !px-2 !py-1 !text-bg hover:!bg-danger"
            onClick={() => onDelete(game)}
            aria-label="Supprimer"
          >
            <TrashIcon />
          </Button>
        </div>
      </td>
    </tr>
  )
}

export function GameList({
  games,
  wishlist,
  groupBy = 'none',
  onEdit,
  onStatusChange,
  onPriorityChange,
  onToggleFavorite,
  onAddToCollection,
  onReleaseReservation,
  onDelete,
}: Props) {
  const colCount = wishlist ? 8 : 9
  const rowProps = {
    wishlist,
    onEdit,
    onStatusChange,
    onPriorityChange,
    onToggleFavorite,
    onAddToCollection,
    onReleaseReservation,
    onDelete,
  }

  let rowIndex = 0
  const segments =
    groupBy === 'priority'
      ? groupGamesByPriority(games)
      : groupBy === 'year'
        ? groupGamesByYear(games)
        : null

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface/60 backdrop-blur-md">
      <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase">
            <th className="w-12 px-3 py-2.5 font-medium">
              <span className="sr-only">Jaquette</span>
            </th>
            <th className="px-3 py-2.5 font-medium">Jeu</th>
            <th className="px-3 py-2.5 font-medium">Console</th>
            <th className="hidden px-3 py-2.5 font-medium md:table-cell">Studio</th>
            <th className="px-3 py-2.5 font-medium">Année</th>
            <th className="px-3 py-2.5 font-medium">Format</th>
            {!wishlist ? (
              <th className="hidden px-3 py-2.5 font-medium lg:table-cell">État</th>
            ) : null}
            <th className="hidden px-3 py-2.5 font-medium lg:table-cell">Édition</th>
            <th className="px-3 py-2.5 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {segments
            ? segments.map((segment) => (
                <Fragment key={segment.key}>
                  <tr className="bg-bg/50">
                    <td colSpan={colCount} className="px-3 py-2.5">
                      <SegmentHeading
                        label={segment.label}
                        count={segment.games.length}
                        accentClass={segment.accentClass}
                        dotClass={segment.dotClass}
                      />
                    </td>
                  </tr>
                  {segment.games.map((game) => {
                    const index = rowIndex++
                    return (
                      <GameRow
                        key={game.id}
                        game={game}
                        index={index}
                        {...rowProps}
                      />
                    )
                  })}
                </Fragment>
              ))
            : games.map((game, index) => (
                <GameRow
                  key={game.id}
                  game={game}
                  index={index}
                  {...rowProps}
                />
              ))}
        </tbody>
      </table>
    </div>
  )
}
