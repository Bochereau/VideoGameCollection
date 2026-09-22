export function json(res, status, body) {
  res.status(status).json(body)
}

export function errorResponse(res, err) {
  const status = typeof err?.status === 'number' ? err.status : 500
  const message = err instanceof Error ? err.message : 'Internal server error'
  console.error('API error:', message)
  json(res, status, { error: message })
}

const CONDITIONS = new Set(['complete', 'box', 'manual', 'loose', 'none'])
const EDITIONS = new Set(['standard', 'steelbook', 'special', 'deluxe', 'collector'])
export const STATUSES = new Set([
  'todo',
  'playing',
  'paused',
  'finished',
  'abandoned',
])

export function resolveCondition(doc) {
  if (CONDITIONS.has(doc.condition)) return doc.condition
  // Legacy booleans from earlier iteration
  const box = Boolean(doc.hasBox)
  const manual = Boolean(doc.hasManual)
  if (box && manual) return 'complete'
  if (box) return 'box'
  if (manual) return 'manual'
  return 'none'
}

export function resolveEdition(doc) {
  if (EDITIONS.has(doc.edition)) return doc.edition
  if (Boolean(doc.isCollector)) return 'collector'
  return 'standard'
}

export function resolveStatus(doc) {
  if (STATUSES.has(doc.status)) return doc.status
  // Legacy boolean finished
  return doc.finished === true || doc.finished === 'true' ? 'finished' : 'todo'
}

export function resolvePriority(doc, status, wishlist) {
  const raw = Number(doc.priority)
  if (Number.isInteger(raw) && raw >= 1 && raw <= 5) {
    return raw
  }
  // Default medium when priority applies
  if (wishlist || status === 'todo') return 3
  return null
}

export function serializeGame(doc) {
  const format = doc.format === 'digital' ? 'digital' : 'physical'
  const condition = format === 'physical' ? resolveCondition(doc) : 'none'
  const wishlist = doc.wishlist === true || doc.wishlist === 'true'
  const status = resolveStatus(doc)
  const priority = resolvePriority(doc, status, wishlist)
  const favorite =
    !wishlist &&
    status === 'finished' &&
    (doc.favorite === true || doc.favorite === 'true')

  return {
    id: String(doc._id),
    name: doc.name,
    hardware: doc.hardware,
    developer: doc.developer ?? '',
    editor: doc.editor ?? '',
    release: doc.release ?? null,
    status,
    priority,
    wishlist,
    favorite,
    cover: doc.cover ?? null,
    igdbId: doc.igdbId ?? null,
    rawgId: doc.rawgId ?? null,
    format,
    condition,
    edition: resolveEdition(doc),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export function serializeConsole(doc, count = 0) {
  return {
    id: String(doc._id),
    name: doc.name,
    count,
    logo: doc.logo || null,
    igdbId: doc.igdbId ?? null,
    createdAt: doc.createdAt,
  }
}

export function serializeTopEntry(entry) {
  return {
    rank: Number(entry.rank),
    gameId: entry.gameId ? String(entry.gameId) : null,
    name: entry.name ?? '',
    cover: entry.cover ?? null,
    release: entry.release ?? null,
    igdbId: entry.igdbId ?? null,
    rawgId: entry.rawgId ?? null,
  }
}

export function serializeTop(doc, { summary = false } = {}) {
  const entries = Array.isArray(doc.entries) ? doc.entries : []
  const size = Number(doc.size) || 10
  const columns = Number(doc.columnsPerRow)
  const columnsPerRow =
    columns === 5 || columns === 10 || columns === 15 || columns === 20
      ? columns
      : size >= 80
        ? 20
        : size >= 30
          ? 15
          : size >= 15
            ? 10
            : 5
  const base = {
    id: String(doc._id),
    name: doc.name,
    size,
    columnsPerRow,
    filledCount: entries.length,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
  if (summary) return base
  return {
    ...base,
    entries: entries.map(serializeTopEntry),
  }
}
