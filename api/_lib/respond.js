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
const EDITIONS = new Set(['standard', 'special', 'collector'])

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

export function serializeGame(doc) {
  const format = doc.format === 'digital' ? 'digital' : 'physical'
  const condition = format === 'physical' ? resolveCondition(doc) : 'none'
  return {
    id: String(doc._id),
    name: doc.name,
    hardware: doc.hardware,
    developer: doc.developer ?? '',
    editor: doc.editor ?? '',
    release: doc.release ?? null,
    finished: Boolean(doc.finished),
    wishlist: Boolean(doc.wishlist),
    cover: doc.cover ?? null,
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
    createdAt: doc.createdAt,
  }
}
