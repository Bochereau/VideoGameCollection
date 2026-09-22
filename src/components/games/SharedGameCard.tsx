import type { Game } from '@/types'
import { EDITION_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types'
import { cardCoverUrl } from '@/lib/coverUrl'
import { ConsoleMark } from '@/components/games/ConsoleMark'

type Props = {
  game: Game
  index: number
  logo?: string | null
}

export function SharedGameCard({ game, index, logo }: Props) {
  const priority = game.priority ?? 3

  return (
    <article
      className="animate-fade-up relative flex flex-col rounded-xl border border-line bg-surface-elevated shadow-md shadow-black/25 backdrop-blur-md"
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
            <span className="font-display text-xl tracking-wide text-accent/30">
              VGC
            </span>
          </div>
        )}
        <span className="absolute top-2 left-2 z-10 max-w-[calc(100%-2.75rem)] rounded-md bg-bg/80 px-1.5 py-0.5 text-[0.65rem] font-medium text-amber backdrop-blur-sm">
          <ConsoleMark
            name={game.hardware}
            logo={logo}
            logoClassName="h-3.5 max-w-7"
          />
        </span>
        <span
          className={`absolute top-2 right-2 z-10 inline-flex size-8 items-center justify-center rounded-full bg-bg/75 backdrop-blur-sm ${PRIORITY_COLORS[priority]}`}
          title={`Priorité : ${PRIORITY_LABELS[priority]}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-2.5">
        <h3 className="mb-1 line-clamp-2 text-xs leading-snug font-semibold text-ink sm:text-sm">
          {game.name}
        </h3>
        <dl className="space-y-0.5 text-xs text-ink-muted">
          {game.developer ? (
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-accent/70">Studio</dt>
              <dd className="truncate">{game.developer}</dd>
            </div>
          ) : null}
          {game.release ? (
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-accent/70">Année</dt>
              <dd>{game.release}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded bg-bg/70 px-1.5 py-0.5 text-[0.65rem] font-medium text-ink-muted">
            {game.format === 'digital' ? 'Numérique' : 'Physique'}
          </span>
          <span className="rounded bg-amber/20 px-1.5 py-0.5 text-[0.65rem] font-medium text-amber">
            {EDITION_LABELS[game.edition]}
          </span>
        </div>
      </div>
    </article>
  )
}
