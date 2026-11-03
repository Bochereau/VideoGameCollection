export const MAX_RATING = 10

/**
 * Saisie utilisateur → note (0 à 10, une décimale).
 * Accepte la virgule ou le point. null = champ vide ; undefined = invalide.
 */
export function parseRatingInput(raw: string): number | null | undefined {
  const value = raw.trim().replace(',', '.')
  if (!value) return null
  if (!/^\d{1,2}(\.\d)?$/.test(value)) return undefined
  const n = Number(value)
  if (n < 0 || n > MAX_RATING) return undefined
  return Math.round(n * 10) / 10
}

/** 8.5 → « 8,5 » ; 7 → « 7,0 » */
export function formatRating(rating: number): string {
  return rating.toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

/** Couleur de l'anneau selon la note (même registre que les statuts) */
export function ratingColorClass(rating: number | null): string {
  if (rating == null) return 'text-ink-muted'
  if (rating >= 8) return 'text-emerald-500'
  if (rating >= 6) return 'text-sky-500'
  if (rating >= 4) return 'text-orange-500'
  return 'text-red-500'
}

/** Pastille des séparateurs de tranche (tri par note) */
export function ratingDotClass(rating: number | null): string {
  if (rating == null) return 'bg-ink-muted'
  if (rating >= 8) return 'bg-emerald-500'
  if (rating >= 6) return 'bg-sky-500'
  if (rating >= 4) return 'bg-orange-500'
  return 'bg-red-500'
}
