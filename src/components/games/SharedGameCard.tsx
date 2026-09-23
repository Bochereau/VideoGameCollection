import type { Game } from '@/types'
import { cardCoverUrl } from '@/lib/coverUrl'
import { consoleShortName } from '@/lib/consoleShortName'

type Props = {
  game: Game
  index: number
  mineName?: string
  busy?: boolean
  onClaim: () => void
  onCancel: () => void
}

export function SharedGameCard({
  game,
  index,
  mineName,
  busy = false,
  onClaim,
  onCancel,
}: Props) {
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
        <span
          title={game.hardware}
          className="absolute top-2 left-2 z-10 inline-flex h-8 max-w-[calc(100%-1rem)] items-center truncate rounded-full bg-bg/80 px-2.5 text-xs font-medium text-amber backdrop-blur-sm"
        >
          {consoleShortName(game.hardware)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-2.5">
        <h3 className="line-clamp-2 text-xs leading-snug font-semibold text-ink sm:text-sm">
          {game.name}
        </h3>
        <div className="mt-2">
          <span className="rounded bg-bg/70 px-1.5 py-0.5 text-[0.65rem] font-medium text-ink-muted">
            {game.format === 'digital' ? 'Numérique' : 'Physique'}
          </span>
        </div>
        <div className="mt-auto pt-2.5">
          {mineName ? (
            <div className="space-y-1.5">
              <p className="text-center text-[0.7rem] font-medium text-amber">
                Réservé par {mineName}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={onCancel}
                className="w-full rounded-full px-2.5 py-1.5 text-[0.7rem] font-medium text-ink-muted transition hover:bg-ink/5 hover:text-ink disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          ) : game.reserved ? (
            <p className="rounded-full bg-ink/5 px-2.5 py-1.5 text-center text-[0.7rem] font-medium text-ink-muted">
              Déjà réservé
            </p>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={onClaim}
              className="w-full rounded-full bg-accent/20 px-2.5 py-1.5 text-[0.7rem] font-medium text-accent transition hover:bg-accent hover:text-bg disabled:opacity-50"
            >
              Je m’en occupe
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
