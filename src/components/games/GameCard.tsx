import type { ConsoleColors, Game, GamePriority, GameStatus } from '@/types'
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
  ConditionTag,
  EditionTag,
  FORMAT_LABELS,
  GameCopyIcons,
} from '@/components/games/copyIcons'
import { cardCoverUrl } from '@/lib/coverUrl'
import { consoleShortName } from '@/lib/consoleShortName'
import { consoleBadgeClass, consoleBadgeStyle } from '@/lib/consoleColor'

type Props = {
  game: Game
  index: number
  wishlist: boolean
  consoleColors?: ConsoleColors
  onEdit: (game: Game) => void
  onStatusChange: (game: Game, status: GameStatus) => void
  onPriorityChange: (game: Game, priority: GamePriority) => void
  onToggleFavorite: (game: Game) => void
  onAddToCollection: (game: Game) => void
  onReleaseReservation: (game: Game) => void
  onDelete: (game: Game) => void
}

export function GameCard({
  game,
  index,
  wishlist,
  consoleColors,
  onEdit,
  onStatusChange,
  onPriorityChange,
  onToggleFavorite,
  onAddToCollection,
  onReleaseReservation,
  onDelete,
}: Props) {
  const { format, condition, edition } = gameCopyMeta(game)
  const showPriority = wishlist || game.status === 'todo'
  const showFavorite = !wishlist && game.status === 'finished'
  const showCondition = format === 'physical' && !wishlist && condition !== 'none'

  return (
    <article
      className="animate-fade-up group relative flex flex-col rounded-xl border border-line bg-surface-elevated shadow-md shadow-black/25 backdrop-blur-md transition duration-300 hover:border-accent/40 hover:shadow-cyan-500/10"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-bg">
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
            <span className="font-display text-xl tracking-wide text-accent/30">VGC</span>
          </div>
        )}
        <span
          title={game.hardware}
          style={consoleBadgeStyle(consoleColors)}
          className={`absolute top-2 left-2 z-10 inline-flex h-8 max-w-[calc(100%-2.75rem)] items-center truncate rounded-full px-2.5 text-xs font-semibold shadow-md shadow-black/50 ring-1 ring-black/10 backdrop-blur-sm ${consoleBadgeClass(
            consoleColors,
          )}`}
        >
          {consoleShortName(game.hardware)}
        </span>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Sur mobile les boutons restent affichés : les icônes passent au-dessus */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent transition sm:group-hover:opacity-0" />
        <div className="absolute bottom-11 left-2 transition sm:bottom-2 sm:group-hover:opacity-0">
          <GameCopyIcons
            format={format}
            condition={condition}
            edition={edition}
            showCondition={!wishlist}
          />
        </div>

        {/* Fond quasi opaque derrière le texte : seul le haut du panneau est en fondu */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 [&_button]:pointer-events-auto">
          <div className="h-8 bg-gradient-to-t from-bg/90 to-transparent" />
          <div className="flex flex-col gap-2 bg-bg/90 px-2 pb-2">
            <dl className="hidden space-y-1 text-[0.7rem] leading-snug text-ink sm:block">
              {game.developer ? (
                <div className="flex gap-1.5">
                  <dt className="shrink-0 text-accent">Studio</dt>
                  <dd className="truncate">{game.developer}</dd>
                </div>
              ) : null}
              {game.release ? (
                <div className="flex gap-1.5">
                  <dt className="shrink-0 text-accent">Année</dt>
                  <dd>{game.release}</dd>
                </div>
              ) : null}
              <div className="flex gap-1.5">
                <dt className="shrink-0 text-accent">Format</dt>
                <dd>{FORMAT_LABELS[format]}</dd>
              </div>
              {showCondition ? (
                <div className="flex gap-1.5">
                  <dt className="shrink-0 text-accent">État</dt>
                  <dd>
                    <ConditionTag condition={condition} />
                  </dd>
                </div>
              ) : null}
              <div className="flex gap-1.5">
                <dt className="shrink-0 text-accent">Édition</dt>
                <dd>
                  <EditionTag edition={edition} />
                </dd>
              </div>
            </dl>
            <div className="flex gap-1.5">
              <Button
                variant="secondary"
                className="flex-1 !px-2 !py-1 !text-xs"
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 7h14M10 11v6M14 11v6M9 7V5h6v2M7 7l1 12h8l1-12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showPriority ? (
        <PriorityButton
          priority={game.priority}
          onChange={(p) => onPriorityChange(game, p)}
          className="absolute top-2 right-2 z-20"
        />
      ) : showFavorite ? (
        <FavoriteButton
          favorite={game.favorite}
          onClick={() => onToggleFavorite(game)}
          className="absolute top-2 right-2 z-20"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-2 sm:p-2.5">
        <h3 className="line-clamp-2 text-xs leading-snug font-semibold text-ink sm:text-sm">
          {game.name}
        </h3>

        <div className="mt-auto space-y-2 pt-2.5">
          {wishlist && game.reserved ? (
            <ReservedNotice onRelease={() => onReleaseReservation(game)} />
          ) : null}
          {wishlist ? (
            <AddToCollectionButton onClick={() => onAddToCollection(game)} />
          ) : (
            <StatusSelect
              status={game.status}
              onChange={(status) => onStatusChange(game, status)}
            />
          )}
        </div>
      </div>
    </article>
  )
}
