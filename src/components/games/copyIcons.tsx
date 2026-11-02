import type { CSSProperties, ReactNode } from 'react'
import type { GameCondition, GameEdition, GameFormat } from '@/types'
import { CONDITION_LABELS, EDITION_LABELS } from '@/types'

export const FORMAT_LABELS: Record<GameFormat, string> = {
  physical: 'Physique',
  digital: 'Numérique',
}

function Icon({ size = 14, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="block shrink-0"
    >
      {children}
    </svg>
  )
}

export function FormatIcon({ format, size }: { format: GameFormat; size?: number }) {
  if (format === 'digital') {
    // nuage + téléchargement
    return (
      <Icon size={size}>
        <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.8 8.1 4 4 0 0 1 17 18" />
        <path d="M12 11v8m-3-3 3 3 3-3" />
      </Icon>
    )
  }
  // disque
  return (
    <Icon size={size}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5" />
    </Icon>
  )
}

export function ConditionIcon({
  condition,
  size,
}: {
  condition: GameCondition
  size?: number
}) {
  switch (condition) {
    case 'complete':
      // carton + pastille cochée
      return (
        <Icon size={size}>
          <path d="M17 6.5L10 3 3 6.5 10 10l7-3.5z" />
          <path d="M3 6.5V14l7 3.5V10M17 6.5V11" />
          <circle cx="17.5" cy="17.5" r="4.5" fill="currentColor" stroke="none" />
          <path d="M15.5 17.6l1.4 1.4 2.6-2.8" style={{ stroke: 'var(--color-accent)' }} />
        </Icon>
      )
    case 'box':
      // carton
      return (
        <Icon size={size}>
          <path d="M21 7.5L12 3 3 7.5 12 12l9-4.5z" />
          <path d="M3 7.5v9L12 21l9-4.5v-9M12 12v9M7.5 5.25l9 4.5" />
        </Icon>
      )
    case 'manual':
      // livret ouvert
      return (
        <Icon size={size}>
          <path d="M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2z" />
          <path d="M12 6.5v14" />
        </Icon>
      )
    case 'loose':
      // cartouche nue
      return (
        <Icon size={size}>
          <path d="M6 3h12v13l-2 2v3H8v-3l-2-2V3z" />
          <path d="M9 6.5h6v5H9z" />
        </Icon>
      )
    default:
      return null
  }
}

/** Boîtier de jeu (bandeau en haut), coloré selon le palier de l'édition */
export function EditionIcon({ size }: { size?: number }) {
  return (
    <Icon size={size}>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M5 6.5h14M9 11.5h6M9 15h4" />
    </Icon>
  )
}

/**
 * Paliers façon trophées : Collector = or, Deluxe = argent,
 * Spéciale = bronze, Steelbook = acier. Standard n'a pas de pastille.
 */
export const EDITION_TIERS: Record<
  Exclude<GameEdition, 'standard'>,
  { tier: string; style: CSSProperties }
> = {
  collector: {
    tier: 'Or',
    style: {
      background: 'linear-gradient(135deg, #fff3b0 0%, #f5c542 45%, #b8860b 100%)',
      color: '#3d2a00',
    },
  },
  deluxe: {
    tier: 'Argent',
    style: {
      background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 45%, #7c8a9e 100%)',
      color: '#1e293b',
    },
  },
  special: {
    tier: 'Bronze',
    style: {
      background: 'linear-gradient(135deg, #f6c9a0 0%, #cd7f32 45%, #7a4419 100%)',
      color: '#2b1406',
    },
  },
  steelbook: {
    tier: 'Acier',
    style: {
      background: 'linear-gradient(135deg, #a9bccf 0%, #5b6b7d 50%, #2f3a46 100%)',
      color: '#eef4fa',
    },
  },
}

export function EditionChip({ edition }: { edition: GameEdition }) {
  if (edition === 'standard') return null
  const label = `Édition ${EDITION_LABELS[edition]}`
  return (
    <span
      title={label}
      aria-label={label}
      className={`${CHIP} ring-white/40`}
      style={EDITION_TIERS[edition].style}
    >
      <EditionIcon size={16} />
    </span>
  )
}

const CHIP =
  'inline-flex size-7 items-center justify-center rounded-md shadow-md shadow-black/50 ring-1'

/**
 * Pastilles icônes format / état / édition, posées en bas de la jaquette.
 * L'édition standard et l'état « aucun » ne sont pas affichés.
 */
export function GameCopyIcons({
  format,
  condition,
  edition,
  showCondition = true,
}: {
  format: GameFormat
  condition: GameCondition
  edition: GameEdition
  showCondition?: boolean
}) {
  const conditionShown = showCondition && format === 'physical' && condition !== 'none'

  return (
    <div className="flex flex-wrap gap-1.5">
      <span
        title={FORMAT_LABELS[format]}
        aria-label={FORMAT_LABELS[format]}
        className={`${CHIP} bg-bg text-ink ring-ink/30`}
      >
        <FormatIcon format={format} size={16} />
      </span>
      {conditionShown ? (
        <span
          title={`État : ${CONDITION_LABELS[condition]}`}
          aria-label={`État : ${CONDITION_LABELS[condition]}`}
          className={`${CHIP} bg-accent text-bg ring-white/30`}
        >
          <ConditionIcon condition={condition} size={16} />
        </span>
      ) : null}
      <EditionChip edition={edition} />
    </div>
  )
}
