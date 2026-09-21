import type { CSSProperties } from 'react'
import type { Game, GamePriority, GameStatus, GroupBy } from '@/types'
import type { GamesViewMode } from '@/types/view'
import { GameCard } from '@/components/games/GameCard'
import { GameList } from '@/components/games/GameList'
import {
  groupGamesByPriority,
  groupGamesByYear,
  SegmentHeading,
  type GameSegment,
} from '@/components/games/priorityGroups'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

export type { GamesViewMode }

const CARD_GRID = 'game-card-grid'

type Props = {
  games: Game[]
  viewMode: GamesViewMode
  columnsPerRow: number
  wishlist: boolean
  groupBy?: GroupBy
  emptyTitle: string
  emptyDescription: string
  onAdd: () => void
  onEdit: (game: Game) => void
  onStatusChange: (game: Game, status: GameStatus) => void
  onPriorityChange: (game: Game, priority: GamePriority) => void
  onToggleFavorite: (game: Game) => void
  onAddToCollection: (game: Game) => void
  onDelete: (game: Game) => void
}

function segmentsFor(games: Game[], groupBy: GroupBy): GameSegment[] | null {
  if (groupBy === 'priority') return groupGamesByPriority(games)
  if (groupBy === 'year') return groupGamesByYear(games)
  return null
}

export function GameGrid({
  games,
  viewMode,
  columnsPerRow,
  wishlist,
  groupBy = 'none',
  emptyTitle,
  emptyDescription,
  onAdd,
  onEdit,
  onStatusChange,
  onPriorityChange,
  onToggleFavorite,
  onAddToCollection,
  onDelete,
}: Props) {
  if (games.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={<Button onClick={onAdd}>Ajouter un jeu</Button>}
      />
    )
  }

  const shared = {
    wishlist,
    onEdit,
    onStatusChange,
    onPriorityChange,
    onToggleFavorite,
    onAddToCollection,
    onDelete,
  }

  if (viewMode === 'list') {
    return <GameList games={games} groupBy={groupBy} {...shared} />
  }

  const segments = segmentsFor(games, groupBy)
  const gridStyle = { '--game-cols': columnsPerRow } as CSSProperties

  if (!segments) {
    return (
      <div className={CARD_GRID} style={gridStyle}>
        {games.map((game, index) => (
          <GameCard key={game.id} game={game} index={index} {...shared} />
        ))}
      </div>
    )
  }

  let cardIndex = 0

  return (
    <div className="space-y-6">
      {segments.map((segment) => (
        <section key={segment.key} className="space-y-3">
          <SegmentHeading
            label={segment.label}
            count={segment.games.length}
            accentClass={segment.accentClass}
            dotClass={segment.dotClass}
          />
          <div className={CARD_GRID} style={gridStyle}>
            {segment.games.map((game) => {
              const index = cardIndex++
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  index={index}
                  {...shared}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
