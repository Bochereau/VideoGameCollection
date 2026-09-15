import type { TopEntry } from '@/types'

/**
 * Move entry from fromRank to toRank, shifting the in-between ranks
 * (insert, not swap). Empty slots participate in the shift.
 */
export function reorderSlots(
  size: number,
  entries: TopEntry[],
  fromRank: number,
  toRank: number,
): TopEntry[] {
  if (fromRank === toRank) return entries
  const slots: (TopEntry | null)[] = Array.from({ length: size }, () => null)
  for (const entry of entries) {
    if (entry.rank >= 1 && entry.rank <= size) {
      slots[entry.rank - 1] = { ...entry }
    }
  }

  const fromIdx = fromRank - 1
  const toIdx = toRank - 1
  if (fromIdx < 0 || fromIdx >= size || toIdx < 0 || toIdx >= size) {
    return entries
  }

  const [moving] = slots.splice(fromIdx, 1)
  if (!moving) return entries
  slots.splice(toIdx, 0, moving)

  return slots
    .map((entry, idx) =>
      entry
        ? {
            ...entry,
            rank: idx + 1,
          }
        : null,
    )
    .filter((e): e is TopEntry => e !== null)
}
