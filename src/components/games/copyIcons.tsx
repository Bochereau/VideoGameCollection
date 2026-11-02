import type { ReactNode } from 'react'
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
      // boîtier + coche
      return (
        <Icon size={size}>
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M9.5 12.5l2 2 3.5-4" />
        </Icon>
      )
    case 'box':
      // boîtier seul
      return (
        <Icon size={size}>
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M8.5 3v18" />
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

export function EditionIcon({ edition, size }: { edition: GameEdition; size?: number }) {
  switch (edition) {
    case 'steelbook':
      // boîtier métal avec reflets
      return (
        <Icon size={size}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M10 6.5l-2 3M15 6.5l-6 9" />
        </Icon>
      )
    case 'special':
      // étoile
      return (
        <Icon size={size}>
          <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
        </Icon>
      )
    case 'deluxe':
      // diamant
      return (
        <Icon size={size}>
          <path d="M3 9l3-5h12l3 5-9 11z" />
          <path d="M3 9h18M9.5 4L12 9l2.5-5M12 9v11" />
        </Icon>
      )
    case 'collector':
      // couronne
      return (
        <Icon size={size}>
          <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
        </Icon>
      )
    default:
      return null
  }
}

const CHIP = 'inline-flex size-6 items-center justify-center rounded'

/**
 * Pastilles icônes format / état / édition.
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
  const editionShown = edition !== 'standard'

  return (
    <div className="flex flex-wrap gap-1">
      <span
        title={FORMAT_LABELS[format]}
        aria-label={FORMAT_LABELS[format]}
        className={`${CHIP} bg-bg/70 text-ink-muted`}
      >
        <FormatIcon format={format} />
      </span>
      {conditionShown ? (
        <span
          title={`État : ${CONDITION_LABELS[condition]}`}
          aria-label={`État : ${CONDITION_LABELS[condition]}`}
          className={`${CHIP} bg-accent-soft text-accent`}
        >
          <ConditionIcon condition={condition} />
        </span>
      ) : null}
      {editionShown ? (
        <span
          title={`Édition ${EDITION_LABELS[edition]}`}
          aria-label={`Édition ${EDITION_LABELS[edition]}`}
          className={`${CHIP} bg-amber/20 text-amber`}
        >
          <EditionIcon edition={edition} />
        </span>
      ) : null}
    </div>
  )
}
