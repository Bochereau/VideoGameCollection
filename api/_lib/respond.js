export function json(res, status, body) {
  res.status(status).json(body)
}

export function errorResponse(res, err) {
  const status = typeof err?.status === 'number' ? err.status : 500
  const message = err instanceof Error ? err.message : 'Internal server error'
  console.error('API error:', message)
  json(res, status, { error: message })
}

export function serializeGame(doc) {
  return {
    id: String(doc._id),
    name: doc.name,
    hardware: doc.hardware,
    developer: doc.developer ?? '',
    editor: doc.editor ?? '',
    release: doc.release ?? null,
    finished: Boolean(doc.finished),
    wishlist: Boolean(doc.wishlist),
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
