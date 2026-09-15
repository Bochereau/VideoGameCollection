import type { TopEntry } from '@/types'

/** Swap entry from fromRank into toRank (works with empty targets). */
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
  const moving = slots[fromIdx]
  if (!moving) return entries

  slots[fromIdx] = slots[toIdx]
  slots[toIdx] = moving

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
